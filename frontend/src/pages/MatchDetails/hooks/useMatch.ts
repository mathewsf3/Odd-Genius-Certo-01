/**
 * 🎯 MATCH HOOK - FETCH SPECIFIC MATCH DATA
 * 
 * ✅ Fetches detailed match information by ID
 * ✅ Uses FootyStats API backend endpoint
 * ✅ Real-time polling for live matches
 * ✅ No mock data or fallbacks
 */

import { useCallback, useEffect, useState } from 'react';
import type { MatchData } from '../../../components/MatchCard';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface UseMatchReturn {
  data: MatchData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useMatch = (matchId: number): UseMatchReturn => {
  const [data, setData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatch = useCallback(async () => {
    if (!matchId) return;

    try {
      setError(null);
      console.log(`🎯 Fetching match details for ID: ${matchId}`);
      
      const url = new URL(`${API_BASE_URL}/api/v1/matches/${matchId}`);
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();

      if (!result?.success) {
        throw new Error(result?.message || 'Failed to fetch match details');
      }

      const match = result.data;
      console.log(`✅ Match details loaded:`, match);
      
      // Normalize the match data to match our MatchData interface
      const normalizedMatch: MatchData = {
        id: match.id,
        homeID: match.homeID || match.home_team_id,
        awayID: match.awayID || match.away_team_id,
        home_name: match.home_name,
        away_name: match.away_name,
        home_image: match.home_image || '/default-team.svg',
        away_image: match.away_image || '/default-team.svg',
        homeGoalCount: match.homeGoalCount || match.home_score || 0,
        awayGoalCount: match.awayGoalCount || match.away_score || 0,
        status: match.status || 'upcoming',
        date_unix: match.date_unix,
        stadium_name: match.stadium_name,
        stadium_location: match.stadium_location,
        competition_id: match.competition_id || match.seasonID,
        competition_name: match.competition_name || `Liga ${match.competition_id || match.seasonID || 'N/A'}`,
        country_name: match.country_name
      };
      
      setData(normalizedMatch);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Error fetching match details:', err);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  return {
    data,
    loading,
    error,
    refetch: fetchMatch
  };
};

// ✅ HOOK FOR MATCH STATISTICS
export const useMatchStats = (matchId: number) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!matchId) return;

    try {
      setError(null);
      console.log(`📊 Fetching match stats for ID: ${matchId}`);
      
      const url = new URL(`${API_BASE_URL}/api/v1/matches/${matchId}/analysis`);
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();

      if (!result?.success) {
        throw new Error(result?.message || 'Failed to fetch match stats');
      }

      console.log(`✅ Match stats loaded:`, result.data);
      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Error fetching match stats:', err);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    data,
    loading,
    error,
    refetch: fetchStats
  };
};
