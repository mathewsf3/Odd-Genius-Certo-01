/**
 * Match DTO - Based on footy.yaml Match schema
 * Comprehensive match data type definitions
 */

export interface Match {
  // Core match identifiers
  id: number;
  homeID: number;
  awayID: number;
  season: string;
  status: MatchStatus;
  roundID?: number;
  game_week?: number;
  revised_game_week?: number;

  // Goal information
  homeGoals?: string[];
  awayGoals?: string[];
  homeGoalCount: number;
  awayGoalCount: number;
  totalGoalCount: number;

  // Match statistics
  team_a_corners?: number;
  team_b_corners?: number;
  totalCornerCount?: number;
  team_a_offsides?: number;
  team_b_offsides?: number;

  // Cards
  team_a_yellow_cards?: number;
  team_b_yellow_cards?: number;
  team_a_red_cards?: number;
  team_b_red_cards?: number;
  team_a_cards_num?: number;
  team_b_cards_num?: number;

  // Shots
  team_a_shotsOnTarget?: number;
  team_b_shotsOnTarget?: number;
  team_a_shotsOffTarget?: number;
  team_b_shotsOffTarget?: number;
  team_a_shots?: number;
  team_b_shots?: number;

  // Other stats
  team_a_fouls?: number;
  team_b_fouls?: number;
  team_a_possession?: number;
  team_b_possession?: number;

  // Officials and venue
  refereeID?: number;
  coach_a_ID?: number;
  coach_b_ID?: number;
  stadium_name?: string;
  stadium_location?: string;

  // Betting odds
  odds_ft_1?: number;
  odds_ft_x?: number;
  odds_ft_2?: number;

  // Match timing
  date_unix: number;
  winningTeam?: number;

  // Goal analytics
  btts?: boolean;
  over05?: boolean;
  over15?: boolean;
  over25?: boolean;
  over35?: boolean;
  over45?: boolean;
  over55?: boolean;
}

export type MatchStatus = 'complete' | 'suspended' | 'canceled' | 'incomplete';

export interface MatchAnalytics {
  corners: {
    totalExpected: number;
    homeExpected: number;
    awayExpected: number;
    actual?: {
      home: number;
      away: number;
      total: number;
    };
  };
  cards: {
    totalExpected: number;
    yellowExpected: number;
    redExpected: number;
    actual?: {
      homeYellow: number;
      awayYellow: number;
      homeRed: number;
      awayRed: number;
      total: number;
    };
  };
  goals: {
    over25Probability: number;
    bttsLikelihood: number;
    expectedGoals: number;
    actual?: {
      home: number;
      away: number;
      total: number;
    };
  };
  shots: {
    expectedShotsOnTarget: number;
    expectedTotalShots: number;
    actual?: {
      homeShotsOnTarget: number;
      awayShotsOnTarget: number;
      homeTotalShots: number;
      awayTotalShots: number;
    };
  };
}

export interface MatchPrediction {
  outcome: {
    homeWinProbability: number;
    drawProbability: number;
    awayWinProbability: number;
    mostLikelyOutcome: 'home' | 'draw' | 'away';
  };
  goals: {
    over05: number;
    over15: number;
    over25: number;
    over35: number;
    over45: number;
    over55: number;
    btts: number;
    expectedGoals: number;
  };
  corners: {
    over75: number;
    over95: number;
    over105: number;
    over115: number;
    expectedCorners: number;
  };
  cards: {
    over15: number;
    over25: number;
    over35: number;
    over45: number;
    expectedCards: number;
  };
}

export interface MatchWithAnalytics extends Match {
  analytics?: MatchAnalytics;
  prediction?: MatchPrediction;
  homeTeam?: {
    info?: any;
    recentForm?: any;
    stats?: any;
  };
  awayTeam?: {
    info?: any;
    recentForm?: any;
    stats?: any;
  };
  referee?: {
    info?: any;
    stats?: any;
  };
}

// Request/Response DTOs
export interface MatchRequest {
  matchId: number;
  includeAnalytics?: boolean;
  includePredictions?: boolean;
  includeTeamStats?: boolean;
  includeRefereeStats?: boolean;
}

export interface TodaysMatchesRequest {
  date?: string;
  timezone?: string;
  page?: number;
  includeAnalytics?: boolean;
}

export interface MatchResponse {
  success: boolean;
  data?: Match | Match[];
  analytics?: MatchAnalytics;
  prediction?: MatchPrediction;
  metadata?: {
    totalMatches?: number;
    analysisTimestamp: string;
    dataSource: string;
    processingTime?: number;
  };
  error?: string;
}
