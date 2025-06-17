/**
 * Cache Keys - Centralized cache key definitions
 * Based on FootyStats API endpoints and football constants
 */

import { FOOTY_ENDPOINTS } from '../utils/constants/footballConstants';

export class CacheKeys {
  // Base prefixes
  private static readonly PREFIX = 'footy';
  private static readonly SEPARATOR = ':';

  // Reference data keys
  static leagues(chosenOnly?: boolean, country?: number): string {
    const parts = [this.PREFIX, 'leagues'];
    if (chosenOnly) parts.push('chosen');
    if (country) parts.push(`country-${country}`);
    return parts.join(this.SEPARATOR);
  }

  static countries(): string {
    return [this.PREFIX, 'countries'].join(this.SEPARATOR);
  }

  // Match data keys
  static todaysMatches(date?: string, timezone?: string, page?: number): string {
    const parts = [this.PREFIX, 'matches', 'today'];
    if (date) parts.push(date);
    if (timezone) parts.push(timezone);
    if (page && page > 1) parts.push(`page-${page}`);
    return parts.join(this.SEPARATOR);
  }

  static match(matchId: number): string {
    return [this.PREFIX, 'match', matchId.toString()].join(this.SEPARATOR);
  }

  static matchAnalysis(matchId: number, options?: any): string {
    const parts = [this.PREFIX, 'match', matchId.toString(), 'analysis'];
    if (options?.includeTeamStats) parts.push('team-stats');
    if (options?.includeRefereeStats) parts.push('referee-stats');
    if (options?.includeH2H) parts.push('h2h');
    return parts.join(this.SEPARATOR);
  }

  // League data keys
  static leagueSeason(seasonId: number, maxTime?: number): string {
    const parts = [this.PREFIX, 'league', 'season', seasonId.toString()];
    if (maxTime) parts.push(`time-${maxTime}`);
    return parts.join(this.SEPARATOR);
  }

  static leagueMatches(seasonId: number, page?: number, maxPerPage?: number, maxTime?: number): string {
    const parts = [this.PREFIX, 'league', seasonId.toString(), 'matches'];
    if (page && page > 1) parts.push(`page-${page}`);
    if (maxPerPage && maxPerPage !== 300) parts.push(`per-page-${maxPerPage}`);
    if (maxTime) parts.push(`time-${maxTime}`);
    return parts.join(this.SEPARATOR);
  }

  static leagueTeams(seasonId: number, page?: number, includeStats?: boolean, maxTime?: number): string {
    const parts = [this.PREFIX, 'league', seasonId.toString(), 'teams'];
    if (page && page > 1) parts.push(`page-${page}`);
    if (includeStats) parts.push('stats');
    if (maxTime) parts.push(`time-${maxTime}`);
    return parts.join(this.SEPARATOR);
  }

  static leaguePlayers(seasonId: number, includeStats?: boolean): string {
    const parts = [this.PREFIX, 'league', seasonId.toString(), 'players'];
    if (includeStats) parts.push('stats');
    return parts.join(this.SEPARATOR);
  }

  static leagueReferees(seasonId: number): string {
    return [this.PREFIX, 'league', seasonId.toString(), 'referees'].join(this.SEPARATOR);
  }

  static leagueTables(seasonId: number): string {
    return [this.PREFIX, 'league', seasonId.toString(), 'tables'].join(this.SEPARATOR);
  }

  // Team data keys
  static team(teamId: number, includeStats?: boolean): string {
    const parts = [this.PREFIX, 'team', teamId.toString()];
    if (includeStats) parts.push('stats');
    return parts.join(this.SEPARATOR);
  }

  static teamLastXStats(teamId: number, matchCount?: number): string {
    const parts = [this.PREFIX, 'team', teamId.toString(), 'last-x'];
    if (matchCount) parts.push(matchCount.toString());
    return parts.join(this.SEPARATOR);
  }

  static teamForm(teamId: number, matchCount: number = 5): string {
    return [this.PREFIX, 'team', teamId.toString(), 'form', matchCount.toString()].join(this.SEPARATOR);
  }

  static teamComparison(homeTeamId: number, awayTeamId: number): string {
    return [this.PREFIX, 'comparison', homeTeamId.toString(), 'vs', awayTeamId.toString()].join(this.SEPARATOR);
  }

  // Individual stats keys
  static playerStats(playerId: number): string {
    return [this.PREFIX, 'player', playerId.toString(), 'stats'].join(this.SEPARATOR);
  }

  static refereeStats(refereeId: number): string {
    return [this.PREFIX, 'referee', refereeId.toString(), 'stats'].join(this.SEPARATOR);
  }

  // Statistics keys
  static bttsStats(): string {
    return [this.PREFIX, 'stats', 'btts'].join(this.SEPARATOR);
  }

  static over25Stats(): string {
    return [this.PREFIX, 'stats', 'over25'].join(this.SEPARATOR);
  }

  static overUnderStats(threshold: number): string {
    return [this.PREFIX, 'stats', 'over-under', threshold.toString()].join(this.SEPARATOR);
  }

  static cornerStats(type: 'team' | 'match' | 'league', id?: number): string {
    const parts = [this.PREFIX, 'stats', 'corners', type];
    if (id) parts.push(id.toString());
    return parts.join(this.SEPARATOR);
  }

  static cardStats(type: 'team' | 'match' | 'league' | 'referee', id?: number): string {
    const parts = [this.PREFIX, 'stats', 'cards', type];
    if (id) parts.push(id.toString());
    return parts.join(this.SEPARATOR);
  }

  // Analytics keys
  static matchPrediction(matchId: number): string {
    return [this.PREFIX, 'prediction', 'match', matchId.toString()].join(this.SEPARATOR);
  }

  static teamAnalytics(teamId: number, type?: string): string {
    const parts = [this.PREFIX, 'analytics', 'team', teamId.toString()];
    if (type) parts.push(type);
    return parts.join(this.SEPARATOR);
  }

  static leagueAnalytics(seasonId: number, type?: string): string {
    const parts = [this.PREFIX, 'analytics', 'league', seasonId.toString()];
    if (type) parts.push(type);
    return parts.join(this.SEPARATOR);
  }

  static playerAnalytics(playerId: number, type?: string): string {
    const parts = [this.PREFIX, 'analytics', 'player', playerId.toString()];
    if (type) parts.push(type);
    return parts.join(this.SEPARATOR);
  }

  // H2H (Head-to-Head) keys
  static headToHead(homeTeamId: number, awayTeamId: number, matchCount?: number): string {
    const parts = [this.PREFIX, 'h2h', homeTeamId.toString(), awayTeamId.toString()];
    if (matchCount) parts.push(`last-${matchCount}`);
    return parts.join(this.SEPARATOR);
  }

  // Search keys
  static teamSearch(query: string, filters?: any): string {
    const parts = [this.PREFIX, 'search', 'teams', this.sanitizeQuery(query)];
    if (filters?.country) parts.push(`country-${filters.country}`);
    if (filters?.league) parts.push(`league-${filters.league}`);
    return parts.join(this.SEPARATOR);
  }

  static playerSearch(query: string, filters?: any): string {
    const parts = [this.PREFIX, 'search', 'players', this.sanitizeQuery(query)];
    if (filters?.position) parts.push(`pos-${filters.position}`);
    if (filters?.nationality) parts.push(`nat-${filters.nationality}`);
    if (filters?.teamId) parts.push(`team-${filters.teamId}`);
    return parts.join(this.SEPARATOR);
  }

  // Health and system keys
  static healthCheck(): string {
    return [this.PREFIX, 'health'].join(this.SEPARATOR);
  }

  static apiStatus(): string {
    return [this.PREFIX, 'api', 'status'].join(this.SEPARATOR);
  }

  static rateLimitStatus(identifier: string): string {
    return [this.PREFIX, 'rate-limit', identifier].join(this.SEPARATOR);
  }

  // Utility methods
  static getTagsForEndpoint(endpoint: string): string[] {
    const tags = ['footy'];
    
    if (endpoint.includes('match')) tags.push('matches');
    if (endpoint.includes('team')) tags.push('teams');
    if (endpoint.includes('league')) tags.push('leagues');
    if (endpoint.includes('player')) tags.push('players');
    if (endpoint.includes('referee')) tags.push('referees');
    if (endpoint.includes('stats')) tags.push('statistics');
    if (endpoint.includes('analytics')) tags.push('analytics');
    
    return tags;
  }

  static getTagsForEntity(entityType: string, entityId?: number): string[] {
    const tags = ['footy', entityType];
    if (entityId) tags.push(`${entityType}-${entityId}`);
    return tags;
  }

  static invalidatePattern(pattern: string): string {
    return `${this.PREFIX}${this.SEPARATOR}${pattern}`;
  }

  // Private utility methods
  private static sanitizeQuery(query: string): string {
    return query
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

// Export commonly used cache key generators
export const cacheKeys = CacheKeys;
