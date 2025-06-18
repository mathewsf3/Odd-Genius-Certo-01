/**
 * 🎯 MatchCard Component Tests
 * 
 * Unit tests for the MatchCard component
 * Tests rendering, interactions, and different match states
 */

import { render, screen, fireEvent } from '@testing-library/react'
import MatchCard from '../MatchCard'
import { Match } from '@/types/api'

// Mock match data
const mockLiveMatch: Match = {
  id: 123456,
  homeID: 1001,
  awayID: 1002,
  home_name: 'Team A',
  away_name: 'Team B',
  home_image: 'team-a.png',
  away_image: 'team-b.png',
  homeGoalCount: 2,
  awayGoalCount: 1,
  status: 'live',
  minute: 75,
  competition_name: 'Premier League',
  country_name: 'England',
  kickoff: '2025-06-18T15:00:00Z',
  date_unix: 1718726400,
}

const mockUpcomingMatch: Match = {
  id: 123457,
  homeID: 1003,
  awayID: 1004,
  home_name: 'Team C',
  away_name: 'Team D',
  home_image: 'team-c.png',
  away_image: 'team-d.png',
  homeGoalCount: 0,
  awayGoalCount: 0,
  status: 'upcoming',
  competition_name: 'La Liga',
  country_name: 'Spain',
  kickoff: '2025-06-18T20:00:00Z',
  date_unix: 1718744400,
}

const mockFinishedMatch: Match = {
  id: 123458,
  homeID: 1005,
  awayID: 1006,
  home_name: 'Team E',
  away_name: 'Team F',
  home_image: 'team-e.png',
  away_image: 'team-f.png',
  homeGoalCount: 3,
  awayGoalCount: 2,
  status: 'finished',
  competition_name: 'Serie A',
  country_name: 'Italy',
  kickoff: '2025-06-17T18:00:00Z',
  date_unix: 1718650800,
}

describe('MatchCard', () => {
  describe('Live Match', () => {
    it('renders live match correctly', () => {
      render(<MatchCard match={mockLiveMatch} />)
      
      expect(screen.getByText('Team A')).toBeInTheDocument()
      expect(screen.getByText('Team B')).toBeInTheDocument()
      expect(screen.getByText('2 x 1')).toBeInTheDocument()
      expect(screen.getByText("75'")).toBeInTheDocument()
      expect(screen.getByText('Premier League • England')).toBeInTheDocument()
    })

    it('shows live status styling', () => {
      render(<MatchCard match={mockLiveMatch} />)
      
      const statusElement = screen.getByText("75'")
      expect(statusElement.closest('div')).toHaveClass('bg-red-100', 'text-red-800')
    })

    it('displays score in red for live matches', () => {
      render(<MatchCard match={mockLiveMatch} />)
      
      const scoreElement = screen.getByText('2 x 1')
      expect(scoreElement).toHaveClass('text-red-600')
    })
  })

  describe('Upcoming Match', () => {
    it('renders upcoming match correctly', () => {
      render(<MatchCard match={mockUpcomingMatch} />)
      
      expect(screen.getByText('Team C')).toBeInTheDocument()
      expect(screen.getByText('Team D')).toBeInTheDocument()
      expect(screen.getByText('vs')).toBeInTheDocument()
      expect(screen.getByText('La Liga • Spain')).toBeInTheDocument()
    })

    it('shows upcoming status styling', () => {
      render(<MatchCard match={mockUpcomingMatch} />)
      
      // Should show upcoming status
      const statusElements = screen.getAllByText(/18\/06/)
      expect(statusElements.length).toBeGreaterThan(0)
    })

    it('does not show minute for upcoming matches', () => {
      render(<MatchCard match={mockUpcomingMatch} />)
      
      expect(screen.queryByText("75'")).not.toBeInTheDocument()
    })
  })

  describe('Finished Match', () => {
    it('renders finished match correctly', () => {
      render(<MatchCard match={mockFinishedMatch} />)
      
      expect(screen.getByText('Team E')).toBeInTheDocument()
      expect(screen.getByText('Team F')).toBeInTheDocument()
      expect(screen.getByText('3 x 2')).toBeInTheDocument()
      expect(screen.getByText('Serie A • Italy')).toBeInTheDocument()
    })

    it('shows final score for finished matches', () => {
      render(<MatchCard match={mockFinishedMatch} />)
      
      const scoreElement = screen.getByText('3 x 2')
      expect(scoreElement).toHaveClass('text-gray-700')
    })
  })

  describe('Analysis Button', () => {
    it('shows analysis button by default', () => {
      render(<MatchCard match={mockLiveMatch} />)
      
      expect(screen.getByText('📊 Análise da Partida')).toBeInTheDocument()
    })

    it('hides analysis button when showAnalysisButton is false', () => {
      render(<MatchCard match={mockLiveMatch} showAnalysisButton={false} />)
      
      expect(screen.queryByText('📊 Análise da Partida')).not.toBeInTheDocument()
    })

    it('calls onAnalyzeMatch when analysis button is clicked', () => {
      const mockOnAnalyze = jest.fn()
      render(<MatchCard match={mockLiveMatch} onAnalyzeMatch={mockOnAnalyze} />)
      
      const analysisButton = screen.getByText('📊 Análise da Partida')
      fireEvent.click(analysisButton)
      
      expect(mockOnAnalyze).toHaveBeenCalledWith(123456)
    })
  })

  describe('Team Logos', () => {
    it('shows team initials when no logo is provided', () => {
      const matchWithoutLogos = {
        ...mockLiveMatch,
        home_image: '',
        away_image: '',
      }
      
      render(<MatchCard match={matchWithoutLogos} />)
      
      expect(screen.getByText('T')).toBeInTheDocument() // Team A initial
      expect(screen.getAllByText('T')).toHaveLength(2) // Team A and Team B initials
    })
  })

  describe('Accessibility', () => {
    it('has proper alt text for team logos', () => {
      render(<MatchCard match={mockLiveMatch} />)
      
      const homeTeamLogo = screen.getByAltText('Team A logo')
      const awayTeamLogo = screen.getByAltText('Team B logo')
      
      expect(homeTeamLogo).toBeInTheDocument()
      expect(awayTeamLogo).toBeInTheDocument()
    })

    it('has proper button accessibility', () => {
      const mockOnAnalyze = jest.fn()
      render(<MatchCard match={mockLiveMatch} onAnalyzeMatch={mockOnAnalyze} />)
      
      const analysisButton = screen.getByRole('button', { name: /análise da partida/i })
      expect(analysisButton).toBeInTheDocument()
    })
  })
})
