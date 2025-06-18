/**
 * 🏟️ Team Controller
 * 
 * Express.js controller for team-related endpoints
 * Integrates with FootyStats API for comprehensive team data
 * 
 * Features:
 * - Team information and statistics
 * - Recent team performance
 * - Team-based analytics
 */

import { NextFunction, Request, Response } from 'express';
import { DefaultService } from '../apis/footy';
import { cacheKeys } from '../cache/CacheKeys';
import { CacheService } from '../services/CacheService';
import { logger } from '../utils/logger';

const API_KEY = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756';

export class TeamController {
  private cacheService: CacheService;

  constructor() {
    this.cacheService = new CacheService({
      enableRedis: process.env.ENABLE_REDIS_CACHE === 'true',
      enableMemory: true,
      defaultTtl: 1800, // 30 minutes default for team data
      maxMemoryUsage: 50 * 1024 * 1024, // 50MB
      redisUrl: process.env.REDIS_URL,
      redisToken: process.env.REDIS_TOKEN
    });

    logger.info('✅ TeamController initialized with caching layer');
  }

  /**
   * GET /api/v1/teams/:id
   * Get detailed information for a specific team
   */
  async getTeamById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teamId = parseInt(req.params.id);
      
      if (isNaN(teamId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid team ID format'
        });
        return;
      }

      logger.info(`🏟️ Getting team info for ${teamId} with caching`);

      // Use cache-aside pattern for team data
      const cacheKey = cacheKeys.team.data(teamId);

      try {
        // 1. Check cache first
        const cached = await this.cacheService.get(cacheKey);
        if (cached) {
          logger.debug(`🎯 Cache HIT: Team data ${teamId}`);
          res.json({
            success: true,
            data: cached,
            message: `Team ${teamId} information retrieved successfully`,
            cached: true
          });
          return;
        }

        // 2. Cache miss - fetch from API
        logger.debug(`📡 Cache MISS: Fetching team data ${teamId} from API`);
        const teamData = await DefaultService.getTeam({ teamId, key: API_KEY });

        // 3. Store in cache
        await this.cacheService.set(cacheKey, teamData, {
          ttl: 1800, // 30 minutes for team data
          tags: ['teams', `team-${teamId}`],
          compress: true
        });

        res.json({
          success: true,
          data: teamData,
          message: `Team ${teamId} information retrieved successfully`,
          cached: false
        });
      } catch (error) {
        logger.error(`❌ Error getting team data ${teamId}:`, error);
        throw error;
      }

    } catch (error) {
      logger.error(`Error getting team ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/teams/:id/stats
   * Get recent performance statistics for a team
   */
  async getTeamStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teamId = parseInt(req.params.id);
      const lastX = parseInt(req.query.lastX as string) || 5;
      
      if (isNaN(teamId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid team ID format'
        });
        return;
      }

      if (![5, 6, 10].includes(lastX)) {
        res.status(400).json({
          success: false,
          message: 'lastX parameter must be 5, 6, or 10'
        });
        return;
      }

      logger.info(`📊 Getting last ${lastX} stats for team ${teamId} with caching`);

      // Use cache-aside pattern for team stats
      const cacheKey = cacheKeys.team.stats(teamId, lastX);

      try {
        // 1. Check cache first
        const cached = await this.cacheService.get(cacheKey);
        if (cached) {
          logger.debug(`🎯 Cache HIT: Team stats ${teamId}`);
          res.json({
            success: true,
            data: cached,
            metadata: {
              teamId,
              lastXMatches: lastX,
              timestamp: new Date().toISOString(),
              cached: true
            },
            message: `Last ${lastX} statistics for team ${teamId} retrieved successfully`
          });
          return;
        }

        // 2. Cache miss - fetch from API
        logger.debug(`📡 Cache MISS: Fetching team stats ${teamId} from API`);
        const statsData = await DefaultService.getTeamLastXStats({ teamId, key: API_KEY });

        // 3. Store in cache
        await this.cacheService.set(cacheKey, statsData, {
          ttl: 1800, // 30 minutes for team stats
          tags: ['teams', 'stats', `team-${teamId}`],
          compress: true
        });

        res.json({
          success: true,
          data: statsData,
          metadata: {
            teamId,
            lastXMatches: lastX,
            timestamp: new Date().toISOString(),
            cached: false
          },
          message: `Last ${lastX} statistics for team ${teamId} retrieved successfully`
        });
      } catch (error) {
        logger.error(`❌ Error getting team stats ${teamId}:`, error);
        throw error;
      }

    } catch (error) {
      logger.error(`Error getting team stats for ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/teams/search
   * Search teams (placeholder for future implementation)
   */
  async searchTeams(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, league, country } = req.query;

      logger.info('🔍 Searching teams with criteria:', { name, league, country });

      res.json({
        success: true,
        data: {
          teams: [],
          totalResults: 0,
          searchCriteria: { name, league, country }
        },
        message: 'Team search functionality coming soon'
      });

    } catch (error) {
      logger.error('Error searching teams:', error);
      next(error);
    }
  }
}

export default new TeamController();
