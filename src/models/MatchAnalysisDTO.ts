/**
 * 🎯 MATCH ANALYSIS DTOs - TYPE-SAFE DATA TRANSFER OBJECTS
 * 
 * ✅ Comprehensive DTOs for all match analysis endpoints
 * ✅ Support for range selection (last 5 or 10 games)
 * ✅ Portuguese-BR compatible interfaces
 * ✅ Full FootyStats API alignment
 */

// ✅ BASE INTERFACES
export interface BaseAnalysisResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata: {
    timestamp: string;
    source: string;
    matchId?: number;
    range?: 5 | 10;
  };
}

// ✅ H2H ANALYSIS DTOs
export interface H2HMatchData {
  id: number;
  homeID: number;
  awayID: number;
  home_name: string;
  away_name: string;
  homeGoalCount: number;
  awayGoalCount: number;
  date_unix: number;
  competition_name?: string;
  status: string;
}

export interface H2HSummary {
  totalMatches: number;
  homeWins: number;
  awayWins: number;
  draws: number;
  homeWinPercentage: number;
  awayWinPercentage: number;
  drawPercentage: number;
}

export interface H2HAnalysisDTO {
  matches: H2HMatchData[];
  summary: H2HSummary;
}

// ✅ CORNER ANALYSIS DTOs
export interface CornerStats {
  averageFor: number;
  averageAgainst: number;
  totalMatches: number;
  totalCornersFor: number;
  totalCornersAgainst: number;
}

export interface TeamCornerData {
  id: number;
  name: string;
  cornerStats: CornerStats;
}

export interface CornerPredictions {
  totalCornersExpected: number;
  over9CornersLikelihood: number;
  over11CornersLikelihood: number;
}

export interface CornerAnalysisDTO {
  homeTeam: TeamCornerData;
  awayTeam: TeamCornerData;
  predictions: CornerPredictions;
}

// ✅ GOAL ANALYSIS DTOs
export interface GoalStats {
  averageScored: number;
  averageConceded: number;
  totalMatches: number;
  totalGoalsScored: number;
  totalGoalsConceded: number;
}

export interface TeamGoalData {
  id: number;
  name: string;
  goalStats: GoalStats;
}

export interface GoalPredictions {
  expectedGoals: number;
  over15Likelihood: number;
  over25Likelihood: number;
  bttsLikelihood: number;
}

export interface GoalAnalysisDTO {
  homeTeam: TeamGoalData;
  awayTeam: TeamGoalData;
  predictions: GoalPredictions;
}

// ✅ CARD ANALYSIS DTOs
export interface CardStats {
  averageYellowCards: number;
  averageRedCards: number;
  totalMatches: number;
  totalYellowCards: number;
  totalRedCards: number;
}

export interface TeamCardData {
  id: number;
  name: string;
  cardStats: CardStats;
}

export interface CardPredictions {
  totalCardsExpected: number;
  over3CardsLikelihood: number;
  over5CardsLikelihood: number;
  redCardLikelihood: number;
}

export interface CardAnalysisDTO {
  homeTeam: TeamCardData;
  awayTeam: TeamCardData;
  predictions: CardPredictions;
}

// ✅ TEAM FORM ANALYSIS DTOs
export interface FormMatch {
  id: number;
  opponent: string;
  result: 'W' | 'D' | 'L';
  goalsFor: number;
  goalsAgainst: number;
  date_unix: number;
  homeAway: 'home' | 'away';
}

export interface FormStats {
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  winPercentage: number;
  form: string; // e.g., "WWDLW"
}

export interface TeamFormDTO {
  teamId: number;
  teamName: string;
  range: 5 | 10;
  matches: FormMatch[];
  stats: FormStats;
}

// ✅ COMPREHENSIVE MATCH OVERVIEW DTO
export interface MatchOverviewDTO {
  matchInfo: {
    id: number;
    homeTeam: string;
    awayTeam: string;
    competition: string;
    date_unix: number;
    venue?: string;
    status: string;
  };
  h2hSummary: H2HSummary;
  homeTeamForm: FormStats;
  awayTeamForm: FormStats;
  keyStatistics: {
    corners: CornerPredictions;
    goals: GoalPredictions;
    cards: CardPredictions;
  };
  predictions: {
    homeWinProbability: number;
    drawProbability: number;
    awayWinProbability: number;
    confidence: number;
  };
}

// ✅ API RESPONSE WRAPPERS
export interface H2HAnalysisResponse extends BaseAnalysisResponse {
  data: H2HAnalysisDTO;
  metadata: BaseAnalysisResponse['metadata'] & {
    homeId: number;
    awayId: number;
  };
}

export interface CornerAnalysisResponse extends BaseAnalysisResponse {
  data: CornerAnalysisDTO;
}

export interface GoalAnalysisResponse extends BaseAnalysisResponse {
  data: GoalAnalysisDTO;
}

export interface CardAnalysisResponse extends BaseAnalysisResponse {
  data: CardAnalysisDTO;
}

export interface TeamFormResponse extends BaseAnalysisResponse {
  data: TeamFormDTO;
  metadata: BaseAnalysisResponse['metadata'] & {
    teamId: number;
  };
}

export interface MatchOverviewResponse extends BaseAnalysisResponse {
  data: MatchOverviewDTO;
}

// ✅ REQUEST OPTIONS
export interface AnalysisRequestOptions {
  range?: 5 | 10;
  includeForm?: boolean;
  includeStats?: boolean;
  includePredictions?: boolean;
}
