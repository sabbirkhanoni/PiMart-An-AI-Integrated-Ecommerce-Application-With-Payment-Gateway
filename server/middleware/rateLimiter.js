import rateLimit from 'express-rate-limit';

/**
 * General API Rate Limiter
 * Allows up to 600 requests per 15-minute window for standard API endpoints.
 */
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 600, // 600 requests per 15 mins per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests from this IP, please try again after a few minutes.",
        error: true,
        success: false
    }
});

/**
 * Strict Rate Limiter for Authentication and Sensitive Endpoints
 * Limits brute-force login, register, and password-reset attempts.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per 15 mins per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many authentication attempts from this IP. Please try again after 15 minutes.",
        error: true,
        success: false
    }
});
