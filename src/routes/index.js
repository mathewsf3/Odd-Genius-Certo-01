"use strict";
/**
 * 🛣️ Main Routes Configuration
 *
 * Central route setup that organizes all API endpoints:
 * - Health and status endpoints
 * - V1 API routes (matches, teams, analytics)
 * - Documentation routes
 * - Admin routes (if needed)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
const logger_1 = require("../utils/logger");
// Import route modules
const docs_1 = __importDefault(require("./docs"));
const health_1 = __importDefault(require("./health"));
const v1_1 = __importDefault(require("./v1"));
// Import middleware
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const requestLogger_1 = require("../middleware/requestLogger");
/**
 * Setup all application routes
 */
function setupRoutes(app) {
    logger_1.logger.info('🛣️  Setting up application routes...');
    // Request logging middleware
    app.use(requestLogger_1.requestLogger);
    // Health routes (no auth required)
    app.use('/health', health_1.default);
    app.use('/status', health_1.default); // Alias
    // API Documentation routes
    app.use('/docs', docs_1.default);
    app.use('/api/docs', docs_1.default); // Alias
    // Main API routes with authentication and rate limiting
    app.use('/api/v1', rateLimiter_1.rateLimiter.api, // Rate limiting
    auth_1.validateApiKey, // API key validation (optional)
    v1_1.default // Main API routes
    );
    // Root endpoint
    app.get('/', (req, res) => {
        res.json({
            success: true,
            message: '⚽ Football Data API - Backend Server',
            version: '1.0.0',
            endpoints: {
                health: '/health',
                documentation: '/docs',
                api: {
                    v1: '/api/v1',
                    matches: '/api/v1/matches',
                    teams: '/api/v1/teams',
                    analytics: '/api/v1/analytics',
                    leagues: '/api/v1/leagues',
                },
            },
            features: [
                '⚽ Complete FootyStats API Integration',
                '📊 Advanced Football Analytics',
                '🎯 Match Predictions & Statistics',
                '🏆 League and Team Data',
                '📈 Performance Metrics',
                '🔒 Secure API Access',
            ],
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
        });
    });
    // API index endpoint
    app.get('/api', (req, res) => {
        res.json({
            success: true,
            message: 'Football Data API',
            version: 'v1',
            availableEndpoints: {
                matches: {
                    today: 'GET /api/v1/matches/today',
                    byId: 'GET /api/v1/matches/:id',
                    analysis: 'GET /api/v1/matches/:id/analysis',
                },
                teams: {
                    list: 'GET /api/v1/teams',
                    byId: 'GET /api/v1/teams/:id',
                    stats: 'GET /api/v1/teams/:id/stats',
                },
                leagues: {
                    list: 'GET /api/v1/leagues',
                    season: 'GET /api/v1/leagues/:id/season',
                    matches: 'GET /api/v1/leagues/:id/matches',
                },
                analytics: {
                    overview: 'GET /api/v1/analytics',
                    match: 'GET /api/v1/analytics/match/:id',
                    team: 'GET /api/v1/analytics/team/:id',
                    predictions: 'GET /api/v1/analytics/predictions',
                },
            },
            documentation: '/docs',
            timestamp: new Date().toISOString(),
        });
    });
    logger_1.logger.info('✅ Routes setup completed');
}
exports.default = setupRoutes;
