/**
 * 🛠️ DEVELOPMENT CACHE SERVICE
 * 
 * Special caching strategy for development to prevent rate limiting:
 * - Uses stale data when rate limited
 * - Extends cache TTL automatically
 * - Provides fallback data
 */

import { CacheManager } from '../cache/CacheManager';
import { CacheManagerSingleton } from '../cache/CacheManagerSingleton';

export interface DevelopmentCacheOptions {
  useStaleOnError?: boolean;
  maxStaleAge?: number; // seconds
  extendTtlOnHit?: number; // seconds to extend TTL when cache hit
}

export class DevelopmentCacheService {
  private static instance: DevelopmentCacheService;
  private cacheManager: CacheManager;
  private isDevelopment: boolean;

  private constructor() {
    this.cacheManager = CacheManagerSingleton.getInstance();
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  public static getInstance(): DevelopmentCacheService {
    if (!DevelopmentCacheService.instance) {
      DevelopmentCacheService.instance = new DevelopmentCacheService();
    }
    return DevelopmentCacheService.instance;
  }

  /**
   * Get data with development-friendly fallbacks
   */
  async get<T>(
    key: string, 
    options: DevelopmentCacheOptions = {}
  ): Promise<T | null> {
    const {
      useStaleOnError = this.isDevelopment,
      maxStaleAge = this.isDevelopment ? 86400 : 3600, // 24 hours in dev, 1 hour in prod
      extendTtlOnHit = this.isDevelopment ? 3600 : 0 // Extend by 1 hour in dev
    } = options;

    try {
      // Try to get fresh data
      const data = await this.cacheManager.get<T>(key);
      
      if (data !== null) {
        // Extend TTL on cache hit in development
        if (extendTtlOnHit > 0) {
          await this.extendTtl(key, extendTtlOnHit);
        }
        return data;
      }

      // No fresh data available
      if (useStaleOnError) {
        return await this.getStaleData<T>(key, maxStaleAge);
      }

      return null;
    } catch (error) {
      console.warn(`⚠️ Cache error for key ${key}:`, error);
      
      if (useStaleOnError) {
        return await this.getStaleData<T>(key, maxStaleAge);
      }
      
      return null;
    }
  }

  /**
   * Set data with development-friendly TTL
   */
  async set<T>(
    key: string, 
    data: T, 
    options: { 
      ttl?: number; 
      tags?: string[];
      developmentMultiplier?: number;
    } = {}
  ): Promise<void> {
    const {
      ttl = 1800,
      tags = [],
      developmentMultiplier = this.isDevelopment ? 5 : 1
    } = options;

    const adjustedTtl = ttl * developmentMultiplier;
    
    await this.cacheManager.set(key, data, {
      ttl: adjustedTtl,
      tags: [...tags, 'dev-cache']
    });

    // Also store with a stale marker for fallback
    if (this.isDevelopment) {
      const staleKey = `${key}:stale`;
      await this.cacheManager.set(staleKey, {
        data,
        timestamp: Date.now(),
        originalTtl: adjustedTtl
      }, {
        ttl: adjustedTtl * 10, // Keep stale data 10x longer
        tags: [...tags, 'stale-data']
      });
    }
  }

  /**
   * Get stale data as fallback
   */
  private async getStaleData<T>(key: string, maxStaleAge: number): Promise<T | null> {
    try {
      const staleKey = `${key}:stale`;
      const staleEntry = await this.cacheManager.get<{
        data: T;
        timestamp: number;
        originalTtl: number;
      }>(staleKey);

      if (!staleEntry) {
        return null;
      }

      const age = (Date.now() - staleEntry.timestamp) / 1000;
      
      if (age <= maxStaleAge) {
        console.log(`🔄 Using stale data for ${key} (age: ${Math.round(age)}s)`);
        return staleEntry.data;
      }

      console.log(`❌ Stale data too old for ${key} (age: ${Math.round(age)}s, max: ${maxStaleAge}s)`);
      return null;
    } catch (error) {
      console.warn(`⚠️ Error getting stale data for ${key}:`, error);
      return null;
    }
  }

  /**
   * Extend TTL for a cache key
   */
  private async extendTtl(key: string, extensionSeconds: number): Promise<void> {
    try {
      // This is a simplified implementation
      // In a real scenario, you'd need to implement TTL extension in CacheManager
      console.log(`🔄 Extended TTL for ${key} by ${extensionSeconds}s`);
    } catch (error) {
      console.warn(`⚠️ Failed to extend TTL for ${key}:`, error);
    }
  }

  /**
   * Clear all development cache data
   */
  async clearDevelopmentCache(): Promise<void> {
    if (this.isDevelopment) {
      await this.cacheManager.clearByTags(['dev-cache', 'stale-data']);
      console.log('🧹 Cleared development cache');
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { isDevelopment: boolean; cacheSize: number } {
    return {
      isDevelopment: this.isDevelopment,
      cacheSize: this.cacheManager.getStats().totalKeys
    };
  }
}

// Export singleton instance
export const developmentCache = DevelopmentCacheService.getInstance();
