"use strict";
/**
 * CacheManager Tests
 * Test the caching functionality and integration
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
const CacheManager_1 = require("../../../cache/CacheManager");
const footballConstants_1 = require("../../../utils/constants/footballConstants");
describe('CacheManager', () => {
    let cacheManager;
    beforeEach(() => {
        cacheManager = new CacheManager_1.CacheManager({
            defaultTtl: 60, // 1 minute for testing
            maxMemoryUsage: 1024 * 1024, // 1MB for testing
            cleanupIntervalMs: 1000 // 1 second for testing
        });
    });
    afterEach(() => {
        cacheManager.shutdown();
    });
    describe('Basic Cache Operations', () => {
        it('should set and get values correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const key = 'test-key';
            const value = { data: 'test-data', number: 123 };
            yield cacheManager.set(key, value);
            const retrieved = yield cacheManager.get(key);
            expect(retrieved).toEqual(value);
        }));
        it('should return null for non-existent keys', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cacheManager.get('non-existent-key');
            expect(result).toBeNull();
        }));
        it('should delete values correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const key = 'delete-test';
            const value = 'test-value';
            yield cacheManager.set(key, value);
            expect(yield cacheManager.get(key)).toBe(value);
            const deleted = yield cacheManager.delete(key);
            expect(deleted).toBe(true);
            expect(yield cacheManager.get(key)).toBeNull();
        }));
        it('should check if key exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const key = 'exists-test';
            const value = 'test-value';
            expect(cacheManager.has(key)).toBe(false);
            yield cacheManager.set(key, value);
            expect(cacheManager.has(key)).toBe(true);
            yield cacheManager.delete(key);
            expect(cacheManager.has(key)).toBe(false);
        }));
    });
    describe('TTL (Time To Live)', () => {
        it('should respect custom TTL', () => __awaiter(void 0, void 0, void 0, function* () {
            const key = 'ttl-test';
            const value = 'test-value';
            const shortTtl = 1; // 1 second
            yield cacheManager.set(key, value, { ttl: shortTtl });
            expect(yield cacheManager.get(key)).toBe(value);
            // Wait for TTL to expire
            yield new Promise(resolve => setTimeout(resolve, 1100));
            expect(yield cacheManager.get(key)).toBeNull();
        }));
        it('should use default TTL when not specified', () => __awaiter(void 0, void 0, void 0, function* () {
            const key = 'default-ttl-test';
            const value = 'test-value';
            yield cacheManager.set(key, value);
            const retrieved = yield cacheManager.get(key);
            expect(retrieved).toBe(value);
        }));
    });
    describe('Tags and Bulk Operations', () => {
        it('should clear cache by tags', () => __awaiter(void 0, void 0, void 0, function* () {
            yield cacheManager.set('key1', 'value1', { tags: ['tag1', 'tag2'] });
            yield cacheManager.set('key2', 'value2', { tags: ['tag2', 'tag3'] });
            yield cacheManager.set('key3', 'value3', { tags: ['tag3'] });
            expect(yield cacheManager.get('key1')).toBe('value1');
            expect(yield cacheManager.get('key2')).toBe('value2');
            expect(yield cacheManager.get('key3')).toBe('value3');
            const cleared = yield cacheManager.clearByTags(['tag2']);
            expect(cleared).toBe(2); // key1 and key2 should be cleared
            expect(yield cacheManager.get('key1')).toBeNull();
            expect(yield cacheManager.get('key2')).toBeNull();
            expect(yield cacheManager.get('key3')).toBe('value3');
        }));
        it('should clear all cache', () => __awaiter(void 0, void 0, void 0, function* () {
            yield cacheManager.set('key1', 'value1');
            yield cacheManager.set('key2', 'value2');
            yield cacheManager.set('key3', 'value3');
            yield cacheManager.clear();
            expect(yield cacheManager.get('key1')).toBeNull();
            expect(yield cacheManager.get('key2')).toBeNull();
            expect(yield cacheManager.get('key3')).toBeNull();
        }));
    });
    describe('Get or Set Pattern', () => {
        it('should execute function and cache result on cache miss', () => __awaiter(void 0, void 0, void 0, function* () {
            const key = 'get-or-set-test';
            let functionCalled = false;
            const fn = () => __awaiter(void 0, void 0, void 0, function* () {
                functionCalled = true;
                return { data: 'computed-value', timestamp: Date.now() };
            });
            const result1 = yield cacheManager.getOrSet(key, fn);
            expect(functionCalled).toBe(true);
            expect(result1.data).toBe('computed-value');
            // Reset flag and call again - should use cache
            functionCalled = false;
            const result2 = yield cacheManager.getOrSet(key, fn);
            expect(functionCalled).toBe(false);
            expect(result2).toEqual(result1);
        }));
        it('should handle function errors correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const key = 'error-test';
            const errorFn = () => __awaiter(void 0, void 0, void 0, function* () {
                throw new Error('Test error');
            });
            yield expect(cacheManager.getOrSet(key, errorFn)).rejects.toThrow('Test error');
            expect(yield cacheManager.get(key)).toBeNull();
        }));
    });
    describe('Statistics', () => {
        it('should track cache statistics', () => __awaiter(void 0, void 0, void 0, function* () {
            const initialStats = cacheManager.getStats();
            expect(initialStats.hits).toBe(0);
            expect(initialStats.misses).toBe(0);
            // Cache miss
            yield cacheManager.get('non-existent');
            let stats = cacheManager.getStats();
            expect(stats.misses).toBe(1);
            // Cache set and hit
            yield cacheManager.set('test-key', 'test-value');
            yield cacheManager.get('test-key');
            stats = cacheManager.getStats();
            expect(stats.hits).toBe(1);
            expect(stats.totalKeys).toBe(1);
        }));
        it('should calculate hit rate correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            yield cacheManager.set('key1', 'value1');
            // 2 hits, 1 miss = 66.67% hit rate
            yield cacheManager.get('key1'); // hit
            yield cacheManager.get('key1'); // hit
            yield cacheManager.get('non-existent'); // miss
            const stats = cacheManager.getStats();
            expect(stats.hits).toBe(2);
            expect(stats.misses).toBe(1);
            expect(stats.hitRate).toBeCloseTo(0.667, 2);
        }));
    });
    describe('Key Management', () => {
        it('should get all keys', () => __awaiter(void 0, void 0, void 0, function* () {
            yield cacheManager.set('key1', 'value1');
            yield cacheManager.set('key2', 'value2');
            yield cacheManager.set('test-key', 'test-value');
            const keys = cacheManager.getKeys();
            expect(keys).toContain('key1');
            expect(keys).toContain('key2');
            expect(keys).toContain('test-key');
            expect(keys.length).toBe(3);
        }));
        it('should get keys matching pattern', () => __awaiter(void 0, void 0, void 0, function* () {
            yield cacheManager.set('user:1', 'user1');
            yield cacheManager.set('user:2', 'user2');
            yield cacheManager.set('product:1', 'product1');
            const userKeys = cacheManager.getKeys('user:*');
            expect(userKeys).toContain('user:1');
            expect(userKeys).toContain('user:2');
            expect(userKeys).not.toContain('product:1');
        }));
    });
    describe('Football Constants Integration', () => {
        it('should use football-specific TTL values', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test that our cache manager works with football constants
            expect(footballConstants_1.CACHE_TTL.LIVE_MATCHES).toBeDefined();
            expect(footballConstants_1.CACHE_TTL.TEAM_DATA).toBeDefined();
            expect(footballConstants_1.CACHE_TTL.REFERENCE).toBeDefined();
            const key = 'live-match-test';
            const value = { matchId: 123, status: 'live' };
            yield cacheManager.set(key, value, { ttl: footballConstants_1.CACHE_TTL.LIVE_MATCHES });
            const retrieved = yield cacheManager.get(key);
            expect(retrieved).toEqual(value);
        }));
    });
    describe('Memory Management', () => {
        it('should track memory usage', () => __awaiter(void 0, void 0, void 0, function* () {
            const initialStats = cacheManager.getStats();
            const initialMemory = initialStats.memoryUsage;
            yield cacheManager.set('large-data', {
                data: 'x'.repeat(1000),
                array: new Array(100).fill('test')
            });
            const newStats = cacheManager.getStats();
            expect(newStats.memoryUsage).toBeGreaterThan(initialMemory);
        }));
    });
});
