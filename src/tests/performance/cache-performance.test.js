"use strict";
/**
 * CACHE PERFORMANCE STRESS TEST
 * Tests cache operations under load, memory management, and response times
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
const footballConstants_1 = require("../../utils/constants/footballConstants");
describe('⚡ CACHE PERFORMANCE STRESS TEST', () => {
    let cacheManager;
    beforeEach(() => {
        cacheManager = new CacheManager_1.CacheManager({
            defaultTtl: 300, // 5 minutes
            maxMemoryUsage: 10 * 1024 * 1024, // 10MB for testing
            cleanupIntervalMs: 1000 // 1 second for testing
        });
    });
    afterEach(() => {
        cacheManager.shutdown();
    });
    describe('Response Time Performance', () => {
        it('should handle cache SET operations under 5ms', () => __awaiter(void 0, void 0, void 0, function* () {
            const match = {
                id: 123456,
                homeID: 1001,
                awayID: 1002,
                season: "2023-24",
                status: 'complete',
                homeGoalCount: 2,
                awayGoalCount: 1,
                totalGoalCount: 3,
                date_unix: 1640995200
            };
            const iterations = 100;
            const times = [];
            for (let i = 0; i < iterations; i++) {
                const startTime = performance.now();
                yield cacheManager.set(`test-key-${i}`, match);
                const endTime = performance.now();
                times.push(endTime - startTime);
            }
            const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
            const maxTime = Math.max(...times);
            expect(averageTime).toBeLessThan(5); // Average under 5ms
            expect(maxTime).toBeLessThan(20); // Max under 20ms
            console.log(`Cache SET - Average: ${averageTime.toFixed(2)}ms, Max: ${maxTime.toFixed(2)}ms`);
        }));
        it('should handle cache GET operations under 2ms', () => __awaiter(void 0, void 0, void 0, function* () {
            const match = {
                id: 123456,
                homeID: 1001,
                awayID: 1002,
                season: "2023-24",
                status: 'complete',
                homeGoalCount: 2,
                awayGoalCount: 1,
                totalGoalCount: 3,
                date_unix: 1640995200
            };
            // Pre-populate cache
            const keys = [];
            for (let i = 0; i < 100; i++) {
                const key = `test-key-${i}`;
                keys.push(key);
                yield cacheManager.set(key, match);
            }
            const times = [];
            for (const key of keys) {
                const startTime = performance.now();
                yield cacheManager.get(key);
                const endTime = performance.now();
                times.push(endTime - startTime);
            }
            const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
            const maxTime = Math.max(...times);
            expect(averageTime).toBeLessThan(2); // Average under 2ms
            expect(maxTime).toBeLessThan(10); // Max under 10ms
            console.log(`Cache GET - Average: ${averageTime.toFixed(2)}ms, Max: ${maxTime.toFixed(2)}ms`);
        }));
    });
    describe('Concurrent Operations Performance', () => {
        it('should handle 1000 concurrent SET operations', () => __awaiter(void 0, void 0, void 0, function* () {
            const startTime = performance.now();
            const promises = [];
            for (let i = 0; i < 1000; i++) {
                const match = {
                    id: i,
                    homeID: i * 10,
                    awayID: i * 10 + 1,
                    season: "2023-24",
                    status: 'complete',
                    homeGoalCount: i % 5,
                    awayGoalCount: (i + 1) % 5,
                    totalGoalCount: (i % 5) + ((i + 1) % 5),
                    date_unix: 1640995200 + i
                };
                promises.push(cacheManager.set(`concurrent-${i}`, match));
            }
            yield Promise.all(promises);
            const endTime = performance.now();
            const totalTime = endTime - startTime;
            expect(totalTime).toBeLessThan(2000); // Under 2 seconds for 1000 operations
            expect(cacheManager.getStats().totalKeys).toBe(1000);
            console.log(`1000 concurrent SET operations: ${totalTime.toFixed(2)}ms`);
        }));
        it('should handle 1000 concurrent GET operations', () => __awaiter(void 0, void 0, void 0, function* () {
            // Pre-populate cache
            for (let i = 0; i < 1000; i++) {
                const match = {
                    id: i,
                    homeID: i * 10,
                    awayID: i * 10 + 1,
                    season: "2023-24",
                    status: 'complete',
                    homeGoalCount: i % 5,
                    awayGoalCount: (i + 1) % 5,
                    totalGoalCount: (i % 5) + ((i + 1) % 5),
                    date_unix: 1640995200 + i
                };
                yield cacheManager.set(`concurrent-get-${i}`, match);
            }
            const startTime = performance.now();
            const promises = [];
            for (let i = 0; i < 1000; i++) {
                promises.push(cacheManager.get(`concurrent-get-${i}`));
            }
            const results = yield Promise.all(promises);
            const endTime = performance.now();
            const totalTime = endTime - startTime;
            expect(totalTime).toBeLessThan(500); // Under 500ms for 1000 GET operations
            expect(results.filter(r => r !== null)).toHaveLength(1000);
            console.log(`1000 concurrent GET operations: ${totalTime.toFixed(2)}ms`);
        }));
    });
    describe('Memory Management Performance', () => {
        it('should efficiently manage memory usage', () => __awaiter(void 0, void 0, void 0, function* () {
            const initialStats = cacheManager.getStats();
            const initialMemory = initialStats.memoryUsage;
            // Add large objects to test memory management
            const largeObjects = [];
            for (let i = 0; i < 100; i++) {
                const largeMatch = {
                    id: i,
                    homeID: i * 10,
                    awayID: i * 10 + 1,
                    season: "2023-24",
                    status: 'complete',
                    homeGoalCount: i % 5,
                    awayGoalCount: (i + 1) % 5,
                    totalGoalCount: (i % 5) + ((i + 1) % 5),
                    date_unix: 1640995200 + i,
                    // Add large data to test memory
                    homeGoals: new Array(i % 10).fill(`goal-${i}`),
                    awayGoals: new Array((i + 1) % 10).fill(`goal-${i}`)
                };
                largeObjects.push(largeMatch);
                yield cacheManager.set(`memory-test-${i}`, largeMatch);
            }
            const afterStats = cacheManager.getStats();
            const memoryIncrease = afterStats.memoryUsage - initialMemory;
            expect(afterStats.totalKeys).toBe(100);
            expect(memoryIncrease).toBeGreaterThan(0);
            expect(afterStats.memoryUsage).toBeLessThan(5 * 1024 * 1024); // Under 5MB
            console.log(`Memory usage: ${(afterStats.memoryUsage / 1024).toFixed(2)}KB for 100 objects`);
        }));
        it('should handle cache cleanup efficiently', () => __awaiter(void 0, void 0, void 0, function* () {
            // Add items with short TTL
            for (let i = 0; i < 50; i++) {
                yield cacheManager.set(`cleanup-test-${i}`, { data: `test-${i}` }, { ttl: 1 }); // 1 second TTL
            }
            expect(cacheManager.getStats().totalKeys).toBe(50);
            // Wait for TTL to expire
            yield new Promise(resolve => setTimeout(resolve, 1100));
            // Trigger cleanup by accessing cache
            yield cacheManager.get('cleanup-test-0');
            // Check that expired items are cleaned up
            const stats = cacheManager.getStats();
            expect(stats.totalKeys).toBeLessThan(50);
            console.log(`Cleanup efficiency: ${stats.totalKeys} items remaining after TTL expiry`);
        }));
    });
    describe('Cache Hit Rate Performance', () => {
        it('should maintain high hit rate under load', () => __awaiter(void 0, void 0, void 0, function* () {
            // Pre-populate cache with football data
            const teams = [];
            for (let i = 0; i < 20; i++) {
                const team = {
                    id: i,
                    name: `Team ${i}`,
                    country: "England",
                    table_position: i + 1
                };
                teams.push(team);
                yield cacheManager.set(CacheKeys_1.cacheKeys.team(i), team, { ttl: footballConstants_1.CACHE_TTL.TEAM_DATA });
            }
            // Simulate realistic access patterns (80/20 rule - 80% of requests for 20% of data)
            const accessPromises = [];
            for (let i = 0; i < 1000; i++) {
                const teamId = Math.random() < 0.8 ? i % 4 : i % 20; // 80% access to first 4 teams
                accessPromises.push(cacheManager.get(CacheKeys_1.cacheKeys.team(teamId)));
            }
            yield Promise.all(accessPromises);
            const stats = cacheManager.getStats();
            expect(stats.hitRate).toBeGreaterThan(0.8); // 80%+ hit rate
            console.log(`Hit rate under load: ${(stats.hitRate * 100).toFixed(2)}%`);
            console.log(`Total hits: ${stats.hits}, Total misses: ${stats.misses}`);
        }));
    });
    describe('Football-Specific Performance', () => {
        it('should handle football cache key generation efficiently', () => {
            const iterations = 10000;
            const startTime = performance.now();
            for (let i = 0; i < iterations; i++) {
                CacheKeys_1.cacheKeys.match(i);
                CacheKeys_1.cacheKeys.team(i, true);
                CacheKeys_1.cacheKeys.todaysMatches('2023-12-19', 'UTC', i % 10);
                CacheKeys_1.cacheKeys.leagueMatches(i, i % 10, 50, 300);
            }
            const endTime = performance.now();
            const totalTime = endTime - startTime;
            const avgTimePerKey = totalTime / (iterations * 4); // 4 keys per iteration
            expect(totalTime).toBeLessThan(100); // Under 100ms for 40,000 key generations
            expect(avgTimePerKey).toBeLessThan(0.01); // Under 0.01ms per key
            console.log(`Cache key generation: ${totalTime.toFixed(2)}ms for ${iterations * 4} keys`);
            console.log(`Average per key: ${avgTimePerKey.toFixed(4)}ms`);
        });
        it('should handle realistic football data load', () => __awaiter(void 0, void 0, void 0, function* () {
            const startTime = performance.now();
            // Simulate a realistic football API load
            const operations = [];
            // Today's matches (high frequency)
            for (let i = 0; i < 50; i++) {
                const match = {
                    id: i,
                    homeID: i * 2,
                    awayID: i * 2 + 1,
                    season: "2023-24",
                    status: 'complete',
                    homeGoalCount: i % 4,
                    awayGoalCount: (i + 1) % 4,
                    totalGoalCount: (i % 4) + ((i + 1) % 4),
                    date_unix: 1640995200 + i
                };
                operations.push(cacheManager.set(CacheKeys_1.cacheKeys.match(i), match, { ttl: footballConstants_1.CACHE_TTL.LIVE_MATCHES }));
            }
            // Team data (medium frequency)
            for (let i = 0; i < 100; i++) {
                const team = {
                    id: i,
                    name: `Team ${i}`,
                    country: "England",
                    table_position: i + 1
                };
                operations.push(cacheManager.set(CacheKeys_1.cacheKeys.team(i), team, { ttl: footballConstants_1.CACHE_TTL.TEAM_DATA }));
            }
            // Player data (lower frequency)
            for (let i = 0; i < 200; i++) {
                const player = {
                    id: i,
                    name: `Player ${i}`,
                    age: 20 + (i % 15),
                    goals_overall: i % 30
                };
                operations.push(cacheManager.set(CacheKeys_1.cacheKeys.playerStats(i), player, { ttl: footballConstants_1.CACHE_TTL.PLAYER_STATS }));
            }
            yield Promise.all(operations);
            const endTime = performance.now();
            const totalTime = endTime - startTime;
            const stats = cacheManager.getStats();
            expect(stats.totalKeys).toBe(350); // 50 + 100 + 200
            expect(totalTime).toBeLessThan(2000); // Under 2 seconds
            console.log(`Realistic football load: ${totalTime.toFixed(2)}ms for 350 items`);
            console.log(`Memory usage: ${(stats.memoryUsage / 1024).toFixed(2)}KB`);
        }));
    });
});
