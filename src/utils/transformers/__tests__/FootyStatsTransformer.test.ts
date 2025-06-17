/**
 * Test suite for FootyStats Transformer
 * Validates transformation logic aligns with footy.yaml specification
 */

import type { ApiResponse } from '../../../apis/footy/models/ApiResponse';
import type { League } from '../../../apis/footy/models/League';
import { Match } from '../../../apis/footy/models/Match';
import type { Player } from '../../../apis/footy/models/Player';
import type { Team } from '../../../apis/footy/models/Team';
import { DEFAULT_VALUES } from '../../constants/footballConstants';
import { FootyStatsTransformer, StandardizedResponse } from '../FootyStatsTransformer';

describe('FootyStatsTransformer', () => {
  describe('transformResponse', () => {
    test('should transform basic ApiResponse', () => {
      const mockApiResponse: ApiResponse = {
        success: true,
        data: [{ id: 1, name: 'Test League' }]
      };

      const result = FootyStatsTransformer.transformResponse(
        mockApiResponse,
        Date.now() - 100,
        '/league-list'
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual([{ id: 1, name: 'Test League' }]);
      expect(result.metadata.source).toBe('footystats');
      expect(result.metadata.endpoint).toBe('/league-list');
      expect(result.metadata.processingTime).toBeGreaterThan(0);
      expect(result.metadata.timestamp).toBeDefined();
    });

    test('should handle PaginatedResponse with pager', () => {
      const mockPaginatedResponse = {
        success: true,
        data: [{ id: 1 }, { id: 2 }],
        pager: {
          current_page: 1,
          max_page: 5,
          total_results: 100,
          results_per_page: 20
        }
      };

      const result = FootyStatsTransformer.transformResponse(mockPaginatedResponse);

      expect(result.pagination).toBeDefined();
      expect(result.pagination?.currentPage).toBe(1);
      expect(result.pagination?.totalPages).toBe(5);
      expect(result.pagination?.totalResults).toBe(100);
      expect(result.pagination?.resultsPerPage).toBe(20);
    });

    test('should handle failed response', () => {
      const mockFailedResponse: ApiResponse = {
        success: false,
        data: []
      };

      const result = FootyStatsTransformer.transformResponse(mockFailedResponse);

      expect(result.success).toBe(false);
      expect(result.metadata.source).toBe('footystats');
    });
  });

  describe('transformMatchData', () => {
    const mockMatch: Match = {
      id: 123,
      homeID: 1,
      awayID: 2,
      season: '2024-25',
      status: Match.status.COMPLETE,
      homeGoalCount: 2,
      awayGoalCount: 1,
      totalGoalCount: 3,
      team_a_possession: 60,
      team_b_possession: 40,
      team_a_shots: 15,
      team_b_shots: 8,
      team_a_shotsOnTarget: 6,
      team_b_shotsOnTarget: 3,
      team_a_shotsOffTarget: 9,
      team_b_shotsOffTarget: 5,
      team_a_yellow_cards: 2,
      team_a_red_cards: 0,
      team_b_yellow_cards: 1,
      team_b_red_cards: 1,
      team_a_corners: 5,
      team_b_corners: 3,
      totalCornerCount: 8,
      team_a_fouls: 12,
      team_b_fouls: 15,
      team_a_offsides: 2,
      team_b_offsides: 4,
      btts: true,
      over05: true,
      over15: true,
      over25: true,
      over35: false,
      over45: false,
      over55: false
    };

    test('should enhance match with complete analytics', () => {
      const enhanced = FootyStatsTransformer.transformMatchData(mockMatch);

      expect(enhanced.analytics).toBeDefined();
      expect(enhanced.analytics.bothTeamsToScore).toBe(true);
      expect(enhanced.analytics.totalGoals).toBe(3);
      expect(enhanced.analytics.goalThresholds.over25).toBe(true);
      expect(enhanced.analytics.goalThresholds.over35).toBe(false);
    });

    test('should calculate possession percentages', () => {
      const enhanced = FootyStatsTransformer.transformMatchData(mockMatch);

      expect(enhanced.analytics.possession.home).toBe(60);
      expect(enhanced.analytics.possession.away).toBe(40);
      expect(enhanced.analytics.possession.homePercentage).toBe(60);
      expect(enhanced.analytics.possession.awayPercentage).toBe(40);
    });

    test('should calculate shot accuracy', () => {
      const enhanced = FootyStatsTransformer.transformMatchData(mockMatch);

      expect(enhanced.analytics.shots.home.accuracy).toBe(40); // 6/15 * 100
      expect(enhanced.analytics.shots.away.accuracy).toBe(38); // 3/8 * 100 rounded
    });

    test('should handle missing shot data', () => {
      const matchWithoutShots: Match = {
        ...mockMatch,
        team_a_shots: DEFAULT_VALUES.SHOTS_DEFAULT,
        team_b_shots: DEFAULT_VALUES.SHOTS_DEFAULT,
        team_a_shotsOnTarget: DEFAULT_VALUES.STATS_DEFAULT,
        team_b_shotsOnTarget: DEFAULT_VALUES.STATS_DEFAULT
      };

      const enhanced = FootyStatsTransformer.transformMatchData(matchWithoutShots);

      expect(enhanced.analytics.shots.home.accuracy).toBeUndefined();
      expect(enhanced.analytics.shots.away.accuracy).toBeUndefined();
    });

    test('should calculate card statistics', () => {
      const enhanced = FootyStatsTransformer.transformMatchData(mockMatch);

      expect(enhanced.analytics.cards.home.yellow).toBe(2);
      expect(enhanced.analytics.cards.home.red).toBe(0);
      expect(enhanced.analytics.cards.home.total).toBe(2);
      expect(enhanced.analytics.cards.away.yellow).toBe(1);
      expect(enhanced.analytics.cards.away.red).toBe(1);
      expect(enhanced.analytics.cards.away.total).toBe(2);
      expect(enhanced.analytics.cards.totalMatch).toBe(4);
    });

    test('should handle missing possession data', () => {
      const matchWithoutPossession: Match = {
        ...mockMatch,
        team_a_possession: DEFAULT_VALUES.STATS_DEFAULT,
        team_b_possession: DEFAULT_VALUES.STATS_DEFAULT
      };

      const enhanced = FootyStatsTransformer.transformMatchData(matchWithoutPossession);

      expect(enhanced.analytics.possession.homePercentage).toBeUndefined();
      expect(enhanced.analytics.possession.awayPercentage).toBeUndefined();
    });
  });

  describe('transformTeamData', () => {
    const mockTeam: Team = {
      id: 1,
      name: 'Arsenal FC',
      table_position: 4,
      risk: 3,
      image: 'https://example.com/arsenal.png',
      stadium_name: 'Emirates Stadium'
    };

    test('should enhance team with additional stats', () => {
      const enhanced = FootyStatsTransformer.transformTeamData(mockTeam);

      expect(enhanced.additionalStats).toBeDefined();
      expect(enhanced.additionalStats.hasImage).toBe(true);
      expect(enhanced.additionalStats.hasStadium).toBe(true);
      expect(enhanced.additionalStats.hasPosition).toBe(true);
      expect(enhanced.additionalStats.riskLevel).toBe('Medium');
    });

    test('should handle missing optional fields', () => {
      const teamWithoutOptionals: Team = {
        id: 2,
        name: 'Test FC'
      };

      const enhanced = FootyStatsTransformer.transformTeamData(teamWithoutOptionals);

      expect(enhanced.additionalStats.hasImage).toBe(false);
      expect(enhanced.additionalStats.hasStadium).toBe(false);
      expect(enhanced.additionalStats.hasPosition).toBe(false);
      expect(enhanced.additionalStats.riskLevel).toBe('Low');
    });
  });

  describe('transformPlayerData', () => {
    const mockPlayer: Player = {
      id: 1,
      name: 'Bukayo Saka',
      age: 22,
      goals_overall: 15
    };

    test('should enhance player with additional stats', () => {
      const enhanced = FootyStatsTransformer.transformPlayerData(mockPlayer);

      expect(enhanced.additionalStats).toBeDefined();
      expect(enhanced.additionalStats.isYoung).toBe(true);
      expect(enhanced.additionalStats.isVeteran).toBe(false);
      expect(enhanced.additionalStats.hasGoals).toBe(true);
      expect(enhanced.additionalStats.goalsPerGame).toBeGreaterThan(0);
    });

    test('should classify veteran player correctly', () => {
      const veteranPlayer: Player = {
        id: 2,
        name: 'Veteran Player',
        age: 35,
        goals_overall: 200
      };

      const enhanced = FootyStatsTransformer.transformPlayerData(veteranPlayer);

      expect(enhanced.additionalStats.isYoung).toBe(false);
      expect(enhanced.additionalStats.isVeteran).toBe(true);
    });
  });

  describe('transformLeagueData', () => {
    test('should enhance league with metadata', () => {
      const mockLeague: League = {
        name: 'Premier League',
        season: [
          { id: 1, year: 2023 },
          { id: 2, year: 2024 }
        ]
      };

      const enhanced = FootyStatsTransformer.transformLeagueData(mockLeague);

      expect(enhanced.metadata).toBeDefined();
      expect(enhanced.metadata.hasSeasons).toBe(true);
      expect(enhanced.metadata.seasonCount).toBe(2);
    });

    test('should handle league without seasons', () => {
      const leagueWithoutSeasons: League = {
        name: 'Test League',
        season: []
      };

      const enhanced = FootyStatsTransformer.transformLeagueData(leagueWithoutSeasons);

      expect(enhanced.metadata.hasSeasons).toBe(false);
      expect(enhanced.metadata.seasonCount).toBe(0);
    });
  });

  describe('transformMatchArray', () => {
    test('should transform array of matches', () => {
      const matches: Match[] = [
        {
          id: 1,
          homeID: 1,
          awayID: 2,
          season: '2024',
          status: Match.status.COMPLETE,
          homeGoalCount: 1,
          awayGoalCount: 0,
          totalGoalCount: 1,
          btts: false,
          over25: false
        },
        {
          id: 2,
          homeID: 3,
          awayID: 4,
          season: '2024',
          status: Match.status.COMPLETE,
          homeGoalCount: 3,
          awayGoalCount: 2,
          totalGoalCount: 5,
          btts: true,
          over25: true
        }
      ];

      const enhanced = FootyStatsTransformer.transformMatchArray(matches);

      expect(enhanced).toHaveLength(2);
      expect(enhanced[0].analytics.bothTeamsToScore).toBe(false);
      expect(enhanced[1].analytics.bothTeamsToScore).toBe(true);
      expect(enhanced[0].analytics.totalGoals).toBe(1);
      expect(enhanced[1].analytics.totalGoals).toBe(5);
    });
  });

  describe('validateTransformedData', () => {
    test('should validate correct transformed data', () => {
      const original = { success: true, data: [1, 2, 3] };
      const transformed: StandardizedResponse<number[]> = {
        success: true,
        data: [1, 2, 3],
        metadata: {
          source: 'footystats',
          timestamp: new Date().toISOString()
        }
      };

      const isValid = FootyStatsTransformer.validateTransformedData(original, transformed);
      expect(isValid).toBe(true);
    });

    test('should detect invalid transformed data', () => {
      const original = { success: true, data: [1, 2, 3] };
      const invalidTransformed = {
        success: false,
        data: null,
        metadata: {}
      } as any;

      const isValid = FootyStatsTransformer.validateTransformedData(original, invalidTransformed);
      expect(isValid).toBe(false);
    });

    test('should detect array length mismatch', () => {
      const original = { success: true, data: [1, 2, 3] };
      const transformed: StandardizedResponse<number[]> = {
        success: true,
        data: [1, 2], // Different length
        metadata: {
          source: 'footystats',
          timestamp: new Date().toISOString()
        }
      };

      const isValid = FootyStatsTransformer.validateTransformedData(original, transformed);
      expect(isValid).toBe(false);
    });
  });
});
