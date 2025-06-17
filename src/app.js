"use strict";
/**
 * 🚀 Football Data API - Main Application Setup
 *
 * Comprehensive Express.js application with:
 * - FootyStats API integration
 * - Type-safe routes and middleware
 * - Security and performance optimizations
 * - Comprehensive error handling
 * - Production-ready configuration
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// Import routes
const health_1 = __importDefault(require("./routes/health"));
const v1_1 = __importDefault(require("./routes/v1"));
// Import middleware
const errorHandler_1 = require("./middleware/errorHandler");
const logging_1 = require("./middleware/logging");
const notFoundHandler_1 = require("./middleware/notFoundHandler");
// Import configuration
const config_1 = require("./config");
// Import FootyStats API configuration
const footy_1 = require("./apis/footy");
class App {
    constructor() {
        console.log('🚀 APP.TS CONSTRUCTOR CALLED - CORS FIX ACTIVE!');
        this.app = (0, express_1.default)();
        this.configureFootyStatsAPI();
        this.setMiddleware();
        this.setRoutes();
        this.setErrorHandling();
    }
    configureFootyStatsAPI() {
        // Configure the FootyStats API client
        footy_1.OpenAPI.BASE = config_1.config.footyStats.baseUrl;
        footy_1.OpenAPI.TOKEN = config_1.config.footyStats.apiKey;
        console.log('✅ FootyStats API client configured');
    }
    setMiddleware() {
        // Security middleware
        this.app.use((0, helmet_1.default)({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", "data:", "https:"],
                },
            },
        }));
        // CORS configuration - EXPLICIT SETUP FOR DEVELOPMENT
        const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'];
        console.log('🔍 CORS Configuration:', {
            allowedOrigins: allowedOrigins,
            nodeEnv: config_1.config.app.nodeEnv
        });
        this.app.use((0, cors_1.default)({
            origin: allowedOrigins,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'Accept', 'Origin', 'X-Requested-With'],
            exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
            preflightContinue: false,
            optionsSuccessStatus: 200
        }));
        // Compression middleware
        this.app.use((0, compression_1.default)());
        // Request parsing
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        // Request logging
        if (config_1.config.app.nodeEnv === 'development') {
            this.app.use((0, morgan_1.default)('dev'));
        }
        else {
            this.app.use((0, morgan_1.default)('combined'));
        }
        // Custom request logger
        this.app.use(logging_1.requestLogger);
        // Global rate limiting
        const globalRateLimit = (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: config_1.config.rateLimit.global.max, // requests per window
            message: {
                success: false,
                error: 'Too many requests from this IP, please try again later.',
                retryAfter: '15 minutes'
            },
            standardHeaders: true,
            legacyHeaders: false, // Custom key generator for potential API key identification
            keyGenerator: (req) => {
                const apiKey = req.headers['x-api-key'];
                return apiKey ? `api_${apiKey}` : (req.ip || 'unknown');
            }
        });
        this.app.use(globalRateLimit);
        console.log('✅ Middleware configured');
    }
    setRoutes() {
        // API routes
        this.app.use('/health', health_1.default);
        this.app.use('/api/v1', v1_1.default);
        // Root endpoint
        this.app.get('/', (req, res) => {
            res.json({
                success: true,
                message: 'Football Data API - Backend Server',
                version: '1.0.0',
                endpoints: {
                    health: '/health',
                    api: '/api/v1',
                    documentation: '/api/v1/docs'
                },
                timestamp: new Date().toISOString(),
                environment: config_1.config.app.nodeEnv
            });
        });
        console.log('✅ Routes configured');
    }
    setErrorHandling() {
        // 404 handler
        this.app.use(notFoundHandler_1.notFoundHandler);
        // Global error handler
        this.app.use(errorHandler_1.errorHandler);
        // Uncaught exception handler
        process.on('uncaughtException', (error) => {
            console.error('❌ Uncaught Exception:', error);
            process.exit(1);
        });
        // Unhandled promise rejection handler
        process.on('unhandledRejection', (reason, promise) => {
            console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
            process.exit(1);
        });
        console.log('✅ Error handling configured');
    }
    getApp() {
        return this.app;
    }
}
exports.default = new App().getApp();
