"use strict";
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
exports.PlayerController = void 0;
const PlayerAnalyticsService_1 = require("../analytics/player/PlayerAnalyticsService");
const FootyStatsService_1 = require("../services/FootyStatsService");
const logger_1 = require("../utils/logger");
class PlayerController {
    constructor() {
        this.playerAnalyticsService = new PlayerAnalyticsService_1.PlayerAnalyticsService();
        this.footyStatsService = new FootyStatsService_1.FootyStatsService();
    }
    /**
     * GET /api/v1/players/:id
     * Get detailed player statistics
     */
    getPlayerById(req, res, next) {
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
                logger_1.logger.info(`👤 Getting player stats for ${playerId}`);
                const result = yield this.footyStatsService.getPlayerStats(playerId);
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { playerId,
                        season, endpoint: `/api/v1/players/${playerId}`, timestamp: new Date().toISOString() }),
                    message: `Player ${playerId} statistics retrieved successfully`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting player ${req.params.id}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/players/:id/analysis
     * Get comprehensive player performance analysis
     */
    getPlayerAnalysis(req, res, next) {
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
                logger_1.logger.info(`📊 Getting player analysis for ${playerId}`);
                const result = yield this.playerAnalyticsService.analyzePlayerPerformance(playerId, {
                    includeForm: true,
                    includeConsistency: true,
                    includeImpact: true
                });
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { playerId,
                        season, analyticsType: 'player_performance', endpoint: `/api/v1/players/${playerId}/analysis`, timestamp: new Date().toISOString() }),
                    message: `Player ${playerId} performance analysis completed`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting player analysis for ${req.params.id}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/players/rankings
     * Get player rankings with analytics
     */
    getPlayerRankings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { league, season, position, metric } = req.query;
                logger_1.logger.info('🏆 Getting player rankings', { league, season, position, metric });
                // Use analyzeLeaguePlayers instead of rankPlayers
                const leagueId = league ? parseInt(league) : 1; // Default to league 1
                const result = yield this.playerAnalyticsService.analyzeLeaguePlayers(leagueId, {
                    maxPlayers: 50,
                    includeTopPerformers: true,
                    includeComparisons: true
                });
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { league,
                        season,
                        position,
                        metric, analyticsType: 'player_rankings', endpoint: '/api/v1/players/rankings', timestamp: new Date().toISOString() }),
                    message: 'Player rankings retrieved successfully'
                });
            }
            catch (error) {
                logger_1.logger.error('Error getting player rankings:', error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/players/compare
     * Compare multiple players
     */
    comparePlayers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { players, season } = req.query;
                if (!players) {
                    res.status(400).json({
                        success: false,
                        message: 'Player IDs are required for comparison'
                    });
                    return;
                }
                const playerIds = players.split(',').map(id => parseInt(id.trim()));
                if (playerIds.some(id => isNaN(id)) || playerIds.length < 2) {
                    res.status(400).json({
                        success: false,
                        message: 'At least 2 valid player IDs are required for comparison'
                    });
                    return;
                }
                logger_1.logger.info(`🔍 Comparing players: ${playerIds.join(', ')}`);
                const result = yield this.playerAnalyticsService.comparePlayers(playerIds[0], playerIds[1]);
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { playerIds,
                        season, analyticsType: 'player_comparison', endpoint: '/api/v1/players/compare', timestamp: new Date().toISOString() }),
                    message: `Player comparison completed for ${playerIds.length} players`
                });
            }
            catch (error) {
                logger_1.logger.error('Error comparing players:', error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/players/league/:leagueId
     * Get all players in a league
     */
    getLeaguePlayers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                logger_1.logger.info(`👥 Getting players for league ${leagueId}`);
                const result = yield this.footyStatsService.getLeaguePlayers(leagueId);
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { leagueId,
                        season, endpoint: `/api/v1/players/league/${leagueId}`, timestamp: new Date().toISOString() }),
                    message: `Players for league ${leagueId} retrieved successfully`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting players for league ${req.params.leagueId}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/referees/:id
     * Get referee statistics and analysis
     */
    getRefereeById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                logger_1.logger.info(`👨‍⚖️ Getting referee stats for ${refereeId}`);
                const result = yield this.footyStatsService.getRefereeStats(refereeId);
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { refereeId,
                        season, endpoint: `/api/v1/referees/${refereeId}`, timestamp: new Date().toISOString() }),
                    message: `Referee ${refereeId} statistics retrieved successfully`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting referee ${req.params.id}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/referees/:id/analysis
     * Get comprehensive referee performance analysis
     */
    getRefereeAnalysis(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                logger_1.logger.info(`📊 Getting referee analysis for ${refereeId}`);
                const result = yield this.playerAnalyticsService.analyzeRefereePerformance(refereeId, {
                    includeImpact: true,
                    includeTeamEffects: true
                });
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { refereeId,
                        season, analyticsType: 'referee_performance', endpoint: `/api/v1/referees/${refereeId}/analysis`, timestamp: new Date().toISOString() }),
                    message: `Referee ${refereeId} performance analysis completed`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting referee analysis for ${req.params.id}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/referees/league/:leagueId
     * Get all referees in a league
     */
    getLeagueReferees(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                logger_1.logger.info(`👨‍⚖️ Getting referees for league ${leagueId}`);
                const result = yield this.footyStatsService.getLeagueReferees(leagueId);
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { leagueId,
                        season, endpoint: `/api/v1/referees/league/${leagueId}`, timestamp: new Date().toISOString() }),
                    message: `Referees for league ${leagueId} retrieved successfully`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting referees for league ${req.params.leagueId}:`, error);
                next(error);
            }
        });
    }
}
exports.PlayerController = PlayerController;
exports.default = new PlayerController();
