"use strict";
/**
 * 🧠 BASE ANALYTICS SERVICE
 *
 * Core foundation for all analytics services in Phase 3
 * Provides common functionality, caching, and integration with Phase 1 & 2
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
exports.BaseAnalyticsService = void 0;
const FootyStatsService_1 = require("../../services/FootyStatsService");
class BaseAnalyticsService {
    constructor(config = {}) {
        this.footyStatsService = new FootyStatsService_1.FootyStatsService();
        // Use singleton CacheManager for better memory efficiency and cache hit rates
        const { CacheManagerSingleton } = require('../../cache/CacheManagerSingleton');
        this.cacheManager = CacheManagerSingleton.getInstance();
        this.config = Object.assign({ enableCaching: true, cacheTtl: 1800, enableLogging: true }, config);
    }
    /**
     * 🔍 GET CACHED OR COMPUTE
     * Generic method for caching analytics results
     */
    getCachedOrCompute(cacheKey, computeFunction, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config.enableCaching) {
                const result = yield computeFunction();
                return Object.assign(Object.assign({}, result), { _cached: false });
            }
            // Check cache first
            const cached = yield this.cacheManager.get(cacheKey);
            if (cached) {
                this.log(`📋 Cache hit for key: ${cacheKey}`);
                return Object.assign(Object.assign({}, cached), { _cached: true });
            }
            // Compute and cache
            const result = yield computeFunction();
            yield this.cacheManager.set(cacheKey, result, {
                ttl: ttl || this.config.cacheTtl,
                tags: ['analytics']
            });
            this.log(`💾 Cached result for key: ${cacheKey}`);
            return Object.assign(Object.assign({}, result), { _cached: false });
        });
    }
    /**
     * 📊 CREATE ANALYTICS RESULT
     * Standardized result format for all analytics
     */
    createAnalyticsResult(data, source, startTime, dataPoints = 0, cached = false) {
        return {
            success: true,
            data,
            metadata: {
                timestamp: new Date().toISOString(),
                processingTime: Date.now() - startTime,
                dataPoints,
                cached,
                source
            }
        };
    }
    /**
     * ❌ CREATE ERROR RESULT
     * Standardized error format for analytics
     */
    createErrorResult(error, source, startTime) {
        return {
            success: false,
            error,
            metadata: {
                timestamp: new Date().toISOString(),
                processingTime: Date.now() - startTime,
                dataPoints: 0,
                source
            }
        };
    }
    /**
     * 📝 LOGGING
     * Centralized logging for analytics services
     */
    log(message, level = 'info') {
        if (!this.config.enableLogging)
            return;
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${this.constructor.name}]`;
        switch (level) {
            case 'info':
                console.log(`${prefix} ${message}`);
                break;
            case 'warn':
                console.warn(`${prefix} ⚠️ ${message}`);
                break;
            case 'error':
                console.error(`${prefix} ❌ ${message}`);
                break;
        }
    }
    /**
     * 🔢 CALCULATE PERCENTAGE
     * Utility for percentage calculations
     */
    calculatePercentage(value, total) {
        if (total === 0)
            return 0;
        return Math.round((value / total) * 100 * 100) / 100; // Round to 2 decimal places
    }
    /**
     * 📈 CALCULATE AVERAGE
     * Utility for average calculations
     */
    calculateAverage(values) {
        if (values.length === 0)
            return 0;
        const sum = values.reduce((acc, val) => acc + val, 0);
        return Math.round((sum / values.length) * 100) / 100; // Round to 2 decimal places
    }
    /**
     * 📊 CALCULATE TREND
     * Utility for trend analysis (positive, negative, stable)
     */
    calculateTrend(values) {
        if (values.length < 2)
            return 'stable';
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));
        const firstAvg = this.calculateAverage(firstHalf);
        const secondAvg = this.calculateAverage(secondHalf);
        const difference = secondAvg - firstAvg;
        const threshold = firstAvg * 0.05; // 5% threshold
        if (difference > threshold)
            return 'increasing';
        if (difference < -threshold)
            return 'decreasing';
        return 'stable';
    }
    /**
     * 🧹 CLEANUP
     * Cleanup resources when service is destroyed
     */
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('🧹 Shutting down analytics service...');
            yield this.footyStatsService.shutdown();
            this.cacheManager.shutdown();
            this.log('✅ Analytics service shutdown complete');
        });
    }
}
exports.BaseAnalyticsService = BaseAnalyticsService;
