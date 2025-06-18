/**
 * 🔥 Cache Initialization Service
 * 
 * Handles cache warming and initialization on application startup
 * Implements intelligent warming strategies to prevent API rate limiting
 * 
 * Features:
 * - Startup cache warming
 * - Background cache refresh
 * - Cache health monitoring
 * - Performance metrics
 */

import { getWarmingPriority } from '../cache/CacheStrategy';
import { logger } from '../utils/logger';
import { CachedMatchService } from './CachedMatchService';
import { CacheService } from './CacheService';

export interface CacheInitConfig {
  enableWarming: boolean;
  enableBackgroundRefresh: boolean;
  warmingDelayMs: number;
  refreshIntervalMs: number;
  maxWarmingRetries: number;
}

export class CacheInitializationService {
  private cachedMatchService: CachedMatchService;
  private cacheService: CacheService;
  private config: CacheInitConfig;
  private warmingInProgress: boolean = false;
  private backgroundRefreshTimer?: NodeJS.Timeout;

  constructor(config: CacheInitConfig) {
    this.config = config;
    this.cachedMatchService = new CachedMatchService();

    // Initialize cache service for direct operations
    this.cacheService = new CacheService({
      enableRedis: process.env.ENABLE_REDIS_CACHE === 'true',
      enableMemory: true,
      defaultTtl: 900,
      maxMemoryUsage: 100 * 1024 * 1024,
      redisUrl: process.env.REDIS_URL,
      redisToken: process.env.REDIS_TOKEN
    });

    logger.info('✅ CacheInitializationService initialized');
  }

  /**
   * 🔥 Initialize and warm cache on application startup
   */
  async initialize(): Promise<void> {
    logger.info('🚀 Starting cache initialization...');

    try {
      // Health check first
      const health = await this.cacheService.healthCheck();
      logger.info('🏥 Cache health check:', health);

      if (this.config.enableWarming) {
        // Delay warming to allow application to fully start
        setTimeout(() => {
          this.warmCache();
        }, this.config.warmingDelayMs);
      }

      if (this.config.enableBackgroundRefresh) {
        this.startBackgroundRefresh();
      }

      logger.info('✅ Cache initialization completed');

    } catch (error) {
      logger.error('❌ Cache initialization failed:', error);
      throw error;
    }
  }

  /**
   * 🔥 Warm cache with frequently accessed data
   */
  private async warmCache(): Promise<void> {
    if (this.warmingInProgress) {
      logger.warn('⚠️ Cache warming already in progress, skipping');
      return;
    }

    this.warmingInProgress = true;
    logger.info('🔥 Starting cache warming process...');

    const startTime = Date.now();
    let successCount = 0;
    let errorCount = 0;

    try {
      // Get warming priorities
      const warmingPriorities = getWarmingPriority();
      logger.info(`🎯 Warming ${warmingPriorities.length} data types in priority order`);

      // 1. Warm today's matches (high priority)
      await this.warmDataType('today-matches', async () => {
        await this.cachedMatchService.getTodaysMatches();
        successCount++;
      });

      // 2. Warm live matches (high priority)
      await this.warmDataType('live-matches', async () => {
        await this.cachedMatchService.getLiveMatches(6); // Dashboard limit
        successCount++;
      });

      // 3. Warm upcoming matches (medium priority)
      await this.warmDataType('upcoming-matches', async () => {
        await this.cachedMatchService.getUpcomingMatches(6); // Dashboard limit
        successCount++;
      });

      // 4. Warm total match count (medium priority)
      await this.warmDataType('total-count', async () => {
        await this.cachedMatchService.getTotalMatchCount();
        successCount++;
      });

      // 5. Warm upcoming count (low priority)
      await this.warmDataType('upcoming-count', async () => {
        await this.cachedMatchService.getUpcomingMatches(1000); // For counting
        successCount++;
      });

      const duration = Date.now() - startTime;
      logger.info(`🎉 Cache warming completed in ${duration}ms`);
      logger.info(`📊 Warming results: ${successCount} success, ${errorCount} errors`);

    } catch (error) {
      logger.error('❌ Cache warming failed:', error);
      errorCount++;
    } finally {
      this.warmingInProgress = false;
    }

    // Log metrics
    const metrics = this.cacheService.getMetrics();
    logger.info('📊 Cache metrics after warming:', {
      hits: metrics.hits,
      misses: metrics.misses,
      sets: metrics.sets,
      memoryUsage: `${Math.round(metrics.memoryUsage / 1024 / 1024)}MB`,
      redisConnected: metrics.redisConnected
    });
  }

  /**
   * 🔥 Warm a specific data type with error handling
   */
  private async warmDataType(name: string, warmFunction: () => Promise<void>): Promise<void> {
    try {
      logger.debug(`🔥 Warming ${name}...`);
      await warmFunction();
      logger.debug(`✅ Warmed ${name} successfully`);
    } catch (error) {
      logger.warn(`⚠️ Failed to warm ${name}:`, error);
      // Continue with other warming tasks
    }
  }

  /**
   * 🔄 Start background cache refresh
   */
  private startBackgroundRefresh(): void {
    logger.info(`🔄 Starting background cache refresh (interval: ${this.config.refreshIntervalMs}ms)`);

    this.backgroundRefreshTimer = setInterval(async () => {
      try {
        logger.debug('🔄 Background cache refresh triggered');

        // Refresh live matches (most important for real-time data)
        await this.cachedMatchService.getLiveMatches(6);

        // Refresh today's matches
        await this.cachedMatchService.getTodaysMatches();

        logger.debug('✅ Background cache refresh completed');

      } catch (error) {
        logger.warn('⚠️ Background cache refresh failed:', error);
      }
    }, this.config.refreshIntervalMs);
  }

  /**
   * 🧹 Stop background refresh
   */
  private stopBackgroundRefresh(): void {
    if (this.backgroundRefreshTimer) {
      clearInterval(this.backgroundRefreshTimer);
      this.backgroundRefreshTimer = undefined;
      logger.info('🛑 Background cache refresh stopped');
    }
  }

  /**
   * 📊 Get cache statistics
   */
  async getStatistics(): Promise<any> {
    const metrics = this.cacheService.getMetrics();
    const health = await this.cacheService.healthCheck();

    return {
      metrics,
      health,
      warming: {
        inProgress: this.warmingInProgress,
        backgroundRefreshEnabled: !!this.backgroundRefreshTimer
      },
      config: this.config
    };
  }

  /**
   * 🧹 Invalidate cache by patterns
   */
  async invalidateByPattern(pattern: string): Promise<void> {
    logger.info(`🧹 Invalidating cache by pattern: ${pattern}`);

    const tags = [];
    
    if (pattern.includes('live')) tags.push('live');
    if (pattern.includes('today')) tags.push('today');
    if (pattern.includes('upcoming')) tags.push('upcoming');
    if (pattern.includes('match')) tags.push('matches');

    if (tags.length > 0) {
      await this.cacheService.invalidateByTags(tags);
      logger.info(`✅ Invalidated cache for tags: ${tags.join(', ')}`);
    }
  }

  /**
   * 🔄 Force cache refresh
   */
  async forceRefresh(): Promise<void> {
    logger.info('🔄 Forcing cache refresh...');

    // Invalidate all match-related cache
    await this.invalidateByPattern('matches');

    // Re-warm cache
    await this.warmCache();

    logger.info('✅ Cache refresh completed');
  }

  /**
   * 🧹 Shutdown cache initialization service
   */
  async shutdown(): Promise<void> {
    logger.info('🧹 Shutting down CacheInitializationService...');

    this.stopBackgroundRefresh();
    await this.cacheService.shutdown();

    logger.info('✅ CacheInitializationService shutdown complete');
  }
}

// Default configuration
export const DEFAULT_CACHE_INIT_CONFIG: CacheInitConfig = {
  enableWarming: true,
  enableBackgroundRefresh: true,
  warmingDelayMs: 5000, // 5 seconds delay after startup
  refreshIntervalMs: 300000, // 5 minutes
  maxWarmingRetries: 3
};

// Singleton instance
let cacheInitService: CacheInitializationService | null = null;

export function getCacheInitService(config: CacheInitConfig = DEFAULT_CACHE_INIT_CONFIG): CacheInitializationService {
  if (!cacheInitService) {
    cacheInitService = new CacheInitializationService(config);
  }
  return cacheInitService;
}
