/**
 * 👤 Player Controller
 * 
 * Express.js controller for player and referee-related endpoints
 * Integrates with PlayerAnalyticsService for comprehensive personnel analytics
 * 
 * Features:
 * - Player performance analysis
 * - Player rankings and comparisons
 * - Referee performance analysis
 * - League players and referees data
 */

import { NextFunction, Request, Response } from 'express';
import { PlayerAnalyticsService } from '../analytics/player/PlayerAnalyticsService';
import { FootyStatsService } from '../services/FootyStatsService';
import { logger } from '../utils/logger';

export class PlayerController {
  private playerAnalyticsService: PlayerAnalyticsService;
  private footyStatsService: FootyStatsService;

  constructor() {
    this.playerAnalyticsService = new PlayerAnalyticsService();
    this.footyStatsService = new FootyStatsService();
  }

  /**
   * GET /api/v1/players/:id
   * Get detailed player statistics
   */
  async getPlayerById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const playerId = parseInt(req.params.id);
      const { season } = req.query;
      
      if (isNaN(playerId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid player ID format'
        });
        return;
      }

      logger.info(`👤 Getting player stats for ${playerId}`);
      
      const result = await this.footyStatsService.getPlayerStats(playerId);

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          playerId,
          season,
          endpoint: `/api/v1/players/${playerId}`,
          timestamp: new Date().toISOString()
        },
        message: `Player ${playerId} statistics retrieved successfully`
      });

    } catch (error) {
      logger.error(`Error getting player ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/players/:id/analysis
   * Get comprehensive player performance analysis
   */
  async getPlayerAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const playerId = parseInt(req.params.id);
      const { season } = req.query;
      
      if (isNaN(playerId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid player ID format'
        });
        return;
      }

      logger.info(`📊 Getting player analysis for ${playerId}`);
      
      const result = await this.playerAnalyticsService.analyzePlayerPerformance(playerId, {
        includeForm: true,
        includeConsistency: true,
        includeImpact: true
      });

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          playerId,
          season,
          analyticsType: 'player_performance',
          endpoint: `/api/v1/players/${playerId}/analysis`,
          timestamp: new Date().toISOString()
        },
        message: `Player ${playerId} performance analysis completed`
      });

    } catch (error) {
      logger.error(`Error getting player analysis for ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/players/rankings
   * Get player rankings with analytics
   */
  async getPlayerRankings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { league, season, position, metric } = req.query;
      
      logger.info('🏆 Getting player rankings', { league, season, position, metric });
      
      // Use analyzeLeaguePlayers instead of rankPlayers
      const leagueId = league ? parseInt(league as string) : 1; // Default to league 1
      const result = await this.playerAnalyticsService.analyzeLeaguePlayers(leagueId, {
        maxPlayers: 50,
        includeTopPerformers: true,
        includeComparisons: true
      });

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          league,
          season,
          position,
          metric,
          analyticsType: 'player_rankings',
          endpoint: '/api/v1/players/rankings',
          timestamp: new Date().toISOString()
        },
        message: 'Player rankings retrieved successfully'
      });

    } catch (error) {
      logger.error('Error getting player rankings:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/players/compare
   * Compare multiple players
   */
  async comparePlayers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { players, season } = req.query;
      
      if (!players) {
        res.status(400).json({
          success: false,
          message: 'Player IDs are required for comparison'
        });
        return;
      }

      const playerIds = (players as string).split(',').map(id => parseInt(id.trim()));
      
      if (playerIds.some(id => isNaN(id)) || playerIds.length < 2) {
        res.status(400).json({
          success: false,
          message: 'At least 2 valid player IDs are required for comparison'
        });
        return;
      }

      logger.info(`🔍 Comparing players: ${playerIds.join(', ')}`);
      
      const result = await this.playerAnalyticsService.comparePlayers(playerIds[0], playerIds[1]);

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          playerIds,
          season,
          analyticsType: 'player_comparison',
          endpoint: '/api/v1/players/compare',
          timestamp: new Date().toISOString()
        },
        message: `Player comparison completed for ${playerIds.length} players`
      });

    } catch (error) {
      logger.error('Error comparing players:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/players/league/:leagueId
   * Get all players in a league
   */
  async getLeaguePlayers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const leagueId = parseInt(req.params.leagueId);
      const { season } = req.query;
      
      if (isNaN(leagueId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid league ID format'
        });
        return;
      }

      logger.info(`👥 Getting players for league ${leagueId}`);
      
      const result = await this.footyStatsService.getLeaguePlayers(leagueId);

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          leagueId,
          season,
          endpoint: `/api/v1/players/league/${leagueId}`,
          timestamp: new Date().toISOString()
        },
        message: `Players for league ${leagueId} retrieved successfully`
      });

    } catch (error) {
      logger.error(`Error getting players for league ${req.params.leagueId}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/referees/:id
   * Get referee statistics and analysis
   */
  async getRefereeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refereeId = parseInt(req.params.id);
      const { season } = req.query;
      
      if (isNaN(refereeId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid referee ID format'
        });
        return;
      }

      logger.info(`👨‍⚖️ Getting referee stats for ${refereeId}`);
      
      const result = await this.footyStatsService.getRefereeStats(refereeId);

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          refereeId,
          season,
          endpoint: `/api/v1/referees/${refereeId}`,
          timestamp: new Date().toISOString()
        },
        message: `Referee ${refereeId} statistics retrieved successfully`
      });

    } catch (error) {
      logger.error(`Error getting referee ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/referees/:id/analysis
   * Get comprehensive referee performance analysis
   */
  async getRefereeAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refereeId = parseInt(req.params.id);
      const { season } = req.query;
      
      if (isNaN(refereeId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid referee ID format'
        });
        return;
      }

      logger.info(`📊 Getting referee analysis for ${refereeId}`);
      
      const result = await this.playerAnalyticsService.analyzeRefereePerformance(refereeId, {
        includeImpact: true,
        includeTeamEffects: true
      });

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          refereeId,
          season,
          analyticsType: 'referee_performance',
          endpoint: `/api/v1/referees/${refereeId}/analysis`,
          timestamp: new Date().toISOString()
        },
        message: `Referee ${refereeId} performance analysis completed`
      });

    } catch (error) {
      logger.error(`Error getting referee analysis for ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/referees/league/:leagueId
   * Get all referees in a league
   */
  async getLeagueReferees(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const leagueId = parseInt(req.params.leagueId);
      const { season } = req.query;
      
      if (isNaN(leagueId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid league ID format'
        });
        return;
      }

      logger.info(`👨‍⚖️ Getting referees for league ${leagueId}`);
      
      const result = await this.footyStatsService.getLeagueReferees(leagueId);

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          leagueId,
          season,
          endpoint: `/api/v1/referees/league/${leagueId}`,
          timestamp: new Date().toISOString()
        },
        message: `Referees for league ${leagueId} retrieved successfully`
      });

    } catch (error) {
      logger.error(`Error getting referees for league ${req.params.leagueId}:`, error);
      next(error);
    }
  }
}

export default new PlayerController();
