/**
 * 🎯 DASHBOARD DATA HOOK - OPTIMIZED REAL-TIME DATA
 *
 * ✅ Single API call for all dashboard data
 * ✅ Real-time live matches with proper scores
 * ✅ Upcoming matches for next 24h
 * ✅ Total match counts for statistics
 * ✅ 30-second polling for live updates
 * ✅ No mock data or fallbacks
 */

import { useCallback, useEffect, useState } from 'react';
import type { MatchData } from '../components/MatchCard';
import { getDashboardData } from '../services/dashboard';

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

export interface UseDashboardDataReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: Date | null;
}

// ✅ MAIN DASHBOARD HOOK WITH OPTIMIZED DATA FETCHING
export const useDashboardData = (): UseDashboardDataReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      console.log('📊 Fetching optimized dashboard data...');

      const dashboardData = await getDashboardData();

      console.log(`✅ Dashboard data loaded:`, {
        liveMatches: dashboardData.liveMatches.length,
        upcomingMatches: dashboardData.upcomingMatches.length,
        stats: dashboardData.stats
      });

      setData(dashboardData);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    lastUpdated
  };
};

// ✅ LIGHTWEIGHT HOOK FOR DASHBOARD STATS ONLY
export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({ totalMatches: 0, liveMatches: 0, upcomingMatches: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      console.log('📊 Fetching dashboard stats only...');

      const dashboardData = await getDashboardData();
      setStats(dashboardData.stats);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Set up polling every 1 minute for stats
    const interval = setInterval(fetchStats, 60_000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
    lastUpdated
  };
};
