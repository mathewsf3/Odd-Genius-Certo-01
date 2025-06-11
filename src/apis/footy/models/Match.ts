/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Match = {
    /**
     * ID of the match
     */
    id: number;
    /**
     * Home team ID
     */
    homeID: number;
    /**
     * Away team ID
     */
    awayID: number;
    /**
     * Season year of the league
     */
    season: string;
    /**
     * Status of the match
     */
    status: Match.status;
    /**
     * Round ID
     */
    roundID?: number;
    /**
     * Game week number
     */
    game_week?: number;
    /**
     * Revised game week (-1 is default)
     */
    revised_game_week?: number;
    /**
     * Goal timings for home team
     */
    homeGoals?: Array<string>;
    /**
     * Goal timings for away team
     */
    awayGoals?: Array<string>;
    /**
     * Number of home team goals
     */
    homeGoalCount?: number;
    /**
     * Number of away team goals
     */
    awayGoalCount?: number;
    /**
     * Total goals in the match
     */
    totalGoalCount?: number;
    /**
     * Home team corners (-1 is default)
     */
    team_a_corners?: number;
    /**
     * Away team corners (-1 is default)
     */
    team_b_corners?: number;
    /**
     * Total corners in the match
     */
    totalCornerCount?: number;
    /**
     * Home team offsides
     */
    team_a_offsides?: number;
    /**
     * Away team offsides
     */
    team_b_offsides?: number;
    /**
     * Home team yellow cards
     */
    team_a_yellow_cards?: number;
    /**
     * Away team yellow cards
     */
    team_b_yellow_cards?: number;
    /**
     * Home team red cards
     */
    team_a_red_cards?: number;
    /**
     * Away team red cards
     */
    team_b_red_cards?: number;
    /**
     * Home team shots on target (-1 is default)
     */
    team_a_shotsOnTarget?: number;
    /**
     * Away team shots on target (-1 is default)
     */
    team_b_shotsOnTarget?: number;
    /**
     * Home team shots off target (-1 is default)
     */
    team_a_shotsOffTarget?: number;
    /**
     * Away team shots off target (-1 is default)
     */
    team_b_shotsOffTarget?: number;
    /**
     * Home team total shots (-2 is default)
     */
    team_a_shots?: number;
    /**
     * Away team total shots (-2 is default)
     */
    team_b_shots?: number;
    /**
     * Home team fouls (-1 is default)
     */
    team_a_fouls?: number;
    /**
     * Away team fouls (-1 is default)
     */
    team_b_fouls?: number;
    /**
     * Home team possession (-1 is default)
     */
    team_a_possession?: number;
    /**
     * Away team possession (-1 is default)
     */
    team_b_possession?: number;
    /**
     * Referee ID
     */
    refereeID?: number;
    /**
     * Home team coach ID
     */
    coach_a_ID?: number;
    /**
     * Away team coach ID
     */
    coach_b_ID?: number;
    /**
     * Stadium name
     */
    stadium_name?: string;
    /**
     * Stadium location
     */
    stadium_location?: string;
    /**
     * Home team total cards
     */
    team_a_cards_num?: number;
    /**
     * Away team total cards
     */
    team_b_cards_num?: number;
    /**
     * Odds for home team win
     */
    odds_ft_1?: number;
    /**
     * Odds for draw
     */
    odds_ft_x?: number;
    /**
     * Odds for away team win
     */
    odds_ft_2?: number;
    /**
     * UNIX timestamp of match kickoff
     */
    date_unix?: number;
    /**
     * ID of winning team (-1 if draw)
     */
    winningTeam?: number;
    /**
     * Both teams to score
     */
    btts?: boolean;
    /**
     * Over 0.5 goals
     */
    over05?: boolean;
    /**
     * Over 1.5 goals
     */
    over15?: boolean;
    /**
     * Over 2.5 goals
     */
    over25?: boolean;
    /**
     * Over 3.5 goals
     */
    over35?: boolean;
    /**
     * Over 4.5 goals
     */
    over45?: boolean;
    /**
     * Over 5.5 goals
     */
    over55?: boolean;
};
export namespace Match {
    /**
     * Status of the match
     */
    export enum status {
        COMPLETE = 'complete',
        SUSPENDED = 'suspended',
        CANCELED = 'canceled',
        INCOMPLETE = 'incomplete',
    }
}

