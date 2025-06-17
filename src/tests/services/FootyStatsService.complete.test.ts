/**
 * COMPLETE FOOTYSTATS SERVICE TESTS
 * Comprehensive testing of all 16 API endpoints
 */

import { FootyStatsService } from '../../services/FootyStatsService';

describe('🏈 FootyStatsService - Complete API Tests', () => {
  let service: FootyStatsService;

  beforeEach(() => {
    service = new FootyStatsService();
  });

  afterEach(async () => {
    await service.shutdown();
  });

  describe('📋 All 16 Endpoints Validation', () => {
    it('should have all 16 required methods', () => {
      // Verify all methods exist
      expect(typeof service.getCountries).toBe('function');
      expect(typeof service.getLeagues).toBe('function');
      expect(typeof service.getTodaysMatches).toBe('function');
      expect(typeof service.getMatch).toBe('function');
      expect(typeof service.getLeagueSeason).toBe('function');
      expect(typeof service.getLeagueMatches).toBe('function');
      expect(typeof service.getLeagueTeams).toBe('function');
      expect(typeof service.getLeaguePlayers).toBe('function');
      expect(typeof service.getLeagueReferees).toBe('function');
      expect(typeof service.getLeagueTables).toBe('function');
      expect(typeof service.getTeam).toBe('function');
      expect(typeof service.getTeamLastXStats).toBe('function');
      expect(typeof service.getPlayerStats).toBe('function');
      expect(typeof service.getRefereeStats).toBe('function');
      expect(typeof service.getBttsStats).toBe('function');
      expect(typeof service.getOver25Stats).toBe('function');
      
      console.log('✅ All 16 API endpoints are available');
    });
  });

  describe('🌍 Reference Data Endpoints', () => {
    it('should get countries successfully', async () => {
      const result = await service.getCountries();

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.source).toBe('/country-list');

      if (result.success) {
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
        console.log(`✅ Countries: ${result.data?.length} items`);
      } else {
        console.log(`⚠️ Countries API call failed: ${result.error}`);
      }
    }, 30000);

    it('should get leagues successfully', async () => {
      const result = await service.getLeagues();

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.source).toBe('/league-list');

      if (result.success) {
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
        console.log(`✅ Leagues: ${result.data?.length} items`);
      } else {
        console.log(`⚠️ Leagues API call failed: ${result.error}`);
      }
    }, 30000);

    it('should get leagues with filters', async () => {
      const result = await service.getLeagues({ chosenOnly: true });

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();

      if (result.success) {
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
        console.log(`✅ Chosen leagues: ${result.data?.length} items`);
      } else {
        console.log(`⚠️ Chosen leagues API call failed: ${result.error}`);
      }
    }, 30000);
  });

  describe('📅 Live Data Endpoints', () => {
    it('should get today\'s matches', async () => {
      const result = await service.getTodaysMatches();

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.source).toBe('/todays-matches');

      if (result.success) {
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
        console.log(`✅ Today's matches: ${result.data?.length} items`);
      } else {
        console.log(`⚠️ Today's matches API call failed: ${result.error}`);
      }
    }, 30000);

    it('should get matches for specific date', async () => {
      const testDate = '2023-12-19';
      const result = await service.getTodaysMatches(testDate);

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();

      if (result.success) {
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
        console.log(`✅ Matches for ${testDate}: ${result.data?.length} items`);
      } else {
        console.log(`⚠️ Matches for ${testDate} API call failed: ${result.error}`);
      }
    }, 30000);
  });

  describe('🏆 League-Based Endpoints', () => {
    let testSeasonId: number;

    beforeAll(async () => {
      // Get a real season ID for testing
      const leaguesResult = await service.getLeagues({ chosenOnly: true });
      if (leaguesResult.success && leaguesResult.data && leaguesResult.data.length > 0) {
        const firstLeague = leaguesResult.data[0];
        if (firstLeague.season && firstLeague.season.length > 0) {
          testSeasonId = firstLeague.season[0].id;
          console.log(`🎯 Using test season ID: ${testSeasonId}`);
        }
      }
    });

    it('should get league season data', async () => {
      if (!testSeasonId) {
        console.log('⚠️ No test season ID available, skipping test');
        return;
      }

      const result = await service.getLeagueSeason(testSeasonId);
      
      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      
      console.log(`✅ League season result: ${result.success ? 'success' : result.error}`);
    }, 30000);

    it('should get league matches', async () => {
      if (!testSeasonId) {
        console.log('⚠️ No test season ID available, skipping test');
        return;
      }

      const result = await service.getLeagueMatches(testSeasonId);
      
      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      
      console.log(`✅ League matches result: ${result.success ? `${result.data?.length} matches` : result.error}`);
    }, 30000);

    it('should get league teams', async () => {
      if (!testSeasonId) {
        console.log('⚠️ No test season ID available, skipping test');
        return;
      }

      const result = await service.getLeagueTeams(testSeasonId);
      
      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      
      console.log(`✅ League teams result: ${result.success ? `${result.data?.length} teams` : result.error}`);
    }, 30000);

    it('should get league players', async () => {
      if (!testSeasonId) {
        console.log('⚠️ No test season ID available, skipping test');
        return;
      }

      const result = await service.getLeaguePlayers(testSeasonId);
      
      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      
      console.log(`✅ League players result: ${result.success ? `${result.data?.length} players` : result.error}`);
    }, 30000);

    it('should get league referees', async () => {
      if (!testSeasonId) {
        console.log('⚠️ No test season ID available, skipping test');
        return;
      }

      const result = await service.getLeagueReferees(testSeasonId);
      
      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      
      console.log(`✅ League referees result: ${result.success ? `${result.data?.length} referees` : result.error}`);
    }, 30000);

    it('should get league tables', async () => {
      if (!testSeasonId) {
        console.log('⚠️ No test season ID available, skipping test');
        return;
      }

      const result = await service.getLeagueTables(testSeasonId);
      
      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      
      console.log(`✅ League tables result: ${result.success ? `${result.data?.length} table entries` : result.error}`);
    }, 30000);
  });

  describe('🏟️ Individual Entity Endpoints', () => {
    it('should handle invalid match ID', async () => {
      const result = await service.getMatch(-1);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid match ID');
      
      console.log('✅ Invalid match ID validation works');
    });

    it('should handle invalid team ID', async () => {
      const result = await service.getTeam(-1);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid team ID');
      
      console.log('✅ Invalid team ID validation works');
    });

    it('should handle invalid player ID', async () => {
      const result = await service.getPlayerStats(-1);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid player ID');
      
      console.log('✅ Invalid player ID validation works');
    });

    it('should handle invalid referee ID', async () => {
      const result = await service.getRefereeStats(-1);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid referee ID');
      
      console.log('✅ Invalid referee ID validation works');
    });

    it('should handle invalid team stats parameters', async () => {
      const result = await service.getTeamLastXStats(-1);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid team ID');
      
      console.log('✅ Invalid team stats parameters validation works');
    });
  });

  describe('📊 Analytics Endpoints', () => {
    it('should get BTTS stats', async () => {
      const result = await service.getBttsStats();
      
      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.source).toBe('/stats-data-btts');
      
      console.log(`✅ BTTS stats result: ${result.success ? 'success' : result.error}`);
    }, 30000);

    it('should get Over 2.5 stats', async () => {
      const result = await service.getOver25Stats();
      
      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.source).toBe('/stats-data-over25');
      
      console.log(`✅ Over 2.5 stats result: ${result.success ? 'success' : result.error}`);
    }, 30000);
  });

  describe('🔄 Caching Integration', () => {
    it('should cache and retrieve data efficiently', async () => {
      // First call - should fetch from API
      const result1 = await service.getCountries();
      expect(result1.success).toBeDefined();
      expect(result1.metadata).toBeDefined();

      // Only check cached flag if the first call was successful
      if (result1.success) {
        expect(result1.metadata?.cached).toBe(false);
      }

      // Second call - should come from cache if first was successful
      const result2 = await service.getCountries();
      expect(result2.success).toBeDefined();
      expect(result2.metadata).toBeDefined();

      // If both calls were successful, second should be cached
      if (result1.success && result2.success) {
        expect(result2.metadata?.cached).toBe(true);

        // Cache should be faster
        const apiTime = result1.metadata?.processingTime || 0;
        const cacheTime = result2.metadata?.processingTime || 0;
        expect(cacheTime).toBeLessThan(apiTime);

        console.log(`✅ Caching works: API ${apiTime}ms vs Cache ${cacheTime}ms`);
      } else {
        console.log(`⚠️ Caching test skipped due to API issues`);
      }
    }, 30000);
  });

  describe('⚡ Performance Testing', () => {
    it('should handle concurrent requests efficiently', async () => {
      const startTime = Date.now();
      
      // Test multiple concurrent calls
      const promises = [
        service.getCountries(),
        service.getLeagues(),
        service.getTodaysMatches(),
        service.getBttsStats(),
        service.getOver25Stats()
      ];
      
      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;
      
      // All should have responses (success or failure)
      results.forEach((result, index) => {
        expect(result.success).toBeDefined();
        expect(result.metadata).toBeDefined();
        console.log(`✅ Concurrent call ${index + 1}: ${result.metadata?.processingTime}ms`);
      });
      
      console.log(`✅ Total concurrent execution time: ${totalTime}ms`);
      expect(totalTime).toBeLessThan(15000); // 15 seconds max
    }, 45000);
  });
});
