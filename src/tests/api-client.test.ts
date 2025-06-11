import { DefaultService, OpenAPI } from '../apis/footy';
import type { ApiResponse, Match, League, Country } from '../apis/footy';

// Configure API for testing
OpenAPI.BASE = 'https://api.football-data-api.com';

describe('FootyStats API Client', () => {
  // Test basic connectivity and authentication
  describe('Authentication & Basic Connectivity', () => {
    test('should fetch countries successfully', async () => {
      const response = await DefaultService.getCountries({});

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data!.length).toBeGreaterThan(0);

      // Check structure of first country
      const firstCountry = response.data![0];
      expect(firstCountry).toHaveProperty('id');
      expect(firstCountry).toHaveProperty('country');
      expect(firstCountry).toHaveProperty('iso');
      expect(firstCountry).toHaveProperty('iso_number');
    }, 10000);

    test('should fetch leagues successfully', async () => {
      const response = await DefaultService.getLeagues({});

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data!.length).toBeGreaterThan(0);

      // Check structure of first league
      const firstLeague = response.data![0];
      expect(firstLeague).toHaveProperty('name');
      expect(firstLeague).toHaveProperty('season');
      expect(Array.isArray(firstLeague.season)).toBe(true);
    }, 10000);
  });

  // Test match-related endpoints
  describe('Match Endpoints', () => {
    test('should fetch today\'s matches', async () => {
      const response = await DefaultService.getTodaysMatches({});

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);

      if (response.data!.length > 0) {
        const firstMatch = response.data![0];
        expect(firstMatch).toHaveProperty('id');
        expect(firstMatch).toHaveProperty('homeID');
        expect(firstMatch).toHaveProperty('awayID');
        expect(firstMatch).toHaveProperty('status');
      }
    }, 10000);

    test('should fetch matches with pagination', async () => {
      const response = await DefaultService.getTodaysMatches({
        page: 1
      });

      expect(response.success).toBe(true);
      expect(response.pager).toBeDefined();
      expect(response.pager!.current_page).toBe(1);
      expect(response.pager!.max_page).toBeGreaterThanOrEqual(1);
    }, 10000);

    test('should fetch matches for specific date', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateString = yesterday.toISOString().split('T')[0];

      const response = await DefaultService.getTodaysMatches({
        date: dateString
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    }, 10000);
  });

  // Test league-specific endpoints
  describe('League Endpoints', () => {
    const PREMIER_LEAGUE_SEASON_ID = 1625; // Premier League 2018/2019

    test('should fetch league season data', async () => {
      const response = await DefaultService.getLeagueSeason({
        seasonId: PREMIER_LEAGUE_SEASON_ID
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    }, 10000);

    test('should fetch league matches', async () => {
      const response = await DefaultService.getLeagueMatches({
        seasonId: PREMIER_LEAGUE_SEASON_ID,
        page: 1,
        maxPerPage: 10
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);

      if (response.data!.length > 0) {
        const firstMatch = response.data![0];
        expect(firstMatch).toHaveProperty('id');
        expect(firstMatch).toHaveProperty('homeID');
        expect(firstMatch).toHaveProperty('awayID');
      }
    }, 10000);

    test('should fetch league teams', async () => {
      const response = await DefaultService.getLeagueTeams({
        seasonId: PREMIER_LEAGUE_SEASON_ID,
        page: 1
      });

      expect(response.success).toBe(true);
      expect(response.pager).toBeDefined();
      expect(response.pager!.total_results).toBeGreaterThan(0);
    }, 10000);

    test('should fetch league teams with stats', async () => {
      const response = await DefaultService.getLeagueTeams({
        seasonId: PREMIER_LEAGUE_SEASON_ID,
        page: 1,
        include: 'stats'
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    }, 10000);

    test('should fetch league players', async () => {
      const response = await DefaultService.getLeaguePlayers({
        seasonId: PREMIER_LEAGUE_SEASON_ID
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    }, 10000);

    test('should fetch league referees', async () => {
      const response = await DefaultService.getLeagueReferees({
        seasonId: PREMIER_LEAGUE_SEASON_ID
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    }, 10000);

    test('should fetch league tables', async () => {
      const response = await DefaultService.getLeagueTables({
        seasonId: PREMIER_LEAGUE_SEASON_ID
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    }, 10000);
  });

  // Test filtering and search capabilities
  describe('Filtering & Search', () => {
    test('should filter leagues by country', async () => {
      const UK_ISO = 826; // United Kingdom

      const response = await DefaultService.getLeagues({
        country: UK_ISO
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);

      // Should have fewer results than all leagues
      const allLeagues = await DefaultService.getLeagues({});
      expect(response.data!.length).toBeLessThan(allLeagues.data!.length);
    }, 10000);

    test('should fetch chosen leagues only', async () => {
      const response = await DefaultService.getLeagues({
        chosenLeaguesOnly: 'true'
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    }, 10000);
  });

  // Test statistics endpoints
  describe('Statistics Endpoints', () => {
    test('should fetch BTTS stats', async () => {
      const response = await DefaultService.getBttsStats({});

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    }, 10000);

    test('should fetch Over 2.5 stats', async () => {
      const response = await DefaultService.getOver25Stats({});

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    }, 10000);
  });

  // Test individual entity endpoints
  describe('Individual Entity Endpoints', () => {
    test('should fetch team data', async () => {
      // Using Manchester United team ID (example)
      const TEAM_ID = 2; // This should be a valid team ID

      const response = await DefaultService.getTeam({
        teamId: TEAM_ID
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    }, 10000);

    test('should fetch team data with stats', async () => {
      const TEAM_ID = 2;

      const response = await DefaultService.getTeam({
        teamId: TEAM_ID,
        include: 'stats'
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    }, 10000);

    test('should fetch team last X stats', async () => {
      const TEAM_ID = 2;

      const response = await DefaultService.getTeamLastXStats({
        teamId: TEAM_ID
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    }, 10000);

    test('should fetch match details', async () => {
      // First get a match ID from today's matches
      const todaysMatches = await DefaultService.getTodaysMatches({});

      if (todaysMatches.data && todaysMatches.data.length > 0) {
        const matchId = todaysMatches.data[0].id!;

        const response = await DefaultService.getMatch({
          matchId: matchId
        });

        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
      }
    }, 15000);

    test('should fetch player stats', async () => {
      const PLAYER_ID = 1; // This should be a valid player ID

      const response = await DefaultService.getPlayerStats({
        playerId: PLAYER_ID
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    }, 10000);

    test('should fetch referee stats', async () => {
      const REFEREE_ID = 1; // This should be a valid referee ID

      const response = await DefaultService.getRefereeStats({
        refereeId: REFEREE_ID
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    }, 10000);
  });

  // Test error handling
  describe('Error Handling', () => {
    test('should handle invalid team ID gracefully', async () => {
      const INVALID_TEAM_ID = 999999999;

      try {
        const response = await DefaultService.getTeam({
          teamId: INVALID_TEAM_ID
        });

        // If it doesn't throw, check if it returns an error response
        if (!response.success) {
          expect(response.success).toBe(false);
        }
      } catch (error) {
        // API might throw an error for invalid IDs
        expect(error).toBeDefined();
      }
    }, 10000);

    test('should handle invalid season ID gracefully', async () => {
      const INVALID_SEASON_ID = 999999999;

      try {
        const response = await DefaultService.getLeagueSeason({
          seasonId: INVALID_SEASON_ID
        });

        if (!response.success) {
          expect(response.success).toBe(false);
        }
      } catch (error) {
        expect(error).toBeDefined();
      }
    }, 10000);

    test('should handle invalid date format gracefully', async () => {
      try {
        const response = await DefaultService.getTodaysMatches({
          date: 'invalid-date'
        });

        // Should either succeed with empty data or fail gracefully
        expect(response).toBeDefined();
      } catch (error) {
        expect(error).toBeDefined();
      }
    }, 10000);
  });

  // Test API response structure consistency
  describe('Response Structure Validation', () => {
    test('all responses should have consistent structure', async () => {
      const responses = await Promise.all([
        DefaultService.getCountries({}),
        DefaultService.getLeagues({}),
        DefaultService.getTodaysMatches({}),
        DefaultService.getBttsStats({}),
        DefaultService.getOver25Stats({})
      ]);

      responses.forEach((response, index) => {
        expect(response).toHaveProperty('success');
        expect(typeof response.success).toBe('boolean');
        expect(response).toHaveProperty('data');

        // Paginated responses should have pager
        if (index === 2) { // getTodaysMatches
          expect(response).toHaveProperty('pager');
        }
      });
    }, 15000);
  });
});
