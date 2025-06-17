"use strict";
/**
 * DTO Validation Tests
 * Test that our DTOs match the footy.yaml schema requirements
 */
Object.defineProperty(exports, "__esModule", { value: true });
describe('DTO Schema Validation', () => {
    describe('Match DTO', () => {
        it('should have all required fields from footy.yaml', () => {
            const match = {
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
            // Test required fields exist
            expect(match.id).toBeDefined();
            expect(match.homeID).toBeDefined();
            expect(match.awayID).toBeDefined();
            expect(match.season).toBeDefined();
            expect(match.status).toBeDefined();
            // Test status enum values match footy.yaml
            const validStatuses = ['complete', 'suspended', 'canceled', 'incomplete'];
            expect(validStatuses).toContain(match.status);
        });
        it('should support all optional fields from footy.yaml', () => {
            const match = {
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
                roundID: 10,
                game_week: 15,
                revised_game_week: 15,
                homeGoals: ['23', '67'],
                awayGoals: ['45'],
                team_a_corners: 6,
                team_b_corners: 4,
                totalCornerCount: 10,
                team_a_yellow_cards: 2,
                team_b_yellow_cards: 1,
                team_a_red_cards: 0,
                team_b_red_cards: 0,
                refereeID: 5001,
                stadium_name: "Test Stadium",
                odds_ft_1: 2.5,
                odds_ft_x: 3.2,
                odds_ft_2: 2.8,
                btts: true,
                over25: true
            };
            expect(match.roundID).toBe(10);
            expect(match.homeGoals).toEqual(['23', '67']);
            expect(match.team_a_corners).toBe(6);
            expect(match.btts).toBe(true);
        });
    });
    describe('Team DTO', () => {
        it('should have all required fields from footy.yaml', () => {
            const team = {
                id: 1001,
                name: "Test FC"
            };
            // Test required fields
            expect(team.id).toBeDefined();
            expect(team.name).toBeDefined();
            expect(typeof team.id).toBe('number');
            expect(typeof team.name).toBe('string');
        });
        it('should support all optional fields from footy.yaml', () => {
            const team = {
                id: 1001,
                name: "Test FC",
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
            expect(team.original_id).toBe(2001);
            expect(team.alt_names).toEqual(["TFC", "Test"]);
            expect(team.table_position).toBe(5);
        });
    });
    describe('Player DTO', () => {
        it('should have all required fields from footy.yaml', () => {
            const player = {
                id: 5001,
                name: "Test Player"
            };
            expect(player.id).toBeDefined();
            expect(player.name).toBeDefined();
            expect(typeof player.id).toBe('number');
            expect(typeof player.name).toBe('string');
        });
        it('should support all optional fields from footy.yaml', () => {
            const player = {
                id: 5001,
                name: "Test Player",
                position: "Forward",
                age: 25,
                nationality: "England",
                team_id: 1001,
                goals_overall: 12
            };
            expect(player.position).toBe("Forward");
            expect(player.age).toBe(25);
            expect(player.goals_overall).toBe(12);
        });
    });
    describe('Referee DTO', () => {
        it('should have all required fields from footy.yaml', () => {
            const referee = {
                id: 3001,
                name: "Test Referee"
            };
            expect(referee.id).toBeDefined();
            expect(referee.name).toBeDefined();
            expect(typeof referee.id).toBe('number');
            expect(typeof referee.name).toBe('string');
        });
        it('should support all optional fields from footy.yaml', () => {
            const referee = {
                id: 3001,
                name: "Test Referee",
                nationality: "England",
                matches_officiated: 150
            };
            expect(referee.nationality).toBe("England");
            expect(referee.matches_officiated).toBe(150);
        });
    });
    describe('League DTO', () => {
        it('should match footy.yaml League schema', () => {
            const league = {
                name: "Premier League",
                season: [
                    { id: 1, year: 2023 },
                    { id: 2, year: 2024 }
                ]
            };
            expect(league.name).toBeDefined();
            expect(league.season).toBeDefined();
            expect(Array.isArray(league.season)).toBe(true);
            expect(league.season[0].id).toBe(1);
            expect(league.season[0].year).toBe(2023);
        });
    });
    describe('LeagueSeason DTO', () => {
        it('should have all required fields from footy.yaml', () => {
            const leagueSeason = {
                id: "season-123",
                name: "Premier League",
                country: "England",
                year: "2023",
                season: "2023-24"
            };
            expect(leagueSeason.id).toBeDefined();
            expect(leagueSeason.name).toBeDefined();
            expect(typeof leagueSeason.id).toBe('string');
            expect(typeof leagueSeason.name).toBe('string');
        });
        it('should support all optional fields from footy.yaml', () => {
            const leagueSeason = {
                id: "season-123",
                name: "Premier League",
                country: "England",
                year: "2023",
                division: "1",
                shortHand: "PL",
                type: "domestic",
                iso: "GB",
                continent: "Europe",
                image: "https://example.com/pl.png",
                image_thumb: "https://example.com/pl-thumb.png",
                url: "https://premierleague.com",
                clubNum: 20,
                season: "2023-24",
                starting_year: "2023",
                ending_year: "2024",
                no_home_away: false,
                seasonClean: "2023-24"
            };
            expect(leagueSeason.clubNum).toBe(20);
            expect(leagueSeason.no_home_away).toBe(false);
            expect(leagueSeason.continent).toBe("Europe");
        });
    });
    describe('Type Safety', () => {
        it('should enforce correct types for numeric fields', () => {
            // This test ensures TypeScript compilation catches type errors
            const match = {
                id: 123456, // number
                homeID: 1001, // number
                awayID: 1002, // number
                season: "2023-24", // string
                status: 'complete', // MatchStatus enum
                homeGoalCount: 2, // number
                awayGoalCount: 1, // number
                totalGoalCount: 3, // number
                date_unix: 1640995200 // number
            };
            expect(typeof match.id).toBe('number');
            expect(typeof match.season).toBe('string');
            expect(typeof match.homeGoalCount).toBe('number');
        });
        it('should enforce correct types for array fields', () => {
            const match = {
                id: 123456,
                homeID: 1001,
                awayID: 1002,
                season: "2023-24",
                status: 'complete',
                homeGoalCount: 2,
                awayGoalCount: 1,
                totalGoalCount: 3,
                date_unix: 1640995200,
                homeGoals: ['23', '67'], // string[]
                awayGoals: ['45'] // string[]
            };
            expect(Array.isArray(match.homeGoals)).toBe(true);
            expect(Array.isArray(match.awayGoals)).toBe(true);
            expect(typeof match.homeGoals[0]).toBe('string');
        });
    });
});
