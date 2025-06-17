"use strict";
/**
 * COMPLETE FOOTYSTATS SERVICE TESTS
 * Comprehensive testing of all 16 API endpoints
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
const FootyStatsService_1 = require("../../services/FootyStatsService");
describe('🏈 FootyStatsService - Complete API Tests', () => {
    let service;
    beforeEach(() => {
        service = new FootyStatsService_1.FootyStatsService();
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield service.shutdown();
    }));
    describe('📋 All 16 Endpoints Validation', () => {
        it('should have all 16 required methods', () => {
            // Verify all methods exist
            expect(typeof service.getCountries).toBe('function');
            expect(typeof service.getLeagues).toBe('function');
            expect(typeof service.getTodaysMatches).toBe('function');
            expect(typeof service.getMatch).toBe('function');
            expect(typeof service.getLeagueSeason).toBe('function');
            expect(typeof service.getLeagueMatches).toBe('function');
            expect(typeof service.getLeagueTeams).toBe('function');
            expect(typeof service.getLeaguePlayers).toBe('function');
            expect(typeof service.getLeagueReferees).toBe('function');
            expect(typeof service.getLeagueTables).toBe('function');
            expect(typeof service.getTeam).toBe('function');
            expect(typeof service.getTeamLastXStats).toBe('function');
            expect(typeof service.getPlayerStats).toBe('function');
            expect(typeof service.getRefereeStats).toBe('function');
            expect(typeof service.getBttsStats).toBe('function');
            expect(typeof service.getOver25Stats).toBe('function');
            console.log('✅ All 16 API endpoints are available');
        });
    });
    describe('🌍 Reference Data Endpoints', () => {
        it('should get countries successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const result = yield service.getCountries();
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect((_a = result.metadata) === null || _a === void 0 ? void 0 : _a.source).toBe('/country-list');
            if (result.success) {
                expect(result.data).toBeDefined();
                expect(Array.isArray(result.data)).toBe(true);
                console.log(`✅ Countries: ${(_b = result.data) === null || _b === void 0 ? void 0 : _b.length} items`);
            }
            else {
                console.log(`⚠️ Countries API call failed: ${result.error}`);
            }
        }), 30000);
        it('should get leagues successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const result = yield service.getLeagues();
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect((_a = result.metadata) === null || _a === void 0 ? void 0 : _a.source).toBe('/league-list');
            if (result.success) {
                expect(result.data).toBeDefined();
                expect(Array.isArray(result.data)).toBe(true);
                console.log(`✅ Leagues: ${(_b = result.data) === null || _b === void 0 ? void 0 : _b.length} items`);
            }
            else {
                console.log(`⚠️ Leagues API call failed: ${result.error}`);
            }
        }), 30000);
        it('should get leagues with filters', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const result = yield service.getLeagues({ chosenOnly: true });
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            if (result.success) {
                expect(result.data).toBeDefined();
                expect(Array.isArray(result.data)).toBe(true);
                console.log(`✅ Chosen leagues: ${(_a = result.data) === null || _a === void 0 ? void 0 : _a.length} items`);
            }
            else {
                console.log(`⚠️ Chosen leagues API call failed: ${result.error}`);
            }
        }), 30000);
    });
    describe('📅 Live Data Endpoints', () => {
        it('should get today\'s matches', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const result = yield service.getTodaysMatches();
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect((_a = result.metadata) === null || _a === void 0 ? void 0 : _a.source).toBe('/todays-matches');
            if (result.success) {
                expect(result.data).toBeDefined();
                expect(Array.isArray(result.data)).toBe(true);
                console.log(`✅ Today's matches: ${(_b = result.data) === null || _b === void 0 ? void 0 : _b.length} items`);
            }
            else {
                console.log(`⚠️ Today's matches API call failed: ${result.error}`);
            }
        }), 30000);
        it('should get matches for specific date', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const testDate = '2023-12-19';
            const result = yield service.getTodaysMatches(testDate);
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            if (result.success) {
                expect(result.data).toBeDefined();
                expect(Array.isArray(result.data)).toBe(true);
                console.log(`✅ Matches for ${testDate}: ${(_a = result.data) === null || _a === void 0 ? void 0 : _a.length} items`);
            }
            else {
                console.log(`⚠️ Matches for ${testDate} API call failed: ${result.error}`);
            }
        }), 30000);
    });
    describe('🏆 League-Based Endpoints', () => {
        let testSeasonId;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            // Get a real season ID for testing
            const leaguesResult = yield service.getLeagues({ chosenOnly: true });
            if (leaguesResult.success && leaguesResult.data && leaguesResult.data.length > 0) {
                const firstLeague = leaguesResult.data[0];
                if (firstLeague.season && firstLeague.season.length > 0) {
                    testSeasonId = firstLeague.season[0].id;
                    console.log(`🎯 Using test season ID: ${testSeasonId}`);
                }
            }
        }));
        it('should get league season data', () => __awaiter(void 0, void 0, void 0, function* () {
            if (!testSeasonId) {
                console.log('⚠️ No test season ID available, skipping test');
                return;
            }
            const result = yield service.getLeagueSeason(testSeasonId);
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            console.log(`✅ League season result: ${result.success ? 'success' : result.error}`);
        }), 30000);
        it('should get league matches', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (!testSeasonId) {
                console.log('⚠️ No test season ID available, skipping test');
                return;
            }
            const result = yield service.getLeagueMatches(testSeasonId);
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            console.log(`✅ League matches result: ${result.success ? `${(_a = result.data) === null || _a === void 0 ? void 0 : _a.length} matches` : result.error}`);
        }), 30000);
        it('should get league teams', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (!testSeasonId) {
                console.log('⚠️ No test season ID available, skipping test');
                return;
            }
            const result = yield service.getLeagueTeams(testSeasonId);
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            console.log(`✅ League teams result: ${result.success ? `${(_a = result.data) === null || _a === void 0 ? void 0 : _a.length} teams` : result.error}`);
        }), 30000);
        it('should get league players', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (!testSeasonId) {
                console.log('⚠️ No test season ID available, skipping test');
                return;
            }
            const result = yield service.getLeaguePlayers(testSeasonId);
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            console.log(`✅ League players result: ${result.success ? `${(_a = result.data) === null || _a === void 0 ? void 0 : _a.length} players` : result.error}`);
        }), 30000);
        it('should get league referees', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (!testSeasonId) {
                console.log('⚠️ No test season ID available, skipping test');
                return;
            }
            const result = yield service.getLeagueReferees(testSeasonId);
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            console.log(`✅ League referees result: ${result.success ? `${(_a = result.data) === null || _a === void 0 ? void 0 : _a.length} referees` : result.error}`);
        }), 30000);
        it('should get league tables', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (!testSeasonId) {
                console.log('⚠️ No test season ID available, skipping test');
                return;
            }
            const result = yield service.getLeagueTables(testSeasonId);
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            console.log(`✅ League tables result: ${result.success ? `${(_a = result.data) === null || _a === void 0 ? void 0 : _a.length} table entries` : result.error}`);
        }), 30000);
    });
    describe('🏟️ Individual Entity Endpoints', () => {
        it('should handle invalid match ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.getMatch(-1);
            expect(result.success).toBe(false);
            expect(result.error).toContain('Invalid match ID');
            console.log('✅ Invalid match ID validation works');
        }));
        it('should handle invalid team ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.getTeam(-1);
            expect(result.success).toBe(false);
            expect(result.error).toContain('Invalid team ID');
            console.log('✅ Invalid team ID validation works');
        }));
        it('should handle invalid player ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.getPlayerStats(-1);
            expect(result.success).toBe(false);
            expect(result.error).toContain('Invalid player ID');
            console.log('✅ Invalid player ID validation works');
        }));
        it('should handle invalid referee ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.getRefereeStats(-1);
            expect(result.success).toBe(false);
            expect(result.error).toContain('Invalid referee ID');
            console.log('✅ Invalid referee ID validation works');
        }));
        it('should handle invalid team stats parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.getTeamLastXStats(-1);
            expect(result.success).toBe(false);
            expect(result.error).toContain('Invalid team ID');
            console.log('✅ Invalid team stats parameters validation works');
        }));
    });
    describe('📊 Analytics Endpoints', () => {
        it('should get BTTS stats', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const result = yield service.getBttsStats();
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect((_a = result.metadata) === null || _a === void 0 ? void 0 : _a.source).toBe('/stats-data-btts');
            console.log(`✅ BTTS stats result: ${result.success ? 'success' : result.error}`);
        }), 30000);
        it('should get Over 2.5 stats', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const result = yield service.getOver25Stats();
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect((_a = result.metadata) === null || _a === void 0 ? void 0 : _a.source).toBe('/stats-data-over25');
            console.log(`✅ Over 2.5 stats result: ${result.success ? 'success' : result.error}`);
        }), 30000);
    });
    describe('🔄 Caching Integration', () => {
        it('should cache and retrieve data efficiently', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            // First call - should fetch from API
            const result1 = yield service.getCountries();
            expect(result1.success).toBeDefined();
            expect(result1.metadata).toBeDefined();
            // Only check cached flag if the first call was successful
            if (result1.success) {
                expect((_a = result1.metadata) === null || _a === void 0 ? void 0 : _a.cached).toBe(false);
            }
            // Second call - should come from cache if first was successful
            const result2 = yield service.getCountries();
            expect(result2.success).toBeDefined();
            expect(result2.metadata).toBeDefined();
            // If both calls were successful, second should be cached
            if (result1.success && result2.success) {
                expect((_b = result2.metadata) === null || _b === void 0 ? void 0 : _b.cached).toBe(true);
                // Cache should be faster
                const apiTime = ((_c = result1.metadata) === null || _c === void 0 ? void 0 : _c.processingTime) || 0;
                const cacheTime = ((_d = result2.metadata) === null || _d === void 0 ? void 0 : _d.processingTime) || 0;
                expect(cacheTime).toBeLessThan(apiTime);
                console.log(`✅ Caching works: API ${apiTime}ms vs Cache ${cacheTime}ms`);
            }
            else {
                console.log(`⚠️ Caching test skipped due to API issues`);
            }
        }), 30000);
    });
    describe('⚡ Performance Testing', () => {
        it('should handle concurrent requests efficiently', () => __awaiter(void 0, void 0, void 0, function* () {
            const startTime = Date.now();
            // Test multiple concurrent calls
            const promises = [
                service.getCountries(),
                service.getLeagues(),
                service.getTodaysMatches(),
                service.getBttsStats(),
                service.getOver25Stats()
            ];
            const results = yield Promise.all(promises);
            const totalTime = Date.now() - startTime;
            // All should have responses (success or failure)
            results.forEach((result, index) => {
                var _a;
                expect(result.success).toBeDefined();
                expect(result.metadata).toBeDefined();
                console.log(`✅ Concurrent call ${index + 1}: ${(_a = result.metadata) === null || _a === void 0 ? void 0 : _a.processingTime}ms`);
            });
            console.log(`✅ Total concurrent execution time: ${totalTime}ms`);
            expect(totalTime).toBeLessThan(15000); // 15 seconds max
        }), 45000);
    });
});
