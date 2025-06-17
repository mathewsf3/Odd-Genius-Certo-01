/**
 * Referee DTO - Based on footy.yaml Referee schema
 * Comprehensive referee data type definitions
 */

export interface Referee {
  // Core identifiers
  id: number;
  name: string;
  nationality?: string;
  matches_officiated?: number;

  // Additional referee information
  age?: number;
  experience?: number; // Years of experience
  level?: 'international' | 'national' | 'regional' | 'local';
  certifications?: string[];
  languages?: string[];
}

export interface RefereeStats {
  // Match statistics
  matches: {
    total: number;
    thisSeasonTotal: number;
    averagePerSeason: number;
    internationalMatches: number;
    domesticMatches: number;
  };

  // Card statistics
  cards: {
    yellowCards: {
      total: number;
      averagePerMatch: number;
      thisSeasonTotal: number;
      thisSeasonAverage: number;
    };
    redCards: {
      total: number;
      averagePerMatch: number;
      thisSeasonTotal: number;
      thisSeasonAverage: number;
    };
    totalCards: {
      total: number;
      averagePerMatch: number;
      thisSeasonTotal: number;
      thisSeasonAverage: number;
    };
  };

  // Penalty statistics
  penalties: {
    awarded: number;
    averagePerMatch: number;
    thisSeasonAwarded: number;
    penaltyConversionRate: number;
  };

  // Match control statistics
  control: {
    foulsPerMatch: number;
    offsideCallsPerMatch: number;
    advantagePlayedPerMatch: number;
    addedTimeAverage: number;
  };

  // Home/Away bias analysis
  bias: {
    homeWinPercentage: number;
    awayWinPercentage: number;
    drawPercentage: number;
    homeBias: number; // Positive means favors home team
    cardBias: {
      homeTeamCards: number;
      awayTeamCards: number;
      bias: number; // Positive means more cards to away team
    };
  };

  // Performance ratings
  ratings: {
    overall: number;
    consistency: number;
    matchControl: number;
    decisionAccuracy: number;
    communicationSkills: number;
  };
}

export interface RefereePerformance {
  // Recent form
  recentForm: {
    last10Matches: RefereeMatchPerformance[];
    last20Matches: RefereeMatchPerformance[];
    currentSeasonForm: RefereeMatchPerformance[];
  };

  // Seasonal progression
  seasonStats: {
    monthlyBreakdown: MonthlyRefereeStats[];
    competitionBreakdown: CompetitionRefereeStats[];
    venuePerformance: {
      homeVenue: RefereeStats;
      neutralVenue: RefereeStats;
    };
  };

  // Controversy and incidents
  incidents: {
    controversialDecisions: number;
    varReversals: number;
    postMatchReports: number;
    suspensions: RefereeIncident[];
  };
}

export interface RefereeMatchPerformance {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venue: string;
  date: string;
  yellowCards: number;
  redCards: number;
  penalties: number;
  fouls: number;
  offsides: number;
  addedTime: number;
  rating: number;
  controversies: number;
  varDecisions: number;
}

export interface MonthlyRefereeStats {
  month: string;
  matchesOfficiated: number;
  averageCardsPerMatch: number;
  averagePenaltiesPerMatch: number;
  averageRating: number;
  controversies: number;
}

export interface CompetitionRefereeStats {
  competition: string;
  matchesOfficiated: number;
  averageCardsPerMatch: number;
  averagePenaltiesPerMatch: number;
  averageRating: number;
  level: 'domestic' | 'international' | 'continental';
}

export interface RefereeIncident {
  type: 'suspension' | 'demotion' | 'warning' | 'investigation';
  reason: string;
  date: string;
  duration?: string;
  resolved: boolean;
}

export interface RefereeComparison {
  referees: Referee[];
  comparison: {
    cardsPerMatch: RefereeComparisonStat;
    penaltiesPerMatch: RefereeComparisonStat;
    matchControl: RefereeComparisonStat;
    consistency: RefereeComparisonStat;
    experience: RefereeComparisonStat;
  };
  summary: {
    mostExperienced: Referee;
    strictest: Referee;
    mostConsistent: Referee;
    bestRated: Referee;
  };
}

export interface RefereeComparisonStat {
  values: number[];
  best: {
    refereeId: number;
    value: number;
  };
  worst: {
    refereeId: number;
    value: number;
  };
  average: number;
}

// Request/Response DTOs
export interface RefereeRequest {
  refereeId: number;
  includeStats?: boolean;
  includePerformance?: boolean;
  season?: string;
}

export interface RefereeStatsRequest {
  refereeId: number;
  season?: string;
  competition?: string;
  matchCount?: number;
}

export interface RefereeSearchRequest {
  query?: string;
  nationality?: string;
  level?: string;
  experienceMin?: number;
  experienceMax?: number;
  limit?: number;
}

export interface RefereeResponse {
  success: boolean;
  data?: Referee | Referee[];
  stats?: RefereeStats;
  performance?: RefereePerformance;
  metadata?: {
    totalReferees?: number;
    analysisTimestamp: string;
    dataSource: string;
    processingTime?: number;
  };
  error?: string;
}

export interface RefereeComparisonResponse {
  success: boolean;
  data?: RefereeComparison;
  metadata?: {
    analysisTimestamp: string;
    dataSource: string;
    processingTime?: number;
  };
  error?: string;
}

// League referee data
export interface LeagueReferee extends Referee {
  leagueStats?: {
    rank: number;
    matchesInLeague: number;
    averageCardsInLeague: number;
    averagePenaltiesInLeague: number;
    leagueRating: number;
    isTopRated: boolean;
  };
}
