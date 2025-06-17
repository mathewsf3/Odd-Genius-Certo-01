/**
 * 🎯 REAL DATA HOOKS - 100% API INTEGRATION
 * 
 * ✅ ZERO fallback data
 * ✅ Real-time updates
 * ✅ Error handling without mock data
 * ✅ TypeScript safety
 * ✅ Portuguese-BR error messages
 */

"use client";

import { useCallback, useEffect, useState } from 'react';
import { MatchData } from '../components/MatchCard';

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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// ✅ HOOK FOR LIVE MATCHES - REAL DATA ONLY
export const useLiveMatches = (): UseMatchDataReturn => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLiveMatches = useCallback(async () => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/matches/live`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: Falha ao buscar partidas ao vivo`);
      }

      const result: ApiResponse<MatchData[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro desconhecido ao buscar partidas');
      }

      // ✅ SET REAL DATA - NO FALLBACKS
      setMatches(result.data);
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
    fetchLiveMatches();
    
    // ✅ AUTO-REFRESH FOR LIVE DATA
    const interval = setInterval(fetchLiveMatches, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchLiveMatches]);

  return {
    matches,
    loading,
    error,
    refetch: fetchLiveMatches,
    lastUpdated
  };
};

// ✅ HOOK FOR UPCOMING MATCHES - REAL DATA ONLY
export const useUpcomingMatches = (limit: number = 6): UseMatchDataReturn => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchUpcomingMatches = useCallback(async () => {
    try {
      setError(null);
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/matches/upcoming?limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: Falha ao buscar próximas partidas`);
      }

      const result: ApiResponse<MatchData[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro desconhecido ao buscar próximas partidas');
      }

      // ✅ SET REAL DATA - NO FALLBACKS
      setMatches(result.data);
      setLastUpdated(new Date());
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar próximas partidas:', err);
      
      // ❌ DO NOT SET FALLBACK DATA HERE
      
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchUpcomingMatches();
    
    // ✅ REFRESH EVERY 5 MINUTES FOR UPCOMING MATCHES
    const interval = setInterval(fetchUpcomingMatches, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [fetchUpcomingMatches]);

  return {
    matches,
    loading,
    error,
    refetch: fetchUpcomingMatches,
    lastUpdated
  };
};

// ✅ HOOK FOR TODAY'S MATCHES - REAL DATA ONLY
export const useTodaysMatches = (): UseMatchDataReturn => {
  const [matches, setMatches] = useState<MatchData[]>([]);
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
        throw new Error(`Erro ${response.status}: Falha ao buscar partidas de hoje`);
      }

      const result: ApiResponse<MatchData[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro desconhecido ao buscar partidas de hoje');
      }

      // ✅ SET REAL DATA - NO FALLBACKS
      setMatches(result.data);
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
    
    // ✅ REFRESH EVERY 2 MINUTES FOR TODAY'S MATCHES
    const interval = setInterval(fetchTodaysMatches, 120000); // 2 minutes
    
    return () => clearInterval(interval);
  }, [fetchTodaysMatches]);

  return {
    matches,
    loading,
    error,
    refetch: fetchTodaysMatches,
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
