/**
 * 👤 Player Routes
 * RESTful routes for player data, statistics, and analytics
 */

import { Router } from 'express';
import playerController from '../../controllers/PlayerController';
import { cacheMiddleware } from '../../middleware/cache';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();

/**
 * GET /api/v1/players/:id
 * Get detailed player statistics
 */
router.get('/:id',
  cacheMiddleware(1800), // 30 minute cache
  asyncHandler(playerController.getPlayerById.bind(playerController))
);

/**
 * GET /api/v1/players/:id/analysis
 * Get comprehensive player performance analysis
 */
router.get('/:id/analysis',
  cacheMiddleware(1200), // 20 minute cache
  asyncHandler(playerController.getPlayerAnalysis.bind(playerController))
);

/**
 * GET /api/v1/players/rankings
 * Get player rankings with analytics
 */
router.get('/rankings',
  cacheMiddleware(900), // 15 minute cache
  asyncHandler(playerController.getPlayerRankings.bind(playerController))
);

/**
 * GET /api/v1/players/compare
 * Compare multiple players
 */
router.get('/compare',
  cacheMiddleware(1200), // 20 minute cache
  asyncHandler(playerController.comparePlayers.bind(playerController))
);

/**
 * GET /api/v1/players/league/:leagueId
 * Get all players in a league
 */
router.get('/league/:leagueId',
  cacheMiddleware(1800), // 30 minute cache
  asyncHandler(playerController.getLeaguePlayers.bind(playerController))
);

// Referee routes (handled by PlayerController)

/**
 * GET /api/v1/referees/:id
 * Get referee statistics and analysis
 */
router.get('/referees/:id',
  cacheMiddleware(1800), // 30 minute cache
  asyncHandler(playerController.getRefereeById.bind(playerController))
);

/**
 * GET /api/v1/referees/:id/analysis
 * Get comprehensive referee performance analysis
 */
router.get('/referees/:id/analysis',
  cacheMiddleware(1200), // 20 minute cache
  asyncHandler(playerController.getRefereeAnalysis.bind(playerController))
);

/**
 * GET /api/v1/referees/league/:leagueId
 * Get all referees in a league
 */
router.get('/referees/league/:leagueId',
  cacheMiddleware(1800), // 30 minute cache
  asyncHandler(playerController.getLeagueReferees.bind(playerController))
);

export default router;
