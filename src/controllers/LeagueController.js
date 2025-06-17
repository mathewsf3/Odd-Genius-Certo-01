"use strict";
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
exports.LeagueController = void 0;
const LeagueAnalyticsService_1 = require("../analytics/league/LeagueAnalyticsService");
const FootyStatsService_1 = require("../services/FootyStatsService");
const logger_1 = require("../utils/logger");
class LeagueController {
    constructor() {
        this.leagueAnalyticsService = new LeagueAnalyticsService_1.LeagueAnalyticsService();
        this.footyStatsService = new FootyStatsService_1.FootyStatsService();
    }
    /**
     * GET /api/v1/leagues
     * Get all available leagues
     */
    getAllLeagues(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info('🏆 Getting all leagues');
                const result = yield this.footyStatsService.getLeagues();
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { endpoint: '/api/v1/leagues', timestamp: new Date().toISOString() }),
                    message: 'All leagues retrieved successfully'
                });
            }
            catch (error) {
                logger_1.logger.error('Error getting all leagues:', error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/leagues/:id/season
     * Get league season data with analytics
     */
    getLeagueSeason(req, res, next) {
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
                logger_1.logger.info(`🏆 Getting league season data for ${leagueId}`);
                const result = yield this.leagueAnalyticsService.analyzeLeagueSeason(leagueId, {
                    includeTable: true,
                    includeTrends: true,
                    includeTopScorers: true
                });
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { leagueId,
                        season, endpoint: `/api/v1/leagues/${leagueId}/season`, timestamp: new Date().toISOString() }),
                    message: `League ${leagueId} season data retrieved successfully`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting league season for ${req.params.id}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/leagues/:id/tables
     * Get league tables with advanced analytics
     */
    getLeagueTables(req, res, next) {
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
                logger_1.logger.info(`📊 Getting league tables for ${leagueId}`);
                const result = yield this.leagueAnalyticsService.getLeagueTablesWithAnalytics(leagueId);
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { leagueId,
                        season, endpoint: `/api/v1/leagues/${leagueId}/tables`, timestamp: new Date().toISOString() }),
                    message: `League ${leagueId} tables retrieved successfully`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting league tables for ${req.params.id}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/leagues/compare
     * Compare multiple leagues
     */
    compareLeagues(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { leagues, season } = req.query;
                if (!leagues) {
                    res.status(400).json({
                        success: false,
                        message: 'League IDs are required for comparison'
                    });
                    return;
                }
                const leagueIds = leagues.split(',').map(id => parseInt(id.trim()));
                if (leagueIds.some(id => isNaN(id))) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid league ID format in comparison list'
                    });
                    return;
                }
                logger_1.logger.info(`🔍 Comparing leagues: ${leagueIds.join(', ')}`);
                const result = yield this.leagueAnalyticsService.compareCompetitions(leagueIds, {
                    includeQuality: true,
                    includeCompetitiveness: true
                });
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { leagueIds,
                        season, endpoint: '/api/v1/leagues/compare', timestamp: new Date().toISOString() }),
                    message: `League comparison completed for ${leagueIds.length} leagues`
                });
            }
            catch (error) {
                logger_1.logger.error('Error comparing leagues:', error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/leagues/:id/teams
     * Get teams in a league with analytics
     */
    getLeagueTeams(req, res, next) {
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
                logger_1.logger.info(`🏟️ Getting teams for league ${leagueId}`);
                const result = yield this.footyStatsService.getLeagueTeams(leagueId);
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { leagueId,
                        season, endpoint: `/api/v1/leagues/${leagueId}/teams`, timestamp: new Date().toISOString() }),
                    message: `Teams for league ${leagueId} retrieved successfully`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting teams for league ${req.params.id}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/leagues/:id/matches
     * Get matches in a league
     */
    getLeagueMatches(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                logger_1.logger.info(`⚽ Getting matches for league ${leagueId}`);
                const result = yield this.footyStatsService.getLeagueMatches(leagueId, { page: parseInt(page) || 1 });
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { leagueId,
                        season, page: parseInt(page) || 1, endpoint: `/api/v1/leagues/${leagueId}/matches`, timestamp: new Date().toISOString() }),
                    message: `Matches for league ${leagueId} retrieved successfully`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting matches for league ${req.params.id}:`, error);
                next(error);
            }
        });
    }
}
exports.LeagueController = LeagueController;
exports.default = new LeagueController();
