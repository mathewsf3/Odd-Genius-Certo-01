/**
 * Analytics DTO - Comprehensive analytics data type definitions
 * For BTTS, Over/Under, and other football analytics
 */

// BTTS (Both Teams To Score) Analytics
export interface BttsAnalytics {
  // Top teams for BTTS
  topTeams: BttsTeamStats[];
  
  // Top fixtures for BTTS
  topFixtures: BttsFixture[];
  
  // Top leagues for BTTS
  topLeagues: BttsLeagueStats[];
  
  // Overall statistics
  overall: {
    totalMatches: number;
    bttsMatches: number;
    bttsPercentage: number;
    averageGoalsInBttsMatches: number;
    averageGoalsInNonBttsMatches: number;
  };
  
  // Trends
  trends: {
    monthly: MonthlyBttsTrend[];
    seasonal: SeasonalBttsTrend[];
    dayOfWeek: DayOfWeekTrend[];
  };
}

export interface BttsTeamStats {
  teamId: number;
  teamName: string;
  league: string;
  country: string;
  matchesPlayed: number;
  bttsMatches: number;
  bttsPercentage: number;
  averageGoalsScored: number;
  averageGoalsConceded: number;
  homeRecord: {
    played: number;
    btts: number;
    percentage: number;
  };
  awayRecord: {
    played: number;
    btts: number;
    percentage: number;
  };
}

export interface BttsFixture {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  date: string;
  bttsOdds: number;
  bttsPercentage: number;
  homeTeamBttsRecord: number;
  awayTeamBttsRecord: number;
  h2hBttsRecord: number;
}

export interface BttsLeagueStats {
  leagueId: string;
  leagueName: string;
  country: string;
  matchesPlayed: number;
  bttsMatches: number;
  bttsPercentage: number;
  averageGoalsPerMatch: number;
  topBttsTeams: string[];
}

// Over/Under Analytics
export interface OverUnderAnalytics {
  threshold: number; // 0.5, 1.5, 2.5, 3.5, 4.5, 5.5
  
  // Top teams for Over threshold
  topOverTeams: OverUnderTeamStats[];
  
  // Top fixtures for Over threshold
  topOverFixtures: OverUnderFixture[];
  
  // Top leagues for Over threshold
  topOverLeagues: OverUnderLeagueStats[];
  
  // Overall statistics
  overall: {
    totalMatches: number;
    overMatches: number;
    overPercentage: number;
    underMatches: number;
    underPercentage: number;
    averageGoals: number;
  };
  
  // Trends
  trends: {
    monthly: MonthlyOverUnderTrend[];
    seasonal: SeasonalOverUnderTrend[];
    dayOfWeek: DayOfWeekTrend[];
  };
}

export interface OverUnderTeamStats {
  teamId: number;
  teamName: string;
  league: string;
  country: string;
  matchesPlayed: number;
  overMatches: number;
  overPercentage: number;
  underMatches: number;
  underPercentage: number;
  averageGoalsInMatches: number;
  homeRecord: {
    played: number;
    over: number;
    overPercentage: number;
  };
  awayRecord: {
    played: number;
    over: number;
    overPercentage: number;
  };
}

export interface OverUnderFixture {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  date: string;
  overOdds: number;
  underOdds: number;
  overPercentage: number;
  homeTeamOverRecord: number;
  awayTeamOverRecord: number;
  h2hOverRecord: number;
  expectedGoals: number;
}

export interface OverUnderLeagueStats {
  leagueId: string;
  leagueName: string;
  country: string;
  matchesPlayed: number;
  overMatches: number;
  overPercentage: number;
  averageGoalsPerMatch: number;
  topOverTeams: string[];
}

// Corner Analytics
export interface CornerAnalytics {
  // Team corner statistics
  teamStats: CornerTeamStats[];
  
  // Match corner predictions
  matchPredictions: CornerMatchPrediction[];
  
  // League corner statistics
  leagueStats: CornerLeagueStats[];
  
  // Overall corner trends
  trends: {
    averageCornersPerMatch: number;
    homeTeamAdvantage: number;
    correlationWithGoals: number;
    timeDistribution: CornerTimeDistribution[];
  };
}

export interface CornerTeamStats {
  teamId: number;
  teamName: string;
  league: string;
  matchesPlayed: number;
  totalCorners: number;
  averageCornersPerMatch: number;
  cornersFor: number;
  cornersAgainst: number;
  homeCorners: {
    total: number;
    average: number;
    for: number;
    against: number;
  };
  awayCorners: {
    total: number;
    average: number;
    for: number;
    against: number;
  };
}

export interface CornerMatchPrediction {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  expectedCorners: number;
  homeExpectedCorners: number;
  awayExpectedCorners: number;
  over75Probability: number;
  over95Probability: number;
  over105Probability: number;
  over115Probability: number;
}

export interface CornerLeagueStats {
  leagueId: string;
  leagueName: string;
  country: string;
  averageCornersPerMatch: number;
  totalCorners: number;
  matchesPlayed: number;
  homeAdvantage: number;
}

// Card Analytics
export interface CardAnalytics {
  // Team card statistics
  teamStats: CardTeamStats[];
  
  // Match card predictions
  matchPredictions: CardMatchPrediction[];
  
  // Referee card statistics
  refereeStats: CardRefereeStats[];
  
  // League card statistics
  leagueStats: CardLeagueStats[];
  
  // Overall card trends
  trends: {
    averageCardsPerMatch: number;
    yellowToRedRatio: number;
    homeAwayCardDifference: number;
    timeDistribution: CardTimeDistribution[];
  };
}

export interface CardTeamStats {
  teamId: number;
  teamName: string;
  league: string;
  matchesPlayed: number;
  totalCards: number;
  yellowCards: number;
  redCards: number;
  averageCardsPerMatch: number;
  cardsReceived: number;
  cardsOpponentsReceived: number;
  homeCards: {
    total: number;
    yellow: number;
    red: number;
    average: number;
  };
  awayCards: {
    total: number;
    yellow: number;
    red: number;
    average: number;
  };
}

export interface CardMatchPrediction {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  expectedCards: number;
  homeExpectedCards: number;
  awayExpectedCards: number;
  over15Probability: number;
  over25Probability: number;
  over35Probability: number;
  over45Probability: number;
  redCardProbability: number;
}

export interface CardRefereeStats {
  refereeId: number;
  refereeName: string;
  matchesOfficiated: number;
  totalCards: number;
  yellowCards: number;
  redCards: number;
  averageCardsPerMatch: number;
  strictnessRating: number;
}

export interface CardLeagueStats {
  leagueId: string;
  leagueName: string;
  country: string;
  averageCardsPerMatch: number;
  totalCards: number;
  yellowCards: number;
  redCards: number;
  matchesPlayed: number;
  disciplinaryRating: number;
}

// Trend interfaces
export interface MonthlyBttsTrend {
  month: string;
  matchesPlayed: number;
  bttsMatches: number;
  bttsPercentage: number;
  averageGoals: number;
}

export interface SeasonalBttsTrend {
  season: string;
  matchesPlayed: number;
  bttsMatches: number;
  bttsPercentage: number;
  averageGoals: number;
}

export interface MonthlyOverUnderTrend {
  month: string;
  matchesPlayed: number;
  overMatches: number;
  overPercentage: number;
  averageGoals: number;
}

export interface SeasonalOverUnderTrend {
  season: string;
  matchesPlayed: number;
  overMatches: number;
  overPercentage: number;
  averageGoals: number;
}

export interface DayOfWeekTrend {
  dayOfWeek: string;
  matchesPlayed: number;
  percentage: number;
  averageGoals: number;
}

export interface CornerTimeDistribution {
  period: string; // '0-15', '16-30', '31-45', '46-60', '61-75', '76-90', '90+'
  corners: number;
  percentage: number;
}

export interface CardTimeDistribution {
  period: string; // '0-15', '16-30', '31-45', '46-60', '61-75', '76-90', '90+'
  cards: number;
  yellowCards: number;
  redCards: number;
  percentage: number;
}

// Request/Response DTOs
export interface BttsStatsRequest {
  league?: string;
  country?: string;
  limit?: number;
}

export interface OverUnderStatsRequest {
  threshold: number;
  league?: string;
  country?: string;
  limit?: number;
}

export interface AnalyticsResponse<T> {
  success: boolean;
  data?: T;
  metadata?: {
    analysisTimestamp: string;
    dataSource: string;
    processingTime?: number;
    totalRecords?: number;
  };
  error?: string;
}
