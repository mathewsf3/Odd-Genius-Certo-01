/**
 * 🎯 useDashboard Hook Tests
 * 
 * Unit tests for the useDashboard React hook
 * Tests data fetching, auto-refresh, and error handling
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useDashboard, useDashboardOverview } from '../useDashboard'
import * as apiService from '@/services/api'

// Mock the API service
jest.mock('@/services/api')
const mockGetDashboardData = apiService.getDashboardData as jest.MockedFunction<typeof apiService.getDashboardData>
const mockHandleApiError = apiService.handleApiError as jest.MockedFunction<typeof apiService.handleApiError>

// Mock dashboard data
const mockDashboardData = {
  liveMatches: [
    {
      id: 123456,
      homeID: 1001,
      awayID: 1002,
      home_name: 'Team A',
      away_name: 'Team B',
      homeGoalCount: 2,
      awayGoalCount: 1,
      status: 'live' as const,
      minute: 75,
      competition_name: 'Premier League',
      kickoff: '2025-06-18T15:00:00Z',
      date_unix: 1718726400,
    }
  ],
  upcomingMatches: [
    {
      id: 123457,
      homeID: 1003,
      awayID: 1004,
      home_name: 'Team C',
      away_name: 'Team D',
      homeGoalCount: 0,
      awayGoalCount: 0,
      status: 'upcoming' as const,
      competition_name: 'La Liga',
      kickoff: '2025-06-18T20:00:00Z',
      date_unix: 1718744400,
    }
  ],
  totalLive: 1,
  totalUpcoming: 1,
  lastUpdated: '2025-06-18T15:00:00Z',
}

describe('useDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Initial Data Fetching', () => {
    it('fetches dashboard data on mount', async () => {
      mockGetDashboardData.mockResolvedValueOnce(mockDashboardData)

      const { result } = renderHook(() => useDashboard())

      expect(result.current.loading).toBe(true)
      expect(result.current.data).toBe(null)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.data).toEqual(mockDashboardData)
      expect(result.current.error).toBe(null)
      expect(mockGetDashboardData).toHaveBeenCalledWith({
        timezone: 'America/Sao_Paulo',
      })
    })

    it('handles API errors during initial fetch', async () => {
      const errorMessage = 'API Error'
      mockGetDashboardData.mockRejectedValueOnce(new Error('Network error'))
      mockHandleApiError.mockReturnValueOnce(errorMessage)

      const { result } = renderHook(() => useDashboard())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.data).toBe(null)
      expect(result.current.error).toBe(errorMessage)
      expect(mockHandleApiError).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe('Auto Refresh', () => {
    it('auto-refreshes data at specified intervals', async () => {
      mockGetDashboardData.mockResolvedValue(mockDashboardData)

      const { result } = renderHook(() => useDashboard({
        refreshInterval: 1000,
        autoRefresh: true,
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(mockGetDashboardData).toHaveBeenCalledTimes(1)

      // Fast-forward time to trigger auto-refresh
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(mockGetDashboardData).toHaveBeenCalledTimes(2)
      })
    })

    it('does not auto-refresh when disabled', async () => {
      mockGetDashboardData.mockResolvedValue(mockDashboardData)

      const { result } = renderHook(() => useDashboard({
        refreshInterval: 1000,
        autoRefresh: false,
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(mockGetDashboardData).toHaveBeenCalledTimes(1)

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      // Should not have called again
      expect(mockGetDashboardData).toHaveBeenCalledTimes(1)
    })
  })

  describe('Manual Refresh', () => {
    it('allows manual refresh of data', async () => {
      mockGetDashboardData.mockResolvedValue(mockDashboardData)

      const { result } = renderHook(() => useDashboard({
        autoRefresh: false,
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(mockGetDashboardData).toHaveBeenCalledTimes(1)

      // Trigger manual refresh
      await act(async () => {
        await result.current.refresh()
      })

      expect(mockGetDashboardData).toHaveBeenCalledTimes(2)
      expect(result.current.loading).toBe(false)
    })

    it('sets loading state during manual refresh', async () => {
      mockGetDashboardData.mockResolvedValue(mockDashboardData)

      const { result } = renderHook(() => useDashboard({
        autoRefresh: false,
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Start manual refresh
      act(() => {
        result.current.refresh()
      })

      expect(result.current.loading).toBe(true)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })
  })

  describe('Configuration Options', () => {
    it('uses custom timezone', async () => {
      mockGetDashboardData.mockResolvedValueOnce(mockDashboardData)

      renderHook(() => useDashboard({
        timezone: 'Europe/London',
      }))

      await waitFor(() => {
        expect(mockGetDashboardData).toHaveBeenCalledWith({
          timezone: 'Europe/London',
        })
      })
    })

    it('uses custom limit', async () => {
      mockGetDashboardData.mockResolvedValueOnce(mockDashboardData)

      renderHook(() => useDashboard({
        limit: 10,
      }))

      await waitFor(() => {
        expect(mockGetDashboardData).toHaveBeenCalledWith({
          timezone: 'America/Sao_Paulo',
          limit: 10,
        })
      })
    })
  })

  describe('Specialized Hooks', () => {
    it('useDashboardOverview uses correct configuration', async () => {
      mockGetDashboardData.mockResolvedValueOnce(mockDashboardData)

      renderHook(() => useDashboardOverview(6))

      await waitFor(() => {
        expect(mockGetDashboardData).toHaveBeenCalledWith({
          timezone: 'America/Sao_Paulo',
          limit: 6,
        })
      })
    })
  })

  describe('Cleanup', () => {
    it('clears intervals on unmount', async () => {
      mockGetDashboardData.mockResolvedValue(mockDashboardData)

      const { unmount } = renderHook(() => useDashboard({
        refreshInterval: 1000,
        autoRefresh: true,
      }))

      await waitFor(() => {
        expect(mockGetDashboardData).toHaveBeenCalledTimes(1)
      })

      // Unmount the hook
      unmount()

      // Fast-forward time - should not trigger more calls
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      expect(mockGetDashboardData).toHaveBeenCalledTimes(1)
    })
  })
})
