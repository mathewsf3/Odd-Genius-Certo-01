/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Match = {
    properties: {
        id: {
            type: 'number',
            description: `ID of the match`,
            isRequired: true,
        },
        homeID: {
            type: 'number',
            description: `Home team ID`,
            isRequired: true,
        },
        awayID: {
            type: 'number',
            description: `Away team ID`,
            isRequired: true,
        },
        season: {
            type: 'string',
            description: `Season year of the league`,
            isRequired: true,
        },
        status: {
            type: 'Enum',
            isRequired: true,
        },
        roundID: {
            type: 'number',
            description: `Round ID`,
        },
        game_week: {
            type: 'number',
            description: `Game week number`,
        },
        revised_game_week: {
            type: 'number',
            description: `Revised game week (-1 is default)`,
        },
        homeGoals: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        awayGoals: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        homeGoalCount: {
            type: 'number',
            description: `Number of home team goals`,
        },
        awayGoalCount: {
            type: 'number',
            description: `Number of away team goals`,
        },
        totalGoalCount: {
            type: 'number',
            description: `Total goals in the match`,
        },
        team_a_corners: {
            type: 'number',
            description: `Home team corners (-1 is default)`,
        },
        team_b_corners: {
            type: 'number',
            description: `Away team corners (-1 is default)`,
        },
        totalCornerCount: {
            type: 'number',
            description: `Total corners in the match`,
        },
        team_a_offsides: {
            type: 'number',
            description: `Home team offsides`,
        },
        team_b_offsides: {
            type: 'number',
            description: `Away team offsides`,
        },
        team_a_yellow_cards: {
            type: 'number',
            description: `Home team yellow cards`,
        },
        team_b_yellow_cards: {
            type: 'number',
            description: `Away team yellow cards`,
        },
        team_a_red_cards: {
            type: 'number',
            description: `Home team red cards`,
        },
        team_b_red_cards: {
            type: 'number',
            description: `Away team red cards`,
        },
        team_a_shotsOnTarget: {
            type: 'number',
            description: `Home team shots on target (-1 is default)`,
        },
        team_b_shotsOnTarget: {
            type: 'number',
            description: `Away team shots on target (-1 is default)`,
        },
        team_a_shotsOffTarget: {
            type: 'number',
            description: `Home team shots off target (-1 is default)`,
        },
        team_b_shotsOffTarget: {
            type: 'number',
            description: `Away team shots off target (-1 is default)`,
        },
        team_a_shots: {
            type: 'number',
            description: `Home team total shots (-2 is default)`,
        },
        team_b_shots: {
            type: 'number',
            description: `Away team total shots (-2 is default)`,
        },
        team_a_fouls: {
            type: 'number',
            description: `Home team fouls (-1 is default)`,
        },
        team_b_fouls: {
            type: 'number',
            description: `Away team fouls (-1 is default)`,
        },
        team_a_possession: {
            type: 'number',
            description: `Home team possession (-1 is default)`,
        },
        team_b_possession: {
            type: 'number',
            description: `Away team possession (-1 is default)`,
        },
        refereeID: {
            type: 'number',
            description: `Referee ID`,
        },
        coach_a_ID: {
            type: 'number',
            description: `Home team coach ID`,
        },
        coach_b_ID: {
            type: 'number',
            description: `Away team coach ID`,
        },
        stadium_name: {
            type: 'string',
            description: `Stadium name`,
        },
        stadium_location: {
            type: 'string',
            description: `Stadium location`,
        },
        team_a_cards_num: {
            type: 'number',
            description: `Home team total cards`,
        },
        team_b_cards_num: {
            type: 'number',
            description: `Away team total cards`,
        },
        odds_ft_1: {
            type: 'number',
            description: `Odds for home team win`,
            format: 'float',
        },
        odds_ft_x: {
            type: 'number',
            description: `Odds for draw`,
            format: 'float',
        },
        odds_ft_2: {
            type: 'number',
            description: `Odds for away team win`,
            format: 'float',
        },
        date_unix: {
            type: 'number',
            description: `UNIX timestamp of match kickoff`,
        },
        winningTeam: {
            type: 'number',
            description: `ID of winning team (-1 if draw)`,
        },
        btts: {
            type: 'boolean',
            description: `Both teams to score`,
        },
        over05: {
            type: 'boolean',
            description: `Over 0.5 goals`,
        },
        over15: {
            type: 'boolean',
            description: `Over 1.5 goals`,
        },
        over25: {
            type: 'boolean',
            description: `Over 2.5 goals`,
        },
        over35: {
            type: 'boolean',
            description: `Over 3.5 goals`,
        },
        over45: {
            type: 'boolean',
            description: `Over 4.5 goals`,
        },
        over55: {
            type: 'boolean',
            description: `Over 5.5 goals`,
        },
    },
} as const;
