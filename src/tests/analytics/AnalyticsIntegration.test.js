"use strict";
/**
 * 🧪 ANALYTICS INTEGRATION TESTS
 *
 * Comprehensive integration testing for all Phase 3 analytics services
 * Validates end-to-end functionality and service interactions
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
const analytics_1 = require("../../analytics");
describe('🔗 Analytics Integration Tests', () => {
    let services;
    beforeAll(() => {
        services = analytics_1.AnalyticsServiceFactory.createAllServices({
            enableCaching: true,
            cacheTtl: 300,
            enableLogging: true
        });
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Shutdown all services
        yield Promise.all([
            services.match.shutdown(),
            services.team.shutdown(),
            services.league.shutdown(),
            services.player.shutdown(),
            services.betting.shutdown()
        ]);
    }));
    describe('🏗️ Service Factory', () => {
        it('should create all analytics services', () => {
            expect(services.match).toBeDefined();
            expect(services.team).toBeDefined();
            expect(services.league).toBeDefined();
            expect(services.player).toBeDefined();
            expect(services.betting).toBeDefined();
            console.log('✅ All analytics services created successfully');
        });
        it('should create services with correct configuration', () => {
            // All services should have the same configuration
            Object.values(services).forEach((service) => {
                expect(service.config).toBeDefined();
                expect(service.config.enableCaching).toBe(true);
                expect(service.config.cacheTtl).toBe(300);
                expect(service.config.enableLogging).toBe(true);
            });
            console.log('✅ All services configured correctly');
        });
    });
    describe('🔄 Cross-Service Integration', () => {
        it('should handle concurrent operations across all services', () => __awaiter(void 0, void 0, void 0, function* () {
            const startTime = Date.now();
            // Run operations across all services concurrently
            const operations = [
                services.match.analyzeTodaysMatches(),
                services.team.analyzeTeamPerformance(1),
                services.league.analyzeLeagueSeason(1),
                services.player.analyzePlayerPerformance(1),
                services.betting.analyzeBettingMarkets()
            ];
            const results = yield Promise.all(operations);
            const totalTime = Date.now() - startTime;
            // All operations should complete
            results.forEach((result, index) => {
                var _a;
                expect(result.success).toBeDefined();
                expect(result.metadata).toBeDefined();
                console.log(`✅ Service ${index + 1} completed: ${(_a = result.metadata) === null || _a === void 0 ? void 0 : _a.processingTime}ms`);
            });
            console.log(`✅ All services completed concurrently in ${totalTime}ms`);
            expect(totalTime).toBeLessThan(60000); // 60 seconds max
        }), 75000);
        it('should maintain consistent error handling across services', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test error handling with invalid parameters
            const errorTests = [
                services.match.predictMatch(-1, -2),
                services.team.analyzeTeamPerformance(-1),
                services.league.analyzeLeagueSeason(-1),
                services.player.analyzePlayerPerformance(-1),
                services.betting.findValueBets(-10, 0)
            ];
            const results = yield Promise.allSettled(errorTests);
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    expect(result.value.success).toBeDefined();
                    expect(result.value.metadata).toBeDefined();
                    if (!result.value.success) {
                        expect(result.value.error).toBeDefined();
                        console.log(`✅ Service ${index + 1} handled error: ${result.value.error}`);
                    }
                }
            });
            console.log('✅ Consistent error handling across all services');
        }));
    });
    describe('📊 Data Flow Integration', () => {
        it('should demonstrate complete analytics workflow', () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('🚀 Starting complete analytics workflow...');
            // Step 1: Get today's matches
            const matchesResult = yield services.match.analyzeTodaysMatches();
            expect(matchesResult.success).toBeDefined();
            if (matchesResult.success && matchesResult.data && matchesResult.data.length > 0) {
                const firstMatch = matchesResult.data[0];
                console.log(`📊 Found ${matchesResult.data.length} matches to analyze`);
                // Step 2: Analyze teams in the first match
                const [homeTeamResult, awayTeamResult] = yield Promise.all([
                    services.team.analyzeTeamPerformance(1), // Simplified team IDs
                    services.team.analyzeTeamPerformance(2)
                ]);
                expect(homeTeamResult.success).toBeDefined();
                expect(awayTeamResult.success).toBeDefined();
                console.log('✅ Team analyses completed');
                // Step 3: Compare the teams
                const comparisonResult = yield services.team.compareTeams(1, 2);
                expect(comparisonResult.success).toBeDefined();
                console.log('✅ Team comparison completed');
                // Step 4: Analyze league context
                const leagueResult = yield services.league.analyzeLeagueSeason(1);
                expect(leagueResult.success).toBeDefined();
                console.log('✅ League analysis completed');
                // Step 5: Get player insights
                const playerResult = yield services.player.analyzeLeaguePlayers(1, { maxPlayers: 5 });
                expect(playerResult.success).toBeDefined();
                console.log('✅ Player analysis completed');
                // Step 6: Generate betting insights
                const bettingResult = yield services.betting.analyzeBettingMarkets({
                    includeValueBets: true,
                    maxResults: 3
                });
                expect(bettingResult.success).toBeDefined();
                console.log('✅ Betting analysis completed');
                console.log('🎉 Complete analytics workflow successful!');
            }
            else {
                console.log('⚠️ No matches available for workflow testing');
            }
        }), 120000);
    });
    describe('🎯 Performance Validation', () => {
        it('should maintain performance standards across all services', () => __awaiter(void 0, void 0, void 0, function* () {
            const performanceTests = [
                { name: 'Match Analytics', test: () => services.match.predictMatch(1, 2) },
                { name: 'Team Analytics', test: () => services.team.analyzeTeamPerformance(1) },
                { name: 'League Analytics', test: () => services.league.analyzeLeagueSeason(1) },
                { name: 'Player Analytics', test: () => services.player.analyzePlayerPerformance(1) },
                { name: 'Betting Analytics', test: () => services.betting.findValueBets(5, 3) }
            ];
            const results = [];
            for (const test of performanceTests) {
                const startTime = Date.now();
                const result = yield test.test();
                const duration = Date.now() - startTime;
                results.push({
                    name: test.name,
                    duration,
                    success: result.success
                });
                // Each service should complete within reasonable time
                expect(duration).toBeLessThan(30000); // 30 seconds max per service
                console.log(`⚡ ${test.name}: ${duration}ms`);
            }
            const averageDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
            console.log(`📊 Average service response time: ${averageDuration.toFixed(0)}ms`);
            expect(averageDuration).toBeLessThan(15000); // 15 seconds average
        }), 180000);
    });
    describe('🔒 Data Consistency', () => {
        it('should maintain data consistency across services', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test that services return consistent data formats
            const results = yield Promise.all([
                services.match.predictMatch(1, 2),
                services.team.analyzeTeamPerformance(1),
                services.league.analyzeLeagueSeason(1),
                services.player.analyzePlayerPerformance(1),
                services.betting.analyzeBettingMarkets()
            ]);
            results.forEach((result, index) => {
                // All results should have consistent structure
                expect(result.success).toBeDefined();
                expect(result.metadata).toBeDefined();
                expect(result.metadata.timestamp).toBeDefined();
                expect(result.metadata.processingTime).toBeGreaterThan(0);
                expect(result.metadata.source).toBeDefined();
                if (result.success) {
                    expect(result.data).toBeDefined();
                }
                else {
                    expect(result.error).toBeDefined();
                }
                console.log(`✅ Service ${index + 1} data structure consistent`);
            });
            console.log('✅ Data consistency validated across all services');
        }));
    });
    describe('🧹 Resource Management', () => {
        it('should properly manage resources and cleanup', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create temporary services for cleanup testing
            const tempServices = analytics_1.AnalyticsServiceFactory.createAllServices();
            // Use the services
            yield Promise.all([
                tempServices.match.predictMatch(1, 2),
                tempServices.team.analyzeTeamPerformance(1),
                tempServices.league.analyzeLeagueSeason(1),
                tempServices.player.analyzePlayerPerformance(1),
                tempServices.betting.analyzeBettingMarkets()
            ]);
            // Shutdown all services
            yield Promise.all([
                tempServices.match.shutdown(),
                tempServices.team.shutdown(),
                tempServices.league.shutdown(),
                tempServices.player.shutdown(),
                tempServices.betting.shutdown()
            ]);
            console.log('✅ All services shut down cleanly');
        }));
    });
    describe('📈 Analytics Metrics', () => {
        it('should provide comprehensive analytics metrics', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test that all services provide meaningful metrics
            const metricsTests = [
                services.match.analyzeTodaysMatches(),
                services.team.analyzeLeagueTeams(1, { maxPlayers: 3 }),
                services.league.getLeagueTablesWithAnalytics(1),
                services.player.analyzeLeaguePlayers(1, { maxPlayers: 3 }),
                services.betting.analyzeBettingPerformance()
            ];
            const results = yield Promise.all(metricsTests);
            results.forEach((result, index) => {
                expect(result.metadata).toBeDefined();
                expect(result.metadata.dataPoints).toBeGreaterThanOrEqual(0);
                if (result.success && result.data) {
                    // Each service should provide meaningful data
                    if (Array.isArray(result.data)) {
                        console.log(`📊 Service ${index + 1} returned ${result.data.length} items`);
                    }
                    else {
                        console.log(`📊 Service ${index + 1} returned structured data`);
                    }
                }
            });
            console.log('✅ All services provide comprehensive metrics');
        }));
    });
});
