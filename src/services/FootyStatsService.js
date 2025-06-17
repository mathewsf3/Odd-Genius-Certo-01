"use strict";
/**
 * 🏈 FOOTYSTATS SERVICE - CORE SERVICES LAYER
 *
 * Comprehensive service for all FootyStats API endpoints with:
 * - Phase 1 integration (DTOs, Cache, Constants)
 * - Proper error handling and logging
 * - Caching with appropriate TTL strategies
 * - Type safety with DTOs
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
exports.FootyStatsService = void 0;
const footy_1 = require("../apis/footy");
const CacheKeys_1 = require("../cache/CacheKeys");
const CacheManager_1 = require("../cache/CacheManager");
const footballConstants_1 = require("../utils/constants/footballConstants");
// API Key from environment variables
const API_KEY = process.env.FOOTBALL_API_KEY || (() => {
    throw new Error('FOOTBALL_API_KEY environment variable is required');
})();
class FootyStatsService {
    constructor() {
        // Initialize cache manager with football-optimized settings
        this.cacheManager = new CacheManager_1.CacheManager({
            defaultTtl: footballConstants_1.CACHE_TTL.DEFAULT,
            maxMemoryUsage: 50 * 1024 * 1024, // 50MB
            cleanupIntervalMs: 300000 // 5 minutes
        });
    }
    /**
     * 🌍 GET COUNTRIES
     * Retrieves all available countries
     */
    getCountries() {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = CacheKeys_1.cacheKeys.countries();
            try {
                console.log('🌍 Getting countries...');
                // Check cache first
                const cachedData = yield this.cacheManager.get(cacheKey);
                if (cachedData) {
                    console.log('✅ Countries retrieved from cache');
                    return {
                        success: true,
                        data: cachedData,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.COUNTRIES,
                            processingTime: Date.now() - startTime,
                            cached: true
                        }
                    };
                }
                // Fetch from API
                console.log('🔍 Fetching countries from API...');
                const response = yield footy_1.DefaultService.getCountries(API_KEY);
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return {
                        success: false,
                        error: 'No countries data returned from API',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.COUNTRIES,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                const countries = Array.isArray(response.data) ? response.data : [];
                console.log(`✅ Retrieved ${countries.length} countries from API`);
                // Cache the data
                yield this.cacheManager.set(cacheKey, countries, {
                    ttl: footballConstants_1.CACHE_TTL.COUNTRIES,
                    tags: ['countries', 'reference-data']
                });
                return {
                    success: true,
                    data: countries,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.COUNTRIES,
                        processingTime: Date.now() - startTime,
                        cached: false
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getCountries:', error);
                return {
                    success: false,
                    error: `Failed to get countries: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.COUNTRIES,
                        processingTime: Date.now() - startTime
                    }
                };
            }
        });
    }
    /**
     * 🏆 GET LEAGUES
     * Retrieves leagues with optional filtering
     */
    getLeagues(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = CacheKeys_1.cacheKeys.leagues(options === null || options === void 0 ? void 0 : options.chosenOnly, options === null || options === void 0 ? void 0 : options.country);
            try {
                console.log('🏆 Getting leagues...', options);
                // Check cache first
                const cachedData = yield this.cacheManager.get(cacheKey);
                if (cachedData) {
                    console.log('✅ Leagues retrieved from cache');
                    return {
                        success: true,
                        data: cachedData,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUES,
                            processingTime: Date.now() - startTime,
                            cached: true
                        }
                    };
                }
                // Validate country parameter if provided
                if ((options === null || options === void 0 ? void 0 : options.country) && (options.country <= 0 || !Number.isInteger(options.country))) {
                    return {
                        success: false,
                        error: 'Invalid country ID: must be a positive integer',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUES,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                // Fetch from API
                console.log('🔍 Fetching leagues from API...');
                const chosenOnlyParam = (options === null || options === void 0 ? void 0 : options.chosenOnly) ? "true" : undefined;
                const response = yield footy_1.DefaultService.getLeagues(API_KEY, chosenOnlyParam, options === null || options === void 0 ? void 0 : options.country);
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return {
                        success: false,
                        error: 'No leagues data returned from API',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUES,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                const leagues = Array.isArray(response.data) ? response.data : [];
                console.log(`✅ Retrieved ${leagues.length} leagues from API`);
                // Cache the data
                yield this.cacheManager.set(cacheKey, leagues, {
                    ttl: footballConstants_1.CACHE_TTL.LEAGUES,
                    tags: ['leagues', 'reference-data']
                });
                return {
                    success: true,
                    data: leagues,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUES,
                        processingTime: Date.now() - startTime,
                        cached: false
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getLeagues:', error);
                return {
                    success: false,
                    error: `Failed to get leagues: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUES,
                        processingTime: Date.now() - startTime
                    }
                };
            }
        });
    }
    /**
     * 📅 GET TODAY'S MATCHES
     * Retrieves matches for a specific date
     */
    getTodaysMatches(date, timezone, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const targetDate = date || new Date().toISOString().split('T')[0];
            const cacheKey = CacheKeys_1.cacheKeys.todaysMatches(targetDate, timezone, page);
            try {
                console.log(`📅 Getting matches for ${targetDate}...`);
                // Check cache first (short TTL for live data)
                const cachedData = yield this.cacheManager.get(cacheKey);
                if (cachedData) {
                    console.log('✅ Today\'s matches retrieved from cache');
                    return {
                        success: true,
                        data: cachedData,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.TODAYS_MATCHES,
                            processingTime: Date.now() - startTime,
                            cached: true
                        }
                    };
                }
                // Fetch from API
                console.log('🔍 Fetching today\'s matches from API...');
                const response = yield footy_1.DefaultService.getTodaysMatches(API_KEY, timezone, targetDate, page || 1);
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return {
                        success: false,
                        error: 'No matches data returned from API',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.TODAYS_MATCHES,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                const matches = Array.isArray(response.data) ? response.data : [];
                console.log(`✅ Retrieved ${matches.length} matches for ${targetDate}`);
                // Cache with short TTL for live data
                yield this.cacheManager.set(cacheKey, matches, {
                    ttl: footballConstants_1.CACHE_TTL.LIVE_MATCHES,
                    tags: ['matches', 'live-data', 'today']
                });
                return {
                    success: true,
                    data: matches,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.TODAYS_MATCHES,
                        processingTime: Date.now() - startTime,
                        cached: false
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getTodaysMatches:', error);
                return {
                    success: false,
                    error: `Failed to get today's matches: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.TODAYS_MATCHES,
                        processingTime: Date.now() - startTime
                    }
                };
            }
        });
    }
    /**
     * 🏟️ GET MATCH
     * Retrieves detailed match information
     */
    getMatch(matchId) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = CacheKeys_1.cacheKeys.match(matchId);
            try {
                console.log(`🏟️ Getting match details for ID: ${matchId}`);
                // Validate match ID
                if (!matchId || matchId <= 0 || !Number.isInteger(matchId)) {
                    return {
                        success: false,
                        error: 'Invalid match ID: must be a positive integer',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.MATCH,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                // Check cache first
                const cachedData = yield this.cacheManager.get(cacheKey);
                if (cachedData) {
                    console.log('✅ Match details retrieved from cache');
                    return {
                        success: true,
                        data: cachedData,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.MATCH,
                            processingTime: Date.now() - startTime,
                            cached: true
                        }
                    };
                }
                // Fetch from API
                console.log('🔍 Fetching match details from API...');
                const response = yield footy_1.DefaultService.getMatch(matchId, API_KEY);
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return {
                        success: false,
                        error: `Match with ID ${matchId} not found`,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.MATCH,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                // Handle API response - might be array or single object
                const matchData = Array.isArray(response.data) ? response.data[0] : response.data;
                const match = matchData;
                console.log(`✅ Retrieved match details for match ID: ${matchId}`);
                // Cache the data
                yield this.cacheManager.set(cacheKey, match, {
                    ttl: footballConstants_1.CACHE_TTL.MATCH_DETAILS,
                    tags: ['matches', 'match-details', `match-${matchId}`]
                });
                return {
                    success: true,
                    data: match,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.MATCH,
                        processingTime: Date.now() - startTime,
                        cached: false
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getMatch:', error);
                return {
                    success: false,
                    error: `Failed to get match details: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.MATCH,
                        processingTime: Date.now() - startTime
                    }
                };
            }
        });
    }
    /**
     * 🏆 GET LEAGUE SEASON
     * Retrieves league season information
     */
    getLeagueSeason(seasonId, maxTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = CacheKeys_1.cacheKeys.leagueSeason(seasonId, maxTime);
            try {
                console.log(`🏆 Getting league season for ID: ${seasonId}`);
                // Validate season ID
                if (!seasonId || seasonId <= 0 || !Number.isInteger(seasonId)) {
                    return {
                        success: false,
                        error: 'Invalid season ID: must be a positive integer',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_SEASON,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                // Check cache first
                const cachedData = yield this.cacheManager.get(cacheKey);
                if (cachedData) {
                    console.log('✅ League season retrieved from cache');
                    return {
                        success: true,
                        data: cachedData,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_SEASON,
                            processingTime: Date.now() - startTime,
                            cached: true
                        }
                    };
                }
                // Fetch from API
                console.log('🔍 Fetching league season from API...');
                const response = yield footy_1.DefaultService.getLeagueSeason(seasonId, API_KEY, maxTime);
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return {
                        success: false,
                        error: `League season with ID ${seasonId} not found`,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_SEASON,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                const leagueSeason = response.data;
                console.log(`✅ Retrieved league season for ID: ${seasonId}`);
                // Cache the data
                yield this.cacheManager.set(cacheKey, leagueSeason, {
                    ttl: footballConstants_1.CACHE_TTL.LEAGUE_SEASON,
                    tags: ['leagues', 'seasons', `season-${seasonId}`]
                });
                return {
                    success: true,
                    data: leagueSeason,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_SEASON,
                        processingTime: Date.now() - startTime,
                        cached: false
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getLeagueSeason:', error);
                return {
                    success: false,
                    error: `Failed to get league season: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_SEASON,
                        processingTime: Date.now() - startTime
                    }
                };
            }
        });
    }
    /**
     * 🏟️ GET LEAGUE MATCHES
     * Retrieves matches for a specific league season
     */
    getLeagueMatches(seasonId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = CacheKeys_1.cacheKeys.leagueMatches(seasonId, options === null || options === void 0 ? void 0 : options.page, options === null || options === void 0 ? void 0 : options.maxPerPage, options === null || options === void 0 ? void 0 : options.maxTime);
            try {
                console.log(`🏟️ Getting league matches for season ID: ${seasonId}`);
                // Validate season ID
                if (!seasonId || seasonId <= 0 || !Number.isInteger(seasonId)) {
                    return {
                        success: false,
                        error: 'Invalid season ID: must be a positive integer',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_MATCHES,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                // Check cache first
                const cachedData = yield this.cacheManager.get(cacheKey);
                if (cachedData) {
                    console.log('✅ League matches retrieved from cache');
                    return {
                        success: true,
                        data: cachedData,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_MATCHES,
                            processingTime: Date.now() - startTime,
                            cached: true
                        }
                    };
                }
                // Fetch from API
                console.log('🔍 Fetching league matches from API...');
                const response = yield footy_1.DefaultService.getLeagueMatches(seasonId, API_KEY, (options === null || options === void 0 ? void 0 : options.page) || 1, (options === null || options === void 0 ? void 0 : options.maxPerPage) || 300, options === null || options === void 0 ? void 0 : options.maxTime);
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return {
                        success: false,
                        error: `No matches found for season ID ${seasonId}`,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_MATCHES,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                const matches = Array.isArray(response.data) ? response.data : [];
                console.log(`✅ Retrieved ${matches.length} matches for season ${seasonId}`);
                // Cache the data
                yield this.cacheManager.set(cacheKey, matches, {
                    ttl: footballConstants_1.CACHE_TTL.LEAGUE_MATCHES,
                    tags: ['leagues', 'matches', `season-${seasonId}`]
                });
                return {
                    success: true,
                    data: matches,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_MATCHES,
                        processingTime: Date.now() - startTime,
                        cached: false
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getLeagueMatches:', error);
                return {
                    success: false,
                    error: `Failed to get league matches: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_MATCHES,
                        processingTime: Date.now() - startTime
                    }
                };
            }
        });
    }
    /**
     * 👥 GET LEAGUE TEAMS
     * Retrieves teams for a specific league season
     */
    getLeagueTeams(seasonId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = CacheKeys_1.cacheKeys.leagueTeams(seasonId, options === null || options === void 0 ? void 0 : options.page, options === null || options === void 0 ? void 0 : options.includeStats, options === null || options === void 0 ? void 0 : options.maxTime);
            try {
                console.log(`👥 Getting league teams for season ID: ${seasonId}`);
                // Validate season ID
                if (!seasonId || seasonId <= 0 || !Number.isInteger(seasonId)) {
                    return {
                        success: false,
                        error: 'Invalid season ID: must be a positive integer',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_TEAMS,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                // Check cache first
                const cachedData = yield this.cacheManager.get(cacheKey);
                if (cachedData) {
                    console.log('✅ League teams retrieved from cache');
                    return {
                        success: true,
                        data: cachedData,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_TEAMS,
                            processingTime: Date.now() - startTime,
                            cached: true
                        }
                    };
                }
                // Fetch from API
                console.log('🔍 Fetching league teams from API...');
                const includeStatsParam = (options === null || options === void 0 ? void 0 : options.includeStats) ? "stats" : undefined;
                const response = yield footy_1.DefaultService.getLeagueTeams(seasonId, API_KEY, (options === null || options === void 0 ? void 0 : options.page) || 1, includeStatsParam, options === null || options === void 0 ? void 0 : options.maxTime);
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return {
                        success: false,
                        error: `No teams found for season ID ${seasonId}`,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_TEAMS,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                const teams = Array.isArray(response.data) ? response.data : [];
                console.log(`✅ Retrieved ${teams.length} teams for season ${seasonId}`);
                // Cache the data
                yield this.cacheManager.set(cacheKey, teams, {
                    ttl: footballConstants_1.CACHE_TTL.LEAGUE_TEAMS,
                    tags: ['leagues', 'teams', `season-${seasonId}`]
                });
                return {
                    success: true,
                    data: teams,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_TEAMS,
                        processingTime: Date.now() - startTime,
                        cached: false
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getLeagueTeams:', error);
                return {
                    success: false,
                    error: `Failed to get league teams: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_TEAMS,
                        processingTime: Date.now() - startTime
                    }
                };
            }
        });
    }
    /**
     * ⚽ GET LEAGUE PLAYERS
     * Retrieves players for a specific league season
     */
    getLeaguePlayers(seasonId, includeStats) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = CacheKeys_1.cacheKeys.leaguePlayers(seasonId, includeStats);
            try {
                console.log(`⚽ Getting league players for season ID: ${seasonId}`);
                // Validate season ID
                if (!seasonId || seasonId <= 0 || !Number.isInteger(seasonId)) {
                    return {
                        success: false,
                        error: 'Invalid season ID: must be a positive integer',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_PLAYERS,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                // Check cache first
                const cachedData = yield this.cacheManager.get(cacheKey);
                if (cachedData) {
                    console.log('✅ League players retrieved from cache');
                    return {
                        success: true,
                        data: cachedData,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_PLAYERS,
                            processingTime: Date.now() - startTime,
                            cached: true
                        }
                    };
                }
                // Fetch from API
                console.log('🔍 Fetching league players from API...');
                const includeStatsParam = includeStats ? "stats" : undefined;
                const response = yield footy_1.DefaultService.getLeaguePlayers(seasonId, API_KEY, includeStatsParam);
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return {
                        success: false,
                        error: `No players found for season ID ${seasonId}`,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_PLAYERS,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                const players = Array.isArray(response.data) ? response.data : [];
                console.log(`✅ Retrieved ${players.length} players for season ${seasonId}`);
                // Cache the data
                yield this.cacheManager.set(cacheKey, players, {
                    ttl: footballConstants_1.CACHE_TTL.LEAGUE_PLAYERS,
                    tags: ['leagues', 'players', `season-${seasonId}`]
                });
                return {
                    success: true,
                    data: players,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_PLAYERS,
                        processingTime: Date.now() - startTime,
                        cached: false
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getLeaguePlayers:', error);
                return {
                    success: false,
                    error: `Failed to get league players: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_PLAYERS,
                        processingTime: Date.now() - startTime
                    }
                };
            }
        });
    }
    /**
     * 🏁 GET LEAGUE TABLES
     * Retrieves league tables for a specific season
     */
    getLeagueTables(seasonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = CacheKeys_1.cacheKeys.leagueTables(seasonId);
            try {
                console.log(`🏁 Getting league tables for season ID: ${seasonId}`);
                // Validate season ID
                if (!seasonId || seasonId <= 0 || !Number.isInteger(seasonId)) {
                    return {
                        success: false,
                        error: 'Invalid season ID: must be a positive integer',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_TABLES,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                // Check cache first
                const cachedData = yield this.cacheManager.get(cacheKey);
                if (cachedData) {
                    console.log('✅ League tables retrieved from cache');
                    return {
                        success: true,
                        data: cachedData,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_TABLES,
                            processingTime: Date.now() - startTime,
                            cached: true
                        }
                    };
                }
                // Fetch from API
                console.log('🔍 Fetching league tables from API...');
                const response = yield footy_1.DefaultService.getLeagueTables(seasonId, API_KEY);
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return {
                        success: false,
                        error: `No tables found for season ID ${seasonId}`,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_TABLES,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                const tables = Array.isArray(response.data) ? response.data : [];
                console.log(`✅ Retrieved ${tables.length} table entries for season ${seasonId}`);
                // Cache the data
                yield this.cacheManager.set(cacheKey, tables, {
                    ttl: footballConstants_1.CACHE_TTL.LEAGUE_TABLES,
                    tags: ['leagues', 'tables', `season-${seasonId}`]
                });
                return {
                    success: true,
                    data: tables,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_TABLES,
                        processingTime: Date.now() - startTime,
                        cached: false
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getLeagueTables:', error);
                return {
                    success: false,
                    error: `Failed to get league tables: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_TABLES,
                        processingTime: Date.now() - startTime
                    }
                };
            }
        });
    }
    /**
     * 👨‍⚖️ GET LEAGUE REFEREES
     * Retrieves referees for a specific league season
     */
    getLeagueReferees(seasonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = CacheKeys_1.cacheKeys.leagueReferees(seasonId);
            try {
                console.log(`👨‍⚖️ Getting league referees for season ID: ${seasonId}`);
                // Validate season ID
                if (!seasonId || seasonId <= 0 || !Number.isInteger(seasonId)) {
                    return {
                        success: false,
                        error: 'Invalid season ID: must be a positive integer',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_REFEREES,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                // Check cache first
                const cachedData = yield this.cacheManager.get(cacheKey);
                if (cachedData) {
                    console.log('✅ League referees retrieved from cache');
                    return {
                        success: true,
                        data: cachedData,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_REFEREES,
                            processingTime: Date.now() - startTime,
                            cached: true
                        }
                    };
                }
                // Fetch from API
                console.log('🔍 Fetching league referees from API...');
                const response = yield footy_1.DefaultService.getLeagueReferees(seasonId, API_KEY);
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return {
                        success: false,
                        error: `No referees found for season ID ${seasonId}`,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_REFEREES,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                const referees = Array.isArray(response.data) ? response.data : [];
                console.log(`✅ Retrieved ${referees.length} referees for season ${seasonId}`);
                // Cache the data
                yield this.cacheManager.set(cacheKey, referees, {
                    ttl: footballConstants_1.CACHE_TTL.LEAGUE_REFEREES,
                    tags: ['leagues', 'referees', `season-${seasonId}`]
                });
                return {
                    success: true,
                    data: referees,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_REFEREES,
                        processingTime: Date.now() - startTime,
                        cached: false
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getLeagueReferees:', error);
                return {
                    success: false,
                    error: `Failed to get league referees: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.LEAGUE_REFEREES,
                        processingTime: Date.now() - startTime
                    }
                };
            }
        });
    }
    /**
     * 🏟️ GET TEAM
     * Retrieves detailed team information
     */
    getTeam(teamId, includeStats) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = CacheKeys_1.cacheKeys.team(teamId, includeStats);
            try {
                console.log(`🏟️ Getting team details for ID: ${teamId}`);
                // Validate team ID
                if (!teamId || teamId <= 0 || !Number.isInteger(teamId)) {
                    return {
                        success: false,
                        error: 'Invalid team ID: must be a positive integer',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.TEAM,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                // Check cache first
                const cachedData = yield this.cacheManager.get(cacheKey);
                if (cachedData) {
                    console.log('✅ Team details retrieved from cache');
                    return {
                        success: true,
                        data: cachedData,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.TEAM,
                            processingTime: Date.now() - startTime,
                            cached: true
                        }
                    };
                }
                // Fetch from API
                console.log('🔍 Fetching team details from API...');
                const includeStatsParam = includeStats ? "stats" : undefined;
                const response = yield footy_1.DefaultService.getTeam(teamId, API_KEY, includeStatsParam);
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return {
                        success: false,
                        error: `Team with ID ${teamId} not found`,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.TEAM,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                // Handle API response - might be array or single object
                const teamData = Array.isArray(response.data) ? response.data[0] : response.data;
                const team = teamData;
                console.log(`✅ Retrieved team details for ID: ${teamId}`);
                // Cache the data
                yield this.cacheManager.set(cacheKey, team, {
                    ttl: footballConstants_1.CACHE_TTL.TEAM_DATA,
                    tags: ['teams', 'team-details', `team-${teamId}`]
                });
                return {
                    success: true,
                    data: team,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.TEAM,
                        processingTime: Date.now() - startTime,
                        cached: false
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getTeam:', error);
                return {
                    success: false,
                    error: `Failed to get team details: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.TEAM,
                        processingTime: Date.now() - startTime
                    }
                };
            }
        });
    }
    /**
     * 📊 GET TEAM LAST X STATS
     * Retrieves team's recent match statistics
     */
    getTeamLastXStats(teamId, matchCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = CacheKeys_1.cacheKeys.teamLastXStats(teamId, matchCount);
            try {
                console.log(`📊 Getting team last X stats for ID: ${teamId}, matches: ${matchCount || 'default'}`);
                // Validate team ID
                if (!teamId || teamId <= 0 || !Number.isInteger(teamId)) {
                    return {
                        success: false,
                        error: 'Invalid team ID: must be a positive integer',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.TEAM_LAST_X_STATS,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                // Validate match count if provided
                if (matchCount && (matchCount <= 0 || !Number.isInteger(matchCount))) {
                    return {
                        success: false,
                        error: 'Invalid match count: must be a positive integer',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.TEAM_LAST_X_STATS,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                // Check cache first
                const cachedData = yield this.cacheManager.get(cacheKey);
                if (cachedData) {
                    console.log('✅ Team last X stats retrieved from cache');
                    return {
                        success: true,
                        data: cachedData,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.TEAM_LAST_X_STATS,
                            processingTime: Date.now() - startTime,
                            cached: true
                        }
                    };
                }
                // Fetch from API
                console.log('🔍 Fetching team last X stats from API...');
                const response = yield footy_1.DefaultService.getTeamLastXStats(teamId, API_KEY);
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return {
                        success: false,
                        error: `No stats found for team ID ${teamId}`,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.TEAM_LAST_X_STATS,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                const teamStats = response.data;
                console.log(`✅ Retrieved team last X stats for ID: ${teamId}`);
                // Cache the data
                yield this.cacheManager.set(cacheKey, teamStats, {
                    ttl: footballConstants_1.CACHE_TTL.TEAM_STATS,
                    tags: ['teams', 'team-stats', `team-${teamId}`]
                });
                return {
                    success: true,
                    data: teamStats,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.TEAM_LAST_X_STATS,
                        processingTime: Date.now() - startTime,
                        cached: false
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getTeamLastXStats:', error);
                return {
                    success: false,
                    error: `Failed to get team last X stats: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.TEAM_LAST_X_STATS,
                        processingTime: Date.now() - startTime
                    }
                };
            }
        });
    }
    /**
     * ⚽ GET PLAYER STATS
     * Retrieves individual player statistics
     */
    getPlayerStats(playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = CacheKeys_1.cacheKeys.playerStats(playerId);
            try {
                console.log(`⚽ Getting player stats for ID: ${playerId}`);
                // Validate player ID
                if (!playerId || playerId <= 0 || !Number.isInteger(playerId)) {
                    return {
                        success: false,
                        error: 'Invalid player ID: must be a positive integer',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.PLAYER_STATS,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                // Check cache first
                const cachedData = yield this.cacheManager.get(cacheKey);
                if (cachedData) {
                    console.log('✅ Player stats retrieved from cache');
                    return {
                        success: true,
                        data: cachedData,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.PLAYER_STATS,
                            processingTime: Date.now() - startTime,
                            cached: true
                        }
                    };
                }
                // Fetch from API
                console.log('🔍 Fetching player stats from API...');
                const response = yield footy_1.DefaultService.getPlayerStats(playerId, API_KEY);
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return {
                        success: false,
                        error: `Player with ID ${playerId} not found`,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.PLAYER_STATS,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                const playerStats = response.data;
                console.log(`✅ Retrieved player stats for ID: ${playerId}`);
                // Cache the data
                yield this.cacheManager.set(cacheKey, playerStats, {
                    ttl: footballConstants_1.CACHE_TTL.PLAYER_STATS,
                    tags: ['players', 'player-stats', `player-${playerId}`]
                });
                return {
                    success: true,
                    data: playerStats,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.PLAYER_STATS,
                        processingTime: Date.now() - startTime,
                        cached: false
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getPlayerStats:', error);
                return {
                    success: false,
                    error: `Failed to get player stats: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.PLAYER_STATS,
                        processingTime: Date.now() - startTime
                    }
                };
            }
        });
    }
    /**
     * 👨‍⚖️ GET REFEREE STATS
     * Retrieves individual referee statistics
     */
    getRefereeStats(refereeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = CacheKeys_1.cacheKeys.refereeStats(refereeId);
            try {
                console.log(`👨‍⚖️ Getting referee stats for ID: ${refereeId}`);
                // Validate referee ID
                if (!refereeId || refereeId <= 0 || !Number.isInteger(refereeId)) {
                    return {
                        success: false,
                        error: 'Invalid referee ID: must be a positive integer',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.REFEREE_STATS,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                // Check cache first
                const cachedData = yield this.cacheManager.get(cacheKey);
                if (cachedData) {
                    console.log('✅ Referee stats retrieved from cache');
                    return {
                        success: true,
                        data: cachedData,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.REFEREE_STATS,
                            processingTime: Date.now() - startTime,
                            cached: true
                        }
                    };
                }
                // Fetch from API
                console.log('🔍 Fetching referee stats from API...');
                const response = yield footy_1.DefaultService.getRefereeStats(refereeId, API_KEY);
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return {
                        success: false,
                        error: `Referee with ID ${refereeId} not found`,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.REFEREE_STATS,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                const refereeStats = response.data;
                console.log(`✅ Retrieved referee stats for ID: ${refereeId}`);
                // Cache the data
                yield this.cacheManager.set(cacheKey, refereeStats, {
                    ttl: footballConstants_1.CACHE_TTL.REFEREE_STATS,
                    tags: ['referees', 'referee-stats', `referee-${refereeId}`]
                });
                return {
                    success: true,
                    data: refereeStats,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.REFEREE_STATS,
                        processingTime: Date.now() - startTime,
                        cached: false
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getRefereeStats:', error);
                return {
                    success: false,
                    error: `Failed to get referee stats: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.REFEREE_STATS,
                        processingTime: Date.now() - startTime
                    }
                };
            }
        });
    }
    /**
     * 🎯 GET BTTS STATS
     * Retrieves Both Teams To Score statistics
     */
    getBttsStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = CacheKeys_1.cacheKeys.bttsStats();
            try {
                console.log('🎯 Getting BTTS (Both Teams To Score) stats...');
                // Check cache first
                const cachedData = yield this.cacheManager.get(cacheKey);
                if (cachedData) {
                    console.log('✅ BTTS stats retrieved from cache');
                    return {
                        success: true,
                        data: cachedData,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.BTTS_STATS,
                            processingTime: Date.now() - startTime,
                            cached: true
                        }
                    };
                }
                // Fetch from API
                console.log('🔍 Fetching BTTS stats from API...');
                const response = yield footy_1.DefaultService.getBttsStats(API_KEY);
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return {
                        success: false,
                        error: 'No BTTS stats data returned from API',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.BTTS_STATS,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                const bttsStats = response.data;
                console.log('✅ Retrieved BTTS stats from API');
                // Cache the data with shorter TTL for analytics
                yield this.cacheManager.set(cacheKey, bttsStats, {
                    ttl: footballConstants_1.CACHE_TTL.BTTS_STATS,
                    tags: ['analytics', 'btts', 'statistics']
                });
                return {
                    success: true,
                    data: bttsStats,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.BTTS_STATS,
                        processingTime: Date.now() - startTime,
                        cached: false
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getBttsStats:', error);
                return {
                    success: false,
                    error: `Failed to get BTTS stats: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.BTTS_STATS,
                        processingTime: Date.now() - startTime
                    }
                };
            }
        });
    }
    /**
     * 📈 GET OVER 2.5 STATS
     * Retrieves Over 2.5 goals statistics
     */
    getOver25Stats() {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = CacheKeys_1.cacheKeys.over25Stats();
            try {
                console.log('📈 Getting Over 2.5 goals stats...');
                // Check cache first
                const cachedData = yield this.cacheManager.get(cacheKey);
                if (cachedData) {
                    console.log('✅ Over 2.5 stats retrieved from cache');
                    return {
                        success: true,
                        data: cachedData,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.OVER25_STATS,
                            processingTime: Date.now() - startTime,
                            cached: true
                        }
                    };
                }
                // Fetch from API
                console.log('🔍 Fetching Over 2.5 stats from API...');
                const response = yield footy_1.DefaultService.getOver25Stats(API_KEY);
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return {
                        success: false,
                        error: 'No Over 2.5 stats data returned from API',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            source: footballConstants_1.FOOTY_ENDPOINTS.OVER25_STATS,
                            processingTime: Date.now() - startTime
                        }
                    };
                }
                const over25Stats = response.data;
                console.log('✅ Retrieved Over 2.5 stats from API');
                // Cache the data with shorter TTL for analytics
                yield this.cacheManager.set(cacheKey, over25Stats, {
                    ttl: footballConstants_1.CACHE_TTL.OVER25_STATS,
                    tags: ['analytics', 'over25', 'statistics']
                });
                return {
                    success: true,
                    data: over25Stats,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.OVER25_STATS,
                        processingTime: Date.now() - startTime,
                        cached: false
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getOver25Stats:', error);
                return {
                    success: false,
                    error: `Failed to get Over 2.5 stats: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: footballConstants_1.FOOTY_ENDPOINTS.OVER25_STATS,
                        processingTime: Date.now() - startTime
                    }
                };
            }
        });
    }
    /**
     * 🧹 CLEANUP
     * Shutdown the service and cleanup resources
     */
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('🧹 Shutting down FootyStatsService...');
            this.cacheManager.shutdown();
            console.log('✅ FootyStatsService shutdown complete');
        });
    }
}
exports.FootyStatsService = FootyStatsService;
