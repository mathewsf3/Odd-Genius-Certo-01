/**
 * 📝 Advanced Logging Utility
 * 
 * Winston-based logging system with:
 * - Multiple transport options (console, file, remote)
 * - Environment-specific configurations
 * - Structured logging with metadata
 * - Performance monitoring integration
 */

import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from '../config/environment';

// Custom log levels
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue',
    },
};

// Add colors to winston
winston.addColors(customLevels.colors);

// Custom format for development
const developmentFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
        return `[${timestamp}] ${level}: ${message}${metaStr}`;
    })
);

// Custom format for production
const productionFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
);

// Create transports array
const transports: winston.transport[] = [];

// Console transport
if (config.app.nodeEnv !== 'test') {
    transports.push(
        new winston.transports.Console({
            level: config.logging.level,
            format: config.app.nodeEnv === 'development' ? developmentFormat : productionFormat,
        })
    );
}

// File transport (if enabled)
if (config.logging.file.enabled) {
    // Ensure logs directory exists
    const logsDir = path.resolve(config.logging.file.path);

    // Error logs
    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            format: productionFormat,
            maxSize: config.logging.file.maxSize,
            maxFiles: config.logging.file.maxFiles,
            zippedArchive: true,
        })
    );

    // Combined logs
    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            format: productionFormat,
            maxSize: config.logging.file.maxSize,
            maxFiles: config.logging.file.maxFiles,
            zippedArchive: true,
        })
    );

    // HTTP request logs
    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'http-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'http',
            format: productionFormat,
            maxSize: config.logging.file.maxSize,
            maxFiles: config.logging.file.maxFiles,
            zippedArchive: true,
        })
    );
}

// Create the logger
const logger = winston.createLogger({
    level: config.logging.level,
    levels: customLevels.levels,
    format: config.app.nodeEnv === 'development' ? developmentFormat : productionFormat,
    transports,
    // Don't exit on handled exceptions
    exitOnError: false,
});

// Enhanced logging methods with context
class Logger {
    private winston: winston.Logger;

    constructor(winstonLogger: winston.Logger) {
        this.winston = winstonLogger;
    }

    // Standard log methods
    error(message: string, meta?: any): void {
        this.winston.error(message, { ...meta, timestamp: new Date().toISOString() });
    }

    warn(message: string, meta?: any): void {
        this.winston.warn(message, { ...meta, timestamp: new Date().toISOString() });
    }

    info(message: string, meta?: any): void {
        this.winston.info(message, { ...meta, timestamp: new Date().toISOString() });
    }

    http(message: string, meta?: any): void {
        this.winston.http(message, { ...meta, timestamp: new Date().toISOString() });
    }

    debug(message: string, meta?: any): void {
        this.winston.debug(message, { ...meta, timestamp: new Date().toISOString() });
    }

    // Specialized logging methods
    apiCall(endpoint: string, method: string, duration: number, statusCode: number, meta?: any): void {
        this.winston.info('API Call', {
            type: 'api_call',
            endpoint,
            method,
            duration,
            statusCode,
            ...meta,
            timestamp: new Date().toISOString(),
        });
    }

    footyStatsCall(endpoint: string, duration: number, success: boolean, meta?: any): void {
        this.winston.info('FootyStats API Call', {
            type: 'footystats_call',
            endpoint,
            duration,
            success,
            ...meta,
            timestamp: new Date().toISOString(),
        });
    }

    analyticsEvent(event: string, data?: any): void {
        this.winston.info('Analytics Event', {
            type: 'analytics_event',
            event,
            data,
            timestamp: new Date().toISOString(),
        });
    }

    performanceMetric(metric: string, value: number, unit: string, meta?: any): void {
        this.winston.info('Performance Metric', {
            type: 'performance_metric',
            metric,
            value,
            unit,
            ...meta,
            timestamp: new Date().toISOString(),
        });
    }

    securityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', meta?: any): void {
        const logLevel = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
        this.winston[logLevel]('Security Event', {
            type: 'security_event',
            event,
            severity,
            ...meta,
            timestamp: new Date().toISOString(),
        });
    }

    // Database operation logging
    dbOperation(operation: string, table: string, duration: number, success: boolean, meta?: any): void {
        this.winston.debug('Database Operation', {
            type: 'db_operation',
            operation,
            table,
            duration,
            success,
            ...meta,
            timestamp: new Date().toISOString(),
        });
    }

    // Cache operation logging
    cacheOperation(operation: 'hit' | 'miss' | 'set' | 'delete', key: string, meta?: any): void {
        this.winston.debug('Cache Operation', {
            type: 'cache_operation',
            operation,
            key,
            ...meta,
            timestamp: new Date().toISOString(),
        });
    }

    // Create child logger with context
    child(context: Record<string, any>): Logger {
        const childLogger = this.winston.child(context);
        return new Logger(childLogger);
    }
}

// Create enhanced logger instance
const enhancedLogger = new Logger(logger);

// Export both the winston logger and enhanced logger
export { enhancedLogger as logger, logger as winstonLogger };

// Export logging utilities
export const createChildLogger = (context: Record<string, any>) => {
    return enhancedLogger.child(context);
};

// Stream for Morgan HTTP logging
export const morganStream = {
    write: (message: string) => {
        enhancedLogger.http(message.trim());
    },
};

export default enhancedLogger;
