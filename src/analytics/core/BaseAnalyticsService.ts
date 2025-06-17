/**
 * 🧠 BASE ANALYTICS SERVICE
 * 
 * Core foundation for all analytics services in Phase 3
 * Provides common functionality, caching, and integration with Phase 1 & 2
 */

import { CacheManager } from '../../cache/CacheManager';
import { FootyStatsService } from '../../services/FootyStatsService';

export interface AnalyticsConfig {
  enableCaching?: boolean;
  cacheTtl?: number;
  enableLogging?: boolean;
}

export interface AnalyticsResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata: {
    timestamp: string;
    processingTime: number;
    dataPoints: number;
    cached?: boolean;
    source: string;
  };
}

export abstract class BaseAnalyticsService {
  protected footyStatsService: FootyStatsService;
  protected cacheManager: CacheManager;
  protected config: AnalyticsConfig;

  constructor(config: AnalyticsConfig = {}) {
    this.footyStatsService = new FootyStatsService();
    // Use singleton CacheManager for better memory efficiency and cache hit rates
    const { CacheManagerSingleton } = require('../../cache/CacheManagerSingleton');
    this.cacheManager = CacheManagerSingleton.getInstance();
    this.config = {
      enableCaching: true,
      cacheTtl: 1800,
      enableLogging: true,
      ...config
    };
  }

  /**
   * 🔍 GET CACHED OR COMPUTE
   * Generic method for caching analytics results
   */
  protected async getCachedOrCompute<T>(
    cacheKey: string,
    computeFunction: () => Promise<T>,
    ttl?: number
  ): Promise<T & { _cached?: boolean }> {
    if (!this.config.enableCaching) {
      const result = await computeFunction();
      return { ...result, _cached: false } as T & { _cached?: boolean };
    }

    // Check cache first
    const cached = await this.cacheManager.get<T>(cacheKey);
    if (cached) {
      this.log(`📋 Cache hit for key: ${cacheKey}`);
      return { ...cached, _cached: true } as T & { _cached?: boolean };
    }

    // Compute and cache
    const result = await computeFunction();
    await this.cacheManager.set(cacheKey, result, {
      ttl: ttl || this.config.cacheTtl!,
      tags: ['analytics']
    });

    this.log(`💾 Cached result for key: ${cacheKey}`);
    return { ...result, _cached: false } as T & { _cached?: boolean };
  }

  /**
   * 📊 CREATE ANALYTICS RESULT
   * Standardized result format for all analytics
   */
  protected createAnalyticsResult<T>(
    data: T,
    source: string,
    startTime: number,
    dataPoints: number = 0,
    cached: boolean = false
  ): AnalyticsResult<T> {
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
  protected createErrorResult(
    error: string,
    source: string,
    startTime: number
  ): AnalyticsResult {
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
  protected log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    if (!this.config.enableLogging) return;

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
  protected calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100 * 100) / 100; // Round to 2 decimal places
  }

  /**
   * 📈 CALCULATE AVERAGE
   * Utility for average calculations
   */
  protected calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / values.length) * 100) / 100; // Round to 2 decimal places
  }

  /**
   * 📊 CALCULATE TREND
   * Utility for trend analysis (positive, negative, stable)
   */
  protected calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = this.calculateAverage(firstHalf);
    const secondAvg = this.calculateAverage(secondHalf);
    
    const difference = secondAvg - firstAvg;
    const threshold = firstAvg * 0.05; // 5% threshold
    
    if (difference > threshold) return 'increasing';
    if (difference < -threshold) return 'decreasing';
    return 'stable';
  }

  /**
   * 🧹 CLEANUP
   * Cleanup resources when service is destroyed
   */
  async shutdown(): Promise<void> {
    this.log('🧹 Shutting down analytics service...');
    await this.footyStatsService.shutdown();
    this.cacheManager.shutdown();
    this.log('✅ Analytics service shutdown complete');
  }
}

/**
 * 🏷️ ANALYTICS INTERFACES
 * Common interfaces for analytics results
 */

export interface MatchAnalyticsData {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  predictions: {
    homeWin: number;
    draw: number;
    awayWin: number;
    btts: number;
    over25: number;
  };
  confidence: number;
  factors: string[];
}

export interface TeamAnalyticsData {
  teamId: number;
  teamName: string;
  performance: {
    form: string;
    goalsFor: number;
    goalsAgainst: number;
    cleanSheets: number;
    wins: number;
    draws: number;
    losses: number;
  };
  trends: {
    scoring: 'increasing' | 'decreasing' | 'stable';
    defending: 'increasing' | 'decreasing' | 'stable';
    overall: 'increasing' | 'decreasing' | 'stable';
  };
}

export interface LeagueAnalyticsData {
  leagueId: number;
  leagueName: string;
  season: string;
  statistics: {
    totalMatches: number;
    totalGoals: number;
    averageGoalsPerMatch: number;
    bttsPercentage: number;
    over25Percentage: number;
  };
  topTeams: {
    teamId: number;
    teamName: string;
    points: number;
    position: number;
  }[];
}

export interface PlayerAnalyticsData {
  playerId: number;
  playerName: string;
  position: string;
  statistics: {
    goals: number;
    assists: number;
    appearances: number;
    averageRating: number;
  };
  performance: {
    form: string;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
}

export interface BettingAnalyticsData {
  market: string;
  statistics: {
    totalMatches: number;
    successRate: number;
    averageOdds: number;
    profitLoss: number;
  };
  recommendations: {
    confidence: number;
    suggestion: string;
    reasoning: string[];
  }[];
}
