// ---------------------------------------------------------------------------
// Request Context Middleware - Correlation IDs, timing, IP hashing
// ---------------------------------------------------------------------------

import type { Request, Response, NextFunction } from 'express';
import { randomUUID, createHash } from 'crypto';
import { logger } from '../lib/logger.js';

const REQUEST_ID_HEADER = 'x-request-id';

function requestIdFromHeader(headerValue: string | string[] | undefined): string | undefined {
  if (typeof headerValue === 'string' && headerValue.trim()) {
    return headerValue.trim();
  }
  if (Array.isArray(headerValue) && headerValue.length > 0) {
    const first = headerValue[0];
    return typeof first === 'string' && first.trim() ? first.trim() : undefined;
  }
  return undefined;
}

/**
 * Read request ID from request context if present.
 */
export function getRequestId(req: Request): string | undefined {
  return req.requestId;
}

/**
 * Attaches a unique request ID, start timestamp, and hashed IP to every request.
 * The request ID is returned in the X-Request-ID response header for client-side tracing.
 */
export function requestContext(req: Request, res: Response, next: NextFunction): void {
  // Use existing X-Request-ID from gateway/load balancer, or generate one.
  const requestId = requestIdFromHeader(req.headers[REQUEST_ID_HEADER]) ?? randomUUID();
  const startTime = Date.now();

  req.requestId = requestId;
  (req as Request & { startTime?: number }).startTime = startTime;
  (req as Request & { ipHash?: string }).ipHash = hashIp(req.ip || req.socket.remoteAddress || 'unknown');

  // Set response header for client-side correlation.
  res.setHeader('X-Request-ID', requestId);

  logger.info('request_start', {
    requestId,
    method: req.method,
    path: req.originalUrl,
    userAgent: req.headers['user-agent']?.substring(0, 200),
  });

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
