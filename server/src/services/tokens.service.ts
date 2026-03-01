import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';
import { config } from '../config/index.js';

export interface AccessTokenPayload {
    sub: string;
    role: Role;
    iat?: number;
    exp?: number;
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
        return jwt.sign({ sub: userId, role }, config.jwtSecret, { expiresIn: '15m' });
    },

    generateRefreshToken: (userId: string, familyId: string) => {
        return jwt.sign({ sub: userId, familyId, type: 'refresh', jti: crypto.randomUUID() }, config.jwtSecret, { expiresIn: '7d' });
    },

    verifyToken: <T extends object>(token: string): T | null => {
        try {
            return jwt.verify(token, config.jwtSecret) as T;
        } catch {
            return null;
        }
    }
}
