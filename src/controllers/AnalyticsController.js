"use strict";
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
exports.AnalyticsController = void 0;
const BettingAnalyticsService_1 = require("../analytics/betting/BettingAnalyticsService");
const LeagueAnalyticsService_1 = require("../analytics/league/LeagueAnalyticsService");
const MatchAnalyticsService_1 = require("../analytics/match/MatchAnalyticsService");
const PlayerAnalyticsService_1 = require("../analytics/player/PlayerAnalyticsService");
const TeamAnalyticsService_1 = require("../analytics/team/TeamAnalyticsService");
const FootyStatsService_1 = require("../services/FootyStatsService");
const logger_1 = require("../utils/logger");
class AnalyticsController {
    constructor() {
        this.matchAnalyticsService = new MatchAnalyticsService_1.MatchAnalyticsService();
        this.teamAnalyticsService = new TeamAnalyticsService_1.TeamAnalyticsService();
        this.leagueAnalyticsService = new LeagueAnalyticsService_1.LeagueAnalyticsService();
        this.playerAnalyticsService = new PlayerAnalyticsService_1.PlayerAnalyticsService();
        this.bettingAnalyticsService = new BettingAnalyticsService_1.BettingAnalyticsService();
        this.footyStatsService = new FootyStatsService_1.FootyStatsService();
    }
    /**
     * GET /api/v1/analytics/match/:id
     * Get comprehensive match analytics
     */
    getMatchAnalytics(req, res, next) {
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
                logger_1.logger.info(`📊 Getting comprehensive analytics for match ${matchId}`);
                // For prediction, we need both team IDs. For now, use a placeholder approach
                // In a real implementation, you'd get the match details first to extract team IDs
                const result = yield this.matchAnalyticsService.getLiveMatchInsights(matchId);
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { matchId, analyticsType: 'comprehensive_match', endpoint: `/api/v1/analytics/match/${matchId}`, timestamp: new Date().toISOString() }),
                    message: `Comprehensive analytics for match ${matchId} completed`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting match analytics for ${req.params.id}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/analytics/team/:id
     * Get comprehensive team analytics
     */
    getTeamAnalytics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                logger_1.logger.info(`📊 Getting comprehensive analytics for team ${teamId}`);
                const result = yield this.teamAnalyticsService.analyzeTeamPerformance(teamId, {
                    includeForm: true,
                    includeHomeAway: true,
                    formMatches: 10
                });
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { teamId,
                        season, analyticsType: 'comprehensive_team', endpoint: `/api/v1/analytics/team/${teamId}`, timestamp: new Date().toISOString() }),
                    message: `Comprehensive analytics for team ${teamId} completed`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting team analytics for ${req.params.id}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/analytics/league/:id
     * Get comprehensive league analytics
     */
    getLeagueAnalytics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                logger_1.logger.info(`📊 Getting comprehensive analytics for league ${leagueId}`);
                const result = yield this.leagueAnalyticsService.analyzeLeagueSeason(leagueId, {
                    includeTable: true,
                    includeTrends: true,
                    includeTopScorers: true
                });
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { leagueId,
                        season, analyticsType: 'comprehensive_league', endpoint: `/api/v1/analytics/league/${leagueId}`, timestamp: new Date().toISOString() }),
                    message: `Comprehensive analytics for league ${leagueId} completed`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting league analytics for ${req.params.id}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/analytics/player/:id
     * Get comprehensive player analytics
     */
    getPlayerAnalytics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                logger_1.logger.info(`📊 Getting comprehensive analytics for player ${playerId}`);
                const result = yield this.playerAnalyticsService.analyzePlayerPerformance(playerId, {
                    includeForm: true,
                    includeConsistency: true,
                    includeImpact: true
                });
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { playerId,
                        season, analyticsType: 'comprehensive_player', endpoint: `/api/v1/analytics/player/${playerId}`, timestamp: new Date().toISOString() }),
                    message: `Comprehensive analytics for player ${playerId} completed`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting player analytics for ${req.params.id}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/analytics/betting/match/:id
     * Get betting analytics for a match
     */
    getMatchBettingAnalytics(req, res, next) {
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
                logger_1.logger.info(`💰 Getting betting analytics for match ${matchId}`);
                const result = yield this.bettingAnalyticsService.analyzeBettingMarkets({
                    includeValueBets: true,
                    includeAdvancedInsights: true
                });
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { matchId, analyticsType: 'betting_market', endpoint: `/api/v1/analytics/betting/match/${matchId}`, timestamp: new Date().toISOString() }),
                    message: `Betting analytics for match ${matchId} completed`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting betting analytics for match ${req.params.id}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/analytics/predictions/today
     * Get predictions for today's matches
     */
    getTodaysPredictions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info('🔮 Getting predictions for today\'s matches');
                // Get today's matches first, then run prediction engine
                const todaysMatches = yield this.footyStatsService.getTodaysMatches();
                if (!todaysMatches.success || !todaysMatches.data) {
                    throw new Error('Failed to get today\'s matches');
                }
                const result = yield this.bettingAnalyticsService.runPredictionEngine(todaysMatches.data, {
                    includeForm: true,
                    confidenceThreshold: 0.7
                });
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { analyticsType: 'daily_predictions', endpoint: '/api/v1/analytics/predictions/today', timestamp: new Date().toISOString() }),
                    message: 'Today\'s match predictions generated successfully'
                });
            }
            catch (error) {
                logger_1.logger.error('Error getting today\'s predictions:', error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/analytics/teams/compare
     * Compare multiple teams
     */
    compareTeams(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { teams, season } = req.query;
                if (!teams) {
                    res.status(400).json({
                        success: false,
                        message: 'Team IDs are required for comparison'
                    });
                    return;
                }
                const teamIds = teams.split(',').map(id => parseInt(id.trim()));
                if (teamIds.some(id => isNaN(id)) || teamIds.length < 2) {
                    res.status(400).json({
                        success: false,
                        message: 'At least 2 valid team IDs are required for comparison'
                    });
                    return;
                }
                logger_1.logger.info(`🔍 Comparing teams: ${teamIds.join(', ')}`);
                const result = yield this.teamAnalyticsService.compareTeams(teamIds[0], teamIds[1], {
                    includeH2H: true,
                    includeForm: true,
                    formMatches: 10
                });
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { teamIds,
                        season, analyticsType: 'team_comparison', endpoint: '/api/v1/analytics/teams/compare', timestamp: new Date().toISOString() }),
                    message: `Team comparison completed for ${teamIds.length} teams`
                });
            }
            catch (error) {
                logger_1.logger.error('Error comparing teams:', error);
                next(error);
            }
        });
    }
}
exports.AnalyticsController = AnalyticsController;
exports.default = new AnalyticsController();
