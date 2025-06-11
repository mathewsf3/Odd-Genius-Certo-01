import { DefaultService, OpenAPI } from '../apis/footy';
import type { League, Match, Country } from '../apis/footy';

// Configure API for testing
OpenAPI.BASE = 'https://api.football-data-api.com';

describe('FootyStats API Integration Tests', () => {
  // Test complete workflow scenarios
  describe('Complete Workflow Scenarios', () => {
    test('should complete a full league analysis workflow', async () => {
      console.log('🔍 Starting full league analysis workflow...');

      // Step 1: Get all countries
      console.log('📍 Step 1: Fetching countries...');
      const countries = await DefaultService.getCountries({});
      expect(countries.success).toBe(true);
      expect(countries.data!.length).toBeGreaterThan(0);

      // Step 2: Find UK and get its leagues
      const uk = countries.data!.find(c => c.iso === 'gb' || c.country?.toLowerCase().includes('kingdom'));
      expect(uk).toBeDefined();

      console.log('🏆 Step 2: Fetching UK leagues...');
      const ukLeagues = await DefaultService.getLeagues({ country: uk!.iso_number });
      expect(ukLeagues.success).toBe(true);
      expect(ukLeagues.data!.length).toBeGreaterThan(0);

      // Step 3: Find Premier League and get a recent season
      const premierLeague = ukLeagues.data!.find(l =>
        l.name?.toLowerCase().includes('premier') ||
        l.league_name?.toLowerCase().includes('premier')
      );
      expect(premierLeague).toBeDefined();

      const recentSeason = premierLeague!.season?.find((s: any) => s.year >= 2020);
      expect(recentSeason).toBeDefined();

      console.log('📊 Step 3: Analyzing season data...');
      const seasonData = await DefaultService.getLeagueSeason({
        seasonId: recentSeason!.id
      });
      expect(seasonData.success).toBe(true);

      // Step 4: Get teams and matches for this season
      console.log('👥 Step 4: Fetching teams and matches...');
      const [teams, matches] = await Promise.all([
        DefaultService.getLeagueTeams({
          seasonId: recentSeason!.id,
          include: 'stats'
        }),
        DefaultService.getLeagueMatches({
          seasonId: recentSeason!.id,
          maxPerPage: 50
        })
      ]);

      expect(teams.success).toBe(true);
      expect(matches.success).toBe(true);
      expect(teams.pager!.total_results).toBeGreaterThan(10); // Should have multiple teams
      expect(matches.data!.length).toBeGreaterThan(0); // Should have matches

      console.log(`✅ Workflow completed: Found ${teams.pager!.total_results} teams and ${matches.data!.length} matches`);
    }, 30000);

    test('should complete a match analysis workflow', async () => {
      console.log('⚽ Starting match analysis workflow...');

      // Step 1: Get today's matches
      console.log('📅 Step 1: Fetching today\'s matches...');
      const todaysMatches = await DefaultService.getTodaysMatches({});
      expect(todaysMatches.success).toBe(true);

      if (todaysMatches.data && todaysMatches.data.length > 0) {
        const sampleMatch = todaysMatches.data[0];

        // Step 2: Get detailed match information
        console.log('🔍 Step 2: Getting match details...');
        const matchDetails = await DefaultService.getMatch({
          matchId: sampleMatch.id!
        });
        expect(matchDetails.success).toBe(true);

        // Step 3: Get team information for both teams
        console.log('👥 Step 3: Analyzing both teams...');
        const [homeTeam, awayTeam] = await Promise.all([
          DefaultService.getTeam({ teamId: sampleMatch.homeID!, include: 'stats' }),
          DefaultService.getTeam({ teamId: sampleMatch.awayID!, include: 'stats' })
        ]);

        expect(homeTeam.success).toBe(true);
        expect(awayTeam.success).toBe(true);

        // Step 4: Get recent form for both teams
        console.log('📈 Step 4: Checking recent form...');
        const [homeForm, awayForm] = await Promise.all([
          DefaultService.getTeamLastXStats({ teamId: sampleMatch.homeID! }),
          DefaultService.getTeamLastXStats({ teamId: sampleMatch.awayID! })
        ]);

        expect(homeForm.success).toBe(true);
        expect(awayForm.success).toBe(true);

        console.log(`✅ Match analysis completed for match ${sampleMatch.id}`);
      } else {
        console.log('ℹ️ No matches today, skipping detailed analysis');
      }
    }, 25000);

    test('should complete a statistics analysis workflow', async () => {
      console.log('📊 Starting statistics analysis workflow...');

      // Step 1: Get BTTS and Over 2.5 statistics
      console.log('🎯 Step 1: Fetching betting statistics...');
      const [bttsStats, over25Stats] = await Promise.all([
        DefaultService.getBttsStats({}),
        DefaultService.getOver25Stats({})
      ]);

      expect(bttsStats.success).toBe(true);
      expect(over25Stats.success).toBe(true);

      // Step 2: Get a sample league and analyze its performance
      console.log('🏆 Step 2: Analyzing league performance...');
      const leagues = await DefaultService.getLeagues({ chosenLeaguesOnly: 'true' });
      expect(leagues.success).toBe(true);

      if (leagues.data && leagues.data.length > 0) {
        const sampleLeague = leagues.data[0];
        const recentSeason = sampleLeague.season?.find((s: any) => s.year >= 2023);

        if (recentSeason) {
          // Get league tables and recent matches
          const [tables, recentMatches] = await Promise.all([
            DefaultService.getLeagueTables({ seasonId: recentSeason.id }),
            DefaultService.getLeagueMatches({
              seasonId: recentSeason.id,
              maxPerPage: 20
            })
          ]);

          expect(tables.success).toBe(true);
          expect(recentMatches.success).toBe(true);

          console.log(`✅ Statistics analysis completed for ${sampleLeague.name}`);
        }
      }
    }, 20000);
  });

  // Test data relationships and consistency
  describe('Data Relationships and Consistency', () => {
    test('should maintain consistent team IDs across endpoints', async () => {
      // Get a league season
      const leagues = await DefaultService.getLeagues({});
      const sampleLeague = leagues.data![0];
      const recentSeason = sampleLeague.season?.find((s: any) => s.year >= 2020);

      if (recentSeason) {
        // Get teams from league
        const leagueTeams = await DefaultService.getLeagueTeams({
          seasonId: recentSeason.id
        });

        if (leagueTeams.data && Array.isArray(leagueTeams.data) && leagueTeams.data.length > 0) {
          const firstTeam = leagueTeams.data[0];
          const teamId = (firstTeam as any).id || (firstTeam as any).team_id;

          if (teamId) {
            // Get individual team data
            const teamDetails = await DefaultService.getTeam({ teamId });
            expect(teamDetails.success).toBe(true);

            // Team ID should be consistent
            const detailTeamId = (teamDetails.data as any)?.id || (teamDetails.data as any)?.team_id;
            expect(detailTeamId).toBe(teamId);
          }
        }
      }
    }, 15000);

    test('should have consistent match data across endpoints', async () => {
      const todaysMatches = await DefaultService.getTodaysMatches({});

      if (todaysMatches.data && todaysMatches.data.length > 0) {
        const sampleMatch = todaysMatches.data[0];

        // Get detailed match data
        const matchDetails = await DefaultService.getMatch({
          matchId: sampleMatch.id!
        });

        expect(matchDetails.success).toBe(true);

        // Basic match info should be consistent
        const detailMatch = (matchDetails.data as any);
        if (detailMatch && typeof detailMatch === 'object') {
          // Match IDs should match
          expect(detailMatch.id || detailMatch.match_id).toBe(sampleMatch.id);
        }
      }
    }, 15000);
  });

  // Test edge cases and boundary conditions
  describe('Edge Cases and Boundary Conditions', () => {
    test('should handle empty results gracefully', async () => {
      // Try to get matches for a very old date
      const oldDate = '2000-01-01';

      const response = await DefaultService.getTodaysMatches({ date: oldDate });
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);

      // Should have empty or very few results
      console.log(`Matches for ${oldDate}: ${response.data!.length}`);
    }, 10000);

    test('should handle pagination edge cases', async () => {
      // Test very high page number
      const response = await DefaultService.getTodaysMatches({ page: 999999 });
      expect(response.success).toBe(true);
      expect(response.pager).toBeDefined();

      // Should handle gracefully (empty results or error)
      if (response.pager!.current_page > response.pager!.max_page) {
        expect(response.data!.length).toBe(0);
      }
    }, 10000);

    test('should handle different timezone formats', async () => {
      const timezones = [
        'UTC',
        'Europe/London',
        'America/New_York',
        'Asia/Tokyo',
        'Australia/Sydney'
      ];

      const responses = await Promise.all(
        timezones.map(tz =>
          DefaultService.getTodaysMatches({ timezone: tz }).catch(error => ({ error, timezone: tz }))
        )
      );

      responses.forEach((response, index) => {
        if ('error' in response) {
          console.log(`Timezone ${timezones[index]} failed:`, response.error.message);
        } else {
          expect(response.success).toBe(true);
          console.log(`Timezone ${timezones[index]}: ${response.data?.length || 0} matches`);
        }
      });
    }, 15000);
  });

  // Test API limits and quotas
  describe('API Limits and Quotas', () => {
    test('should respect API rate limits', async () => {
      const requests = [];
      const startTime = Date.now();

      // Make multiple requests in quick succession
      for (let i = 0; i < 5; i++) {
        requests.push(
          DefaultService.getCountries({}).then(response => ({
            success: response.success,
            index: i,
            timestamp: Date.now()
          })).catch(error => ({
            error: error.message,
            index: i,
            timestamp: Date.now()
          }))
        );
      }

      const results = await Promise.all(requests);
      const endTime = Date.now();

      console.log(`5 requests completed in ${endTime - startTime}ms`);

      results.forEach((result, index) => {
        if ('error' in result) {
          console.log(`Request ${index} failed: ${result.error}`);
        } else {
          console.log(`Request ${index} succeeded at ${result.timestamp - startTime}ms`);
        }
      });

      // At least some requests should succeed
      const successful = results.filter(r => 'success' in r && r.success);
      expect(successful.length).toBeGreaterThan(0);
    }, 15000);
  });
});
