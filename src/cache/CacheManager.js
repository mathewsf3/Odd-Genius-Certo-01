"use strict";
/**
 * Cache Manager - Redis/Memory caching system
 * Based on patterns from MatchAnalysisService and football constants
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheManager = exports.CacheManager = void 0;
const footballConstants_1 = require("../utils/constants/footballConstants"); // Import CACHE_TTL from footballConstants
// Simple console logger for cache operations
const logger = {
    info: (message, meta) => console.log(`[INFO] ${message}`, meta || ''),
    debug: (message, meta) => console.log(`[DEBUG] ${message}`, meta || ''),
    error: (message, meta) => console.error(`[ERROR] ${message}`, meta || ''),
    warn: (message, meta) => console.warn(`[WARN] ${message}`, meta || '')
};
class CacheManager {
    constructor(config = {
        defaultTtl: footballConstants_1.CACHE_TTL.DEFAULT,
        maxMemoryUsage: 100 * 1024 * 1024, // 100MB
        cleanupIntervalMs: 60000 // 1 minute
    }) {
        this.config = config;
        this.cache = new Map();
        this.stats = {
            hits: 0,
            misses: 0,
            hitRate: 0,
            totalKeys: 0,
            memoryUsage: 0
        };
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
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
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
            return entry.compressed ? this.decompress(entry.data) : entry.data;
        });
    }
    /**
     * Set value in cache
     */
    set(key_1, value_1) {
        return __awaiter(this, arguments, void 0, function* (key, value, options = {}) {
            const ttl = options.ttl || this.config.defaultTtl;
            const shouldCompress = options.compress || this.shouldCompress(value);
            const entry = {
                data: shouldCompress ? this.compress(value) : value,
                timestamp: Date.now(),
                ttl: ttl * 1000, // Convert to milliseconds
                tags: options.tags,
                compressed: shouldCompress
            };
            // Check memory usage before adding
            if (this.getMemoryUsage() > this.config.maxMemoryUsage) {
                yield this.evictLeastRecentlyUsed();
            }
            this.cache.set(key, entry);
            this.updateStats();
            logger.debug('Cache set', {
                key,
                ttl,
                compressed: shouldCompress,
                size: this.getEntrySize(entry)
            });
        });
    }
    /**
     * Delete value from cache
     */
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = this.cache.delete(key);
            if (deleted) {
                this.updateStats();
                logger.debug('Cache delete', { key });
            }
            return deleted;
        });
    }
    /**
     * Clear cache by tags
     */
    clearByTags(tags) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    /**
     * Clear all cache
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            const size = this.cache.size;
            this.cache.clear();
            this.updateStats();
            logger.info('Cache cleared', { clearedEntries: size });
        });
    }
    /**
     * Get cache statistics
     */
    getStats() {
        return Object.assign({}, this.stats);
    }
    /**
     * Get cache keys matching pattern
     */
    getKeys(pattern) {
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
    has(key) {
        const entry = this.cache.get(key);
        return entry ? !this.isExpired(entry) : false;
    }
    /**
     * Get or set pattern - get from cache or execute function and cache result
     */
    getOrSet(key_1, fn_1) {
        return __awaiter(this, arguments, void 0, function* (key, fn, options = {}) {
            const cached = yield this.get(key);
            if (cached !== null) {
                return cached;
            }
            logger.debug('Cache miss, executing function', { key });
            const startTime = Date.now();
            try {
                const result = yield fn();
                yield this.set(key, result, options);
                logger.debug('Function executed and cached', {
                    key,
                    executionTime: Date.now() - startTime
                });
                return result;
            }
            catch (error) {
                logger.error('Function execution failed', { key, error });
                throw error;
            }
        });
    }
    /**
     * Shutdown cache manager
     */
    shutdown() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.cache.clear();
        logger.info('CacheManager shutdown');
    }
    // Private methods
    isExpired(entry) {
        return Date.now() - entry.timestamp > entry.ttl;
    }
    shouldCompress(value) {
        const size = JSON.stringify(value).length;
        return size > 1024; // Compress if larger than 1KB
    }
    compress(value) {
        // Simple compression - in production, use a proper compression library
        return JSON.stringify(value);
    }
    decompress(data) {
        return JSON.parse(data);
    }
    getEntrySize(entry) {
        return JSON.stringify(entry).length;
    }
    getMemoryUsage() {
        let total = 0;
        for (const entry of this.cache.values()) {
            total += this.getEntrySize(entry);
        }
        return total;
    }
    updateStats() {
        this.stats.totalKeys = this.cache.size;
        this.stats.memoryUsage = this.getMemoryUsage();
    }
    updateHitRate() {
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
    }
    evictLeastRecentlyUsed() {
        return __awaiter(this, void 0, void 0, function* () {
            let oldestKey = null;
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
        });
    }
    startCleanupInterval() {
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, this.config.cleanupIntervalMs);
    }
    cleanup() {
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
exports.CacheManager = CacheManager;
// Singleton instance
exports.cacheManager = new CacheManager();
