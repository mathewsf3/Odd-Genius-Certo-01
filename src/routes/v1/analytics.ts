/**
 * 📊 Analytics Routes
 * RESTful routes for comprehensive football analytics and predictions
 */

import { Router } from 'express';
import analyticsController from '../../controllers/AnalyticsController';
import { cacheMiddleware } from '../../middleware/cache';
import { asyncHandler } from '../../middleware/errorHandler';
import { rateLimiter } from '../../middleware/rateLimiter';

const router = Router();

// Apply analytics-specific rate limiting
router.use(rateLimiter.analytics);

/**
 * GET /api/v1/analytics/match/:id
 * Get comprehensive match analytics
 */
router.get('/match/:id',
  cacheMiddleware(900), // 15 minute cache
  asyncHandler(analyticsController.getMatchAnalytics.bind(analyticsController))
);

/**
 * GET /api/v1/analytics/team/:id
 * Get comprehensive team analytics
 */
router.get('/team/:id',
  cacheMiddleware(1200), // 20 minute cache
  asyncHandler(analyticsController.getTeamAnalytics.bind(analyticsController))
);

/**
 * GET /api/v1/analytics/league/:id
 * Get comprehensive league analytics
 */
router.get('/league/:id',
  cacheMiddleware(1800), // 30 minute cache
  asyncHandler(analyticsController.getLeagueAnalytics.bind(analyticsController))
);

/**
 * GET /api/v1/analytics/player/:id
 * Get comprehensive player analytics
 */
router.get('/player/:id',
  cacheMiddleware(1200), // 20 minute cache
  asyncHandler(analyticsController.getPlayerAnalytics.bind(analyticsController))
);

/**
 * GET /api/v1/analytics/betting/match/:id
 * Get betting analytics for a match
 */
router.get('/betting/match/:id',
  cacheMiddleware(600), // 10 minute cache
  asyncHandler(analyticsController.getMatchBettingAnalytics.bind(analyticsController))
);

/**
 * GET /api/v1/analytics/predictions/today
 * Get predictions for today's matches
 */
router.get('/predictions/today',
  cacheMiddleware(300), // 5 minute cache
  asyncHandler(analyticsController.getTodaysPredictions.bind(analyticsController))
);

/**
 * GET /api/v1/analytics/teams/compare
 * Compare multiple teams
 */
router.get('/teams/compare',
  cacheMiddleware(900), // 15 minute cache
  asyncHandler(analyticsController.compareTeams.bind(analyticsController))
);

/**
 * GET /api/v1/analytics
 * Analytics endpoints overview
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Comprehensive Football Analytics API',
    availableEndpoints: {
      match: 'GET /match/:id - Comprehensive match analytics',
      team: 'GET /team/:id - Team performance analytics',
      league: 'GET /league/:id - League season analytics',
      player: 'GET /player/:id - Player performance analytics',
      betting: 'GET /betting/match/:id - Betting market analytics',
      predictions: 'GET /predictions/today - Daily match predictions',
      comparison: 'GET /teams/compare?teams=1,2 - Team comparisons'
    },
    features: [
      'Match prediction algorithms',
      'Team performance analysis',
      'League trend analysis',
      'Player ranking systems',
      'Betting value detection',
      'Real-time analytics'
    ]
  });
});

export default router;
