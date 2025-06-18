/**
 * 🎯 API Service Layer - Football Analytics Data Services
 * 
 * High-level service functions that use the API client
 * Provides typed interfaces for all football data operations
 * Mirrors backend service patterns for consistency
 */

import { api, ApiClient } from '@/lib/api-client';
import {
    DashboardData,
    DashboardParams,
    LiveMatch,
    Match,
    MatchAnalysis,
    MatchAnalysisParams,
    MatchSearchParams,
    UpcomingMatch
} from '@/types/api';

// ===== DASHBOARD SERVICES =====

/**
 * Get dashboard data with live and upcoming matches (with caching)
 */
export async function getDashboardData(params: DashboardParams = {}) {
  const timezone = params.timezone || 'America/Sao_Paulo';
  const cacheKey = `dashboard:${timezone}:${params.limit || 'all'}`;

  try {
    // Try cache first
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > 30000; // 30 seconds TTL
        if (!isExpired) {
          console.log('📦 Cache HIT: Dashboard data');
          return data;
        }
      }
    }

    const startTime = performance.now();
    const response = await api.get<DashboardData>('/matches/dashboard', {
      timezone,
      ...(params.limit && { limit: params.limit.toString() }),
    });

    const data = ApiClient.handleResponse(response);
    const duration = performance.now() - startTime;

    // Track performance
    console.log(`📊 API Call: Dashboard (${duration.toFixed(2)}ms)`);

    // Cache the result
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching dashboard data:', error);
    throw error;
  }
}

// ===== MATCH SERVICES =====

/**
 * Get detailed information for a specific match
 */
export async function getMatchById(matchId: number) {
  try {
    const response = await api.get<Match>(`/matches/${matchId}`);
    return ApiClient.handleResponse(response);
  } catch (error) {
    console.error(`❌ Error fetching match ${matchId}:`, error);
    throw error;
  }
}

/**
 * Get comprehensive analysis for a specific match
 */
export async function getMatchAnalysis(params: MatchAnalysisParams) {
  try {
    const queryParams: Record<string, string> = {};
    
    if (params.includeH2H !== undefined) {
      queryParams.includeH2H = params.includeH2H.toString();
    }
    if (params.includePredictions !== undefined) {
      queryParams.includePredictions = params.includePredictions.toString();
    }
    if (params.includeForm !== undefined) {
      queryParams.includeForm = params.includeForm.toString();
    }
    
    const response = await api.get<MatchAnalysis>(
      `/matches/${params.matchId}/analysis`,
      queryParams
    );
    
    return ApiClient.handleResponse(response);
  } catch (error) {
    console.error(`❌ Error fetching match analysis ${params.matchId}:`, error);
    throw error;
  }
}

/**
 * Get live matches with real-time data
 */
export async function getLiveMatches(limit?: number, forceRefresh?: boolean) {
  try {
    const params: Record<string, string> = {};
    if (limit) params.limit = limit.toString();
    if (forceRefresh) params.forceRefresh = 'true';
    
    const response = await api.get<{
      liveMatches: LiveMatch[];
      totalLive: number;
      lastUpdated: string;
      nextUpdate?: string;
      isLimited: boolean;
      limit: number | null;
    }>('/matches/live', params);
    
    return ApiClient.handleResponse(response);
  } catch (error) {
    console.error('❌ Error fetching live matches:', error);
    throw error;
  }
}

/**
 * Get upcoming matches
 */
export async function getUpcomingMatches(
  limit?: number,
  hours: number = 48,
  timezone: string = 'America/Sao_Paulo'
) {
  try {
    const params: Record<string, string> = {
      hours: hours.toString(),
      timezone,
    };
    if (limit) params.limit = limit.toString();
    
    const response = await api.get<{
      upcomingMatches: UpcomingMatch[];
      totalUpcoming: number;
      isLimited: boolean;
      limit: number | null;
      hours: number;
      timezone: string;
    }>('/matches/upcoming', params);
    
    return ApiClient.handleResponse(response);
  } catch (error) {
    console.error('❌ Error fetching upcoming matches:', error);
    throw error;
  }
}

/**
 * Search matches with various filters
 */
export async function searchMatches(params: MatchSearchParams) {
  try {
    const queryParams: Record<string, string> = {};
    
    if (params.status) queryParams.status = params.status;
    if (params.date) queryParams.date = params.date;
    if (params.limit) queryParams.limit = params.limit.toString();
    if (params.timezone) queryParams.timezone = params.timezone;
    
    const response = await api.get<Match[]>('/matches/search', queryParams);
    return ApiClient.handleResponse(response);
  } catch (error) {
    console.error('❌ Error searching matches:', error);
    throw error;
  }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Check if a match is currently live
 */
export function isMatchLive(match: Match): match is LiveMatch {
  return match.status === 'live';
}

/**
 * Check if a match is upcoming
 */
export function isMatchUpcoming(match: Match): match is UpcomingMatch {
  return match.status === 'upcoming';
}

/**
 * Format match time for display
 */
export function formatMatchTime(match: Match, timezone: string = 'America/Sao_Paulo'): string {
  try {
    const date = new Date(match.kickoff);
    return date.toLocaleString('pt-BR', {
      timeZone: timezone,
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Horário inválido';
  }
}

/**
 * Get match status display text in Portuguese
 */
export function getMatchStatusText(match: Match): string {
  switch (match.status) {
    case 'live':
      const minute = match.minute;
      return (minute && !isNaN(Number(minute))) ? `${String(minute)}'` : 'AO VIVO';
    case 'upcoming':
      return formatMatchTime(match);
    case 'finished':
      return 'ENCERRADO';
    default:
      return 'DESCONHECIDO';
  }
}

// ===== ERROR HANDLING UTILITIES =====

/**
 * Handle API errors with user-friendly messages
 */
export function handleApiError(error: unknown): string {
  if (ApiClient.isNetworkError(error)) {
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  }
  
  if (ApiClient.isValidationError(error)) {
    return 'Dados inválidos fornecidos.';
  }
  
  const apiError = ApiClient.formatError(error);
  return apiError.error || 'Erro desconhecido ocorreu.';
}
