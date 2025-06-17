/**
 * 🛣️ Main Routes Configuration
 * 
 * Central route setup that organizes all API endpoints:
 * - Health and status endpoints
 * - V1 API routes (matches, teams, analytics)
 * - Documentation routes
 * - Admin routes (if needed)
 */

import { Application } from 'express';
import { logger } from '../utils/logger';

// Import route modules
import docsRoutes from './docs';
import healthRoutes from './health';
import v1Routes from './v1';

// Import middleware
import { validateApiKey } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';
import { requestLogger } from '../middleware/requestLogger';

/**
 * Setup all application routes
 */
export function setupRoutes(app: Application): void {
    logger.info('🛣️  Setting up application routes...');

    // Request logging middleware
    app.use(requestLogger);

    // Health routes (no auth required)
    app.use('/health', healthRoutes);
    app.use('/status', healthRoutes); // Alias

    // API Documentation routes
    app.use('/docs', docsRoutes);
    app.use('/api/docs', docsRoutes); // Alias

    // Main API routes with authentication and rate limiting
    app.use('/api/v1', 
        rateLimiter.api,           // Rate limiting
        validateApiKey,            // API key validation (optional)
        v1Routes                   // Main API routes
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

    logger.info('✅ Routes setup completed');
}

export default setupRoutes;
