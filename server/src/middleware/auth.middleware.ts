import type { Request, Response, NextFunction } from 'express';

import { tokensService } from '../services/tokens.service.js';

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    role: string;
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
    return;
  }

  const token = authHeader.slice(7);
  const payload = tokensService.verifyToken<{ sub: string; role: string }>(token);

  if (!payload?.sub) {
    res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
    return;
  }

  req.auth = { userId: payload.sub, role: payload.role };
  next();
}
