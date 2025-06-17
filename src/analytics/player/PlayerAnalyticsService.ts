/**
 * 👤 PLAYER & REFEREE ANALYTICS SERVICE
 * 
 * Advanced player and referee analysis service
 * Utilizes: getPlayerStats, getLeaguePlayers, getRefereeStats, getLeagueReferees endpoints
 */

import { Match, Player, Referee } from '../../models';
import { AnalyticsResult, BaseAnalyticsService } from '../core/BaseAnalyticsService';
import {
    PlayerAnalyticsHelpers,
    PlayerComparison,
    PlayerPerformanceMetrics,
    RefereeImpactAnalysis,
    RefereePerformanceMetrics,
    TopPerformersAnalysis
} from '../utils/PlayerAnalyticsHelpers';

export interface PlayerAnalysisOptions {
  includeForm?: boolean;
  includeConsistency?: boolean;
  includeImpact?: boolean;
  formMatches?: number;
}

export interface RefereeAnalysisOptions {
  includeImpact?: boolean;
  includeTeamEffects?: boolean;
  includeControversy?: boolean;
}

export interface LeaguePlayersAnalysisOptions {
  maxPlayers?: number;
  includeTopPerformers?: boolean;
  includeComparisons?: boolean;
  positionFilter?: string;
}

export interface DetailedPlayerAnalysis {
  player: Player;
  performance: PlayerPerformanceMetrics;
  ranking: {
    overallRank: number;
    positionRank: number;
    totalPlayers: number;
  };
  insights: {
    isTopScorer: boolean;
    isTopAssister: boolean;
    isConsistent: boolean;
    isRisingStar: boolean;
    isVeteran: boolean;
  };
}

export interface DetailedRefereeAnalysis {
  referee: Referee;
  performance: RefereePerformanceMetrics;
  impact: RefereeImpactAnalysis;
  ranking: {
    overallRank: number;
    totalReferees: number;
  };
  insights: {
    isStrict: boolean;
    isConsistent: boolean;
    affectsHomeAdvantage: boolean;
    isControversial: boolean;
  };
}

export class PlayerAnalyticsService extends BaseAnalyticsService {

  /**
   * 📊 ANALYZE PLAYER PERFORMANCE
   * Comprehensive player performance analysis
   */
  async analyzePlayerPerformance(
    playerId: number,
    options: PlayerAnalysisOptions = {}
  ): Promise<AnalyticsResult<DetailedPlayerAnalysis>> {
    const startTime = Date.now();
    const cacheKey = `player_analysis:${playerId}:${JSON.stringify(options)}`;

    try {
      this.log(`📊 Analyzing player performance for player ${playerId}`);

      const computedResult = await this.getCachedOrCompute(cacheKey, async () => {
        // Get player stats
        const playerStatsResult = await this.footyStatsService.getPlayerStats(playerId);
        if (!playerStatsResult.success || !playerStatsResult.data) {
          throw new Error('Failed to fetch player stats');
        }

        const playerData = playerStatsResult.data;

        // Create player object from stats data
        const player: Player = {
          id: playerId,
          name: playerData.name || `Player ${playerId}`,
          position: playerData.position || 'Unknown'
        };

        // Get additional match data if needed for form analysis
        let matches: Match[] = [];
        if (options.includeForm) {
          // In a real implementation, you would fetch matches where this player participated
          // For now, we'll use empty array
          matches = [];
        }

        // Calculate performance metrics
        const performance = PlayerAnalyticsHelpers.calculatePlayerPerformance(
          player,
          matches,
          playerData
        );

        // Calculate ranking (simplified - would need league context)
        const ranking = {
          overallRank: 1, // Would be calculated against other players
          positionRank: 1, // Would be calculated against players in same position
          totalPlayers: 100 // Would be actual count
        };

        // Generate insights
        const insights = this.generatePlayerInsights(performance);

        const analysis: DetailedPlayerAnalysis = {
          player,
          performance,
          ranking,
          insights
        };

        return { analysis, count: matches.length + 1 };
      });

      // Extract cached flag and create final result
      const { _cached, ...data } = computedResult;
      return this.createAnalyticsResult(
        data.analysis,
        'player_performance_analysis',
        startTime,
        data.count,
        _cached || false
      );

    } catch (error) {
      this.log(`❌ Error analyzing player performance: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to analyze player performance: ${error instanceof Error ? error.message : String(error)}`,
        'player_performance_analysis',
        startTime
      );
    }
  }

  /**
   * 🏁 ANALYZE REFEREE PERFORMANCE
   * Comprehensive referee performance analysis
   */
  async analyzeRefereePerformance(
    refereeId: number,
    options: RefereeAnalysisOptions = {}
  ): Promise<AnalyticsResult<DetailedRefereeAnalysis>> {
    const startTime = Date.now();
    const cacheKey = `referee_analysis:${refereeId}:${JSON.stringify(options)}`;

    try {
      this.log(`🏁 Analyzing referee performance for referee ${refereeId}`);

      const computedResult = await this.getCachedOrCompute(cacheKey, async () => {
        // Get referee stats
        const refereeStatsResult = await this.footyStatsService.getRefereeStats(refereeId);
        if (!refereeStatsResult.success || !refereeStatsResult.data) {
          throw new Error('Failed to fetch referee stats');
        }

        const refereeData = refereeStatsResult.data;

        // Create referee object from stats data
        const referee: Referee = {
          id: refereeId,
          name: refereeData.name || `Referee ${refereeId}`
        };

        // Get matches officiated by this referee (simplified)
        const matches: Match[] = []; // Would fetch actual matches

        // Calculate performance metrics
        const performance = PlayerAnalyticsHelpers.calculateRefereePerformance(
          referee,
          matches,
          refereeData
        );

        // Calculate impact analysis if requested
        let impact: RefereeImpactAnalysis;
        if (options.includeImpact) {
          impact = PlayerAnalyticsHelpers.analyzeRefereeImpact(
            performance,
            matches,
            [] // Would include teams data
          );
        } else {
          impact = {
            referee: performance,
            impact: {
              homeAdvantageEffect: 0,
              gameFlowEffect: 0,
              cardTendency: 'average',
              goalTendency: 'average'
            },
            teamEffects: []
          };
        }

        // Calculate ranking
        const ranking = {
          overallRank: 1, // Would be calculated against other referees
          totalReferees: 50 // Would be actual count
        };

        // Generate insights
        const insights = this.generateRefereeInsights(performance);

        const analysis: DetailedRefereeAnalysis = {
          referee,
          performance,
          impact,
          ranking,
          insights
        };

        return { analysis, count: matches.length + 1 };
      });

      // Extract cached flag and create final result
      const { _cached, ...data } = computedResult;
      return this.createAnalyticsResult(
        data.analysis,
        'referee_performance_analysis',
        startTime,
        data.count,
        _cached || false
      );

    } catch (error) {
      this.log(`❌ Error analyzing referee performance: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to analyze referee performance: ${error instanceof Error ? error.message : String(error)}`,
        'referee_performance_analysis',
        startTime
      );
    }
  }

  /**
   * 🏆 ANALYZE LEAGUE PLAYERS
   * Analyze all players in a league season
   */
  async analyzeLeaguePlayers(
    seasonId: number,
    options: LeaguePlayersAnalysisOptions = {}
  ): Promise<AnalyticsResult<{
    players: DetailedPlayerAnalysis[];
    topPerformers?: TopPerformersAnalysis;
    comparisons?: PlayerComparison[];
  }>> {
    const startTime = Date.now();
    const cacheKey = `league_players_analysis:${seasonId}:${JSON.stringify(options)}`;

    try {
      this.log(`🏆 Analyzing players in league season ${seasonId}`);

      const computedResult = await this.getCachedOrCompute(cacheKey, async () => {
        // Get all players in the league
        const playersResult = await this.footyStatsService.getLeaguePlayers(seasonId, true);
        if (!playersResult.success || !playersResult.data) {
          throw new Error('Failed to fetch league players');
        }

        let players = playersResult.data;
        this.log(`📋 Found ${players.length} players in league season ${seasonId}`);

        // Apply position filter if specified
        if (options.positionFilter) {
          players = players.filter((player: any) =>
            player.position?.toLowerCase().includes(options.positionFilter!.toLowerCase())
          );
        }

        // Limit players if specified
        if (options.maxPlayers) {
          players = players.slice(0, options.maxPlayers);
        }

        // Analyze each player
        const analysisPromises = players.map(async (playerData: any) => {
          try {
            const player: Player = {
              id: playerData.id,
              name: playerData.name,
              position: playerData.position
            };

            const performance = PlayerAnalyticsHelpers.calculatePlayerPerformance(
              player,
              [], // Would include matches
              playerData
            );

            const analysis: DetailedPlayerAnalysis = {
              player,
              performance,
              ranking: {
                overallRank: 0, // Will be calculated after all analyses
                positionRank: 0,
                totalPlayers: players.length
              },
              insights: this.generatePlayerInsights(performance)
            };

            return analysis;
          } catch (error) {
            this.log(`⚠️ Failed to analyze player ${playerData.id}: ${error}`, 'warn');
            return null;
          }
        });

        const analyses = await Promise.all(analysisPromises);
        const validAnalyses = analyses.filter(analysis => analysis !== null) as DetailedPlayerAnalysis[];

        // Calculate rankings
        this.calculatePlayerRankings(validAnalyses);

        // Generate top performers analysis if requested
        let topPerformers: TopPerformersAnalysis | undefined;
        if (options.includeTopPerformers) {
          const playerMetrics = validAnalyses.map(analysis => analysis.performance);
          topPerformers = PlayerAnalyticsHelpers.analyzeTopPerformers(playerMetrics);
        }

        // Generate comparisons if requested
        let comparisons: PlayerComparison[] | undefined;
        if (options.includeComparisons && validAnalyses.length >= 2) {
          comparisons = this.generatePlayerComparisons(validAnalyses.slice(0, 10)); // Top 10 comparisons
        }

        const result = {
          players: validAnalyses,
          topPerformers,
          comparisons
        };

        return { result, count: players.length };
      });

      // Extract cached flag and create final result
      const { _cached, ...data } = computedResult;
      return this.createAnalyticsResult(
        data.result,
        'league_players_analysis',
        startTime,
        data.count,
        _cached || false
      );

    } catch (error) {
      this.log(`❌ Error analyzing league players: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to analyze league players: ${error instanceof Error ? error.message : String(error)}`,
        'league_players_analysis',
        startTime
      );
    }
  }

  /**
   * 🏁 ANALYZE LEAGUE REFEREES
   * Analyze all referees in a league season
   */
  async analyzeLeagueReferees(
    seasonId: number,
    options: RefereeAnalysisOptions = {}
  ): Promise<AnalyticsResult<DetailedRefereeAnalysis[]>> {
    const startTime = Date.now();
    const cacheKey = `league_referees_analysis:${seasonId}:${JSON.stringify(options)}`;

    try {
      this.log(`🏁 Analyzing referees in league season ${seasonId}`);

      const computedResult = await this.getCachedOrCompute(cacheKey, async () => {
        // Get all referees in the league
        const refereesResult = await this.footyStatsService.getLeagueReferees(seasonId);
        if (!refereesResult.success || !refereesResult.data) {
          throw new Error('Failed to fetch league referees');
        }

        const referees = refereesResult.data;
        this.log(`📋 Found ${referees.length} referees in league season ${seasonId}`);

        // Analyze each referee
        const analysisPromises = referees.map(async (refereeData: any) => {
          try {
            const analysis = await this.analyzeRefereePerformance(refereeData.id, options);
            return analysis.success ? analysis.data : null;
          } catch (error) {
            this.log(`⚠️ Failed to analyze referee ${refereeData.id}: ${error}`, 'warn');
            return null;
          }
        });

        const analyses = await Promise.all(analysisPromises);
        const validAnalyses = analyses.filter(analysis => analysis !== null) as DetailedRefereeAnalysis[];

        // Calculate rankings
        this.calculateRefereeRankings(validAnalyses);

        return { validAnalyses, count: referees.length };
      });

      // Extract cached flag and create final result
      const { _cached, ...data } = computedResult;
      return this.createAnalyticsResult(
        data.validAnalyses,
        'league_referees_analysis',
        startTime,
        data.count,
        _cached || false
      );

    } catch (error) {
      this.log(`❌ Error analyzing league referees: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to analyze league referees: ${error instanceof Error ? error.message : String(error)}`,
        'league_referees_analysis',
        startTime
      );
    }
  }

  /**
   * ⚔️ COMPARE PLAYERS
   * Direct comparison between two players
   */
  async comparePlayers(
    player1Id: number,
    player2Id: number
  ): Promise<AnalyticsResult<PlayerComparison>> {
    const startTime = Date.now();
    const cacheKey = `player_comparison:${player1Id}:${player2Id}`;

    try {
      this.log(`⚔️ Comparing players: ${player1Id} vs ${player2Id}`);

      const computedResult = await this.getCachedOrCompute(cacheKey, async () => {
        // Get both players' analyses
        const [player1Result, player2Result] = await Promise.all([
          this.analyzePlayerPerformance(player1Id),
          this.analyzePlayerPerformance(player2Id)
        ]);

        if (!player1Result.success || !player2Result.success) {
          throw new Error('Failed to fetch player data for comparison');
        }

        // Perform comparison
        const comparison = PlayerAnalyticsHelpers.comparePlayers(
          player1Result.data!.performance,
          player2Result.data!.performance
        );

        return { comparison, count: 2 };
      });

      // Extract cached flag and create final result
      const { _cached, ...data } = computedResult;
      return this.createAnalyticsResult(
        data.comparison,
        'player_comparison',
        startTime,
        data.count,
        _cached || false
      );

    } catch (error) {
      this.log(`❌ Error comparing players: ${error}`, 'error');
      return this.createErrorResult(
        `Failed to compare players: ${error instanceof Error ? error.message : String(error)}`,
        'player_comparison',
        startTime
      );
    }
  }

  /**
   * 🔧 PRIVATE HELPER METHODS
   */

  private generatePlayerInsights(performance: PlayerPerformanceMetrics) {
    return {
      isTopScorer: performance.goalsPerGame > 0.5,
      isTopAssister: performance.assistsPerGame > 0.3,
      isConsistent: performance.consistency > 70,
      isRisingStar: performance.appearances < 20 && performance.impactRating > 70,
      isVeteran: performance.appearances > 30 && performance.consistency > 70
    };
  }

  private generateRefereeInsights(performance: RefereePerformanceMetrics) {
    return {
      isStrict: performance.strictnessRating > 70,
      isConsistent: performance.consistency > 70,
      affectsHomeAdvantage: Math.abs(performance.homeWinPercentage - 47.5) > 10,
      isControversial: performance.controversyRating > 50
    };
  }

  private calculatePlayerRankings(analyses: DetailedPlayerAnalysis[]) {
    // Sort by impact rating for overall ranking
    const sortedByImpact = [...analyses].sort((a, b) => 
      b.performance.impactRating - a.performance.impactRating
    );

    sortedByImpact.forEach((analysis, index) => {
      analysis.ranking.overallRank = index + 1;
    });

    // Calculate position rankings
    const positionGroups = new Map<string, DetailedPlayerAnalysis[]>();
    analyses.forEach(analysis => {
      const position = analysis.player.position || 'Unknown';
      if (!positionGroups.has(position)) {
        positionGroups.set(position, []);
      }
      positionGroups.get(position)!.push(analysis);
    });

    positionGroups.forEach(positionPlayers => {
      const sortedByPosition = positionPlayers.sort((a, b) => 
        b.performance.impactRating - a.performance.impactRating
      );
      
      sortedByPosition.forEach((analysis, index) => {
        analysis.ranking.positionRank = index + 1;
      });
    });
  }

  private calculateRefereeRankings(analyses: DetailedRefereeAnalysis[]) {
    // Sort by consistency for overall ranking
    const sortedByConsistency = [...analyses].sort((a, b) => 
      b.performance.consistency - a.performance.consistency
    );

    sortedByConsistency.forEach((analysis, index) => {
      analysis.ranking.overallRank = index + 1;
    });
  }

  private generatePlayerComparisons(analyses: DetailedPlayerAnalysis[]): PlayerComparison[] {
    const comparisons: PlayerComparison[] = [];

    // Generate comparisons between top players
    for (let i = 0; i < Math.min(5, analyses.length); i++) {
      for (let j = i + 1; j < Math.min(5, analyses.length); j++) {
        const comparison = PlayerAnalyticsHelpers.comparePlayers(
          analyses[i].performance,
          analyses[j].performance
        );
        comparisons.push(comparison);
      }
    }

    return comparisons;
  }
}
