/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse } from '../models/ApiResponse';
import type { Country } from '../models/Country';
import type { League } from '../models/League';
import type { Match } from '../models/Match';
import type { PaginatedResponse } from '../models/PaginatedResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Get Leagues
     * Returns a JSON array of all leagues available in the API Database
     * @returns any Successfully retrieved all leagues
     * @throws ApiError
     */
    public static getLeagues({
        key = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
        chosenLeaguesOnly,
        country,
    }: {
        /**
         * Your API key
         */
        key?: string,
        /**
         * If set to "true", only return user-chosen leagues
         */
        chosenLeaguesOnly?: 'true' | 'false',
        /**
         * ISO number of the country to filter leagues
         */
        country?: number,
    }): CancelablePromise<(ApiResponse & {
        data?: Array<League>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/league-list',
            query: {
                'key': key,
                'chosen_leagues_only': chosenLeaguesOnly,
                'country': country,
            },
        });
    }
    /**
     * Get Countries
     * Returns a JSON array of Countries and their ISO numbers
     * @returns any Successfully retrieved all countries
     * @throws ApiError
     */
    public static getCountries({
        key = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
    }: {
        /**
         * Your API key
         */
        key?: string,
    }): CancelablePromise<(ApiResponse & {
        data?: Array<Country>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/country-list',
            query: {
                'key': key,
            },
        });
    }
    /**
     * Get Today's Matches
     * Get a list of today's matches with or without stats
     * @returns any Successfully retrieved matches
     * @throws ApiError
     */
    public static getTodaysMatches({
        key = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
        timezone,
        date,
        page = 1,
    }: {
        /**
         * Your API key
         */
        key?: string,
        /**
         * Timezone (e.g., Europe/London). Defaults to Etc/UTC
         */
        timezone?: string,
        /**
         * Date in YYYY-MM-DD format. Defaults to current day
         */
        date?: string,
        /**
         * Page number for pagination
         */
        page?: number,
    }): CancelablePromise<(PaginatedResponse & {
        data?: Array<Match>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/todays-matches',
            query: {
                'key': key,
                'timezone': timezone,
                'date': date,
                'page': page,
            },
        });
    }
    /**
     * Get Season Stats and Teams
     * Get league season stats and teams that participated
     * @returns ApiResponse Successfully retrieved league season data
     * @throws ApiError
     */
    public static getLeagueSeason({
        seasonId,
        key = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
        maxTime,
    }: {
        /**
         * ID of the league season to retrieve
         */
        seasonId: number,
        /**
         * Your API key
         */
        key?: string,
        /**
         * UNIX timestamp to get stats up to a certain time
         */
        maxTime?: number,
    }): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/league-season',
            query: {
                'key': key,
                'season_id': seasonId,
                'max_time': maxTime,
            },
        });
    }
    /**
     * Get League Matches
     * Get full match schedule of the selected league season
     * @returns any Successfully retrieved league matches
     * @throws ApiError
     */
    public static getLeagueMatches({
        seasonId,
        key = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
        page = 1,
        maxPerPage = 300,
        maxTime,
    }: {
        /**
         * ID of the league season to retrieve
         */
        seasonId: number,
        /**
         * Your API key
         */
        key?: string,
        /**
         * Page number for pagination
         */
        page?: number,
        /**
         * Number of matches per page (max 1000)
         */
        maxPerPage?: number,
        /**
         * UNIX timestamp to get matches up to a certain time
         */
        maxTime?: number,
    }): CancelablePromise<(ApiResponse & {
        data?: Array<Match>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/league-matches',
            query: {
                'key': key,
                'season_id': seasonId,
                'page': page,
                'max_per_page': maxPerPage,
                'max_time': maxTime,
            },
        });
    }
    /**
     * Get Teams in a League Season
     * Get all teams that participated in a season of a league
     * @returns PaginatedResponse Successfully retrieved league teams
     * @throws ApiError
     */
    public static getLeagueTeams({
        seasonId,
        key = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
        page = 1,
        include,
        maxTime,
    }: {
        /**
         * ID of the league season to retrieve
         */
        seasonId: number,
        /**
         * Your API key
         */
        key?: string,
        /**
         * Page number (50 teams per page)
         */
        page?: number,
        /**
         * Include additional data (e.g., "stats")
         */
        include?: 'stats',
        /**
         * UNIX timestamp to get stats up to a certain time
         */
        maxTime?: number,
    }): CancelablePromise<PaginatedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/league-teams',
            query: {
                'key': key,
                'season_id': seasonId,
                'page': page,
                'include': include,
                'max_time': maxTime,
            },
        });
    }
    /**
     * Get League Players
     * Get all players that participated in a season of a league
     * @returns ApiResponse Successfully retrieved league players
     * @throws ApiError
     */
    public static getLeaguePlayers({
        seasonId,
        key = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
        include,
    }: {
        /**
         * ID of the league season to retrieve
         */
        seasonId: number,
        /**
         * Your API key
         */
        key?: string,
        /**
         * Include additional data (e.g., "stats")
         */
        include?: 'stats',
    }): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/league-players',
            query: {
                'key': key,
                'season_id': seasonId,
                'include': include,
            },
        });
    }
    /**
     * Get League Referees
     * Get all referees that officiated in a season of a league
     * @returns ApiResponse Successfully retrieved league referees
     * @throws ApiError
     */
    public static getLeagueReferees({
        seasonId,
        key = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
    }: {
        /**
         * ID of the league season to retrieve
         */
        seasonId: number,
        /**
         * Your API key
         */
        key?: string,
    }): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/league-referees',
            query: {
                'key': key,
                'season_id': seasonId,
            },
        });
    }
    /**
     * Get Individual Team Data
     * Get data for an individual team
     * @returns ApiResponse Successfully retrieved team data
     * @throws ApiError
     */
    public static getTeam({
        teamId,
        key = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
        include,
    }: {
        /**
         * ID of the team to retrieve
         */
        teamId: number,
        /**
         * Your API key
         */
        key?: string,
        /**
         * Include additional data (e.g., "stats")
         */
        include?: 'stats',
    }): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/team',
            query: {
                'key': key,
                'team_id': teamId,
                'include': include,
            },
        });
    }
    /**
     * Get Last X Stats for a Team
     * Get last 5, 6, or 10 match stats for an individual team
     * @returns ApiResponse Successfully retrieved team last X stats
     * @throws ApiError
     */
    public static getTeamLastXStats({
        teamId,
        key = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
    }: {
        /**
         * ID of the team to retrieve stats for
         */
        teamId: number,
        /**
         * Your API key
         */
        key?: string,
    }): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/lastx',
            query: {
                'key': key,
                'team_id': teamId,
            },
        });
    }
    /**
     * Get Match Details
     * Get detailed stats, H2H data, and odds comparison for a single match
     * @returns ApiResponse Successfully retrieved match details
     * @throws ApiError
     */
    public static getMatch({
        matchId,
        key = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
    }: {
        /**
         * ID of the match to retrieve
         */
        matchId: number,
        /**
         * Your API key
         */
        key?: string,
    }): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/match',
            query: {
                'key': key,
                'match_id': matchId,
            },
        });
    }
    /**
     * Get League Tables
     * Get all tables for a league season
     * @returns ApiResponse Successfully retrieved league tables
     * @throws ApiError
     */
    public static getLeagueTables({
        seasonId,
        key = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
    }: {
        /**
         * ID of the league season to retrieve tables for
         */
        seasonId: number,
        /**
         * Your API key
         */
        key?: string,
    }): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/league-tables',
            query: {
                'key': key,
                'season_id': seasonId,
            },
        });
    }
    /**
     * Get Individual Player Stats
     * Get stats for an individual player across all seasons and leagues
     * @returns ApiResponse Successfully retrieved player stats
     * @throws ApiError
     */
    public static getPlayerStats({
        playerId,
        key = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
    }: {
        /**
         * ID of the player to retrieve stats for
         */
        playerId: number,
        /**
         * Your API key
         */
        key?: string,
    }): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/player-stats',
            query: {
                'key': key,
                'player_id': playerId,
            },
        });
    }
    /**
     * Get Individual Referee Stats
     * Get stats for an individual referee across all competitions and seasons
     * @returns ApiResponse Successfully retrieved referee stats
     * @throws ApiError
     */
    public static getRefereeStats({
        refereeId,
        key = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
    }: {
        /**
         * ID of the referee to retrieve stats for
         */
        refereeId: number,
        /**
         * Your API key
         */
        key?: string,
    }): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/referee',
            query: {
                'key': key,
                'referee_id': refereeId,
            },
        });
    }
    /**
     * Get BTTS Stats
     * Get top teams, fixtures, and leagues for Both Teams To Score (BTTS)
     * @returns ApiResponse Successfully retrieved BTTS stats
     * @throws ApiError
     */
    public static getBttsStats({
        key = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
    }: {
        /**
         * Your API key
         */
        key?: string,
    }): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/stats-data-btts',
            query: {
                'key': key,
            },
        });
    }
    /**
     * Get Over 2.5 Stats
     * Get top teams, fixtures, and leagues for Over 2.5 Goals
     * @returns ApiResponse Successfully retrieved Over 2.5 stats
     * @throws ApiError
     */
    public static getOver25Stats({
        key = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756',
    }: {
        /**
         * Your API key
         */
        key?: string,
    }): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/stats-data-over25',
            query: {
                'key': key,
            },
        });
    }
}
