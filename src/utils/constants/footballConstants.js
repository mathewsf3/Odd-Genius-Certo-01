"use strict";
/**
 * ⚽ Football-specific constants
 * Based on footy.yaml API specifications
 * Complete mapping of all 16 FootyStats API endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_CODES = exports.HTTP_STATUS = exports.RATE_LIMITS = exports.CACHE_TTL = exports.DEFAULT_VALUES = exports.FOOTY_OPERATIONS = exports.FOOTY_ENDPOINTS = exports.TIME_PERIODS = exports.GOAL_THRESHOLDS = exports.MATCH_STATUS = void 0;
// Match status types from footy.yaml Match schema
exports.MATCH_STATUS = {
    COMPLETE: 'complete',
    SUSPENDED: 'suspended',
    CANCELED: 'canceled',
    INCOMPLETE: 'incomplete'
};
// Goal thresholds for analytics (from footy.yaml Match schema)
exports.GOAL_THRESHOLDS = {
    OVER_05: 0.5,
    OVER_15: 1.5,
    OVER_25: 2.5,
    OVER_35: 3.5,
    OVER_45: 4.5,
    OVER_55: 5.5
};
// Time periods for analysis
exports.TIME_PERIODS = {
    LAST_5_MATCHES: 5,
    LAST_6_MATCHES: 6,
    LAST_10_MATCHES: 10,
    SEASON_TO_DATE: 'season',
    ALL_TIME: 'all'
};
// FootyStats API endpoints (ALL 16 from footy.yaml)
exports.FOOTY_ENDPOINTS = {
    // Reference Data
    LEAGUES: '/league-list',
    COUNTRIES: '/country-list',
    // Match Data
    TODAYS_MATCHES: '/todays-matches',
    MATCH: '/match',
    // League Data
    LEAGUE_SEASON: '/league-season',
    LEAGUE_MATCHES: '/league-matches',
    LEAGUE_TEAMS: '/league-teams',
    LEAGUE_PLAYERS: '/league-players',
    LEAGUE_REFEREES: '/league-referees',
    LEAGUE_TABLES: '/league-tables',
    // Team Data
    TEAM: '/team',
    TEAM_LAST_X: '/lastx',
    TEAM_LAST_X_STATS: '/lastx',
    // Individual Stats
    PLAYER_STATS: '/player-stats',
    REFEREE_STATS: '/referee',
    // Statistics
    BTTS_STATS: '/stats-data-btts',
    OVER25_STATS: '/stats-data-over25'
};
// Operation IDs from footy.yaml (for type safety)
exports.FOOTY_OPERATIONS = {
    GET_LEAGUES: 'getLeagues',
    GET_COUNTRIES: 'getCountries',
    GET_TODAYS_MATCHES: 'getTodaysMatches',
    GET_LEAGUE_SEASON: 'getLeagueSeason',
    GET_LEAGUE_MATCHES: 'getLeagueMatches',
    GET_LEAGUE_TEAMS: 'getLeagueTeams',
    GET_LEAGUE_PLAYERS: 'getLeaguePlayers',
    GET_LEAGUE_REFEREES: 'getLeagueReferees',
    GET_TEAM: 'getTeam',
    GET_TEAM_LAST_X_STATS: 'getTeamLastXStats',
    GET_MATCH: 'getMatch',
    GET_LEAGUE_TABLES: 'getLeagueTables',
    GET_PLAYER_STATS: 'getPlayerStats',
    GET_REFEREE_STATS: 'getRefereeStats',
    GET_BTTS_STATS: 'getBTTSStats',
    GET_OVER25_STATS: 'getOver25Stats'
};
// Default values for missing data (from footy.yaml defaults)
exports.DEFAULT_VALUES = {
    CORNER_DEFAULT: -1,
    SHOTS_DEFAULT: -2,
    STATS_DEFAULT: -1,
    DRAW_RESULT: -1
};
// Cache TTL strategies for different endpoint types
exports.CACHE_TTL = {
    // Reference data - rarely changes
    REFERENCE: 3600, // 1 hour
    COUNTRIES: 86400, // 24 hours
    LEAGUES: 3600, // 1 hour
    // Live/frequent data
    LIVE_MATCHES: 300, // 5 minutes
    TODAY_MATCHES: 300, // 5 minutes
    // Match details
    MATCH_DETAILS: 600, // 10 minutes
    MATCH_STATS: 900, // 15 minutes
    // League data
    LEAGUE_SEASON: 1800, // 30 minutes
    LEAGUE_MATCHES: 900, // 15 minutes
    LEAGUE_TEAMS: 1800, // 30 minutes
    LEAGUE_PLAYERS: 3600, // 1 hour
    LEAGUE_REFEREES: 3600, // 1 hour
    LEAGUE_TABLES: 900, // 15 minutes
    // Team data
    TEAM_DATA: 1800, // 30 minutes
    TEAM_STATS: 1800, // 30 minutes
    // Player/Referee data
    PLAYER_STATS: 3600, // 1 hour
    REFEREE_STATS: 3600, // 1 hour
    // Analytics data
    ANALYTICS: 900, // 15 minutes
    BTTS_STATS: 1800, // 30 minutes
    OVER25_STATS: 1800, // 30 minutes
    // Default
    DEFAULT: 900 // 15 minutes
};
// Rate limiting configurations per endpoint type
exports.RATE_LIMITS = {
    // Base limits (requests per 15 minutes)
    BASE: 100,
    // API key multipliers
    API_KEY_MULTIPLIER: 3,
    PREMIUM_MULTIPLIER: 5,
    ENTERPRISE_MULTIPLIER: 10,
    // Endpoint-specific limits
    REFERENCE_DATA: 300, // Higher limit for reference data
    LIVE_DATA: 100, // Standard limit for live data
    ANALYTICS: 50, // Lower limit for analytics
    HEAVY_ANALYTICS: 25 // Very low limit for complex analytics
};
// HTTP status codes for API responses
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
};
// Error codes for our API
exports.ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    FOOTYSTATS_API_ERROR: 'FOOTYSTATS_API_ERROR',
    CACHE_ERROR: 'CACHE_ERROR',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    INTERNAL_ERROR: 'INTERNAL_ERROR'
};
