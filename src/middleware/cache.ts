/**
 * 🗄️ Cache Middleware
 * 
 * Simple in-memory cache middleware for Express.js
 * Based on Express.js middleware patterns from Context7 documentation
 * 
 * Features:
 * - In-memory caching with TTL support
 * - Configurable cache duration
 * - Automatic cache key generation
 * - Memory-efficient with cleanup
 */

import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

// In-memory cache storage
const cache = new Map<string, CacheEntry>();

// Cache cleanup interval (run every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;

// Cleanup expired entries periodically
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  cache.forEach((entry, key) => {
    if (now - entry.timestamp > entry.ttl * 1000) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => cache.delete(key));
  
  if (keysToDelete.length > 0) {
    logger.info(`Cache cleanup: Removed ${keysToDelete.length} expired entries`);
  }
}, CLEANUP_INTERVAL);

/**
 * Cache middleware factory
 * @param ttl Time to live in seconds (default: 300 = 5 minutes)
 * @returns Express middleware function
 */
export const cacheMiddleware = (ttl: number = 300) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key from method and URL
    const key = `${req.method}:${req.originalUrl}`;
    const cached = cache.get(key);

    // Check if cached data exists and is still valid
    if (cached && Date.now() - cached.timestamp < cached.ttl * 1000) {
      logger.info(`Cache hit for ${key}`);
      return res.json(cached.data);
    }

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data: any) {
      // Cache successful responses only
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, {
          data,
          timestamp: Date.now(),
          ttl
        });
        logger.info(`Cached response for ${key} (TTL: ${ttl}s)`);
      }
      
      return originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Cache statistics for monitoring
 */
export const getCacheStats = () => {
  const now = Date.now();
  let validEntries = 0;
  let expiredEntries = 0;

  cache.forEach((entry) => {
    if (now - entry.timestamp < entry.ttl * 1000) {
      validEntries++;
    } else {
      expiredEntries++;
    }
  });

  return {
    totalEntries: cache.size,
    validEntries,
    expiredEntries,
    memoryUsage: process.memoryUsage()
  };
};

/**
 * Clear all cache entries
 */
export const clearCache = () => {
  const size = cache.size;
  cache.clear();
  logger.info(`Cleared ${size} cache entries`);
  return size;
};
