// ---------------------------------------------------------------------------
// RBAC Middleware — Role-based access control
// ---------------------------------------------------------------------------

import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './auth.middleware.js';
import { ErrorCode } from '../lib/errors.js';
import type { ServerRole } from '../shared/contracts/auth.contracts.js';

/**
 * Middleware factory that restricts access to specific roles.
 *
 * Usage:
 *   router.get('/admin/users', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), handler);
 */
export function requireRole(...allowedRoles: ServerRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth?.role) {
      res.status(401).json({
        success: false,
        error: { code: ErrorCode.UNAUTHORIZED, message: 'Authentication required' },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const userRole = req.auth.role.toUpperCase() as ServerRole;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        error: {
          code: ErrorCode.FORBIDDEN,
          message: 'Insufficient permissions',
        },
        timestamp: new Date().toISOString(),
      });
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
      res.status(401).json({
        success: false,
        error: { code: ErrorCode.UNAUTHORIZED, message: 'Authentication required' },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const resourceOwnerId = req.params[paramName];

    // Allow admins to access any resource
    const adminRoles: ServerRole[] = ['ADMIN', 'SUPER_ADMIN'];
    const userRole = req.auth.role.toUpperCase() as ServerRole;

    if (resourceOwnerId !== req.auth.userId && !adminRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        error: { code: ErrorCode.FORBIDDEN, message: 'Access denied to this resource' },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
}
