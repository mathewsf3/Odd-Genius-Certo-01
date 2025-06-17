"use strict";
/**
 * 🔐 Authentication & Authorization Middleware
 *
 * Flexible authentication system supporting:
 * - Optional API key authentication
 * - JWT token validation
 * - Rate limit adjustments based on auth status
 * - Security logging and monitoring
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRateLimitMultiplier = exports.authAwareRateLimitKeyGenerator = exports.trackApiUsage = exports.requirePremium = exports.requireAdmin = exports.requireTier = exports.requireRole = exports.validateApiKey = exports.requireAuth = exports.optionalAuth = void 0;
// @ts-ignore - jsonwebtoken types not available
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../config/environment");
const logger_1 = require("../utils/logger");
const errorHandler_1 = require("./errorHandler");
// API Key validation (simple implementation - in production use database)
const validateApiKeyInternal = (apiKey) => {
    // In production, this would check against a database
    const validApiKeys = {
        'demo_key_123': {
            id: 'demo_user',
            email: 'demo@example.com',
            tier: 'free',
            rateLimit: {
                multiplier: 2,
                dailyLimit: 10000,
            },
        },
        'premium_key_456': {
            id: 'premium_user',
            email: 'premium@example.com',
            tier: 'premium',
            rateLimit: {
                multiplier: 5,
                dailyLimit: 100000,
            },
        },
    };
    const userData = validApiKeys[apiKey];
    return {
        valid: !!userData,
        user: userData,
    };
};
// JWT validation
const validateJWT = (token) => {
    try {
        if (!environment_1.config.security.jwtSecret) {
            return { valid: false };
        }
        const decoded = jsonwebtoken_1.default.verify(token, environment_1.config.security.jwtSecret);
        return {
            valid: true,
            user: {
                id: decoded.id || decoded.sub,
                email: decoded.email,
                role: decoded.role,
                tier: decoded.tier || 'free',
            },
        };
    }
    catch (error) {
        logger_1.logger.warn('JWT validation failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            token: token.substring(0, 20) + '...',
        });
        return { valid: false };
    }
};
// Optional authentication middleware - allows both authenticated and unauthenticated requests
const optionalAuth = (req, res, next) => {
    var _a, _b, _c;
    req.isAuthenticated = false;
    req.authMethod = 'none';
    // Check for API key in headers
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
        const apiKeyResult = validateApiKeyInternal(apiKey);
        if (apiKeyResult.valid) {
            req.user = Object.assign(Object.assign({}, apiKeyResult.user), { apiKey });
            req.isAuthenticated = true;
            req.authMethod = 'api_key';
            logger_1.logger.debug('API key authentication successful', {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                tier: (_b = req.user) === null || _b === void 0 ? void 0 : _b.tier,
                ip: req.ip,
            });
        }
        else {
            logger_1.logger.warn('Invalid API key used', {
                apiKey: apiKey.substring(0, 8) + '***',
                ip: req.ip,
                userAgent: req.headers['user-agent'],
            });
        }
    }
    // Check for JWT token if no valid API key
    if (!req.isAuthenticated) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const jwtResult = validateJWT(token);
            if (jwtResult.valid) {
                req.user = jwtResult.user;
                req.isAuthenticated = true;
                req.authMethod = 'jwt';
                logger_1.logger.debug('JWT authentication successful', {
                    userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id,
                    ip: req.ip,
                });
            }
            else {
                logger_1.logger.warn('Invalid JWT token used', {
                    ip: req.ip,
                    userAgent: req.headers['user-agent'],
                });
            }
        }
    }
    next();
};
exports.optionalAuth = optionalAuth;
// Required authentication middleware - requires valid authentication
const requireAuth = (req, res, next) => {
    (0, exports.optionalAuth)(req, res, (error) => {
        if (error) {
            return next(error);
        }
        if (!req.isAuthenticated || !req.user) {
            logger_1.logger.securityEvent('unauthorized_access_attempt', 'medium', {
                ip: req.ip,
                path: req.path,
                method: req.method,
                userAgent: req.headers['user-agent'],
            });
            return next(new errorHandler_1.UnauthorizedError('Authentication required'));
        }
        next();
    });
};
exports.requireAuth = requireAuth;
// API key validation middleware (backwards compatibility)
const validateApiKey = (req, res, next) => {
    (0, exports.optionalAuth)(req, res, next);
};
exports.validateApiKey = validateApiKey;
// Role-based authorization middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.isAuthenticated || !req.user) {
            return next(new errorHandler_1.UnauthorizedError('Authentication required'));
        }
        const userRole = req.user.role || 'user';
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        if (!allowedRoles.includes(userRole)) {
            logger_1.logger.securityEvent('forbidden_access_attempt', 'medium', {
                userId: req.user.id,
                userRole,
                requiredRoles: allowedRoles,
                ip: req.ip,
                path: req.path,
            });
            return next(new errorHandler_1.ForbiddenError('Insufficient permissions'));
        }
        next();
    };
};
exports.requireRole = requireRole;
// Tier-based authorization middleware
const requireTier = (tiers) => {
    return (req, res, next) => {
        if (!req.isAuthenticated || !req.user) {
            return next(new errorHandler_1.UnauthorizedError('Authentication required for this feature'));
        }
        const userTier = req.user.tier || 'free';
        const allowedTiers = Array.isArray(tiers) ? tiers : [tiers];
        if (!allowedTiers.includes(userTier)) {
            logger_1.logger.analyticsEvent('tier_restriction_hit', {
                userId: req.user.id,
                userTier,
                requiredTiers: allowedTiers,
                endpoint: req.path,
            });
            return next(new errorHandler_1.ForbiddenError('This feature requires a higher subscription tier'));
        }
        next();
    };
};
exports.requireTier = requireTier;
// Admin authentication middleware
exports.requireAdmin = (0, exports.requireRole)(['admin', 'super_admin']);
// Premium feature middleware
exports.requirePremium = (0, exports.requireTier)(['premium', 'enterprise']);
// API usage tracking middleware
const trackApiUsage = (req, res, next) => {
    // Track API usage for authenticated users
    if (req.isAuthenticated && req.user) {
        logger_1.logger.analyticsEvent('authenticated_api_usage', {
            userId: req.user.id,
            tier: req.user.tier,
            endpoint: req.path,
            method: req.method,
            authMethod: req.authMethod,
        });
    }
    next();
};
exports.trackApiUsage = trackApiUsage;
// Enhanced rate limit key generator that considers authentication
const authAwareRateLimitKeyGenerator = (req) => {
    if (req.isAuthenticated && req.user) {
        return `user_${req.user.id}`;
    }
    return `ip_${req.ip}`;
};
exports.authAwareRateLimitKeyGenerator = authAwareRateLimitKeyGenerator;
// Get rate limit multiplier based on user tier
const getRateLimitMultiplier = (req) => {
    if (!req.isAuthenticated || !req.user) {
        return 1; // Base rate limit
    }
    switch (req.user.tier) {
        case 'enterprise':
            return 10;
        case 'premium':
            return 5;
        case 'free':
            return 2;
        default:
            return 1;
    }
};
exports.getRateLimitMultiplier = getRateLimitMultiplier;
exports.default = {
    optionalAuth: exports.optionalAuth,
    requireAuth: exports.requireAuth,
    validateApiKey: exports.validateApiKey,
    requireRole: exports.requireRole,
    requireTier: exports.requireTier,
    requireAdmin: exports.requireAdmin,
    requirePremium: exports.requirePremium,
    trackApiUsage: exports.trackApiUsage,
    authAwareRateLimitKeyGenerator: exports.authAwareRateLimitKeyGenerator,
    getRateLimitMultiplier: exports.getRateLimitMultiplier,
};
