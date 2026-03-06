// ---------------------------------------------------------------------------
// Security Middleware - Rate limiting tiers, CORS hardening, security headers
// ---------------------------------------------------------------------------

import type { Request, Response } from 'express';
import { rateLimit, type Options } from 'express-rate-limit';
import { ErrorCode } from '../lib/errors.js';
import { sendError } from '../lib/response.js';

function rateLimitHandler(message: string) {
  return (req: Request, res: Response): void => {
    sendError(res, 429, ErrorCode.RATE_LIMITED, message, {
      path: req.originalUrl,
      method: req.method,
    });
  };
}

function createLimiter(opts: Partial<Options> & { windowMs: number; max: number; message: string }) {
  return rateLimit({
    windowMs: opts.windowMs,
    max: opts.max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: opts.keyGenerator,
    skip: opts.skip,
    handler: rateLimitHandler(opts.message),
  });
}

// ---------------------------------------------------------------------------
// Rate Limiter Tiers
// ---------------------------------------------------------------------------

/**
 * Auth endpoints (login, register, password reset)
 * 5 requests per 15 minutes per IP
 */
export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again after 15 minutes',
});

/**
 * General API endpoints
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please slow down',
});

/**
 * Strict limiter for sensitive operations (password change, delete account, payment)
 * 3 requests per 15 minutes per IP
 */
export const strictLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Too many attempts on sensitive operations, please try again later',
});

/**
 * Sensitive operations limiter (OTP, verification)
 * 10 requests per hour per IP
 */
export const sensitiveOpsLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many verification attempts, please try again in an hour',
});

/**
 * Upload limiter
 * 20 uploads per hour per IP
 */
export const uploadLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: 'Upload limit reached, please try again later',
});

/**
 * AI/Chat limiter
 * 30 messages per 15 minutes per IP
 */
export const aiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'AI assistant rate limit reached, please wait a moment',
});
