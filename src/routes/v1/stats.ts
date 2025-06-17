/**
 * 📈 Stats Routes
 * RESTful routes for football statistics and betting analytics
 */

import { Router } from 'express';
import statsController from '../../controllers/StatsController';
import { cacheMiddleware } from '../../middleware/cache';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();

/**
 * GET /api/v1/stats/btts
 * Get Both Teams To Score statistics
 */
router.get('/btts',
  cacheMiddleware(1800), // 30 minute cache
  asyncHandler(statsController.getBttsStats.bind(statsController))
);

/**
 * GET /api/v1/stats/over25
 * Get Over 2.5 goals statistics
 */
router.get('/over25',
  cacheMiddleware(1800), // 30 minute cache
  asyncHandler(statsController.getOver25Stats.bind(statsController))
);

/**
 * GET /api/v1/stats/betting/market/:matchId
 * Get betting market analysis for a specific match
 */
router.get('/betting/market/:matchId',
  cacheMiddleware(600), // 10 minute cache
  asyncHandler(statsController.getBettingMarketAnalysis.bind(statsController))
);

/**
 * GET /api/v1/stats/betting/value-bets
 * Get value bet opportunities
 */
router.get('/betting/value-bets',
  cacheMiddleware(300), // 5 minute cache
  asyncHandler(statsController.getValueBets.bind(statsController))
);

/**
 * GET /api/v1/stats/betting/strategy
 * Get betting strategy recommendations
 */
router.get('/betting/strategy',
  cacheMiddleware(900), // 15 minute cache
  asyncHandler(statsController.getBettingStrategy.bind(statsController))
);

/**
 * GET /api/v1/stats/trends/goals
 * Get goal scoring trends and patterns
 */
router.get('/trends/goals',
  cacheMiddleware(1200), // 20 minute cache
  asyncHandler(statsController.getGoalTrends.bind(statsController))
);

/**
 * GET /api/v1/stats/summary
 * Get comprehensive statistics summary
 */
router.get('/summary',
  cacheMiddleware(900), // 15 minute cache
  asyncHandler(statsController.getStatsSummary.bind(statsController))
);

/**
 * GET /api/v1/stats
 * Stats endpoints overview
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Football Statistics & Betting Analytics API',
    availableEndpoints: {
      btts: 'GET /btts - Both Teams To Score statistics',
      over25: 'GET /over25 - Over 2.5 goals statistics',
      bettingMarket: 'GET /betting/market/:matchId - Betting market analysis',
      valueBets: 'GET /betting/value-bets - Value betting opportunities',
      strategy: 'GET /betting/strategy - Betting strategy recommendations',
      trends: 'GET /trends/goals - Goal scoring trends',
      summary: 'GET /summary - Comprehensive statistics summary'
    },
    features: [
      'BTTS and Over/Under statistics',
      'Betting market analysis',
      'Value bet identification',
      'Statistical trend analysis',
      'Comprehensive data summaries'
    ]
  });
});

export default router;
