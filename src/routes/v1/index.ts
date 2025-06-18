/**
 * 🎯 API V1 Routes
 * 
 * Main API routes that organize all football data endpoints:
 * - Matches (today's matches, match details, analysis)
 * - Teams (team info, statistics, performance)
 * - Leagues (seasons, standings, fixtures)
 * - Analytics (predictions, insights, advanced metrics)
 * - Players (stats, performance data)
 */

import { Router } from 'express';
import { logger } from '../../utils/logger';

// Import route modules
import analyticsRoutes from './analytics';
import leagueRoutes from './leagues';
import matchRoutes from './matches';
import playerRoutes from './players';
import statsRoutes from './stats';
import teamRoutes from './teams';

// Import middleware
import { validateApiKey } from '../../middleware/auth';
import { cacheMiddleware } from '../../middleware/cache';
import { rateLimiter } from '../../middleware/rateLimiter';

const router = Router();

// Log API access
router.use((req, res, next) => {
    logger.apiCall(req.path, req.method, 0, 0, {
        query: req.query,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
    });
    next();
});

// API info endpoint
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Football Data API v1',
        version: '1.0.0',
        features: {
            matches: 'Real-time match data and analysis',
            teams: 'Comprehensive team statistics',
            leagues: 'League standings and fixtures',
            analytics: 'Advanced football analytics and predictions',
            players: 'Player performance data',
            statistics: 'Historical statistics and trends',
        },
        endpoints: {
            matches: {
                description: 'Match-related endpoints',
                baseUrl: '/api/v1/matches',
                endpoints: [
                    'GET /today - Today\'s matches',
                    'GET /:id - Match details',
                    'GET /:id/analysis - Match analysis',
                    'GET /:id/predictions - Match predictions',
                ],
            },
            teams: {
                description: 'Team-related endpoints',
                baseUrl: '/api/v1/teams',
                endpoints: [
                    'GET / - List teams',
                    'GET /:id - Team details',
                    'GET /:id/stats - Team statistics',
                    'GET /:id/matches - Team matches',
                ],
            },
            leagues: {
                description: 'League-related endpoints',
                baseUrl: '/api/v1/leagues',
                endpoints: [
                    'GET / - List leagues',
                    'GET /:id/season - Season data',
                    'GET /:id/matches - League matches',
                    'GET /:id/teams - League teams',
                    'GET /:id/table - League table',
                ],
            },
            analytics: {
                description: 'Advanced analytics endpoints',
                baseUrl: '/api/v1/analytics',
                endpoints: [
                    'GET /match/:id - Match analytics',
                    'GET /team/:id - Team analytics',
                    'GET /predictions - Predictions',
                    'GET /trends - Statistical trends',
                ],
            },
            players: {
                description: 'Player-related endpoints',
                baseUrl: '/api/v1/players',
                endpoints: [
                    'GET /:id - Player details',
                    'GET /:id/stats - Player statistics',
                    'GET /:id/performance - Performance metrics',
                ],
            },
            statistics: {
                description: 'Statistical data endpoints',
                baseUrl: '/api/v1/stats',
                endpoints: [
                    'GET /btts - Both Teams To Score stats',
                    'GET /over25 - Over 2.5 goals stats',
                    'GET /corners - Corner statistics',
                    'GET /cards - Card statistics',
                ],
            },
        },
        rateLimit: {
            general: '100 requests per 15 minutes',
            analytics: '50 requests per 15 minutes (resource intensive)',
        },
        authentication: {
            type: 'API Key (optional)',
            header: 'X-API-Key',
            description: 'API key provides higher rate limits and access to premium features',
        },
        documentation: '/docs',
        timestamp: new Date().toISOString(),
    });
});

// Mount route modules with appropriate middleware

// Matches routes (high traffic, cached) - Rate limit friendly
// ✅ REMOVED GLOBAL CACHE MIDDLEWARE - Each route has its own cache settings
router.use('/matches', matchRoutes);

// Teams routes (moderate caching)
router.use('/teams', 
    cacheMiddleware(600), // 10 minute cache
    teamRoutes
);

// Leagues routes (can be cached longer)
router.use('/leagues', 
    cacheMiddleware(900), // 15 minute cache
    leagueRoutes
);

// Analytics routes (resource intensive, rate limited)
router.use('/analytics', 
    rateLimiter.analytics, // Stricter rate limiting
    cacheMiddleware(600),  // 10 minute cache
    analyticsRoutes
);

// Player routes (moderate caching)
router.use('/players',
    cacheMiddleware(1800), // 30 minute cache (player data changes less frequently)
    playerRoutes
);

// Referee routes (reuse player controller)
router.use('/referees',
    cacheMiddleware(1800), // 30 minute cache
    playerRoutes
);

// Statistics routes (can be cached longer)
router.use('/stats', 
    cacheMiddleware(1800), // 30 minute cache
    statsRoutes
);

// API usage statistics endpoint
router.get('/usage', validateApiKey, (req, res) => {
    // This would typically pull from a database or analytics service
    res.json({
        success: true,
        message: 'API usage statistics',
        data: {
            totalRequests: 0,
            requestsToday: 0,
            averageResponseTime: 0,
            topEndpoints: [],
            errorRate: 0,
        },
        note: 'Usage statistics not implemented yet',
        timestamp: new Date().toISOString(),
    });
});

// API status endpoint
router.get('/status', (req, res) => {
    res.json({
        success: true,
        status: 'operational',
        version: '1.0.0',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        services: {
            footyStatsApi: 'operational',
            database: 'not_configured',
            cache: 'operational',
        },
        timestamp: new Date().toISOString(),
    });
});

export default router;
