import { rateLimit } from 'express-rate-limit';

/**
 * Strict Rate Limiter for Authentication Endpoints
 * Limits each IP to 5 requests per 15 minutes for /login or /register
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        error: {
            message: 'Too many authentication attempts from this IP, please try again after 15 minutes'
        }
    }
});
