/**
 * 🏟️ Team Routes
 * RESTful routes for team data and statistics
 */

import { Router } from 'express';
import { DefaultService } from '../../apis/footy';
import { cacheMiddleware } from '../../middleware/cache';
import { rateLimiter } from '../../middleware/rateLimiter';
import { logger } from '../../utils/logger';

const router = Router();

// Apply rate limiting to all team routes
router.use(rateLimiter.matches);

// Log all team route access
router.use((req, res, next) => {
  logger.info(`Team route accessed: ${req.method} ${req.path}`, {
    query: req.query,
    params: req.params,
    ip: req.ip
  });
  next();
});

/**
 * GET /api/v1/teams/:id/matches
 * Get recent matches for a specific team
 * Cache: 5 minutes
 */
router.get('/:id/matches', cacheMiddleware(300), async (req, res) => {
  try {
    const teamId = parseInt(req.params.id);
    const limit = parseInt(req.query.limit as string) || 10;
    const timezone = req.query.timezone as string || 'UTC';

    if (isNaN(teamId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid team ID',
        message: 'Team ID must be a valid number'
      });
    }

    logger.info(`🏆 Fetching last ${limit} matches for team ${teamId}`);

    // Use FootyStats API to get team's last X stats (which includes recent matches)
    // Get team's recent matches using the lastx endpoint
    const response = await DefaultService.getTeamLastXStats({
      teamId: teamId
    });

    if (!response || !response.data) {
      return res.status(404).json({
        success: false,
        error: 'No matches found',
        message: `No recent matches found for team ${teamId}`
      });
    }

    // Extract matches from the lastx stats response
    const statsData = response.data;
    const matches = statsData.matches || statsData.last_matches || [];
    logger.info(`✅ Found ${matches.length} matches for team ${teamId}`);

    res.json({
      success: true,
      data: matches,
      meta: {
        teamId,
        limit,
        total: matches.length,
        timezone
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`❌ Error fetching team matches:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch team matches',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    });
  }
});

// Placeholder routes - to be implemented
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Team endpoints',
    availableEndpoints: [
      'GET /:id - Get team information',
      'GET /:id/stats - Get team statistics',
      'GET /:id/matches - Get team matches (✅ IMPLEMENTED)'
    ]
  });
});

export default router;
