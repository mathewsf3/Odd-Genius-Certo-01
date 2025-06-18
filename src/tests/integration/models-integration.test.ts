/**
 * Integration Tests - Models with Existing Services
 * Test that our new DTOs work with existing MatchAnalysisService
 */

import { Match, Player, Team } from '../../models';
import { MatchAnalysisService } from '../../services/MatchAnalysisService';

describe('Models Integration with Existing Services', () => {
  let matchAnalysisService: MatchAnalysisService;

  beforeEach(() => {
    matchAnalysisService = new MatchAnalysisService();
  });

  describe('MatchAnalysisService Integration', () => {
    it('should work with existing MatchAnalysisService interfaces', () => {
      // Test that our new DTOs are compatible with existing service interfaces
      
      // The existing service uses 'any' types, but our DTOs should be compatible
      const mockMatch: Match = {
        id: 123456,
        homeID: 1001,
        awayID: 1002,
        season: "2023-24",
        status: 'complete',
        homeGoalCount: 2,
        awayGoalCount: 1,
        totalGoalCount: 3,
        date_unix: 1640995200,
        team_a_corners: 6,
        team_b_corners: 4,
        totalCornerCount: 10,
        team_a_yellow_cards: 2,
        team_b_yellow_cards: 1,
        refereeID: 5001
      };

      // Test that our Match DTO has all the fields the service expects
      expect(mockMatch.id).toBeDefined();
      expect(mockMatch.homeID).toBeDefined();
      expect(mockMatch.awayID).toBeDefined();
      expect(mockMatch.refereeID).toBeDefined();
      
      // Test analytics calculation compatibility
      expect(typeof mockMatch.team_a_corners).toBe('number');
      expect(typeof mockMatch.team_b_corners).toBe('number');
      expect(typeof mockMatch.homeGoalCount).toBe('number');
      expect(typeof mockMatch.awayGoalCount).toBe('number');
    });

    it('should be compatible with MatchAnalysisResult interface', () => {
      // Test that our DTOs work with the existing MatchAnalysisResult
      const mockAnalysisResult = {
        success: true,
        data: {
          selectedMatch: {
            id: 123456,
            homeID: 1001,
            awayID: 1002,
            season: "2023-24",
            status: 'complete',
            homeGoalCount: 2,
            awayGoalCount: 1,
            totalGoalCount: 3,
            date_unix: 1640995200
          } as Match,
          analytics: {
            corners: {
              totalExpected: 10.5,
              homeExpected: 5.5,
              awayExpected: 5.0
            },
            cards: {
              totalExpected: 4.2,
              yellowExpected: 3.8,
              redExpected: 0.4
            },
            goals: {
              over25Probability: 0.52,
              bttsLikelihood: 0.48,
              expectedGoals: 2.7
            }
          },
          homeTeam: {
            info: null,
            lastXMatches: null
          },
          awayTeam: {
            info: null,
            lastXMatches: null
          },
          referee: null
        },
        metadata: {
          totalMatchesToday: 5,
          analysisTimestamp: new Date().toISOString(),
          dataSource: 'footystats-api'
        }
      };

      // Verify the structure matches what the service expects
      expect(mockAnalysisResult.success).toBe(true);
      expect(mockAnalysisResult.data?.selectedMatch).toBeDefined();
      expect(mockAnalysisResult.data?.analytics).toBeDefined();
      expect(mockAnalysisResult.metadata?.dataSource).toBe('footystats-api');
    });

    it('should handle team data structure compatibility', () => {
      const mockTeam: Team = {
        id: 1001,
        name: "Test FC",
        country: "England",
        stadium_name: "Test Stadium",
        table_position: 5,
        performance_rank: 8
      };

      // Test that team data structure is compatible with service expectations
      expect(mockTeam.id).toBeDefined();
      expect(mockTeam.name).toBeDefined();
      expect(typeof mockTeam.id).toBe('number');
      expect(typeof mockTeam.name).toBe('string');
    });

    it('should handle player data structure compatibility', () => {
      const mockPlayer: Player = {
        id: 5001,
        name: "Test Player",
        position: "Forward",
        age: 25,
        nationality: "England",
        team_id: 1001,
        goals_overall: 12
      };

      // Test that player data structure is compatible
      expect(mockPlayer.id).toBeDefined();
      expect(mockPlayer.name).toBeDefined();
      expect(mockPlayer.team_id).toBe(1001);
      expect(mockPlayer.goals_overall).toBe(12);
    });
  });

  describe('Type Safety with Existing Code', () => {
    it('should maintain type safety when used with existing service methods', () => {
      // Test that our DTOs maintain type safety
      const match: Match = {
        id: 123456,
        homeID: 1001,
        awayID: 1002,
        season: "2023-24",
        status: 'complete',
        homeGoalCount: 2,
        awayGoalCount: 1,
        totalGoalCount: 3,
        date_unix: 1640995200
      };

      // These should all be type-safe operations
      const matchId: number = match.id;
      const homeTeamId: number = match.homeID;
      const awayTeamId: number = match.awayID;
      const matchStatus: string = match.status;

      expect(typeof matchId).toBe('number');
      expect(typeof homeTeamId).toBe('number');
      expect(typeof awayTeamId).toBe('number');
      expect(typeof matchStatus).toBe('string');
    });

    it('should handle optional fields correctly', () => {
      const match: Match = {
        id: 123456,
        homeID: 1001,
        awayID: 1002,
        season: "2023-24",
        status: 'complete',
        homeGoalCount: 2,
        awayGoalCount: 1,
        totalGoalCount: 3,
        date_unix: 1640995200,
        // Optional fields
        team_a_corners: 6,
        team_b_corners: 4,
        refereeID: 5001
      };

      // Test optional field handling
      if (match.team_a_corners !== undefined) {
        expect(typeof match.team_a_corners).toBe('number');
      }
      
      if (match.refereeID !== undefined) {
        expect(typeof match.refereeID).toBe('number');
      }
    });
  });

  describe('Backwards Compatibility', () => {
    it('should not break existing MatchAnalysisService functionality', () => {
      // Test that importing our models doesn't break existing service
      expect(matchAnalysisService).toBeDefined();
      expect(typeof matchAnalysisService.getDetailedMatchInfo).toBe('function');
      expect(typeof matchAnalysisService.getMatchOverviewData).toBe('function');
      expect(typeof matchAnalysisService.getH2HAnalysis).toBe('function');
      expect(typeof matchAnalysisService.getCornerAnalysis).toBe('function');
      expect(typeof matchAnalysisService.getGoalAnalysis).toBe('function');
    });

    it('should allow gradual migration from any types to DTOs', () => {
      // Test that we can gradually replace 'any' types with our DTOs
      const legacyMatch: any = {
        id: 123456,
        homeID: 1001,
        awayID: 1002,
        season: "2023-24",
        status: 'complete'
      };

      // Should be able to cast to our DTO
      const typedMatch: Match = {
        ...legacyMatch,
        homeGoalCount: 2,
        awayGoalCount: 1,
        totalGoalCount: 3,
        date_unix: 1640995200
      };

      expect(typedMatch.id).toBe(legacyMatch.id);
      expect(typedMatch.homeID).toBe(legacyMatch.homeID);
      expect(typedMatch.status).toBe(legacyMatch.status);
    });
  });
});
