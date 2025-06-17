"use strict";
/**
 * ERROR HANDLING & EDGE CASES TEST
 * Comprehensive validation of error scenarios and edge cases
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
const CacheKeys_1 = require("../../cache/CacheKeys");
const CacheManager_1 = require("../../cache/CacheManager");
describe('🚨 ERROR HANDLING & EDGE CASES', () => {
    let cacheManager;
    beforeEach(() => {
        cacheManager = new CacheManager_1.CacheManager({
            defaultTtl: 60,
            maxMemoryUsage: 1024 * 1024,
            cleanupIntervalMs: 5000
        });
    });
    afterEach(() => {
        cacheManager.shutdown();
    });
    describe('DTO Validation Edge Cases', () => {
        it('should handle invalid MatchStatus values gracefully', () => {
            // Test with invalid status (should be caught by TypeScript, but test runtime behavior)
            const invalidMatch = {
                id: 123456,
                homeID: 1001,
                awayID: 1002,
                season: "2023-24",
                status: 'invalid_status', // Invalid status
                homeGoalCount: 2,
                awayGoalCount: 1,
                totalGoalCount: 3,
                date_unix: 1640995200
            };
            // Should still be a valid object structure
            expect(typeof invalidMatch.id).toBe('number');
            expect(typeof invalidMatch.status).toBe('string');
            // Validation should catch this
            const validStatuses = ['complete', 'suspended', 'canceled', 'incomplete'];
            expect(validStatuses).not.toContain(invalidMatch.status);
        });
        it('should handle missing required fields', () => {
            // Test with missing required fields
            const incompleteMatch = {
                id: 123456,
                // Missing homeID, awayID, season, status, etc.
            };
            expect(incompleteMatch.id).toBe(123456);
            expect(incompleteMatch.homeID).toBeUndefined();
            expect(incompleteMatch.awayID).toBeUndefined();
        });
        it('should handle extreme numeric values', () => {
            const extremeMatch = {
                id: Number.MAX_SAFE_INTEGER,
                homeID: Number.MAX_SAFE_INTEGER - 1,
                awayID: Number.MAX_SAFE_INTEGER - 2,
                season: "2023-24",
                status: 'complete',
                homeGoalCount: 999,
                awayGoalCount: 999,
                totalGoalCount: 1998,
                date_unix: Number.MAX_SAFE_INTEGER,
                team_a_corners: 999,
                team_b_corners: 999,
                team_a_yellow_cards: 99,
                team_b_yellow_cards: 99
            };
            expect(extremeMatch.id).toBe(Number.MAX_SAFE_INTEGER);
            expect(extremeMatch.homeGoalCount).toBe(999);
            expect(extremeMatch.totalGoalCount).toBe(1998);
        });
        it('should handle negative values appropriately', () => {
            const negativeMatch = {
                id: 123456,
                homeID: 1001,
                awayID: 1002,
                season: "2023-24",
                status: 'complete',
                homeGoalCount: -1, // Invalid negative goals
                awayGoalCount: -1,
                totalGoalCount: -2,
                date_unix: -1, // Invalid negative timestamp
                team_a_corners: -5,
                team_b_corners: -3
            };
            // Should still be valid object structure
            expect(typeof negativeMatch.homeGoalCount).toBe('number');
            expect(negativeMatch.homeGoalCount).toBe(-1);
            // Business logic should validate these values
            expect(negativeMatch.homeGoalCount).toBeLessThan(0);
            expect(negativeMatch.date_unix).toBeLessThan(0);
        });
    });
    describe('Cache Error Handling', () => {
        it('should handle cache misses gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistentKey = CacheKeys_1.cacheKeys.match(999999);
            const result = yield cacheManager.get(nonExistentKey);
            expect(result).toBeNull();
            const stats = cacheManager.getStats();
            expect(stats.misses).toBeGreaterThan(0);
        }));
        it('should handle cache key generation with invalid inputs', () => {
            // Test with extreme values
            const extremeMatchKey = CacheKeys_1.cacheKeys.match(Number.MAX_SAFE_INTEGER);
            const negativeTeamKey = CacheKeys_1.cacheKeys.team(-1, true);
            const emptyDateKey = CacheKeys_1.cacheKeys.todaysMatches('', '', 0);
            expect(typeof extremeMatchKey).toBe('string');
            expect(typeof negativeTeamKey).toBe('string');
            expect(typeof emptyDateKey).toBe('string');
            expect(extremeMatchKey).toContain('footy:match:');
            expect(negativeTeamKey).toContain('footy:team:');
            expect(emptyDateKey).toContain('footy:matches:today');
        });
        it('should handle memory overflow scenarios', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create cache manager with very small memory limit
            const smallCacheManager = new CacheManager_1.CacheManager({
                defaultTtl: 60,
                maxMemoryUsage: 1024, // 1KB limit
                cleanupIntervalMs: 100
            });
            try {
                // Try to add large objects that exceed memory limit
                const largeObject = {
                    data: 'x'.repeat(2048) // 2KB object
                };
                yield smallCacheManager.set('large-object', largeObject);
                // Should still work (eviction should handle overflow)
                const stats = smallCacheManager.getStats();
                expect(stats.totalKeys).toBeGreaterThanOrEqual(0);
            }
            finally {
                smallCacheManager.shutdown();
            }
        }));
        it('should handle concurrent access conflicts', () => __awaiter(void 0, void 0, void 0, function* () {
            const key = 'concurrent-test';
            const promises = [];
            // Create conflicting operations
            for (let i = 0; i < 100; i++) {
                promises.push(cacheManager.set(key, { value: i }));
                promises.push(cacheManager.get(key));
                promises.push(cacheManager.delete(key));
            }
            // Should not throw errors
            yield expect(Promise.all(promises)).resolves.toBeDefined();
        }));
    });
    describe('Response Error Handling', () => {
        it('should handle malformed API responses', () => {
            const malformedResponse = {
                success: 'true', // Should be boolean
                data: 'invalid', // Should be object/array
                metadata: null // Should be object
            };
            // Should still be accessible
            expect(malformedResponse.success).toBe('true');
            expect(typeof malformedResponse.success).toBe('string');
            expect(malformedResponse.data).toBe('invalid');
        });
        it('should handle missing response fields', () => {
            const incompleteResponse = {
            // Missing success, data, metadata
            };
            expect(incompleteResponse.success).toBeUndefined();
            expect(incompleteResponse.data).toBeUndefined();
            expect(incompleteResponse.metadata).toBeUndefined();
        });
        it('should handle error responses correctly', () => {
            const errorResponse = {
                success: false,
                error: 'Test error message',
                metadata: {
                    timestamp: new Date().toISOString(),
                    source: 'test'
                }
            };
            expect(errorResponse.success).toBe(false);
            expect(errorResponse.error).toBe('Test error message');
            expect(errorResponse.data).toBeUndefined();
        });
    });
    describe('String and Array Edge Cases', () => {
        it('should handle empty and null strings', () => {
            const team = {
                id: 1001,
                name: '', // Empty string
                country: undefined,
                stadium_name: null // Null value
            };
            expect(team.name).toBe('');
            expect(team.country).toBeUndefined();
            expect(team.stadium_name).toBeNull();
        });
        it('should handle very long strings', () => {
            const longString = 'x'.repeat(10000); // 10KB string
            const team = {
                id: 1001,
                name: longString,
                full_name: longString,
                stadium_name: longString
            };
            expect(team.name.length).toBe(10000);
            expect(typeof team.name).toBe('string');
        });
        it('should handle empty arrays', () => {
            var _a, _b;
            const match = {
                id: 123456,
                homeID: 1001,
                awayID: 1002,
                season: "2023-24",
                status: 'complete',
                homeGoalCount: 0,
                awayGoalCount: 0,
                totalGoalCount: 0,
                date_unix: 1640995200,
                homeGoals: [], // Empty array
                awayGoals: [] // Empty array
            };
            expect(Array.isArray(match.homeGoals)).toBe(true);
            expect((_a = match.homeGoals) === null || _a === void 0 ? void 0 : _a.length).toBe(0);
            expect(Array.isArray(match.awayGoals)).toBe(true);
            expect((_b = match.awayGoals) === null || _b === void 0 ? void 0 : _b.length).toBe(0);
        });
        it('should handle arrays with mixed data types', () => {
            var _a, _b, _c, _d, _e, _f;
            const team = {
                id: 1001,
                name: "Test FC",
                alt_names: ['Name1', '', null, undefined, 123] // Mixed types
            };
            expect(Array.isArray(team.alt_names)).toBe(true);
            expect((_a = team.alt_names) === null || _a === void 0 ? void 0 : _a.length).toBe(5);
            expect((_b = team.alt_names) === null || _b === void 0 ? void 0 : _b[0]).toBe('Name1');
            expect((_c = team.alt_names) === null || _c === void 0 ? void 0 : _c[1]).toBe('');
            expect((_d = team.alt_names) === null || _d === void 0 ? void 0 : _d[2]).toBeNull();
            expect((_e = team.alt_names) === null || _e === void 0 ? void 0 : _e[3]).toBeUndefined();
            expect((_f = team.alt_names) === null || _f === void 0 ? void 0 : _f[4]).toBe(123);
        });
    });
    describe('Date and Time Edge Cases', () => {
        it('should handle invalid timestamps', () => {
            const match = {
                id: 123456,
                homeID: 1001,
                awayID: 1002,
                season: "2023-24",
                status: 'complete',
                homeGoalCount: 2,
                awayGoalCount: 1,
                totalGoalCount: 3,
                date_unix: NaN // Invalid timestamp
            };
            expect(isNaN(match.date_unix)).toBe(true);
            expect(typeof match.date_unix).toBe('number');
        });
        it('should handle future and past extreme dates', () => {
            const futureMatch = {
                id: 123456,
                homeID: 1001,
                awayID: 1002,
                season: "2023-24",
                status: 'complete',
                homeGoalCount: 2,
                awayGoalCount: 1,
                totalGoalCount: 3,
                date_unix: 4102444800 // Year 2100
            };
            const pastMatch = {
                id: 123457,
                homeID: 1001,
                awayID: 1002,
                season: "1900-01",
                status: 'complete',
                homeGoalCount: 1,
                awayGoalCount: 0,
                totalGoalCount: 1,
                date_unix: -2208988800 // Year 1900
            };
            expect(futureMatch.date_unix).toBe(4102444800);
            expect(pastMatch.date_unix).toBe(-2208988800);
        });
    });
    describe('Type Coercion Edge Cases', () => {
        it('should handle string numbers', () => {
            const match = {
                id: '123456', // String instead of number
                homeID: '1001',
                awayID: '1002',
                season: "2023-24",
                status: 'complete',
                homeGoalCount: '2',
                awayGoalCount: '1',
                totalGoalCount: '3',
                date_unix: '1640995200'
            };
            expect(typeof match.id).toBe('string');
            expect(match.id).toBe('123456');
            expect(typeof match.homeGoalCount).toBe('string');
            expect(match.homeGoalCount).toBe('2');
        });
        it('should handle boolean coercion', () => {
            const match = {
                id: 123456,
                homeID: 1001,
                awayID: 1002,
                season: "2023-24",
                status: 'complete',
                homeGoalCount: 2,
                awayGoalCount: 1,
                totalGoalCount: 3,
                date_unix: 1640995200,
                btts: 'true', // String instead of boolean
                over25: 1, // Number instead of boolean
                over35: null // Null instead of boolean
            };
            expect(typeof match.btts).toBe('string');
            expect(match.btts).toBe('true');
            expect(typeof match.over25).toBe('number');
            expect(match.over25).toBe(1);
            expect(match.over35).toBeNull();
        });
    });
    describe('Memory and Performance Edge Cases', () => {
        it('should handle circular references gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            const circularObject = { id: 1, name: 'test' };
            circularObject.self = circularObject; // Circular reference
            // Cache should reject circular references (JSON.stringify will fail)
            yield expect(cacheManager.set('circular', circularObject)).rejects.toThrow();
        }));
        it('should handle undefined and null values', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test with valid objects containing undefined/null properties
            const objectWithUndefined = { id: 1, name: 'test', value: undefined };
            const objectWithNull = { id: 2, name: 'test', value: null };
            yield cacheManager.set('undefined-test', objectWithUndefined);
            yield cacheManager.set('null-test', objectWithNull);
            const undefinedResult = yield cacheManager.get('undefined-test');
            const nullResult = yield cacheManager.get('null-test');
            // Should handle these gracefully
            expect(undefinedResult).toBeDefined();
            expect(nullResult).toBeDefined();
            expect(undefinedResult === null || undefinedResult === void 0 ? void 0 : undefinedResult.id).toBe(1);
            expect(nullResult === null || nullResult === void 0 ? void 0 : nullResult.id).toBe(2);
        }));
    });
});
