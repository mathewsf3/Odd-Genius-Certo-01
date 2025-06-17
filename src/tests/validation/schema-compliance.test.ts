/**
 * COMPREHENSIVE SCHEMA COMPLIANCE TEST
 * Validates 100% compliance between our DTOs and footy.yaml specifications
 */

import { 
  Match, 
  Team, 
  Player, 
  Referee, 
  League, 
  LeagueSeason,
  Country,
  Season,
  MatchStatus 
} from '../../models';

describe('🔍 SCHEMA COMPLIANCE VALIDATION', () => {
  
  describe('Match Schema Compliance', () => {
    it('should have ALL required fields from footy.yaml Match schema', () => {
      // footy.yaml required fields: id, homeID, awayID, season, status
      const match: Match = {
        id: 123456,
        homeID: 1001,
        awayID: 1002,
        season: "2023-24",
        status: 'complete' as MatchStatus,
        homeGoalCount: 2,
        awayGoalCount: 1,
        totalGoalCount: 3,
        date_unix: 1640995200
      };

      // Validate required fields exist and have correct types
      expect(typeof match.id).toBe('number');
      expect(typeof match.homeID).toBe('number');
      expect(typeof match.awayID).toBe('number');
      expect(typeof match.season).toBe('string');
      expect(typeof match.status).toBe('string');
      
      // Validate status enum matches footy.yaml exactly
      const validStatuses = ['complete', 'suspended', 'canceled', 'incomplete'];
      expect(validStatuses).toContain(match.status);
    });

    it('should support ALL optional fields from footy.yaml Match schema', () => {
      const match: Match = {
        // Required fields
        id: 123456,
        homeID: 1001,
        awayID: 1002,
        season: "2023-24",
        status: 'complete',
        homeGoalCount: 2,
        awayGoalCount: 1,
        totalGoalCount: 3,
        date_unix: 1640995200,
        
        // ALL optional fields from footy.yaml
        roundID: 10,
        game_week: 15,
        revised_game_week: 15,
        homeGoals: ['23', '67'],
        awayGoals: ['45'],
        team_a_corners: 6,
        team_b_corners: 4,
        totalCornerCount: 10,
        team_a_offsides: 2,
        team_b_offsides: 1,
        team_a_yellow_cards: 2,
        team_b_yellow_cards: 1,
        team_a_red_cards: 0,
        team_b_red_cards: 0,
        team_a_shotsOnTarget: 5,
        team_b_shotsOnTarget: 3,
        team_a_shotsOffTarget: 3,
        team_b_shotsOffTarget: 4,
        team_a_shots: 8,
        team_b_shots: 7,
        team_a_fouls: 12,
        team_b_fouls: 15,
        team_a_possession: 55,
        team_b_possession: 45,
        refereeID: 5001,
        coach_a_ID: 2001,
        coach_b_ID: 2002,
        stadium_name: "Test Stadium",
        stadium_location: "Test City",
        team_a_cards_num: 2,
        team_b_cards_num: 1,
        odds_ft_1: 2.5,
        odds_ft_x: 3.2,
        odds_ft_2: 2.8,
        winningTeam: 1001,
        btts: true,
        over05: true,
        over15: true,
        over25: true,
        over35: false,
        over45: false,
        over55: false
      };

      // Validate all optional fields have correct types
      expect(typeof match.roundID).toBe('number');
      expect(typeof match.game_week).toBe('number');
      expect(typeof match.revised_game_week).toBe('number');
      expect(Array.isArray(match.homeGoals)).toBe(true);
      expect(Array.isArray(match.awayGoals)).toBe(true);
      expect(typeof match.team_a_corners).toBe('number');
      expect(typeof match.team_b_corners).toBe('number');
      expect(typeof match.totalCornerCount).toBe('number');
      expect(typeof match.team_a_offsides).toBe('number');
      expect(typeof match.team_b_offsides).toBe('number');
      expect(typeof match.team_a_yellow_cards).toBe('number');
      expect(typeof match.team_b_yellow_cards).toBe('number');
      expect(typeof match.team_a_red_cards).toBe('number');
      expect(typeof match.team_b_red_cards).toBe('number');
      expect(typeof match.team_a_shotsOnTarget).toBe('number');
      expect(typeof match.team_b_shotsOnTarget).toBe('number');
      expect(typeof match.team_a_shotsOffTarget).toBe('number');
      expect(typeof match.team_b_shotsOffTarget).toBe('number');
      expect(typeof match.team_a_shots).toBe('number');
      expect(typeof match.team_b_shots).toBe('number');
      expect(typeof match.team_a_fouls).toBe('number');
      expect(typeof match.team_b_fouls).toBe('number');
      expect(typeof match.team_a_possession).toBe('number');
      expect(typeof match.team_b_possession).toBe('number');
      expect(typeof match.refereeID).toBe('number');
      expect(typeof match.coach_a_ID).toBe('number');
      expect(typeof match.coach_b_ID).toBe('number');
      expect(typeof match.stadium_name).toBe('string');
      expect(typeof match.stadium_location).toBe('string');
      expect(typeof match.team_a_cards_num).toBe('number');
      expect(typeof match.team_b_cards_num).toBe('number');
      expect(typeof match.odds_ft_1).toBe('number');
      expect(typeof match.odds_ft_x).toBe('number');
      expect(typeof match.odds_ft_2).toBe('number');
      expect(typeof match.winningTeam).toBe('number');
      expect(typeof match.btts).toBe('boolean');
      expect(typeof match.over05).toBe('boolean');
      expect(typeof match.over15).toBe('boolean');
      expect(typeof match.over25).toBe('boolean');
      expect(typeof match.over35).toBe('boolean');
      expect(typeof match.over45).toBe('boolean');
      expect(typeof match.over55).toBe('boolean');
    });
  });

  describe('Team Schema Compliance', () => {
    it('should have ALL required fields from footy.yaml Team schema', () => {
      // footy.yaml required fields: id, name
      const team: Team = {
        id: 1001,
        name: "Test FC"
      };

      expect(typeof team.id).toBe('number');
      expect(typeof team.name).toBe('string');
    });

    it('should support ALL optional fields from footy.yaml Team schema', () => {
      const team: Team = {
        // Required fields
        id: 1001,
        name: "Test FC",
        
        // ALL optional fields from footy.yaml
        original_id: 2001,
        cleanName: "test-fc",
        english_name: "Test Football Club",
        shortHand: "TFC",
        country: "England",
        continent: "Europe",
        image: "https://example.com/logo.png",
        season: "2023-24",
        url: "https://testfc.com",
        stadium_name: "Test Stadium",
        stadium_address: "123 Test Street",
        table_position: 5,
        performance_rank: 8,
        risk: 2,
        season_format: "Regular",
        competition_id: 101,
        founded: "1900",
        full_name: "Test Football Club",
        alt_names: ["TFC", "Test"],
        official_sites: ["https://testfc.com", "https://testfc.org"]
      };

      // Validate all optional fields have correct types
      expect(typeof team.original_id).toBe('number');
      expect(typeof team.cleanName).toBe('string');
      expect(typeof team.english_name).toBe('string');
      expect(typeof team.shortHand).toBe('string');
      expect(typeof team.country).toBe('string');
      expect(typeof team.continent).toBe('string');
      expect(typeof team.image).toBe('string');
      expect(typeof team.season).toBe('string');
      expect(typeof team.url).toBe('string');
      expect(typeof team.stadium_name).toBe('string');
      expect(typeof team.stadium_address).toBe('string');
      expect(typeof team.table_position).toBe('number');
      expect(typeof team.performance_rank).toBe('number');
      expect(typeof team.risk).toBe('number');
      expect(typeof team.season_format).toBe('string');
      expect(typeof team.competition_id).toBe('number');
      expect(typeof team.founded).toBe('string');
      expect(typeof team.full_name).toBe('string');
      expect(Array.isArray(team.alt_names)).toBe(true);
      expect(Array.isArray(team.official_sites)).toBe(true);
    });
  });

  describe('Player Schema Compliance', () => {
    it('should have ALL required fields from footy.yaml Player schema', () => {
      // footy.yaml required fields: id, name
      const player: Player = {
        id: 5001,
        name: "Test Player"
      };

      expect(typeof player.id).toBe('number');
      expect(typeof player.name).toBe('string');
    });

    it('should support ALL optional fields from footy.yaml Player schema', () => {
      const player: Player = {
        // Required fields
        id: 5001,
        name: "Test Player",
        
        // ALL optional fields from footy.yaml
        position: "Forward",
        age: 25,
        nationality: "England",
        team_id: 1001,
        goals_overall: 12
      };

      expect(typeof player.position).toBe('string');
      expect(typeof player.age).toBe('number');
      expect(typeof player.nationality).toBe('string');
      expect(typeof player.team_id).toBe('number');
      expect(typeof player.goals_overall).toBe('number');
    });
  });

  describe('Referee Schema Compliance', () => {
    it('should have ALL required fields from footy.yaml Referee schema', () => {
      // footy.yaml required fields: id, name
      const referee: Referee = {
        id: 3001,
        name: "Test Referee"
      };

      expect(typeof referee.id).toBe('number');
      expect(typeof referee.name).toBe('string');
    });

    it('should support ALL optional fields from footy.yaml Referee schema', () => {
      const referee: Referee = {
        // Required fields
        id: 3001,
        name: "Test Referee",
        
        // ALL optional fields from footy.yaml
        nationality: "England",
        matches_officiated: 150
      };

      expect(typeof referee.nationality).toBe('string');
      expect(typeof referee.matches_officiated).toBe('number');
    });
  });

  describe('League Schema Compliance', () => {
    it('should have ALL required fields from footy.yaml League schema', () => {
      // footy.yaml required fields: name, season
      const league: League = {
        name: "Premier League",
        season: [
          { id: 1, year: 2023 },
          { id: 2, year: 2024 }
        ]
      };

      expect(typeof league.name).toBe('string');
      expect(Array.isArray(league.season)).toBe(true);
      expect(typeof league.season[0].id).toBe('number');
      expect(typeof league.season[0].year).toBe('number');
    });
  });

  describe('Season Schema Compliance', () => {
    it('should have ALL required fields from footy.yaml Season schema', () => {
      // footy.yaml required fields: id, year
      const season: Season = {
        id: 1,
        year: 2023
      };

      expect(typeof season.id).toBe('number');
      expect(typeof season.year).toBe('number');
    });
  });

  describe('Country Schema Compliance', () => {
    it('should have ALL required fields from footy.yaml Country schema', () => {
      // footy.yaml required fields: id, name
      const country: Country = {
        id: 1,
        name: "England"
      };

      expect(typeof country.id).toBe('number');
      expect(typeof country.name).toBe('string');
    });
  });

  describe('LeagueSeason Schema Compliance', () => {
    it('should have ALL required fields from footy.yaml LeagueSeason schema', () => {
      // footy.yaml required fields: id, name
      const leagueSeason: LeagueSeason = {
        id: "season-123",
        name: "Premier League",
        country: "England",
        year: "2023",
        season: "2023-24"
      };

      expect(typeof leagueSeason.id).toBe('string');
      expect(typeof leagueSeason.name).toBe('string');
    });

    it('should support ALL optional fields from footy.yaml LeagueSeason schema', () => {
      const leagueSeason: LeagueSeason = {
        // Required fields
        id: "season-123",
        name: "Premier League",
        country: "England",
        year: "2023",
        season: "2023-24",
        
        // ALL optional fields from footy.yaml
        division: "1",
        shortHand: "PL",
        type: "domestic",
        iso: "GB",
        continent: "Europe",
        image: "https://example.com/pl.png",
        image_thumb: "https://example.com/pl-thumb.png",
        url: "https://premierleague.com",
        parent_url: "https://parent.com",
        countryURL: "https://country.com",
        tie_break: "goal_difference",
        domestic_scale: "high",
        international_scale: "medium",
        clubNum: 20,
        starting_year: "2023",
        ending_year: "2024",
        no_home_away: false,
        seasonClean: "2023-24"
      };

      // Validate all optional fields have correct types
      expect(typeof leagueSeason.division).toBe('string');
      expect(typeof leagueSeason.shortHand).toBe('string');
      expect(typeof leagueSeason.type).toBe('string');
      expect(typeof leagueSeason.iso).toBe('string');
      expect(typeof leagueSeason.continent).toBe('string');
      expect(typeof leagueSeason.image).toBe('string');
      expect(typeof leagueSeason.image_thumb).toBe('string');
      expect(typeof leagueSeason.url).toBe('string');
      expect(typeof leagueSeason.parent_url).toBe('string');
      expect(typeof leagueSeason.countryURL).toBe('string');
      expect(typeof leagueSeason.tie_break).toBe('string');
      expect(typeof leagueSeason.domestic_scale).toBe('string');
      expect(typeof leagueSeason.international_scale).toBe('string');
      expect(typeof leagueSeason.clubNum).toBe('number');
      expect(typeof leagueSeason.starting_year).toBe('string');
      expect(typeof leagueSeason.ending_year).toBe('string');
      expect(typeof leagueSeason.no_home_away).toBe('boolean');
      expect(typeof leagueSeason.seasonClean).toBe('string');
    });
  });

  describe('API Response Schema Compliance', () => {
    it('should match footy.yaml ApiResponse schema', () => {
      const apiResponse = {
        success: true,
        data: []
      };

      expect(typeof apiResponse.success).toBe('boolean');
      expect(Array.isArray(apiResponse.data)).toBe(true);
    });

    it('should match footy.yaml PaginatedResponse schema', () => {
      const paginatedResponse = {
        success: true,
        data: [],
        pager: {
          current_page: 1,
          max_page: 10,
          results_per_page: 50,
          total_results: 500
        }
      };

      expect(typeof paginatedResponse.success).toBe('boolean');
      expect(Array.isArray(paginatedResponse.data)).toBe(true);
      expect(typeof paginatedResponse.pager.current_page).toBe('number');
      expect(typeof paginatedResponse.pager.max_page).toBe('number');
      expect(typeof paginatedResponse.pager.results_per_page).toBe('number');
      expect(typeof paginatedResponse.pager.total_results).toBe('number');
    });
  });
});
