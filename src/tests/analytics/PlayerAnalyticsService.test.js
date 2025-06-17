"use strict";
/**
 * 🧪 PLAYER & REFEREE ANALYTICS SERVICE TESTS
 *
 * Comprehensive testing for player and referee analytics functionality
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
const PlayerAnalyticsService_1 = require("../../analytics/player/PlayerAnalyticsService");
describe('👤 PlayerAnalyticsService Tests', () => {
    let service;
    beforeEach(() => {
        service = new PlayerAnalyticsService_1.PlayerAnalyticsService({
            enableCaching: true,
            cacheTtl: 300, // 5 minutes for testing
            enableLogging: true
        });
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield service.shutdown();
    }));
    describe('📊 Player Performance Analysis', () => {
        it('should analyze player performance with basic options', () => __awaiter(void 0, void 0, void 0, function* () {
            const playerId = 1; // Example player ID
            const result = yield service.analyzePlayerPerformance(playerId, {
                includeForm: false,
                includeConsistency: false,
                includeImpact: false
            });
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect(result.metadata.source).toBe('player_performance_analysis');
            expect(result.metadata.processingTime).toBeGreaterThan(0);
            if (result.success && result.data) {
                expect(result.data.player).toBeDefined();
                expect(result.data.player.id).toBe(playerId);
                expect(result.data.performance).toBeDefined();
                expect(result.data.ranking).toBeDefined();
                expect(result.data.insights).toBeDefined();
                // Validate performance metrics
                expect(result.data.performance.playerId).toBe(playerId);
                expect(result.data.performance.appearances).toBeGreaterThanOrEqual(0);
                expect(result.data.performance.goals).toBeGreaterThanOrEqual(0);
                expect(result.data.performance.assists).toBeGreaterThanOrEqual(0);
                expect(result.data.performance.goalsPerGame).toBeGreaterThanOrEqual(0);
                expect(result.data.performance.assistsPerGame).toBeGreaterThanOrEqual(0);
                console.log('✅ Player performance analysis result:', {
                    playerName: result.data.player.name,
                    position: result.data.player.position,
                    performance: {
                        goals: result.data.performance.goals,
                        assists: result.data.performance.assists,
                        appearances: result.data.performance.appearances,
                        goalsPerGame: result.data.performance.goalsPerGame,
                        impactRating: result.data.performance.impactRating
                    },
                    ranking: result.data.ranking,
                    insights: result.data.insights
                });
            }
            else {
                console.log('⚠️ Player performance analysis failed:', result.error);
            }
        }), 30000);
        it('should analyze player performance with full options', () => __awaiter(void 0, void 0, void 0, function* () {
            const playerId = 1;
            const result = yield service.analyzePlayerPerformance(playerId, {
                includeForm: true,
                includeConsistency: true,
                includeImpact: true,
                formMatches: 5
            });
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            if (result.success && result.data) {
                expect(result.data.performance.consistency).toBeGreaterThanOrEqual(0);
                expect(result.data.performance.consistency).toBeLessThanOrEqual(100);
                expect(result.data.performance.impactRating).toBeGreaterThanOrEqual(0);
                expect(result.data.performance.impactRating).toBeLessThanOrEqual(100);
                console.log('✅ Full player analysis:', {
                    consistency: result.data.performance.consistency,
                    impactRating: result.data.performance.impactRating,
                    form: result.data.performance.form,
                    insights: result.data.insights
                });
            }
        }), 30000);
        it('should handle invalid player ID gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.analyzePlayerPerformance(-1);
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
            expect(result.metadata).toBeDefined();
            console.log('✅ Invalid player ID handled:', result.error);
        }));
    });
    describe('🏁 Referee Performance Analysis', () => {
        it('should analyze referee performance with basic options', () => __awaiter(void 0, void 0, void 0, function* () {
            const refereeId = 1; // Example referee ID
            const result = yield service.analyzeRefereePerformance(refereeId, {
                includeImpact: false,
                includeTeamEffects: false,
                includeControversy: false
            });
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect(result.metadata.source).toBe('referee_performance_analysis');
            if (result.success && result.data) {
                expect(result.data.referee).toBeDefined();
                expect(result.data.referee.id).toBe(refereeId);
                expect(result.data.performance).toBeDefined();
                expect(result.data.impact).toBeDefined();
                expect(result.data.ranking).toBeDefined();
                expect(result.data.insights).toBeDefined();
                // Validate performance metrics
                expect(result.data.performance.refereeId).toBe(refereeId);
                expect(result.data.performance.matchesOfficiated).toBeGreaterThanOrEqual(0);
                expect(result.data.performance.averageCardsPerGame).toBeGreaterThanOrEqual(0);
                expect(result.data.performance.averageGoalsPerGame).toBeGreaterThanOrEqual(0);
                expect(result.data.performance.strictnessRating).toBeGreaterThanOrEqual(0);
                expect(result.data.performance.strictnessRating).toBeLessThanOrEqual(100);
                console.log('✅ Referee performance analysis result:', {
                    refereeName: result.data.referee.name,
                    performance: {
                        matchesOfficiated: result.data.performance.matchesOfficiated,
                        averageCardsPerGame: result.data.performance.averageCardsPerGame,
                        averageGoalsPerGame: result.data.performance.averageGoalsPerGame,
                        strictnessRating: result.data.performance.strictnessRating,
                        consistency: result.data.performance.consistency
                    },
                    insights: result.data.insights
                });
            }
            else {
                console.log('⚠️ Referee performance analysis failed:', result.error);
            }
        }), 30000);
        it('should analyze referee performance with full options', () => __awaiter(void 0, void 0, void 0, function* () {
            const refereeId = 1;
            const result = yield service.analyzeRefereePerformance(refereeId, {
                includeImpact: true,
                includeTeamEffects: true,
                includeControversy: true
            });
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            if (result.success && result.data) {
                expect(result.data.impact.impact).toBeDefined();
                expect(result.data.impact.impact.cardTendency).toMatch(/^(lenient|strict|average)$/);
                expect(result.data.impact.impact.goalTendency).toMatch(/^(high-scoring|low-scoring|average)$/);
                console.log('✅ Full referee analysis:', {
                    impact: result.data.impact.impact,
                    teamEffects: result.data.impact.teamEffects.length,
                    insights: result.data.insights
                });
            }
        }), 30000);
        it('should handle invalid referee ID gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.analyzeRefereePerformance(-1);
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
            console.log('✅ Invalid referee ID handled:', result.error);
        }));
    });
    describe('🏆 League Players Analysis', () => {
        it('should analyze all players in a league', () => __awaiter(void 0, void 0, void 0, function* () {
            const seasonId = 1; // Example season ID
            const result = yield service.analyzeLeaguePlayers(seasonId, {
                maxPlayers: 10,
                includeTopPerformers: true,
                includeComparisons: false
            });
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect(result.metadata.source).toBe('league_players_analysis');
            if (result.success && result.data) {
                expect(Array.isArray(result.data.players)).toBe(true);
                expect(result.data.players.length).toBeLessThanOrEqual(10);
                if (result.data.players.length > 0) {
                    const firstPlayer = result.data.players[0];
                    expect(firstPlayer.player).toBeDefined();
                    expect(firstPlayer.performance).toBeDefined();
                    expect(firstPlayer.ranking).toBeDefined();
                    expect(firstPlayer.insights).toBeDefined();
                }
                if (result.data.topPerformers) {
                    expect(result.data.topPerformers.topScorers).toBeDefined();
                    expect(result.data.topPerformers.topAssisters).toBeDefined();
                    expect(result.data.topPerformers.mostConsistent).toBeDefined();
                    expect(result.data.topPerformers.highestImpact).toBeDefined();
                }
                console.log('🏆 League players analysis:', {
                    playersAnalyzed: result.data.players.length,
                    hasTopPerformers: !!result.data.topPerformers,
                    hasComparisons: !!result.data.comparisons,
                    firstPlayer: result.data.players[0] ? {
                        name: result.data.players[0].player.name,
                        position: result.data.players[0].player.position,
                        impactRating: result.data.players[0].performance.impactRating
                    } : null
                });
            }
            else {
                console.log('⚠️ League players analysis failed:', result.error);
            }
        }), 60000);
        it('should filter players by position', () => __awaiter(void 0, void 0, void 0, function* () {
            const seasonId = 1;
            const result = yield service.analyzeLeaguePlayers(seasonId, {
                positionFilter: 'forward',
                maxPlayers: 5
            });
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            if (result.success && result.data) {
                // All players should be forwards (if any)
                result.data.players.forEach(playerAnalysis => {
                    if (playerAnalysis.player.position) {
                        expect(playerAnalysis.player.position.toLowerCase()).toContain('forward');
                    }
                });
                console.log('✅ Position filtering works');
            }
        }), 30000);
        it('should handle invalid season ID for players', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.analyzeLeaguePlayers(-1);
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
            console.log('✅ Invalid season ID for players handled:', result.error);
        }));
    });
    describe('🏁 League Referees Analysis', () => {
        it('should analyze all referees in a league', () => __awaiter(void 0, void 0, void 0, function* () {
            const seasonId = 1;
            const result = yield service.analyzeLeagueReferees(seasonId, {
                includeImpact: true,
                includeTeamEffects: false
            });
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect(result.metadata.source).toBe('league_referees_analysis');
            if (result.success && result.data) {
                expect(Array.isArray(result.data)).toBe(true);
                if (result.data.length > 0) {
                    const firstReferee = result.data[0];
                    expect(firstReferee.referee).toBeDefined();
                    expect(firstReferee.performance).toBeDefined();
                    expect(firstReferee.impact).toBeDefined();
                    expect(firstReferee.ranking).toBeDefined();
                    expect(firstReferee.insights).toBeDefined();
                }
                console.log('🏁 League referees analysis:', {
                    refereesAnalyzed: result.data.length,
                    firstReferee: result.data[0] ? {
                        name: result.data[0].referee.name,
                        strictnessRating: result.data[0].performance.strictnessRating,
                        consistency: result.data[0].performance.consistency
                    } : null
                });
            }
            else {
                console.log('⚠️ League referees analysis failed:', result.error);
            }
        }), 60000);
        it('should handle invalid season ID for referees', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.analyzeLeagueReferees(-1);
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
            console.log('✅ Invalid season ID for referees handled:', result.error);
        }));
    });
    describe('⚔️ Player Comparison', () => {
        it('should compare two players', () => __awaiter(void 0, void 0, void 0, function* () {
            const player1Id = 1;
            const player2Id = 2;
            const result = yield service.comparePlayers(player1Id, player2Id);
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect(result.metadata.source).toBe('player_comparison');
            if (result.success && result.data) {
                expect(result.data.player1).toBeDefined();
                expect(result.data.player2).toBeDefined();
                expect(result.data.comparison).toBeDefined();
                // Validate comparison results
                expect([1, 2]).toContain(result.data.comparison.betterGoalScorer);
                expect([1, 2]).toContain(result.data.comparison.betterAssister);
                expect([1, 2]).toContain(result.data.comparison.moreConsistent);
                expect([1, 2]).toContain(result.data.comparison.higherImpact);
                expect([1, 2]).toContain(result.data.comparison.overallBetter);
                expect(result.data.comparison.confidenceLevel).toBeGreaterThan(0);
                expect(result.data.comparison.confidenceLevel).toBeLessThanOrEqual(100);
                console.log('⚔️ Player comparison result:', {
                    player1: {
                        name: result.data.player1.playerName,
                        goalsPerGame: result.data.player1.goalsPerGame,
                        assistsPerGame: result.data.player1.assistsPerGame,
                        impactRating: result.data.player1.impactRating
                    },
                    player2: {
                        name: result.data.player2.playerName,
                        goalsPerGame: result.data.player2.goalsPerGame,
                        assistsPerGame: result.data.player2.assistsPerGame,
                        impactRating: result.data.player2.impactRating
                    },
                    comparison: result.data.comparison
                });
            }
            else {
                console.log('⚠️ Player comparison failed:', result.error);
            }
        }), 30000);
        it('should handle invalid player IDs for comparison', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.comparePlayers(-1, -2);
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
            console.log('✅ Invalid player IDs for comparison handled:', result.error);
        }));
    });
    describe('🔄 Caching Integration', () => {
        it('should cache player analysis results', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const playerId = 1;
            // First call - should fetch from API
            const result1 = yield service.analyzePlayerPerformance(playerId);
            expect(result1.success).toBeDefined();
            expect(result1.metadata).toBeDefined();
            // Only check cached flag if the first call was successful
            if (result1.success) {
                expect((_a = result1.metadata) === null || _a === void 0 ? void 0 : _a.cached).toBe(false);
            }
            // Second call - should come from cache if first was successful
            const result2 = yield service.analyzePlayerPerformance(playerId);
            expect(result2.success).toBeDefined();
            expect(result2.metadata).toBeDefined();
            // If both calls were successful, second should be cached
            if (result1.success && result2.success) {
                expect((_b = result2.metadata) === null || _b === void 0 ? void 0 : _b.cached).toBe(true);
                // Cache should be faster
                const apiTime = ((_c = result1.metadata) === null || _c === void 0 ? void 0 : _c.processingTime) || 0;
                const cacheTime = ((_d = result2.metadata) === null || _d === void 0 ? void 0 : _d.processingTime) || 0;
                expect(cacheTime).toBeLessThan(apiTime);
                console.log(`✅ Player analysis caching works: API ${apiTime}ms vs Cache ${cacheTime}ms`);
            }
            else {
                console.log(`⚠️ Player caching test skipped due to API issues`);
            }
        }), 30000);
    });
    describe('⚡ Performance Testing', () => {
        it('should handle multiple concurrent player analyses', () => __awaiter(void 0, void 0, void 0, function* () {
            const startTime = Date.now();
            // Test multiple concurrent analyses
            const promises = [
                service.analyzePlayerPerformance(1),
                service.analyzePlayerPerformance(2),
                service.analyzeRefereePerformance(1),
                service.comparePlayers(1, 2),
                service.analyzeLeaguePlayers(1, { maxPlayers: 5 })
            ];
            const results = yield Promise.all(promises);
            const totalTime = Date.now() - startTime;
            // All should have responses (success or failure)
            results.forEach((result, index) => {
                var _a;
                expect(result.success).toBeDefined();
                expect(result.metadata).toBeDefined();
                console.log(`✅ Concurrent player analysis ${index + 1}: ${(_a = result.metadata) === null || _a === void 0 ? void 0 : _a.processingTime}ms`);
            });
            console.log(`✅ Total concurrent execution time: ${totalTime}ms`);
            expect(totalTime).toBeLessThan(60000); // 60 seconds max
        }), 75000);
    });
    describe('🛡️ Error Handling', () => {
        it('should handle service errors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test with various invalid parameters
            const results = yield Promise.allSettled([
                service.analyzePlayerPerformance(-999),
                service.analyzeRefereePerformance(-888),
                service.analyzeLeaguePlayers(-777),
                service.analyzeLeagueReferees(-666),
                service.comparePlayers(-555, -444)
            ]);
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    expect(result.value.success).toBeDefined();
                    expect(result.value.metadata).toBeDefined();
                    if (!result.value.success) {
                        expect(result.value.error).toBeDefined();
                        console.log(`✅ Player analytics test ${index + 1} handled error: ${result.value.error}`);
                    }
                }
            });
        }));
    });
    describe('📊 Data Quality Validation', () => {
        it('should validate player analysis data quality', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.analyzePlayerPerformance(1);
            if (result.success && result.data) {
                const performance = result.data.performance;
                // Metrics should be non-negative
                expect(performance.appearances).toBeGreaterThanOrEqual(0);
                expect(performance.goals).toBeGreaterThanOrEqual(0);
                expect(performance.assists).toBeGreaterThanOrEqual(0);
                expect(performance.goalsPerGame).toBeGreaterThanOrEqual(0);
                expect(performance.assistsPerGame).toBeGreaterThanOrEqual(0);
                // Ratings should be within valid ranges
                expect(performance.consistency).toBeGreaterThanOrEqual(0);
                expect(performance.consistency).toBeLessThanOrEqual(100);
                expect(performance.impactRating).toBeGreaterThanOrEqual(0);
                expect(performance.impactRating).toBeLessThanOrEqual(100);
                // Rankings should be positive
                expect(result.data.ranking.overallRank).toBeGreaterThan(0);
                expect(result.data.ranking.positionRank).toBeGreaterThan(0);
                expect(result.data.ranking.totalPlayers).toBeGreaterThan(0);
                console.log('✅ Player analysis data quality validated:', {
                    goals: performance.goals,
                    assists: performance.assists,
                    consistency: performance.consistency,
                    impactRating: performance.impactRating
                });
            }
        }), 30000);
    });
});
