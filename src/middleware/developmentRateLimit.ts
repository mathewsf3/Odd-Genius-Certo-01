/**
 * 🛠️ DEVELOPMENT RATE LIMITING MIDDLEWARE
 * 
 * Aggressive caching and request management for development
 * to prevent FootyStats API rate limiting
 */

import { Request, Response, NextFunction } from 'express';
import { CacheManagerSingleton } from '../cache/CacheManagerSingleton';

const isDevelopment = process.env.NODE_ENV === 'development';
const cache = CacheManagerSingleton.getInstance();

// Track pending requests to prevent duplicates
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Development-friendly caching middleware
 * Uses much longer cache times in development
 */
export const developmentCacheMiddleware = (baseTtl: number = 600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!isDevelopment) {
      return next(); // Skip in production
    }

    const cacheKey = `dev-cache:${req.method}:${req.originalUrl}`;
    const developmentTtl = baseTtl * 10; // 10x longer cache in development

    try {
      // Check for cached response
      const cachedResponse = await cache.get<{
        statusCode: number;
        data: any;
        headers: Record<string, string>;
        timestamp: number;
      }>(cacheKey);

      if (cachedResponse) {
        const age = Math.floor((Date.now() - cachedResponse.timestamp) / 1000);
        console.log(`🔄 DEV CACHE HIT: ${req.originalUrl} (age: ${age}s)`);
        
        // Set cache headers
        res.set('X-Cache', 'HIT');
        res.set('X-Cache-Age', age.toString());
        res.set(cachedResponse.headers);
        
        return res.status(cachedResponse.statusCode).json(cachedResponse.data);
      }

      // Intercept response to cache it
      const originalJson = res.json;
      const originalStatus = res.status;
      let statusCode = 200;

      res.status = function(code: number) {
        statusCode = code;
        return originalStatus.call(this, code);
      };

      res.json = function(data: any) {
        // Only cache successful responses
        if (statusCode >= 200 && statusCode < 300) {
          const responseToCache = {
            statusCode,
            data,
            headers: {
              'Content-Type': 'application/json',
              'X-Cache': 'MISS',
              'X-Cache-TTL': developmentTtl.toString()
            },
            timestamp: Date.now()
          };

          cache.set(cacheKey, responseToCache, {
            ttl: developmentTtl,
            tags: ['dev-cache', 'api-response']
          }).catch(err => {
            console.warn('⚠️ Failed to cache response:', err);
          });

          console.log(`💾 DEV CACHE STORED: ${req.originalUrl} (TTL: ${developmentTtl}s)`);
        }

        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.warn('⚠️ Development cache middleware error:', error);
      next();
    }
  };
};

/**
 * Request deduplication middleware
 * Prevents multiple simultaneous requests for the same endpoint
 */
export const requestDeduplicationMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const requestKey = `${req.method}:${req.originalUrl}`;

    // Check if request is already pending
    if (pendingRequests.has(requestKey)) {
      console.log(`🔄 DEDUPLICATING REQUEST: ${requestKey}`);
      
      try {
        const result = await pendingRequests.get(requestKey);
        return res.json(result);
      } catch (error) {
        console.error(`❌ Deduplicated request failed: ${requestKey}`, error);
        return res.status(500).json({
          success: false,
          error: 'Deduplicated request failed'
        });
      }
    }

    // Create promise for this request
    const requestPromise = new Promise((resolve, reject) => {
      const originalJson = res.json;
      const originalStatus = res.status;
      let statusCode = 200;
      let responseData: any;

      res.status = function(code: number) {
        statusCode = code;
        return originalStatus.call(this, code);
      };

      res.json = function(data: any) {
        responseData = data;
        
        // Clean up pending request
        pendingRequests.delete(requestKey);
        
        if (statusCode >= 200 && statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`Request failed with status ${statusCode}`));
        }
        
        return originalJson.call(this, data);
      };

      // Set timeout for cleanup
      setTimeout(() => {
        if (pendingRequests.has(requestKey)) {
          pendingRequests.delete(requestKey);
          reject(new Error('Request timeout'));
        }
      }, 30000); // 30 second timeout
    });

    pendingRequests.set(requestKey, requestPromise);
    next();
  };
};

/**
 * Combined development middleware
 * Applies both caching and deduplication
 */
export const developmentRateLimit = (cacheTtl: number = 600) => {
  if (!isDevelopment) {
    return (req: Request, res: Response, next: NextFunction) => next();
  }

  return [
    requestDeduplicationMiddleware(),
    developmentCacheMiddleware(cacheTtl)
  ];
};

/**
 * Clear development cache
 */
export const clearDevelopmentCache = async (): Promise<void> => {
  if (isDevelopment) {
    await cache.clearByTags(['dev-cache']);
    pendingRequests.clear();
    console.log('🧹 Cleared development cache and pending requests');
  }
};

/**
 * Get development cache stats
 */
export const getDevelopmentCacheStats = () => {
  return {
    isDevelopment,
    pendingRequests: pendingRequests.size,
    cacheStats: cache.getStats()
  };
};
