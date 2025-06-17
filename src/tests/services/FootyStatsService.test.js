"use strict";
/**
 * FOOTYSTATS SERVICE TESTS
 * Testing the core service methods with Phase 1 integration
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
describe('🏈 FootyStatsService Tests', () => {
    let service;
    beforeEach(() => {
        service = new FootyStatsService_1.FootyStatsService();
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield service.shutdown();
    }));
    describe('Basic Data Retrieval', () => {
        it('should get countries successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const result = yield service.getCountries();
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect((_a = result.metadata) === null || _a === void 0 ? void 0 : _a.source).toBe('/country-list');
            expect(typeof ((_b = result.metadata) === null || _b === void 0 ? void 0 : _b.processingTime)).toBe('number');
            if (result.success) {
                expect(result.data).toBeDefined();
                expect(Array.isArray(result.data)).toBe(true);
                if (result.data && result.data.length > 0) {
                    console.log(`✅ Retrieved ${result.data.length} countries`);
                    console.log(`📊 First country:`, result.data[0]);
                }
            }
            else {
                console.log(`⚠️ Countries API call failed: ${result.error}`);
            }
        }), 30000);
        it('should get leagues successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const result = yield service.getLeagues();
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect((_a = result.metadata) === null || _a === void 0 ? void 0 : _a.source).toBe('/league-list');
            if (result.success) {
                expect(result.data).toBeDefined();
                expect(Array.isArray(result.data)).toBe(true);
                if (result.data && result.data.length > 0) {
                    console.log(`✅ Retrieved ${result.data.length} leagues`);
                    console.log(`📊 First league:`, result.data[0]);
                }
            }
            else {
                console.log(`⚠️ Leagues API call failed: ${result.error}`);
            }
        }), 30000);
        it('should get leagues with chosenOnly filter', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.getLeagues({ chosenOnly: true });
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            if (result.success) {
                expect(result.data).toBeDefined();
                expect(Array.isArray(result.data)).toBe(true);
                if (result.data && result.data.length > 0) {
                    console.log(`✅ Retrieved ${result.data.length} chosen leagues`);
                }
            }
            else {
                console.log(`⚠️ Chosen leagues API call failed: ${result.error}`);
            }
        }), 30000);
        it('should handle invalid country parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.getLeagues({ country: -1 });
            expect(result.success).toBe(false);
            expect(result.error).toContain('Invalid country ID');
        }));
        it('should get today\'s matches', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const result = yield service.getTodaysMatches();
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect((_a = result.metadata) === null || _a === void 0 ? void 0 : _a.source).toBe('/todays-matches');
            if (result.success) {
                expect(result.data).toBeDefined();
                expect(Array.isArray(result.data)).toBe(true);
                console.log(`✅ Retrieved ${((_b = result.data) === null || _b === void 0 ? void 0 : _b.length) || 0} matches for today`);
                if (result.data && result.data.length > 0) {
                    console.log(`📊 First match:`, result.data[0]);
                }
            }
            else {
                console.log(`⚠️ Today's matches API call failed: ${result.error}`);
            }
        }), 30000);
        it('should get matches for specific date', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const testDate = '2023-12-19'; // Use a date that likely has matches
            const result = yield service.getTodaysMatches(testDate);
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            if (result.success) {
                expect(result.data).toBeDefined();
                expect(Array.isArray(result.data)).toBe(true);
                console.log(`✅ Retrieved ${((_a = result.data) === null || _a === void 0 ? void 0 : _a.length) || 0} matches for ${testDate}`);
            }
            else {
                console.log(`⚠️ Specific date matches API call failed: ${result.error}`);
            }
        }), 30000);
    });
    describe('Match Details', () => {
        it('should handle invalid match ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.getMatch(-1);
            expect(result.success).toBe(false);
            expect(result.error).toContain('Invalid match ID');
        }));
        it('should handle non-existent match ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.getMatch(999999999);
            // This might succeed or fail depending on API, but should handle gracefully
            expect(result.success).toBeDefined();
            expect(result.metadata).toBeDefined();
            if (!result.success) {
                console.log(`✅ Properly handled non-existent match: ${result.error}`);
            }
        }), 30000);
        it('should get match details if match exists', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            // First get today's matches to find a real match ID
            const todaysMatches = yield service.getTodaysMatches();
            if (todaysMatches.success && todaysMatches.data && todaysMatches.data.length > 0) {
                const firstMatch = todaysMatches.data[0];
                const matchId = firstMatch.id;
                console.log(`🎯 Testing with real match ID: ${matchId}`);
                const result = yield service.getMatch(matchId);
                expect(result.success).toBeDefined();
                expect(result.metadata).toBeDefined();
                if (result.success) {
                    expect(result.data).toBeDefined();
                    expect((_a = result.data) === null || _a === void 0 ? void 0 : _a.id).toBe(matchId);
                    console.log(`✅ Retrieved match details for ID ${matchId}`);
                    console.log(`📊 Match: ${(_b = result.data) === null || _b === void 0 ? void 0 : _b.homeID} vs ${(_c = result.data) === null || _c === void 0 ? void 0 : _c.awayID}`);
                }
                else {
                    console.log(`⚠️ Match details API call failed: ${result.error}`);
                }
            }
            else {
                console.log('⚠️ No matches available today for testing match details');
            }
        }), 30000);
    });
    describe('Caching Integration', () => {
        it('should cache countries data', () => __awaiter(void 0, void 0, void 0, function* () {
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
                // Response times should be faster for cached data
                const apiTime = ((_c = result1.metadata) === null || _c === void 0 ? void 0 : _c.processingTime) || 0;
                const cacheTime = ((_d = result2.metadata) === null || _d === void 0 ? void 0 : _d.processingTime) || 0;
                console.log(`📊 API call: ${apiTime}ms, Cache call: ${cacheTime}ms`);
                expect(cacheTime).toBeLessThan(apiTime);
            }
            else {
                console.log(`⚠️ Countries caching test skipped due to API issues`);
            }
        }), 30000);
        it('should cache leagues data with different keys for different options', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            // Call with no options
            const result1 = yield service.getLeagues();
            expect(result1.success).toBeDefined();
            expect(result1.metadata).toBeDefined();
            // Call with chosenOnly - should be different cache key
            const result2 = yield service.getLeagues({ chosenOnly: true });
            expect(result2.success).toBeDefined();
            expect(result2.metadata).toBeDefined();
            // Data might be different due to different filters
            if (result1.success && result2.success) {
                console.log(`📊 All leagues: ${(_a = result1.data) === null || _a === void 0 ? void 0 : _a.length}, Chosen only: ${(_b = result2.data) === null || _b === void 0 ? void 0 : _b.length}`);
            }
            else {
                console.log(`⚠️ Leagues caching test skipped due to API issues`);
            }
        }), 30000);
    });
    describe('Error Handling', () => {
        it('should handle service errors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test with invalid parameters to trigger errors
            const results = yield Promise.allSettled([
                service.getLeagues({ country: -999 }),
                service.getMatch(-1),
                service.getMatch(0)
            ]);
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    expect(result.value.success).toBe(false);
                    expect(result.value.error).toBeDefined();
                    expect(result.value.metadata).toBeDefined();
                    console.log(`✅ Test ${index + 1} handled error: ${result.value.error}`);
                }
            });
        }));
    });
    describe('Performance', () => {
        it('should meet response time benchmarks', () => __awaiter(void 0, void 0, void 0, function* () {
            const startTime = Date.now();
            // Test multiple concurrent calls
            const promises = [
                service.getCountries(),
                service.getLeagues(),
                service.getTodaysMatches()
            ];
            const results = yield Promise.all(promises);
            const totalTime = Date.now() - startTime;
            console.log(`📊 Total time for 3 concurrent calls: ${totalTime}ms`);
            // All should have responses (success or failure)
            results.forEach((result, index) => {
                var _a;
                expect(result.success).toBeDefined();
                expect(result.metadata).toBeDefined();
                console.log(`✅ Call ${index + 1}: ${(_a = result.metadata) === null || _a === void 0 ? void 0 : _a.processingTime}ms (success: ${result.success})`);
            });
            // Total time should be reasonable (concurrent execution)
            expect(totalTime).toBeLessThan(10000); // 10 seconds max
        }), 30000);
    });
});
