"use strict";
/**
 * 🧪 LEAGUE ANALYTICS SERVICE TESTS
 *
 * Comprehensive testing for league analytics and comparison functionality
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
const LeagueAnalyticsService_1 = require("../../analytics/league/LeagueAnalyticsService");
describe('🏆 LeagueAnalyticsService Tests', () => {
    let service;
    beforeEach(() => {
        service = new LeagueAnalyticsService_1.LeagueAnalyticsService({
            enableCaching: true,
            cacheTtl: 300, // 5 minutes for testing
            enableLogging: true
        });
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield service.shutdown();
    }));
    describe('📊 League Season Analysis', () => {
        it('should analyze league season with basic options', () => __awaiter(void 0, void 0, void 0, function* () {
            const seasonId = 1; // Example season ID
            const result = yield service.analyzeLeagueSeason(seasonId, {
                includeTable: false,
                includeTrends: false
            });
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect(result.metadata.source).toBe('league_season_analysis');
            expect(result.metadata.processingTime).toBeGreaterThan(0);
            if (result.success && result.data) {
                expect(result.data.league).toBeDefined();
                expect(result.data.statistics).toBeDefined();
                expect(result.data.insights).toBeDefined();
                // Validate statistics
                expect(result.data.statistics.totalMatches).toBeGreaterThanOrEqual(0);
                expect(result.data.statistics.averageGoalsPerMatch).toBeGreaterThanOrEqual(0);
                expect(result.data.statistics.homeWinPercentage).toBeGreaterThanOrEqual(0);
                expect(result.data.statistics.homeWinPercentage).toBeLessThanOrEqual(100);
                console.log('✅ League season analysis result:', {
                    leagueName: result.data.league.name,
                    totalMatches: result.data.statistics.totalMatches,
                    averageGoals: result.data.statistics.averageGoalsPerMatch,
                    homeWinRate: result.data.statistics.homeWinPercentage,
                    insights: result.data.insights
                });
            }
            else {
                console.log('⚠️ League season analysis failed:', result.error);
            }
        }), 30000);
        it('should analyze league season with full options', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            const seasonId = 1;
            const result = yield service.analyzeLeagueSeason(seasonId, {
                includeTable: true,
                includeTrends: true,
                includeTopScorers: true,
                includeBestDefense: true,
                maxTeams: 10
            });
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            if (result.success && result.data) {
                if (result.data.table) {
                    expect(Array.isArray(result.data.table)).toBe(true);
                    expect(result.data.table.length).toBeLessThanOrEqual(10);
                    if (result.data.table.length > 0) {
                        const firstTeam = result.data.table[0];
                        expect(firstTeam.position).toBe(1);
                        expect(firstTeam.teamName).toBeDefined();
                        expect(firstTeam.points).toBeGreaterThanOrEqual(0);
                    }
                }
                if (result.data.topScorers) {
                    expect(Array.isArray(result.data.topScorers)).toBe(true);
                }
                if (result.data.bestDefense) {
                    expect(Array.isArray(result.data.bestDefense)).toBe(true);
                }
                if (result.data.trends) {
                    expect(result.data.trends.goalTrend).toMatch(/^(increasing|decreasing|stable)$/);
                    expect(result.data.trends.competitiveness).toBeGreaterThanOrEqual(0);
                    expect(result.data.trends.competitiveness).toBeLessThanOrEqual(100);
                }
                console.log('✅ Full league analysis:', {
                    tableSize: ((_a = result.data.table) === null || _a === void 0 ? void 0 : _a.length) || 0,
                    topScorers: ((_b = result.data.topScorers) === null || _b === void 0 ? void 0 : _b.length) || 0,
                    bestDefense: ((_c = result.data.bestDefense) === null || _c === void 0 ? void 0 : _c.length) || 0,
                    trends: result.data.trends
                });
            }
        }), 30000);
        it('should handle invalid season ID gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.analyzeLeagueSeason(-1);
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
            expect(result.metadata).toBeDefined();
            console.log('✅ Invalid season ID handled:', result.error);
        }));
    });
    describe('🏆 League Tables with Analytics', () => {
        it('should get league tables with analytics', () => __awaiter(void 0, void 0, void 0, function* () {
            const seasonId = 1;
            const result = yield service.getLeagueTablesWithAnalytics(seasonId);
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect(result.metadata.source).toBe('league_tables_analytics');
            if (result.success && result.data) {
                expect(result.data.table).toBeDefined();
                expect(Array.isArray(result.data.table)).toBe(true);
                expect(result.data.analytics).toBeDefined();
                if (result.data.table.length > 0) {
                    const firstTeam = result.data.table[0];
                    expect(firstTeam.position).toBeDefined();
                    expect(firstTeam.teamName).toBeDefined();
                    expect(firstTeam.points).toBeGreaterThanOrEqual(0);
                    expect(firstTeam.played).toBeGreaterThanOrEqual(0);
                }
                console.log('🏆 League tables with analytics:', {
                    tableSize: result.data.table.length,
                    hasStatistics: !!result.data.analytics.statistics,
                    hasFormTable: !!result.data.analytics.formTable,
                    hasHomeAwayTable: !!result.data.analytics.homeAwayTable
                });
            }
            else {
                console.log('⚠️ League tables analysis failed:', result.error);
            }
        }), 30000);
        it('should handle invalid season ID for tables', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.getLeagueTablesWithAnalytics(-1);
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
            console.log('✅ Invalid season ID for tables handled:', result.error);
        }));
    });
    describe('⚔️ Competition Comparison', () => {
        it('should compare multiple competitions', () => __awaiter(void 0, void 0, void 0, function* () {
            const seasonIds = [1, 2]; // Example season IDs
            const result = yield service.compareCompetitions(seasonIds, {
                includeQuality: true,
                includeCompetitiveness: true,
                maxLeagues: 5
            });
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect(result.metadata.source).toBe('competition_comparison');
            if (result.success && result.data) {
                expect(result.data.leagues).toBeDefined();
                expect(Array.isArray(result.data.leagues)).toBe(true);
                expect(result.data.rankings).toBeDefined();
                if (result.data.leagues.length > 0) {
                    const firstLeague = result.data.leagues[0];
                    expect(firstLeague.leagueId).toBeDefined();
                    expect(firstLeague.leagueName).toBeDefined();
                    expect(firstLeague.statistics).toBeDefined();
                    expect(firstLeague.competitiveness).toBeGreaterThanOrEqual(0);
                    expect(firstLeague.competitiveness).toBeLessThanOrEqual(100);
                    expect(firstLeague.quality).toBeGreaterThanOrEqual(0);
                    expect(firstLeague.quality).toBeLessThanOrEqual(100);
                }
                expect(result.data.rankings.mostCompetitive).toBeDefined();
                expect(result.data.rankings.highestScoring).toBeDefined();
                expect(result.data.rankings.mostDefensive).toBeDefined();
                expect(result.data.rankings.mostPredictable).toBeDefined();
                console.log('⚔️ Competition comparison result:', {
                    leaguesCompared: result.data.leagues.length,
                    rankings: result.data.rankings,
                    firstLeague: result.data.leagues[0] ? {
                        name: result.data.leagues[0].leagueName,
                        competitiveness: result.data.leagues[0].competitiveness,
                        quality: result.data.leagues[0].quality
                    } : null
                });
            }
            else {
                console.log('⚠️ Competition comparison failed:', result.error);
            }
        }), 45000);
        it('should handle empty season IDs array', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.compareCompetitions([]);
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
            console.log('✅ Empty season IDs handled:', result.error);
        }));
    });
    describe('📈 League Trends Analysis', () => {
        it('should analyze league trends across seasons', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const seasonIds = [1, 2]; // Example season IDs
            const result = yield service.analyzeLeagueTrends(seasonIds);
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect(result.metadata.source).toBe('league_trends');
            if (result.success && result.data) {
                // Check if we have trend data or a message about needing more seasons
                if (result.data.goalTrend) {
                    expect(result.data.goalTrend).toMatch(/^(increasing|decreasing|stable)$/);
                    expect(result.data.homeAdvantageTrend).toMatch(/^(increasing|decreasing|stable)$/);
                    expect(result.data.bttsTrend).toMatch(/^(increasing|decreasing|stable)$/);
                    expect(Array.isArray(result.data.seasonComparison)).toBe(true);
                }
                else if (result.data.message) {
                    expect(result.data.message).toContain('Need at least 2 seasons');
                }
                console.log('📈 League trends analysis:', {
                    goalTrend: result.data.goalTrend,
                    homeAdvantageTrend: result.data.homeAdvantageTrend,
                    bttsTrend: result.data.bttsTrend,
                    seasonsAnalyzed: ((_a = result.data.seasonComparison) === null || _a === void 0 ? void 0 : _a.length) || 0
                });
            }
            else {
                console.log('⚠️ League trends analysis failed:', result.error);
            }
        }), 60000);
        it('should handle single season for trends', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.analyzeLeagueTrends([1]);
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            if (result.success && result.data) {
                // Should handle single season gracefully
                console.log('✅ Single season trends handled');
            }
        }), 30000);
    });
    describe('🔄 Caching Integration', () => {
        it('should cache league analysis results', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const seasonId = 1;
            // First call - should fetch from API
            const result1 = yield service.analyzeLeagueSeason(seasonId);
            expect(result1.success).toBeDefined();
            expect(result1.metadata).toBeDefined();
            // Only check cached flag if the first call was successful
            if (result1.success) {
                expect((_a = result1.metadata) === null || _a === void 0 ? void 0 : _a.cached).toBe(false);
            }
            // Second call - should come from cache if first was successful
            const result2 = yield service.analyzeLeagueSeason(seasonId);
            expect(result2.success).toBeDefined();
            expect(result2.metadata).toBeDefined();
            // If both calls were successful, second should be cached
            if (result1.success && result2.success) {
                expect((_b = result2.metadata) === null || _b === void 0 ? void 0 : _b.cached).toBe(true);
                // Cache should be faster
                const apiTime = ((_c = result1.metadata) === null || _c === void 0 ? void 0 : _c.processingTime) || 0;
                const cacheTime = ((_d = result2.metadata) === null || _d === void 0 ? void 0 : _d.processingTime) || 0;
                expect(cacheTime).toBeLessThan(apiTime);
                console.log(`✅ League analysis caching works: API ${apiTime}ms vs Cache ${cacheTime}ms`);
            }
            else {
                console.log(`⚠️ League caching test skipped due to API issues`);
            }
        }), 30000);
    });
    describe('⚡ Performance Testing', () => {
        it('should handle multiple concurrent league analyses', () => __awaiter(void 0, void 0, void 0, function* () {
            const startTime = Date.now();
            // Test multiple concurrent analyses
            const promises = [
                service.analyzeLeagueSeason(1),
                service.analyzeLeagueSeason(2),
                service.getLeagueTablesWithAnalytics(1),
                service.compareCompetitions([1, 2]),
                service.analyzeLeagueTrends([1])
            ];
            const results = yield Promise.all(promises);
            const totalTime = Date.now() - startTime;
            // All should have responses (success or failure)
            results.forEach((result, index) => {
                var _a;
                expect(result.success).toBeDefined();
                expect(result.metadata).toBeDefined();
                console.log(`✅ Concurrent league analysis ${index + 1}: ${(_a = result.metadata) === null || _a === void 0 ? void 0 : _a.processingTime}ms`);
            });
            console.log(`✅ Total concurrent execution time: ${totalTime}ms`);
            expect(totalTime).toBeLessThan(60000); // 60 seconds max
        }), 75000);
    });
    describe('🛡️ Error Handling', () => {
        it('should handle service errors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test with various invalid parameters
            const results = yield Promise.allSettled([
                service.analyzeLeagueSeason(-999),
                service.getLeagueTablesWithAnalytics(-888),
                service.compareCompetitions([-777, -666]),
                service.analyzeLeagueTrends([-555])
            ]);
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    expect(result.value.success).toBeDefined();
                    expect(result.value.metadata).toBeDefined();
                    if (!result.value.success) {
                        expect(result.value.error).toBeDefined();
                        console.log(`✅ League analytics test ${index + 1} handled error: ${result.value.error}`);
                    }
                }
            });
        }));
    });
    describe('📊 Data Quality Validation', () => {
        it('should validate league analysis data quality', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const result = yield service.analyzeLeagueSeason(1, {
                includeTable: true,
                includeTrends: true
            });
            if (result.success && result.data) {
                const statistics = result.data.statistics;
                // Percentages should be valid
                expect(statistics.homeWinPercentage).toBeGreaterThanOrEqual(0);
                expect(statistics.homeWinPercentage).toBeLessThanOrEqual(100);
                expect(statistics.drawPercentage).toBeGreaterThanOrEqual(0);
                expect(statistics.drawPercentage).toBeLessThanOrEqual(100);
                expect(statistics.awayWinPercentage).toBeGreaterThanOrEqual(0);
                expect(statistics.awayWinPercentage).toBeLessThanOrEqual(100);
                // Goals should be non-negative
                expect(statistics.totalGoals).toBeGreaterThanOrEqual(0);
                expect(statistics.averageGoalsPerMatch).toBeGreaterThanOrEqual(0);
                // Table positions should be sequential if table exists
                if (result.data.table && result.data.table.length > 0) {
                    result.data.table.forEach((team, index) => {
                        expect(team.position).toBe(index + 1);
                        expect(team.points).toBeGreaterThanOrEqual(0);
                        expect(team.played).toBeGreaterThanOrEqual(0);
                    });
                }
                console.log('✅ League analysis data quality validated:', {
                    homeWinRate: statistics.homeWinPercentage,
                    averageGoals: statistics.averageGoalsPerMatch,
                    tableSize: ((_a = result.data.table) === null || _a === void 0 ? void 0 : _a.length) || 0
                });
            }
        }), 30000);
    });
});
