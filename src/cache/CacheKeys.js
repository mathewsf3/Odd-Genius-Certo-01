"use strict";
/**
 * Cache Keys - Centralized cache key definitions
 * Based on FootyStats API endpoints and football constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheKeys = exports.CacheKeys = void 0;
class CacheKeys {
    // Reference data keys
    static leagues(chosenOnly, country) {
        const parts = [this.PREFIX, 'leagues'];
        if (chosenOnly)
            parts.push('chosen');
        if (country)
            parts.push(`country-${country}`);
        return parts.join(this.SEPARATOR);
    }
    static countries() {
        return [this.PREFIX, 'countries'].join(this.SEPARATOR);
    }
    // Match data keys
    static todaysMatches(date, timezone, page) {
        const parts = [this.PREFIX, 'matches', 'today'];
        if (date)
            parts.push(date);
        if (timezone)
            parts.push(timezone);
        if (page && page > 1)
            parts.push(`page-${page}`);
        return parts.join(this.SEPARATOR);
    }
    static match(matchId) {
        return [this.PREFIX, 'match', matchId.toString()].join(this.SEPARATOR);
    }
    static matchAnalysis(matchId, options) {
        const parts = [this.PREFIX, 'match', matchId.toString(), 'analysis'];
        if (options === null || options === void 0 ? void 0 : options.includeTeamStats)
            parts.push('team-stats');
        if (options === null || options === void 0 ? void 0 : options.includeRefereeStats)
            parts.push('referee-stats');
        if (options === null || options === void 0 ? void 0 : options.includeH2H)
            parts.push('h2h');
        return parts.join(this.SEPARATOR);
    }
    // League data keys
    static leagueSeason(seasonId, maxTime) {
        const parts = [this.PREFIX, 'league', 'season', seasonId.toString()];
        if (maxTime)
            parts.push(`time-${maxTime}`);
        return parts.join(this.SEPARATOR);
    }
    static leagueMatches(seasonId, page, maxPerPage, maxTime) {
        const parts = [this.PREFIX, 'league', seasonId.toString(), 'matches'];
        if (page && page > 1)
            parts.push(`page-${page}`);
        if (maxPerPage && maxPerPage !== 300)
            parts.push(`per-page-${maxPerPage}`);
        if (maxTime)
            parts.push(`time-${maxTime}`);
        return parts.join(this.SEPARATOR);
    }
    static leagueTeams(seasonId, page, includeStats, maxTime) {
        const parts = [this.PREFIX, 'league', seasonId.toString(), 'teams'];
        if (page && page > 1)
            parts.push(`page-${page}`);
        if (includeStats)
            parts.push('stats');
        if (maxTime)
            parts.push(`time-${maxTime}`);
        return parts.join(this.SEPARATOR);
    }
    static leaguePlayers(seasonId, includeStats) {
        const parts = [this.PREFIX, 'league', seasonId.toString(), 'players'];
        if (includeStats)
            parts.push('stats');
        return parts.join(this.SEPARATOR);
    }
    static leagueReferees(seasonId) {
        return [this.PREFIX, 'league', seasonId.toString(), 'referees'].join(this.SEPARATOR);
    }
    static leagueTables(seasonId) {
        return [this.PREFIX, 'league', seasonId.toString(), 'tables'].join(this.SEPARATOR);
    }
    // Team data keys
    static team(teamId, includeStats) {
        const parts = [this.PREFIX, 'team', teamId.toString()];
        if (includeStats)
            parts.push('stats');
        return parts.join(this.SEPARATOR);
    }
    static teamLastXStats(teamId, matchCount) {
        const parts = [this.PREFIX, 'team', teamId.toString(), 'last-x'];
        if (matchCount)
            parts.push(matchCount.toString());
        return parts.join(this.SEPARATOR);
    }
    static teamForm(teamId, matchCount = 5) {
        return [this.PREFIX, 'team', teamId.toString(), 'form', matchCount.toString()].join(this.SEPARATOR);
    }
    static teamComparison(homeTeamId, awayTeamId) {
        return [this.PREFIX, 'comparison', homeTeamId.toString(), 'vs', awayTeamId.toString()].join(this.SEPARATOR);
    }
    // Individual stats keys
    static playerStats(playerId) {
        return [this.PREFIX, 'player', playerId.toString(), 'stats'].join(this.SEPARATOR);
    }
    static refereeStats(refereeId) {
        return [this.PREFIX, 'referee', refereeId.toString(), 'stats'].join(this.SEPARATOR);
    }
    // Statistics keys
    static bttsStats() {
        return [this.PREFIX, 'stats', 'btts'].join(this.SEPARATOR);
    }
    static over25Stats() {
        return [this.PREFIX, 'stats', 'over25'].join(this.SEPARATOR);
    }
    static overUnderStats(threshold) {
        return [this.PREFIX, 'stats', 'over-under', threshold.toString()].join(this.SEPARATOR);
    }
    static cornerStats(type, id) {
        const parts = [this.PREFIX, 'stats', 'corners', type];
        if (id)
            parts.push(id.toString());
        return parts.join(this.SEPARATOR);
    }
    static cardStats(type, id) {
        const parts = [this.PREFIX, 'stats', 'cards', type];
        if (id)
            parts.push(id.toString());
        return parts.join(this.SEPARATOR);
    }
    // Analytics keys
    static matchPrediction(matchId) {
        return [this.PREFIX, 'prediction', 'match', matchId.toString()].join(this.SEPARATOR);
    }
    static teamAnalytics(teamId, type) {
        const parts = [this.PREFIX, 'analytics', 'team', teamId.toString()];
        if (type)
            parts.push(type);
        return parts.join(this.SEPARATOR);
    }
    static leagueAnalytics(seasonId, type) {
        const parts = [this.PREFIX, 'analytics', 'league', seasonId.toString()];
        if (type)
            parts.push(type);
        return parts.join(this.SEPARATOR);
    }
    static playerAnalytics(playerId, type) {
        const parts = [this.PREFIX, 'analytics', 'player', playerId.toString()];
        if (type)
            parts.push(type);
        return parts.join(this.SEPARATOR);
    }
    // H2H (Head-to-Head) keys
    static headToHead(homeTeamId, awayTeamId, matchCount) {
        const parts = [this.PREFIX, 'h2h', homeTeamId.toString(), awayTeamId.toString()];
        if (matchCount)
            parts.push(`last-${matchCount}`);
        return parts.join(this.SEPARATOR);
    }
    // Search keys
    static teamSearch(query, filters) {
        const parts = [this.PREFIX, 'search', 'teams', this.sanitizeQuery(query)];
        if (filters === null || filters === void 0 ? void 0 : filters.country)
            parts.push(`country-${filters.country}`);
        if (filters === null || filters === void 0 ? void 0 : filters.league)
            parts.push(`league-${filters.league}`);
        return parts.join(this.SEPARATOR);
    }
    static playerSearch(query, filters) {
        const parts = [this.PREFIX, 'search', 'players', this.sanitizeQuery(query)];
        if (filters === null || filters === void 0 ? void 0 : filters.position)
            parts.push(`pos-${filters.position}`);
        if (filters === null || filters === void 0 ? void 0 : filters.nationality)
            parts.push(`nat-${filters.nationality}`);
        if (filters === null || filters === void 0 ? void 0 : filters.teamId)
            parts.push(`team-${filters.teamId}`);
        return parts.join(this.SEPARATOR);
    }
    // Health and system keys
    static healthCheck() {
        return [this.PREFIX, 'health'].join(this.SEPARATOR);
    }
    static apiStatus() {
        return [this.PREFIX, 'api', 'status'].join(this.SEPARATOR);
    }
    static rateLimitStatus(identifier) {
        return [this.PREFIX, 'rate-limit', identifier].join(this.SEPARATOR);
    }
    // Utility methods
    static getTagsForEndpoint(endpoint) {
        const tags = ['footy'];
        if (endpoint.includes('match'))
            tags.push('matches');
        if (endpoint.includes('team'))
            tags.push('teams');
        if (endpoint.includes('league'))
            tags.push('leagues');
        if (endpoint.includes('player'))
            tags.push('players');
        if (endpoint.includes('referee'))
            tags.push('referees');
        if (endpoint.includes('stats'))
            tags.push('statistics');
        if (endpoint.includes('analytics'))
            tags.push('analytics');
        return tags;
    }
    static getTagsForEntity(entityType, entityId) {
        const tags = ['footy', entityType];
        if (entityId)
            tags.push(`${entityType}-${entityId}`);
        return tags;
    }
    static invalidatePattern(pattern) {
        return `${this.PREFIX}${this.SEPARATOR}${pattern}`;
    }
    // Private utility methods
    static sanitizeQuery(query) {
        return query
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
}
exports.CacheKeys = CacheKeys;
// Base prefixes
CacheKeys.PREFIX = 'footy';
CacheKeys.SEPARATOR = ':';
// Export commonly used cache key generators
exports.cacheKeys = CacheKeys;
