import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import type { AccessTokenPayload, RefreshTokenPayload, ServerRole } from '../shared/contracts/auth.contracts.js';

export type { AccessTokenPayload, RefreshTokenPayload, ServerRole } from '../shared/contracts/auth.contracts.js';

export const tokensService = {
    generateAccessToken: (userId: string, role: ServerRole) => {
        const payload: AccessTokenPayload = {
            sub: userId,
            role,
            jti: crypto.randomUUID(),
            iss: config.jwt.issuer,
            aud: config.jwt.audience,
        };
        return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwt.accessExpiresIn } as jwt.SignOptions);
    },

    generateRefreshToken: (userId: string, familyId: string) => {
        const payload: RefreshTokenPayload = {
            sub: userId,
            familyId,
            type: 'refresh',
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
