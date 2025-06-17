"use strict";
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
exports.StatsController = void 0;
const BettingAnalyticsService_1 = require("../analytics/betting/BettingAnalyticsService");
const FootyStatsService_1 = require("../services/FootyStatsService");
const logger_1 = require("../utils/logger");
class StatsController {
    constructor() {
        this.bettingAnalyticsService = new BettingAnalyticsService_1.BettingAnalyticsService();
        this.footyStatsService = new FootyStatsService_1.FootyStatsService();
    }
    /**
     * GET /api/v1/stats/btts
     * Get Both Teams To Score statistics
     */
    getBttsStats(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { league, season, team } = req.query;
                logger_1.logger.info('⚽ Getting BTTS statistics', { league, season, team });
                const result = yield this.footyStatsService.getBttsStats();
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { league,
                        season,
                        team, statisticType: 'btts', endpoint: '/api/v1/stats/btts', timestamp: new Date().toISOString() }),
                    message: 'BTTS statistics retrieved successfully'
                });
            }
            catch (error) {
                logger_1.logger.error('Error getting BTTS stats:', error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/stats/over25
     * Get Over 2.5 goals statistics
     */
    getOver25Stats(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { league, season, team } = req.query;
                logger_1.logger.info('📊 Getting Over 2.5 statistics', { league, season, team });
                const result = yield this.footyStatsService.getOver25Stats();
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { league,
                        season,
                        team, statisticType: 'over25', endpoint: '/api/v1/stats/over25', timestamp: new Date().toISOString() }),
                    message: 'Over 2.5 goals statistics retrieved successfully'
                });
            }
            catch (error) {
                logger_1.logger.error('Error getting Over 2.5 stats:', error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/stats/betting/market/:matchId
     * Get betting market analysis for a specific match
     */
    getBettingMarketAnalysis(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const matchId = parseInt(req.params.matchId);
                if (isNaN(matchId)) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid match ID format'
                    });
                    return;
                }
                logger_1.logger.info(`💰 Getting betting market analysis for match ${matchId}`);
                const result = yield this.bettingAnalyticsService.analyzeBettingMarkets({
                    includeValueBets: true,
                    includeAdvancedInsights: true
                });
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { matchId, analyticsType: 'betting_market', endpoint: `/api/v1/stats/betting/market/${matchId}`, timestamp: new Date().toISOString() }),
                    message: `Betting market analysis for match ${matchId} completed`
                });
            }
            catch (error) {
                logger_1.logger.error(`Error getting betting market analysis for match ${req.params.matchId}:`, error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/stats/betting/value-bets
     * Get value bet opportunities
     */
    getValueBets(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { league, date, minValue } = req.query;
                logger_1.logger.info('💎 Getting value bet opportunities', { league, date, minValue });
                const result = yield this.bettingAnalyticsService.analyzeBettingMarkets({
                    includeValueBets: true,
                    includeAdvancedInsights: true
                });
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { league,
                        date,
                        minValue, analyticsType: 'value_bets', endpoint: '/api/v1/stats/betting/value-bets', timestamp: new Date().toISOString() }),
                    message: 'Value bet opportunities identified successfully'
                });
            }
            catch (error) {
                logger_1.logger.error('Error getting value bets:', error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/stats/betting/strategy
     * Get betting strategy recommendations
     */
    getBettingStrategy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bankroll, riskLevel, timeframe } = req.query;
                logger_1.logger.info('🎯 Getting betting strategy recommendations', { bankroll, riskLevel, timeframe });
                const result = yield this.bettingAnalyticsService.analyzeBettingMarkets({
                    includeValueBets: true,
                    includeAdvancedInsights: true,
                    includeStrategies: true
                });
                res.json({
                    success: true,
                    data: result.data,
                    metadata: Object.assign(Object.assign({}, result.metadata), { bankroll,
                        riskLevel,
                        timeframe, analyticsType: 'betting_strategy', endpoint: '/api/v1/stats/betting/strategy', timestamp: new Date().toISOString() }),
                    message: 'Betting strategy recommendations generated successfully'
                });
            }
            catch (error) {
                logger_1.logger.error('Error getting betting strategy:', error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/stats/trends/goals
     * Get goal scoring trends and patterns
     */
    getGoalTrends(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { league, season, timeframe } = req.query;
                logger_1.logger.info('📈 Getting goal trends', { league, season, timeframe });
                // Use BTTS and Over 2.5 stats as base for goal trends
                const bttsResult = yield this.footyStatsService.getBttsStats();
                const over25Result = yield this.footyStatsService.getOver25Stats();
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
            }
            catch (error) {
                logger_1.logger.error('Error getting goal trends:', error);
                next(error);
            }
        });
    }
    /**
     * GET /api/v1/stats/summary
     * Get comprehensive statistics summary
     */
    getStatsSummary(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { league, season } = req.query;
                logger_1.logger.info('📊 Getting comprehensive stats summary', { league, season });
                // Get multiple statistics for comprehensive summary
                const [bttsResult, over25Result] = yield Promise.all([
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
            }
            catch (error) {
                logger_1.logger.error('Error getting stats summary:', error);
                next(error);
            }
        });
    }
}
exports.StatsController = StatsController;
exports.default = new StatsController();
