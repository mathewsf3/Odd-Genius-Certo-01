/**
 * 🎯 Caching Strategy - Client-Side Cache Management
 * 
 * Implements intelligent caching for API responses
 * Optimizes performance for football analytics data
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  key: string;
}

interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  cleanupInterval: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private config: CacheConfig;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 100, // Maximum number of cache entries
      defaultTTL: 5 * 60 * 1000, // 5 minutes default TTL
      cleanupInterval: 60 * 1000, // Cleanup every minute
      ...config,
    };

    this.startCleanupTimer();
  }

  /**
   * Set cache entry with custom TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      key,
    };

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, entry);
    
    console.log(`📦 Cache SET: ${key} (TTL: ${entry.ttl}ms)`);
  }

  /**
   * Get cache entry if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      console.log(`📦 Cache MISS: ${key}`);
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      console.log(`📦 Cache EXPIRED: ${key}`);
      return null;
    }

    console.log(`📦 Cache HIT: ${key}`);
    return entry.data;
  }

  /**
   * Check if cache has valid entry
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete cache entry
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      console.log(`📦 Cache DELETE: ${key}`);
    }
    return deleted;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    console.log('📦 Cache CLEARED');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.values());
    
    const stats = {
      totalEntries: entries.length,
      validEntries: entries.filter(e => now - e.timestamp <= e.ttl).length,
      expiredEntries: entries.filter(e => now - e.timestamp > e.ttl).length,
      oldestEntry: entries.reduce((oldest, current) => 
        current.timestamp < oldest.timestamp ? current : oldest, 
        entries[0]
      )?.timestamp,
      newestEntry: entries.reduce((newest, current) => 
        current.timestamp > newest.timestamp ? current : newest, 
        entries[0]
      )?.timestamp,
      memoryUsage: this.estimateMemoryUsage(),
    };

    return stats;
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(`📦 Cache CLEANUP: Removed ${removedCount} expired entries`);
    }

    return removedCount;
  }

  private evictOldest(): void {
    let oldestKey = '';
    let oldestTimestamp = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      console.log(`📦 Cache EVICTED: ${oldestKey} (oldest entry)`);
    }
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  private estimateMemoryUsage(): number {
    // Rough estimation of memory usage in bytes
    let size = 0;
    for (const entry of this.cache.values()) {
      size += JSON.stringify(entry).length * 2; // Rough estimate
    }
    return size;
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

// Create cache instances for different data types
export const dashboardCache = new CacheManager({
  maxSize: 50,
  defaultTTL: 30 * 1000, // 30 seconds for dashboard data
});

export const liveMatchesCache = new CacheManager({
  maxSize: 20,
  defaultTTL: 15 * 1000, // 15 seconds for live matches
});

export const upcomingMatchesCache = new CacheManager({
  maxSize: 30,
  defaultTTL: 5 * 60 * 1000, // 5 minutes for upcoming matches
});

export const matchAnalysisCache = new CacheManager({
  maxSize: 100,
  defaultTTL: 10 * 60 * 1000, // 10 minutes for match analysis
});

/**
 * Cache key generators
 */
export const CacheKeys = {
  dashboard: (timezone: string, limit?: number) => 
    `dashboard:${timezone}:${limit || 'all'}`,
  
  liveMatches: (limit?: number, forceRefresh?: boolean) => 
    `live:${limit || 'all'}:${forceRefresh ? 'force' : 'normal'}`,
  
  upcomingMatches: (limit?: number, hours?: number, timezone?: string) => 
    `upcoming:${limit || 'all'}:${hours || 48}:${timezone || 'UTC'}`,
  
  matchDetails: (matchId: number) => 
    `match:${matchId}`,
  
  matchAnalysis: (matchId: number, includeH2H?: boolean, includePredictions?: boolean) => 
    `analysis:${matchId}:${includeH2H ? 'h2h' : 'no-h2h'}:${includePredictions ? 'pred' : 'no-pred'}`,
};

/**
 * Cached API wrapper
 */
export async function withCache<T>(
  cacheManager: CacheManager,
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Try to get from cache first
  const cached = cacheManager.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  try {
    const data = await fetcher();
    cacheManager.set(key, data, ttl);
    return data;
  } catch (error) {
    console.error(`Failed to fetch data for cache key: ${key}`, error);
    throw error;
  }
}

/**
 * Cache invalidation utilities
 */
export const CacheInvalidation = {
  invalidateDashboard: () => {
    dashboardCache.clear();
    liveMatchesCache.clear();
    upcomingMatchesCache.clear();
  },
  
  invalidateMatch: (matchId: number) => {
    matchAnalysisCache.delete(CacheKeys.matchDetails(matchId));
    matchAnalysisCache.delete(CacheKeys.matchAnalysis(matchId, true, true));
    matchAnalysisCache.delete(CacheKeys.matchAnalysis(matchId, false, false));
  },
  
  invalidateAll: () => {
    dashboardCache.clear();
    liveMatchesCache.clear();
    upcomingMatchesCache.clear();
    matchAnalysisCache.clear();
  },
};

// Global cache statistics
export function getCacheStatistics() {
  return {
    dashboard: dashboardCache.getStats(),
    liveMatches: liveMatchesCache.getStats(),
    upcomingMatches: upcomingMatchesCache.getStats(),
    matchAnalysis: matchAnalysisCache.getStats(),
  };
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    dashboardCache.destroy();
    liveMatchesCache.destroy();
    upcomingMatchesCache.destroy();
    matchAnalysisCache.destroy();
  });

  // Expose cache utilities for debugging
  (window as any).cacheUtils = {
    stats: getCacheStatistics,
    invalidate: CacheInvalidation,
    clear: () => CacheInvalidation.invalidateAll(),
  };
}
