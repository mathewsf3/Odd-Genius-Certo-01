/**
 * 🚨 Comprehensive Error Handling Middleware
 * 
 * Centralized error handling for the Football API with:
 * - Custom error classes and types
 * - Detailed error logging and monitoring
 * - Client-friendly error responses
 * - Security considerations (no sensitive data exposure)
 */

import { NextFunction, Request, Response } from 'express';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

// Custom error types
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    public code?: string;
    public details?: any;

    constructor(
        message: string,
        statusCode: number = 500,
        code?: string,
        isOperational: boolean = true,
        details?: any
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.code = code;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Specific error classes
export class ValidationError extends AppError {
    constructor(message: string, details?: any) {
        super(message, 400, 'VALIDATION_ERROR', true, details);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden access') {
        super(message, 403, 'FORBIDDEN');
    }
}

export class ConflictError extends AppError {
    constructor(message: string, details?: any) {
        super(message, 409, 'CONFLICT', true, details);
    }
}

export class RateLimitError extends AppError {
    constructor(message: string = 'Too many requests') {
        super(message, 429, 'RATE_LIMIT_EXCEEDED');
    }
}

export class ServiceUnavailableError extends AppError {
    constructor(message: string = 'Service temporarily unavailable') {
        super(message, 503, 'SERVICE_UNAVAILABLE');
    }
}

export class FootyStatsApiError extends AppError {
    constructor(message: string, statusCode: number = 500, details?: any) {
        super(message, statusCode, 'FOOTYSTATS_API_ERROR', true, details);
    }
}

export class DatabaseError extends AppError {
    constructor(message: string, details?: any) {
        super(message, 500, 'DATABASE_ERROR', true, details);
    }
}

export class CacheError extends AppError {
    constructor(message: string, details?: any) {
        super(message, 500, 'CACHE_ERROR', true, details);
    }
}

// Error response interface
interface ErrorResponse {
    success: false;
    error: string;
    code?: string;
    details?: any;
    timestamp: string;
    requestId?: string;
    path?: string;
    method?: string;
    stack?: string;
}

// Main error handler middleware
export const errorHandler = (
    error: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let statusCode = 500;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let details: any = undefined;

    // Handle known error types
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        code = error.code || 'APP_ERROR';
        details = error.details;
    } else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
        code = 'VALIDATION_ERROR';
        details = error.message;
    } else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid data format';
        code = 'CAST_ERROR';
    } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
        statusCode = 500;
        message = 'Database operation failed';
        code = 'DATABASE_ERROR';
    } else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
        code = 'INVALID_TOKEN';
    } else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
        code = 'TOKEN_EXPIRED';
    } else if (error.name === 'SyntaxError' && 'body' in error) {
        statusCode = 400;
        message = 'Invalid JSON payload';
        code = 'INVALID_JSON';
    }

    // Generate request ID for tracking
    const requestId = req.headers['x-request-id'] as string || 
                     `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log error with context
    const errorContext = {
        requestId,
        path: req.path,
        method: req.method,
        query: req.query,
        body: req.body,
        headers: {
            'user-agent': req.headers['user-agent'],
            'x-forwarded-for': req.headers['x-forwarded-for'],
            'authorization': req.headers.authorization ? '[REDACTED]' : undefined,
        },
        ip: req.ip,
        statusCode,
        code,
        details,
    };

    if (statusCode >= 500) {
        logger.error(`Server Error: ${message}`, {
            ...errorContext,
            stack: error.stack,
            errorName: error.name,
        });
    } else {
        logger.warn(`Client Error: ${message}`, errorContext);
    }

    // Security: Don't expose sensitive information in production
    const isDevelopment = config.app.nodeEnv === 'development';

    // Build error response
    const errorResponse: ErrorResponse = {
        success: false,
        error: message,
        code,
        timestamp: new Date().toISOString(),
        requestId,
        path: req.path,
        method: req.method,
    };

    // Add details only in development or for client errors
    if (isDevelopment || statusCode < 500) {
        if (details) {
            errorResponse.details = details;
        }
    }

    // Add stack trace only in development
    if (isDevelopment && error.stack) {
        errorResponse.stack = error.stack;
    }

    // Set security headers
    res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
    });

    // Send error response
    res.status(statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// 404 Not Found handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
    const error = new NotFoundError(`Route ${req.originalUrl} not found`);
    next(error);
};

// Validation error formatter
export const formatValidationError = (errors: any[]): any => {
    const formatted: Record<string, string[]> = {};
    
    errors.forEach((error) => {
        const field = error.path || error.field || 'unknown';
        if (!formatted[field]) {
            formatted[field] = [];
        }
        formatted[field].push(error.message || error.msg || 'Invalid value');
    });
    
    return formatted;
};

// Error monitoring hook (for external services like Sentry)
export const reportError = (error: Error, context?: any): void => {
    // This can be extended to integrate with error monitoring services
    logger.error('Error reported to monitoring service', {
        error: error.message,
        stack: error.stack,
        context,
    });
};

export default errorHandler;
