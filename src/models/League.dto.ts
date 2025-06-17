/**
 * League DTO - Based on footy.yaml League and LeagueSeason schemas
 * Comprehensive league data type definitions
 */

export interface League {
  name: string;
  season: Season[];
}

export interface Season {
  id: number;
  year: number;
}

export interface Country {
  id: number;
  name: string;
  iso?: string;
}

export interface LeagueSeason {
  // Core identifiers
  id: string;
  division?: string;
  name: string;
  shortHand?: string;
  country: string;
  type?: string;
  iso?: string;
  continent?: string;

  // Visual and web presence
  image?: string;
  image_thumb?: string;
  url?: string;
  parent_url?: string;
  countryURL?: string;

  // League configuration
  tie_break?: string;
  domestic_scale?: string;
  international_scale?: string;
  clubNum?: number;
  no_home_away?: boolean;

  // Season information
  year: string;
  season: string;
  starting_year?: string;
  ending_year?: string;
  seasonClean?: string;
}

export interface LeagueTable {
  position: number;
  teamId: number;
  teamName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string;
  
  // Home record
  homeRecord: {
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
  };
  
  // Away record
  awayRecord: {
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
  };
  
  // Additional stats
  cleanSheets?: number;
  failedToScore?: number;
  averageGoalsScored?: number;
  averageGoalsConceded?: number;
  winPercentage?: number;
}

export interface LeagueStats {
  // General statistics
  totalTeams: number;
  totalMatches: number;
  matchesPlayed: number;
  matchesRemaining: number;
  
  // Goal statistics
  totalGoals: number;
  averageGoalsPerMatch: number;
  highestScoringMatch: {
    matchId: number;
    homeTeam: string;
    awayTeam: string;
    score: string;
    totalGoals: number;
  };
  
  // League leaders
  topScorer: {
    playerId: number;
    playerName: string;
    teamName: string;
    goals: number;
  };
  
  topAssist: {
    playerId: number;
    playerName: string;
    teamName: string;
    assists: number;
  };
  
  // Team statistics
  bestAttack: {
    teamId: number;
    teamName: string;
    goalsScored: number;
    averagePerMatch: number;
  };
  
  bestDefense: {
    teamId: number;
    teamName: string;
    goalsConceded: number;
    averagePerMatch: number;
    cleanSheets: number;
  };
  
  // Form and trends
  formTable: LeagueTable[];
  homeTable: LeagueTable[];
  awayTable: LeagueTable[];
  
  // Analytics
  analytics: {
    competitiveness: number; // How close the league is
    predictability: number; // How predictable results are
    goalTrend: 'increasing' | 'decreasing' | 'stable';
    homeAdvantage: number; // Percentage of home wins
  };
}

export interface LeagueAnalytics {
  // Promotion/Relegation zones
  promotionZone: LeagueTable[];
  relegationZone: LeagueTable[];
  safeZone: LeagueTable[];
  
  // Predictions
  titleRace: {
    contenders: {
      teamId: number;
      teamName: string;
      probability: number;
      pointsNeeded: number;
    }[];
    mathematicallyDecided: boolean;
  };
  
  relegationBattle: {
    candidates: {
      teamId: number;
      teamName: string;
      probability: number;
      pointsNeeded: number;
    }[];
    mathematicallyDecided: boolean;
  };
  
  // Seasonal trends
  trends: {
    goalTrends: MonthlyTrend[];
    attendanceTrends: MonthlyTrend[];
    cardTrends: MonthlyTrend[];
  };
}

export interface MonthlyTrend {
  month: string;
  value: number;
  change: number;
  changePercentage: number;
}

// Request/Response DTOs
export interface LeagueRequest {
  chosenLeaguesOnly?: boolean;
  country?: number;
}

export interface LeagueSeasonRequest {
  seasonId: number;
  maxTime?: number;
}

export interface LeagueMatchesRequest {
  seasonId: number;
  page?: number;
  maxPerPage?: number;
  maxTime?: number;
}

export interface LeagueTeamsRequest {
  seasonId: number;
  page?: number;
  includeStats?: boolean;
  maxTime?: number;
}

export interface LeaguePlayersRequest {
  seasonId: number;
  includeStats?: boolean;
}

export interface LeagueRefereesRequest {
  seasonId: number;
}

export interface LeagueTablesRequest {
  seasonId: number;
}

export interface LeagueResponse {
  success: boolean;
  data?: League | League[];
  metadata?: {
    totalLeagues?: number;
    analysisTimestamp: string;
    dataSource: string;
    processingTime?: number;
  };
  error?: string;
}

export interface LeagueSeasonResponse {
  success: boolean;
  data?: LeagueSeason;
  stats?: LeagueStats;
  analytics?: LeagueAnalytics;
  metadata?: {
    analysisTimestamp: string;
    dataSource: string;
    processingTime?: number;
  };
  error?: string;
}

export interface LeagueTableResponse {
  success: boolean;
  data?: LeagueTable[];
  metadata?: {
    totalTeams?: number;
    lastUpdated: string;
    analysisTimestamp: string;
    dataSource: string;
    processingTime?: number;
  };
  error?: string;
}
