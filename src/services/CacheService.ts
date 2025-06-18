/**
 * 🎯 Cache Service
 * 
 * High-level cache service that implements cache-aside pattern
 * for all FootyStats API interactions. Prevents rate limiting
 * by intelligently caching data based on type and freshness requirements.
 */

import { logger } from '../utils/logger';
import { AdvancedCacheService } from './AdvancedCacheService';

export interface CacheServiceConfig {
  enableRedis: boolean;
  enableMemory: boolean;
  redisUrl?: string;
  redisToken?: string;
  defaultTtl: number;
  maxMemoryUsage: number;
}

export class CacheService {
  private advancedCache: AdvancedCacheService;

  constructor(config: CacheServiceConfig) {
    this.advancedCache = new AdvancedCacheService({
      enableRedis: config.enableRedis,
      enableMemory: config.enableMemory,
      defaultTtl: config.defaultTtl,
      maxMemoryUsage: config.maxMemoryUsage,
      redisUrl: config.redisUrl,
      redisToken: config.redisToken
    });

    logger.info('✅ CacheService initialized');
  }

  /**
   * 🎯 Generic get method for cache
   */
  async get<T>(key: string): Promise<T | null> {
    return this.advancedCache.get<T>(key);
  }

  /**
   * 🎯 Generic set method for cache
   */
  async set<T>(key: string, value: T, options?: { ttl?: number; tags?: string[]; compress?: boolean }): Promise<void> {
    return this.advancedCache.set(key, value, options);
  }

  /**
   * 🧹 Delete from cache
   */
  async delete(key: string): Promise<void> {
    return this.advancedCache.delete(key);
  }

  /**
   * 🧹 Invalidate cache by tags
   */
  async invalidateByTags(tags: string[]): Promise<void> {
    await this.advancedCache.clearByTags(tags);
    logger.info(`🧹 Invalidated cache by tags: ${tags.join(', ')}`);
  }

  /**
   * 🧹 Invalidate match-specific cache
   */
  async invalidateMatch(matchId: number): Promise<void> {
    await this.invalidateByTags([`match-${matchId}`]);
  }

  /**
   * 🧹 Invalidate team-specific cache
   */
  async invalidateTeam(teamId: number): Promise<void> {
    await this.invalidateByTags([`team-${teamId}`]);
  }

  /**
   * 📊 Get cache metrics
   */
  getMetrics() {
    return this.advancedCache.getMetrics();
  }

  /**
   * 🔥 Warm cache with frequently accessed data
   */
  async warmCache(): Promise<void> {
    await this.advancedCache.warmCache();
  }

  /**
   * 🏥 Health check
   */
  async healthCheck() {
    return this.advancedCache.healthCheck();
  }

  /**
   * 🧹 Shutdown
   */
  async shutdown(): Promise<void> {
    await this.advancedCache.shutdown();
  }
}
