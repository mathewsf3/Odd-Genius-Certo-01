/**
 * 🔐 Authentication & Authorization Middleware
 * 
 * Flexible authentication system supporting:
 * - Optional API key authentication
 * - JWT token validation
 * - Rate limit adjustments based on auth status
 * - Security logging and monitoring
 */

import { NextFunction, Request, Response } from 'express';
// @ts-ignore - jsonwebtoken types not available
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { logger } from '../utils/logger';
import { ForbiddenError, UnauthorizedError } from './errorHandler';

// Extend Request interface to include auth info
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email?: string;
        role?: string;
        apiKey?: string;
        tier?: 'free' | 'premium' | 'enterprise';
    };
    isAuthenticated?: boolean;
    authMethod?: 'api_key' | 'jwt' | 'none';
}

// API Key validation (simple implementation - in production use database)
const validateApiKeyInternal = (apiKey: string): { valid: boolean; user?: any } => {
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
    
    const userData = validApiKeys[apiKey as keyof typeof validApiKeys];
    return {
        valid: !!userData,
        user: userData,
    };
};

// JWT validation
const validateJWT = (token: string): { valid: boolean; user?: any } => {
    try {
        if (!config.security.jwtSecret) {
            return { valid: false };
        }
        
        const decoded = jwt.verify(token, config.security.jwtSecret) as any;
        return {
            valid: true,
            user: {
                id: decoded.id || decoded.sub,
                email: decoded.email,
                role: decoded.role,
                tier: decoded.tier || 'free',
            },
        };
    } catch (error) {
        logger.warn('JWT validation failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            token: token.substring(0, 20) + '...',
        });
        return { valid: false };
    }
};

// Optional authentication middleware - allows both authenticated and unauthenticated requests
export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    req.isAuthenticated = false;
    req.authMethod = 'none';
    
    // Check for API key in headers
    const apiKey = req.headers['x-api-key'] as string;
    if (apiKey) {
        const apiKeyResult = validateApiKeyInternal(apiKey);
        if (apiKeyResult.valid) {
            req.user = { ...apiKeyResult.user, apiKey };
            req.isAuthenticated = true;
            req.authMethod = 'api_key';
            
            logger.debug('API key authentication successful', {
                userId: req.user?.id,
                tier: req.user?.tier,
                ip: req.ip,
            });
        } else {
            logger.warn('Invalid API key used', {
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
                
                logger.debug('JWT authentication successful', {
                    userId: req.user?.id,
                    ip: req.ip,
                });
            } else {
                logger.warn('Invalid JWT token used', {
                    ip: req.ip,
                    userAgent: req.headers['user-agent'],
                });
            }
        }
    }
    
    next();
};

// Required authentication middleware - requires valid authentication
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    optionalAuth(req, res, (error?: any) => {
        if (error) {
            return next(error);
        }
        
        if (!req.isAuthenticated || !req.user) {
            logger.securityEvent('unauthorized_access_attempt', 'medium', {
                ip: req.ip,
                path: req.path,
                method: req.method,
                userAgent: req.headers['user-agent'],
            });
            
            return next(new UnauthorizedError('Authentication required'));
        }
        
        next();
    });
};

// API key validation middleware (backwards compatibility)
export const validateApiKey = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    optionalAuth(req, res, next);
};

// Role-based authorization middleware
export const requireRole = (roles: string | string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.isAuthenticated || !req.user) {
            return next(new UnauthorizedError('Authentication required'));
        }
        
        const userRole = req.user.role || 'user';
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        
        if (!allowedRoles.includes(userRole)) {
            logger.securityEvent('forbidden_access_attempt', 'medium', {
                userId: req.user.id,
                userRole,
                requiredRoles: allowedRoles,
                ip: req.ip,
                path: req.path,
            });
            
            return next(new ForbiddenError('Insufficient permissions'));
        }
        
        next();
    };
};

// Tier-based authorization middleware
export const requireTier = (tiers: string | string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.isAuthenticated || !req.user) {
            return next(new UnauthorizedError('Authentication required for this feature'));
        }
        
        const userTier = req.user.tier || 'free';
        const allowedTiers = Array.isArray(tiers) ? tiers : [tiers];
        
        if (!allowedTiers.includes(userTier)) {
            logger.analyticsEvent('tier_restriction_hit', {
                userId: req.user.id,
                userTier,
                requiredTiers: allowedTiers,
                endpoint: req.path,
            });
            
            return next(new ForbiddenError('This feature requires a higher subscription tier'));
        }
        
        next();
    };
};

// Admin authentication middleware
export const requireAdmin = requireRole(['admin', 'super_admin']);

// Premium feature middleware
export const requirePremium = requireTier(['premium', 'enterprise']);

// API usage tracking middleware
export const trackApiUsage = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // Track API usage for authenticated users
    if (req.isAuthenticated && req.user) {
        logger.analyticsEvent('authenticated_api_usage', {
            userId: req.user.id,
            tier: req.user.tier,
            endpoint: req.path,
            method: req.method,
            authMethod: req.authMethod,
        });
    }
    
    next();
};

// Enhanced rate limit key generator that considers authentication
export const authAwareRateLimitKeyGenerator = (req: AuthenticatedRequest): string => {
    if (req.isAuthenticated && req.user) {
        return `user_${req.user.id}`;
    }
    
    return `ip_${req.ip}`;
};

// Get rate limit multiplier based on user tier
export const getRateLimitMultiplier = (req: AuthenticatedRequest): number => {
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

export default {
    optionalAuth,
    requireAuth,
    validateApiKey,
    requireRole,
    requireTier,
    requireAdmin,
    requirePremium,
    trackApiUsage,
    authAwareRateLimitKeyGenerator,
    getRateLimitMultiplier,
};
