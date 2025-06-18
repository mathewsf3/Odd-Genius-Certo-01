/**
 * 🎯 Cache Strategy Configuration
 * 
 * Defines intelligent caching strategies for different data types
 * to prevent API rate limiting while ensuring data freshness
 * 
 * Strategy Categories:
 * - LIVE: Real-time data (30-60 seconds)
 * - FREQUENT: Often-changing data (5-10 minutes)
 * - STABLE: Rarely-changing data (1-24 hours)
 * - STATIC: Reference data (24+ hours)
 */

export interface CacheStrategyConfig {
  ttl: number; // Time to live in seconds
  tags: string[];
  compress: boolean;
  priority: 'high' | 'medium' | 'low';
  warmOnStartup: boolean;
  invalidateOnUpdate: boolean;
}

export const CACHE_STRATEGIES = {
  // 🔴 LIVE DATA (30-60 seconds)
  LIVE_MATCHES: {
    ttl: 30, // 30 seconds for real-time updates
    tags: ['live', 'matches', 'real-time'],
    compress: true,
    priority: 'high',
    warmOnStartup: false,
    invalidateOnUpdate: true
  } as CacheStrategyConfig,

  LIVE_SCORES: {
    ttl: 15, // 15 seconds for live scores
    tags: ['live', 'scores', 'real-time'],
    compress: false,
    priority: 'high',
    warmOnStartup: false,
    invalidateOnUpdate: true
  } as CacheStrategyConfig,

  // 🟡 FREQUENT DATA (5-10 minutes)
  TODAY_MATCHES: {
    ttl: 300, // 5 minutes
    tags: ['matches', 'today', 'frequent'],
    compress: true,
    priority: 'high',
    warmOnStartup: true,
    invalidateOnUpdate: false
  } as CacheStrategyConfig,

  UPCOMING_MATCHES: {
    ttl: 600, // 10 minutes
    tags: ['matches', 'upcoming', 'frequent'],
    compress: true,
    priority: 'medium',
    warmOnStartup: true,
    invalidateOnUpdate: false
  } as CacheStrategyConfig,

  MATCH_DETAILS_LIVE: {
    ttl: 60, // 1 minute for live matches
    tags: ['matches', 'details', 'live'],
    compress: true,
    priority: 'high',
    warmOnStartup: false,
    invalidateOnUpdate: true
  } as CacheStrategyConfig,

  MATCH_DETAILS_UPCOMING: {
    ttl: 900, // 15 minutes for upcoming matches
    tags: ['matches', 'details', 'upcoming'],
    compress: true,
    priority: 'medium',
    warmOnStartup: false,
    invalidateOnUpdate: false
  } as CacheStrategyConfig,

  // 🟢 STABLE DATA (1-24 hours)
  MATCH_DETAILS_COMPLETED: {
    ttl: 86400, // 24 hours for completed matches
    tags: ['matches', 'details', 'completed'],
    compress: true,
    priority: 'low',
    warmOnStartup: false,
    invalidateOnUpdate: false
  } as CacheStrategyConfig,

  TEAM_DATA: {
    ttl: 3600, // 1 hour
    tags: ['teams', 'data', 'stable'],
    compress: true,
    priority: 'medium',
    warmOnStartup: true,
    invalidateOnUpdate: false
  } as CacheStrategyConfig,

  TEAM_STATS: {
    ttl: 1800, // 30 minutes
    tags: ['teams', 'stats', 'stable'],
    compress: true,
    priority: 'medium',
    warmOnStartup: false,
    invalidateOnUpdate: false
  } as CacheStrategyConfig,

  LEAGUE_MATCHES: {
    ttl: 1800, // 30 minutes
    tags: ['leagues', 'matches', 'stable'],
    compress: true,
    priority: 'medium',
    warmOnStartup: false,
    invalidateOnUpdate: false
  } as CacheStrategyConfig,

  LEAGUE_TABLES: {
    ttl: 3600, // 1 hour
    tags: ['leagues', 'tables', 'stable'],
    compress: true,
    priority: 'medium',
    warmOnStartup: true,
    invalidateOnUpdate: false
  } as CacheStrategyConfig,

  PLAYER_STATS: {
    ttl: 7200, // 2 hours
    tags: ['players', 'stats', 'stable'],
    compress: true,
    priority: 'low',
    warmOnStartup: false,
    invalidateOnUpdate: false
  } as CacheStrategyConfig,

  // 🔵 STATIC DATA (24+ hours)
  COUNTRIES: {
    ttl: 604800, // 7 days
    tags: ['reference', 'countries', 'static'],
    compress: false,
    priority: 'low',
    warmOnStartup: true,
    invalidateOnUpdate: false
  } as CacheStrategyConfig,

  LEAGUES: {
    ttl: 86400, // 24 hours
    tags: ['reference', 'leagues', 'static'],
    compress: true,
    priority: 'medium',
    warmOnStartup: true,
    invalidateOnUpdate: false
  } as CacheStrategyConfig,

  LEAGUE_SEASONS: {
    ttl: 43200, // 12 hours
    tags: ['reference', 'seasons', 'static'],
    compress: true,
    priority: 'low',
    warmOnStartup: false,
    invalidateOnUpdate: false
  } as CacheStrategyConfig,

  LEAGUE_TEAMS: {
    ttl: 21600, // 6 hours
    tags: ['leagues', 'teams', 'static'],
    compress: true,
    priority: 'low',
    warmOnStartup: false,
    invalidateOnUpdate: false
  } as CacheStrategyConfig,

  REFEREE_STATS: {
    ttl: 86400, // 24 hours
    tags: ['referees', 'stats', 'static'],
    compress: true,
    priority: 'low',
    warmOnStartup: false,
    invalidateOnUpdate: false
  } as CacheStrategyConfig,

  // 📊 ANALYTICS DATA (15-30 minutes)
  BTTS_STATS: {
    ttl: 1800, // 30 minutes
    tags: ['analytics', 'btts', 'stats'],
    compress: true,
    priority: 'medium',
    warmOnStartup: false,
    invalidateOnUpdate: false
  } as CacheStrategyConfig,

  OVER25_STATS: {
    ttl: 1800, // 30 minutes
    tags: ['analytics', 'over25', 'stats'],
    compress: true,
    priority: 'medium',
    warmOnStartup: false,
    invalidateOnUpdate: false
  } as CacheStrategyConfig,

  MATCH_ANALYSIS: {
    ttl: 900, // 15 minutes
    tags: ['analytics', 'match', 'analysis'],
    compress: true,
    priority: 'medium',
    warmOnStartup: false,
    invalidateOnUpdate: false
  } as CacheStrategyConfig
} as const;

/**
 * Get cache strategy for a specific data type
 */
export function getCacheStrategy(dataType: keyof typeof CACHE_STRATEGIES): CacheStrategyConfig {
  return CACHE_STRATEGIES[dataType];
}

/**
 * Get TTL based on match status
 */
export function getMatchTTL(status: string): number {
  const normalizedStatus = status.toLowerCase();
  
  if (['live', 'incomplete', 'in_progress'].includes(normalizedStatus)) {
    return CACHE_STRATEGIES.MATCH_DETAILS_LIVE.ttl;
  }
  
  if (['upcoming', 'not_started', 'scheduled'].includes(normalizedStatus)) {
    return CACHE_STRATEGIES.MATCH_DETAILS_UPCOMING.ttl;
  }
  
  // Completed matches
  return CACHE_STRATEGIES.MATCH_DETAILS_COMPLETED.ttl;
}

/**
 * Get cache tags based on data type and context
 */
export function getCacheTags(dataType: string, context?: Record<string, any>): string[] {
  const baseTags = [dataType];
  
  if (context) {
    if (context.matchId) baseTags.push(`match-${context.matchId}`);
    if (context.teamId) baseTags.push(`team-${context.teamId}`);
    if (context.leagueId) baseTags.push(`league-${context.leagueId}`);
    if (context.date) baseTags.push(`date-${context.date}`);
    if (context.status) baseTags.push(`status-${context.status}`);
  }
  
  return baseTags;
}

/**
 * Determine if data should be compressed based on size and type
 */
export function shouldCompress(data: any, dataType: string): boolean {
  const strategy = CACHE_STRATEGIES[dataType as keyof typeof CACHE_STRATEGIES];
  if (strategy?.compress !== undefined) {
    return strategy.compress;
  }
  
  // Default compression logic
  const dataSize = JSON.stringify(data).length;
  return dataSize > 1024; // Compress if larger than 1KB
}

/**
 * Get warming priority for startup cache warming
 */
export function getWarmingPriority(): Array<keyof typeof CACHE_STRATEGIES> {
  return Object.entries(CACHE_STRATEGIES)
    .filter(([_, strategy]) => strategy.warmOnStartup)
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b[1].priority] - priorityOrder[a[1].priority];
    })
    .map(([key, _]) => key as keyof typeof CACHE_STRATEGIES);
}

export type CacheDataType = keyof typeof CACHE_STRATEGIES;
