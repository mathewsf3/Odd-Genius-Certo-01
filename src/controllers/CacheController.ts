/**
 * 🎯 Cache Controller
 * 
 * Express.js controller for cache management and monitoring
 * Provides endpoints for cache statistics, health checks, and management
 * 
 * Features:
 * - Cache metrics and statistics
 * - Cache health monitoring
 * - Manual cache operations (invalidation, warming)
 * - Performance monitoring
 */

import { NextFunction, Request, Response } from 'express';
import { getCacheInitService } from '../services/CacheInitializationService';
import { logger } from '../utils/logger';

export class CacheController {
  private cacheInitService = getCacheInitService();

  /**
   * GET /api/v1/cache/metrics
   * Get comprehensive cache metrics and statistics
   */
  async getMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('📊 Getting cache metrics');

      const statistics = await this.cacheInitService.getStatistics();

      res.json({
        success: true,
        data: statistics,
        message: 'Cache metrics retrieved successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('❌ Error getting cache metrics:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/cache/health
   * Get cache health status
   */
  async getHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('🏥 Checking cache health');

      const statistics = await this.cacheInitService.getStatistics();
      const health = statistics.health;

      const status = health.overall ? 'healthy' : 'degraded';
      const statusCode = health.overall ? 200 : 503;

      res.status(statusCode).json({
        success: health.overall,
        status,
        data: {
          memory: health.memory,
          redis: health.redis,
          overall: health.overall,
          details: {
            memoryConnected: health.memory,
            redisConnected: health.redis,
            backgroundRefresh: statistics.warming.backgroundRefreshEnabled,
            warmingInProgress: statistics.warming.inProgress
          }
        },
        message: `Cache is ${status}`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('❌ Error checking cache health:', error);
      res.status(500).json({
        success: false,
        status: 'error',
        message: 'Failed to check cache health',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/v1/cache/warm
   * Manually trigger cache warming
   */
  async warmCache(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('🔥 Manual cache warming triggered');

      // Check if warming is already in progress
      const statistics = await this.cacheInitService.getStatistics();
      if (statistics.warming.inProgress) {
        res.status(409).json({
          success: false,
          message: 'Cache warming already in progress',
          data: { inProgress: true }
        });
        return;
      }

      // Trigger cache warming (async)
      this.cacheInitService.forceRefresh().catch(error => {
        logger.error('❌ Manual cache warming failed:', error);
      });

      res.json({
        success: true,
        message: 'Cache warming initiated',
        data: { initiated: true },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('❌ Error initiating cache warming:', error);
      next(error);
    }
  }

  /**
   * DELETE /api/v1/cache/invalidate
   * Invalidate cache by pattern or tags
   */
  async invalidateCache(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { pattern, tags } = req.body;

      if (!pattern && !tags) {
        res.status(400).json({
          success: false,
          message: 'Either pattern or tags must be provided',
          example: {
            pattern: 'live|today|upcoming|matches',
            tags: ['live', 'matches']
          }
        });
        return;
      }

      logger.info('🧹 Manual cache invalidation triggered', { pattern, tags });

      if (pattern) {
        await this.cacheInitService.invalidateByPattern(pattern);
      }

      res.json({
        success: true,
        message: 'Cache invalidation completed',
        data: { pattern, tags },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('❌ Error invalidating cache:', error);
      next(error);
    }
  }

  /**
   * POST /api/v1/cache/refresh
   * Force complete cache refresh (invalidate + warm)
   */
  async refreshCache(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('🔄 Manual cache refresh triggered');

      // Check if warming is already in progress
      const statistics = await this.cacheInitService.getStatistics();
      if (statistics.warming.inProgress) {
        res.status(409).json({
          success: false,
          message: 'Cache operation already in progress',
          data: { inProgress: true }
        });
        return;
      }

      // Trigger complete refresh (async)
      this.cacheInitService.forceRefresh().catch(error => {
        logger.error('❌ Manual cache refresh failed:', error);
      });

      res.json({
        success: true,
        message: 'Cache refresh initiated (invalidate + warm)',
        data: { initiated: true },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('❌ Error initiating cache refresh:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/cache/config
   * Get current cache configuration
   */
  async getConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('⚙️ Getting cache configuration');

      const statistics = await this.cacheInitService.getStatistics();

      res.json({
        success: true,
        data: {
          config: statistics.config,
          environment: {
            enableRedis: process.env.ENABLE_REDIS_CACHE === 'true',
            redisUrl: process.env.REDIS_URL ? '***configured***' : 'not set',
            redisToken: process.env.REDIS_TOKEN ? '***configured***' : 'not set'
          },
          features: {
            memoryCache: true,
            redisCache: process.env.ENABLE_REDIS_CACHE === 'true',
            backgroundRefresh: statistics.config.enableBackgroundRefresh,
            cacheWarming: statistics.config.enableWarming
          }
        },
        message: 'Cache configuration retrieved successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('❌ Error getting cache configuration:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/cache/stats/summary
   * Get summarized cache statistics for monitoring dashboards
   */
  async getStatsSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const statistics = await this.cacheInitService.getStatistics();
      const metrics = statistics.metrics;

      // Calculate hit rate
      const totalRequests = metrics.hits + metrics.misses;
      const hitRate = totalRequests > 0 ? (metrics.hits / totalRequests) * 100 : 0;

      // Calculate memory usage in MB
      const memoryUsageMB = Math.round(metrics.memoryUsage / 1024 / 1024);

      res.json({
        success: true,
        data: {
          performance: {
            hitRate: Math.round(hitRate * 100) / 100, // Round to 2 decimal places
            totalRequests,
            hits: metrics.hits,
            misses: metrics.misses,
            avgResponseTime: Math.round(metrics.avgResponseTime * 100) / 100
          },
          storage: {
            memoryUsageMB,
            totalSets: metrics.sets,
            totalDeletes: metrics.deletes
          },
          health: {
            memoryConnected: statistics.health.memory,
            redisConnected: statistics.health.redis,
            overall: statistics.health.overall
          },
          operations: {
            warmingInProgress: statistics.warming.inProgress,
            backgroundRefreshEnabled: statistics.warming.backgroundRefreshEnabled,
            errors: metrics.errors
          }
        },
        message: 'Cache summary statistics retrieved successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('❌ Error getting cache summary:', error);
      next(error);
    }
  }
}

export default new CacheController();
