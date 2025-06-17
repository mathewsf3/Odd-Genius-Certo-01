/**
 * Player DTO - Based on footy.yaml Player schema
 * Comprehensive player data type definitions
 */

export interface Player {
  // Core identifiers
  id: number;
  name: string;
  position?: string;
  age?: number;
  nationality?: string;
  team_id?: number;

  // Performance statistics
  goals_overall?: number;

  // Additional player information
  height?: number;
  weight?: number;
  preferredFoot?: 'left' | 'right' | 'both';
  shirtNumber?: number;
  marketValue?: number;
  contractExpiry?: string;
}

export interface PlayerStats {
  // Goal statistics
  goals: {
    total: number;
    homeGoals: number;
    awayGoals: number;
    penaltyGoals: number;
    freeKickGoals: number;
    headerGoals: number;
    leftFootGoals: number;
    rightFootGoals: number;
    goalsPerMatch: number;
    goalsPerMinute: number;
  };

  // Assist statistics
  assists: {
    total: number;
    homeAssists: number;
    awayAssists: number;
    assistsPerMatch: number;
    keyPasses: number;
    crossAccuracy: number;
  };

  // Appearance statistics
  appearances: {
    total: number;
    starts: number;
    substitutions: number;
    minutesPlayed: number;
    averageMinutesPerMatch: number;
  };

  // Disciplinary record
  cards: {
    yellow: number;
    red: number;
    yellowPerMatch: number;
    redPerMatch: number;
  };

  // Performance ratings
  ratings: {
    average: number;
    highest: number;
    lowest: number;
    homeAverage: number;
    awayAverage: number;
  };

  // Position-specific stats
  positionStats?: {
    // For defenders
    tackles?: number;
    interceptions?: number;
    clearances?: number;
    cleanSheets?: number;
    
    // For midfielders
    passAccuracy?: number;
    keyPasses?: number;
    dribbles?: number;
    
    // For forwards
    shotsOnTarget?: number;
    shotAccuracy?: number;
    bigChancesMissed?: number;
  };
}

export interface PlayerPerformance {
  // Recent form
  recentForm: {
    last5Matches: PlayerMatchPerformance[];
    last10Matches: PlayerMatchPerformance[];
    currentStreak: {
      type: 'goals' | 'assists' | 'cleanSheets' | 'cards';
      count: number;
    };
  };

  // Season progression
  seasonStats: {
    monthlyBreakdown: MonthlyPlayerStats[];
    homeVsAway: {
      home: PlayerStats;
      away: PlayerStats;
    };
    againstTopTeams: PlayerStats;
    againstBottomTeams: PlayerStats;
  };

  // Injury and fitness
  fitness: {
    injuryHistory: Injury[];
    currentInjuryStatus: 'fit' | 'injured' | 'doubtful' | 'suspended';
    fitnessRating: number;
    minutesPlayedPercentage: number;
  };
}

export interface PlayerMatchPerformance {
  matchId: number;
  opponent: string;
  venue: 'home' | 'away';
  minutesPlayed: number;
  goals: number;
  assists: number;
  rating: number;
  yellowCards: number;
  redCards: number;
  date: string;
}

export interface MonthlyPlayerStats {
  month: string;
  appearances: number;
  goals: number;
  assists: number;
  averageRating: number;
  minutesPlayed: number;
}

export interface Injury {
  type: string;
  severity: 'minor' | 'moderate' | 'major';
  startDate: string;
  endDate?: string;
  matchesMissed: number;
}

export interface PlayerComparison {
  players: Player[];
  comparison: {
    goals: PlayerComparisonStat;
    assists: PlayerComparisonStat;
    appearances: PlayerComparisonStat;
    rating: PlayerComparisonStat;
    disciplinary: PlayerComparisonStat;
  };
  summary: {
    bestGoalScorer: Player;
    bestAssistProvider: Player;
    mostConsistent: Player;
    mostDisciplined: Player;
  };
}

export interface PlayerComparisonStat {
  values: number[];
  best: {
    playerId: number;
    value: number;
  };
  average: number;
}

// Request/Response DTOs
export interface PlayerRequest {
  playerId: number;
  includeStats?: boolean;
  includePerformance?: boolean;
  season?: string;
}

export interface PlayerStatsRequest {
  playerId: number;
  season?: string;
  competition?: string;
  matchCount?: number;
}

export interface PlayerSearchRequest {
  query?: string;
  position?: string;
  nationality?: string;
  teamId?: number;
  ageMin?: number;
  ageMax?: number;
  limit?: number;
}

export interface PlayerResponse {
  success: boolean;
  data?: Player | Player[];
  stats?: PlayerStats;
  performance?: PlayerPerformance;
  metadata?: {
    totalPlayers?: number;
    analysisTimestamp: string;
    dataSource: string;
    processingTime?: number;
  };
  error?: string;
}

export interface PlayerComparisonResponse {
  success: boolean;
  data?: PlayerComparison;
  metadata?: {
    analysisTimestamp: string;
    dataSource: string;
    processingTime?: number;
  };
  error?: string;
}

// League player data
export interface LeaguePlayer extends Player {
  leagueStats?: {
    rank: number;
    goalsRank: number;
    assistsRank: number;
    ratingsRank: number;
    teamPosition: number;
    isTopScorer: boolean;
    isTopAssist: boolean;
  };
}
