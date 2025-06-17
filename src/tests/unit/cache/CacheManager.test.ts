/**
 * CacheManager Tests
 * Test the caching functionality and integration
 */

import { CacheManager } from '../../../cache/CacheManager';
import { CACHE_TTL } from '../../../utils/constants/footballConstants';

describe('CacheManager', () => {
  let cacheManager: CacheManager;

  beforeEach(() => {
    cacheManager = new CacheManager({
      defaultTtl: 60, // 1 minute for testing
      maxMemoryUsage: 1024 * 1024, // 1MB for testing
      cleanupIntervalMs: 1000 // 1 second for testing
    });
  });

  afterEach(() => {
    cacheManager.shutdown();
  });

  describe('Basic Cache Operations', () => {
    it('should set and get values correctly', async () => {
      const key = 'test-key';
      const value = { data: 'test-data', number: 123 };

      await cacheManager.set(key, value);
      const retrieved = await cacheManager.get(key);

      expect(retrieved).toEqual(value);
    });

    it('should return null for non-existent keys', async () => {
      const result = await cacheManager.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should delete values correctly', async () => {
      const key = 'delete-test';
      const value = 'test-value';

      await cacheManager.set(key, value);
      expect(await cacheManager.get(key)).toBe(value);

      const deleted = await cacheManager.delete(key);
      expect(deleted).toBe(true);
      expect(await cacheManager.get(key)).toBeNull();
    });

    it('should check if key exists', async () => {
      const key = 'exists-test';
      const value = 'test-value';

      expect(cacheManager.has(key)).toBe(false);

      await cacheManager.set(key, value);
      expect(cacheManager.has(key)).toBe(true);

      await cacheManager.delete(key);
      expect(cacheManager.has(key)).toBe(false);
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should respect custom TTL', async () => {
      const key = 'ttl-test';
      const value = 'test-value';
      const shortTtl = 1; // 1 second

      await cacheManager.set(key, value, { ttl: shortTtl });
      expect(await cacheManager.get(key)).toBe(value);

      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 1100));
      expect(await cacheManager.get(key)).toBeNull();
    });

    it('should use default TTL when not specified', async () => {
      const key = 'default-ttl-test';
      const value = 'test-value';

      await cacheManager.set(key, value);
      const retrieved = await cacheManager.get(key);
      expect(retrieved).toBe(value);
    });
  });

  describe('Tags and Bulk Operations', () => {
    it('should clear cache by tags', async () => {
      await cacheManager.set('key1', 'value1', { tags: ['tag1', 'tag2'] });
      await cacheManager.set('key2', 'value2', { tags: ['tag2', 'tag3'] });
      await cacheManager.set('key3', 'value3', { tags: ['tag3'] });

      expect(await cacheManager.get('key1')).toBe('value1');
      expect(await cacheManager.get('key2')).toBe('value2');
      expect(await cacheManager.get('key3')).toBe('value3');

      const cleared = await cacheManager.clearByTags(['tag2']);
      expect(cleared).toBe(2); // key1 and key2 should be cleared

      expect(await cacheManager.get('key1')).toBeNull();
      expect(await cacheManager.get('key2')).toBeNull();
      expect(await cacheManager.get('key3')).toBe('value3');
    });

    it('should clear all cache', async () => {
      await cacheManager.set('key1', 'value1');
      await cacheManager.set('key2', 'value2');
      await cacheManager.set('key3', 'value3');

      await cacheManager.clear();

      expect(await cacheManager.get('key1')).toBeNull();
      expect(await cacheManager.get('key2')).toBeNull();
      expect(await cacheManager.get('key3')).toBeNull();
    });
  });

  describe('Get or Set Pattern', () => {
    it('should execute function and cache result on cache miss', async () => {
      const key = 'get-or-set-test';
      let functionCalled = false;
      
      const fn = async () => {
        functionCalled = true;
        return { data: 'computed-value', timestamp: Date.now() };
      };

      const result1 = await cacheManager.getOrSet(key, fn);
      expect(functionCalled).toBe(true);
      expect(result1.data).toBe('computed-value');

      // Reset flag and call again - should use cache
      functionCalled = false;
      const result2 = await cacheManager.getOrSet(key, fn);
      expect(functionCalled).toBe(false);
      expect(result2).toEqual(result1);
    });

    it('should handle function errors correctly', async () => {
      const key = 'error-test';
      const errorFn = async () => {
        throw new Error('Test error');
      };

      await expect(cacheManager.getOrSet(key, errorFn)).rejects.toThrow('Test error');
      expect(await cacheManager.get(key)).toBeNull();
    });
  });

  describe('Statistics', () => {
    it('should track cache statistics', async () => {
      const initialStats = cacheManager.getStats();
      expect(initialStats.hits).toBe(0);
      expect(initialStats.misses).toBe(0);

      // Cache miss
      await cacheManager.get('non-existent');
      let stats = cacheManager.getStats();
      expect(stats.misses).toBe(1);

      // Cache set and hit
      await cacheManager.set('test-key', 'test-value');
      await cacheManager.get('test-key');
      stats = cacheManager.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.totalKeys).toBe(1);
    });

    it('should calculate hit rate correctly', async () => {
      await cacheManager.set('key1', 'value1');
      
      // 2 hits, 1 miss = 66.67% hit rate
      await cacheManager.get('key1'); // hit
      await cacheManager.get('key1'); // hit
      await cacheManager.get('non-existent'); // miss

      const stats = cacheManager.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBeCloseTo(0.667, 2);
    });
  });

  describe('Key Management', () => {
    it('should get all keys', async () => {
      await cacheManager.set('key1', 'value1');
      await cacheManager.set('key2', 'value2');
      await cacheManager.set('test-key', 'test-value');

      const keys = cacheManager.getKeys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('test-key');
      expect(keys.length).toBe(3);
    });

    it('should get keys matching pattern', async () => {
      await cacheManager.set('user:1', 'user1');
      await cacheManager.set('user:2', 'user2');
      await cacheManager.set('product:1', 'product1');

      const userKeys = cacheManager.getKeys('user:*');
      expect(userKeys).toContain('user:1');
      expect(userKeys).toContain('user:2');
      expect(userKeys).not.toContain('product:1');
    });
  });

  describe('Football Constants Integration', () => {
    it('should use football-specific TTL values', async () => {
      // Test that our cache manager works with football constants
      expect(CACHE_TTL.LIVE_MATCHES).toBeDefined();
      expect(CACHE_TTL.TEAM_DATA).toBeDefined();
      expect(CACHE_TTL.REFERENCE).toBeDefined();

      const key = 'live-match-test';
      const value = { matchId: 123, status: 'live' };

      await cacheManager.set(key, value, { ttl: CACHE_TTL.LIVE_MATCHES });
      const retrieved = await cacheManager.get(key);
      expect(retrieved).toEqual(value);
    });
  });

  describe('Memory Management', () => {
    it('should track memory usage', async () => {
      const initialStats = cacheManager.getStats();
      const initialMemory = initialStats.memoryUsage;

      await cacheManager.set('large-data', { 
        data: 'x'.repeat(1000),
        array: new Array(100).fill('test')
      });

      const newStats = cacheManager.getStats();
      expect(newStats.memoryUsage).toBeGreaterThan(initialMemory);
    });
  });
});
