/**
 * Cache Manager - Redis/Memory caching system
 * Based on patterns from MatchAnalysisService and football constants
 */

import { CACHE_TTL } from '../utils/constants/footballConstants'; // Import CACHE_TTL from footballConstants
// Simple console logger for cache operations
const logger = {
  info: (message: string, meta?: any) => console.log(`[INFO] ${message}`, meta || ''),
  debug: (message: string, meta?: any) => console.log(`[DEBUG] ${message}`, meta || ''),
  error: (message: string, meta?: any) => console.error(`[ERROR] ${message}`, meta || ''),
  warn: (message: string, meta?: any) => console.warn(`[WARN] ${message}`, meta || '')
};

export interface CacheOptions {
  ttl?: number;
  tags?: string[];
  compress?: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalKeys: number;
  memoryUsage: number;
}

export interface CacheEntry<T = any> {
  data: T | string; // Allow string for compressed data
  timestamp: number;
  ttl: number;
  tags?: string[];
  compressed?: boolean;
}

export class CacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalKeys: 0,
    memoryUsage: 0
  };
  private cleanupInterval?: NodeJS.Timeout;

  constructor(
    private readonly config: {
      defaultTtl: number;
      maxMemoryUsage: number;
      cleanupIntervalMs: number;
    } = {
      defaultTtl: CACHE_TTL.DEFAULT,
      maxMemoryUsage: 100 * 1024 * 1024, // 100MB
      cleanupIntervalMs: 60000 // 1 minute
    }
  ) {
    this.startCleanupInterval();
    logger.info('CacheManager initialized', {
      defaultTtl: this.config.defaultTtl,
      maxMemoryUsage: this.config.maxMemoryUsage,
      cleanupInterval: this.config.cleanupIntervalMs
    });
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      logger.debug('Cache miss', { key });
      return null;
    }

    // Check if entry has expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      logger.debug('Cache expired', { key, age: Date.now() - entry.timestamp });
      return null;
    }

    this.stats.hits++;
    this.updateHitRate();
    logger.debug('Cache hit', { key, age: Date.now() - entry.timestamp });
    
    return entry.compressed ? this.decompress(entry.data as string) : entry.data;
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const ttl = options.ttl || this.config.defaultTtl;
    const shouldCompress = options.compress || this.shouldCompress(value);
    
    const entry: CacheEntry<T> = {
      data: shouldCompress ? this.compress(value) : value,
      timestamp: Date.now(),
      ttl: ttl * 1000, // Convert to milliseconds
      tags: options.tags,
      compressed: shouldCompress
    };

    // Check memory usage before adding
    if (this.getMemoryUsage() > this.config.maxMemoryUsage) {
      await this.evictLeastRecentlyUsed();
    }

    this.cache.set(key, entry);
    this.updateStats();
    
    logger.debug('Cache set', { 
      key, 
      ttl, 
      compressed: shouldCompress,
      size: this.getEntrySize(entry)
    });
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<boolean> {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.updateStats();
      logger.debug('Cache delete', { key });
    }
    return deleted;
  }

  /**
   * Clear cache by tags
   */
  async clearByTags(tags: string[]): Promise<number> {
    let cleared = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags && entry.tags.some(tag => tags.includes(tag))) {
        this.cache.delete(key);
        cleared++;
      }
    }
    
    if (cleared > 0) {
      this.updateStats();
      logger.info('Cache cleared by tags', { tags, cleared });
    }
    
    return cleared;
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    const size = this.cache.size;
    this.cache.clear();
    this.updateStats();
    logger.info('Cache cleared', { clearedEntries: size });
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get cache keys matching pattern
   */
  getKeys(pattern?: string): string[] {
    const keys = Array.from(this.cache.keys());
    
    if (!pattern) {
      return keys;
    }
    
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return keys.filter(key => regex.test(key));
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry ? !this.isExpired(entry) : false;
  }

  /**
   * Get or set pattern - get from cache or execute function and cache result
   */
  async getOrSet<T>(
    key: string, 
    fn: () => Promise<T>, 
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = await this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }
    
    logger.debug('Cache miss, executing function', { key });
    const startTime = Date.now();
    
    try {
      const result = await fn();
      await this.set(key, result, options);
      
      logger.debug('Function executed and cached', { 
        key, 
        executionTime: Date.now() - startTime 
      });
      
      return result;
    } catch (error) {
      logger.error('Function execution failed', { key, error });
      throw error;
    }
  }

  /**
   * Shutdown cache manager
   */
  shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
    logger.info('CacheManager shutdown');
  }

  // Private methods
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private shouldCompress(value: any): boolean {
    const size = JSON.stringify(value).length;
    return size > 1024; // Compress if larger than 1KB
  }

  private compress(value: any): string {
    // Simple compression - in production, use a proper compression library
    return JSON.stringify(value);
  }

  private decompress(data: string): any {
    return JSON.parse(data);
  }

  private getEntrySize(entry: CacheEntry): number {
    return JSON.stringify(entry).length;
  }

  private getMemoryUsage(): number {
    let total = 0;
    for (const entry of this.cache.values()) {
      total += this.getEntrySize(entry);
    }
    return total;
  }

  private updateStats(): void {
    this.stats.totalKeys = this.cache.size;
    this.stats.memoryUsage = this.getMemoryUsage();
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  private async evictLeastRecentlyUsed(): Promise<void> {
    let oldestKey: string | null = null;
    let oldestTimestamp = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      logger.debug('Evicted LRU entry', { key: oldestKey });
    }
  }

  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupIntervalMs);
  }

  private cleanup(): void {
    const before = this.cache.size;
    let expired = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        expired++;
      }
    }
    
    if (expired > 0) {
      this.updateStats();
      logger.debug('Cache cleanup completed', { 
        before, 
        after: this.cache.size, 
        expired 
      });
    }
  }
}

// Singleton instance
export const cacheManager = new CacheManager();
