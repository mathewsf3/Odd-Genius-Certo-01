"use strict";
/**
 * 🚨 Comprehensive Error Handling Middleware
 *
 * Centralized error handling for the Football API with:
 * - Custom error classes and types
 * - Detailed error logging and monitoring
 * - Client-friendly error responses
 * - Security considerations (no sensitive data exposure)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportError = exports.formatValidationError = exports.notFoundHandler = exports.asyncHandler = exports.errorHandler = exports.CacheError = exports.DatabaseError = exports.FootyStatsApiError = exports.ServiceUnavailableError = exports.RateLimitError = exports.ConflictError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.ValidationError = exports.AppError = void 0;
const environment_1 = require("../config/environment");
const logger_1 = require("../utils/logger");
// Custom error types
class AppError extends Error {
    constructor(message, statusCode = 500, code, isOperational = true, details) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.code = code;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// Specific error classes
class ValidationError extends AppError {
    constructor(message, details) {
        super(message, 400, 'VALIDATION_ERROR', true, details);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access') {
        super(message, 401, 'UNAUTHORIZED');
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden access') {
        super(message, 403, 'FORBIDDEN');
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends AppError {
    constructor(message, details) {
        super(message, 409, 'CONFLICT', true, details);
    }
}
exports.ConflictError = ConflictError;
class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, 429, 'RATE_LIMIT_EXCEEDED');
    }
}
exports.RateLimitError = RateLimitError;
class ServiceUnavailableError extends AppError {
    constructor(message = 'Service temporarily unavailable') {
        super(message, 503, 'SERVICE_UNAVAILABLE');
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
class FootyStatsApiError extends AppError {
    constructor(message, statusCode = 500, details) {
        super(message, statusCode, 'FOOTYSTATS_API_ERROR', true, details);
    }
}
exports.FootyStatsApiError = FootyStatsApiError;
class DatabaseError extends AppError {
    constructor(message, details) {
        super(message, 500, 'DATABASE_ERROR', true, details);
    }
}
exports.DatabaseError = DatabaseError;
class CacheError extends AppError {
    constructor(message, details) {
        super(message, 500, 'CACHE_ERROR', true, details);
    }
}
exports.CacheError = CacheError;
// Main error handler middleware
const errorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let details = undefined;
    // Handle known error types
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        code = error.code || 'APP_ERROR';
        details = error.details;
    }
    else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
        code = 'VALIDATION_ERROR';
        details = error.message;
    }
    else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid data format';
        code = 'CAST_ERROR';
    }
    else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
        statusCode = 500;
        message = 'Database operation failed';
        code = 'DATABASE_ERROR';
    }
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
        code = 'INVALID_TOKEN';
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
        code = 'TOKEN_EXPIRED';
    }
    else if (error.name === 'SyntaxError' && 'body' in error) {
        statusCode = 400;
        message = 'Invalid JSON payload';
        code = 'INVALID_JSON';
    }
    // Generate request ID for tracking
    const requestId = req.headers['x-request-id'] ||
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
        logger_1.logger.error(`Server Error: ${message}`, Object.assign(Object.assign({}, errorContext), { stack: error.stack, errorName: error.name }));
    }
    else {
        logger_1.logger.warn(`Client Error: ${message}`, errorContext);
    }
    // Security: Don't expose sensitive information in production
    const isDevelopment = environment_1.config.app.nodeEnv === 'development';
    // Build error response
    const errorResponse = {
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
exports.errorHandler = errorHandler;
// Async error wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
// 404 Not Found handler
const notFoundHandler = (req, res, next) => {
    const error = new NotFoundError(`Route ${req.originalUrl} not found`);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
// Validation error formatter
const formatValidationError = (errors) => {
    const formatted = {};
    errors.forEach((error) => {
        const field = error.path || error.field || 'unknown';
        if (!formatted[field]) {
            formatted[field] = [];
        }
        formatted[field].push(error.message || error.msg || 'Invalid value');
    });
    return formatted;
};
exports.formatValidationError = formatValidationError;
// Error monitoring hook (for external services like Sentry)
const reportError = (error, context) => {
    // This can be extended to integrate with error monitoring services
    logger_1.logger.error('Error reported to monitoring service', {
        error: error.message,
        stack: error.stack,
        context,
    });
};
exports.reportError = reportError;
exports.default = exports.errorHandler;
