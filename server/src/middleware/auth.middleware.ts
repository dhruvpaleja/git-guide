import type { Request, Response, NextFunction } from 'express';

import { tokensService } from '../services/tokens.service.js';
import type { AccessTokenPayload, ServerRole } from '../shared/contracts/auth.contracts.js';

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    role: ServerRole;
  };
}

// Role hierarchy for permission checking
const roleHierarchy: Record<ServerRole, ServerRole[]> = {
  USER: [],
  THERAPIST: ['USER'],
  ASTROLOGER: ['USER'],
  ADMIN: ['USER', 'THERAPIST', 'ASTROLOGER'],
  SUPER_ADMIN: ['USER', 'THERAPIST', 'ASTROLOGER', 'ADMIN'],
};

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
    return;
  }

  const token = authHeader.slice(7);
  const payload = tokensService.verifyToken<AccessTokenPayload>(token);

  if (!payload?.sub || !payload.role) {
    res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
    return;
  }

  req.auth = { userId: payload.sub, role: payload.role };
  next();
}

export function requireRole(requiredRole: ServerRole) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({ success: false, error: { message: 'Authentication required' } });
      return;
    }

    const userRole = req.auth.role;
    
    // Check if user has the required role or higher
    if (userRole === requiredRole || roleHierarchy[userRole].includes(requiredRole)) {
      next();
      return;
    }

    res.status(403).json({ success: false, error: { message: 'Insufficient permissions' } });
  };
}

export function requireAnyRole(roles: ServerRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({ success: false, error: { message: 'Authentication required' } });
      return;
    }

    const userRole = req.auth.role;
    
    // Check if user has any of the required roles or higher
    const hasPermission = roles.some(requiredRole => 
      userRole === requiredRole || roleHierarchy[userRole].includes(requiredRole)
    );

    if (hasPermission) {
      next();
      return;
    }

    res.status(403).json({ success: false, error: { message: 'Insufficient permissions' } });
  };
}

// Resource ownership check - user can only access their own resources
export function requireOwnership(resourceUserIdField = 'userId') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({ success: false, error: { message: 'Authentication required' } });
      return;
    }

    // Admin and SUPER_ADMIN can access any resource
    if (req.auth.role === 'ADMIN' || req.auth.role === 'SUPER_ADMIN') {
      next();
      return;
    }

    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId !== req.auth.userId) {
      res.status(403).json({ success: false, error: { message: 'Access denied' } });
      return;
    }

    next();
  };
}
