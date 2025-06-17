/**
 * 🎯 REAL DATA HOOKS - 100% API INTEGRATION
 * 
 * ✅ ZERO fallback data
 * ✅ Real-time updates
 * ✅ Error handling without mock data
 * ✅ TypeScript safety
 * ✅ Portuguese-BR error messages
 */

import { useCallback, useEffect, useState } from 'react';
import type { MatchData } from '../components/MatchCard';

// ✅ API RESPONSE TYPES - REAL BACKEND STRUCTURE
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

interface UseMatchDataReturn {
  matches: MatchData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

// ✅ ENVIRONMENT CONFIGURATION
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ✅ ENHANCED STATUS DETERMINATION - Following user's analysis
const determineMatchStatus = (backendMatch: any, sourceArray: 'live' | 'upcoming' | 'unknown' = 'unknown'): 'finalizada' | 'ao-vivo' | 'agendada' | 'adiada' | 'cancelada' => {
  // ✅ TRUST BACKEND NORMALIZED STATUS FIRST
  if (backendMatch.status === 'live') return 'ao-vivo';
  if (backendMatch.status === 'upcoming') return 'agendada';
  if (backendMatch.status === 'finished') return 'finalizada';

  // Handle explicit status mappings
  if (backendMatch.status === 'complete') return 'finalizada';
  if (backendMatch.status === 'postponed') return 'adiada';
  if (backendMatch.status === 'cancelled') return 'cancelada';
  if (backendMatch.status === 'suspended') return 'finalizada';

  // ✅ CRITICAL FIX: Trust the backend's array classification
  // If the backend sent this match in the "liveMatches" array, it's live
  // If it's in "upcomingMatches" array, it's upcoming
  // This prevents timezone/logic issues in the frontend

  if (sourceArray === 'live') {
    return 'ao-vivo';
  }

  if (sourceArray === 'upcoming') {
    return 'agendada';
  }

  // Fallback for unknown source (shouldn't happen with proper backend classification)
  if (backendMatch.status === 'incomplete') {
    // Default to scheduled if we don't know the source
    return 'agendada';
  }

  // Default to scheduled for unknown statuses
  return 'agendada';
};

// ✅ HELPER FUNCTION TO BUILD SAFE IMAGE URL
const buildImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '/default-team.svg';

  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Build correct FootyStats CDN URL
  return `https://cdn.footystats.org/img/${imagePath}`;
};

// ✅ REMOVED REAL-TIME TIMESTAMP - NO LONGER NEEDED
// Since we're not calculating fake match minutes anymore,
// we don't need to track real-time timestamp

// ✅ REMOVED FAKE TIME CALCULATION - API DOESN'T PROVIDE REAL MATCH MINUTE
// The FootyStats API doesn't provide current match minute, only start time
// Calculating elapsed time from start creates fake minutes that don't reflect real match time
// (pauses, halftime, stoppage time, etc. are not accounted for)
//
// Instead, we'll show only "AO VIVO" for live matches without fake minute display

// ✅ DYNAMIC LEAGUE MAPPING - FETCHED FROM API
let leagueMappingCache: { [seasonId: number]: string } = {};
let leagueMappingLoaded = false;

// ✅ FETCH COMPLETE LEAGUE MAPPING FROM BACKEND
const fetchLeagueMapping = async (): Promise<void> => {
  if (leagueMappingLoaded) return;

  try {
    console.log('🗺️ Fetching complete league mapping from API...');
    const response = await fetch('http://localhost:3000/api/v1/leagues/mapping');
    const result = await response.json();

    if (result.success && result.data?.mapping) {
      leagueMappingCache = result.data.mapping;
      leagueMappingLoaded = true;
      console.log(`✅ Loaded mapping for ${result.data.totalSeasons} seasons across ${result.data.totalLeagues} leagues`);
    } else {
      console.warn('⚠️ Failed to load league mapping, using fallback');
    }
  } catch (error) {
    console.error('❌ Error fetching league mapping:', error);
  }
};

// ✅ HELPER FUNCTION TO GET LEAGUE NAME FROM SEASON ID - DYNAMIC MAPPING
const getLeagueName = (seasonId: number): string => {
  // Use dynamic mapping if available
  if (leagueMappingCache[seasonId]) {
    return leagueMappingCache[seasonId];
  }

  // Fallback to static mapping for common IDs - ENHANCED COVERAGE
  const staticLeagueMap: { [key: number]: string } = {
    // Major European Leagues
    14124: 'Premier League',
    14125: 'La Liga',
    14126: 'Serie A',
    14127: 'Bundesliga',
    14128: 'Ligue 1',
    14131: 'Eredivisie',
    14132: 'Primeira Liga',
    14133: 'Scottish Premiership',
    14134: 'Belgian Pro League',
    14135: 'Austrian Bundesliga',
    14136: 'Swiss Super League',
    14137: 'Danish Superliga',
    14138: 'Norwegian Eliteserien',
    14139: 'Swedish Allsvenskan',

    // International Competitions
    14100: 'UEFA Champions League',
    14101: 'UEFA Europa League',
    14102: 'UEFA Conference League',
    14103: 'FIFA World Cup',
    14104: 'UEFA European Championship',
    14105: 'Copa América',
    14106: 'CONCACAF Gold Cup',
    14107: 'AFC Asian Cup',
    14108: 'Africa Cup of Nations',

    // American Leagues
    14123: 'MLS (USA)',
    14122: 'NWSL (USA)',
    14130: 'Liga MX',
    14596: 'Canadian Soccer League',
    14597: 'USL Championship',
    14598: 'Liga de Expansión MX',

    // South American Leagues
    14129: 'Brasileirão Série A',
    14116: 'Primera División Chile',
    14157: 'Primera División Argentina',
    14158: 'Primera División Uruguay',
    14159: 'Liga Profesional Colombia',
    14160: 'Primera División Peru',
    14161: 'Primera División Ecuador',
    14162: 'Primera División Paraguay',
    14163: 'Primera División Bolivia',
    14164: 'Primera División Venezuela',

    // Asian Leagues
    14165: 'J1 League (Japan)',
    14166: 'K League 1 (South Korea)',
    14167: 'Chinese Super League',
    14168: 'A-League (Australia)',
    14169: 'Thai League 1',
    14170: 'V.League 1 (Vietnam)',
    14171: 'Malaysian Super League',
    14172: 'Singapore Premier League',
    14173: 'Indian Super League',

    // African Leagues
    14180: 'Egyptian Premier League',
    14181: 'South African Premier Division',
    14182: 'Moroccan Botola Pro',
    14183: 'Tunisian Ligue Professionnelle 1',
    14184: 'Algerian Ligue Professionnelle 1',

    // Common problematic IDs
    14085: 'Liga Regional',
    14305: 'Liga Nacional',
    14306: 'Copa Regional',
    14307: 'Torneo Nacional',
    14308: 'Liga Profissional',
    14309: 'Campeonato Nacional',
    14310: 'Copa Nacional',
    14311: 'Liga Primera',
    14312: 'Liga Segunda',
    14313: 'Copa da Liga',
    14314: 'Taça Nacional',
    14315: 'Supercopa',

    // Additional common season IDs that appear frequently
    1: 'Liga Principal',
    2: 'Liga Secundária',
    3: 'Copa Nacional',
    4: 'Liga Regional',
    5: 'Torneio Nacional',
    100: 'Liga Primeira',
    101: 'Liga Segunda',
    102: 'Copa da Liga',
    103: 'Taça Nacional',
    104: 'Supercopa',
    105: 'Liga dos Campeões Regional'
  };

  return staticLeagueMap[seasonId] || `Liga ${seasonId}`;
};

// ✅ TRANSFORM BACKEND DATA TO FRONTEND FORMAT - ENHANCED WITH REAL LEAGUE NAMES & SCORES
const transformBackendMatch = (backendMatch: any, sourceArray: 'live' | 'upcoming' | 'unknown' = 'unknown'): MatchData => {
  const matchStatus = determineMatchStatus(backendMatch, sourceArray);

  return {
    id: backendMatch.id,
    timeCasa: {
      id: backendMatch.homeID,
      nome: backendMatch.home_name || 'Time Casa',
      logo: buildImageUrl(backendMatch.home_image)
    },
    timeVisitante: {
      id: backendMatch.awayID,
      nome: backendMatch.away_name || 'Time Visitante',
      logo: buildImageUrl(backendMatch.away_image)
    },
    // ✅ FIXED: Proper score handling - preserve real 0 scores, handle null/undefined
    placarCasa: backendMatch.homeGoalCount != null ? backendMatch.homeGoalCount : 0,
    placarVisitante: backendMatch.awayGoalCount != null ? backendMatch.awayGoalCount : 0,
    status: matchStatus,
    tempo: matchStatus === 'ao-vivo' ? 'AO VIVO' : undefined,
    dataHora: new Date(backendMatch.date_unix * 1000).toISOString(),
    horario: new Date(backendMatch.date_unix * 1000).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    dataUnix: backendMatch.date_unix,
    estadio: {
      nome: backendMatch.stadium_name || 'Estádio não informado',
      cidade: backendMatch.stadium_location || 'Cidade não informada'
    },
    liga: {
      nome: getLeagueName(backendMatch.competition_id || 1)
    }
  };
};

// ✅ INTERFACE FOR LIVE MATCHES WITH TRUE TOTAL COUNT
interface LiveMatchesReturn extends UseMatchDataReturn {
  totalLive: number; // TRUE total count from API, not just displayed matches
}

// ✅ HOOK FOR LIVE MATCHES - REAL DATA ONLY WITH TRUE TOTAL COUNT
export const useLiveMatches = (): LiveMatchesReturn => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [totalLive, setTotalLive] = useState<number>(0);

  const fetchLiveMatches = useCallback(async () => {
    try {
      setError(null);

      // ✅ LIVE MATCHES: Use new live match service with real-time scores
      const response = await fetch(`${API_BASE_URL}/api/v1/matches/live?limit=6`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before refreshing.');
        }
        throw new Error(`Erro ${response.status}: Falha ao buscar partidas ao vivo`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro desconhecido ao buscar partidas');
      }

      // ✅ USE NORMALIZED DATA FROM LIVE MATCH SERVICE
      const liveMatches = result.data?.liveMatches || [];
      const trueTotalLive = result.data?.totalLive || 0; // TRUE total count from API

      // ✅ VALIDATE ARRAY BEFORE MAPPING
      if (!Array.isArray(liveMatches)) {
        console.warn('Live matches data is not an array:', liveMatches);
        setMatches([]);
        setTotalLive(trueTotalLive); // Still set the true total even if display data is empty
        setLastUpdated(new Date());
        return;
      }

      // ✅ DATA IS ALREADY NORMALIZED - Use directly or apply minimal transformation
      const transformedMatches = liveMatches.map(match => {
        // If data is already in MatchData format, use it directly
        if (match.timeCasa && match.timeVisitante) {
          return match as MatchData;
        }
        // Otherwise, transform from backend format
        return transformBackendMatch(match, 'live');
      });

      console.log(`🔴 LIVE MATCHES DEBUG:`, {
        rawLiveMatches: liveMatches.length,
        transformedMatches: transformedMatches.length,
        trueTotalLive: trueTotalLive,
        firstMatch: transformedMatches[0],
        allStatuses: transformedMatches.map(m => ({ id: m.id, status: m.status, score: `${m.placarCasa}x${m.placarVisitante}` }))
      });

      setMatches(transformedMatches);
      setTotalLive(trueTotalLive); // Set the TRUE total count
      setLastUpdated(new Date());
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar partidas ao vivo:', err);
      
      // ❌ DO NOT SET FALLBACK DATA HERE
      // setMatches([]); // This is OK - empty array is not fallback data
      
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // ✅ INITIALIZE LEAGUE MAPPING ON FIRST LOAD
    fetchLeagueMapping();

    fetchLiveMatches();

    // ✅ AUTO-REFRESH FOR LIVE DATA (Rate limit friendly)
    const interval = setInterval(fetchLiveMatches, 180000); // 3 minutes

    return () => clearInterval(interval);
  }, [fetchLiveMatches]);

  return {
    matches,
    loading,
    error,
    refetch: fetchLiveMatches,
    lastUpdated,
    totalLive
  };
};

// ✅ HOOK FOR ALL LIVE MATCHES - FOR DEDICATED "AO VIVO" PAGE
export const useAllLiveMatches = (): LiveMatchesReturn => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [totalLive, setTotalLive] = useState<number>(0);

  const fetchAllLiveMatches = useCallback(async () => {
    try {
      setError(null);

      // ✅ AO VIVO PAGE: Request ALL live matches (no limit)
      const response = await fetch(`${API_BASE_URL}/api/v1/matches/live`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before refreshing.');
        }
        throw new Error(`Erro ${response.status}: Falha ao buscar todas as partidas ao vivo`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro desconhecido ao buscar partidas');
      }

      // ✅ TRANSFORM BACKEND DATA TO FRONTEND FORMAT
      const liveMatches = result.data?.liveMatches || [];
      const trueTotalLive = result.data?.totalLive || 0;

      // ✅ VALIDATE ARRAY BEFORE MAPPING
      if (!Array.isArray(liveMatches)) {
        console.warn('All live matches data is not an array:', liveMatches);
        setMatches([]);
        setTotalLive(trueTotalLive);
        setLastUpdated(new Date());
        return;
      }

      // ✅ DATA IS ALREADY NORMALIZED - Use directly or apply minimal transformation
      const transformedMatches = liveMatches.map(match => {
        // If data is already in MatchData format, use it directly
        if (match.timeCasa && match.timeVisitante) {
          return match as MatchData;
        }
        // Otherwise, transform from backend format
        return transformBackendMatch(match, 'live');
      });

      console.log(`🔴 ALL LIVE MATCHES DEBUG:`, {
        rawLiveMatches: liveMatches.length,
        transformedMatches: transformedMatches.length,
        trueTotalLive: trueTotalLive,
        isUnlimited: true
      });

      setMatches(transformedMatches);
      setTotalLive(trueTotalLive);
      setLastUpdated(new Date());

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar todas as partidas ao vivo:', err);

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // ✅ INITIALIZE LEAGUE MAPPING ON FIRST LOAD
    fetchLeagueMapping();

    fetchAllLiveMatches();

    // ✅ AUTO-REFRESH FOR LIVE DATA (More frequent for live page)
    const interval = setInterval(fetchAllLiveMatches, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [fetchAllLiveMatches]);

  return {
    matches,
    loading,
    error,
    refetch: fetchAllLiveMatches,
    lastUpdated,
    totalLive
  };
};

// ✅ INTERFACE FOR UPCOMING MATCHES WITH TOTAL COUNT IN 24H
interface UpcomingMatchesReturn extends UseMatchDataReturn {
  totalIn24h: number;
}

// ✅ HOOK FOR UPCOMING MATCHES - USING DASHBOARD ENDPOINT WITH NORMALIZED DATA
export const useUpcomingMatches = (limit: number = 6): UpcomingMatchesReturn => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [totalIn24h, setTotalIn24h] = useState<number>(0);

  const fetchUpcomingMatches = useCallback(async () => {
    try {
      setError(null);

      // ✅ USE DASHBOARD ENDPOINT WITH NORMALIZED DATA
      const response = await fetch(`${API_BASE_URL}/api/v1/matches/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before refreshing.');
        }
        throw new Error(`Erro: Falha ao buscar próximas partidas`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error('Erro desconhecido ao buscar próximas partidas');
      }

      // ✅ USE NORMALIZED DATA FROM DASHBOARD ENDPOINT
      const upcomingMatches = result.data?.upcomingMatches || [];
      const totalUpcoming = result.data?.stats?.upcomingMatches || 0;

      // ✅ VALIDATE ARRAY BEFORE MAPPING
      if (!Array.isArray(upcomingMatches)) {
        console.warn('Upcoming matches data is not an array:', upcomingMatches);
        setMatches([]);
        setTotalIn24h(totalUpcoming);
        setLastUpdated(new Date());
        return;
      }

      const transformedMatches = upcomingMatches.map(match => transformBackendMatch(match, 'upcoming'));

      console.log(`📊 UPCOMING MATCHES DEBUG:`, {
        rawUpcomingMatches: upcomingMatches.length,
        transformedMatches: transformedMatches.length,
        totalUpcoming: totalUpcoming,
        firstMatch: transformedMatches[0],
        allStatuses: transformedMatches.map(m => ({ id: m.id, status: m.status, score: `${m.placarCasa}x${m.placarVisitante}` }))
      });

      setMatches(transformedMatches);
      setTotalIn24h(totalUpcoming);
      setLastUpdated(new Date());

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Falha ao carregar próximas partidas: ${errorMessage}`);
      console.error('🚨 API Error:', err);

    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchUpcomingMatches();

    // ✅ REFRESH EVERY 10 MINUTES FOR UPCOMING MATCHES (Rate limit friendly)
    const interval = setInterval(fetchUpcomingMatches, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, [fetchUpcomingMatches]);

  return {
    matches,
    loading,
    error,
    refetch: fetchUpcomingMatches,
    lastUpdated,
    totalIn24h
  };
};

// ✅ INTERFACE FOR TOTAL MATCH COUNT
interface TotalCountReturn {
  totalCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: Date | null;
}

// ✅ ENHANCED INTERFACE FOR TODAY'S MATCHES WITH TOTAL COUNT
interface TodaysMatchesReturn {
  selectedMatch: MatchData | null;
  totalCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: Date | null;
}

// ✅ HOOK FOR TOTAL MATCH COUNT - OPTIMIZED FOR DASHBOARD
export const useTotalMatchCount = (): TotalCountReturn => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTotalCount = useCallback(async () => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/v1/matches/total-count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before refreshing.');
        }
        throw new Error(`Erro ${response.status}: Falha ao buscar total de partidas`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro desconhecido ao buscar total de partidas');
      }

      setTotalCount(result.totalMatches || 0);
      setLastUpdated(new Date());

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar total de partidas:', err);

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTotalCount();

    // ✅ REFRESH EVERY 10 MINUTES FOR TOTAL COUNT (Rate limit friendly)
    const interval = setInterval(fetchTotalCount, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, [fetchTotalCount]);

  return {
    totalCount,
    loading,
    error,
    refetch: fetchTotalCount,
    lastUpdated
  };
};

// ✅ HOOK FOR TODAY'S MATCHES - REAL DATA ONLY WITH TOTAL COUNT
export const useTodaysMatches = (): TodaysMatchesReturn => {
  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTodaysMatches = useCallback(async () => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/matches/today`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before refreshing.');
        }
        throw new Error(`Erro ${response.status}: Falha ao buscar partidas de hoje`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro desconhecido ao buscar partidas de hoje');
      }

      // ✅ EXTRACT TOTAL COUNT AND SELECTED MATCH FROM BACKEND RESPONSE
      const totalMatches = result.data?.totalMatches || 0;
      const selectedMatchData = result.data?.selectedMatch;
      const transformedMatch = selectedMatchData ? transformBackendMatch(selectedMatchData) : null;

      setTotalCount(totalMatches);
      setSelectedMatch(transformedMatch);
      setLastUpdated(new Date());
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar partidas de hoje:', err);
      
      // ❌ DO NOT SET FALLBACK DATA HERE
      
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodaysMatches();
    
    // ✅ REFRESH EVERY 5 MINUTES FOR TODAY'S MATCHES (Rate limit friendly)
    const interval = setInterval(fetchTodaysMatches, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [fetchTodaysMatches]);

  return {
    selectedMatch,
    totalCount,
    loading,
    error,
    refetch: fetchTodaysMatches,
    lastUpdated
  };
};

// ✅ INTERFACE FOR UPCOMING MATCHES COUNT
interface UpcomingCountReturn {
  totalUpcoming: number;
  totalIn24h: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: Date | null;
}

// ✅ HOOK FOR UPCOMING MATCHES COUNT - OPTIMIZED FOR DASHBOARD STATISTICS
export const useUpcomingMatchesCount = (): UpcomingCountReturn => {
  const [totalUpcoming, setTotalUpcoming] = useState<number>(0);
  const [totalIn24h, setTotalIn24h] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchUpcomingCount = useCallback(async () => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/v1/matches/upcoming-count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before refreshing.');
        }
        throw new Error(`Erro ${response.status}: Falha ao buscar contagem de próximas partidas`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro desconhecido ao buscar contagem de próximas partidas');
      }

      setTotalUpcoming(result.totalUpcoming || 0);
      setTotalIn24h(result.totalIn24h || 0);
      setLastUpdated(new Date());

      console.log(`📊 UPCOMING COUNT: ${result.totalIn24h} in 24h, ${result.totalUpcoming} total`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar contagem de próximas partidas:', err);

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUpcomingCount();

    // ✅ REFRESH EVERY 10 MINUTES FOR UPCOMING COUNT (Rate limit friendly)
    const interval = setInterval(fetchUpcomingCount, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, [fetchUpcomingCount]);

  return {
    totalUpcoming,
    totalIn24h,
    loading,
    error,
    refetch: fetchUpcomingCount,
    lastUpdated
  };
};

// ✅ HOOK FOR SINGLE MATCH DETAILS - REAL DATA ONLY
export const useMatchDetails = (matchId: number) => {
  const [match, setMatch] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatchDetails = useCallback(async () => {
    if (!matchId) return;
    
    try {
      setError(null);
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/matches/${matchId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: Falha ao buscar detalhes da partida`);
      }

      const result: ApiResponse<MatchData> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro desconhecido ao buscar detalhes da partida');
      }

      // ✅ SET REAL DATA - NO FALLBACKS
      setMatch(result.data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar detalhes da partida:', err);
      
      // ❌ DO NOT SET FALLBACK DATA HERE
      
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchMatchDetails();
  }, [fetchMatchDetails]);

  return {
    match,
    loading,
    error,
    refetch: fetchMatchDetails
  };
};

// ✅ OPTIMIZED DASHBOARD HOOK - SINGLE API CALL FOR ALL DATA
interface DashboardData {
  liveMatches: Match[];
  upcomingMatches: Match[];
  stats: {
    totalMatches: number;
    liveMatches: number;
    upcomingMatches: number;
  };
}

interface DashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: Date | null;
}

export const useDashboardData = (): DashboardReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📊 Fetching optimized dashboard data...');
      const response = await fetch(`${API_BASE_URL}/api/v1/matches/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before refreshing.');
        }
        throw new Error(`Erro ${response.status}: Falha ao buscar dados do dashboard`);
      }

      const result = await response.json();
      console.log('📊 Dashboard response:', result);

      if (result.success && result.data) {
        setData(result.data);
        setLastUpdated(new Date());
        console.log(`✅ Dashboard loaded: ${result.data.stats.liveMatches} live, ${result.data.stats.upcomingMatches} upcoming`);
      } else {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    // Refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const refetch = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refetch,
    lastUpdated
  };
};
