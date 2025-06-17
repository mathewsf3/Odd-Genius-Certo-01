/**
 * 🧠 ANALYTICS SERVICES - MAIN EXPORTS
 * 
 * Phase 3: Advanced Analytics Services
 * Comprehensive analytics built on Phase 1 & 2 foundation
 */

// Core Analytics Foundation
export { BaseAnalyticsService } from './core/BaseAnalyticsService';
export type {
    AnalyticsConfig,
    AnalyticsResult, BettingAnalyticsData, LeagueAnalyticsData, MatchAnalyticsData, PlayerAnalyticsData, TeamAnalyticsData
} from './core/BaseAnalyticsService';

// Analytics Utilities
export { AnalyticsUtils } from './utils/AnalyticsUtils';

// Import types for internal use
import type { AnalyticsConfig, AnalyticsResult } from './core/BaseAnalyticsService';

// Match Analytics
export { MatchAnalyticsService } from './match/MatchAnalyticsService';
export type {
    LiveMatchInsight, MatchPredictionOptions
} from './match/MatchAnalyticsService';

// Import all services for factory
import { BettingAnalyticsService } from './betting/BettingAnalyticsService';
import { LeagueAnalyticsService } from './league/LeagueAnalyticsService';
import { MatchAnalyticsService } from './match/MatchAnalyticsService';
import { PlayerAnalyticsService } from './player/PlayerAnalyticsService';
import { TeamAnalyticsService } from './team/TeamAnalyticsService';

// Team Analytics
export { TeamAnalyticsService } from './team/TeamAnalyticsService';
export type {
    DetailedTeamAnalysis, TeamAnalysisOptions,
    TeamComparisonOptions
} from './team/TeamAnalyticsService';

// League Analytics
export { LeagueAnalyticsService } from './league/LeagueAnalyticsService';
export type {
    CompetitionComparisonOptions,
    DetailedLeagueAnalysis, LeagueAnalysisOptions
} from './league/LeagueAnalyticsService';

// Player Analytics
export { PlayerAnalyticsService } from './player/PlayerAnalyticsService';
export type {
    DetailedPlayerAnalysis,
    DetailedRefereeAnalysis, PlayerAnalysisOptions,
    RefereeAnalysisOptions
} from './player/PlayerAnalyticsService';

// Betting Analytics
export { BettingAnalyticsService } from './betting/BettingAnalyticsService';
export type {
    BettingAnalysisOptions, DetailedBettingAnalysis, PredictionEngineOptions, PredictionEngineResult
} from './betting/BettingAnalyticsService';

/**
 * 🎯 ANALYTICS SERVICE FACTORY
 * Convenient factory for creating analytics services
 */
export class AnalyticsServiceFactory {
  
  /**
   * Create a match analytics service
   */
  static createMatchAnalytics(config?: AnalyticsConfig): MatchAnalyticsService {
    return new MatchAnalyticsService(config);
  }

  /**
   * Create all analytics services
   */
  static createAllServices(config?: AnalyticsConfig) {
    return {
      match: new MatchAnalyticsService(config),
      team: new TeamAnalyticsService(config),
      league: new LeagueAnalyticsService(config),
      player: new PlayerAnalyticsService(config),
      betting: new BettingAnalyticsService(config)
    };
  }

  /**
   * Get default analytics configuration
   */
  static getDefaultConfig(): AnalyticsConfig {
    return {
      enableCaching: true,
      cacheTtl: 1800, // 30 minutes
      enableLogging: true
    };
  }

  /**
   * Get performance-optimized configuration
   */
  static getPerformanceConfig(): AnalyticsConfig {
    return {
      enableCaching: true,
      cacheTtl: 3600, // 1 hour
      enableLogging: false // Disable for performance
    };
  }

  /**
   * Get development configuration
   */
  static getDevelopmentConfig(): AnalyticsConfig {
    return {
      enableCaching: false, // Disable caching for development
      cacheTtl: 300, // 5 minutes
      enableLogging: true
    };
  }
}

/**
 * 📊 ANALYTICS CONSTANTS
 */
export const ANALYTICS_CONSTANTS = {
  // Cache TTL values (in seconds)
  CACHE_TTL: {
    MATCH_PREDICTION: 1800,    // 30 minutes
    LIVE_INSIGHTS: 60,         // 1 minute
    HISTORICAL_TRENDS: 3600,   // 1 hour
    TEAM_ANALYSIS: 1800,       // 30 minutes
    LEAGUE_ANALYSIS: 3600,     // 1 hour
    PLAYER_STATS: 3600,        // 1 hour
    BETTING_ANALYSIS: 900      // 15 minutes
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
export const AnalyticsHelpers = {
  
  /**
   * Validate analytics configuration
   */
  validateConfig(config: AnalyticsConfig): boolean {
    if (config.cacheTtl && config.cacheTtl < 0) return false;
    return true;
  },

  /**
   * Get confidence level description
   */
  getConfidenceLevel(confidence: number): 'high' | 'medium' | 'low' {
    if (confidence >= ANALYTICS_CONSTANTS.CONFIDENCE.HIGH) return 'high';
    if (confidence >= ANALYTICS_CONSTANTS.CONFIDENCE.MEDIUM) return 'medium';
    return 'low';
  },

  /**
   * Format analytics result for API response
   */
  formatForAPI<T>(result: AnalyticsResult<T>) {
    return {
      success: result.success,
      data: result.data,
      error: result.error,
      metadata: {
        ...result.metadata,
        confidence: result.data && typeof result.data === 'object' && 'confidence' in result.data 
          ? this.getConfidenceLevel(result.data.confidence as number)
          : undefined
      }
    };
  }
};

/**
 * 📈 ANALYTICS METRICS
 */
export interface AnalyticsMetrics {
  totalPredictions: number;
  successfulPredictions: number;
  averageConfidence: number;
  averageProcessingTime: number;
  cacheHitRate: number;
  errorRate: number;
}

export class AnalyticsMetricsCollector {
  private metrics: AnalyticsMetrics = {
    totalPredictions: 0,
    successfulPredictions: 0,
    averageConfidence: 0,
    averageProcessingTime: 0,
    cacheHitRate: 0,
    errorRate: 0
  };

  recordPrediction(result: AnalyticsResult<any>) {
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

  getMetrics(): AnalyticsMetrics {
    return { ...this.metrics };
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
