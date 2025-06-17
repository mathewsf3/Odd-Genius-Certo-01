/**
 * 🏆 LEAGUE ANALYTICS SERVICE
 * 
 * Advanced league analysis and comparison service
 * Utilizes: getLeagues, getLeagueSeason, getLeagueTables, getLeagueMatches endpoints
 */

import { LeagueSeason } from '../../models';
import { AnalyticsResult, BaseAnalyticsService } from '../core/BaseAnalyticsService';
import { AnalyticsUtils } from '../utils/AnalyticsUtils';
import { CompetitionComparison, LeagueAnalyticsHelpers, LeagueStatistics, LeagueTable } from '../utils/LeagueAnalyticsHelpers';

export interface LeagueAnalysisOptions {
  includeTable?: boolean;
  includeTrends?: boolean;
  includeTopScorers?: boolean;
  includeBestDefense?: boolean;
  maxTeams?: number;
}

export interface CompetitionComparisonOptions {
  includeQuality?: boolean;
  includeCompetitiveness?: boolean;
  maxLeagues?: number;
}

export interface DetailedLeagueAnalysis {
  league: LeagueSeason;
  statistics: LeagueStatistics;
  table?: LeagueTable[];
  topScorers?: { teamId: number; teamName: string; goals: number }[];
  bestDefense?: { teamId: number; teamName: string; goalsConceded: number }[];
  trends?: {
    goalTrend: 'increasing' | 'decreasing' | 'stable';
    competitiveness: number;
    predictability: number;
  };
  insights: {
    mostCompetitive: boolean;
    highScoring: boolean;
    defensive: boolean;
    homeAdvantage: number;
  };
}

export class LeagueAnalyticsService extends BaseAnalyticsService {

  /**
   * 📊 ANALYZE LEAGUE SEASON
   * Comprehensive league season analysis
   */
  async analyzeLeagueSeason(
    seasonId: number,
    options: LeagueAnalysisOptions = {}
  ): Promise<AnalyticsResult<DetailedLeagueAnalysis>> {
    const startTime = Date.now();
    const cacheKey = `league_season_analysis:${seasonId}:${JSON.stringify(options)}`;

    try {
      this.log(`📊 Analyzing league season ${seasonId}`);

      const computedResult = await this.getCachedOrCompute(cacheKey, async () => {
        // Get league season data
        const seasonResult = await this.footyStatsService.getLeagueSeason(seasonId);
        if (!seasonResult.success || !seasonResult.data) {
          throw new Error('Failed to fetch league season data');
        }

        const league = seasonResult.data;

        // Get league matches
        const matchesResult = await this.footyStatsService.getLeagueMatches(seasonId);
        if (!matchesResult.success || !matchesResult.data) {
          throw new Error('Failed to fetch league matches');
        }

        const matches = matchesResult.data;

        // Get league teams
        const teamsResult = await this.footyStatsService.getLeagueTeams(seasonId);
        if (!teamsResult.success || !teamsResult.data) {
          throw new Error('Failed to fetch league teams');
        }

        const teams = teamsResult.data;

        // Calculate statistics
        const statistics = LeagueAnalyticsHelpers.calculateLeagueStatistics(matches);

        // Generate table if requested
        let table: LeagueTable[] | undefined;
        if (options.includeTable) {
          table = LeagueAnalyticsHelpers.generateLeagueTable(matches, teams);
          if (options.maxTeams) {
            table = table.slice(0, options.maxTeams);
          }
        }

        // Analyze trends if requested
        let trends: any;
        let topScorers: any;
        let bestDefense: any;

        if (options.includeTrends || options.includeTopScorers || options.includeBestDefense) {
          const seasonAnalysis = LeagueAnalyticsHelpers.analyzeSeasonTrends(
            matches,
            teams,
            league.season || 'Unknown'
          );

          if (options.includeTrends) {
            trends = seasonAnalysis.trends;
          }
          if (options.includeTopScorers) {
            topScorers = seasonAnalysis.topScorers;
          }
          if (options.includeBestDefense) {
            bestDefense = seasonAnalysis.bestDefense;
          }
        }

        // Generate insights
        const insights = this.generateLeagueInsights(statistics, table);

        const analysis: DetailedLeagueAnalysis = {
          league,
          statistics,
          table,
          topScorers,
          bestDefense,
          trends,
          insights
        };

        return { analysis, count: matches.length + teams.length + 1 };
      });

      // Extract cached flag and create final result
      const { _cached, ...data } = computedResult;
      return this.createAnalyticsResult(
        data.analysis,
        'league_season_analysis',
        startTime,
        data.count,
        _cached || false
      );

    } catch (error) {
      this.log(`❌ Error analyzing league season: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to analyze league season: ${error instanceof Error ? error.message : String(error)}`,
        'league_season_analysis',
        startTime
      );
    }
  }

  /**
   * 🏆 GET LEAGUE TABLES
   * Get current league standings with analytics
   */
  async getLeagueTablesWithAnalytics(
    seasonId: number
  ): Promise<AnalyticsResult<{ table: LeagueTable[]; analytics: any }>> {
    const startTime = Date.now();
    const cacheKey = `league_tables_analytics:${seasonId}`;

    try {
      this.log(`🏆 Getting league tables with analytics for season ${seasonId}`);

      const computedResult = await this.getCachedOrCompute(cacheKey, async () => {
        // Get official league tables
        const tablesResult = await this.footyStatsService.getLeagueTables(seasonId);
        if (!tablesResult.success || !tablesResult.data) {
          throw new Error('Failed to fetch league tables');
        }

        // Get matches for additional analytics
        const matchesResult = await this.footyStatsService.getLeagueMatches(seasonId);
        const teamsResult = await this.footyStatsService.getLeagueTeams(seasonId);

        let analyticsTable: LeagueTable[] = [];
        let analytics: any = {};

        if (matchesResult.success && teamsResult.success &&
            matchesResult.data && teamsResult.data) {

          // Generate our own table with analytics
          analyticsTable = LeagueAnalyticsHelpers.generateLeagueTable(
            matchesResult.data,
            teamsResult.data
          );

          // Calculate additional analytics
          analytics = {
            statistics: LeagueAnalyticsHelpers.calculateLeagueStatistics(matchesResult.data),
            formTable: this.generateFormTable(analyticsTable),
            homeAwayTable: this.generateHomeAwayTable(analyticsTable),
            trends: this.analyzeTableTrends(analyticsTable)
          };
        }

        const result = {
          table: analyticsTable.length > 0 ? analyticsTable : tablesResult.data,
          analytics
        };

        return { result, count: (matchesResult.data?.length || 0) + (teamsResult.data?.length || 0) };
      });

      // Extract cached flag and create final result
      const { _cached, ...data } = computedResult;
      return this.createAnalyticsResult(
        data.result,
        'league_tables_analytics',
        startTime,
        data.count,
        _cached || false
      );

    } catch (error) {
      this.log(`❌ Error getting league tables: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to get league tables: ${error instanceof Error ? error.message : String(error)}`,
        'league_tables_analytics',
        startTime
      );
    }
  }

  /**
   * ⚔️ COMPARE COMPETITIONS
   * Compare multiple leagues/competitions
   */
  async compareCompetitions(
    seasonIds: number[],
    options: CompetitionComparisonOptions = {}
  ): Promise<AnalyticsResult<CompetitionComparison>> {
    const startTime = Date.now();
    const cacheKey = `competition_comparison:${seasonIds.join(',')}:${JSON.stringify(options)}`;

    try {
      this.log(`⚔️ Comparing ${seasonIds.length} competitions`);

      const computedResult = await this.getCachedOrCompute(cacheKey, async () => {
        const competitions: any[] = [];

        // Fetch data for each competition
        for (const seasonId of seasonIds.slice(0, options.maxLeagues || 10)) {
          try {
            const [seasonResult, matchesResult, teamsResult] = await Promise.all([
              this.footyStatsService.getLeagueSeason(seasonId),
              this.footyStatsService.getLeagueMatches(seasonId),
              this.footyStatsService.getLeagueTeams(seasonId)
            ]);

            if (seasonResult.success && matchesResult.success && teamsResult.success &&
                seasonResult.data && matchesResult.data && teamsResult.data) {

              competitions.push({
                leagueId: seasonId.toString(),
                leagueName: seasonResult.data.name || `League ${seasonId}`,
                matches: matchesResult.data,
                teams: teamsResult.data
              });
            }
          } catch (error) {
            this.log(`⚠️ Failed to fetch data for season ${seasonId}: ${error}`, 'warn');
          }
        }

        if (competitions.length === 0) {
          throw new Error('No valid competition data found');
        }

        // Perform comparison
        const comparison = LeagueAnalyticsHelpers.compareCompetitions(competitions);

        return { comparison, count: competitions.reduce((sum, comp) => sum + comp.matches.length + comp.teams.length, 0) };
      });

      // Extract cached flag and create final result
      const { _cached, ...data } = computedResult;
      return this.createAnalyticsResult(
        data.comparison,
        'competition_comparison',
        startTime,
        data.count,
        _cached || false
      );

    } catch (error) {
      this.log(`❌ Error comparing competitions: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to compare competitions: ${error instanceof Error ? error.message : String(error)}`,
        'competition_comparison',
        startTime
      );
    }
  }

  /**
   * 📈 ANALYZE LEAGUE TRENDS
   * Analyze trends across multiple seasons
   */
  async analyzeLeagueTrends(
    seasonIds: number[]
  ): Promise<AnalyticsResult<any>> {
    const startTime = Date.now();
    const cacheKey = `league_trends:${seasonIds.join(',')}`;

    try {
      this.log(`📈 Analyzing trends across ${seasonIds.length} seasons`);

      const computedResult = await this.getCachedOrCompute(cacheKey, async () => {
        const seasonAnalyses: any[] = [];

        // Analyze each season
        for (const seasonId of seasonIds) {
          const analysis = await this.analyzeLeagueSeason(seasonId, {
            includeTrends: true,
            includeTable: false
          });

          if (analysis.success && analysis.data) {
            seasonAnalyses.push({
              seasonId,
              season: analysis.data.league.season,
              statistics: analysis.data.statistics,
              trends: analysis.data.trends
            });
          }
        }

        // Calculate multi-season trends
        const trends = this.calculateMultiSeasonTrends(seasonAnalyses);

        return { trends, count: seasonAnalyses.length };
      });

      // Extract cached flag and create final result
      const { _cached, ...data } = computedResult;
      return this.createAnalyticsResult(
        data.trends,
        'league_trends',
        startTime,
        data.count,
        _cached || false
      );

    } catch (error) {
      this.log(`❌ Error analyzing league trends: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to analyze league trends: ${error instanceof Error ? error.message : String(error)}`,
        'league_trends',
        startTime
      );
    }
  }

  /**
   * 🔧 PRIVATE HELPER METHODS
   */

  private generateLeagueInsights(statistics: LeagueStatistics, table?: LeagueTable[]) {
    return {
      mostCompetitive: table ? this.isCompetitive(table) : false,
      highScoring: statistics.averageGoalsPerMatch > 2.8,
      defensive: statistics.averageGoalsPerMatch < 2.2,
      homeAdvantage: Math.round(statistics.homeWinPercentage)
    };
  }

  private isCompetitive(table: LeagueTable[]): boolean {
    if (table.length < 4) return false;
    
    const topPoints = table[0].points;
    const fourthPoints = table[3].points;
    const pointGap = topPoints - fourthPoints;
    
    // Competitive if top 4 are within 15 points
    return pointGap <= 15;
  }

  private generateFormTable(table: LeagueTable[]) {
    return table
      .map(team => ({
        position: team.position,
        teamName: team.teamName,
        form: team.form,
        formPoints: this.calculateFormPoints(team.form)
      }))
      .sort((a, b) => b.formPoints - a.formPoints)
      .map((team, index) => ({ ...team, formPosition: index + 1 }));
  }

  private generateHomeAwayTable(table: LeagueTable[]) {
    return table.map(team => ({
      teamName: team.teamName,
      homeRecord: team.homeRecord,
      awayRecord: team.awayRecord,
      homePoints: (team.homeRecord.won * 3) + team.homeRecord.drawn,
      awayPoints: (team.awayRecord.won * 3) + team.awayRecord.drawn
    }));
  }

  private analyzeTableTrends(table: LeagueTable[]) {
    const pointsDistribution = table.map(team => team.points);
    const goalDifferenceDistribution = table.map(team => team.goalDifference);

    return {
      pointsSpread: Math.max(...pointsDistribution) - Math.min(...pointsDistribution),
      averagePoints: AnalyticsUtils.calculateAverage(pointsDistribution),
      competitiveness: AnalyticsUtils.calculateStandardDeviation(pointsDistribution),
      goalDifferenceSpread: Math.max(...goalDifferenceDistribution) - Math.min(...goalDifferenceDistribution)
    };
  }

  private calculateFormPoints(form: string): number {
    return form.split('').reduce((points, result) => {
      if (result === 'W') return points + 3;
      if (result === 'D') return points + 1;
      return points;
    }, 0);
  }

  private calculateMultiSeasonTrends(seasonAnalyses: any[]) {
    if (seasonAnalyses.length < 2) {
      return { message: 'Need at least 2 seasons for trend analysis' };
    }

    const goalAverages = seasonAnalyses.map(season => season.statistics.averageGoalsPerMatch);
    const homeWinPercentages = seasonAnalyses.map(season => season.statistics.homeWinPercentage);
    const bttsPercentages = seasonAnalyses.map(season => season.statistics.bttsPercentage);

    return {
      goalTrend: AnalyticsUtils.calculateTrend(goalAverages),
      homeAdvantageTrend: AnalyticsUtils.calculateTrend(homeWinPercentages),
      bttsTrend: AnalyticsUtils.calculateTrend(bttsPercentages),
      seasonComparison: seasonAnalyses.map(season => ({
        season: season.season,
        goalsPerGame: season.statistics.averageGoalsPerMatch,
        homeWinRate: season.statistics.homeWinPercentage,
        bttsRate: season.statistics.bttsPercentage
      }))
    };
  }
}
