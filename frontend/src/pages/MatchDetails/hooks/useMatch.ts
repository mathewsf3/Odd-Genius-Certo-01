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
  console.log('🎯 useMatch: Hook initialized with matchId:', matchId);

  const [data, setData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🎯 useMatch: Current state - data:', !!data, 'loading:', loading, 'error:', error);

  const fetchMatch = useCallback(async () => {
    if (!matchId) {
      console.log('❌ No matchId provided to useMatch hook');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`🎯 useMatch: Starting fetch for match ID: ${matchId}`);
      console.log(`🎯 useMatch: API_BASE_URL: ${API_BASE_URL}`);

      const url = `${API_BASE_URL}/api/v1/matches/${matchId}`;
      console.log(`🎯 useMatch: Full URL: ${url}`);

      // ✅ USE PRE-MATCH ANALYSIS ENDPOINT for prediction data
      const preMatchUrl = `${API_BASE_URL}/api/v1/matches/${matchId}/pre-match`;
      console.log(`🎯 useMatch: Calling PRE-MATCH endpoint: ${preMatchUrl}`);

      const response = await fetch(preMatchUrl);
      console.log(`🎯 useMatch: Response status: ${response.status} ${response.statusText}`);
      console.log(`🎯 useMatch: Response headers:`, response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`🎯 useMatch: HTTP Error ${response.status}: ${response.statusText}`);
        console.error(`🎯 useMatch: Error response body:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('🎯 useMatch: Raw API response:', result);
      console.log('🎯 useMatch: Response type:', typeof result);
      console.log('🎯 useMatch: Response keys:', Object.keys(result || {}));

      if (!result?.success) {
        console.error('🎯 useMatch: API returned success=false:', result);
        throw new Error(result?.message || 'Failed to fetch match details');
      }

      // ✅ PRE-MATCH ANALYSIS: Extract data from new endpoint structure
      console.log('🎯 useMatch: Processing PRE-MATCH analysis response...');
      console.log('🎯 useMatch: result.data:', result.data);
      console.log('🎯 useMatch: result.data?.matchDetails:', result.data?.matchDetails);
      console.log('🎯 useMatch: result.data?.predictions:', result.data?.predictions);
      console.log('🎯 useMatch: result.data?.h2hMatches:', result.data?.h2hMatches);

      const matchData = result.data?.matchDetails || result.data;
      const predictions = result.data?.predictions || {};
      const h2hMatches = result.data?.h2hMatches || [];

      console.log('🎯 useMatch: Extracted matchData:', matchData);
      console.log('🎯 useMatch: Extracted predictions:', predictions);
      console.log('🎯 useMatch: Extracted H2H matches:', h2hMatches.length);

      // Normalize the match data to match our MatchData interface
      console.log('🎯 useMatch: Extracting specific fields...');
      console.log('🎯 useMatch: home_name:', matchData.home_name);
      console.log('🎯 useMatch: away_name:', matchData.away_name);
      console.log('🎯 useMatch: home_image:', matchData.home_image);
      console.log('🎯 useMatch: away_image:', matchData.away_image);
      console.log('🎯 useMatch: status:', matchData.status);
      console.log('🎯 useMatch: date_unix:', matchData.date_unix);

      const normalizedMatch: MatchData & { matchDetails?: any } = {
        id: matchData.id || 0,
        homeID: matchData.homeID || matchData.home_team_id || 0,
        awayID: matchData.awayID || matchData.away_team_id || 0,
        home_name: matchData.home_name || 'Time Casa',
        away_name: matchData.away_name || 'Time Visitante',
        home_image: matchData.home_image ? `/teams/${matchData.home_image}` : '/default-team.svg',
        away_image: matchData.away_image ? `/teams/${matchData.away_image}` : '/default-team.svg',
        homeGoalCount: matchData.homeGoalCount || matchData.home_score || 0,
        awayGoalCount: matchData.awayGoalCount || matchData.away_score || 0,
        status: matchData.status === 'incomplete' ? 'live' : (matchData.status || 'upcoming'),
        date_unix: matchData.date_unix || Date.now() / 1000,
        stadium_name: matchData.stadium_name || 'Estádio não informado',
        stadium_location: matchData.stadium_location || 'Local não informado',
        competition_id: matchData.competition_id || matchData.seasonID || 0,
        competition_name: matchData.competition_name || `Liga ${matchData.competition_id || matchData.seasonID || 'N/A'}`,
        country_name: matchData.country_name || 'País não informado',
        // ✅ PRE-MATCH ANALYSIS: Include predictions and H2H data
        matchDetails: matchData,
        predictions: predictions,
        h2hMatches: h2hMatches,
        // ✅ Add prediction fields directly to match object for easy access
        corners_potential: predictions.corners_potential || matchData.corners_potential || 0,
        over15_potential: predictions.over15_potential || matchData.o15_potential || 0,
        over25_potential: predictions.over25_potential || matchData.o25_potential || 0,
        over35_potential: predictions.over35_potential || matchData.o35_potential || 0,
        over45_potential: predictions.over45_potential || matchData.o45_potential || 0,
        btts_potential: predictions.btts_potential || matchData.btts_potential || 0,
        trends: predictions.trends || matchData.trends || null
      };

      console.log('🎯 useMatch: Normalized match fields:');
      console.log('🎯 useMatch: - home_name:', normalizedMatch.home_name);
      console.log('🎯 useMatch: - away_name:', normalizedMatch.away_name);
      console.log('🎯 useMatch: - status:', normalizedMatch.status);
      console.log('🎯 useMatch: - corners_potential:', normalizedMatch.corners_potential);
      console.log('🎯 useMatch: - over25_potential:', normalizedMatch.over25_potential);
      console.log('🎯 useMatch: - h2hMatches count:', normalizedMatch.h2hMatches.length);

      console.log('🎯 useMatch: Final normalized match data:', normalizedMatch);
      console.log('🎯 useMatch: Setting data state...');

      setData(normalizedMatch);
      console.log('🎯 useMatch: Data state set successfully');
    } catch (err) {
      console.error('❌ useMatch: Error fetching match details:', err);
      console.error('❌ useMatch: Error type:', typeof err);
      console.error('❌ useMatch: Error stack:', err instanceof Error ? err.stack : 'No stack');
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      console.log('🎯 useMatch: Setting loading to false');
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    console.log('🎯 useMatch: useEffect triggered, calling fetchMatch...');
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
