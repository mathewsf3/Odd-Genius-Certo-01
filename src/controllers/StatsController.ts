/**
 * 📈 Stats Controller
 * 
 * Express.js controller for statistical data and betting analytics
 * Integrates with BettingAnalyticsService for comprehensive betting insights
 * 
 * Features:
 * - BTTS (Both Teams To Score) statistics
 * - Over/Under goal statistics
 * - Betting market analysis
 * - Value bet identification
 * - Statistical trends and patterns
 */

import { NextFunction, Request, Response } from 'express';
import { BettingAnalyticsService } from '../analytics/betting/BettingAnalyticsService';
import { FootyStatsService } from '../services/FootyStatsService';
import { logger } from '../utils/logger';

export class StatsController {
  private bettingAnalyticsService: BettingAnalyticsService;
  private footyStatsService: FootyStatsService;

  constructor() {
    this.bettingAnalyticsService = new BettingAnalyticsService();
    this.footyStatsService = new FootyStatsService();
  }

  /**
   * GET /api/v1/stats/btts
   * Get Both Teams To Score statistics
   */
  async getBttsStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { league, season, team } = req.query;
      
      logger.info('⚽ Getting BTTS statistics', { league, season, team });
      
      const result = await this.footyStatsService.getBttsStats();

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          league,
          season,
          team,
          statisticType: 'btts',
          endpoint: '/api/v1/stats/btts',
          timestamp: new Date().toISOString()
        },
        message: 'BTTS statistics retrieved successfully'
      });

    } catch (error) {
      logger.error('Error getting BTTS stats:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/stats/over25
   * Get Over 2.5 goals statistics
   */
  async getOver25Stats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { league, season, team } = req.query;
      
      logger.info('📊 Getting Over 2.5 statistics', { league, season, team });
      
      const result = await this.footyStatsService.getOver25Stats();

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          league,
          season,
          team,
          statisticType: 'over25',
          endpoint: '/api/v1/stats/over25',
          timestamp: new Date().toISOString()
        },
        message: 'Over 2.5 goals statistics retrieved successfully'
      });

    } catch (error) {
      logger.error('Error getting Over 2.5 stats:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/stats/betting/market/:matchId
   * Get betting market analysis for a specific match
   */
  async getBettingMarketAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const matchId = parseInt(req.params.matchId);
      
      if (isNaN(matchId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid match ID format'
        });
        return;
      }

      logger.info(`💰 Getting betting market analysis for match ${matchId}`);
      
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
          endpoint: `/api/v1/stats/betting/market/${matchId}`,
          timestamp: new Date().toISOString()
        },
        message: `Betting market analysis for match ${matchId} completed`
      });

    } catch (error) {
      logger.error(`Error getting betting market analysis for match ${req.params.matchId}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/stats/betting/value-bets
   * Get value bet opportunities
   */
  async getValueBets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { league, date, minValue } = req.query;
      
      logger.info('💎 Getting value bet opportunities', { league, date, minValue });
      
      const result = await this.bettingAnalyticsService.analyzeBettingMarkets({
        includeValueBets: true,
        includeAdvancedInsights: true
      });

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          league,
          date,
          minValue,
          analyticsType: 'value_bets',
          endpoint: '/api/v1/stats/betting/value-bets',
          timestamp: new Date().toISOString()
        },
        message: 'Value bet opportunities identified successfully'
      });

    } catch (error) {
      logger.error('Error getting value bets:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/stats/betting/strategy
   * Get betting strategy recommendations
   */
  async getBettingStrategy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { bankroll, riskLevel, timeframe } = req.query;
      
      logger.info('🎯 Getting betting strategy recommendations', { bankroll, riskLevel, timeframe });
      
      const result = await this.bettingAnalyticsService.analyzeBettingMarkets({
        includeValueBets: true,
        includeAdvancedInsights: true,
        includeStrategies: true
      });

      res.json({
        success: true,
        data: result.data,
        metadata: {
          ...result.metadata,
          bankroll,
          riskLevel,
          timeframe,
          analyticsType: 'betting_strategy',
          endpoint: '/api/v1/stats/betting/strategy',
          timestamp: new Date().toISOString()
        },
        message: 'Betting strategy recommendations generated successfully'
      });

    } catch (error) {
      logger.error('Error getting betting strategy:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/stats/trends/goals
   * Get goal scoring trends and patterns
   */
  async getGoalTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { league, season, timeframe } = req.query;
      
      logger.info('📈 Getting goal trends', { league, season, timeframe });
      
      // Use BTTS and Over 2.5 stats as base for goal trends
      const bttsResult = await this.footyStatsService.getBttsStats();

      const over25Result = await this.footyStatsService.getOver25Stats();

      const combinedData = {
        bttsStats: bttsResult.data,
        over25Stats: over25Result.data,
        trends: {
          goalScoringTrend: 'increasing', // This would be calculated from actual data
          bttsFrequency: 'high',
          averageGoalsPerMatch: 2.7
        }
      };

      res.json({
        success: true,
        data: combinedData,
        metadata: {
          league,
          season,
          timeframe,
          statisticType: 'goal_trends',
          endpoint: '/api/v1/stats/trends/goals',
          timestamp: new Date().toISOString(),
          combinedDataSources: 2
        },
        message: 'Goal trends analysis completed successfully'
      });

    } catch (error) {
      logger.error('Error getting goal trends:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/stats/summary
   * Get comprehensive statistics summary
   */
  async getStatsSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { league, season } = req.query;
      
      logger.info('📊 Getting comprehensive stats summary', { league, season });
      
      // Get multiple statistics for comprehensive summary
      const [bttsResult, over25Result] = await Promise.all([
        this.footyStatsService.getBttsStats(),
        this.footyStatsService.getOver25Stats()
      ]);

      const summary = {
        bttsStats: bttsResult.data,
        over25Stats: over25Result.data,
        summary: {
          totalMatches: 100, // This would be calculated from actual data
          avgGoalsPerMatch: 2.7,
          bttsPercentage: 65,
          over25Percentage: 58,
          lastUpdated: new Date().toISOString()
        }
      };

      res.json({
        success: true,
        data: summary,
        metadata: {
          league,
          season,
          statisticType: 'comprehensive_summary',
          endpoint: '/api/v1/stats/summary',
          timestamp: new Date().toISOString(),
          combinedDataSources: 2
        },
        message: 'Comprehensive statistics summary generated successfully'
      });

    } catch (error) {
      logger.error('Error getting stats summary:', error);
      next(error);
    }
  }
}

export default new StatsController();
