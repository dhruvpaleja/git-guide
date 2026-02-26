import type { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = err.status ?? 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    error: { message },
  });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ success: false, error: { message: 'Route not found' } });
}
