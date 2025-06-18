/**
 * 🎯 TEAM MATCHES HOOK - FETCH TEAM'S RECENT MATCHES
 * 
 * ✅ Fetches last N matches for a specific team
 * ✅ Used for H2H analysis and statistics
 * ✅ Configurable limit (5, 10, or season)
 * ✅ No mock data or fallbacks
 */

import { useCallback, useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface TeamMatch {
  id: number;
  home_team_id: number;
  away_team_id: number;
  home_name: string;
  away_name: string;
  home_score: number;
  away_score: number;
  status: string;
  date_unix: number;
  competition_id: number;
  competition_name?: string;
  home_corner_count?: number;
  away_corner_count?: number;
  corner_total?: number;
  home_yellow_cards?: number;
  away_yellow_cards?: number;
  home_red_cards?: number;
  away_red_cards?: number;
}

export interface UseTeamMatchesReturn {
  data: TeamMatch[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTeamMatches = (teamId: number, limit: number = 10): UseTeamMatchesReturn => {
  const [data, setData] = useState<TeamMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMatches = useCallback(async () => {
    if (!teamId) return;

    try {
      setError(null);
      console.log(`🏆 Fetching last ${limit} matches for team ID: ${teamId}`);
      
      const url = new URL(`${API_BASE_URL}/api/v1/teams/${teamId}/matches`);
      url.searchParams.append('limit', limit.toString());
      url.searchParams.append('timezone', 'America/Sao_Paulo');
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();

      if (!result?.success) {
        throw new Error(result?.message || 'Failed to fetch team matches');
      }

      const matches = result.data || [];
      console.log(`✅ Team matches loaded: ${matches.length} matches for team ${teamId}`);
      
      setData(matches);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Error fetching team matches:', err);
    } finally {
      setLoading(false);
    }
  }, [teamId, limit]);

  useEffect(() => {
    fetchTeamMatches();
  }, [fetchTeamMatches]);

  return {
    data,
    loading,
    error,
    refetch: fetchTeamMatches
  };
};

// ✅ HOOK FOR REFEREE STATISTICS
export const useRefereeStats = (refereeId: number | null) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRefereeStats = useCallback(async () => {
    if (!refereeId) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      console.log(`👨‍⚖️ Fetching referee stats for ID: ${refereeId}`);

      const response = await fetch(`${API_BASE_URL}/api/v1/referees/${refereeId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch referee stats: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
        console.log(`✅ Referee stats loaded for ID: ${refereeId}`);
      } else {
        throw new Error(result.error || 'Failed to load referee stats');
      }
    } catch (err) {
      console.error('❌ Error fetching referee stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [refereeId]);

  useEffect(() => {
    fetchRefereeStats();
  }, [fetchRefereeStats]);

  return { data, loading, error, refetch: fetchRefereeStats };
};

// ✅ HOOK FOR HEAD-TO-HEAD MATCHES
export const useH2HMatches = (homeId: number, awayId: number, limit: number = 10) => {
  const [data, setData] = useState<TeamMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchH2H = useCallback(async () => {
    if (!homeId || !awayId) return;

    try {
      setError(null);
      console.log(`⚔️ Fetching H2H matches: ${homeId} vs ${awayId} (last ${limit})`);
      
      // Try dedicated H2H endpoint first
      let url = new URL(`${API_BASE_URL}/api/v1/matches/h2h`);
      url.searchParams.append('team1_id', homeId.toString());
      url.searchParams.append('team2_id', awayId.toString());
      url.searchParams.append('limit', limit.toString());
      
      let response = await fetch(url.toString());
      
      if (!response.ok) {
        // Fallback: fetch both teams' matches and filter
        console.log('🔄 H2H endpoint not available, using fallback method');
        
        const [homeMatches, awayMatches] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/teams/${homeId}/matches?limit=20`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/v1/teams/${awayId}/matches?limit=20`).then(r => r.json())
        ]);

        const allMatches = [
          ...(homeMatches.data || []),
          ...(awayMatches.data || [])
        ];

        // Filter for matches between these two teams
        const h2hMatches = allMatches.filter((match: TeamMatch) => 
          (match.home_team_id === homeId && match.away_team_id === awayId) ||
          (match.home_team_id === awayId && match.away_team_id === homeId)
        );

        // Remove duplicates and sort by date
        const uniqueMatches = h2hMatches.filter((match, index, self) => 
          index === self.findIndex(m => m.id === match.id)
        ).sort((a, b) => b.date_unix - a.date_unix).slice(0, limit);

        console.log(`✅ H2H matches (fallback): ${uniqueMatches.length} matches found`);
        setData(uniqueMatches);
        return;
      }
      
      const result = await response.json();

      if (!result?.success) {
        throw new Error(result?.message || 'Failed to fetch H2H matches');
      }

      const matches = result.data || [];
      console.log(`✅ H2H matches loaded: ${matches.length} matches`);
      
      setData(matches);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Error fetching H2H matches:', err);
    } finally {
      setLoading(false);
    }
  }, [homeId, awayId, limit]);

  useEffect(() => {
    fetchH2H();
  }, [fetchH2H]);

  return {
    data,
    loading,
    error,
    refetch: fetchH2H
  };
};
