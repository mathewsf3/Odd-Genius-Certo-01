"use strict";
/**
 * 🧠 ANALYTICS SERVICES - MAIN EXPORTS
 *
 * Phase 3: Advanced Analytics Services
 * Comprehensive analytics built on Phase 1 & 2 foundation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsMetricsCollector = exports.AnalyticsHelpers = exports.ANALYTICS_CONSTANTS = exports.AnalyticsServiceFactory = exports.BettingAnalyticsService = exports.PlayerAnalyticsService = exports.LeagueAnalyticsService = exports.TeamAnalyticsService = exports.MatchAnalyticsService = exports.AnalyticsUtils = exports.BaseAnalyticsService = void 0;
// Core Analytics Foundation
var BaseAnalyticsService_1 = require("./core/BaseAnalyticsService");
Object.defineProperty(exports, "BaseAnalyticsService", { enumerable: true, get: function () { return BaseAnalyticsService_1.BaseAnalyticsService; } });
// Analytics Utilities
var AnalyticsUtils_1 = require("./utils/AnalyticsUtils");
Object.defineProperty(exports, "AnalyticsUtils", { enumerable: true, get: function () { return AnalyticsUtils_1.AnalyticsUtils; } });
// Match Analytics
var MatchAnalyticsService_1 = require("./match/MatchAnalyticsService");
Object.defineProperty(exports, "MatchAnalyticsService", { enumerable: true, get: function () { return MatchAnalyticsService_1.MatchAnalyticsService; } });
// Import all services for factory
const BettingAnalyticsService_1 = require("./betting/BettingAnalyticsService");
const LeagueAnalyticsService_1 = require("./league/LeagueAnalyticsService");
const MatchAnalyticsService_2 = require("./match/MatchAnalyticsService");
const PlayerAnalyticsService_1 = require("./player/PlayerAnalyticsService");
const TeamAnalyticsService_1 = require("./team/TeamAnalyticsService");
// Team Analytics
var TeamAnalyticsService_2 = require("./team/TeamAnalyticsService");
Object.defineProperty(exports, "TeamAnalyticsService", { enumerable: true, get: function () { return TeamAnalyticsService_2.TeamAnalyticsService; } });
// League Analytics
var LeagueAnalyticsService_2 = require("./league/LeagueAnalyticsService");
Object.defineProperty(exports, "LeagueAnalyticsService", { enumerable: true, get: function () { return LeagueAnalyticsService_2.LeagueAnalyticsService; } });
// Player Analytics
var PlayerAnalyticsService_2 = require("./player/PlayerAnalyticsService");
Object.defineProperty(exports, "PlayerAnalyticsService", { enumerable: true, get: function () { return PlayerAnalyticsService_2.PlayerAnalyticsService; } });
// Betting Analytics
var BettingAnalyticsService_2 = require("./betting/BettingAnalyticsService");
Object.defineProperty(exports, "BettingAnalyticsService", { enumerable: true, get: function () { return BettingAnalyticsService_2.BettingAnalyticsService; } });
/**
 * 🎯 ANALYTICS SERVICE FACTORY
 * Convenient factory for creating analytics services
 */
class AnalyticsServiceFactory {
    /**
     * Create a match analytics service
     */
    static createMatchAnalytics(config) {
        return new MatchAnalyticsService_2.MatchAnalyticsService(config);
    }
    /**
     * Create all analytics services
     */
    static createAllServices(config) {
        return {
            match: new MatchAnalyticsService_2.MatchAnalyticsService(config),
            team: new TeamAnalyticsService_1.TeamAnalyticsService(config),
            league: new LeagueAnalyticsService_1.LeagueAnalyticsService(config),
            player: new PlayerAnalyticsService_1.PlayerAnalyticsService(config),
            betting: new BettingAnalyticsService_1.BettingAnalyticsService(config)
        };
    }
    /**
     * Get default analytics configuration
     */
    static getDefaultConfig() {
        return {
            enableCaching: true,
            cacheTtl: 1800, // 30 minutes
            enableLogging: true
        };
    }
    /**
     * Get performance-optimized configuration
     */
    static getPerformanceConfig() {
        return {
            enableCaching: true,
            cacheTtl: 3600, // 1 hour
            enableLogging: false // Disable for performance
        };
    }
    /**
     * Get development configuration
     */
    static getDevelopmentConfig() {
        return {
            enableCaching: false, // Disable caching for development
            cacheTtl: 300, // 5 minutes
            enableLogging: true
        };
    }
}
exports.AnalyticsServiceFactory = AnalyticsServiceFactory;
/**
 * 📊 ANALYTICS CONSTANTS
 */
exports.ANALYTICS_CONSTANTS = {
    // Cache TTL values (in seconds)
    CACHE_TTL: {
        MATCH_PREDICTION: 1800, // 30 minutes
        LIVE_INSIGHTS: 60, // 1 minute
        HISTORICAL_TRENDS: 3600, // 1 hour
        TEAM_ANALYSIS: 1800, // 30 minutes
        LEAGUE_ANALYSIS: 3600, // 1 hour
        PLAYER_STATS: 3600, // 1 hour
        BETTING_ANALYSIS: 900 // 15 minutes
    },
    // Confidence thresholds
    CONFIDENCE: {
        HIGH: 80,
        MEDIUM: 60,
        LOW: 40
    },
    // Statistical thresholds
    THRESHOLDS: {
        FORM_MATCHES: 5,
        H2H_MATCHES: 10,
        TREND_SIGNIFICANCE: 0.05,
        CORRELATION_STRONG: 0.7,
        CORRELATION_MODERATE: 0.5
    }
};
/**
 * 🔧 ANALYTICS HELPERS
 */
exports.AnalyticsHelpers = {
    /**
     * Validate analytics configuration
     */
    validateConfig(config) {
        if (config.cacheTtl && config.cacheTtl < 0)
            return false;
        return true;
    },
    /**
     * Get confidence level description
     */
    getConfidenceLevel(confidence) {
        if (confidence >= exports.ANALYTICS_CONSTANTS.CONFIDENCE.HIGH)
            return 'high';
        if (confidence >= exports.ANALYTICS_CONSTANTS.CONFIDENCE.MEDIUM)
            return 'medium';
        return 'low';
    },
    /**
     * Format analytics result for API response
     */
    formatForAPI(result) {
        return {
            success: result.success,
            data: result.data,
            error: result.error,
            metadata: Object.assign(Object.assign({}, result.metadata), { confidence: result.data && typeof result.data === 'object' && 'confidence' in result.data
                    ? this.getConfidenceLevel(result.data.confidence)
                    : undefined })
        };
    }
};
class AnalyticsMetricsCollector {
    constructor() {
        this.metrics = {
            totalPredictions: 0,
            successfulPredictions: 0,
            averageConfidence: 0,
            averageProcessingTime: 0,
            cacheHitRate: 0,
            errorRate: 0
        };
    }
    recordPrediction(result) {
        this.metrics.totalPredictions++;
        if (result.success) {
            this.metrics.successfulPredictions++;
        }
        // Update averages (simplified)
        this.metrics.averageProcessingTime =
            (this.metrics.averageProcessingTime + result.metadata.processingTime) / 2;
        if (result.metadata.cached) {
            this.metrics.cacheHitRate =
                (this.metrics.cacheHitRate + 1) / 2;
        }
        this.metrics.errorRate =
            1 - (this.metrics.successfulPredictions / this.metrics.totalPredictions);
    }
    getMetrics() {
        return Object.assign({}, this.metrics);
    }
    reset() {
        this.metrics = {
            totalPredictions: 0,
            successfulPredictions: 0,
            averageConfidence: 0,
            averageProcessingTime: 0,
            cacheHitRate: 0,
            errorRate: 0
        };
    }
}
exports.AnalyticsMetricsCollector = AnalyticsMetricsCollector;
