// ---------------------------------------------------------------------------
// Request Context Middleware — Correlation IDs, timing, IP hashing
// ---------------------------------------------------------------------------

import type { Request, Response, NextFunction } from 'express';
import { randomUUID, createHash } from 'crypto';
import { logger } from '../lib/logger.js';

/**
 * Attaches a unique request ID, start timestamp, and hashed IP to every request.
 * The request ID is returned in the X-Request-ID response header for client-side tracing.
 */
export function requestContext(req: Request, res: Response, next: NextFunction): void {
  // Use existing X-Request-ID from gateway/load balancer, or generate one
  const requestId = (req.headers['x-request-id'] as string) || randomUUID();
  const startTime = Date.now();

  // Attach to request object for downstream use
  (req as unknown as Record<string, unknown>).requestId = requestId;
  (req as unknown as Record<string, unknown>).startTime = startTime;
  (req as unknown as Record<string, unknown>).ipHash = hashIp(req.ip || req.socket.remoteAddress || 'unknown');

  // Set response header for client-side correlation
  res.setHeader('X-Request-ID', requestId);

  // Log request start
  logger.info('request_start', {
    requestId,
    method: req.method,
    path: req.originalUrl,
    userAgent: req.headers['user-agent']?.substring(0, 200),
  });

  // Log response completion
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    logger[level]('request_end', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      contentLength: res.getHeader('content-length'),
    });
  });

  next();
}

/**
 * Hash IP for privacy-preserving logging (GDPR/DPDPA compliant)
 */
function hashIp(ip: string): string {
  return createHash('sha256').update(ip + (process.env.IP_SALT || 'soul-yatri-salt')).digest('hex').substring(0, 16);
}
