/**
 * 👥 TEAM ANALYTICS SERVICE
 * 
 * Advanced team analysis and comparison service
 * Utilizes: getTeam, getTeamLastXStats, getLeagueTeams endpoints
 */

import { Match, Team } from '../../models';
import { AnalyticsResult, BaseAnalyticsService } from '../core/BaseAnalyticsService';
import { AnalyticsUtils } from '../utils/AnalyticsUtils';
import { TeamAnalyticsHelpers, TeamComparisonResult, TeamFormAnalysis, TeamPerformanceMetrics } from '../utils/TeamAnalyticsHelpers';

export interface TeamAnalysisOptions {
  includeForm?: boolean;
  includeHomeAway?: boolean;
  formMatches?: number;
  includeStrengthRating?: boolean;
}

export interface TeamComparisonOptions {
  includeH2H?: boolean;
  h2hMatches?: number;
  includeForm?: boolean;
  formMatches?: number;
}

export interface DetailedTeamAnalysis {
  team: Team;
  performance: TeamPerformanceMetrics;
  form: TeamFormAnalysis;
  homeAwayPerformance: {
    home: TeamPerformanceMetrics;
    away: TeamPerformanceMetrics;
  };
  strengthRating: number;
  trends: {
    goalScoring: 'increasing' | 'decreasing' | 'stable';
    defending: 'increasing' | 'decreasing' | 'stable';
    overall: 'increasing' | 'decreasing' | 'stable';
  };
}

export class TeamAnalyticsService extends BaseAnalyticsService {

  /**
   * 📊 ANALYZE TEAM PERFORMANCE
   * Comprehensive team performance analysis
   */
  async analyzeTeamPerformance(
    teamId: number,
    options: TeamAnalysisOptions = {}
  ): Promise<AnalyticsResult<DetailedTeamAnalysis>> {
    const startTime = Date.now();
    const cacheKey = `team_analysis:${teamId}:${JSON.stringify(options)}`;

    try {
      this.log(`📊 Analyzing team performance for team ${teamId}`);

      const computedResult = await this.getCachedOrCompute(cacheKey, async () => {
        // Get team data
        const teamResult = await this.footyStatsService.getTeam(teamId, true);
        if (!teamResult.success || !teamResult.data) {
          throw new Error('Failed to fetch team data');
        }

        const team = teamResult.data;

        // Get team's recent stats for form analysis
        let recentMatches: Match[] = [];
        if (options.includeForm) {
          const statsResult = await this.footyStatsService.getTeamLastXStats(teamId);
          if (statsResult.success && statsResult.data) {
            recentMatches = this.extractMatchesFromStats(statsResult.data);
          }
        }

        // Calculate performance metrics
        const performance = TeamAnalyticsHelpers.calculatePerformanceMetrics(recentMatches, teamId);

        // Analyze form
        const form = options.includeForm
          ? TeamAnalyticsHelpers.analyzeTeamForm(recentMatches, teamId, options.formMatches || 5)
          : TeamAnalyticsHelpers.analyzeTeamForm([], teamId);

        // Calculate home/away performance
        const homeAwayPerformance = options.includeHomeAway
          ? TeamAnalyticsHelpers.calculateHomeAwayPerformance(recentMatches, teamId)
          : { home: performance, away: performance };

        // Calculate strength rating
        const strengthRating = options.includeStrengthRating
          ? TeamAnalyticsHelpers.calculateTeamStrength(performance, form)
          : 0;

        // Analyze trends
        const trends = this.analyzeTrends(recentMatches, teamId);

        const analysis: DetailedTeamAnalysis = {
          team,
          performance,
          form,
          homeAwayPerformance,
          strengthRating,
          trends
        };

        return analysis;
      });

      // Extract cached flag and create final result
      const { _cached, ...data } = computedResult;
      return this.createAnalyticsResult(
        data,
        'team_performance_analysis',
        startTime,
        1, // Basic data points
        _cached || false
      );

    } catch (error) {
      this.log(`❌ Error analyzing team performance: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to analyze team performance: ${error instanceof Error ? error.message : String(error)}`,
        'team_performance_analysis',
        startTime
      );
    }
  }

  /**
   * ⚔️ COMPARE TWO TEAMS
   * Head-to-head team comparison with predictions
   */
  async compareTeams(
    homeTeamId: number,
    awayTeamId: number,
    options: TeamComparisonOptions = {}
  ): Promise<AnalyticsResult<TeamComparisonResult>> {
    const startTime = Date.now();
    const cacheKey = `team_comparison:${homeTeamId}:${awayTeamId}:${JSON.stringify(options)}`;

    try {
      this.log(`⚔️ Comparing teams: ${homeTeamId} vs ${awayTeamId}`);

      const computedResult = await this.getCachedOrCompute(cacheKey, async () => {
        // Get both teams' data
        const [homeTeamResult, awayTeamResult] = await Promise.all([
          this.footyStatsService.getTeam(homeTeamId, true),
          this.footyStatsService.getTeam(awayTeamId, true)
        ]);

        if (!homeTeamResult.success || !awayTeamResult.success) {
          throw new Error('Failed to fetch team data');
        }

        // Get recent matches for both teams
        let homeMatches: Match[] = [];
        let awayMatches: Match[] = [];
        let allMatches: Match[] = [];

        if (options.includeForm) {
          const [homeStatsResult, awayStatsResult] = await Promise.all([
            this.footyStatsService.getTeamLastXStats(homeTeamId),
            this.footyStatsService.getTeamLastXStats(awayTeamId)
          ]);

          if (homeStatsResult.success) {
            homeMatches = this.extractMatchesFromStats(homeStatsResult.data);
          }
          if (awayStatsResult.success) {
            awayMatches = this.extractMatchesFromStats(awayStatsResult.data);
          }

          allMatches = [...homeMatches, ...awayMatches];
        }

        // Get head-to-head matches if requested
        let h2hMatches: Match[] = [];
        if (options.includeH2H) {
          // In a real implementation, you would fetch H2H matches
          // For now, we'll filter from available matches
          h2hMatches = allMatches.filter(match =>
            (match.homeID === homeTeamId && match.awayID === awayTeamId) ||
            (match.homeID === awayTeamId && match.awayID === homeTeamId)
          );
        }

        // Perform comparison
        const comparison = TeamAnalyticsHelpers.compareTeams(
          allMatches,
          homeTeamId,
          awayTeamId,
          h2hMatches.length > 0 ? h2hMatches : undefined
        );

        return comparison;
      });

      // Extract cached flag and create final result
      const { _cached, ...data } = computedResult;
      return this.createAnalyticsResult(
        data,
        'team_comparison',
        startTime,
        1, // Basic data points
        _cached || false
      );

    } catch (error) {
      this.log(`❌ Error comparing teams: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to compare teams: ${error instanceof Error ? error.message : String(error)}`,
        'team_comparison',
        startTime
      );
    }
  }

  /**
   * 🏆 ANALYZE LEAGUE TEAMS
   * Analyze all teams in a league season
   */
  async analyzeLeagueTeams(
    seasonId: number,
    options: TeamAnalysisOptions = {}
  ): Promise<AnalyticsResult<DetailedTeamAnalysis[]>> {
    const startTime = Date.now();
    const cacheKey = `league_teams_analysis:${seasonId}:${JSON.stringify(options)}`;

    try {
      this.log(`🏆 Analyzing teams in league season ${seasonId}`);

      const computedResult = await this.getCachedOrCompute(cacheKey, async () => {
        // Get all teams in the league
        const teamsResult = await this.footyStatsService.getLeagueTeams(seasonId, {
          includeStats: true
        });

        if (!teamsResult.success || !teamsResult.data) {
          throw new Error('Failed to fetch league teams');
        }

        const teams = teamsResult.data;
        this.log(`📋 Found ${teams.length} teams in league season ${seasonId}`);

        // Analyze each team
        const analysisPromises = teams.map(async (team: any) => {
          try {
            const analysis = await this.analyzeTeamPerformance(team.id, options);
            return analysis.success ? analysis.data : null;
          } catch (error) {
            this.log(`⚠️ Failed to analyze team ${team.id}: ${error}`, 'warn');
            return null;
          }
        });

        const analyses = await Promise.all(analysisPromises);
        const validAnalyses = analyses.filter(analysis => analysis !== null) as DetailedTeamAnalysis[];

        return validAnalyses;
      });

      // Extract cached flag and create final result
      const { _cached, ...data } = computedResult;
      return this.createAnalyticsResult(
        data,
        'league_teams_analysis',
        startTime,
        1, // Basic data points
        _cached || false
      );

    } catch (error) {
      this.log(`❌ Error analyzing league teams: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to analyze league teams: ${error instanceof Error ? error.message : String(error)}`,
        'league_teams_analysis',
        startTime
      );
    }
  }

  /**
   * 📈 GET TEAM FORM TRENDS
   * Analyze team form trends over time
   */
  async getTeamFormTrends(
    teamId: number,
    matchCount: number = 10
  ): Promise<AnalyticsResult<any>> {
    const startTime = Date.now();
    const cacheKey = `team_form_trends:${teamId}:${matchCount}`;

    try {
      this.log(`📈 Getting form trends for team ${teamId}`);

      const computedResult = await this.getCachedOrCompute(cacheKey, async () => {
        // Get team's recent matches
        const statsResult = await this.footyStatsService.getTeamLastXStats(teamId);
        if (!statsResult.success || !statsResult.data) {
          throw new Error('Failed to fetch team stats');
        }

        const matches = this.extractMatchesFromStats(statsResult.data);
        const recentMatches = matches.slice(-matchCount);

        // Analyze form trends
        const formTrends = this.analyzeFormTrends(recentMatches, teamId);

        return formTrends;
      });

      // Extract cached flag and create final result
      const { _cached, ...data } = computedResult;
      return this.createAnalyticsResult(
        data,
        'team_form_trends',
        startTime,
        1, // Basic data points
        _cached || false
      );

    } catch (error) {
      this.log(`❌ Error getting team form trends: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to get team form trends: ${error instanceof Error ? error.message : String(error)}`,
        'team_form_trends',
        startTime
      );
    }
  }

  /**
   * 🔧 PRIVATE HELPER METHODS
   */

  private extractMatchesFromStats(statsData: any): Match[] {
    // This would extract match data from team stats
    // Implementation depends on the actual stats data structure
    // For now, return empty array - would be implemented based on real API response
    return [];
  }

  private analyzeTrends(matches: Match[], teamId: number) {
    if (matches.length < 5) {
      return {
        goalScoring: 'stable' as const,
        defending: 'stable' as const,
        overall: 'stable' as const
      };
    }

    // Analyze goal scoring trend
    const goalsByMatch = matches.map(match => {
      const isHome = match.homeID === teamId;
      return isHome ? match.homeGoalCount : match.awayGoalCount;
    });

    // Analyze defending trend (goals conceded)
    const goalsConcededByMatch = matches.map(match => {
      const isHome = match.homeID === teamId;
      return isHome ? match.awayGoalCount : match.homeGoalCount;
    });

    // Calculate trends
    const goalScoringTrend = AnalyticsUtils.calculateTrend(goalsByMatch);
    const defendingTrend = AnalyticsUtils.calculateTrend(goalsConcededByMatch.map(g => -g)); // Invert for defending
    
    // Overall trend based on goal difference
    const goalDifferenceByMatch = goalsByMatch.map((goals, index) => 
      goals - goalsConcededByMatch[index]
    );
    const overallTrend = AnalyticsUtils.calculateTrend(goalDifferenceByMatch);

    return {
      goalScoring: goalScoringTrend,
      defending: defendingTrend,
      overall: overallTrend
    };
  }

  private analyzeFormTrends(matches: Match[], teamId: number) {
    const formAnalysis = TeamAnalyticsHelpers.analyzeTeamForm(matches, teamId);
    const performance = TeamAnalyticsHelpers.calculatePerformanceMetrics(matches, teamId);

    return {
      form: formAnalysis,
      performance,
      trends: this.analyzeTrends(matches, teamId),
      strengthRating: TeamAnalyticsHelpers.calculateTeamStrength(performance, formAnalysis)
    };
  }
}
