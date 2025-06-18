/**
 * 🎯 Cached Match Service
 * 
 * Wrapper service that adds intelligent caching to existing match services
 * Implements cache-aside pattern to prevent API rate limiting
 * 
 * Features:
 * - Wraps MatchAnalysisService with caching
 * - Intelligent TTL based on match status
 * - Cache warming for frequently accessed data
 * - Rate limit prevention
 */

import { cacheKeys } from '../cache/CacheKeys';
import { getCacheStrategy, getMatchTTL } from '../cache/CacheStrategy';
import { logger } from '../utils/logger';
import { CacheService } from './CacheService';
import { BasicMatchInfo, DetailedMatchInfo, MatchAnalysisOptions, MatchAnalysisResult, MatchAnalysisService } from './MatchAnalysisService';

export class CachedMatchService {
  private matchAnalysisService: MatchAnalysisService;
  private cacheService: CacheService;

  constructor() {
    this.matchAnalysisService = new MatchAnalysisService();

    // Initialize cache service with configuration
    this.cacheService = new CacheService({
      enableRedis: process.env.ENABLE_REDIS_CACHE === 'true',
      enableMemory: true,
      defaultTtl: 900, // 15 minutes default
      maxMemoryUsage: 100 * 1024 * 1024, // 100MB
      redisUrl: process.env.REDIS_URL,
      redisToken: process.env.REDIS_TOKEN
    });

    logger.info('✅ CachedMatchService initialized with caching layer');
  }

  /**
   * 🎯 Get today's matches with caching
   */
  async getTodaysMatches(date?: string): Promise<BasicMatchInfo> {
    // Debug logging
    logger.info('🔍 cacheKeys object:', JSON.stringify(cacheKeys, null, 2));
    logger.info('🔍 cacheKeys.matches:', cacheKeys.matches);
    logger.info('🔍 typeof cacheKeys:', typeof cacheKeys);
    logger.info('🔍 Object.keys(cacheKeys):', Object.keys(cacheKeys));

    // Create cache key manually for now
    const cacheKey = `footy:matches:today:${date || 'current'}`;
    const strategy = getCacheStrategy('TODAY_MATCHES');
    
    try {
      // 1. Check cache first
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        logger.debug(`🎯 Cache HIT: Today's matches ${date || 'current'}`);
        return cached;
      }

      // 2. Cache miss - fetch from service
      logger.debug(`📡 Cache MISS: Fetching today's matches from service`);
      const result = await this.matchAnalysisService.getBasicMatchInfo(date);

      // 3. Store in cache
      await this.cacheService.set(cacheKey, result, {
        ttl: strategy.ttl,
        tags: [...strategy.tags, ...(date ? [`date-${date}`] : [])],
        compress: strategy.compress
      });

      logger.info(`💾 Cached today's matches with TTL ${strategy.ttl}s`);
      return result;

    } catch (error) {
      logger.error(`❌ Error getting today's matches:`, error);
      // Fallback to service without cache
      return this.matchAnalysisService.getBasicMatchInfo(date);
    }
  }

  /**
   * 🎯 Get match details with intelligent caching based on status
   */
  async getMatchById(matchId: number): Promise<DetailedMatchInfo> {
    // Create cache key manually to avoid import issues
    const cacheKey = `footy:match:${matchId}:details`;

    try {
      // 1. Check cache first
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        logger.debug(`🎯 Cache HIT: Match details ${matchId}`);
        return cached;
      }

      // 2. Cache miss - fetch from service
      logger.debug(`📡 Cache MISS: Fetching match details ${matchId} from service`);
      const result = await this.matchAnalysisService.getDetailedMatchInfo(matchId);

      // 3. Defensive data handling - ensure H2H data is always an array
      if (result.success && result.data) {
        // Ensure H2H data is always an array to prevent frontend crashes
        if (result.data.h2hMatches && !Array.isArray(result.data.h2hMatches)) {
          logger.warn(`⚠️ H2H data for match ${matchId} is not an array, converting to empty array`);
          result.data.h2hMatches = [];
        } else if (!result.data.h2hMatches) {
          logger.info(`ℹ️ No H2H data for match ${matchId}, setting to empty array`);
          result.data.h2hMatches = [];
        }

        // Ensure other critical arrays are properly initialized
        if (result.data.teamStats && !Array.isArray(result.data.teamStats)) {
          result.data.teamStats = [];
        }
        if (result.data.recentMatches && !Array.isArray(result.data.recentMatches)) {
          result.data.recentMatches = [];
        }
      }

      // 4. Determine TTL based on match status (if available)
      let ttl = getCacheStrategy('MATCH_DETAILS_UPCOMING').ttl; // Default
      if (result.success && result.data?.matchDetails?.status) {
        ttl = getMatchTTL(result.data.matchDetails.status);
      }

      // 5. Store in cache
      await this.cacheService.set(cacheKey, result, {
        ttl,
        tags: ['match-details', `match-${matchId}`],
        compress: true
      });

      logger.info(`💾 Cached match details ${matchId} with TTL ${ttl}s`);
      return result;

    } catch (error) {
      logger.error(`❌ Error getting match details ${matchId}:`, error);

      // Defensive fallback - return a safe structure even on error
      try {
        const fallbackResult = await this.matchAnalysisService.getDetailedMatchInfo(matchId);

        // Ensure safe structure even in fallback
        if (fallbackResult.success && fallbackResult.data) {
          if (!Array.isArray(fallbackResult.data.h2hMatches)) {
            fallbackResult.data.h2hMatches = [];
          }
          if (!Array.isArray(fallbackResult.data.teamStats)) {
            fallbackResult.data.teamStats = [];
          }
          if (!Array.isArray(fallbackResult.data.recentMatches)) {
            fallbackResult.data.recentMatches = [];
          }
        }

        return fallbackResult;
      } catch (fallbackError) {
        logger.error(`❌ Fallback also failed for match ${matchId}:`, fallbackError);

        // Return safe error structure
        return {
          success: false,
          message: `Failed to fetch match details for ${matchId}`,
          data: {
            matchDetails: null,
            h2hMatches: [],
            teamStats: [],
            recentMatches: []
          }
        };
      }
    }
  }

  /**
   * 🎯 Get match analysis with caching
   */
  async getMatchAnalysis(options: MatchAnalysisOptions): Promise<MatchAnalysisResult> {
    // Create cache key manually to avoid import issues
    const cacheKey = `footy:match:${options.matchId}:analysis`;
    const strategy = getCacheStrategy('MATCH_ANALYSIS');

    try {
      // 1. Check cache first
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        logger.debug(`🎯 Cache HIT: Match analysis ${options.matchId}`);
        return cached;
      }

      // 2. Cache miss - fetch from service
      logger.debug(`📡 Cache MISS: Fetching match analysis ${options.matchId} from service`);
      const result = await this.matchAnalysisService.getMatchAnalysis(options);

      // 3. Defensive data handling - ensure all arrays are properly initialized
      if (result.success && result.data) {
        // Ensure H2H matches is always an array
        if (!Array.isArray(result.data.h2hMatches)) {
          logger.warn(`⚠️ H2H matches for analysis ${options.matchId} is not an array, setting to empty array`);
          result.data.h2hMatches = [];
        }

        // Ensure team stats are arrays
        if (result.data.homeTeamStats && !Array.isArray(result.data.homeTeamStats.recentMatches)) {
          result.data.homeTeamStats.recentMatches = [];
        }
        if (result.data.awayTeamStats && !Array.isArray(result.data.awayTeamStats.recentMatches)) {
          result.data.awayTeamStats.recentMatches = [];
        }

        // Ensure predictions array
        if (result.data.predictions && !Array.isArray(result.data.predictions)) {
          result.data.predictions = [];
        }
      }

      // 4. Store in cache
      await this.cacheService.set(cacheKey, result, {
        ttl: strategy.ttl,
        tags: [...strategy.tags, `match-${options.matchId}`],
        compress: strategy.compress
      });

      logger.info(`💾 Cached match analysis ${options.matchId} with TTL ${strategy.ttl}s`);
      return result;

    } catch (error) {
      logger.error(`❌ Error getting match analysis ${options.matchId}:`, error);

      // Defensive fallback
      try {
        const fallbackResult = await this.matchAnalysisService.getMatchAnalysis(options);

        // Ensure safe structure in fallback
        if (fallbackResult.success && fallbackResult.data) {
          if (!Array.isArray(fallbackResult.data.h2hMatches)) {
            fallbackResult.data.h2hMatches = [];
          }
        }

        return fallbackResult;
      } catch (fallbackError) {
        logger.error(`❌ Fallback failed for match analysis ${options.matchId}:`, fallbackError);

        // Return safe error structure
        return {
          success: false,
          message: `Failed to fetch match analysis for ${options.matchId}`,
          data: {
            matchDetails: null,
            h2hMatches: [],
            homeTeamStats: { recentMatches: [] },
            awayTeamStats: { recentMatches: [] },
            predictions: []
          }
        };
      }
    }
  }

  /**
   * 🎯 Get live matches with short-term caching
   */
  async getLiveMatches(limit?: number): Promise<any[]> {
    // Create cache key manually to avoid import issues
    const cacheKey = `footy:matches:live${limit ? `:limit:${limit}` : ''}`;
    const strategy = getCacheStrategy('LIVE_MATCHES');
    
    try {
      // 1. Check cache first
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        logger.debug(`🎯 Cache HIT: Live matches ${limit ? `(limit: ${limit})` : '(all)'}`);
        return cached;
      }

      // 2. Cache miss - fetch from service
      logger.debug(`📡 Cache MISS: Fetching live matches from service`);
      const result = await this.matchAnalysisService.getLiveMatches(limit);

      // 3. Store in cache with short TTL for live data
      await this.cacheService.set(cacheKey, result, {
        ttl: strategy.ttl,
        tags: strategy.tags,
        compress: strategy.compress
      });

      logger.info(`💾 Cached live matches with TTL ${strategy.ttl}s`);
      return result;

    } catch (error) {
      logger.error(`❌ Error getting live matches:`, error);
      // Fallback to service without cache
      return this.matchAnalysisService.getLiveMatches(limit);
    }
  }

  /**
   * 🎯 Get upcoming matches with caching
   */
  async getUpcomingMatches(limit?: number, hours: number = 48): Promise<any[]> {
    // Create cache key manually to avoid import issues
    const cacheKey = `footy:matches:upcoming${limit ? `:limit:${limit}` : ''}:${hours || 48}h`;
    const strategy = getCacheStrategy('UPCOMING_MATCHES');
    
    try {
      // 1. Check cache first
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        logger.debug(`🎯 Cache HIT: Upcoming matches ${limit ? `(limit: ${limit})` : '(all)'}`);
        return cached;
      }

      // 2. Cache miss - fetch from service
      logger.debug(`📡 Cache MISS: Fetching upcoming matches from service`);
      const result = await this.matchAnalysisService.getUpcomingMatches(limit, hours);

      // 3. Store in cache
      await this.cacheService.set(cacheKey, result, {
        ttl: strategy.ttl,
        tags: [...strategy.tags, `hours-${hours}`],
        compress: strategy.compress
      });

      logger.info(`💾 Cached upcoming matches with TTL ${strategy.ttl}s`);
      return result;

    } catch (error) {
      logger.error(`❌ Error getting upcoming matches:`, error);
      // Fallback to service without cache
      return this.matchAnalysisService.getUpcomingMatches(limit, hours);
    }
  }

  /**
   * 🎯 Get total match count with caching
   */
  async getTotalMatchCount(date?: string): Promise<{ totalMatches: number; success: boolean }> {
    // Create cache key manually to avoid import issues
    const cacheKey = `footy:matches:total-count:${date || 'current'}`;
    const strategy = getCacheStrategy('TODAY_MATCHES');
    
    try {
      // 1. Check cache first
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        logger.debug(`🎯 Cache HIT: Total match count ${date || 'current'}`);
        return cached;
      }

      // 2. Cache miss - fetch from service
      logger.debug(`📡 Cache MISS: Fetching total match count from service`);
      const result = await this.matchAnalysisService.getTotalMatchCount(date);

      // 3. Store in cache
      await this.cacheService.set(cacheKey, result, {
        ttl: strategy.ttl,
        tags: [...strategy.tags, ...(date ? [`date-${date}`] : [])],
        compress: false // Small data, no need to compress
      });

      logger.info(`💾 Cached total match count with TTL ${strategy.ttl}s`);
      return result;

    } catch (error) {
      logger.error(`❌ Error getting total match count:`, error);
      // Fallback to service without cache
      return this.matchAnalysisService.getTotalMatchCount(date);
    }
  }

  /**
   * 🎯 Debug method with caching
   */
  async debugTodaysMatches(): Promise<any> {
    const cacheKey = 'debug:todays-matches';
    
    try {
      // Short cache for debug data (5 minutes)
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        logger.debug(`🎯 Cache HIT: Debug today's matches`);
        return cached;
      }

      const result = await this.matchAnalysisService.debugTodaysMatches();

      await this.cacheService.set(cacheKey, result, {
        ttl: 300, // 5 minutes for debug data
        tags: ['debug', 'today'],
        compress: false
      });

      return result;

    } catch (error) {
      logger.error(`❌ Error in debug method:`, error);
      return this.matchAnalysisService.debugTodaysMatches();
    }
  }

  /**
   * 🧹 Cache management methods
   */
  async invalidateMatch(matchId: number): Promise<void> {
    await this.cacheService.invalidateMatch(matchId);
  }

  async invalidateByTags(tags: string[]): Promise<void> {
    await this.cacheService.invalidateByTags(tags);
  }

  async warmCache(): Promise<void> {
    logger.info('🔥 Starting cache warming...');
    
    try {
      // Warm with today's matches
      await this.getTodaysMatches();
      
      // Warm with live matches
      await this.getLiveMatches(6); // Dashboard limit
      
      // Warm with upcoming matches
      await this.getUpcomingMatches(6); // Dashboard limit
      
      logger.info('✅ Cache warming completed');
    } catch (error) {
      logger.error('❌ Cache warming failed:', error);
    }
  }

  /**
   * 📊 Get cache metrics
   */
  getMetrics() {
    return this.cacheService.getMetrics();
  }

  /**
   * 🏥 Health check
   */
  async healthCheck() {
    return this.cacheService.healthCheck();
  }

  /**
   * 🧹 Shutdown
   */
  async shutdown(): Promise<void> {
    await this.cacheService.shutdown();
  }
}
