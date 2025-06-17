"use strict";
/**
 * 📝 Request Logging Middleware
 * Basic request logging for development
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });
    next();
};
exports.requestLogger = requestLogger;
