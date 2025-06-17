"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchController = void 0;
const MatchAnalysisService_1 = require("../services/MatchAnalysisService");
const logger_1 = require("../utils/logger");
class MatchController {
    constructor() {
        this.matchAnalysisService = new MatchAnalysisService_1.MatchAnalysisService();
    }
    /**
     * GET /api/v1/matches/total-count
     * Get total count of matches for today without loading all data
     * Optimized for dashboard statistics display
     */
    getTotalMatchCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info('📊 Getting total match count for dashboard');
                const date = req.query.date;
                const result = yield this.matchAnalysisService.getTotalMatchCount(date);
                if (!result.success) {
                    res.status(500).json({
                        success: false,
                        error: 'Failed to get total match count',
                        message: 'Unable to retrieve match statistics',
                        timestamp: new Date().toISOString()
                    });
                    return;
                }
                res.json({
                    success: true,
                    totalMatches: result.totalMatches,
                    timestamp: new Date().toISOString(),
                    message: `Found ${result.totalMatches} total matches`
                });
            }
            catch (error) {
                logger_1.logger.error('Error getting total match count:', error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/matches/today
     * Get today's matches with basic information
     */
    getTodaysMatches(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info('📅 Getting today\'s matches');
                const date = req.query.date || undefined;
                const result = yield this.matchAnalysisService.getBasicMatchInfo(date);
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
            }
            catch (error) {
                logger_1.logger.error('Error getting today\'s matches:', error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/matches/:id
     * Get detailed information for a specific match
     */
    getMatchById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const matchId = parseInt(req.params.id);
                if (isNaN(matchId)) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid match ID format'
                    });
                    return;
                }
                logger_1.logger.info(`🔍 Getting detailed info for match ${matchId}`);
                const result = yield this.matchAnalysisService.getDetailedMatchInfo(matchId);
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
            }
            catch (error) {
                logger_1.logger.error(`Error getting match ${req.params.id}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/matches/:id/analysis
     * Get comprehensive analytics for a specific match
     */
    getMatchAnalysis(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                logger_1.logger.info(`📊 Getting comprehensive analysis for match ${matchId}`, options);
                const result = yield this.matchAnalysisService.getMatchAnalysis(options);
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
            }
            catch (error) {
                logger_1.logger.error(`Error analyzing match ${req.params.id}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/matches/search
     * Search matches by various criteria
     */
    searchMatches(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { team, league, date, status, limit } = req.query;
                const limitNum = parseInt(limit) || 6;
                logger_1.logger.info('🔍 Searching matches with criteria:', { team, league, date, status, limit: limitNum });
                // Handle upcoming matches specifically
                if (status === 'upcoming') {
                    logger_1.logger.info('📅 Getting upcoming matches');
                    const upcomingMatches = yield this.matchAnalysisService.getUpcomingMatches(limitNum);
                    res.json({
                        success: true,
                        data: upcomingMatches,
                        message: `Found ${upcomingMatches.length} upcoming matches`
                    });
                    return;
                }
                // Handle live matches
                if (status === 'live') {
                    logger_1.logger.info('⚡ Getting live matches via search');
                    const liveMatches = yield this.matchAnalysisService.getLiveMatches(limitNum);
                    res.json({
                        success: true,
                        data: liveMatches,
                        message: `Found ${liveMatches.length} live matches`
                    });
                    return;
                }
                // Default: return today's matches
                const result = yield this.matchAnalysisService.getBasicMatchInfo(date);
                res.json({
                    success: true,
                    data: result.selectedMatch ? [result.selectedMatch] : [],
                    message: 'Match search completed'
                });
            }
            catch (error) {
                logger_1.logger.error('Error searching matches:', error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/matches/live
     * Get live matches and their current status with true total count
     */
    getLiveMatches(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info('⚡ Getting live matches with total count');
                // ✅ FIXED: No forced default - let caller specify limit
                // Dashboard will pass ?limit=6, Live page will pass no limit
                const limitParam = req.query.limit;
                const limit = limitParam ? parseInt(limitParam) : undefined;

                // Get limited matches for display
                const liveMatches = yield this.matchAnalysisService.getLiveMatches(limit);

                // Get total count of ALL live matches (no limit)
                const allLiveMatches = yield this.matchAnalysisService.getLiveMatches();
                const totalLiveCount = allLiveMatches.length;

                logger_1.logger.info(`📊 Returning ${liveMatches.length} live matches (${totalLiveCount} total available)`);

                res.json({
                    success: true,
                    data: {
                        liveMatches: liveMatches,
                        totalLive: totalLiveCount, // TRUE total count
                        displayedCount: liveMatches.length,
                        lastUpdated: new Date().toISOString()
                    },
                    message: `Live matches retrieved successfully (${liveMatches.length} of ${totalLiveCount})`
                });
            }
            catch (error) {
                logger_1.logger.error('Error getting live matches:', error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/matches/upcoming-count
     * Get total count of upcoming matches in next 24h without loading all data
     */
    getUpcomingMatchesCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info('📊 Getting total upcoming matches count');

                // Get all upcoming matches to count them
                const allUpcomingMatches = yield this.matchAnalysisService.getUpcomingMatches(1000);

                // Filter for next 24 hours
                const now = Math.floor(Date.now() / 1000);
                const next24h = now + (24 * 60 * 60);

                const matchesIn24h = allUpcomingMatches.filter((match) => {
                    const matchTime = match.date_unix || 0;
                    return matchTime > now && matchTime <= next24h;
                });

                logger_1.logger.info(`📊 Found ${matchesIn24h.length} upcoming matches in next 24h`);

                res.json({
                    success: true,
                    totalUpcoming: allUpcomingMatches.length,
                    totalIn24h: matchesIn24h.length,
                    timestamp: new Date().toISOString(),
                    message: `Found ${matchesIn24h.length} matches in next 24h (${allUpcomingMatches.length} total upcoming)`
                });
            }
            catch (error) {
                logger_1.logger.error('Error getting upcoming matches count:', error);
                next(error);
            }
        });
    }
}
exports.MatchController = MatchController;
