/**
 * 🏆 LEAGUE ANALYTICS HELPERS
 * 
 * Specialized helper functions for league-specific analytics
 * Supports League Analytics Services in Phase 3
 */

import { Match, Team, LeagueSeason } from '../../models';
import { AnalyticsUtils } from './AnalyticsUtils';

export interface LeagueStatistics {
  totalMatches: number;
  completedMatches: number;
  totalGoals: number;
  averageGoalsPerMatch: number;
  homeWinPercentage: number;
  drawPercentage: number;
  awayWinPercentage: number;
  bttsPercentage: number;
  over25Percentage: number;
  over35Percentage: number;
  cleanSheetPercentage: number;
  highScoringMatches: number; // 4+ goals
  lowScoringMatches: number; // 0-1 goals
}

export interface LeagueTable {
  position: number;
  teamId: number;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string;
  homeRecord: { won: number; drawn: number; lost: number };
  awayRecord: { won: number; drawn: number; lost: number };
}

export interface SeasonAnalysis {
  season: string;
  statistics: LeagueStatistics;
  table: LeagueTable[];
  topScorers: { teamId: number; teamName: string; goals: number }[];
  bestDefense: { teamId: number; teamName: string; goalsConceded: number }[];
  trends: {
    goalTrend: 'increasing' | 'decreasing' | 'stable';
    competitiveness: number; // 0-100, higher = more competitive
    predictability: number; // 0-100, higher = more predictable
  };
}

export interface CompetitionComparison {
  leagues: {
    leagueId: string;
    leagueName: string;
    statistics: LeagueStatistics;
    competitiveness: number;
    quality: number;
  }[];
  rankings: {
    mostCompetitive: string;
    highestScoring: string;
    mostDefensive: string;
    mostPredictable: string;
  };
}

export class LeagueAnalyticsHelpers {

  /**
   * 📊 CALCULATE LEAGUE STATISTICS
   * Comprehensive statistical analysis for a league season
   */
  static calculateLeagueStatistics(matches: Match[]): LeagueStatistics {
    if (matches.length === 0) {
      return this.getEmptyLeagueStatistics();
    }

    const completedMatches = matches.filter(match => match.status === 'complete');
    const totalGoals = completedMatches.reduce((sum, match) => 
      sum + match.homeGoalCount + match.awayGoalCount, 0
    );

    let homeWins = 0, draws = 0, awayWins = 0;
    let bttsCount = 0, over25Count = 0, over35Count = 0;
    let cleanSheetCount = 0, highScoringCount = 0, lowScoringCount = 0;

    completedMatches.forEach(match => {
      const homeGoals = match.homeGoalCount;
      const awayGoals = match.awayGoalCount;
      const totalMatchGoals = homeGoals + awayGoals;

      // Result analysis
      if (homeGoals > awayGoals) homeWins++;
      else if (awayGoals > homeGoals) awayWins++;
      else draws++;

      // Goal analysis
      if (homeGoals > 0 && awayGoals > 0) bttsCount++;
      if (totalMatchGoals > 2.5) over25Count++;
      if (totalMatchGoals > 3.5) over35Count++;
      if (homeGoals === 0 || awayGoals === 0) cleanSheetCount++;
      if (totalMatchGoals >= 4) highScoringCount++;
      if (totalMatchGoals <= 1) lowScoringCount++;
    });

    const matchCount = completedMatches.length;

    return {
      totalMatches: matches.length,
      completedMatches: matchCount,
      totalGoals,
      averageGoalsPerMatch: matchCount > 0 ? totalGoals / matchCount : 0,
      homeWinPercentage: matchCount > 0 ? (homeWins / matchCount) * 100 : 0,
      drawPercentage: matchCount > 0 ? (draws / matchCount) * 100 : 0,
      awayWinPercentage: matchCount > 0 ? (awayWins / matchCount) * 100 : 0,
      bttsPercentage: matchCount > 0 ? (bttsCount / matchCount) * 100 : 0,
      over25Percentage: matchCount > 0 ? (over25Count / matchCount) * 100 : 0,
      over35Percentage: matchCount > 0 ? (over35Count / matchCount) * 100 : 0,
      cleanSheetPercentage: matchCount > 0 ? (cleanSheetCount / matchCount) * 100 : 0,
      highScoringMatches: highScoringCount,
      lowScoringMatches: lowScoringCount
    };
  }

  /**
   * 🏆 GENERATE LEAGUE TABLE
   * Create league table from match results
   */
  static generateLeagueTable(matches: Match[], teams: Team[]): LeagueTable[] {
    const teamStats = new Map<number, any>();

    // Initialize team stats
    teams.forEach(team => {
      teamStats.set(team.id, {
        teamId: team.id,
        teamName: team.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
        homeRecord: { won: 0, drawn: 0, lost: 0 },
        awayRecord: { won: 0, drawn: 0, lost: 0 },
        recentMatches: []
      });
    });

    // Process matches
    const completedMatches = matches.filter(match => match.status === 'complete');
    completedMatches.forEach(match => {
      const homeTeam = teamStats.get(match.homeID);
      const awayTeam = teamStats.get(match.awayID);

      if (!homeTeam || !awayTeam) return;

      const homeGoals = match.homeGoalCount;
      const awayGoals = match.awayGoalCount;

      // Update basic stats
      homeTeam.played++;
      awayTeam.played++;
      homeTeam.goalsFor += homeGoals;
      homeTeam.goalsAgainst += awayGoals;
      awayTeam.goalsFor += awayGoals;
      awayTeam.goalsAgainst += homeGoals;

      // Update results
      if (homeGoals > awayGoals) {
        homeTeam.won++;
        homeTeam.points += 3;
        homeTeam.homeRecord.won++;
        awayTeam.lost++;
        awayTeam.awayRecord.lost++;
        homeTeam.recentMatches.push('W');
        awayTeam.recentMatches.push('L');
      } else if (awayGoals > homeGoals) {
        awayTeam.won++;
        awayTeam.points += 3;
        awayTeam.awayRecord.won++;
        homeTeam.lost++;
        homeTeam.homeRecord.lost++;
        homeTeam.recentMatches.push('L');
        awayTeam.recentMatches.push('W');
      } else {
        homeTeam.drawn++;
        awayTeam.drawn++;
        homeTeam.points += 1;
        awayTeam.points += 1;
        homeTeam.homeRecord.drawn++;
        awayTeam.awayRecord.drawn++;
        homeTeam.recentMatches.push('D');
        awayTeam.recentMatches.push('D');
      }
    });

    // Convert to table format and sort
    const table: LeagueTable[] = Array.from(teamStats.values()).map(team => ({
      position: 0, // Will be set after sorting
      teamId: team.teamId,
      teamName: team.teamName,
      played: team.played,
      won: team.won,
      drawn: team.drawn,
      lost: team.lost,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst,
      goalDifference: team.goalsFor - team.goalsAgainst,
      points: team.points,
      form: team.recentMatches.slice(-5).join(''),
      homeRecord: team.homeRecord,
      awayRecord: team.awayRecord
    }));

    // Sort by points, then goal difference, then goals for
    table.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

    // Set positions
    table.forEach((team, index) => {
      team.position = index + 1;
    });

    return table;
  }

  /**
   * 📈 ANALYZE SEASON TRENDS
   * Comprehensive season analysis including trends
   */
  static analyzeSeasonTrends(matches: Match[], teams: Team[], season: string): SeasonAnalysis {
    const statistics = this.calculateLeagueStatistics(matches);
    const table = this.generateLeagueTable(matches, teams);

    // Calculate trends
    const trends = this.calculateSeasonTrends(matches, table);

    // Get top scorers and best defense
    const topScorers = table
      .sort((a, b) => b.goalsFor - a.goalsFor)
      .slice(0, 5)
      .map(team => ({
        teamId: team.teamId,
        teamName: team.teamName,
        goals: team.goalsFor
      }));

    const bestDefense = table
      .sort((a, b) => a.goalsAgainst - b.goalsAgainst)
      .slice(0, 5)
      .map(team => ({
        teamId: team.teamId,
        teamName: team.teamName,
        goalsConceded: team.goalsAgainst
      }));

    return {
      season,
      statistics,
      table: table.sort((a, b) => a.position - b.position), // Resort by position
      topScorers,
      bestDefense,
      trends
    };
  }

  /**
   * ⚔️ COMPARE COMPETITIONS
   * Compare multiple leagues/competitions
   */
  static compareCompetitions(competitions: {
    leagueId: string;
    leagueName: string;
    matches: Match[];
    teams: Team[];
  }[]): CompetitionComparison {
    const leagues = competitions.map(comp => {
      const statistics = this.calculateLeagueStatistics(comp.matches);
      const table = this.generateLeagueTable(comp.matches, comp.teams);
      
      return {
        leagueId: comp.leagueId,
        leagueName: comp.leagueName,
        statistics,
        competitiveness: this.calculateCompetitiveness(table),
        quality: this.calculateLeagueQuality(statistics)
      };
    });

    // Determine rankings
    const rankings = {
      mostCompetitive: leagues.reduce((prev, curr) => 
        curr.competitiveness > prev.competitiveness ? curr : prev
      ).leagueName,
      
      highestScoring: leagues.reduce((prev, curr) => 
        curr.statistics.averageGoalsPerMatch > prev.statistics.averageGoalsPerMatch ? curr : prev
      ).leagueName,
      
      mostDefensive: leagues.reduce((prev, curr) => 
        curr.statistics.averageGoalsPerMatch < prev.statistics.averageGoalsPerMatch ? curr : prev
      ).leagueName,
      
      mostPredictable: leagues.reduce((prev, curr) => 
        curr.statistics.homeWinPercentage > prev.statistics.homeWinPercentage ? curr : prev
      ).leagueName
    };

    return { leagues, rankings };
  }

  /**
   * 🔧 PRIVATE HELPER METHODS
   */

  private static getEmptyLeagueStatistics(): LeagueStatistics {
    return {
      totalMatches: 0,
      completedMatches: 0,
      totalGoals: 0,
      averageGoalsPerMatch: 0,
      homeWinPercentage: 0,
      drawPercentage: 0,
      awayWinPercentage: 0,
      bttsPercentage: 0,
      over25Percentage: 0,
      over35Percentage: 0,
      cleanSheetPercentage: 0,
      highScoringMatches: 0,
      lowScoringMatches: 0
    };
  }

  private static calculateSeasonTrends(matches: Match[], table: LeagueTable[]) {
    // Analyze goal trends over time
    const matchesByDate = matches
      .filter(match => match.status === 'complete')
      .sort((a, b) => a.date_unix - b.date_unix);

    const goalsByWeek = this.groupMatchesByWeek(matchesByDate);
    const weeklyAverages = goalsByWeek.map(week => 
      week.reduce((sum, match) => sum + match.homeGoalCount + match.awayGoalCount, 0) / week.length
    );

    const goalTrend = AnalyticsUtils.calculateTrend(weeklyAverages);

    // Calculate competitiveness (how close the table is)
    const competitiveness = this.calculateCompetitiveness(table);

    // Calculate predictability (home advantage strength)
    const homeWinRate = matches.filter(match => 
      match.status === 'complete' && match.homeGoalCount > match.awayGoalCount
    ).length / matches.filter(match => match.status === 'complete').length;

    const predictability = Math.round(homeWinRate * 100);

    return {
      goalTrend,
      competitiveness,
      predictability
    };
  }

  private static groupMatchesByWeek(matches: Match[]): Match[][] {
    const weeks: Match[][] = [];
    let currentWeek: Match[] = [];
    let currentWeekStart = 0;

    matches.forEach(match => {
      const matchWeek = Math.floor((match.date_unix - matches[0].date_unix) / (7 * 24 * 60 * 60));
      
      if (matchWeek !== currentWeekStart) {
        if (currentWeek.length > 0) {
          weeks.push(currentWeek);
        }
        currentWeek = [match];
        currentWeekStart = matchWeek;
      } else {
        currentWeek.push(match);
      }
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }

  private static calculateCompetitiveness(table: LeagueTable[]): number {
    if (table.length < 2) return 0;

    // Calculate point spread
    const topPoints = table[0].points;
    const bottomPoints = table[table.length - 1].points;
    const pointSpread = topPoints - bottomPoints;

    // Calculate standard deviation of points
    const points = table.map(team => team.points);
    const avgPoints = AnalyticsUtils.calculateAverage(points);
    const stdDev = AnalyticsUtils.calculateStandardDeviation(points);

    // Lower spread and standard deviation = higher competitiveness
    const maxPossibleSpread = table[0].played * 3; // Maximum possible point difference
    const competitiveness = Math.max(0, 100 - (pointSpread / maxPossibleSpread) * 100);

    return Math.round(competitiveness);
  }

  private static calculateLeagueQuality(statistics: LeagueStatistics): number {
    // Quality based on goals per game, competitiveness, and entertainment value
    const goalQuality = Math.min(100, statistics.averageGoalsPerMatch * 30); // 3.33 goals = 100
    const entertainmentValue = (statistics.bttsPercentage + statistics.over25Percentage) / 2;
    
    const quality = (goalQuality * 0.4) + (entertainmentValue * 0.6);
    return Math.round(quality);
  }
}
