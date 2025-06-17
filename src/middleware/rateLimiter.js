"use strict";
/**
 * 🚦 Advanced Rate Limiting Middleware
 *
 * Multi-tier rate limiting system with:
 * - Different limits for different endpoint types
 * - API key-based rate limit increases
 * - IP-based and user-based limiting
 * - Sliding window implementation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitInfo = exports.rateLimiter = exports.globalRateLimit = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const environment_1 = require("../config/environment");
const logger_1 = require("../utils/logger");
const errorHandler_1 = require("./errorHandler");
// Custom key generator that considers API keys
const keyGenerator = (req) => {
    const apiKey = req.headers['x-api-key'];
    const userAgent = req.headers['user-agent'] || 'unknown';
    if (apiKey) {
        // Hash the API key for privacy in logs
        const hashedKey = Buffer.from(apiKey).toString('base64').substring(0, 8);
        return `api_${hashedKey}`;
    }
    // Fall back to IP-based limiting
    return `ip_${req.ip}`;
};
// Custom rate limit handler
const rateLimitHandler = (req, res) => {
    const resetTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    logger_1.logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
        method: req.method,
        resetTime,
    });
    const error = new errorHandler_1.RateLimitError();
    res.status(429).json({
        success: false,
        error: error.message,
        code: error.code,
        retryAfter: 900, // 15 minutes in seconds
        resetTime: resetTime.toISOString(),
        limits: {
            general: 'Upgrade to API key for higher limits',
            contact: 'Contact support for enterprise limits',
        },
        timestamp: new Date().toISOString(),
    });
};
// Skip rate limiting for certain conditions
const skipSuccessfulRequests = (req, res) => {
    // Skip counting successful responses to health endpoints
    if (req.path.startsWith('/health') && res.statusCode < 400) {
        return true;
    }
    return false;
};
// Different rate limiters for different use cases
// Global rate limiter (very permissive)
exports.globalRateLimit = (0, express_rate_limit_1.default)({
    windowMs: environment_1.config.rateLimit.global.windowMs,
    max: (req) => {
        const apiKey = req.headers['x-api-key'];
        // API key users get 5x the limit
        return apiKey ? environment_1.config.rateLimit.global.max * 5 : environment_1.config.rateLimit.global.max;
    },
    keyGenerator,
    handler: rateLimitHandler,
    skip: skipSuccessfulRequests,
    standardHeaders: true,
    legacyHeaders: false,
});
// API-specific rate limiter
const apiRateLimit = (0, express_rate_limit_1.default)({
    windowMs: environment_1.config.rateLimit.api.windowMs,
    max: (req) => {
        const apiKey = req.headers['x-api-key'];
        // API key users get 3x the limit
        return apiKey ? environment_1.config.rateLimit.api.max * 3 : environment_1.config.rateLimit.api.max;
    },
    keyGenerator,
    handler: rateLimitHandler,
    skip: skipSuccessfulRequests,
    standardHeaders: true,
    legacyHeaders: false,
});
// Analytics rate limiter (more restrictive due to computational cost)
const analyticsRateLimit = (0, express_rate_limit_1.default)({
    windowMs: environment_1.config.rateLimit.analytics.windowMs,
    max: (req) => {
        const apiKey = req.headers['x-api-key'];
        // API key users get 2x the limit (analytics is expensive)
        return apiKey ? environment_1.config.rateLimit.analytics.max * 2 : environment_1.config.rateLimit.analytics.max;
    },
    keyGenerator,
    handler: (req, res) => {
        logger_1.logger.warn('Analytics rate limit exceeded', {
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            path: req.path,
            method: req.method,
        });
        res.status(429).json({
            success: false,
            error: 'Analytics rate limit exceeded',
            code: 'ANALYTICS_RATE_LIMIT_EXCEEDED',
            message: 'Analytics endpoints are computationally expensive. Please wait before making more requests.',
            retryAfter: 900,
            upgrade: 'Get an API key for higher analytics limits',
            timestamp: new Date().toISOString(),
        });
    },
    skip: skipSuccessfulRequests,
    standardHeaders: true,
    legacyHeaders: false,
});
// Match data rate limiter (moderate restriction)
const matchDataRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: (req) => {
        const apiKey = req.headers['x-api-key'];
        return apiKey ? 200 : 80; // Higher limit for match data as it's core functionality
    },
    keyGenerator,
    handler: rateLimitHandler,
    skip: skipSuccessfulRequests,
    standardHeaders: true,
    legacyHeaders: false,
});
// Documentation rate limiter (very permissive)
const docsRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // Generous limit for documentation
    keyGenerator,
    handler: rateLimitHandler,
    skipSuccessfulRequests: true, // Don't count successful doc requests
    standardHeaders: true,
    legacyHeaders: false,
});
// Export all rate limiters
exports.rateLimiter = {
    global: exports.globalRateLimit,
    api: apiRateLimit,
    analytics: analyticsRateLimit,
    matches: matchDataRateLimit,
    docs: docsRateLimit,
};
// Rate limit info middleware (adds rate limit info to responses)
const rateLimitInfo = (req, res, next) => {
    const originalSend = res.json;
    res.json = function (body) {
        // Add rate limit info to successful responses
        if (body && typeof body === 'object' && body.success !== false) {
            body.rateLimit = {
                remaining: res.getHeader('X-RateLimit-Remaining'),
                reset: res.getHeader('X-RateLimit-Reset'),
                limit: res.getHeader('X-RateLimit-Limit'),
                window: '15 minutes',
            };
        }
        return originalSend.call(this, body);
    };
    next();
};
exports.rateLimitInfo = rateLimitInfo;
exports.default = exports.rateLimiter;
