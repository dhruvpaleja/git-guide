import { Request, Response, NextFunction } from 'express';
import { createHash, randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { tokensService } from '../services/tokens.service.js';
import { AIEventLogger } from '../services/ai-event-logger.service.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { prisma } from '../lib/prisma.js';
const REFRESH_COOKIE_NAME = 'refresh_token';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const hashRefreshToken = (token: string) => createHash('sha256').update(token).digest('hex');

const toPublicUser = (user: { id: string; email: string; name: string; role: string }) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role.toLowerCase(),
});

// Ensure cookies are parsed if you use cookie-parser or manually
const setRefreshCookie = (res: Response, token: string) => {
    res.cookie(REFRESH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: REFRESH_TOKEN_TTL_MS,
        path: '/'
    });
};

const clearRefreshCookie = (res: Response) => {
    res.clearCookie(REFRESH_COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
};

const createRefreshSession = async (params: {
    userId: string;
    familyId: string;
    userAgent?: string;
    ipHash?: string;
}) => {
    const refreshToken = tokensService.generateRefreshToken(params.userId, params.familyId);
    await prisma.refreshToken.create({
        data: {
            tokenHash: hashRefreshToken(refreshToken),
            userId: params.userId,
            familyId: params.familyId,
            userAgent: params.userAgent,
            ipHash: params.ipHash,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
        },
    });
    return refreshToken;
};

export const authController = {

    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password, name } = req.body;
            const ipHash = req.ip || 'unknown'; // In real app, hash this for privacy

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                await AIEventLogger.logEvent({
                    category: 'AUTH_FAILURE',
                    action: 'REGISTER_DUPLICATE_EMAIL',
                    ipHash,
                    metadata: { emailAttempted: email }
                });

                return res.status(409).json({ success: false, error: { message: 'Email already exists' } });
            }

            // High-security password hashing
            const passwordHash = await bcrypt.hash(password, 12);

            const newUser = await prisma.user.create({
                data: { email, passwordHash, name }
            });

            await AIEventLogger.logEvent({
                userId: newUser.id,
                category: 'AUTH_SUCCESS',
                action: 'USER_REGISTERED',
                ipHash
            });

            // Generate tokens
            const accessToken = tokensService.generateAccessToken(newUser.id, newUser.role);
            const familyId = randomUUID();
            const refreshToken = await createRefreshSession({
                userId: newUser.id,
                familyId,
                ipHash,
            });

            setRefreshCookie(res, refreshToken);

            return res.status(201).json({
                success: true,
                data: {
                    user: toPublicUser(newUser),
                    accessToken
                }
            });

        } catch (error) {
            next(error);
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const ipHash = req.ip || 'unknown';
            const userAgent = req.headers['user-agent'];

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                await AIEventLogger.logEvent({ category: 'AUTH_FAILURE', action: 'LOGIN_NOT_FOUND', ipHash, metadata: { email } });
                return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
            }

            // Check account lockout
            if (user.lockedUntil && user.lockedUntil > new Date()) {
                await AIEventLogger.logEvent({ userId: user.id, category: 'SECURITY_ALERT', action: 'LOGIN_LOCKED_ACCOUNT_ATTEMPT', ipHash });
                return res.status(403).json({ success: false, error: { message: 'Account temporarily locked. Try again later.' } });
            }

            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        failedAttempts: user.failedAttempts + 1,
                        lockedUntil: user.failedAttempts + 1 >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null
                    }
                });

                await AIEventLogger.logEvent({ userId: user.id, category: 'AUTH_FAILURE', action: 'LOGIN_BAD_PASSWORD', ipHash });
                return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
            }

            // Successful login reset lockout
            await prisma.user.update({
                where: { id: user.id },
                data: { failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date() }
            });

            await AIEventLogger.logEvent({ userId: user.id, category: 'AUTH_SUCCESS', action: 'LOGIN_SUCCESS', ipHash, userAgent });

            const accessToken = tokensService.generateAccessToken(user.id, user.role);
            const familyId = randomUUID();
            const refreshToken = await createRefreshSession({
                userId: user.id,
                familyId,
                userAgent,
                ipHash,
            });

            setRefreshCookie(res, refreshToken);

            return res.status(200).json({
                success: true,
                data: {
                    user: toPublicUser(user),
                    accessToken
                }
            });

        } catch (error) {
            next(error);
        }
    },

    refresh: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
            if (!refreshToken) {
                return res.status(401).json({ success: false, error: { message: 'Refresh token missing' } });
            }

            const payload = tokensService.verifyToken<{ sub: string; familyId: string; type: string }>(refreshToken);
            if (!payload || payload.type !== 'refresh' || !payload.sub || !payload.familyId) {
                clearRefreshCookie(res);
                return res.status(401).json({ success: false, error: { message: 'Invalid refresh token' } });
            }

            const refreshTokenHash = hashRefreshToken(refreshToken);
            let dbToken = await prisma.refreshToken.findFirst({
                where: {
                    tokenHash: refreshTokenHash,
                    isRevoked: false,
                    expiresAt: { gt: new Date() },
                },
            });

            if (!dbToken) {
                const legacyCandidates = await prisma.refreshToken.findMany({
                    where: {
                        userId: payload.sub,
                        familyId: payload.familyId,
                        isRevoked: false,
                        expiresAt: { gt: new Date() },
                    },
                });

                for (const candidate of legacyCandidates) {
                    const isLegacyMatch =
                        candidate.tokenHash.length !== 64 && (await bcrypt.compare(refreshToken, candidate.tokenHash));
                    if (isLegacyMatch) {
                        dbToken = candidate;
                        break;
                    }
                }
            }

            if (!dbToken) {
                await prisma.refreshToken.updateMany({
                    where: { userId: payload.sub, familyId: payload.familyId, isRevoked: false },
                    data: { isRevoked: true },
                });
                clearRefreshCookie(res);
                return res.status(401).json({ success: false, error: { message: 'Refresh token revoked' } });
            }

            const user = await prisma.user.findUnique({ where: { id: payload.sub } });
            if (!user) {
                clearRefreshCookie(res);
                return res.status(401).json({ success: false, error: { message: 'User not found' } });
            }

            await prisma.refreshToken.update({ where: { id: dbToken.id }, data: { isRevoked: true } });

            const rotatedRefreshToken = await createRefreshSession({
                userId: user.id,
                familyId: payload.familyId,
                userAgent: req.headers['user-agent'],
                ipHash: req.ip || 'unknown',
            });

            setRefreshCookie(res, rotatedRefreshToken);

            return res.status(200).json({
                success: true,
                data: {
                    accessToken: tokensService.generateAccessToken(user.id, user.role),
                },
            });
        } catch (error) {
            next(error);
        }
    },

    logout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;

            if (refreshToken) {
                const tokenHash = hashRefreshToken(refreshToken);
                await prisma.refreshToken.updateMany({
                    where: { tokenHash, isRevoked: false },
                    data: { isRevoked: true },
                });
            }

            clearRefreshCookie(res);
            return res.status(200).json({ success: true, data: { message: 'Logged out' } });
        } catch (error) {
            next(error);
        }
    },

    me: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.auth?.userId) {
                return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
            }

            const user = await prisma.user.findUnique({
                where: { id: req.auth.userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    lastLoginAt: true,
                },
            });

            if (!user) {
                return res.status(404).json({ success: false, error: { message: 'User not found' } });
            }

            return res.status(200).json({ success: true, data: { user: toPublicUser(user) } });
        } catch (error) {
            next(error);
        }
    },
};
