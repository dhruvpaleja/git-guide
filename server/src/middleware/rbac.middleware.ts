// ---------------------------------------------------------------------------
// RBAC Middleware - Role-based access control
// ---------------------------------------------------------------------------

import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './auth.middleware.js';
import { ErrorCode } from '../lib/errors.js';
import type { ServerRole } from '../shared/contracts/auth.contracts.js';
import { sendError } from '../lib/response.js';

/**
 * Middleware factory that restricts access to specific roles.
 *
 * Usage:
 *   router.get('/admin/users', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), handler);
 */
export function requireRole(...allowedRoles: ServerRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth?.role) {
      sendError(res, 401, ErrorCode.UNAUTHORIZED, 'Authentication required');
      return;
    }

    const userRole = req.auth.role.toUpperCase() as ServerRole;

    if (!allowedRoles.includes(userRole)) {
      sendError(res, 403, ErrorCode.FORBIDDEN, 'Insufficient permissions');
      return;
    }

    next();
  };
}

/**
 * Middleware that ensures the authenticated user can only access their own resources.
 * Checks req.params[paramName] against req.auth.userId.
 *
 * Usage:
 *   router.get('/users/:userId/profile', requireAuth, requireOwnership('userId'), handler);
 */
export function requireOwnership(paramName = 'userId') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth?.userId) {
      sendError(res, 401, ErrorCode.UNAUTHORIZED, 'Authentication required');
      return;
    }

    const resourceOwnerId = req.params[paramName];

    // Allow admins to access any resource.
    const adminRoles: ServerRole[] = ['ADMIN', 'SUPER_ADMIN'];
    const userRole = req.auth.role.toUpperCase() as ServerRole;

    if (resourceOwnerId !== req.auth.userId && !adminRoles.includes(userRole)) {
      sendError(res, 403, ErrorCode.FORBIDDEN, 'Access denied to this resource');
      return;
    }

    next();
  };
}
