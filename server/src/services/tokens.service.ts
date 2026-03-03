import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

// Define Role locally since Prisma import is failing
type Role = 'USER' | 'THERAPIST' | 'ASTROLOGER' | 'ADMIN' | 'SUPER_ADMIN';

export interface AccessTokenPayload {
    sub: string;
    role: Role;
    jti: string; // JWT ID for token tracking and revocation
    iat?: number;
    exp?: number;
    iss?: string; // Issuer
    aud?: string; // Audience
}

export interface RefreshTokenPayload {
    sub: string;
    familyId: string;
    type: 'refresh';
    jti: string;
    iat?: number;
    exp?: number;
}

export const tokensService = {
    generateAccessToken: (userId: string, role: Role) => {
        const payload = {
            sub: userId,
            role,
            jti: crypto.randomUUID(),
            iss: config.jwt.issuer,
            aud: config.jwt.audience,
        };
        return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwt.accessExpiresIn } as jwt.SignOptions);
    },

    generateRefreshToken: (userId: string, familyId: string) => {
        const payload = {
            sub: userId,
            familyId,
            type: 'refresh' as const,
            jti: crypto.randomUUID(),
            iss: config.jwt.issuer,
            aud: config.jwt.audience,
        };
        return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions);
    },

    verifyToken: <T extends object>(token: string): T | null => {
        try {
            const decoded = jwt.verify(token, config.jwtSecret, {
                issuer: config.jwt.issuer,
                audience: config.jwt.audience,
            } as jwt.VerifyOptions) as T;
            return decoded;
        } catch {
            return null;
        }
    }
}
