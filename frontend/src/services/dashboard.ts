/**
 * 🎯 DASHBOARD SERVICE - OPTIMIZED DATA FETCHING
 * 
 * ✅ Single API call for all dashboard data
 * ✅ Real-time live matches with scores
 * ✅ Upcoming matches for next 24h
 * ✅ Total match counts for statistics
 * ✅ No mock data or fallbacks
 */

// Using fetch instead of axios for now
import type { MatchData } from '../components/MatchCard';
import { fetchLivescores, fetchTodaysMatches, fetchUpcomingMatches } from './footy/fetchLivescores';
import { normalise } from './footy/normalise';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface DashboardStats {
  totalMatches: number;
  liveMatches: number;
  upcomingMatches: number;
}

export interface DashboardData {
  liveMatches: MatchData[];
  upcomingMatches: MatchData[];
  stats: DashboardStats;
}

// ✅ OPTIMIZED DASHBOARD DATA FETCHER
export async function getDashboardData(): Promise<DashboardData> {
  try {
    console.log('📊 Fetching optimized dashboard data...');

    // Use backend dashboard endpoint that combines all data
    const url = new URL(`${API_BASE_URL}/api/v1/matches/dashboard`);
    url.searchParams.append('timezone', 'America/Sao_Paulo');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result?.success) {
      throw new Error(result?.message || 'Failed to fetch dashboard data');
    }

    const data = result.data;

    // Normalize the data
    const liveMatches = (data.liveMatches || []).map(normalise);
    const upcomingMatches = (data.upcomingMatches || []).map(normalise);

    const stats: DashboardStats = {
      totalMatches: data.stats?.totalMatches || 0,
      liveMatches: data.stats?.liveMatches || liveMatches.length,
      upcomingMatches: data.stats?.upcomingMatches || upcomingMatches.length
    };

    console.log(`✅ Dashboard loaded: ${stats.liveMatches} live, ${stats.upcomingMatches} upcoming, ${stats.totalMatches} total`);

    return {
      liveMatches,
      upcomingMatches,
      stats
    };
  } catch (error) {
    console.error('❌ Error fetching dashboard data:', error);
    throw error;
  }
}

// ✅ ALTERNATIVE IMPLEMENTATION - PARALLEL FETCHING
export async function getDashboardDataParallel(): Promise<DashboardData> {
  try {
    console.log('📊 Fetching dashboard data with parallel requests...');
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // ① Fetch in parallel
    const [liveMatchesRaw, todayMatchesRaw, upcomingMatchesRaw] = await Promise.all([
      fetchLivescores(),
      fetchTodaysMatches(),
      fetchUpcomingMatches()
    ]);

    // ② Normalize all data
    const liveMatches = liveMatchesRaw.map(normalise);
    const todayMatches = todayMatchesRaw.map(normalise);
    const upcomingMatches = upcomingMatchesRaw
      .filter(match => match.status.toLowerCase().includes('not_started') || match.status.toLowerCase().includes('upcoming'))
      .map(normalise);

    // ③ Calculate statistics
    const stats: DashboardStats = {
      totalMatches: todayMatches.length,
      liveMatches: liveMatches.length,
      upcomingMatches: upcomingMatches.length
    };

    console.log(`✅ Parallel dashboard loaded: ${stats.liveMatches} live, ${stats.upcomingMatches} upcoming, ${stats.totalMatches} total`);

    return {
      liveMatches: liveMatches.slice(0, 6), // Limit to 6 for dashboard
      upcomingMatches: upcomingMatches.slice(0, 6), // Limit to 6 for dashboard
      stats
    };
  } catch (error) {
    console.error('❌ Error fetching parallel dashboard data:', error);
    throw error;
  }
}

// ✅ GET LIVE MATCHES WITH REAL-TIME UPDATES
export async function getLiveMatches(limit?: number): Promise<{
  matches: MatchData[];
  totalLive: number;
}> {
  try {
    console.log('🔴 Fetching live matches...');
    
    const liveMatchesRaw = await fetchLivescores();
    const normalizedMatches = liveMatchesRaw.map(normalise);
    
    const totalLive = normalizedMatches.length;
    const matches = limit ? normalizedMatches.slice(0, limit) : normalizedMatches;
    
    console.log(`✅ Live matches: ${matches.length} displayed, ${totalLive} total`);
    
    return {
      matches,
      totalLive
    };
  } catch (error) {
    console.error('❌ Error fetching live matches:', error);
    throw error;
  }
}

// ✅ GET UPCOMING MATCHES FOR NEXT 24H
export async function getUpcomingMatches(limit?: number): Promise<{
  matches: MatchData[];
  totalUpcoming: number;
}> {
  try {
    console.log('⏰ Fetching upcoming matches...');
    
    const upcomingMatchesRaw = await fetchUpcomingMatches();
    const normalizedMatches = upcomingMatchesRaw.map(normalise);
    
    const totalUpcoming = normalizedMatches.length;
    const matches = limit ? normalizedMatches.slice(0, limit) : normalizedMatches;
    
    console.log(`✅ Upcoming matches: ${matches.length} displayed, ${totalUpcoming} total`);
    
    return {
      matches,
      totalUpcoming
    };
  } catch (error) {
    console.error('❌ Error fetching upcoming matches:', error);
    throw error;
  }
}

// ✅ GET TODAY'S TOTAL MATCH COUNT
export async function getTodaysTotalCount(): Promise<number> {
  try {
    console.log('📊 Fetching today\'s total match count...');
    
    const todayMatches = await fetchTodaysMatches();
    const count = todayMatches.length;
    
    console.log(`✅ Today's total matches: ${count}`);
    return count;
  } catch (error) {
    console.error('❌ Error fetching today\'s total count:', error);
    throw error;
  }
}
