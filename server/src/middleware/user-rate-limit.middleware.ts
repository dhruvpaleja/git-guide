import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from './auth.middleware.js';
import { ErrorCode } from '../lib/errors.js';
import { sendError } from '../lib/response.js';

// In-memory store for user rate limits (in production, use Redis).
const userLimits = new Map<string, { count: number; resetTime: number }>();

// User-based rate limiter.
function createUserRateLimiter(opts: {
  windowMs: number;
  max: number;
  message: string;
  skipSuccessfulRequests?: boolean;
}) {
  return (req: Request, res: Response, next: () => void) => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.auth?.userId;
    const ip = req.ip || req.connection.remoteAddress || 'unknown';

    // Use user ID if authenticated, otherwise fall back to IP.
    const key = userId ? `user:${userId}` : `ip:${ip}`;
    const now = Date.now();

    // Get current limit data.
    let limitData = userLimits.get(key);

    // Reset if window expired.
    if (!limitData || limitData.resetTime <= now) {
      limitData = { count: 0, resetTime: now + opts.windowMs };
      userLimits.set(key, limitData);
    }

    // Increment counter.
    limitData.count++;

    // Check if limit exceeded.
    if (limitData.count > opts.max) {
      sendError(res, 429, ErrorCode.RATE_LIMITED, opts.message, {
        key,
        limit: opts.max,
        windowMs: opts.windowMs,
      });
      return;
    }

    // Set rate limit headers.
    res.set({
      'RateLimit-Limit': String(opts.max),
      'RateLimit-Remaining': String(Math.max(0, opts.max - limitData.count)),
      'RateLimit-Reset': String(Math.ceil(limitData.resetTime / 1000)),
    });

    next();
  };
}

// User-specific rate limiters.
export const userAuthLimiter = createUserRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per user per 15 minutes
  message: 'Too many authentication attempts, please try again later',
});

export const userApiLimiter = createUserRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per user per 15 minutes
  message: 'Too many requests, please slow down',
});

export const userUploadLimiter = createUserRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per user per hour
  message: 'Upload limit reached, please try again later',
});

export const userAiLimiter = createUserRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 AI requests per user per 15 minutes
  message: 'AI assistant rate limit reached, please wait a moment',
});

// Role-based rate limiting (higher limits for premium roles).
export const createRoleBasedLimiter = (baseLimits: { [key: string]: number }) => {
  return (req: Request, _res: Response, next: () => void) => {
    const authReq = req as AuthenticatedRequest;
    const userRole = authReq.auth?.role || 'USER';

    // Get multiplier based on role.
    const multipliers = {
      USER: 1,
      THERAPIST: 2,
      ASTROLOGER: 2,
      ADMIN: 5,
      SUPER_ADMIN: 10,
    };

    const multiplier = multipliers[userRole as keyof typeof multipliers] || 1;

    // Apply role-based limits.
    const adjustedLimits = Object.entries(baseLimits).reduce((acc, [key, value]) => {
      acc[key] = value * multiplier;
      return acc;
    }, {} as typeof baseLimits);

    // Store adjusted limits for use by the actual limiter.
    (req as Request & { roleBasedLimits?: typeof baseLimits }).roleBasedLimits = adjustedLimits;
    next();
  };
};

// Cleanup expired entries periodically.
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of userLimits.entries()) {
    if (data.resetTime <= now) {
      userLimits.delete(key);
    }
  }
}, 5 * 60 * 1000); // Cleanup every 5 minutes
