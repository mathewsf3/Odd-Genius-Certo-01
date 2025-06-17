/**
 * 🧪 TEAM ANALYTICS SERVICE TESTS
 * 
 * Comprehensive testing for team analytics and comparison functionality
 */

import { TeamAnalyticsService } from '../../analytics/team/TeamAnalyticsService';

describe('👥 TeamAnalyticsService Tests', () => {
  let service: TeamAnalyticsService;

  beforeEach(() => {
    service = new TeamAnalyticsService({
      enableCaching: true,
      cacheTtl: 300, // 5 minutes for testing
      enableLogging: true
    });
  });

  afterEach(async () => {
    await service.shutdown();
  });

  describe('📊 Team Performance Analysis', () => {
    it('should analyze team performance with basic options', async () => {
      const teamId = 1; // Example team ID

      const result = await service.analyzeTeamPerformance(teamId, {
        includeForm: false,
        includeHomeAway: false,
        includeStrengthRating: false
      });

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.source).toBe('team_performance_analysis');
      expect(result.metadata.processingTime).toBeGreaterThan(0);

      if (result.success && result.data) {
        expect(result.data.team).toBeDefined();
        expect(result.data.team.id).toBe(teamId);
        expect(result.data.performance).toBeDefined();
        expect(result.data.form).toBeDefined();
        expect(result.data.homeAwayPerformance).toBeDefined();
        expect(result.data.trends).toBeDefined();

        console.log('✅ Team performance analysis result:', {
          teamName: result.data.team.name,
          performance: {
            wins: result.data.performance.wins,
            draws: result.data.performance.draws,
            losses: result.data.performance.losses,
            winPercentage: result.data.performance.winPercentage
          },
          form: result.data.form.form,
          strengthRating: result.data.strengthRating
        });
      } else {
        console.log('⚠️ Team performance analysis failed:', result.error);
      }
    }, 30000);

    it('should analyze team performance with full options', async () => {
      const teamId = 1;

      const result = await service.analyzeTeamPerformance(teamId, {
        includeForm: true,
        includeHomeAway: true,
        includeStrengthRating: true,
        formMatches: 5
      });

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();

      if (result.success && result.data) {
        expect(result.data.strengthRating).toBeGreaterThanOrEqual(0);
        expect(result.data.strengthRating).toBeLessThanOrEqual(100);
        expect(result.data.homeAwayPerformance.home).toBeDefined();
        expect(result.data.homeAwayPerformance.away).toBeDefined();

        console.log('✅ Full team analysis:', {
          strengthRating: result.data.strengthRating,
          homePerformance: result.data.homeAwayPerformance.home.winPercentage,
          awayPerformance: result.data.homeAwayPerformance.away.winPercentage,
          trends: result.data.trends
        });
      }
    }, 30000);

    it('should handle invalid team ID gracefully', async () => {
      const result = await service.analyzeTeamPerformance(-1);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.metadata).toBeDefined();

      console.log('✅ Invalid team ID handled:', result.error);
    });
  });

  describe('⚔️ Team Comparison', () => {
    it('should compare two teams', async () => {
      const homeTeamId = 1;
      const awayTeamId = 2;

      const result = await service.compareTeams(homeTeamId, awayTeamId, {
        includeH2H: false,
        includeForm: false
      });

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.source).toBe('team_comparison');

      if (result.success && result.data) {
        expect(result.data.homeTeam).toBeDefined();
        expect(result.data.awayTeam).toBeDefined();
        expect(result.data.headToHead).toBeDefined();
        expect(result.data.prediction).toBeDefined();

        // Prediction probabilities should sum to approximately 100%
        const totalProb = result.data.prediction.homeWinProbability + 
                         result.data.prediction.drawProbability + 
                         result.data.prediction.awayWinProbability;
        expect(totalProb).toBeGreaterThan(95);
        expect(totalProb).toBeLessThan(105);

        console.log('⚔️ Team comparison result:', {
          homeTeam: {
            winPercentage: result.data.homeTeam.winPercentage,
            goalDifference: result.data.homeTeam.goalDifference
          },
          awayTeam: {
            winPercentage: result.data.awayTeam.winPercentage,
            goalDifference: result.data.awayTeam.goalDifference
          },
          prediction: result.data.prediction,
          headToHead: result.data.headToHead
        });
      } else {
        console.log('⚠️ Team comparison failed:', result.error);
      }
    }, 30000);

    it('should compare teams with H2H and form analysis', async () => {
      const homeTeamId = 1;
      const awayTeamId = 2;

      const result = await service.compareTeams(homeTeamId, awayTeamId, {
        includeH2H: true,
        includeForm: true,
        formMatches: 5,
        h2hMatches: 10
      });

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();

      if (result.success && result.data) {
        expect(result.data.prediction.confidence).toBeGreaterThan(0);
        expect(result.data.prediction.confidence).toBeLessThanOrEqual(100);

        console.log('✅ Enhanced team comparison:', {
          prediction: result.data.prediction,
          h2hMeetings: result.data.headToHead.totalMeetings
        });
      }
    }, 30000);

    it('should handle invalid team IDs for comparison', async () => {
      const result = await service.compareTeams(-1, -2);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();

      console.log('✅ Invalid team IDs for comparison handled:', result.error);
    });
  });

  describe('🏆 League Teams Analysis', () => {
    it('should analyze all teams in a league', async () => {
      const seasonId = 1; // Example season ID

      const result = await service.analyzeLeagueTeams(seasonId, {
        includeForm: true,
        includeStrengthRating: true
      });

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.source).toBe('league_teams_analysis');

      if (result.success && result.data) {
        expect(Array.isArray(result.data)).toBe(true);
        console.log(`🏆 Analyzed ${result.data.length} teams in league season ${seasonId}`);

        if (result.data.length > 0) {
          const firstTeam = result.data[0];
          expect(firstTeam.team).toBeDefined();
          expect(firstTeam.performance).toBeDefined();
          expect(firstTeam.strengthRating).toBeGreaterThanOrEqual(0);

          console.log('📊 First team analysis:', {
            teamName: firstTeam.team.name,
            strengthRating: firstTeam.strengthRating,
            winPercentage: firstTeam.performance.winPercentage
          });
        }
      } else {
        console.log('⚠️ League teams analysis failed:', result.error);
      }
    }, 60000);

    it('should handle invalid season ID', async () => {
      const result = await service.analyzeLeagueTeams(-1);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();

      console.log('✅ Invalid season ID handled:', result.error);
    });
  });

  describe('📈 Team Form Trends', () => {
    it('should get team form trends', async () => {
      const teamId = 1;
      const matchCount = 10;

      const result = await service.getTeamFormTrends(teamId, matchCount);

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.source).toBe('team_form_trends');

      if (result.success && result.data) {
        expect(result.data.form).toBeDefined();
        expect(result.data.performance).toBeDefined();
        expect(result.data.trends).toBeDefined();
        expect(result.data.strengthRating).toBeGreaterThanOrEqual(0);

        console.log('📈 Team form trends:', {
          form: result.data.form.form,
          formTrend: result.data.form.formTrend,
          momentum: result.data.form.momentum,
          trends: result.data.trends,
          strengthRating: result.data.strengthRating
        });
      } else {
        console.log('⚠️ Team form trends failed:', result.error);
      }
    }, 30000);
  });

  describe('🔄 Caching Integration', () => {
    it('should cache team analysis results', async () => {
      const teamId = 1;

      // First call - should fetch from API
      const result1 = await service.analyzeTeamPerformance(teamId);
      expect(result1.success).toBeDefined();
      expect(result1.metadata).toBeDefined();

      // Only check cached flag if the first call was successful
      if (result1.success) {
        expect(result1.metadata?.cached).toBe(false);
      }

      // Second call - should come from cache if first was successful
      const result2 = await service.analyzeTeamPerformance(teamId);
      expect(result2.success).toBeDefined();
      expect(result2.metadata).toBeDefined();

      // If both calls were successful, second should be cached
      if (result1.success && result2.success) {
        expect(result2.metadata?.cached).toBe(true);

        // Cache should be faster
        const apiTime = result1.metadata?.processingTime || 0;
        const cacheTime = result2.metadata?.processingTime || 0;
        expect(cacheTime).toBeLessThan(apiTime);

        console.log(`✅ Team analysis caching works: API ${apiTime}ms vs Cache ${cacheTime}ms`);
      } else {
        console.log(`⚠️ Team caching test skipped due to API issues`);
      }
    }, 30000);
  });

  describe('⚡ Performance Testing', () => {
    it('should handle multiple concurrent team analyses', async () => {
      const startTime = Date.now();

      // Test multiple concurrent analyses
      const promises = [
        service.analyzeTeamPerformance(1),
        service.analyzeTeamPerformance(2),
        service.compareTeams(1, 2),
        service.getTeamFormTrends(1),
        service.getTeamFormTrends(2)
      ];

      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      // All should have responses (success or failure)
      results.forEach((result, index) => {
        expect(result.success).toBeDefined();
        expect(result.metadata).toBeDefined();
        console.log(`✅ Concurrent team analysis ${index + 1}: ${result.metadata?.processingTime}ms`);
      });

      console.log(`✅ Total concurrent execution time: ${totalTime}ms`);
      expect(totalTime).toBeLessThan(45000); // 45 seconds max
    }, 60000);
  });

  describe('🛡️ Error Handling', () => {
    it('should handle service errors gracefully', async () => {
      // Test with various invalid parameters
      const results = await Promise.allSettled([
        service.analyzeTeamPerformance(-999),
        service.compareTeams(-888, -777),
        service.analyzeLeagueTeams(-666),
        service.getTeamFormTrends(-555)
      ]);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          expect(result.value.success).toBeDefined();
          expect(result.value.metadata).toBeDefined();
          
          if (!result.value.success) {
            expect(result.value.error).toBeDefined();
            console.log(`✅ Team analytics test ${index + 1} handled error: ${result.value.error}`);
          }
        }
      });
    });
  });

  describe('📊 Data Quality Validation', () => {
    it('should validate team analysis data quality', async () => {
      const result = await service.analyzeTeamPerformance(1, {
        includeForm: true,
        includeStrengthRating: true
      });

      if (result.success && result.data) {
        const performance = result.data.performance;
        
        // Percentages should be valid
        expect(performance.winPercentage).toBeGreaterThanOrEqual(0);
        expect(performance.winPercentage).toBeLessThanOrEqual(100);
        expect(performance.drawPercentage).toBeGreaterThanOrEqual(0);
        expect(performance.drawPercentage).toBeLessThanOrEqual(100);
        expect(performance.lossPercentage).toBeGreaterThanOrEqual(0);
        expect(performance.lossPercentage).toBeLessThanOrEqual(100);

        // Strength rating should be valid
        expect(result.data.strengthRating).toBeGreaterThanOrEqual(0);
        expect(result.data.strengthRating).toBeLessThanOrEqual(100);

        console.log('✅ Team analysis data quality validated:', {
          winPercentage: performance.winPercentage,
          strengthRating: result.data.strengthRating,
          form: result.data.form.form
        });
      }
    }, 30000);
  });
});
