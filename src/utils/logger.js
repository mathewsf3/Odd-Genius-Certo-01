"use strict";
/**
 * 📝 Advanced Logging Utility
 *
 * Winston-based logging system with:
 * - Multiple transport options (console, file, remote)
 * - Environment-specific configurations
 * - Structured logging with metadata
 * - Performance monitoring integration
 */
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganStream = exports.createChildLogger = exports.winstonLogger = exports.logger = void 0;
const path_1 = __importDefault(require("path"));
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const environment_1 = require("../config/environment");
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
winston_1.default.addColors(customLevels.colors);
// Custom format for development
const developmentFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((_a) => {
    var { timestamp, level, message } = _a, meta = __rest(_a, ["timestamp", "level", "message"]);
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
}));
// Custom format for production
const productionFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json(), winston_1.default.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }));
// Create transports array
const transports = [];
// Console transport
if (environment_1.config.app.nodeEnv !== 'test') {
    transports.push(new winston_1.default.transports.Console({
        level: environment_1.config.logging.level,
        format: environment_1.config.app.nodeEnv === 'development' ? developmentFormat : productionFormat,
    }));
}
// File transport (if enabled)
if (environment_1.config.logging.file.enabled) {
    // Ensure logs directory exists
    const logsDir = path_1.default.resolve(environment_1.config.logging.file.path);
    // Error logs
    transports.push(new winston_daily_rotate_file_1.default({
        filename: path_1.default.join(logsDir, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        format: productionFormat,
        maxSize: environment_1.config.logging.file.maxSize,
        maxFiles: environment_1.config.logging.file.maxFiles,
        zippedArchive: true,
    }));
    // Combined logs
    transports.push(new winston_daily_rotate_file_1.default({
        filename: path_1.default.join(logsDir, 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        format: productionFormat,
        maxSize: environment_1.config.logging.file.maxSize,
        maxFiles: environment_1.config.logging.file.maxFiles,
        zippedArchive: true,
    }));
    // HTTP request logs
    transports.push(new winston_daily_rotate_file_1.default({
        filename: path_1.default.join(logsDir, 'http-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'http',
        format: productionFormat,
        maxSize: environment_1.config.logging.file.maxSize,
        maxFiles: environment_1.config.logging.file.maxFiles,
        zippedArchive: true,
    }));
}
// Create the logger
const logger = winston_1.default.createLogger({
    level: environment_1.config.logging.level,
    levels: customLevels.levels,
    format: environment_1.config.app.nodeEnv === 'development' ? developmentFormat : productionFormat,
    transports,
    // Don't exit on handled exceptions
    exitOnError: false,
});
exports.winstonLogger = logger;
// Enhanced logging methods with context
class Logger {
    constructor(winstonLogger) {
        this.winston = winstonLogger;
    }
    // Standard log methods
    error(message, meta) {
        this.winston.error(message, Object.assign(Object.assign({}, meta), { timestamp: new Date().toISOString() }));
    }
    warn(message, meta) {
        this.winston.warn(message, Object.assign(Object.assign({}, meta), { timestamp: new Date().toISOString() }));
    }
    info(message, meta) {
        this.winston.info(message, Object.assign(Object.assign({}, meta), { timestamp: new Date().toISOString() }));
    }
    http(message, meta) {
        this.winston.http(message, Object.assign(Object.assign({}, meta), { timestamp: new Date().toISOString() }));
    }
    debug(message, meta) {
        this.winston.debug(message, Object.assign(Object.assign({}, meta), { timestamp: new Date().toISOString() }));
    }
    // Specialized logging methods
    apiCall(endpoint, method, duration, statusCode, meta) {
        this.winston.info('API Call', Object.assign(Object.assign({ type: 'api_call', endpoint,
            method,
            duration,
            statusCode }, meta), { timestamp: new Date().toISOString() }));
    }
    footyStatsCall(endpoint, duration, success, meta) {
        this.winston.info('FootyStats API Call', Object.assign(Object.assign({ type: 'footystats_call', endpoint,
            duration,
            success }, meta), { timestamp: new Date().toISOString() }));
    }
    analyticsEvent(event, data) {
        this.winston.info('Analytics Event', {
            type: 'analytics_event',
            event,
            data,
            timestamp: new Date().toISOString(),
        });
    }
    performanceMetric(metric, value, unit, meta) {
        this.winston.info('Performance Metric', Object.assign(Object.assign({ type: 'performance_metric', metric,
            value,
            unit }, meta), { timestamp: new Date().toISOString() }));
    }
    securityEvent(event, severity, meta) {
        const logLevel = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
        this.winston[logLevel]('Security Event', Object.assign(Object.assign({ type: 'security_event', event,
            severity }, meta), { timestamp: new Date().toISOString() }));
    }
    // Database operation logging
    dbOperation(operation, table, duration, success, meta) {
        this.winston.debug('Database Operation', Object.assign(Object.assign({ type: 'db_operation', operation,
            table,
            duration,
            success }, meta), { timestamp: new Date().toISOString() }));
    }
    // Cache operation logging
    cacheOperation(operation, key, meta) {
        this.winston.debug('Cache Operation', Object.assign(Object.assign({ type: 'cache_operation', operation,
            key }, meta), { timestamp: new Date().toISOString() }));
    }
    // Create child logger with context
    child(context) {
        const childLogger = this.winston.child(context);
        return new Logger(childLogger);
    }
}
// Create enhanced logger instance
const enhancedLogger = new Logger(logger);
exports.logger = enhancedLogger;
// Export logging utilities
const createChildLogger = (context) => {
    return enhancedLogger.child(context);
};
exports.createChildLogger = createChildLogger;
// Stream for Morgan HTTP logging
exports.morganStream = {
    write: (message) => {
        enhancedLogger.http(message.trim());
    },
};
exports.default = enhancedLogger;
