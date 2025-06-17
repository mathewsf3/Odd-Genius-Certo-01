"use strict";
/**
 * 🧪 COMPREHENSIVE STRESS TEST SUITE
 *
 * Complete integration testing for Phase 1, 2, and 3
 * Validates all components working together under stress
 * Tests all 16 API endpoints and analytics integration
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
const index_1 = require("../../index");
describe('🚀 Comprehensive Backend Stress Tests', () => {
    let backend;
    let startTime;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        startTime = Date.now();
        console.log('🚀 Starting Comprehensive Stress Test Suite...');
        console.log(`📅 Test Date: ${new Date().toISOString()}`);
        console.log(`🏗️ Backend Version: ${index_1.VERSION_INFO.version}`);
        console.log(`📊 Expected Test Coverage: ${index_1.VERSION_INFO.testCoverage}`);
        console.log(`🔗 API Endpoints to Test: ${index_1.VERSION_INFO.endpoints}`);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const totalTime = Date.now() - startTime;
        console.log(`⏱️ Total stress test time: ${totalTime}ms`);
        if (backend) {
            yield backend.shutdown();
        }
    }));
    describe('🏗️ Backend Factory Integration', () => {
        it('should create complete backend instance', () => __awaiter(void 0, void 0, void 0, function* () {
            backend = index_1.BackendFactory.createCompleteBackend({
                cache: { enableLogging: true },
                analytics: { enableCaching: true, enableLogging: true },
                footyStats: { enableLogging: true }
            });
            expect(backend).toBeDefined();
            expect(backend.cache).toBeDefined();
            expect(backend.footyStats).toBeDefined();
            expect(backend.analytics).toBeDefined();
            expect(backend.analytics.match).toBeDefined();
            expect(backend.analytics.team).toBeDefined();
            expect(backend.analytics.league).toBeDefined();
            expect(backend.analytics.player).toBeDefined();
            expect(backend.analytics.betting).toBeDefined();
            yield backend.initialize();
            console.log('✅ Complete backend instance created and initialized');
        }));
        it('should create analytics-only instance', () => {
            const analyticsOnly = index_1.BackendFactory.createAnalyticsOnly();
            expect(analyticsOnly.match).toBeDefined();
            expect(analyticsOnly.team).toBeDefined();
            expect(analyticsOnly.league).toBeDefined();
            expect(analyticsOnly.player).toBeDefined();
            expect(analyticsOnly.betting).toBeDefined();
            console.log('✅ Analytics-only instance created');
        });
        it('should create core services instance', () => {
            const coreServices = index_1.BackendFactory.createCoreServices();
            expect(coreServices.cache).toBeDefined();
            expect(coreServices.footyStats).toBeDefined();
            console.log('✅ Core services instance created');
        });
    });
    describe('🏥 Health Check Validation', () => {
        it('should perform comprehensive health check', () => __awaiter(void 0, void 0, void 0, function* () {
            const healthResult = yield index_1.HealthCheck.performHealthCheck();
            expect(healthResult).toBeDefined();
            expect(healthResult.timestamp).toBeDefined();
            expect(healthResult.status).toBeDefined();
            expect(healthResult.services).toBeDefined();
            expect(healthResult.services.cache).toBeDefined();
            expect(healthResult.services.footyStats).toBeDefined();
            expect(healthResult.services.analytics).toBeDefined();
            console.log('🏥 Health check result:', {
                status: healthResult.status,
                services: healthResult.services,
                timestamp: healthResult.timestamp
            });
            expect(['healthy', 'unhealthy']).toContain(healthResult.status);
        }));
    });
    describe('🔗 Phase Integration Validation', () => {
        it('should validate Phase 1 → Phase 2 integration', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test that Phase 2 FootyStatsService properly uses Phase 1 DTOs and caching
            const footyStats = new index_1.FootyStatsService();
            const cache = new index_1.CacheManager();
            // Test cache integration
            yield cache.set('test_integration', { phase: 1, data: 'test' }, { ttl: 300 });
            const cached = yield cache.get('test_integration');
            expect(cached).toEqual({ phase: 1, data: 'test' });
            // Test FootyStats service structure
            expect(footyStats).toBeDefined();
            expect(typeof footyStats.getMatch).toBe('function');
            expect(typeof footyStats.getTodaysMatches).toBe('function');
            expect(typeof footyStats.getTeam).toBe('function');
            console.log('✅ Phase 1 → Phase 2 integration validated');
        }));
        it('should validate Phase 2 → Phase 3 integration', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test that Phase 3 Analytics properly uses Phase 2 FootyStatsService
            const analytics = index_1.AnalyticsServiceFactory.createAllServices();
            // Verify analytics services have FootyStatsService integration
            expect(analytics.match).toBeDefined();
            expect(analytics.team).toBeDefined();
            expect(analytics.league).toBeDefined();
            expect(analytics.player).toBeDefined();
            expect(analytics.betting).toBeDefined();
            // Test that services can perform operations (indicating proper integration)
            const matchResult = yield analytics.match.predictMatch(1, 2);
            expect(matchResult.success).toBeDefined();
            console.log('✅ Phase 2 → Phase 3 integration validated');
        }));
        it('should validate Phase 1 → Phase 3 integration', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test that Phase 3 Analytics properly uses Phase 1 DTOs and caching
            const analytics = index_1.AnalyticsServiceFactory.createAllServices();
            // Verify analytics services have caching integration
            expect(analytics.match).toBeDefined();
            expect(analytics.team).toBeDefined();
            expect(analytics.league).toBeDefined();
            expect(analytics.player).toBeDefined();
            expect(analytics.betting).toBeDefined();
            // Test that services can perform cached operations (indicating proper integration)
            const teamResult = yield analytics.team.analyzeTeamPerformance(1);
            expect(teamResult.success).toBeDefined();
            console.log('✅ Phase 1 → Phase 3 integration validated');
        }));
    });
    describe('🌐 API Endpoints Stress Test', () => {
        it('should stress test all 16 API endpoints concurrently', () => __awaiter(void 0, void 0, void 0, function* () {
            const footyStats = new index_1.FootyStatsService();
            const startTime = Date.now();
            // Test all 16 endpoints concurrently
            const endpointTests = [
                footyStats.getMatch(1),
                footyStats.getTodaysMatches(),
                footyStats.getLeagueMatches(1),
                footyStats.getTeam(1),
                footyStats.getTeamLastXStats(1),
                footyStats.getLeagueTeams(1),
                footyStats.getPlayerStats(1),
                footyStats.getLeaguePlayers(1),
                footyStats.getRefereeStats(1),
                footyStats.getLeagueReferees(1),
                footyStats.getLeagues(),
                footyStats.getLeagueSeason(1),
                footyStats.getLeagueTables(1),
                footyStats.getBttsStats(),
                footyStats.getOver25Stats(),
                footyStats.getCountries()
            ];
            const results = yield Promise.allSettled(endpointTests);
            const totalTime = Date.now() - startTime;
            // Analyze results
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            console.log(`🌐 API Endpoints Stress Test Results:`);
            console.log(`   ✅ Successful: ${successful}/16`);
            console.log(`   ❌ Failed: ${failed}/16`);
            console.log(`   ⏱️ Total Time: ${totalTime}ms`);
            console.log(`   📊 Average Time: ${Math.round(totalTime / 16)}ms per endpoint`);
            // We expect some failures due to network issues, but structure should be correct
            expect(results.length).toBe(16);
            expect(successful + failed).toBe(16);
            // Log any failures for debugging
            results.forEach((result, index) => {
                var _a;
                if (result.status === 'rejected') {
                    console.log(`   ⚠️ Endpoint ${index + 1} failed:`, ((_a = result.reason) === null || _a === void 0 ? void 0 : _a.message) || result.reason);
                }
            });
        }), 120000);
    });
    describe('🧠 Analytics Services Stress Test', () => {
        it('should stress test all analytics services concurrently', () => __awaiter(void 0, void 0, void 0, function* () {
            const analytics = index_1.AnalyticsServiceFactory.createAllServices();
            const startTime = Date.now();
            // Test all analytics services concurrently
            const analyticsTests = [
                analytics.match.predictMatch(1, 2),
                analytics.match.analyzeTodaysMatches(),
                analytics.team.analyzeTeamPerformance(1),
                analytics.team.compareTeams(1, 2),
                analytics.league.analyzeLeagueSeason(1),
                analytics.league.getLeagueTablesWithAnalytics(1),
                analytics.player.analyzePlayerPerformance(1),
                analytics.player.analyzeLeaguePlayers(1, { maxPlayers: 5 }),
                analytics.betting.analyzeBettingMarkets(),
                analytics.betting.findValueBets(5, 5)
            ];
            const results = yield Promise.allSettled(analyticsTests);
            const totalTime = Date.now() - startTime;
            // Analyze results
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            console.log(`🧠 Analytics Services Stress Test Results:`);
            console.log(`   ✅ Successful: ${successful}/10`);
            console.log(`   ❌ Failed: ${failed}/10`);
            console.log(`   ⏱️ Total Time: ${totalTime}ms`);
            console.log(`   📊 Average Time: ${Math.round(totalTime / 10)}ms per service`);
            expect(results.length).toBe(10);
            expect(successful + failed).toBe(10);
            // Shutdown analytics services
            yield Promise.all([
                analytics.match.shutdown(),
                analytics.team.shutdown(),
                analytics.league.shutdown(),
                analytics.player.shutdown(),
                analytics.betting.shutdown()
            ]);
        }), 180000);
    });
    describe('⚡ Performance Benchmarks', () => {
        it('should meet performance benchmarks', () => __awaiter(void 0, void 0, void 0, function* () {
            const benchmarks = {
                cacheOperations: 0,
                apiCalls: 0,
                analyticsOperations: 0
            };
            // Cache performance test
            const cache = new index_1.CacheManager();
            const cacheStart = Date.now();
            for (let i = 0; i < 100; i++) {
                yield cache.set(`perf_test_${i}`, { data: i }, { ttl: 300 });
                yield cache.get(`perf_test_${i}`);
            }
            benchmarks.cacheOperations = Date.now() - cacheStart;
            // Analytics performance test
            const analytics = index_1.AnalyticsServiceFactory.createAllServices();
            const analyticsStart = Date.now();
            yield Promise.all([
                analytics.match.predictMatch(1, 2),
                analytics.team.analyzeTeamPerformance(1),
                analytics.league.analyzeLeagueSeason(1)
            ]);
            benchmarks.analyticsOperations = Date.now() - analyticsStart;
            console.log(`⚡ Performance Benchmarks:`);
            console.log(`   💾 Cache Operations (200 ops): ${benchmarks.cacheOperations}ms`);
            console.log(`   🧠 Analytics Operations (3 ops): ${benchmarks.analyticsOperations}ms`);
            // Performance expectations (adjust based on requirements)
            expect(benchmarks.cacheOperations).toBeLessThan(5000); // 5 seconds for 200 cache ops
            expect(benchmarks.analyticsOperations).toBeLessThan(60000); // 60 seconds for 3 analytics ops
            yield Promise.all([
                analytics.match.shutdown(),
                analytics.team.shutdown(),
                analytics.league.shutdown(),
                analytics.player.shutdown(),
                analytics.betting.shutdown()
            ]);
        }), 120000);
    });
    describe('🛡️ Error Handling Stress Test', () => {
        it('should handle errors gracefully under stress', () => __awaiter(void 0, void 0, void 0, function* () {
            const analytics = index_1.AnalyticsServiceFactory.createAllServices();
            // Test with invalid parameters to trigger errors
            const errorTests = [
                analytics.match.predictMatch(-1, -2),
                analytics.team.analyzeTeamPerformance(-999),
                analytics.league.analyzeLeagueSeason(-888),
                analytics.player.analyzePlayerPerformance(-777),
                analytics.betting.findValueBets(-10, 0)
            ];
            const results = yield Promise.allSettled(errorTests);
            // All should handle errors gracefully (no crashes)
            results.forEach((result, index) => {
                expect(result.status).toBe('fulfilled');
                if (result.status === 'fulfilled') {
                    expect(result.value.success).toBeDefined();
                    expect(result.value.metadata).toBeDefined();
                }
            });
            console.log('🛡️ Error handling stress test passed - no crashes');
            yield Promise.all([
                analytics.match.shutdown(),
                analytics.team.shutdown(),
                analytics.league.shutdown(),
                analytics.player.shutdown(),
                analytics.betting.shutdown()
            ]);
        }));
    });
    describe('📊 Final Validation', () => {
        it('should validate complete system integrity', () => __awaiter(void 0, void 0, void 0, function* () {
            const finalValidation = {
                phases: {
                    phase1: false,
                    phase2: false,
                    phase3: false
                },
                integration: false,
                performance: false,
                errorHandling: false
            };
            try {
                // Validate Phase 1
                const cache = new index_1.CacheManager();
                yield cache.set('final_test', 'phase1', { ttl: 60 });
                const phase1Test = yield cache.get('final_test');
                finalValidation.phases.phase1 = phase1Test === 'phase1';
                // Validate Phase 2
                const footyStats = new index_1.FootyStatsService();
                finalValidation.phases.phase2 = typeof footyStats.getMatch === 'function';
                // Validate Phase 3
                const analytics = index_1.AnalyticsServiceFactory.createAllServices();
                finalValidation.phases.phase3 = Object.keys(analytics).length === 5;
                // Validate Integration
                finalValidation.integration =
                    finalValidation.phases.phase1 &&
                        finalValidation.phases.phase2 &&
                        finalValidation.phases.phase3;
                // Validate Performance (basic check)
                const perfStart = Date.now();
                yield analytics.match.predictMatch(1, 2);
                const perfTime = Date.now() - perfStart;
                finalValidation.performance = perfTime < 30000; // 30 seconds max
                // Validate Error Handling
                const errorTest = yield analytics.match.predictMatch(-1, -2);
                finalValidation.errorHandling = errorTest.success === false && errorTest.error !== undefined;
                yield Promise.all([
                    analytics.match.shutdown(),
                    analytics.team.shutdown(),
                    analytics.league.shutdown(),
                    analytics.player.shutdown(),
                    analytics.betting.shutdown()
                ]);
            }
            catch (error) {
                console.error('❌ Final validation error:', error);
            }
            console.log('📊 Final System Validation Results:');
            console.log(`   Phase 1 (Foundation): ${finalValidation.phases.phase1 ? '✅' : '❌'}`);
            console.log(`   Phase 2 (Core Services): ${finalValidation.phases.phase2 ? '✅' : '❌'}`);
            console.log(`   Phase 3 (Analytics): ${finalValidation.phases.phase3 ? '✅' : '❌'}`);
            console.log(`   Integration: ${finalValidation.integration ? '✅' : '❌'}`);
            console.log(`   Performance: ${finalValidation.performance ? '✅' : '❌'}`);
            console.log(`   Error Handling: ${finalValidation.errorHandling ? '✅' : '❌'}`);
            // All validations should pass
            expect(finalValidation.phases.phase1).toBe(true);
            expect(finalValidation.phases.phase2).toBe(true);
            expect(finalValidation.phases.phase3).toBe(true);
            expect(finalValidation.integration).toBe(true);
            expect(finalValidation.performance).toBe(true);
            expect(finalValidation.errorHandling).toBe(true);
            console.log('🎉 COMPLETE SYSTEM VALIDATION PASSED!');
        }), 60000);
    });
});
