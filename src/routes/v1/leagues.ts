/**
 * 🏆 League Routes
 * RESTful routes for league data, standings, and analytics
 */

import { Router } from 'express';
import leagueController from '../../controllers/LeagueController';
import { cacheMiddleware } from '../../middleware/cache';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();

/**
 * GET /api/v1/leagues
 * Get all available leagues
 */
router.get('/',
  cacheMiddleware(3600), // 1 hour cache
  asyncHandler(leagueController.getAllLeagues.bind(leagueController))
);

/**
 * GET /api/v1/leagues/:id/season
 * Get league season data with analytics
 */
router.get('/:id/season',
  cacheMiddleware(1800), // 30 minute cache
  asyncHandler(leagueController.getLeagueSeason.bind(leagueController))
);

/**
 * GET /api/v1/leagues/:id/tables
 * Get league tables with advanced analytics
 */
router.get('/:id/tables',
  cacheMiddleware(900), // 15 minute cache
  asyncHandler(leagueController.getLeagueTables.bind(leagueController))
);

/**
 * GET /api/v1/leagues/:id/teams
 * Get teams in a league
 */
router.get('/:id/teams',
  cacheMiddleware(1800), // 30 minute cache
  asyncHandler(leagueController.getLeagueTeams.bind(leagueController))
);

/**
 * GET /api/v1/leagues/:id/matches
 * Get matches in a league
 */
router.get('/:id/matches',
  cacheMiddleware(600), // 10 minute cache
  asyncHandler(leagueController.getLeagueMatches.bind(leagueController))
);

/**
 * GET /api/v1/leagues/mapping
 * Get complete league mapping for all season IDs
 * ⚠️ TEMPORARILY DISABLED - Using matches/leagues/mapping instead
 */
// router.get('/mapping',
//   cacheMiddleware(7200), // 2 hour cache (league mapping changes rarely)
//   asyncHandler(leagueController.getLeagueMapping.bind(leagueController))
// );

/**
 * GET /api/v1/leagues/compare
 * Compare multiple leagues
 * ⚠️ TEMPORARILY DISABLED - Focus on core functionality
 */
// router.get('/compare',
//   cacheMiddleware(1200), // 20 minute cache
//   asyncHandler(leagueController.compareLeagues.bind(leagueController))
// );

export default router;
