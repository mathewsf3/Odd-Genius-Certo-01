/**
 * ⚽ Match Controller
 * 
 * Express.js controller that wraps the comprehensive MatchAnalysisService
 * Provides RESTful endpoints for football match data and analytics
 * 
 * Built on top of:
 * - MatchAnalysisService (830+ lines of football analytics)
 * - FootyStats API client with 16 endpoints
 * - Express.js middleware patterns
 */

import { NextFunction, Request, Response } from 'express';
import { BasicMatchInfo, DetailedMatchInfo, MatchAnalysisResult, MatchAnalysisService } from '../services/MatchAnalysisService';
import { liveMatchService } from '../services/liveMatchService';
import { logger } from '../utils/logger';

export class MatchController {
  private matchAnalysisService: MatchAnalysisService;

  constructor() {
    this.matchAnalysisService = new MatchAnalysisService();
  }

  /**
   * GET /api/v1/matches/total-count
   * Get total count of matches for today without loading all data
   * Optimized for dashboard statistics display
   */
  async getTotalMatchCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('📊 Getting total match count for dashboard');

      const date = req.query.date as string;
      const result = await this.matchAnalysisService.getTotalMatchCount(date);

      if (result.success) {
        res.json({
          success: true,
          totalMatches: result.totalMatches,
          message: `Total matches available: ${result.totalMatches}`,
          date: date || new Date().toISOString().split('T')[0]
        });
      } else {
        res.status(500).json({
          success: false,
          totalMatches: 0,
          message: 'Failed to get total match count',
          error: 'Unable to retrieve match count from API'
        });
      }
    } catch (error) {
      logger.error('❌ Error in getTotalMatchCount:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/matches/today
   * Get today's matches with basic information
   */
  async getTodaysMatches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('📅 Getting today\'s matches');
      
      const date = req.query.date as string || undefined;
      const result: BasicMatchInfo = await this.matchAnalysisService.getBasicMatchInfo(date);

      if (!result.success) {
        res.status(404).json({
          success: false,
          message: 'No matches found for today',
          error: result.error
        });
        return;
      }

      res.json({
        success: true,
        data: {
          selectedMatch: result.selectedMatch,
          totalMatches: result.totalMatches,
          date: date || new Date().toISOString().split('T')[0]
        },
        message: `Found ${result.totalMatches} matches`
      });

    } catch (error) {
      logger.error('Error getting today\'s matches:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/matches/:id
   * Get detailed information for a specific match
   */
  async getMatchById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(`🔍 MatchController.getMatchById - req.params:`, req.params);
      console.log(`🔍 MatchController.getMatchById - req.params.id:`, req.params.id);
      console.log(`🔍 MatchController.getMatchById - typeof req.params.id:`, typeof req.params.id);

      const matchId = parseInt(req.params.id);
      console.log(`🔍 MatchController.getMatchById - parsed matchId:`, matchId);
      console.log(`🔍 MatchController.getMatchById - typeof matchId:`, typeof matchId);

      if (isNaN(matchId)) {
        console.log(`❌ MatchController.getMatchById - matchId is NaN`);
        res.status(400).json({
          success: false,
          message: 'Invalid match ID format'
        });
        return;
      }

      logger.info(`🔍 Getting detailed info for match ${matchId}`);
      console.log(`🔍 MatchController.getMatchById - Calling getDetailedMatchInfo with matchId:`, matchId);
      console.log(`🔍 MatchController.getMatchById - this.matchAnalysisService:`, this.matchAnalysisService);
      console.log(`🔍 MatchController.getMatchById - typeof this.matchAnalysisService.getDetailedMatchInfo:`, typeof this.matchAnalysisService.getDetailedMatchInfo);
      console.log(`🔍 MatchController.getMatchById - About to call getDetailedMatchInfo...`);

      const result: DetailedMatchInfo = await this.matchAnalysisService.getDetailedMatchInfo(matchId);

      console.log(`🔍 MatchController.getMatchById - getDetailedMatchInfo returned:`, result);

      if (!result.success) {
        res.status(404).json({
          success: false,
          message: `Match ${matchId} not found`,
          error: result.error
        });
        return;
      }

      res.json({
        success: true,
        data: result.data,
        message: `Match ${matchId} details retrieved successfully`
      });

    } catch (error) {
      logger.error(`Error getting match ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/matches/:id/analysis
   * Get comprehensive analytics for a specific match
   */
  async getMatchAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const matchId = parseInt(req.params.id);
      
      if (isNaN(matchId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid match ID format'
        });
        return;
      }

      // Parse query parameters for analysis options
      const options = {
        matchId,
        includeTeamStats: req.query.includeTeamStats === 'true',
        includePlayerStats: req.query.includePlayerStats === 'true',
        includeRefereeStats: req.query.includeRefereeStats === 'true',
        includeH2H: req.query.includeH2H === 'true'
      };

      logger.info(`📊 Getting comprehensive analysis for match ${matchId}`, options);
      
      const result: MatchAnalysisResult = await this.matchAnalysisService.getMatchAnalysis(options);

      if (!result.success) {
        res.status(404).json({
          success: false,
          message: `Match analysis for ${matchId} not available`,
          error: result.error
        });
        return;
      }

      res.json({
        success: true,
        data: result.data,
        metadata: result.metadata,
        message: `Comprehensive analysis for match ${matchId} completed`
      });

    } catch (error) {
      logger.error(`Error analyzing match ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v1/matches/search
   * Search matches by various criteria
   */
  async searchMatches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { team, league, date, status, limit } = req.query;
      const limitNum = parseInt(limit as string) || 6;

      logger.info('🔍 Searching matches with criteria:', { team, league, date, status, limit: limitNum });

      // Handle upcoming matches specifically
      if (status === 'upcoming') {
        logger.info('📅 Getting upcoming matches');

        // Check for hours parameter (default 48 hours)
        const hours = parseInt(req.query.hours as string) || 48;
        const upcomingLimit = limit ? limitNum : undefined;

        logger.info(`Upcoming matches request: ${upcomingLimit ? `limited to ${upcomingLimit}` : 'unlimited'}, next ${hours} hours`);

        const upcomingMatches = await this.matchAnalysisService.getUpcomingMatches(upcomingLimit, hours);

        res.json({
          success: true,
          data: upcomingMatches,
          message: `Found ${upcomingMatches.length} upcoming matches${upcomingLimit ? ` (limited to ${upcomingLimit})` : ''} in next ${hours} hours`,
          isLimited: !!upcomingLimit,
          limit: upcomingLimit || null,
          hours: hours
        });
        return;
      }

      // Handle live matches
      if (status === 'live') {
        logger.info('⚡ Getting live matches via search');
        const liveLimit = limit ? limitNum : undefined;
        const liveMatches = await this.matchAnalysisService.getLiveMatches(liveLimit);

        res.json({
          success: true,
          data: liveMatches,
          message: `Found ${liveMatches.length} live matches${liveLimit ? ` (limited to ${liveLimit})` : ''}`,
          isLimited: !!liveLimit,
          limit: liveLimit || null
        });
        return;
      }

      // Default: return today's matches
      const result: BasicMatchInfo = await this.matchAnalysisService.getBasicMatchInfo(date as string);

      res.json({
        success: true,
        data: result.selectedMatch ? [result.selectedMatch] : [],
        message: 'Match search completed'
      });

    } catch (error) {
      logger.error('Error searching matches:', error);
      next(error);
    }
  }

  /**
   * DEBUG: Test today's matches directly
   */
  async debugTodaysMatches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('🚨 DEBUG: Testing today\'s matches directly');

      const result = await this.matchAnalysisService.debugTodaysMatches();

      res.json({
        success: true,
        data: result,
        message: 'Debug data retrieved successfully'
      });

    } catch (error) {
      logger.error('❌ Error in debug endpoint:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get debug data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/v1/matches/live
   * ✅ FIXED: Get live matches with real-time scores using new live service
   * Supports both limited (dashboard) and unlimited (page) requests
   */
  async getLiveMatches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('🔴 Getting live matches with real-time scores - FIXED VERSION');

      // Check if this is a request for all matches (live page) or limited (dashboard)
      const limitParam = req.query.limit as string;
      const limit = limitParam ? parseInt(limitParam) : undefined;
      const forceRefresh = req.query.refresh === 'true';

      logger.info(`Live matches request: ${limit ? `limited to ${limit}` : 'unlimited (all)'}, refresh: ${forceRefresh}`);

      // Use new live match service for real-time data
      const result = await liveMatchService.getLiveMatches(forceRefresh);

      if (!result.success) {
        res.status(500).json({
          success: false,
          message: 'Failed to get live matches',
          error: result.error
        });
        return;
      }

      // Apply limit if specified
      const liveMatches = limit ? result.data.slice(0, limit) : result.data;

      res.json({
        success: true,
        data: {
          liveMatches: liveMatches,
          totalLive: liveMatches.length,
          lastUpdated: result.metadata.lastUpdated,
          nextUpdate: result.metadata.nextUpdate,
          isLimited: !!limit,
          limit: limit || null
        },
        message: `Live matches retrieved successfully${limit ? ` (limited to ${limit})` : ' (all matches)'}`
      });

    } catch (error) {
      logger.error('Error getting live matches:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/matches/upcoming-count
   * Get total count of upcoming matches in next 24h without loading all data
   * Optimized for dashboard statistics display
   */
  async getUpcomingMatchesCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('📊 Getting total upcoming matches count');

      // Get all upcoming matches to count them (use high limit to get all matches)
      const allUpcomingMatches = await this.matchAnalysisService.getUpcomingMatches(1000);

      // Filter for next 24 hours
      const now = Math.floor(Date.now() / 1000);
      const next24h = now + (24 * 60 * 60);

      const matchesIn24h = allUpcomingMatches.filter((match: any) => {
        const matchTime = match.date_unix || 0;
        return matchTime > now && matchTime <= next24h;
      });

      logger.info(`📊 Found ${matchesIn24h.length} upcoming matches in next 24h`);

      res.json({
        success: true,
        totalUpcoming: allUpcomingMatches.length,
        totalIn24h: matchesIn24h.length,
        timestamp: new Date().toISOString(),
        message: `Found ${matchesIn24h.length} matches in next 24h (${allUpcomingMatches.length} total upcoming)`
      });
    } catch (error) {
      logger.error('Error getting upcoming matches count:', error);
      next(error);
    }
  }
}
