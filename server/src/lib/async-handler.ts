// ---------------------------------------------------------------------------
// Async Handler — Eliminates try/catch boilerplate in route handlers
// ---------------------------------------------------------------------------

import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler so thrown errors are forwarded to Express error middleware.
 *
 * Usage:
 *   router.get('/users', asyncHandler(async (req, res) => {
 *     const users = await getUsers();
 *     res.json({ success: true, data: users });
 *   }));
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
