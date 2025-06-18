/**
 * 🎯 API Service Tests
 * 
 * Unit tests for the API service layer
 * Tests data fetching, error handling, and utility functions
 */

import { 
  getDashboardData, 
  getLiveMatches, 
  getUpcomingMatches,
  isMatchLive,
  isMatchUpcoming,
  formatMatchTime,
  getMatchStatusText,
  handleApiError
} from '../api'
import { Match } from '@/types/api'

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

// Mock match data
const mockLiveMatch: Match = {
  id: 123456,
  homeID: 1001,
  awayID: 1002,
  home_name: 'Team A',
  away_name: 'Team B',
  homeGoalCount: 2,
  awayGoalCount: 1,
  status: 'live',
  minute: 75,
  competition_name: 'Premier League',
  kickoff: '2025-06-18T15:00:00Z',
  date_unix: 1718726400,
}

const mockUpcomingMatch: Match = {
  id: 123457,
  homeID: 1003,
  awayID: 1004,
  home_name: 'Team C',
  away_name: 'Team D',
  homeGoalCount: 0,
  awayGoalCount: 0,
  status: 'upcoming',
  competition_name: 'La Liga',
  kickoff: '2025-06-18T20:00:00Z',
  date_unix: 1718744400,
}

describe('API Service', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getDashboardData', () => {
    it('fetches dashboard data successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          liveMatches: [mockLiveMatch],
          upcomingMatches: [mockUpcomingMatch],
          totalLive: 1,
          totalUpcoming: 1,
          lastUpdated: '2025-06-18T15:00:00Z',
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getDashboardData({ timezone: 'America/Sao_Paulo' })

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/matches/dashboard?timezone=America%2FSao_Paulo')
      expect(result).toEqual(mockResponse.data)
    })

    it('handles API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response)

      await expect(getDashboardData()).rejects.toThrow()
    })
  })

  describe('getLiveMatches', () => {
    it('fetches live matches with limit', async () => {
      const mockResponse = {
        success: true,
        data: {
          liveMatches: [mockLiveMatch],
          totalLive: 1,
          lastUpdated: '2025-06-18T15:00:00Z',
          isLimited: true,
          limit: 5,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getLiveMatches(5, true)

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/matches/live?limit=5&forceRefresh=true')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getUpcomingMatches', () => {
    it('fetches upcoming matches with parameters', async () => {
      const mockResponse = {
        success: true,
        data: {
          upcomingMatches: [mockUpcomingMatch],
          totalUpcoming: 1,
          isLimited: false,
          limit: null,
          hours: 48,
          timezone: 'America/Sao_Paulo',
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getUpcomingMatches(10, 48, 'America/Sao_Paulo')

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/matches/upcoming?hours=48&timezone=America%2FSao_Paulo&limit=10')
      expect(result).toEqual(mockResponse.data)
    })
  })
})

describe('Utility Functions', () => {
  describe('isMatchLive', () => {
    it('returns true for live matches', () => {
      expect(isMatchLive(mockLiveMatch)).toBe(true)
    })

    it('returns false for non-live matches', () => {
      expect(isMatchLive(mockUpcomingMatch)).toBe(false)
    })
  })

  describe('isMatchUpcoming', () => {
    it('returns true for upcoming matches', () => {
      expect(isMatchUpcoming(mockUpcomingMatch)).toBe(true)
    })

    it('returns false for non-upcoming matches', () => {
      expect(isMatchUpcoming(mockLiveMatch)).toBe(false)
    })
  })

  describe('formatMatchTime', () => {
    it('formats match time correctly', () => {
      const result = formatMatchTime(mockUpcomingMatch)
      expect(result).toMatch(/\d{2}\/\d{2}/)
    })

    it('handles invalid dates gracefully', () => {
      const invalidMatch = { ...mockUpcomingMatch, kickoff: 'invalid-date' }
      const result = formatMatchTime(invalidMatch)
      expect(result).toBe('Horário inválido')
    })
  })

  describe('getMatchStatusText', () => {
    it('returns correct status for live matches', () => {
      expect(getMatchStatusText(mockLiveMatch)).toBe("75'")
    })

    it('returns correct status for upcoming matches', () => {
      const result = getMatchStatusText(mockUpcomingMatch)
      expect(result).toMatch(/\d{2}\/\d{2}/)
    })

    it('returns correct status for finished matches', () => {
      const finishedMatch = { ...mockLiveMatch, status: 'finished' as const }
      expect(getMatchStatusText(finishedMatch)).toBe('ENCERRADO')
    })

    it('returns default status for unknown status', () => {
      const unknownMatch = { ...mockLiveMatch, status: 'unknown' as any }
      expect(getMatchStatusText(unknownMatch)).toBe('DESCONHECIDO')
    })
  })

  describe('handleApiError', () => {
    it('handles network errors', () => {
      const networkError = new Error('Network error')
      networkError.name = 'NetworkError'
      
      const result = handleApiError(networkError)
      expect(result).toBe('Erro de conexão. Verifique sua internet e tente novamente.')
    })

    it('handles validation errors', () => {
      const validationError = new Error('Validation failed')
      validationError.name = 'ValidationError'
      
      const result = handleApiError(validationError)
      expect(result).toBe('Dados inválidos fornecidos.')
    })

    it('handles generic errors', () => {
      const genericError = new Error('Something went wrong')
      
      const result = handleApiError(genericError)
      expect(result).toBe('Something went wrong')
    })

    it('handles unknown errors', () => {
      const result = handleApiError('Unknown error')
      expect(result).toBe('Erro desconhecido ocorreu.')
    })
  })
})
