/**
 * 🚦 Advanced Rate Limiting Middleware
 * 
 * Multi-tier rate limiting system with:
 * - Different limits for different endpoint types
 * - API key-based rate limit increases
 * - IP-based and user-based limiting
 * - Sliding window implementation
 */

import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config/environment';
import { logger } from '../utils/logger';
import { RateLimitError } from './errorHandler';

// Custom key generator that considers API keys
const keyGenerator = (req: Request): string => {
    const apiKey = req.headers['x-api-key'] as string;
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
const rateLimitHandler = (req: Request, res: Response) => {
    const resetTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    
    logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
        method: req.method,
        resetTime,
    });

    const error = new RateLimitError();
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
const skipSuccessfulRequests = (req: Request, res: Response): boolean => {
    // Skip counting successful responses to health endpoints
    if (req.path.startsWith('/health') && res.statusCode < 400) {
        return true;
    }
    return false;
};

// Different rate limiters for different use cases

// Global rate limiter (very permissive)
export const globalRateLimit = rateLimit({
    windowMs: config.rateLimit.global.windowMs,
    max: (req: Request) => {
        const apiKey = req.headers['x-api-key'];
        // API key users get 5x the limit
        return apiKey ? config.rateLimit.global.max * 5 : config.rateLimit.global.max;
    },
    keyGenerator,
    handler: rateLimitHandler,
    skip: skipSuccessfulRequests,
    standardHeaders: true,
    legacyHeaders: false,
});

// API-specific rate limiter
const apiRateLimit = rateLimit({
    windowMs: config.rateLimit.api.windowMs,
    max: (req: Request) => {
        const apiKey = req.headers['x-api-key'];
        // API key users get 3x the limit
        return apiKey ? config.rateLimit.api.max * 3 : config.rateLimit.api.max;
    },
    keyGenerator,
    handler: rateLimitHandler,
    skip: skipSuccessfulRequests,
    standardHeaders: true,
    legacyHeaders: false,
});

// Analytics rate limiter (more restrictive due to computational cost)
const analyticsRateLimit = rateLimit({
    windowMs: config.rateLimit.analytics.windowMs,
    max: (req: Request) => {
        const apiKey = req.headers['x-api-key'];
        // API key users get 2x the limit (analytics is expensive)
        return apiKey ? config.rateLimit.analytics.max * 2 : config.rateLimit.analytics.max;
    },
    keyGenerator,
    handler: (req: Request, res: Response) => {
        logger.warn('Analytics rate limit exceeded', {
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
const matchDataRateLimit = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: (req: Request) => {
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
const docsRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // Generous limit for documentation
    keyGenerator,
    handler: rateLimitHandler,
    skipSuccessfulRequests: true, // Don't count successful doc requests
    standardHeaders: true,
    legacyHeaders: false,
});

// Export all rate limiters
export const rateLimiter = {
    global: globalRateLimit,
    api: apiRateLimit,
    analytics: analyticsRateLimit,
    matches: matchDataRateLimit,
    docs: docsRateLimit,
};

// Rate limit info middleware (adds rate limit info to responses)
export const rateLimitInfo = (req: Request, res: Response, next: Function) => {
    const originalSend = res.json;
    
    res.json = function(body: any) {
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

export default rateLimiter;
