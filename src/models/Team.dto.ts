/**
 * Team DTO - Based on footy.yaml Team schema
 * Comprehensive team data type definitions
 */

export interface Team {
  // Core identifiers
  id: number;
  original_id?: number;
  name: string;
  cleanName?: string;
  english_name?: string;
  shortHand?: string;
  full_name?: string;
  alt_names?: string[];

  // Location information
  country?: string;
  continent?: string;

  // Visual and web presence
  image?: string;
  url?: string;
  official_sites?: string[];

  // Stadium information
  stadium_name?: string;
  stadium_address?: string;

  // League and performance data
  season?: string;
  table_position?: number;
  performance_rank?: number;
  risk?: number;
  season_format?: string;
  competition_id?: number;

  // Historical data
  founded?: string;
}

export interface TeamStats {
  // Form and performance
  recentForm?: {
    last5Matches: MatchResult[];
    last10Matches: MatchResult[];
    wins: number;
    draws: number;
    losses: number;
    winPercentage: number;
  };

  // Goal statistics
  goals: {
    scored: number;
    conceded: number;
    average: number;
    averageConceded: number;
    cleanSheets: number;
    failedToScore: number;
  };

  // Home/Away splits
  homeStats?: TeamPerformanceStats;
  awayStats?: TeamPerformanceStats;

  // League position and points
  leaguePosition?: {
    current: number;
    points: number;
    played: number;
    goalDifference: number;
  };

  // Disciplinary record
  cards?: {
    yellow: number;
    red: number;
    averagePerMatch: number;
  };

  // Advanced analytics
  analytics?: {
    attackingStrength: number;
    defensiveStrength: number;
    overallRating: number;
    formRating: number;
    homeAdvantage: number;
  };
}

export interface TeamPerformanceStats {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  points: number;
  winPercentage: number;
  averageGoalsScored: number;
  averageGoalsConceded: number;
}

export interface MatchResult {
  matchId: number;
  opponent: string;
  venue: 'home' | 'away';
  result: 'win' | 'draw' | 'loss';
  goalsScored: number;
  goalsConceded: number;
  date: string;
  competition?: string;
}

export interface TeamComparison {
  homeTeam: Team;
  awayTeam: Team;
  headToHead: {
    totalMeetings: number;
    homeWins: number;
    awayWins: number;
    draws: number;
    lastMeeting?: {
      date: string;
      result: string;
      score: string;
    };
    recentForm: {
      homeTeamLast5: MatchResult[];
      awayTeamLast5: MatchResult[];
    };
  };
  comparison: {
    attackingStrength: {
      home: number;
      away: number;
      advantage: 'home' | 'away' | 'equal';
    };
    defensiveStrength: {
      home: number;
      away: number;
      advantage: 'home' | 'away' | 'equal';
    };
    overallRating: {
      home: number;
      away: number;
      advantage: 'home' | 'away' | 'equal';
    };
  };
}

// Request/Response DTOs
export interface TeamRequest {
  teamId: number;
  includeStats?: boolean;
  includeRecentForm?: boolean;
  matchCount?: number;
}

export interface TeamStatsRequest {
  teamId: number;
  matchCount?: number;
  season?: string;
  competition?: string;
}

export interface TeamSearchRequest {
  query: string;
  country?: string;
  league?: string;
  limit?: number;
}

export interface TeamResponse {
  success: boolean;
  data?: Team | Team[];
  stats?: TeamStats;
  metadata?: {
    totalTeams?: number;
    analysisTimestamp: string;
    dataSource: string;
    processingTime?: number;
  };
  error?: string;
}

export interface TeamComparisonResponse {
  success: boolean;
  data?: TeamComparison;
  metadata?: {
    analysisTimestamp: string;
    dataSource: string;
    processingTime?: number;
  };
  error?: string;
}

// League team data
export interface LeagueTeam extends Team {
  leagueStats?: {
    position: number;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    form: string;
    homeRecord: {
      played: number;
      wins: number;
      draws: number;
      losses: number;
    };
    awayRecord: {
      played: number;
      wins: number;
      draws: number;
      losses: number;
    };
  };
}
