/**
 * 🎯 API Types - Shared between Frontend and Backend
 * 
 * These types mirror the backend DTOs from src/models
 * Ensures type safety across the entire application
 */

// ===== CORE API RESPONSE TYPES =====
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pager: {
    current_page: number;
    max_page: number;
    results_per_page: number;
    total_results: number;
  };
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
  metadata?: {
    timestamp: string;
    source: string;
    processingTime?: number;
    cacheStrategy?: {
      ttl: number;
      status: string;
      cacheKey: string;
    };
  };
}

// ===== MATCH TYPES =====
export interface Match {
  id: number;
  status: 'live' | 'upcoming' | 'finished';
  minute?: string | null;
  kickoff: string;
  home: {
    id: number;
    name: string;
    logo: string;
    score: number;
  };
  away: {
    id: number;
    name: string;
    logo: string;
    score: number;
  };
  league?: {
    id: number;
    name: string;
    country: string;
  };
  // Keep original fields for compatibility
  [key: string]: any;
}

export interface LiveMatch extends Match {
  status: 'live';
  minute: string;
  liveScore: {
    home: number;
    away: number;
    minute: string;
    status: string;
  };
}

export interface UpcomingMatch extends Match {
  status: 'upcoming';
  kickoffTime: string;
  timezone: string;
  predictions?: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
}

// ===== TEAM TYPES =====
export interface Team {
  id: number;
  name: string;
  cleanName?: string;
  shortHand?: string;
  country?: string;
  image?: string;
  logo?: string;
}

export interface TeamStats {
  id: number;
  name: string;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];
}

// ===== LEAGUE TYPES =====
export interface League {
  id: number;
  name: string;
  country: string;
  logo?: string;
  season?: string;
}

// ===== DASHBOARD TYPES =====
export interface DashboardData {
  totalMatches: number;
  liveMatches: Match[];
  upcomingMatches: Match[];
  totalLive: number;
  totalUpcoming: number;
  lastUpdated: string;
}

// ===== MATCH ANALYSIS TYPES =====
export interface MatchAnalysis {
  matchId: number;
  homeTeam: Team;
  awayTeam: Team;
  h2hMatches: Match[];
  predictions: {
    homeWin: number;
    draw: number;
    awayWin: number;
    btts: number;
    over25: number;
  };
  teamForm: {
    home: TeamStats;
    away: TeamStats;
  };
}

// ===== ERROR TYPES =====
export interface ApiError {
  success: false;
  error: string;
  code?: string;
  timestamp?: string;
  requestId?: string;
  path?: string;
  method?: string;
  details?: any;
  stack?: string;
}

// ===== REQUEST TYPES =====
export interface MatchSearchParams {
  status?: 'live' | 'upcoming' | 'finished';
  date?: string;
  limit?: number;
  timezone?: string;
}

export interface DashboardParams {
  timezone?: string;
  limit?: number;
}

export interface MatchAnalysisParams {
  matchId: number;
  includeH2H?: boolean;
  includePredictions?: boolean;
  includeForm?: boolean;
}
