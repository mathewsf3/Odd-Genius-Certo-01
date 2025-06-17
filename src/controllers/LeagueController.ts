/**
 * 🏆 League Controller
 * 
 * Express.js controller for league-related endpoints
 * Integrates with LeagueAnalyticsService for comprehensive league analytics
 * 
 * Features:
 * - League information and season data
 * - League tables and standings
 * - Competition comparisons
 * - Multi-season trend analysis
 */

import { NextFunction, Request, Response } from 'express';
import { LeagueAnalyticsService } from '../analytics/league/LeagueAnalyticsService';
import { FootyStatsService } from '../services/FootyStatsService';
import { logger } from '../utils/logger';

export class LeagueController {
  private leagueAnalyticsService: LeagueAnalyticsService;
  private footyStatsService: FootyStatsService;

  constructor() {
    this.leagueAnalyticsService = new LeagueAnalyticsService();
    this.footyStatsService = new FootyStatsService();
  }

  /**
   * GET /api/v1/leagues
   * Get all available leagues
   */
  async getAllLeagues(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('🏆 Getting all leagues');
      
      const result = await this.footyStatsService.getLeagues();

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          endpoint: '/api/v1/leagues',
          timestamp: new Date().toISOString()
        },
        message: 'All leagues retrieved successfully'
      });

    } catch (error) {
      logger.error('Error getting all leagues:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/leagues/:id/season
   * Get league season data with analytics
   */
  async getLeagueSeason(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const leagueId = parseInt(req.params.id);
      const { season } = req.query;
      
      if (isNaN(leagueId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid league ID format'
        });
        return;
      }

      logger.info(`🏆 Getting league season data for ${leagueId}`);
      
      const result = await this.leagueAnalyticsService.analyzeLeagueSeason(leagueId, {
        includeTable: true,
        includeTrends: true,
        includeTopScorers: true
      });

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          leagueId,
          season,
          endpoint: `/api/v1/leagues/${leagueId}/season`,
          timestamp: new Date().toISOString()
        },
        message: `League ${leagueId} season data retrieved successfully`
      });

    } catch (error) {
      logger.error(`Error getting league season for ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/leagues/:id/tables
   * Get league tables with advanced analytics
   */
  async getLeagueTables(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const leagueId = parseInt(req.params.id);
      const { season } = req.query;
      
      if (isNaN(leagueId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid league ID format'
        });
        return;
      }

      logger.info(`📊 Getting league tables for ${leagueId}`);
      
      const result = await this.leagueAnalyticsService.getLeagueTablesWithAnalytics(leagueId);

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          leagueId,
          season,
          endpoint: `/api/v1/leagues/${leagueId}/tables`,
          timestamp: new Date().toISOString()
        },
        message: `League ${leagueId} tables retrieved successfully`
      });

    } catch (error) {
      logger.error(`Error getting league tables for ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/leagues/compare
   * Compare multiple leagues
   */
  async compareLeagues(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { leagues, season } = req.query;
      
      if (!leagues) {
        res.status(400).json({
          success: false,
          message: 'League IDs are required for comparison'
        });
        return;
      }

      const leagueIds = (leagues as string).split(',').map(id => parseInt(id.trim()));
      
      if (leagueIds.some(id => isNaN(id))) {
        res.status(400).json({
          success: false,
          message: 'Invalid league ID format in comparison list'
        });
        return;
      }

      logger.info(`🔍 Comparing leagues: ${leagueIds.join(', ')}`);
      
      const result = await this.leagueAnalyticsService.compareCompetitions(leagueIds, {
        includeQuality: true,
        includeCompetitiveness: true
      });

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          leagueIds,
          season,
          endpoint: '/api/v1/leagues/compare',
          timestamp: new Date().toISOString()
        },
        message: `League comparison completed for ${leagueIds.length} leagues`
      });

    } catch (error) {
      logger.error('Error comparing leagues:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/leagues/:id/teams
   * Get teams in a league with analytics
   */
  async getLeagueTeams(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const leagueId = parseInt(req.params.id);
      const { season } = req.query;
      
      if (isNaN(leagueId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid league ID format'
        });
        return;
      }

      logger.info(`🏟️ Getting teams for league ${leagueId}`);
      
      const result = await this.footyStatsService.getLeagueTeams(leagueId);

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          leagueId,
          season,
          endpoint: `/api/v1/leagues/${leagueId}/teams`,
          timestamp: new Date().toISOString()
        },
        message: `Teams for league ${leagueId} retrieved successfully`
      });

    } catch (error) {
      logger.error(`Error getting teams for league ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/leagues/:id/matches
   * Get matches in a league
   */
  async getLeagueMatches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const leagueId = parseInt(req.params.id);
      const { season, page } = req.query;
      
      if (isNaN(leagueId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid league ID format'
        });
        return;
      }

      logger.info(`⚽ Getting matches for league ${leagueId}`);
      
      const result = await this.footyStatsService.getLeagueMatches(
        leagueId,
        { page: parseInt(page as string) || 1 }
      );

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          leagueId,
          season,
          page: parseInt(page as string) || 1,
          endpoint: `/api/v1/leagues/${leagueId}/matches`,
          timestamp: new Date().toISOString()
        },
        message: `Matches for league ${leagueId} retrieved successfully`
      });

    } catch (error) {
      logger.error(`Error getting matches for league ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/leagues/mapping
   * Get complete league mapping for all season IDs
   */
  async getLeagueMapping(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('🗺️ Getting complete league mapping');

      const result = await this.footyStatsService.getLeagues();

      if (!result.success || !result.data) {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch leagues',
          metadata: {
            endpoint: '/api/v1/leagues/mapping',
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      // Create mapping from season ID to league name
      const seasonMapping: { [seasonId: number]: string } = {};
      let totalSeasons = 0;

      result.data.forEach((league: any) => {
        if (league.season && Array.isArray(league.season)) {
          league.season.forEach((season: any) => {
            if (season.id) {
              seasonMapping[season.id] = league.name;
              totalSeasons++;
            }
          });
        }
      });

      logger.info(`✅ Created mapping for ${totalSeasons} seasons across ${result.data.length} leagues`);

      res.json({
        success: true,
        data: {
          mapping: seasonMapping,
          totalLeagues: result.data.length,
          totalSeasons: totalSeasons,
          leagues: result.data
        },
        metadata: {
          ...result.metadata,
          endpoint: '/api/v1/leagues/mapping',
          timestamp: new Date().toISOString()
        },
        message: 'Complete league mapping retrieved successfully'
      });

    } catch (error) {
      logger.error('Error getting league mapping:', error);
      next(error);
    }
  }
}

export default new LeagueController();
