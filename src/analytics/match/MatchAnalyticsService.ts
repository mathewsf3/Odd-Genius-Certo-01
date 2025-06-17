/**
 * 🏟️ MATCH ANALYTICS SERVICE
 * 
 * Advanced match analysis and prediction service
 * Utilizes: getMatch, getTodaysMatches, getLeagueMatches endpoints
 */

import { Match } from '../../models';
import { AnalyticsResult, BaseAnalyticsService, MatchAnalyticsData } from '../core/BaseAnalyticsService';
import { AnalyticsUtils } from '../utils/AnalyticsUtils';

export interface MatchPredictionOptions {
  includeForm?: boolean;
  includeH2H?: boolean;
  includeVenue?: boolean;
  formMatches?: number;
  h2hMatches?: number;
}

export interface LiveMatchInsight {
  matchId: number;
  currentMinute?: number;
  momentum: 'home' | 'away' | 'neutral';
  keyEvents: string[];
  predictions: {
    nextGoal: 'home' | 'away' | 'none';
    finalScore: { home: number; away: number };
    confidence: number;
  };
}

export class MatchAnalyticsService extends BaseAnalyticsService {

  /**
   * 🎯 PREDICT MATCH OUTCOME
   * Advanced match prediction using multiple data sources
   */
  async predictMatch(
    homeTeamId: number, 
    awayTeamId: number, 
    options: MatchPredictionOptions = {}
  ): Promise<AnalyticsResult<MatchAnalyticsData>> {
    const startTime = Date.now();
    const cacheKey = `match_prediction:${homeTeamId}:${awayTeamId}:${JSON.stringify(options)}`;

    try {
      this.log(`🎯 Predicting match: Team ${homeTeamId} vs Team ${awayTeamId}`);

      const computedResult = await this.getCachedOrCompute(cacheKey, async () => {
        // Get team data
        const [homeTeamResult, awayTeamResult] = await Promise.all([
          this.footyStatsService.getTeam(homeTeamId, true),
          this.footyStatsService.getTeam(awayTeamId, true)
        ]);

        if (!homeTeamResult.success || !awayTeamResult.success) {
          throw new Error('Failed to fetch team data');
        }

        // Get recent form if requested
        let homeForm: Match[] = [];
        let awayForm: Match[] = [];

        if (options.includeForm) {
          const [homeStatsResult, awayStatsResult] = await Promise.all([
            this.footyStatsService.getTeamLastXStats(homeTeamId),
            this.footyStatsService.getTeamLastXStats(awayTeamId)
          ]);

          // Extract match data from stats (simplified for this example)
          homeForm = this.extractMatchesFromStats(homeStatsResult.data);
          awayForm = this.extractMatchesFromStats(awayStatsResult.data);
        }

        // Calculate predictions
        const predictions = this.calculateMatchPredictions(
          homeTeamResult.data!,
          awayTeamResult.data!,
          homeForm,
          awayForm,
          options
        );

        const result: MatchAnalyticsData = {
          matchId: 0, // Will be set when actual match is created
          homeTeam: homeTeamResult.data!.name,
          awayTeam: awayTeamResult.data!.name,
          predictions,
          confidence: this.calculatePredictionConfidence(homeForm, awayForm, options),
          factors: this.identifyKeyFactors(homeTeamResult.data!, awayTeamResult.data!, homeForm, awayForm)
        };

        return result;
      });

      // Extract cached flag and create final result
      const { _cached, ...data } = computedResult;
      return this.createAnalyticsResult(
        data,
        'match_prediction',
        startTime,
        2, // Basic data points
        _cached || false
      );

    } catch (error) {
      this.log(`❌ Error predicting match: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to predict match: ${error instanceof Error ? error.message : String(error)}`,
        'match_prediction',
        startTime
      );
    }
  }

  /**
   * 📊 ANALYZE TODAY'S MATCHES
   * Comprehensive analysis of all today's matches
   */
  async analyzeTodaysMatches(date?: string): Promise<AnalyticsResult<MatchAnalyticsData[]>> {
    const startTime = Date.now();
    const targetDate = date || new Date().toISOString().split('T')[0];
    const cacheKey = `todays_matches_analysis:${targetDate}`;

    try {
      this.log(`📊 Analyzing today's matches for ${targetDate}`);

      return await this.getCachedOrCompute(cacheKey, async () => {
        // Get today's matches
        const matchesResult = await this.footyStatsService.getTodaysMatches(targetDate);
        
        if (!matchesResult.success || !matchesResult.data) {
          throw new Error('Failed to fetch today\'s matches');
        }

        const matches = matchesResult.data;
        this.log(`📋 Found ${matches.length} matches for ${targetDate}`);

        // Analyze each match
        const analysisPromises = matches.map(async (match) => {
          try {
            const prediction = await this.predictMatch(match.homeID, match.awayID, {
              includeForm: true,
              formMatches: 5
            });

            if (prediction.success && prediction.data) {
              return {
                ...prediction.data,
                matchId: match.id
              };
            }
            return null;
          } catch (error) {
            this.log(`⚠️ Failed to analyze match ${match.id}: ${error}`, 'warn');
            return null;
          }
        });

        const analyses = await Promise.all(analysisPromises);
        const validAnalyses = analyses.filter(analysis => analysis !== null) as MatchAnalyticsData[];

        return this.createAnalyticsResult(
          validAnalyses,
          'todays_matches_analysis',
          startTime,
          matches.length
        );
      });

    } catch (error) {
      this.log(`❌ Error analyzing today's matches: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to analyze today's matches: ${error instanceof Error ? error.message : String(error)}`,
        'todays_matches_analysis',
        startTime
      );
    }
  }

  /**
   * ⚡ GET LIVE MATCH INSIGHTS
   * Real-time analysis for ongoing matches
   */
  async getLiveMatchInsights(matchId: number): Promise<AnalyticsResult<LiveMatchInsight>> {
    const startTime = Date.now();
    const cacheKey = `live_match_insights:${matchId}`;

    try {
      this.log(`⚡ Getting live insights for match ${matchId}`);

      return await this.getCachedOrCompute(cacheKey, async () => {
        // Get match details
        const matchResult = await this.footyStatsService.getMatch(matchId);
        
        if (!matchResult.success || !matchResult.data) {
          throw new Error('Failed to fetch match data');
        }

        const match = matchResult.data;

        // Calculate live insights
        const insights: LiveMatchInsight = {
          matchId: match.id,
          momentum: this.calculateMomentum(match),
          keyEvents: this.identifyKeyEvents(match),
          predictions: {
            nextGoal: this.predictNextGoal(match),
            finalScore: this.predictFinalScore(match),
            confidence: this.calculateLiveConfidence(match)
          }
        };

        return this.createAnalyticsResult(
          insights,
          'live_match_insights',
          startTime,
          1
        );
      }, 60); // Cache for only 1 minute for live data

    } catch (error) {
      this.log(`❌ Error getting live match insights: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to get live match insights: ${error instanceof Error ? error.message : String(error)}`,
        'live_match_insights',
        startTime
      );
    }
  }

  /**
   * 📈 ANALYZE HISTORICAL MATCH TRENDS
   * Historical analysis for pattern identification
   */
  async analyzeHistoricalTrends(
    teamId?: number,
    leagueId?: number,
    dateRange?: { start: Date; end: Date }
  ): Promise<AnalyticsResult<any>> {
    const startTime = Date.now();
    const cacheKey = `historical_trends:${teamId}:${leagueId}:${dateRange?.start}:${dateRange?.end}`;

    try {
      this.log(`📈 Analyzing historical trends`);

      return await this.getCachedOrCompute(cacheKey, async () => {
        // Implementation for historical trend analysis
        // This would involve fetching league matches and analyzing patterns
        
        const trends = {
          goalTrends: [],
          formTrends: [],
          seasonalPatterns: [],
          venueEffects: []
        };

        return this.createAnalyticsResult(
          trends,
          'historical_trends',
          startTime,
          0
        );
      });

    } catch (error) {
      this.log(`❌ Error analyzing historical trends: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to analyze historical trends: ${error instanceof Error ? error.message : String(error)}`,
        'historical_trends',
        startTime
      );
    }
  }

  /**
   * 🔧 PRIVATE HELPER METHODS
   */

  private calculateMatchPredictions(
    homeTeam: any,
    awayTeam: any,
    homeForm: Match[],
    awayForm: Match[],
    options: MatchPredictionOptions
  ): MatchAnalyticsData['predictions'] {
    // Calculate goal expectancies based on team strength and form
    const homeGoalExpectancy = this.calculateGoalExpectancy(homeTeam, homeForm, true);
    const awayGoalExpectancy = this.calculateGoalExpectancy(awayTeam, awayForm, false);

    // Use Poisson distribution for match outcome probabilities
    const matchProbs = AnalyticsUtils.calculateMatchProbabilities(homeGoalExpectancy, awayGoalExpectancy);

    // Calculate BTTS and Over 2.5 probabilities
    const btts = this.calculateBTTSProbability(homeGoalExpectancy, awayGoalExpectancy);
    const over25 = this.calculateOver25Probability(homeGoalExpectancy, awayGoalExpectancy);

    return {
      homeWin: matchProbs.homeWin,
      draw: matchProbs.draw,
      awayWin: matchProbs.awayWin,
      btts,
      over25
    };
  }

  private calculateGoalExpectancy(team: any, form: Match[], isHome: boolean): number {
    // Base expectancy from team strength (simplified)
    let expectancy = 1.5; // League average

    // Adjust for home advantage
    if (isHome) expectancy *= 1.1;

    // Adjust based on recent form
    if (form.length > 0) {
      const recentGoals = form.slice(-5).map(match => {
        const isTeamHome = match.homeID === team.id;
        return isTeamHome ? match.homeGoalCount : match.awayGoalCount;
      });
      
      const formAverage = AnalyticsUtils.calculateAverage(recentGoals);
      expectancy = (expectancy + formAverage) / 2;
    }

    return Math.max(0.1, expectancy); // Minimum expectancy
  }

  private calculateBTTSProbability(homeExpectancy: number, awayExpectancy: number): number {
    // Probability that both teams score at least 1 goal
    const homeNoGoal = AnalyticsUtils.calculatePoissonProbability(homeExpectancy, 0);
    const awayNoGoal = AnalyticsUtils.calculatePoissonProbability(awayExpectancy, 0);
    
    const bttsProb = (1 - homeNoGoal) * (1 - awayNoGoal);
    return Math.round(bttsProb * 100 * 100) / 100;
  }

  private calculateOver25Probability(homeExpectancy: number, awayExpectancy: number): number {
    // Probability of more than 2.5 total goals
    let over25Prob = 0;
    
    for (let homeGoals = 0; homeGoals <= 5; homeGoals++) {
      for (let awayGoals = 0; awayGoals <= 5; awayGoals++) {
        if (homeGoals + awayGoals > 2.5) {
          const prob = 
            AnalyticsUtils.calculatePoissonProbability(homeExpectancy, homeGoals) *
            AnalyticsUtils.calculatePoissonProbability(awayExpectancy, awayGoals);
          over25Prob += prob;
        }
      }
    }
    
    return Math.round(over25Prob * 100 * 100) / 100;
  }

  private calculatePredictionConfidence(
    homeForm: Match[],
    awayForm: Match[],
    options: MatchPredictionOptions
  ): number {
    let confidence = 50; // Base confidence

    // Increase confidence based on available data
    if (homeForm.length >= 5) confidence += 10;
    if (awayForm.length >= 5) confidence += 10;
    if (options.includeH2H) confidence += 15;
    if (options.includeVenue) confidence += 10;

    return Math.min(95, confidence); // Cap at 95%
  }

  private identifyKeyFactors(homeTeam: any, awayTeam: any, homeForm: Match[], awayForm: Match[]): string[] {
    const factors: string[] = [];

    // Add factors based on analysis
    if (homeForm.length > 0) {
      const homeFormString = AnalyticsUtils.calculateTeamForm(homeForm, homeTeam.id, 5);
      factors.push(`Home team form: ${homeFormString}`);
    }

    if (awayForm.length > 0) {
      const awayFormString = AnalyticsUtils.calculateTeamForm(awayForm, awayTeam.id, 5);
      factors.push(`Away team form: ${awayFormString}`);
    }

    factors.push('Home advantage considered');
    factors.push('Goal expectancy calculated');

    return factors;
  }

  private extractMatchesFromStats(statsData: any): Match[] {
    // This would extract match data from team stats
    // Implementation depends on the actual stats data structure
    return [];
  }

  private calculateMomentum(match: Match): 'home' | 'away' | 'neutral' {
    // Analyze current match state to determine momentum
    // This is simplified - would need more detailed match data
    if (match.homeGoalCount > match.awayGoalCount) return 'home';
    if (match.awayGoalCount > match.homeGoalCount) return 'away';
    return 'neutral';
  }

  private identifyKeyEvents(match: Match): string[] {
    const events: string[] = [];

    if (match.homeGoalCount > 0) events.push(`${match.homeGoalCount} home goals`);
    if (match.awayGoalCount > 0) events.push(`${match.awayGoalCount} away goals`);
    if (match.team_a_red_cards && match.team_a_red_cards > 0) events.push(`${match.team_a_red_cards} home red cards`);
    if (match.team_b_red_cards && match.team_b_red_cards > 0) events.push(`${match.team_b_red_cards} away red cards`);

    return events;
  }

  private predictNextGoal(match: Match): 'home' | 'away' | 'none' {
    // Simplified next goal prediction
    if (match.homeGoalCount > match.awayGoalCount) return 'home';
    if (match.awayGoalCount > match.homeGoalCount) return 'away';
    return 'none';
  }

  private predictFinalScore(match: Match): { home: number; away: number } {
    // Simplified final score prediction
    return {
      home: match.homeGoalCount + 1,
      away: match.awayGoalCount
    };
  }

  private calculateLiveConfidence(match: Match): number {
    // Calculate confidence based on match progress and current state
    return 75; // Simplified
  }
}
