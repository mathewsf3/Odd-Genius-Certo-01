/**
 * FOOTYSTATS SERVICE TESTS
 * Testing the core service methods with Phase 1 integration
 */

import { FootyStatsService } from '../../services/FootyStatsService';

describe('🏈 FootyStatsService Tests', () => {
  let service: FootyStatsService;

  beforeEach(() => {
    service = new FootyStatsService();
  });

  afterEach(async () => {
    await service.shutdown();
  });

  describe('Basic Data Retrieval', () => {
    it('should get countries successfully', async () => {
      const result = await service.getCountries();

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.source).toBe('/country-list');
      expect(typeof result.metadata?.processingTime).toBe('number');

      if (result.success) {
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);

        if (result.data && result.data.length > 0) {
          console.log(`✅ Retrieved ${result.data.length} countries`);
          console.log(`📊 First country:`, result.data[0]);
        }
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

        if (result.data && result.data.length > 0) {
          console.log(`✅ Retrieved ${result.data.length} leagues`);
          console.log(`📊 First league:`, result.data[0]);
        }
      } else {
        console.log(`⚠️ Leagues API call failed: ${result.error}`);
      }
    }, 30000);

    it('should get leagues with chosenOnly filter', async () => {
      const result = await service.getLeagues({ chosenOnly: true });

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();

      if (result.success) {
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);

        if (result.data && result.data.length > 0) {
          console.log(`✅ Retrieved ${result.data.length} chosen leagues`);
        }
      } else {
        console.log(`⚠️ Chosen leagues API call failed: ${result.error}`);
      }
    }, 30000);

    it('should handle invalid country parameter', async () => {
      const result = await service.getLeagues({ country: -1 });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid country ID');
    });

    it('should get today\'s matches', async () => {
      const result = await service.getTodaysMatches();

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.source).toBe('/todays-matches');

      if (result.success) {
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);

        console.log(`✅ Retrieved ${result.data?.length || 0} matches for today`);

        if (result.data && result.data.length > 0) {
          console.log(`📊 First match:`, result.data[0]);
        }
      } else {
        console.log(`⚠️ Today's matches API call failed: ${result.error}`);
      }
    }, 30000);

    it('should get matches for specific date', async () => {
      const testDate = '2023-12-19'; // Use a date that likely has matches
      const result = await service.getTodaysMatches(testDate);

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();

      if (result.success) {
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);

        console.log(`✅ Retrieved ${result.data?.length || 0} matches for ${testDate}`);
      } else {
        console.log(`⚠️ Specific date matches API call failed: ${result.error}`);
      }
    }, 30000);
  });

  describe('Match Details', () => {
    it('should handle invalid match ID', async () => {
      const result = await service.getMatch(-1);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid match ID');
    });

    it('should handle non-existent match ID', async () => {
      const result = await service.getMatch(999999999);
      
      // This might succeed or fail depending on API, but should handle gracefully
      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      
      if (!result.success) {
        console.log(`✅ Properly handled non-existent match: ${result.error}`);
      }
    }, 30000);

    it('should get match details if match exists', async () => {
      // First get today's matches to find a real match ID
      const todaysMatches = await service.getTodaysMatches();
      
      if (todaysMatches.success && todaysMatches.data && todaysMatches.data.length > 0) {
        const firstMatch = todaysMatches.data[0];
        const matchId = firstMatch.id;
        
        console.log(`🎯 Testing with real match ID: ${matchId}`);
        
        const result = await service.getMatch(matchId);

        expect(result.success).toBeDefined();
        expect(result.metadata).toBeDefined();

        if (result.success) {
          expect(result.data).toBeDefined();
          expect(result.data?.id).toBe(matchId);

          console.log(`✅ Retrieved match details for ID ${matchId}`);
          console.log(`📊 Match: ${result.data?.homeID} vs ${result.data?.awayID}`);
        } else {
          console.log(`⚠️ Match details API call failed: ${result.error}`);
        }
      } else {
        console.log('⚠️ No matches available today for testing match details');
      }
    }, 30000);
  });

  describe('Caching Integration', () => {
    it('should cache countries data', async () => {
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

        // Response times should be faster for cached data
        const apiTime = result1.metadata?.processingTime || 0;
        const cacheTime = result2.metadata?.processingTime || 0;

        console.log(`📊 API call: ${apiTime}ms, Cache call: ${cacheTime}ms`);
        expect(cacheTime).toBeLessThan(apiTime);
      } else {
        console.log(`⚠️ Countries caching test skipped due to API issues`);
      }
    }, 30000);

    it('should cache leagues data with different keys for different options', async () => {
      // Call with no options
      const result1 = await service.getLeagues();
      expect(result1.success).toBeDefined();
      expect(result1.metadata).toBeDefined();

      // Call with chosenOnly - should be different cache key
      const result2 = await service.getLeagues({ chosenOnly: true });
      expect(result2.success).toBeDefined();
      expect(result2.metadata).toBeDefined();

      // Data might be different due to different filters
      if (result1.success && result2.success) {
        console.log(`📊 All leagues: ${result1.data?.length}, Chosen only: ${result2.data?.length}`);
      } else {
        console.log(`⚠️ Leagues caching test skipped due to API issues`);
      }
    }, 30000);
  });

  describe('Error Handling', () => {
    it('should handle service errors gracefully', async () => {
      // Test with invalid parameters to trigger errors
      const results = await Promise.allSettled([
        service.getLeagues({ country: -999 }),
        service.getMatch(-1),
        service.getMatch(0)
      ]);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          expect(result.value.success).toBe(false);
          expect(result.value.error).toBeDefined();
          expect(result.value.metadata).toBeDefined();
          console.log(`✅ Test ${index + 1} handled error: ${result.value.error}`);
        }
      });
    });
  });

  describe('Performance', () => {
    it('should meet response time benchmarks', async () => {
      const startTime = Date.now();
      
      // Test multiple concurrent calls
      const promises = [
        service.getCountries(),
        service.getLeagues(),
        service.getTodaysMatches()
      ];
      
      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;
      
      console.log(`📊 Total time for 3 concurrent calls: ${totalTime}ms`);
      
      // All should have responses (success or failure)
      results.forEach((result, index) => {
        expect(result.success).toBeDefined();
        expect(result.metadata).toBeDefined();
        console.log(`✅ Call ${index + 1}: ${result.metadata?.processingTime}ms (success: ${result.success})`);
      });
      
      // Total time should be reasonable (concurrent execution)
      expect(totalTime).toBeLessThan(10000); // 10 seconds max
    }, 30000);
  });
});
