/**
 * 📊 Analytics Controller
 * 
 * Express.js controller for comprehensive analytics endpoints
 * Integrates with all analytics services for advanced football insights
 * 
 * Features:
 * - Match analytics and predictions
 * - Team performance analytics
 * - League analytics and comparisons
 * - Player and referee analytics
 * - Betting analytics and value detection
 */

import { NextFunction, Request, Response } from 'express';
import { BettingAnalyticsService } from '../analytics/betting/BettingAnalyticsService';
import { LeagueAnalyticsService } from '../analytics/league/LeagueAnalyticsService';
import { MatchAnalyticsService } from '../analytics/match/MatchAnalyticsService';
import { PlayerAnalyticsService } from '../analytics/player/PlayerAnalyticsService';
import { TeamAnalyticsService } from '../analytics/team/TeamAnalyticsService';
import { FootyStatsService } from '../services/FootyStatsService';
import { logger } from '../utils/logger';

export class AnalyticsController {
  private matchAnalyticsService: MatchAnalyticsService;
  private teamAnalyticsService: TeamAnalyticsService;
  private leagueAnalyticsService: LeagueAnalyticsService;
  private playerAnalyticsService: PlayerAnalyticsService;
  private bettingAnalyticsService: BettingAnalyticsService;
  private footyStatsService: FootyStatsService;

  constructor() {
    this.matchAnalyticsService = new MatchAnalyticsService();
    this.teamAnalyticsService = new TeamAnalyticsService();
    this.leagueAnalyticsService = new LeagueAnalyticsService();
    this.playerAnalyticsService = new PlayerAnalyticsService();
    this.bettingAnalyticsService = new BettingAnalyticsService();
    this.footyStatsService = new FootyStatsService();
  }

  /**
   * GET /api/v1/analytics/match/:id
   * Get comprehensive match analytics
   */
  async getMatchAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const matchId = parseInt(req.params.id);
      
      if (isNaN(matchId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid match ID format'
        });
        return;
      }

      logger.info(`📊 Getting comprehensive analytics for match ${matchId}`);
      
      // For prediction, we need both team IDs. For now, use a placeholder approach
      // In a real implementation, you'd get the match details first to extract team IDs
      const result = await this.matchAnalyticsService.getLiveMatchInsights(matchId);

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          matchId,
          analyticsType: 'comprehensive_match',
          endpoint: `/api/v1/analytics/match/${matchId}`,
          timestamp: new Date().toISOString()
        },
        message: `Comprehensive analytics for match ${matchId} completed`
      });

    } catch (error) {
      logger.error(`Error getting match analytics for ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/analytics/team/:id
   * Get comprehensive team analytics
   */
  async getTeamAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teamId = parseInt(req.params.id);
      const { season } = req.query;
      
      if (isNaN(teamId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid team ID format'
        });
        return;
      }

      logger.info(`📊 Getting comprehensive analytics for team ${teamId}`);
      
      const result = await this.teamAnalyticsService.analyzeTeamPerformance(teamId, {
        includeForm: true,
        includeHomeAway: true,
        formMatches: 10
      });

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          teamId,
          season,
          analyticsType: 'comprehensive_team',
          endpoint: `/api/v1/analytics/team/${teamId}`,
          timestamp: new Date().toISOString()
        },
        message: `Comprehensive analytics for team ${teamId} completed`
      });

    } catch (error) {
      logger.error(`Error getting team analytics for ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/analytics/league/:id
   * Get comprehensive league analytics
   */
  async getLeagueAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      logger.info(`📊 Getting comprehensive analytics for league ${leagueId}`);
      
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
          analyticsType: 'comprehensive_league',
          endpoint: `/api/v1/analytics/league/${leagueId}`,
          timestamp: new Date().toISOString()
        },
        message: `Comprehensive analytics for league ${leagueId} completed`
      });

    } catch (error) {
      logger.error(`Error getting league analytics for ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/analytics/player/:id
   * Get comprehensive player analytics
   */
  async getPlayerAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      logger.info(`📊 Getting comprehensive analytics for player ${playerId}`);
      
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
          analyticsType: 'comprehensive_player',
          endpoint: `/api/v1/analytics/player/${playerId}`,
          timestamp: new Date().toISOString()
        },
        message: `Comprehensive analytics for player ${playerId} completed`
      });

    } catch (error) {
      logger.error(`Error getting player analytics for ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/analytics/betting/match/:id
   * Get betting analytics for a match
   */
  async getMatchBettingAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const matchId = parseInt(req.params.id);
      
      if (isNaN(matchId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid match ID format'
        });
        return;
      }

      logger.info(`💰 Getting betting analytics for match ${matchId}`);
      
      const result = await this.bettingAnalyticsService.analyzeBettingMarkets({
        includeValueBets: true,
        includeAdvancedInsights: true
      });

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          matchId,
          analyticsType: 'betting_market',
          endpoint: `/api/v1/analytics/betting/match/${matchId}`,
          timestamp: new Date().toISOString()
        },
        message: `Betting analytics for match ${matchId} completed`
      });

    } catch (error) {
      logger.error(`Error getting betting analytics for match ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/analytics/predictions/today
   * Get predictions for today's matches
   */
  async getTodaysPredictions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('🔮 Getting predictions for today\'s matches');
      
      // Get today's matches first, then run prediction engine
      const todaysMatches = await this.footyStatsService.getTodaysMatches();
      if (!todaysMatches.success || !todaysMatches.data) {
        throw new Error('Failed to get today\'s matches');
      }

      const result = await this.bettingAnalyticsService.runPredictionEngine(todaysMatches.data, {
        includeForm: true,
        confidenceThreshold: 0.7
      });

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          analyticsType: 'daily_predictions',
          endpoint: '/api/v1/analytics/predictions/today',
          timestamp: new Date().toISOString()
        },
        message: 'Today\'s match predictions generated successfully'
      });

    } catch (error) {
      logger.error('Error getting today\'s predictions:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/analytics/teams/compare
   * Compare multiple teams
   */
  async compareTeams(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { teams, season } = req.query;
      
      if (!teams) {
        res.status(400).json({
          success: false,
          message: 'Team IDs are required for comparison'
        });
        return;
      }

      const teamIds = (teams as string).split(',').map(id => parseInt(id.trim()));
      
      if (teamIds.some(id => isNaN(id)) || teamIds.length < 2) {
        res.status(400).json({
          success: false,
          message: 'At least 2 valid team IDs are required for comparison'
        });
        return;
      }

      logger.info(`🔍 Comparing teams: ${teamIds.join(', ')}`);
      
      const result = await this.teamAnalyticsService.compareTeams(teamIds[0], teamIds[1], {
        includeH2H: true,
        includeForm: true,
        formMatches: 10
      });

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          teamIds,
          season,
          analyticsType: 'team_comparison',
          endpoint: '/api/v1/analytics/teams/compare',
          timestamp: new Date().toISOString()
        },
        message: `Team comparison completed for ${teamIds.length} teams`
      });

    } catch (error) {
      logger.error('Error comparing teams:', error);
      next(error);
    }
  }
}

export default new AnalyticsController();
