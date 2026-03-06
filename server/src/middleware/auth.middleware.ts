import type { Request, Response, NextFunction } from 'express';

import { tokensService } from '../services/tokens.service.js';
import type { AccessTokenPayload, ServerRole } from '../shared/contracts/auth.contracts.js';
import { ErrorCode } from '../lib/errors.js';
import { sendError } from '../lib/response.js';

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    role: ServerRole;
  };
}

// Role hierarchy for permission checking.
const roleHierarchy: Record<ServerRole, ServerRole[]> = {
  USER: [],
  THERAPIST: ['USER'],
  ASTROLOGER: ['USER'],
  ADMIN: ['USER', 'THERAPIST', 'ASTROLOGER'],
  SUPER_ADMIN: ['USER', 'THERAPIST', 'ASTROLOGER', 'ADMIN'],
};

function hasRequiredRole(userRole: ServerRole, requiredRole: ServerRole): boolean {
  return userRole === requiredRole || roleHierarchy[userRole].includes(requiredRole);
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 401, ErrorCode.UNAUTHORIZED, 'Unauthorized');
    return;
  }

  const token = authHeader.slice(7);
  const payload = tokensService.verifyToken<AccessTokenPayload>(token);

  if (!payload?.sub || !payload.role) {
    sendError(res, 401, ErrorCode.TOKEN_INVALID, 'Invalid or expired access token');
    return;
  }

  req.auth = { userId: payload.sub, role: payload.role };
  next();
}

export function requireRole(requiredRole: ServerRole) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      sendError(res, 401, ErrorCode.UNAUTHORIZED, 'Authentication required');
      return;
    }

    if (hasRequiredRole(req.auth.role, requiredRole)) {
      next();
      return;
    }

    sendError(res, 403, ErrorCode.FORBIDDEN, 'Insufficient permissions');
  };
}

export function requireAnyRole(roles: ServerRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      sendError(res, 401, ErrorCode.UNAUTHORIZED, 'Authentication required');
      return;
    }

    const { role } = req.auth;
    const hasPermission = roles.some((requiredRole) => hasRequiredRole(role, requiredRole));

    if (hasPermission) {
      next();
      return;
    }

    sendError(res, 403, ErrorCode.FORBIDDEN, 'Insufficient permissions');
  };
}

// Resource ownership check - user can only access their own resources.
export function requireOwnership(resourceUserIdField = 'userId') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      sendError(res, 401, ErrorCode.UNAUTHORIZED, 'Authentication required');
      return;
    }

    // Admin and SUPER_ADMIN can access any resource.
    if (req.auth.role === 'ADMIN' || req.auth.role === 'SUPER_ADMIN') {
      next();
      return;
    }

    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];

    if (resourceUserId !== req.auth.userId) {
      sendError(res, 403, ErrorCode.FORBIDDEN, 'Access denied');
      return;
    }

    next();
  };
}
