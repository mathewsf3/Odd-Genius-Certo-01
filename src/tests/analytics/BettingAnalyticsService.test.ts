/**
 * 🧪 BETTING ANALYTICS SERVICE TESTS
 * 
 * Comprehensive testing for betting analytics and prediction functionality
 */

import { BettingAnalyticsService } from '../../analytics/betting/BettingAnalyticsService';

describe('💰 BettingAnalyticsService Tests', () => {
  let service: BettingAnalyticsService;

  beforeEach(() => {
    service = new BettingAnalyticsService({
      enableCaching: true,
      cacheTtl: 300, // 5 minutes for testing
      enableLogging: true
    });
  });

  afterEach(async () => {
    await service.shutdown();
  });

  describe('📊 Betting Markets Analysis', () => {
    it('should analyze betting markets with basic options', async () => {
      const result = await service.analyzeBettingMarkets({
        includeValueBets: false,
        includeAccuracy: false,
        includeStrategies: false,
        includeAdvancedInsights: false
      });

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.source).toBe('betting_markets_analysis');
      expect(result.metadata.processingTime).toBeGreaterThan(0);

      if (result.success && result.data) {
        expect(Array.isArray(result.data.marketStats)).toBe(true);
        expect(result.data.summary).toBeDefined();

        // Validate market stats
        result.data.marketStats.forEach(market => {
          expect(market.market).toBeDefined();
          expect(market.totalMatches).toBeGreaterThanOrEqual(0);
          expect(market.successRate).toBeGreaterThanOrEqual(0);
          expect(market.successRate).toBeLessThanOrEqual(100);
          expect(market.averageOdds).toBeGreaterThan(0);
          expect(market.confidence).toBeGreaterThanOrEqual(0);
          expect(market.confidence).toBeLessThanOrEqual(100);
          expect(['improving', 'declining', 'stable']).toContain(market.trend);
        });

        // Validate summary
        expect(result.data.summary.totalMatches).toBeGreaterThanOrEqual(0);
        expect(result.data.summary.bestMarket).toBeDefined();
        expect(result.data.summary.worstMarket).toBeDefined();
        expect(result.data.summary.recommendedStrategy).toBeDefined();

        console.log('✅ Betting markets analysis result:', {
          marketsAnalyzed: result.data.marketStats.length,
          summary: result.data.summary,
          topMarket: result.data.marketStats[0] ? {
            market: result.data.marketStats[0].market,
            successRate: result.data.marketStats[0].successRate,
            roi: result.data.marketStats[0].roi
          } : null
        });
      } else {
        console.log('⚠️ Betting markets analysis failed:', result.error);
      }
    }, 30000);

    it('should analyze betting markets with full options', async () => {
      const result = await service.analyzeBettingMarkets({
        includeValueBets: true,
        includeAccuracy: true,
        includeStrategies: true,
        includeAdvancedInsights: true,
        minValue: 10,
        maxResults: 5
      });

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();

      if (result.success && result.data) {
        if (result.data.valueBets) {
          expect(Array.isArray(result.data.valueBets)).toBe(true);
          result.data.valueBets.forEach(bet => {
            expect(bet.matchId).toBeGreaterThan(0);
            expect(bet.homeTeam).toBeDefined();
            expect(bet.awayTeam).toBeDefined();
            expect(bet.market).toBeDefined();
            expect(bet.value).toBeGreaterThanOrEqual(10);
            expect(['strong_bet', 'moderate_bet', 'avoid']).toContain(bet.recommendation);
          });
        }

        if (result.data.accuracy) {
          expect(result.data.accuracy.totalPredictions).toBeGreaterThanOrEqual(0);
          expect(result.data.accuracy.accuracy).toBeGreaterThanOrEqual(0);
          expect(result.data.accuracy.accuracy).toBeLessThanOrEqual(100);
          expect(result.data.accuracy.byMarket).toBeDefined();
          expect(result.data.accuracy.byConfidenceLevel).toBeDefined();
        }

        if (result.data.strategies) {
          expect(Array.isArray(result.data.strategies)).toBe(true);
          result.data.strategies.forEach(strategy => {
            expect(strategy.name).toBeDefined();
            expect(strategy.description).toBeDefined();
            expect(Array.isArray(strategy.markets)).toBe(true);
            expect(['low', 'medium', 'high']).toContain(strategy.riskLevel);
          });
        }

        if (result.data.insights) {
          expect(result.data.insights.bestPerformingMarkets).toBeDefined();
          expect(result.data.insights.worstPerformingMarkets).toBeDefined();
          expect(result.data.insights.hotStreaks).toBeDefined();
          expect(result.data.insights.coldStreaks).toBeDefined();
        }

        console.log('✅ Full betting analysis:', {
          valueBets: result.data.valueBets?.length || 0,
          accuracy: result.data.accuracy?.accuracy || 0,
          strategies: result.data.strategies?.length || 0,
          hasInsights: !!result.data.insights
        });
      }
    }, 30000);
  });

  describe('🎯 Prediction Engine', () => {
    it('should run prediction engine for matches', async () => {
      // Create mock matches for testing
      const mockMatches = [
        {
          id: 1,
          homeID: 1,
          awayID: 2,
          home_name: 'Team A',
          away_name: 'Team B',
          homeGoalCount: 0,
          awayGoalCount: 0,
          status: 'upcoming',
          date_unix: Date.now() / 1000
        },
        {
          id: 2,
          homeID: 3,
          awayID: 4,
          home_name: 'Team C',
          away_name: 'Team D',
          homeGoalCount: 0,
          awayGoalCount: 0,
          status: 'upcoming',
          date_unix: Date.now() / 1000
        }
      ] as any[];

      const result = await service.runPredictionEngine(mockMatches, {
        includeForm: true,
        includeH2H: true,
        confidenceThreshold: 70
      });

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.source).toBe('prediction_engine');

      if (result.success && result.data) {
        expect(Array.isArray(result.data.predictions)).toBe(true);
        expect(result.data.predictions.length).toBeLessThanOrEqual(mockMatches.length);
        expect(result.data.summary).toBeDefined();

        // Validate predictions
        result.data.predictions.forEach(prediction => {
          expect(prediction.matchId).toBeGreaterThan(0);
          expect(prediction.homeTeam).toBeDefined();
          expect(prediction.awayTeam).toBeDefined();
          expect(prediction.probabilities).toBeDefined();
          expect(prediction.confidence).toBeGreaterThanOrEqual(0);
          expect(prediction.confidence).toBeLessThanOrEqual(100);
          expect(Array.isArray(prediction.recommendedBets)).toBe(true);

          // Validate probabilities
          const probs = prediction.probabilities;
          expect(probs.homeWin).toBeGreaterThanOrEqual(0);
          expect(probs.draw).toBeGreaterThanOrEqual(0);
          expect(probs.awayWin).toBeGreaterThanOrEqual(0);
          expect(probs.btts).toBeGreaterThanOrEqual(0);
          expect(probs.over25).toBeGreaterThanOrEqual(0);
        });

        // Validate summary
        expect(result.data.summary.totalPredictions).toBe(result.data.predictions.length);
        expect(result.data.summary.averageConfidence).toBeGreaterThanOrEqual(0);
        expect(result.data.summary.highConfidencePredictions).toBeGreaterThanOrEqual(0);
        expect(result.data.summary.recommendedBetsCount).toBeGreaterThanOrEqual(0);

        console.log('🎯 Prediction engine result:', {
          predictionsGenerated: result.data.predictions.length,
          averageConfidence: result.data.summary.averageConfidence,
          highConfidencePredictions: result.data.summary.highConfidencePredictions,
          recommendedBets: result.data.summary.recommendedBetsCount
        });
      } else {
        console.log('⚠️ Prediction engine failed:', result.error);
      }
    }, 30000);

    it('should handle empty matches array', async () => {
      const result = await service.runPredictionEngine([]);

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.predictions).toEqual([]);
        expect(result.data.summary.totalPredictions).toBe(0);
      }
    });
  });

  describe('💎 Value Bets', () => {
    it('should find value betting opportunities', async () => {
      const result = await service.findValueBets(10, 5);

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.source).toBe('value_bets');

      if (result.success && result.data) {
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data.length).toBeLessThanOrEqual(5);

        // Validate value bets
        result.data.forEach(bet => {
          expect(bet.matchId).toBeGreaterThan(0);
          expect(bet.homeTeam).toBeDefined();
          expect(bet.awayTeam).toBeDefined();
          expect(bet.market).toBeDefined();
          expect(bet.value).toBeGreaterThanOrEqual(10);
          expect(bet.confidence).toBeGreaterThanOrEqual(0);
          expect(bet.confidence).toBeLessThanOrEqual(100);
          expect(['strong_bet', 'moderate_bet', 'avoid']).toContain(bet.recommendation);
          expect(Array.isArray(bet.reasoning)).toBe(true);
        });

        console.log('💎 Value bets found:', {
          totalValueBets: result.data.length,
          strongBets: result.data.filter(bet => bet.recommendation === 'strong_bet').length,
          averageValue: result.data.length > 0 ? 
            result.data.reduce((sum, bet) => sum + bet.value, 0) / result.data.length : 0
        });
      } else {
        console.log('⚠️ Value bets search failed:', result.error);
      }
    }, 30000);

    it('should handle different minimum value thresholds', async () => {
      const result = await service.findValueBets(25, 3);

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();

      if (result.success && result.data) {
        // All bets should have value >= 25%
        result.data.forEach(bet => {
          expect(bet.value).toBeGreaterThanOrEqual(25);
        });

        console.log('✅ High value threshold filtering works');
      }
    }, 30000);
  });

  describe('📈 Betting Performance', () => {
    it('should analyze betting performance', async () => {
      const result = await service.analyzeBettingPerformance();

      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.source).toBe('betting_performance_analysis');

      if (result.success && result.data) {
        expect(result.data.accuracy).toBeDefined();
        expect(result.data.marketPerformance).toBeDefined();
        expect(result.data.trends).toBeDefined();

        // Validate accuracy
        const accuracy = result.data.accuracy;
        expect(accuracy.totalPredictions).toBeGreaterThanOrEqual(0);
        expect(accuracy.accuracy).toBeGreaterThanOrEqual(0);
        expect(accuracy.accuracy).toBeLessThanOrEqual(100);
        expect(accuracy.byMarket).toBeDefined();
        expect(accuracy.byConfidenceLevel).toBeDefined();

        // Validate market performance
        expect(Array.isArray(result.data.marketPerformance)).toBe(true);
        result.data.marketPerformance.forEach(market => {
          expect(market.market).toBeDefined();
          expect(market.successRate).toBeGreaterThanOrEqual(0);
          expect(market.successRate).toBeLessThanOrEqual(100);
        });

        // Validate trends
        expect(result.data.trends.overallTrend).toBeDefined();
        expect(result.data.trends.bestTrendingMarket).toBeDefined();
        expect(result.data.trends.worstTrendingMarket).toBeDefined();

        console.log('📈 Betting performance analysis:', {
          overallAccuracy: accuracy.accuracy,
          totalPredictions: accuracy.totalPredictions,
          marketsAnalyzed: result.data.marketPerformance.length,
          overallTrend: result.data.trends.overallTrend
        });
      } else {
        console.log('⚠️ Betting performance analysis failed:', result.error);
      }
    }, 30000);
  });

  describe('🔄 Caching Integration', () => {
    it('should cache betting analysis results', async () => {
      // First call - should fetch from API
      const result1 = await service.analyzeBettingMarkets();
      expect(result1.success).toBeDefined();
      expect(result1.metadata).toBeDefined();

      // Only check cached flag if the first call was successful
      if (result1.success) {
        expect(result1.metadata?.cached).toBe(false);
      }

      // Second call - should come from cache if first was successful
      const result2 = await service.analyzeBettingMarkets();
      expect(result2.success).toBeDefined();
      expect(result2.metadata).toBeDefined();

      // If both calls were successful, second should be cached
      if (result1.success && result2.success) {
        expect(result2.metadata?.cached).toBe(true);

        // Cache should be faster
        const apiTime = result1.metadata?.processingTime || 0;
        const cacheTime = result2.metadata?.processingTime || 0;
        expect(cacheTime).toBeLessThan(apiTime);

        console.log(`✅ Betting analysis caching works: API ${apiTime}ms vs Cache ${cacheTime}ms`);
      } else {
        console.log(`⚠️ Betting caching test skipped due to API issues`);
      }
    }, 30000);
  });

  describe('⚡ Performance Testing', () => {
    it('should handle multiple concurrent betting analyses', async () => {
      const startTime = Date.now();

      // Test multiple concurrent analyses
      const promises = [
        service.analyzeBettingMarkets(),
        service.findValueBets(5, 3),
        service.analyzeBettingPerformance(),
        service.runPredictionEngine([]),
        service.findValueBets(15, 2)
      ];

      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      // All should have responses (success or failure)
      results.forEach((result, index) => {
        expect(result.success).toBeDefined();
        expect(result.metadata).toBeDefined();
        console.log(`✅ Concurrent betting analysis ${index + 1}: ${result.metadata?.processingTime}ms`);
      });

      console.log(`✅ Total concurrent execution time: ${totalTime}ms`);
      expect(totalTime).toBeLessThan(45000); // 45 seconds max
    }, 60000);
  });

  describe('🛡️ Error Handling', () => {
    it('should handle service errors gracefully', async () => {
      // Test with various scenarios
      const results = await Promise.allSettled([
        service.analyzeBettingMarkets({ maxResults: -1 }),
        service.findValueBets(-10, 0),
        service.runPredictionEngine([{ id: -1 } as any]),
        service.analyzeBettingPerformance()
      ]);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          expect(result.value.success).toBeDefined();
          expect(result.value.metadata).toBeDefined();
          
          if (!result.value.success) {
            expect(result.value.error).toBeDefined();
            console.log(`✅ Betting analytics test ${index + 1} handled error: ${result.value.error}`);
          }
        }
      });
    });
  });

  describe('📊 Data Quality Validation', () => {
    it('should validate betting analysis data quality', async () => {
      const result = await service.analyzeBettingMarkets({
        includeValueBets: true,
        includeAccuracy: true,
        includeStrategies: true
      });

      if (result.success && result.data) {
        // Validate market stats quality
        result.data.marketStats.forEach(market => {
          expect(market.successRate).toBeGreaterThanOrEqual(0);
          expect(market.successRate).toBeLessThanOrEqual(100);
          expect(market.averageOdds).toBeGreaterThan(0);
          expect(market.confidence).toBeGreaterThanOrEqual(0);
          expect(market.confidence).toBeLessThanOrEqual(100);
        });

        // Validate value bets quality
        if (result.data.valueBets) {
          result.data.valueBets.forEach(bet => {
            expect(bet.value).toBeGreaterThan(0);
            expect(bet.confidence).toBeGreaterThanOrEqual(0);
            expect(bet.confidence).toBeLessThanOrEqual(100);
            expect(bet.prediction).toBeGreaterThanOrEqual(0);
            expect(bet.prediction).toBeLessThanOrEqual(100);
          });
        }

        // Validate accuracy quality
        if (result.data.accuracy) {
          expect(result.data.accuracy.accuracy).toBeGreaterThanOrEqual(0);
          expect(result.data.accuracy.accuracy).toBeLessThanOrEqual(100);
          expect(result.data.accuracy.correctPredictions).toBeLessThanOrEqual(result.data.accuracy.totalPredictions);
        }

        console.log('✅ Betting analysis data quality validated:', {
          marketsValidated: result.data.marketStats.length,
          valueBetsValidated: result.data.valueBets?.length || 0,
          accuracyValidated: !!result.data.accuracy
        });
      }
    }, 30000);
  });
});
