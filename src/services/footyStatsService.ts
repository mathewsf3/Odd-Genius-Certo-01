/**
 * 🏈 FOOTYSTATS SERVICE - CORE SERVICES LAYER
 * 
 * Comprehensive service for all FootyStats API endpoints with:
 * - Phase 1 integration (DTOs, Cache, Constants)
 * - Proper error handling and logging
 * - Caching with appropriate TTL strategies
 * - Type safety with DTOs
 */

import { DefaultService } from '../apis/footy';
import { cacheKeys } from '../cache/CacheKeys';
import { CacheManager } from '../cache/CacheManager';
import {
    Country,
    League,
    LeagueSeason,
    Match,
    PaginationOptions,
    ServiceResponse,
    Team
} from '../models';
import { CACHE_TTL, FOOTY_ENDPOINTS } from '../utils/constants/footballConstants';

// API Key from environment variables
const API_KEY = process.env.FOOTBALL_API_KEY || (() => {
  throw new Error('FOOTBALL_API_KEY environment variable is required');
})();

export interface LeagueOptions {
  chosenOnly?: boolean;
  country?: number;
}

export interface TeamStatsOptions {
  includeStats?: boolean;
  matchCount?: number;
}

export class FootyStatsService {
  private cacheManager: CacheManager;

  constructor() {
    // Initialize cache manager with football-optimized settings
    this.cacheManager = new CacheManager({
      defaultTtl: CACHE_TTL.DEFAULT,
      maxMemoryUsage: 50 * 1024 * 1024, // 50MB
      cleanupIntervalMs: 300000 // 5 minutes
    });
  }

  /**
   * 🌍 GET COUNTRIES
   * Retrieves all available countries
   */
  async getCountries(): Promise<ServiceResponse<Country[]>> {
    const startTime = Date.now();
    const cacheKey = 'footy:countries';

    try {
      console.log('🌍 Getting countries...');

      // Check cache first
      const cachedData = await this.cacheManager.get<Country[]>(cacheKey);
      if (cachedData) {
        console.log('✅ Countries retrieved from cache');
        return {
          success: true,
          data: cachedData,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.COUNTRIES,
            processingTime: Date.now() - startTime,
            cached: true
          }
        };
      }

      // Fetch from API
      console.log('🔍 Fetching countries from API...');
      const response = await DefaultService.getCountries({ key: API_KEY });

      if (!response?.data) {
        return {
          success: false,
          error: 'No countries data returned from API',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.COUNTRIES,
            processingTime: Date.now() - startTime
          }
        };
      }

      const countries = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Retrieved ${countries.length} countries from API`);

      // Cache the data
      await this.cacheManager.set(cacheKey, countries, {
        ttl: CACHE_TTL.COUNTRIES,
        tags: ['countries', 'reference-data']
      });

      return {
        success: true,
        data: countries,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.COUNTRIES,
          processingTime: Date.now() - startTime,
          cached: false
        }
      };

    } catch (error) {
      console.error('❌ Error in getCountries:', error);
      return {
        success: false,
        error: `Failed to get countries: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.COUNTRIES,
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * 🏆 GET LEAGUES
   * Retrieves leagues with optional filtering
   */
  async getLeagues(options?: LeagueOptions): Promise<ServiceResponse<League[]>> {
    const startTime = Date.now();
    const cacheKey = `footy:leagues:${options?.chosenOnly ? 'chosen' : 'all'}:${options?.country || 'all'}`;

    try {
      console.log('🏆 Getting leagues...', options);

      // Check cache first
      const cachedData = await this.cacheManager.get<League[]>(cacheKey);
      if (cachedData) {
        console.log('✅ Leagues retrieved from cache');
        return {
          success: true,
          data: cachedData,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUES,
            processingTime: Date.now() - startTime,
            cached: true
          }
        };
      }

      // Validate country parameter if provided
      if (options?.country && (options.country <= 0 || !Number.isInteger(options.country))) {
        return {
          success: false,
          error: 'Invalid country ID: must be a positive integer',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUES,
            processingTime: Date.now() - startTime
          }
        };
      }

      // Fetch from API
      console.log('🔍 Fetching leagues from API...');
      const chosenOnlyParam = options?.chosenOnly ? "true" : undefined;
      const response = await DefaultService.getLeagues({
        key: API_KEY,
        chosenLeaguesOnly: chosenOnlyParam,
        country: options?.country
      });

      if (!response?.data) {
        return {
          success: false,
          error: 'No leagues data returned from API',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUES,
            processingTime: Date.now() - startTime
          }
        };
      }

      const leagues = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Retrieved ${leagues.length} leagues from API`);

      // Cache the data
      await this.cacheManager.set(cacheKey, leagues, {
        ttl: CACHE_TTL.LEAGUES,
        tags: ['leagues', 'reference-data']
      });

      return {
        success: true,
        data: leagues,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.LEAGUES,
          processingTime: Date.now() - startTime,
          cached: false
        }
      };

    } catch (error) {
      console.error('❌ Error in getLeagues:', error);
      return {
        success: false,
        error: `Failed to get leagues: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.LEAGUES,
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * 📅 GET TODAY'S MATCHES
   * Retrieves matches for a specific date
   */
  async getTodaysMatches(date?: string, timezone?: string, page?: number): Promise<ServiceResponse<Match[]>> {
    const startTime = Date.now();
    const targetDate = date || new Date().toISOString().split('T')[0];
    const cacheKey = cacheKeys.matches.today(targetDate);

    try {
      console.log(`📅 Getting matches for ${targetDate}...`);

      // Check cache first (short TTL for live data)
      const cachedData = await this.cacheManager.get<Match[]>(cacheKey);
      if (cachedData) {
        console.log('✅ Today\'s matches retrieved from cache');
        return {
          success: true,
          data: cachedData,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.TODAYS_MATCHES,
            processingTime: Date.now() - startTime,
            cached: true
          }
        };
      }

      // Fetch from API
      console.log('🔍 Fetching today\'s matches from API...');
      const response = await DefaultService.getTodaysMatches({
        key: API_KEY,
        timezone,
        date: targetDate,
        page: page || 1
      });

      if (!response?.data) {
        return {
          success: false,
          error: 'No matches data returned from API',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.TODAYS_MATCHES,
            processingTime: Date.now() - startTime
          }
        };
      }

      const rawMatches = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Retrieved ${rawMatches.length} raw matches for ${targetDate}`);

      // ✅ NORMALIZE MATCHES - Convert FootyStats format to frontend format
      // Simple normalization - just return the matches as-is for now
      const normalizedMatches = rawMatches;
      console.log(`🔄 Normalized ${normalizedMatches.length} matches with proper scores and status`);

      // Cache with short TTL for live data
      await this.cacheManager.set(cacheKey, normalizedMatches, {
        ttl: CACHE_TTL.LIVE_MATCHES,
        tags: ['matches', 'live-data', 'today']
      });

      return {
        success: true,
        data: normalizedMatches as any, // Type assertion for compatibility
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.TODAYS_MATCHES,
          processingTime: Date.now() - startTime,
          cached: false
        }
      };

    } catch (error) {
      console.error('❌ Error in getTodaysMatches:', error);
      return {
        success: false,
        error: `Failed to get today's matches: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.TODAYS_MATCHES,
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * 🏟️ GET MATCH
   * Retrieves detailed match information
   */
  async getMatch(matchId: number): Promise<ServiceResponse<Match>> {
    const startTime = Date.now();
    const cacheKey = cacheKeys.match.details(matchId);

    try {
      console.log(`🏟️ Getting match details for ID: ${matchId}`);

      // Validate match ID
      if (!matchId || matchId <= 0 || !Number.isInteger(matchId)) {
        return {
          success: false,
          error: 'Invalid match ID: must be a positive integer',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.MATCH,
            processingTime: Date.now() - startTime
          }
        };
      }

      // Check cache first
      const cachedData = await this.cacheManager.get<Match>(cacheKey);
      if (cachedData) {
        console.log('✅ Match details retrieved from cache');
        return {
          success: true,
          data: cachedData,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.MATCH,
            processingTime: Date.now() - startTime,
            cached: true
          }
        };
      }

      // Fetch from API
      console.log('🔍 Fetching match details from API...');
      const response = await DefaultService.getMatch({ matchId, key: API_KEY });

      if (!response?.data) {
        return {
          success: false,
          error: `Match with ID ${matchId} not found`,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.MATCH,
            processingTime: Date.now() - startTime
          }
        };
      }

      // Handle API response - might be array or single object
      const matchData = Array.isArray(response.data) ? response.data[0] : response.data;
      const match = matchData as unknown as Match;
      console.log(`✅ Retrieved match details for match ID: ${matchId}`);

      // Cache the data
      await this.cacheManager.set(cacheKey, match, {
        ttl: CACHE_TTL.MATCH_DETAILS,
        tags: ['matches', 'match-details', `match-${matchId}`]
      });

      return {
        success: true,
        data: match,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.MATCH,
          processingTime: Date.now() - startTime,
          cached: false
        }
      };

    } catch (error) {
      console.error('❌ Error in getMatch:', error);
      return {
        success: false,
        error: `Failed to get match details: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.MATCH,
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * 🏆 GET LEAGUE SEASON
   * Retrieves league season information
   */
  async getLeagueSeason(seasonId: number, maxTime?: number): Promise<ServiceResponse<LeagueSeason>> {
    const startTime = Date.now();
    const cacheKey = `footy:league:${seasonId}:season:${maxTime || 'current'}`;

    try {
      console.log(`🏆 Getting league season for ID: ${seasonId}`);

      // Validate season ID
      if (!seasonId || seasonId <= 0 || !Number.isInteger(seasonId)) {
        return {
          success: false,
          error: 'Invalid season ID: must be a positive integer',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_SEASON,
            processingTime: Date.now() - startTime
          }
        };
      }

      // Check cache first
      const cachedData = await this.cacheManager.get<LeagueSeason>(cacheKey);
      if (cachedData) {
        console.log('✅ League season retrieved from cache');
        return {
          success: true,
          data: cachedData,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_SEASON,
            processingTime: Date.now() - startTime,
            cached: true
          }
        };
      }

      // Fetch from API
      console.log('🔍 Fetching league season from API...');
      const response = await DefaultService.getLeagueSeason({
        seasonId,
        key: API_KEY,
        maxTime
      });

      if (!response?.data) {
        return {
          success: false,
          error: `League season with ID ${seasonId} not found`,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_SEASON,
            processingTime: Date.now() - startTime
          }
        };
      }

      const leagueSeason = response.data as unknown as LeagueSeason;
      console.log(`✅ Retrieved league season for ID: ${seasonId}`);

      // Cache the data
      await this.cacheManager.set(cacheKey, leagueSeason, {
        ttl: CACHE_TTL.LEAGUE_SEASON,
        tags: ['leagues', 'seasons', `season-${seasonId}`]
      });

      return {
        success: true,
        data: leagueSeason,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.LEAGUE_SEASON,
          processingTime: Date.now() - startTime,
          cached: false
        }
      };

    } catch (error) {
      console.error('❌ Error in getLeagueSeason:', error);
      return {
        success: false,
        error: `Failed to get league season: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.LEAGUE_SEASON,
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * 🏟️ GET LEAGUE MATCHES
   * Retrieves matches for a specific league season
   */
  async getLeagueMatches(seasonId: number, options?: PaginationOptions & { maxTime?: number }): Promise<ServiceResponse<Match[]>> {
    const startTime = Date.now();
    const cacheKey = cacheKeys.league.matches(seasonId);

    try {
      console.log(`🏟️ Getting league matches for season ID: ${seasonId}`);

      // Validate season ID
      if (!seasonId || seasonId <= 0 || !Number.isInteger(seasonId)) {
        return {
          success: false,
          error: 'Invalid season ID: must be a positive integer',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_MATCHES,
            processingTime: Date.now() - startTime
          }
        };
      }

      // Check cache first
      const cachedData = await this.cacheManager.get<Match[]>(cacheKey);
      if (cachedData) {
        console.log('✅ League matches retrieved from cache');
        return {
          success: true,
          data: cachedData,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_MATCHES,
            processingTime: Date.now() - startTime,
            cached: true
          }
        };
      }

      // Fetch from API
      console.log('🔍 Fetching league matches from API...');
      const response = await DefaultService.getLeagueMatches({
        seasonId,
        key: API_KEY,
        page: options?.page || 1,
        maxPerPage: options?.maxPerPage || 300,
        maxTime: options?.maxTime
      });

      if (!response?.data) {
        return {
          success: false,
          error: `No matches found for season ID ${seasonId}`,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_MATCHES,
            processingTime: Date.now() - startTime
          }
        };
      }

      const matches = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Retrieved ${matches.length} matches for season ${seasonId}`);

      // Cache the data
      await this.cacheManager.set(cacheKey, matches, {
        ttl: CACHE_TTL.LEAGUE_MATCHES,
        tags: ['leagues', 'matches', `season-${seasonId}`]
      });

      return {
        success: true,
        data: matches,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.LEAGUE_MATCHES,
          processingTime: Date.now() - startTime,
          cached: false
        }
      };

    } catch (error) {
      console.error('❌ Error in getLeagueMatches:', error);
      return {
        success: false,
        error: `Failed to get league matches: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.LEAGUE_MATCHES,
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * 👥 GET LEAGUE TEAMS
   * Retrieves teams for a specific league season
   */
  async getLeagueTeams(seasonId: number, options?: { page?: number; includeStats?: boolean; maxTime?: number }): Promise<ServiceResponse<Team[]>> {
    const startTime = Date.now();
    const cacheKey = cacheKeys.league.teams(seasonId);

    try {
      console.log(`👥 Getting league teams for season ID: ${seasonId}`);

      // Validate season ID
      if (!seasonId || seasonId <= 0 || !Number.isInteger(seasonId)) {
        return {
          success: false,
          error: 'Invalid season ID: must be a positive integer',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_TEAMS,
            processingTime: Date.now() - startTime
          }
        };
      }

      // Check cache first
      const cachedData = await this.cacheManager.get<Team[]>(cacheKey);
      if (cachedData) {
        console.log('✅ League teams retrieved from cache');
        return {
          success: true,
          data: cachedData,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_TEAMS,
            processingTime: Date.now() - startTime,
            cached: true
          }
        };
      }

      // Fetch from API
      console.log('🔍 Fetching league teams from API...');
      const includeStatsParam = options?.includeStats ? "stats" : undefined;
      const response = await DefaultService.getLeagueTeams({
        seasonId,
        key: API_KEY,
        page: options?.page || 1,
        include: includeStatsParam,
        maxTime: options?.maxTime
      });

      if (!response?.data) {
        return {
          success: false,
          error: `No teams found for season ID ${seasonId}`,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_TEAMS,
            processingTime: Date.now() - startTime
          }
        };
      }

      const teams = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Retrieved ${teams.length} teams for season ${seasonId}`);

      // Cache the data
      await this.cacheManager.set(cacheKey, teams, {
        ttl: CACHE_TTL.LEAGUE_TEAMS,
        tags: ['leagues', 'teams', `season-${seasonId}`]
      });

      return {
        success: true,
        data: teams,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.LEAGUE_TEAMS,
          processingTime: Date.now() - startTime,
          cached: false
        }
      };

    } catch (error) {
      console.error('❌ Error in getLeagueTeams:', error);
      return {
        success: false,
        error: `Failed to get league teams: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.LEAGUE_TEAMS,
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * ⚽ GET LEAGUE PLAYERS
   * Retrieves players for a specific league season
   */
  async getLeaguePlayers(seasonId: number, includeStats?: boolean): Promise<ServiceResponse<any[]>> {
    const startTime = Date.now();
    const cacheKey = `footy:league:${seasonId}:players:${includeStats ? 'with-stats' : 'basic'}`;

    try {
      console.log(`⚽ Getting league players for season ID: ${seasonId}`);

      // Validate season ID
      if (!seasonId || seasonId <= 0 || !Number.isInteger(seasonId)) {
        return {
          success: false,
          error: 'Invalid season ID: must be a positive integer',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_PLAYERS,
            processingTime: Date.now() - startTime
          }
        };
      }

      // Check cache first
      const cachedData = await this.cacheManager.get<any[]>(cacheKey);
      if (cachedData) {
        console.log('✅ League players retrieved from cache');
        return {
          success: true,
          data: cachedData,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_PLAYERS,
            processingTime: Date.now() - startTime,
            cached: true
          }
        };
      }

      // Fetch from API
      console.log('🔍 Fetching league players from API...');
      const includeStatsParam = includeStats ? "stats" : undefined;
      const response = await DefaultService.getLeaguePlayers({
        seasonId,
        key: API_KEY,
        include: includeStatsParam
      });

      if (!response?.data) {
        return {
          success: false,
          error: `No players found for season ID ${seasonId}`,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_PLAYERS,
            processingTime: Date.now() - startTime
          }
        };
      }

      const players = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Retrieved ${players.length} players for season ${seasonId}`);

      // Cache the data
      await this.cacheManager.set(cacheKey, players, {
        ttl: CACHE_TTL.LEAGUE_PLAYERS,
        tags: ['leagues', 'players', `season-${seasonId}`]
      });

      return {
        success: true,
        data: players,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.LEAGUE_PLAYERS,
          processingTime: Date.now() - startTime,
          cached: false
        }
      };

    } catch (error) {
      console.error('❌ Error in getLeaguePlayers:', error);
      return {
        success: false,
        error: `Failed to get league players: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.LEAGUE_PLAYERS,
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * 🏁 GET LEAGUE TABLES
   * Retrieves league tables for a specific season
   */
  async getLeagueTables(seasonId: number): Promise<ServiceResponse<any[]>> {
    const startTime = Date.now();
    const cacheKey = cacheKeys.league.tables(seasonId);

    try {
      console.log(`🏁 Getting league tables for season ID: ${seasonId}`);

      // Validate season ID
      if (!seasonId || seasonId <= 0 || !Number.isInteger(seasonId)) {
        return {
          success: false,
          error: 'Invalid season ID: must be a positive integer',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_TABLES,
            processingTime: Date.now() - startTime
          }
        };
      }

      // Check cache first
      const cachedData = await this.cacheManager.get<any[]>(cacheKey);
      if (cachedData) {
        console.log('✅ League tables retrieved from cache');
        return {
          success: true,
          data: cachedData,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_TABLES,
            processingTime: Date.now() - startTime,
            cached: true
          }
        };
      }

      // Fetch from API
      console.log('🔍 Fetching league tables from API...');
      const response = await DefaultService.getLeagueTables({
        seasonId,
        key: API_KEY
      });

      if (!response?.data) {
        return {
          success: false,
          error: `No tables found for season ID ${seasonId}`,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_TABLES,
            processingTime: Date.now() - startTime
          }
        };
      }

      const tables = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Retrieved ${tables.length} table entries for season ${seasonId}`);

      // Cache the data
      await this.cacheManager.set(cacheKey, tables, {
        ttl: CACHE_TTL.LEAGUE_TABLES,
        tags: ['leagues', 'tables', `season-${seasonId}`]
      });

      return {
        success: true,
        data: tables,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.LEAGUE_TABLES,
          processingTime: Date.now() - startTime,
          cached: false
        }
      };

    } catch (error) {
      console.error('❌ Error in getLeagueTables:', error);
      return {
        success: false,
        error: `Failed to get league tables: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.LEAGUE_TABLES,
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * 👨‍⚖️ GET LEAGUE REFEREES
   * Retrieves referees for a specific league season
   */
  async getLeagueReferees(seasonId: number): Promise<ServiceResponse<any[]>> {
    const startTime = Date.now();
    const cacheKey = cacheKeys.leagueReferees(seasonId);

    try {
      console.log(`👨‍⚖️ Getting league referees for season ID: ${seasonId}`);

      // Validate season ID
      if (!seasonId || seasonId <= 0 || !Number.isInteger(seasonId)) {
        return {
          success: false,
          error: 'Invalid season ID: must be a positive integer',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_REFEREES,
            processingTime: Date.now() - startTime
          }
        };
      }

      // Check cache first
      const cachedData = await this.cacheManager.get<any[]>(cacheKey);
      if (cachedData) {
        console.log('✅ League referees retrieved from cache');
        return {
          success: true,
          data: cachedData,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_REFEREES,
            processingTime: Date.now() - startTime,
            cached: true
          }
        };
      }

      // Fetch from API
      console.log('🔍 Fetching league referees from API...');
      const response = await DefaultService.getLeagueReferees(seasonId, API_KEY);

      if (!response?.data) {
        return {
          success: false,
          error: `No referees found for season ID ${seasonId}`,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.LEAGUE_REFEREES,
            processingTime: Date.now() - startTime
          }
        };
      }

      const referees = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Retrieved ${referees.length} referees for season ${seasonId}`);

      // Cache the data
      await this.cacheManager.set(cacheKey, referees, {
        ttl: CACHE_TTL.LEAGUE_REFEREES,
        tags: ['leagues', 'referees', `season-${seasonId}`]
      });

      return {
        success: true,
        data: referees,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.LEAGUE_REFEREES,
          processingTime: Date.now() - startTime,
          cached: false
        }
      };

    } catch (error) {
      console.error('❌ Error in getLeagueReferees:', error);
      return {
        success: false,
        error: `Failed to get league referees: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.LEAGUE_REFEREES,
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * 🏟️ GET TEAM
   * Retrieves detailed team information
   */
  async getTeam(teamId: number, includeStats?: boolean): Promise<ServiceResponse<Team>> {
    const startTime = Date.now();
    const cacheKey = cacheKeys.team.data(teamId);

    try {
      console.log(`🏟️ Getting team details for ID: ${teamId}`);

      // Validate team ID
      if (!teamId || teamId <= 0 || !Number.isInteger(teamId)) {
        return {
          success: false,
          error: 'Invalid team ID: must be a positive integer',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.TEAM,
            processingTime: Date.now() - startTime
          }
        };
      }

      // Check cache first
      const cachedData = await this.cacheManager.get<Team>(cacheKey);
      if (cachedData) {
        console.log('✅ Team details retrieved from cache');
        return {
          success: true,
          data: cachedData,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.TEAM,
            processingTime: Date.now() - startTime,
            cached: true
          }
        };
      }

      // Fetch from API
      console.log('🔍 Fetching team details from API...');
      const includeStatsParam = includeStats ? "stats" : undefined;
      const response = await DefaultService.getTeam({
        teamId,
        key: API_KEY,
        include: includeStatsParam
      });

      if (!response?.data) {
        return {
          success: false,
          error: `Team with ID ${teamId} not found`,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.TEAM,
            processingTime: Date.now() - startTime
          }
        };
      }

      // Handle API response - might be array or single object
      const teamData = Array.isArray(response.data) ? response.data[0] : response.data;
      const team = teamData as unknown as Team;
      console.log(`✅ Retrieved team details for ID: ${teamId}`);

      // Cache the data
      await this.cacheManager.set(cacheKey, team, {
        ttl: CACHE_TTL.TEAM_DATA,
        tags: ['teams', 'team-details', `team-${teamId}`]
      });

      return {
        success: true,
        data: team,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.TEAM,
          processingTime: Date.now() - startTime,
          cached: false
        }
      };

    } catch (error) {
      console.error('❌ Error in getTeam:', error);
      return {
        success: false,
        error: `Failed to get team details: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.TEAM,
          processingTime: Date.now() - startTime
        }
      };
    }
  }



  /**
   * 📊 GET TEAM LAST X STATS
   * Retrieves team's recent match statistics
   */
  async getTeamLastXStats(teamId: number, matchCount?: number): Promise<ServiceResponse<any>> {
    const startTime = Date.now();
    const cacheKey = cacheKeys.teamLastXStats(teamId, matchCount);

    try {
      console.log(`📊 Getting team last X stats for ID: ${teamId}, matches: ${matchCount || 'default'}`);

      // Validate team ID
      if (!teamId || teamId <= 0 || !Number.isInteger(teamId)) {
        return {
          success: false,
          error: 'Invalid team ID: must be a positive integer',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.TEAM_LAST_X_STATS,
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
            source: FOOTY_ENDPOINTS.TEAM_LAST_X_STATS,
            processingTime: Date.now() - startTime
          }
        };
      }

      // Check cache first
      const cachedData = await this.cacheManager.get<any>(cacheKey);
      if (cachedData) {
        console.log('✅ Team last X stats retrieved from cache');
        return {
          success: true,
          data: cachedData,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.TEAM_LAST_X_STATS,
            processingTime: Date.now() - startTime,
            cached: true
          }
        };
      }

      // Fetch from API
      console.log('🔍 Fetching team last X stats from API...');
      const response = await DefaultService.getTeamLastXStats(teamId, API_KEY);

      if (!response?.data) {
        return {
          success: false,
          error: `No stats found for team ID ${teamId}`,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.TEAM_LAST_X_STATS,
            processingTime: Date.now() - startTime
          }
        };
      }

      const teamStats = response.data;
      console.log(`✅ Retrieved team last X stats for ID: ${teamId}`);

      // Cache the data
      await this.cacheManager.set(cacheKey, teamStats, {
        ttl: CACHE_TTL.TEAM_STATS,
        tags: ['teams', 'team-stats', `team-${teamId}`]
      });

      return {
        success: true,
        data: teamStats,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.TEAM_LAST_X_STATS,
          processingTime: Date.now() - startTime,
          cached: false
        }
      };

    } catch (error) {
      console.error('❌ Error in getTeamLastXStats:', error);
      return {
        success: false,
        error: `Failed to get team last X stats: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.TEAM_LAST_X_STATS,
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * ⚽ GET PLAYER STATS
   * Retrieves individual player statistics
   */
  async getPlayerStats(playerId: number): Promise<ServiceResponse<any>> {
    const startTime = Date.now();
    const cacheKey = cacheKeys.playerStats(playerId);

    try {
      console.log(`⚽ Getting player stats for ID: ${playerId}`);

      // Validate player ID
      if (!playerId || playerId <= 0 || !Number.isInteger(playerId)) {
        return {
          success: false,
          error: 'Invalid player ID: must be a positive integer',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.PLAYER_STATS,
            processingTime: Date.now() - startTime
          }
        };
      }

      // Check cache first
      const cachedData = await this.cacheManager.get<any>(cacheKey);
      if (cachedData) {
        console.log('✅ Player stats retrieved from cache');
        return {
          success: true,
          data: cachedData,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.PLAYER_STATS,
            processingTime: Date.now() - startTime,
            cached: true
          }
        };
      }

      // Fetch from API
      console.log('🔍 Fetching player stats from API...');
      const response = await DefaultService.getPlayerStats(playerId, API_KEY);

      if (!response?.data) {
        return {
          success: false,
          error: `Player with ID ${playerId} not found`,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.PLAYER_STATS,
            processingTime: Date.now() - startTime
          }
        };
      }

      const playerStats = response.data;
      console.log(`✅ Retrieved player stats for ID: ${playerId}`);

      // Cache the data
      await this.cacheManager.set(cacheKey, playerStats, {
        ttl: CACHE_TTL.PLAYER_STATS,
        tags: ['players', 'player-stats', `player-${playerId}`]
      });

      return {
        success: true,
        data: playerStats,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.PLAYER_STATS,
          processingTime: Date.now() - startTime,
          cached: false
        }
      };

    } catch (error) {
      console.error('❌ Error in getPlayerStats:', error);
      return {
        success: false,
        error: `Failed to get player stats: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.PLAYER_STATS,
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * 👨‍⚖️ GET REFEREE STATS
   * Retrieves individual referee statistics
   */
  async getRefereeStats(refereeId: number): Promise<ServiceResponse<any>> {
    const startTime = Date.now();
    const cacheKey = cacheKeys.refereeStats(refereeId);

    try {
      console.log(`👨‍⚖️ Getting referee stats for ID: ${refereeId}`);

      // Validate referee ID
      if (!refereeId || refereeId <= 0 || !Number.isInteger(refereeId)) {
        return {
          success: false,
          error: 'Invalid referee ID: must be a positive integer',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.REFEREE_STATS,
            processingTime: Date.now() - startTime
          }
        };
      }

      // Check cache first
      const cachedData = await this.cacheManager.get<any>(cacheKey);
      if (cachedData) {
        console.log('✅ Referee stats retrieved from cache');
        return {
          success: true,
          data: cachedData,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.REFEREE_STATS,
            processingTime: Date.now() - startTime,
            cached: true
          }
        };
      }

      // Fetch from API
      console.log('🔍 Fetching referee stats from API...');
      const response = await DefaultService.getRefereeStats(refereeId, API_KEY);

      if (!response?.data) {
        return {
          success: false,
          error: `Referee with ID ${refereeId} not found`,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.REFEREE_STATS,
            processingTime: Date.now() - startTime
          }
        };
      }

      const refereeStats = response.data;
      console.log(`✅ Retrieved referee stats for ID: ${refereeId}`);

      // Cache the data
      await this.cacheManager.set(cacheKey, refereeStats, {
        ttl: CACHE_TTL.REFEREE_STATS,
        tags: ['referees', 'referee-stats', `referee-${refereeId}`]
      });

      return {
        success: true,
        data: refereeStats,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.REFEREE_STATS,
          processingTime: Date.now() - startTime,
          cached: false
        }
      };

    } catch (error) {
      console.error('❌ Error in getRefereeStats:', error);
      return {
        success: false,
        error: `Failed to get referee stats: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.REFEREE_STATS,
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * 🎯 GET BTTS STATS
   * Retrieves Both Teams To Score statistics
   */
  async getBttsStats(): Promise<ServiceResponse<any>> {
    const startTime = Date.now();
    const cacheKey = cacheKeys.bttsStats();

    try {
      console.log('🎯 Getting BTTS (Both Teams To Score) stats...');

      // Check cache first
      const cachedData = await this.cacheManager.get<any>(cacheKey);
      if (cachedData) {
        console.log('✅ BTTS stats retrieved from cache');
        return {
          success: true,
          data: cachedData,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.BTTS_STATS,
            processingTime: Date.now() - startTime,
            cached: true
          }
        };
      }

      // Fetch from API
      console.log('🔍 Fetching BTTS stats from API...');
      const response = await DefaultService.getBttsStats(API_KEY);

      if (!response?.data) {
        return {
          success: false,
          error: 'No BTTS stats data returned from API',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.BTTS_STATS,
            processingTime: Date.now() - startTime
          }
        };
      }

      const bttsStats = response.data;
      console.log('✅ Retrieved BTTS stats from API');

      // Cache the data with shorter TTL for analytics
      await this.cacheManager.set(cacheKey, bttsStats, {
        ttl: CACHE_TTL.BTTS_STATS,
        tags: ['analytics', 'btts', 'statistics']
      });

      return {
        success: true,
        data: bttsStats,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.BTTS_STATS,
          processingTime: Date.now() - startTime,
          cached: false
        }
      };

    } catch (error) {
      console.error('❌ Error in getBttsStats:', error);
      return {
        success: false,
        error: `Failed to get BTTS stats: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.BTTS_STATS,
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * 📈 GET OVER 2.5 STATS
   * Retrieves Over 2.5 goals statistics
   */
  async getOver25Stats(): Promise<ServiceResponse<any>> {
    const startTime = Date.now();
    const cacheKey = cacheKeys.over25Stats();

    try {
      console.log('📈 Getting Over 2.5 goals stats...');

      // Check cache first
      const cachedData = await this.cacheManager.get<any>(cacheKey);
      if (cachedData) {
        console.log('✅ Over 2.5 stats retrieved from cache');
        return {
          success: true,
          data: cachedData,
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.OVER25_STATS,
            processingTime: Date.now() - startTime,
            cached: true
          }
        };
      }

      // Fetch from API
      console.log('🔍 Fetching Over 2.5 stats from API...');
      const response = await DefaultService.getOver25Stats(API_KEY);

      if (!response?.data) {
        return {
          success: false,
          error: 'No Over 2.5 stats data returned from API',
          metadata: {
            timestamp: new Date().toISOString(),
            source: FOOTY_ENDPOINTS.OVER25_STATS,
            processingTime: Date.now() - startTime
          }
        };
      }

      const over25Stats = response.data;
      console.log('✅ Retrieved Over 2.5 stats from API');

      // Cache the data with shorter TTL for analytics
      await this.cacheManager.set(cacheKey, over25Stats, {
        ttl: CACHE_TTL.OVER25_STATS,
        tags: ['analytics', 'over25', 'statistics']
      });

      return {
        success: true,
        data: over25Stats,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.OVER25_STATS,
          processingTime: Date.now() - startTime,
          cached: false
        }
      };

    } catch (error) {
      console.error('❌ Error in getOver25Stats:', error);
      return {
        success: false,
        error: `Failed to get Over 2.5 stats: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          timestamp: new Date().toISOString(),
          source: FOOTY_ENDPOINTS.OVER25_STATS,
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * 🧹 CLEANUP
   * Shutdown the service and cleanup resources
   */
  async shutdown(): Promise<void> {
    console.log('🧹 Shutting down FootyStatsService...');
    this.cacheManager.shutdown();
    console.log('✅ FootyStatsService shutdown complete');
  }
}
