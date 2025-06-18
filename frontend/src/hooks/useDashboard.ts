/**
 * 🎯 Dashboard Hook - React Hook for Dashboard Data
 * 
 * Provides dashboard data with automatic refresh and error handling
 * Follows React Query patterns for optimal data fetching
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDashboardData, handleApiError } from '@/services/api';
import { DashboardData, DashboardParams } from '@/types/api';

interface UseDashboardOptions {
  refreshInterval?: number; // in milliseconds
  timezone?: string;
  limit?: number;
  autoRefresh?: boolean;
}

interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useDashboard(options: UseDashboardOptions = {}): UseDashboardReturn {
  const {
    refreshInterval = 30000, // 30 seconds default
    timezone = 'America/Sao_Paulo',
    limit,
    autoRefresh = true,
  } = options;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setError(null);
      
      const params: DashboardParams = {
        timezone,
        ...(limit && { limit }),
      };
      
      console.log('🎯 Fetching dashboard data...', params);
      
      const dashboardData = await getDashboardData(params);
      
      setData(dashboardData);
      setLastUpdated(new Date());
      
      console.log('✅ Dashboard data updated:', {
        totalLive: dashboardData.totalLive,
        totalUpcoming: dashboardData.totalUpcoming,
        lastUpdated: dashboardData.lastUpdated,
      });
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('❌ Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [timezone, limit]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchDashboard();
  }, [fetchDashboard]);

  // Initial fetch
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) {
      return;
    }

    console.log(`🔄 Setting up auto-refresh every ${refreshInterval}ms`);
    
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard data...');
      fetchDashboard();
    }, refreshInterval);

    return () => {
      console.log('🛑 Clearing auto-refresh interval');
      clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, fetchDashboard]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Dashboard hook cleanup');
    };
  }, []);

  return {
    data,
    loading,
    error,
    refresh,
    lastUpdated,
  };
}

// ===== SPECIALIZED HOOKS =====

/**
 * Hook specifically for live matches with faster refresh
 */
export function useLiveMatches() {
  return useDashboard({
    refreshInterval: 15000, // 15 seconds for live data
    autoRefresh: true,
  });
}

/**
 * Hook for upcoming matches with slower refresh
 */
export function useUpcomingMatches() {
  return useDashboard({
    refreshInterval: 300000, // 5 minutes for upcoming matches
    autoRefresh: true,
  });
}

/**
 * Hook for dashboard overview with balanced refresh
 */
export function useDashboardOverview(limit: number = 6) {
  return useDashboard({
    refreshInterval: 30000, // 30 seconds
    limit,
    autoRefresh: true,
  });
}
