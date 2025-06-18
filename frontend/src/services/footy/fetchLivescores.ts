/**
 * 🎯 LIVESCORES SERVICE - REAL-TIME MATCH DATA
 * 
 * ✅ Uses FootyStats /livescores endpoint
 * ✅ Handles pagination automatically
 * ✅ Returns real-time scores and status
 * ✅ No mock data or fallbacks
 */

// Using fetch instead of axios for now

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface LivescoreMatch {
  id: number;
  homeID: number;
  awayID: number;
  home_name: string;
  away_name: string;
  home_image: string;
  away_image: string;
  homeGoalCount?: number;
  awayGoalCount?: number;
  score_home?: number;
  score_away?: number;
  home_score?: number;
  away_score?: number;
  status: string;
  date_unix: number;
  stadium_name?: string;
  stadium_location?: string;
  competition_id?: number;
  competition_name?: string;
  country_name?: string;
}

export async function fetchLivescores(): Promise<LivescoreMatch[]> {
  try {
    console.log('🔴 Fetching livescores from backend...');

    // Use correct backend endpoint for live matches
    const url = new URL(`${API_BASE_URL}/api/v1/matches/live`);
    url.searchParams.append('timezone', 'America/Sao_Paulo');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result?.success) {
      throw new Error(result?.message || 'Failed to fetch livescores');
    }

    // Extract matches from the nested data structure
    const matches = result.data?.liveMatches || result.data || [];
    console.log(`✅ Fetched ${matches.length} live matches`);

    return matches;
  } catch (error) {
    console.error('❌ Error fetching livescores:', error);
    throw error;
  }
}

export async function fetchTodaysMatches(date?: string): Promise<LivescoreMatch[]> {
  try {
    console.log('📅 Fetching today\'s matches from backend...');

    const url = new URL(`${API_BASE_URL}/api/v1/matches/today`);
    url.searchParams.append('date', date || new Date().toISOString().split('T')[0]);
    url.searchParams.append('timezone', 'America/Sao_Paulo');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result?.success) {
      throw new Error(result?.message || 'Failed to fetch today\'s matches');
    }

    const matches = result.data || [];
    console.log(`✅ Fetched ${matches.length} matches for today`);

    return matches;
  } catch (error) {
    console.error('❌ Error fetching today\'s matches:', error);
    throw error;
  }
}

export async function fetchUpcomingMatches(): Promise<LivescoreMatch[]> {
  try {
    console.log('⏰ Fetching upcoming matches from backend...');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const url = new URL(`${API_BASE_URL}/api/v1/matches/upcoming`);
    url.searchParams.append('date', tomorrowStr);
    url.searchParams.append('timezone', 'America/Sao_Paulo');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result?.success) {
      throw new Error(result?.message || 'Failed to fetch upcoming matches');
    }

    const matches = result.data || [];
    console.log(`✅ Fetched ${matches.length} upcoming matches`);

    return matches;
  } catch (error) {
    console.error('❌ Error fetching upcoming matches:', error);
    throw error;
  }
}
