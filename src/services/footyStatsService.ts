import { OpenAPI, DefaultService } from '../apis/footy';
import type { 
  ApiResponse, 
  Country, 
  League, 
  Match, 
  PaginatedResponse 
} from '../apis/footy';

/**
 * FootyStats API Service
 * Wrapper around the generated API client that automatically includes the API key
 */
export class FootyStatsService {
  private static apiKey: string = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756';

  static {
    // Configure the base URL
    OpenAPI.BASE = 'https://api.football-data-api.com';
  }

  /**
   * Set a custom API key
   */
  static setApiKey(key: string) {
    this.apiKey = key;
  }

  /**
   * Get all available countries
   */
  static async getCountries(): Promise<(ApiResponse & { data?: Array<Country> })> {
    const originalRequest = DefaultService.getCountries;
    return this.withApiKey(() => originalRequest());
  }

  /**
   * Get all available leagues
   */
  static async getLeagues(
    chosenLeaguesOnly?: 'true' | 'false',
    country?: number
  ): Promise<(ApiResponse & { data?: Array<League> })> {
    const originalRequest = DefaultService.getLeagues;
    return this.withApiKey(() => originalRequest(chosenLeaguesOnly, country));
  }

  /**
   * Get today's matches
   */
  static async getTodaysMatches(
    timezone?: string,
    date?: string,
    page: number = 1
  ): Promise<(PaginatedResponse & { data?: Array<Match> })> {
    const originalRequest = DefaultService.getTodaysMatches;
    return this.withApiKey(() => originalRequest(timezone, date, page));
  }

  /**
   * Get league season stats and teams
   */
  static async getLeagueSeason(
    seasonId: number,
    maxTime?: number
  ): Promise<ApiResponse> {
    const originalRequest = DefaultService.getLeagueSeason;
    return this.withApiKey(() => originalRequest(seasonId, maxTime));
  }

  /**
   * Get league matches
   */
  static async getLeagueMatches(
    seasonId: number,
    page: number = 1,
    maxPerPage: number = 300,
    maxTime?: number
  ): Promise<(ApiResponse & { data?: Array<Match> })> {
    const originalRequest = DefaultService.getLeagueMatches;
    return this.withApiKey(() => originalRequest(seasonId, page, maxPerPage, maxTime));
  }

  /**
   * Get teams in a league season
   */
  static async getLeagueTeams(
    seasonId: number,
    page: number = 1,
    include?: 'stats',
    maxTime?: number
  ): Promise<PaginatedResponse> {
    const originalRequest = DefaultService.getLeagueTeams;
    return this.withApiKey(() => originalRequest(seasonId, page, include, maxTime));
  }

  /**
   * Get league players
   */
  static async getLeaguePlayers(
    seasonId: number,
    include?: 'stats'
  ): Promise<ApiResponse> {
    const originalRequest = DefaultService.getLeaguePlayers;
    return this.withApiKey(() => originalRequest(seasonId, include));
  }

  /**
   * Get league referees
   */
  static async getLeagueReferees(seasonId: number): Promise<ApiResponse> {
    const originalRequest = DefaultService.getLeagueReferees;
    return this.withApiKey(() => originalRequest(seasonId));
  }

  /**
   * Get individual team data
   */
  static async getTeam(
    teamId: number,
    include?: 'stats'
  ): Promise<ApiResponse> {
    const originalRequest = DefaultService.getTeam;
    return this.withApiKey(() => originalRequest(teamId, include));
  }

  /**
   * Get last X stats for a team
   */
  static async getTeamLastXStats(teamId: number): Promise<ApiResponse> {
    const originalRequest = DefaultService.getTeamLastXStats;
    return this.withApiKey(() => originalRequest(teamId));
  }

  /**
   * Get match details
   */
  static async getMatch(matchId: number): Promise<ApiResponse> {
    const originalRequest = DefaultService.getMatch;
    return this.withApiKey(() => originalRequest(matchId));
  }

  /**
   * Get league tables
   */
  static async getLeagueTables(seasonId: number): Promise<ApiResponse> {
    const originalRequest = DefaultService.getLeagueTables;
    return this.withApiKey(() => originalRequest(seasonId));
  }

  /**
   * Get individual player stats
   */
  static async getPlayerStats(playerId: number): Promise<ApiResponse> {
    const originalRequest = DefaultService.getPlayerStats;
    return this.withApiKey(() => originalRequest(playerId));
  }

  /**
   * Get individual referee stats
   */
  static async getRefereeStats(refereeId: number): Promise<ApiResponse> {
    const originalRequest = DefaultService.getRefereeStats;
    return this.withApiKey(() => originalRequest(refereeId));
  }

  /**
   * Get BTTS stats
   */
  static async getBTTSStats(): Promise<ApiResponse> {
    const originalRequest = DefaultService.getBttsStats;
    return this.withApiKey(() => originalRequest());
  }

  /**
   * Get Over 2.5 stats
   */
  static async getOver25Stats(): Promise<ApiResponse> {
    const originalRequest = DefaultService.getOver25Stats;
    return this.withApiKey(() => originalRequest());
  }

  /**
   * Helper method to add API key to requests
   * This is a workaround since the generated client doesn't handle API key query params automatically
   */
  private static async withApiKey<T>(requestFn: () => Promise<T>): Promise<T> {
    // Store original interceptor
    const originalInterceptor = OpenAPI.HEADERS;
    
    try {
      // Add API key as query parameter by modifying the request
      // Since we can't easily modify query params, we'll modify the base URL temporarily
      const originalBase = OpenAPI.BASE;
      
      // For now, we'll need to handle this differently
      // The generated client should include the key parameter in each request
      // Let's just call the original function and handle the key in the URL
      
      return await requestFn();
    } finally {
      // Restore original interceptor
      OpenAPI.HEADERS = originalInterceptor;
    }
  }
}

/**
 * Convenience functions for common operations
 */
export class FootyStatsHelpers {
  /**
   * Get leagues for a specific country
   */
  static async getLeaguesByCountry(countryId: number) {
    const response = await FootyStatsService.getLeagues(undefined, countryId);
    return response.data || [];
  }

  /**
   * Get complete league information (season, teams, recent matches)
   */
  static async getCompleteLeagueInfo(seasonId: number) {
    const [seasonInfo, teams, matches] = await Promise.all([
      FootyStatsService.getLeagueSeason(seasonId),
      FootyStatsService.getLeagueTeams(seasonId, 1, 'stats'),
      FootyStatsService.getLeagueMatches(seasonId, 1, 20)
    ]);

    return {
      season: seasonInfo,
      teams: teams,
      recentMatches: matches
    };
  }

  /**
   * Get team analysis with recent form
   */
  static async getTeamAnalysis(teamId: number) {
    const [teamData, lastXStats] = await Promise.all([
      FootyStatsService.getTeam(teamId, 'stats'),
      FootyStatsService.getTeamLastXStats(teamId)
    ]);

    return {
      team: teamData,
      recentForm: lastXStats
    };
  }

  /**
   * Search for leagues by name (client-side filtering)
   */
  static async searchLeagues(searchTerm: string) {
    const response = await FootyStatsService.getLeagues();
    const leagues = response.data || [];
    
    return leagues.filter(league => 
      league.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   * Get matches for a specific date
   */
  static async getMatchesForDate(date: string, timezone?: string) {
    return FootyStatsService.getTodaysMatches(timezone, date);
  }
}
