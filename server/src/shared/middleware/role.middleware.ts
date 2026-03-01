import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware.js';

export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({ success: false, error: { message: 'Authentication required' } });
    }
    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({ success: false, error: { message: 'Insufficient permissions' } });
    }
    next();
  };
};
