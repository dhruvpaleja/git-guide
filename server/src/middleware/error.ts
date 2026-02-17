import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = 'status' in err ? (err as { status: number }).status : 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    error: { message, ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }) },
  });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ success: false, error: { message: 'Route not found' } });
}
