/**
 * 📝 Request Logging Middleware
 * 
 * Comprehensive request/response logging with:
 * - Performance metrics
 * - Error tracking
 * - Security monitoring
 * - API usage analytics
 */

import { NextFunction, Request, Response } from 'express';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

interface RequestWithStartTime extends Request {
    startTime?: number;
    requestId?: string;
}

// Generate unique request ID
function generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Extract relevant headers for logging (excluding sensitive ones)
function extractHeaders(headers: any): Record<string, any> {
    const relevantHeaders: Record<string, any> = {};
    const headersToLog = [
        'user-agent',
        'accept',
        'content-type',
        'content-length',
        'x-forwarded-for',
        'x-real-ip',
        'x-api-key',
        'referer',
        'origin',
    ];

    headersToLog.forEach(header => {
        if (headers[header]) {
            // Mask API keys for security
            if (header === 'x-api-key') {
                relevantHeaders[header] = headers[header].substring(0, 8) + '***';
            } else {
                relevantHeaders[header] = headers[header];
            }
        }
    });

    return relevantHeaders;
}

// Determine if request body should be logged
function shouldLogRequestBody(req: Request): boolean {
    const contentType = req.headers['content-type'] || '';
    const method = req.method.toLowerCase();
    
    // Only log body for POST, PUT, PATCH
    if (!['post', 'put', 'patch'].includes(method)) {
        return false;
    }
    
    // Only log JSON bodies
    if (!contentType.includes('application/json')) {
        return false;
    }
    
    // Don't log large bodies
    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > 10000) { // 10KB limit
        return false;
    }
    
    return true;
}

// Sanitize sensitive data from request body
function sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
        return body;
    }
    
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
    const sanitized = { ...body };
    
    Object.keys(sanitized).forEach(key => {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
            sanitized[key] = '[REDACTED]';
        }
    });
    
    return sanitized;
}

// Main request logging middleware
export const requestLogger = (req: RequestWithStartTime, res: Response, next: NextFunction): void => {
    // Generate request ID and start time
    req.requestId = generateRequestId();
    req.startTime = Date.now();
    
    // Extract request information
    const requestInfo: any = {
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        path: req.path,
        query: req.query,
        params: req.params,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        headers: extractHeaders(req.headers),
        timestamp: new Date().toISOString(),
    };

    // Add request body if appropriate
    if (shouldLogRequestBody(req)) {
        requestInfo.body = sanitizeBody(req.body);
    }
    
    // Log incoming request
    logger.info('Incoming request', {
        type: 'request_start',
        ...requestInfo,
    });
    
    // Store original json method to intercept response
    const originalJson = res.json;
    let responseBody: any = null;
    let responseLogged = false;
    
    // Intercept response
    res.json = function(body: any) {
        responseBody = body;
        return originalJson.call(this, body);
    };
    
    // Log response when request finishes
    const logResponse = () => {
        if (responseLogged) return;
        responseLogged = true;
        
        const duration = req.startTime ? Date.now() - req.startTime : 0;
        const statusCode = res.statusCode;
        
        const responseInfo: any = {
            requestId: req.requestId,
            method: req.method,
            url: req.originalUrl,
            statusCode,
            duration,
            timestamp: new Date().toISOString(),
        };

        // Add response body for errors or if in development
        if (statusCode >= 400 || config.app.nodeEnv === 'development') {
            if (responseBody && typeof responseBody === 'object') {
                // Limit response body size in logs
                const bodyStr = JSON.stringify(responseBody);
                if (bodyStr.length <= 1000) {
                    responseInfo.responseBody = responseBody;
                } else {
                    responseInfo.responseBody = '[RESPONSE_TOO_LARGE]';
                    responseInfo.responseSize = bodyStr.length;
                }
            }
        }
        
        // Determine log level based on status code
        let logLevel: 'info' | 'warn' | 'error' = 'info';
        if (statusCode >= 500) {
            logLevel = 'error';
        } else if (statusCode >= 400) {
            logLevel = 'warn';
        }
        
        // Log the response
        logger[logLevel]('Request completed', {
            type: 'request_complete',
            ...responseInfo,
        });
        
        // Log performance metrics
        logger.performanceMetric('request_duration', duration, 'ms', {
            method: req.method,
            path: req.path,
            statusCode,
        });
        
        // Log slow requests
        if (duration > 5000) { // Slower than 5 seconds
            logger.warn('Slow request detected', {
                type: 'slow_request',
                requestId: req.requestId,
                duration,
                method: req.method,
                url: req.originalUrl,
                statusCode,
            });
        }
        
        // Security logging for suspicious requests
        if (statusCode === 401 || statusCode === 403) {
            logger.securityEvent('unauthorized_access', 'medium', {
                requestId: req.requestId,
                ip: req.ip,
                userAgent: req.headers['user-agent'],
                path: req.path,
                method: req.method,
            });
        }
        
        // Track API usage patterns
        if (req.path.startsWith('/api/')) {
            logger.analyticsEvent('api_usage', {
                endpoint: req.path,
                method: req.method,
                statusCode,
                duration,
                hasApiKey: !!req.headers['x-api-key'],
            });
        }
    };
    
    // Listen for response events
    res.on('finish', logResponse);
    res.on('close', logResponse);
    res.on('error', (error) => {
        logger.error('Response error', {
            type: 'response_error',
            requestId: req.requestId,
            error: error.message,
            stack: error.stack,
        });
        logResponse();
    });
    
    next();
};

// Express-compatible HTTP request logger using morgan format
export const httpLogger = (tokens: any, req: any, res: any) => {
    const log = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ');
    
    return log;
};

export default requestLogger;
