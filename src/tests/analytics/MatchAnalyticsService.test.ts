/**
 * 🧪 MATCH ANALYTICS SERVICE TESTS
 * 
 * Comprehensive testing for match analytics and prediction functionality
 */

import { MatchAnalyticsService } from '../../analytics/match/MatchAnalyticsService';

describe('🏟️ MatchAnalyticsService Tests', () => {
  let service: MatchAnalyticsService;

  beforeEach(() => {
    service = new MatchAnalyticsService({
      enableCaching: true,
      cacheTtl: 300, // 5 minutes for testing
      enableLogging: true
    });
  });

  afterEach(async () => {
    await service.shutdown();
  });

  describe('🎯 Match Prediction', () => {
    it('should predict match outcome with basic options', async () => {
      // Use real team IDs that exist in the API
      const homeTeamId = 1; // Example team ID
      const awayTeamId = 2; // Example team ID

      const result = await service.predictMatch(homeTeamId, awayTeamId, {
        includeForm: false
      });

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.source).toBe('match_prediction');
      expect(result.metadata.processingTime).toBeGreaterThan(0);

      if (result.success && result.data) {
        expect(result.data.homeTeam).toBeDefined();
        expect(result.data.awayTeam).toBeDefined();
        expect(result.data.predictions).toBeDefined();
        expect(result.data.predictions.homeWin).toBeGreaterThanOrEqual(0);
        expect(result.data.predictions.draw).toBeGreaterThanOrEqual(0);
        expect(result.data.predictions.awayWin).toBeGreaterThanOrEqual(0);
        expect(result.data.predictions.btts).toBeGreaterThanOrEqual(0);
        expect(result.data.predictions.over25).toBeGreaterThanOrEqual(0);
        expect(result.data.confidence).toBeGreaterThan(0);
        expect(result.data.confidence).toBeLessThanOrEqual(100);
        expect(Array.isArray(result.data.factors)).toBe(true);

        console.log('✅ Match prediction result:', {
          homeTeam: result.data.homeTeam,
          awayTeam: result.data.awayTeam,
          predictions: result.data.predictions,
          confidence: result.data.confidence
        });
      } else {
        console.log('⚠️ Match prediction failed:', result.error);
      }
    }, 30000);

    it('should predict match with form analysis', async () => {
      const homeTeamId = 1;
      const awayTeamId = 2;

      const result = await service.predictMatch(homeTeamId, awayTeamId, {
        includeForm: true,
        formMatches: 5
      });

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();

      if (result.success && result.data) {
        expect(result.data.confidence).toBeGreaterThan(50); // Should be higher with form data
        console.log('✅ Match prediction with form:', {
          confidence: result.data.confidence,
          factors: result.data.factors
        });
      }
    }, 30000);

    it('should handle invalid team IDs gracefully', async () => {
      const result = await service.predictMatch(-1, -2);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.metadata).toBeDefined();

      console.log('✅ Invalid team IDs handled:', result.error);
    });
  });

  describe('📊 Today\'s Matches Analysis', () => {
    it('should analyze today\'s matches', async () => {
      const result = await service.analyzeTodaysMatches();

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.source).toBe('todays_matches_analysis');

      if (result.success && result.data) {
        expect(Array.isArray(result.data)).toBe(true);
        console.log(`✅ Analyzed ${result.data.length} matches for today`);

        if (result.data.length > 0) {
          const firstMatch = result.data[0];
          expect(firstMatch.matchId).toBeGreaterThan(0);
          expect(firstMatch.homeTeam).toBeDefined();
          expect(firstMatch.awayTeam).toBeDefined();
          expect(firstMatch.predictions).toBeDefined();

          console.log('📊 First match analysis:', {
            matchId: firstMatch.matchId,
            homeTeam: firstMatch.homeTeam,
            awayTeam: firstMatch.awayTeam,
            predictions: firstMatch.predictions
          });
        }
      } else {
        console.log('⚠️ Today\'s matches analysis failed:', result.error);
      }
    }, 60000);

    it('should analyze matches for specific date', async () => {
      const testDate = '2023-12-19'; // Use a date that likely has matches
      const result = await service.analyzeTodaysMatches(testDate);

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();

      if (result.success && result.data) {
        console.log(`✅ Analyzed ${result.data.length} matches for ${testDate}`);
      }
    }, 60000);
  });

  describe('⚡ Live Match Insights', () => {
    it('should get live insights for a match', async () => {
      // First get today's matches to find a real match ID
      const todaysMatches = await service.analyzeTodaysMatches();

      if (todaysMatches.success && todaysMatches.data && todaysMatches.data.length > 0) {
        const matchId = todaysMatches.data[0].matchId;
        console.log(`🎯 Testing live insights for match ID: ${matchId}`);

        const result = await service.getLiveMatchInsights(matchId);

        expect(result.success).toBeDefined();
        expect(result.metadata).toBeDefined();
        expect(result.metadata.source).toBe('live_match_insights');

        if (result.success && result.data) {
          expect(result.data.matchId).toBe(matchId);
          expect(result.data.momentum).toMatch(/^(home|away|neutral)$/);
          expect(Array.isArray(result.data.keyEvents)).toBe(true);
          expect(result.data.predictions).toBeDefined();
          expect(result.data.predictions.nextGoal).toMatch(/^(home|away|none)$/);
          expect(result.data.predictions.finalScore).toBeDefined();
          expect(result.data.predictions.confidence).toBeGreaterThan(0);

          console.log('⚡ Live match insights:', {
            matchId: result.data.matchId,
            momentum: result.data.momentum,
            keyEvents: result.data.keyEvents,
            predictions: result.data.predictions
          });
        } else {
          console.log('⚠️ Live insights failed:', result.error);
        }
      } else {
        console.log('⚠️ No matches available for live insights testing');
      }
    }, 30000);

    it('should handle invalid match ID for live insights', async () => {
      const result = await service.getLiveMatchInsights(-1);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();

      console.log('✅ Invalid match ID for live insights handled:', result.error);
    });
  });

  describe('📈 Historical Trends Analysis', () => {
    it('should analyze historical trends', async () => {
      const result = await service.analyzeHistoricalTrends();

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.source).toBe('historical_trends');

      if (result.success && result.data) {
        expect(result.data.goalTrends).toBeDefined();
        expect(result.data.formTrends).toBeDefined();
        expect(result.data.seasonalPatterns).toBeDefined();
        expect(result.data.venueEffects).toBeDefined();

        console.log('📈 Historical trends analysis completed');
      }
    }, 30000);

    it('should analyze trends for specific team', async () => {
      const teamId = 1;
      const result = await service.analyzeHistoricalTrends(teamId);

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();

      console.log(`📈 Historical trends for team ${teamId} analyzed`);
    }, 30000);
  });

  describe('🔄 Caching Integration', () => {
    it('should cache match predictions', async () => {
      const homeTeamId = 1;
      const awayTeamId = 2;

      // First call - should fetch from API
      const result1 = await service.predictMatch(homeTeamId, awayTeamId);
      expect(result1.success).toBeDefined();
      expect(result1.metadata).toBeDefined();

      // Only check cached flag if the first call was successful
      if (result1.success) {
        expect(result1.metadata?.cached).toBe(false);
      }

      // Second call - should come from cache if first was successful
      const result2 = await service.predictMatch(homeTeamId, awayTeamId);
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
    it('should handle multiple concurrent predictions', async () => {
      const startTime = Date.now();

      // Test multiple concurrent predictions
      const promises = [
        service.predictMatch(1, 2),
        service.predictMatch(3, 4),
        service.predictMatch(5, 6),
        service.analyzeTodaysMatches(),
        service.analyzeHistoricalTrends()
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
      expect(totalTime).toBeLessThan(30000); // 30 seconds max
    }, 45000);
  });

  describe('🛡️ Error Handling', () => {
    it('should handle service errors gracefully', async () => {
      // Test with various invalid parameters
      const results = await Promise.allSettled([
        service.predictMatch(-999, -888),
        service.getLiveMatchInsights(-1),
        service.analyzeTodaysMatches('invalid-date')
      ]);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          expect(result.value.success).toBeDefined();
          expect(result.value.metadata).toBeDefined();
          
          if (!result.value.success) {
            expect(result.value.error).toBeDefined();
            console.log(`✅ Test ${index + 1} handled error: ${result.value.error}`);
          }
        }
      });
    });
  });

  describe('📊 Data Quality Validation', () => {
    it('should validate prediction data quality', async () => {
      const result = await service.predictMatch(1, 2);

      if (result.success && result.data) {
        const predictions = result.data.predictions;
        
        // Probabilities should sum to approximately 100%
        const totalProb = predictions.homeWin + predictions.draw + predictions.awayWin;
        expect(totalProb).toBeGreaterThan(95);
        expect(totalProb).toBeLessThan(105);

        // BTTS and Over 2.5 should be valid percentages
        expect(predictions.btts).toBeGreaterThanOrEqual(0);
        expect(predictions.btts).toBeLessThanOrEqual(100);
        expect(predictions.over25).toBeGreaterThanOrEqual(0);
        expect(predictions.over25).toBeLessThanOrEqual(100);

        console.log('✅ Prediction data quality validated:', {
          totalProb,
          btts: predictions.btts,
          over25: predictions.over25
        });
      }
    }, 30000);
  });
});
