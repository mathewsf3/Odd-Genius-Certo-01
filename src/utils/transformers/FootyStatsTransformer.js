"use strict";
/**
 * 🔄 FootyStats API Data Transformer
 * Transforms raw FootyStats API responses to our standardized format
 * Full alignment with footy.yaml API specification
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FootyStatsTransformer = void 0;
const footballConstants_1 = require("../constants/footballConstants");
const logger_1 = require("../logger");
class FootyStatsTransformer {
    /**
     * Transform FootyStats ApiResponse to our standardized format
     */
    static transformResponse(footyResponse, processingStartTime, endpoint) {
        const processingTime = processingStartTime
            ? Date.now() - processingStartTime
            : undefined;
        const standardized = {
            success: footyResponse.success || false,
            data: footyResponse.data,
            metadata: {
                source: 'footystats',
                timestamp: new Date().toISOString(),
                processingTime,
                endpoint
            }
        };
        // Add pagination if available (PaginatedResponse)
        if ('pager' in footyResponse && footyResponse.pager) {
            const pager = footyResponse.pager;
            standardized.pagination = {
                currentPage: pager.current_page || 1,
                totalPages: pager.max_page || 1,
                totalResults: pager.total_results || 0,
                resultsPerPage: pager.results_per_page || 0
            };
        }
        logger_1.logger.debug('FootyStats response transformed', {
            success: standardized.success,
            dataLength: Array.isArray(standardized.data) ? standardized.data.length : 'single',
            processingTime,
            endpoint,
            hasPagination: !!standardized.pagination
        });
        return standardized;
    }
    /**
     * Transform match data with enhanced analytics
     * Aligns with footy.yaml Match schema
     */
    static transformMatchData(match) {
        // Calculate possession percentages if available
        const homePossession = match.team_a_possession || footballConstants_1.DEFAULT_VALUES.STATS_DEFAULT;
        const awayPossession = match.team_b_possession || footballConstants_1.DEFAULT_VALUES.STATS_DEFAULT;
        let homePercentage;
        let awayPercentage;
        if (homePossession > 0 && awayPossession > 0) {
            const total = homePossession + awayPossession;
            homePercentage = Math.round((homePossession / total) * 100);
            awayPercentage = Math.round((awayPossession / total) * 100);
        }
        // Calculate shot accuracy
        const homeShots = match.team_a_shots || footballConstants_1.DEFAULT_VALUES.SHOTS_DEFAULT;
        const awayShots = match.team_b_shots || footballConstants_1.DEFAULT_VALUES.SHOTS_DEFAULT;
        const homeOnTarget = match.team_a_shotsOnTarget || footballConstants_1.DEFAULT_VALUES.STATS_DEFAULT;
        const awayOnTarget = match.team_b_shotsOnTarget || footballConstants_1.DEFAULT_VALUES.STATS_DEFAULT;
        const homeAccuracy = homeShots > 0 && homeOnTarget >= 0
            ? Math.round((homeOnTarget / homeShots) * 100)
            : undefined;
        const awayAccuracy = awayShots > 0 && awayOnTarget >= 0
            ? Math.round((awayOnTarget / awayShots) * 100)
            : undefined;
        // Get card data
        const homeYellow = match.team_a_yellow_cards || 0;
        const homeRed = match.team_a_red_cards || 0;
        const awayYellow = match.team_b_yellow_cards || 0;
        const awayRed = match.team_b_red_cards || 0;
        const enhanced = Object.assign(Object.assign({}, match), { analytics: {
                bothTeamsToScore: match.btts || false,
                totalGoals: match.totalGoalCount || 0,
                goalThresholds: {
                    over05: match.over05 || false,
                    over15: match.over15 || false,
                    over25: match.over25 || false,
                    over35: match.over35 || false,
                    over45: match.over45 || false,
                    over55: match.over55 || false
                },
                possession: {
                    home: homePossession,
                    away: awayPossession,
                    homePercentage,
                    awayPercentage
                },
                shots: {
                    home: {
                        total: homeShots,
                        onTarget: homeOnTarget,
                        offTarget: match.team_a_shotsOffTarget || footballConstants_1.DEFAULT_VALUES.STATS_DEFAULT,
                        accuracy: homeAccuracy
                    },
                    away: {
                        total: awayShots,
                        onTarget: awayOnTarget,
                        offTarget: match.team_b_shotsOffTarget || footballConstants_1.DEFAULT_VALUES.STATS_DEFAULT,
                        accuracy: awayAccuracy
                    }
                },
                cards: {
                    home: {
                        yellow: homeYellow,
                        red: homeRed,
                        total: homeYellow + homeRed
                    },
                    away: {
                        yellow: awayYellow,
                        red: awayRed,
                        total: awayYellow + awayRed
                    },
                    totalMatch: homeYellow + homeRed + awayYellow + awayRed
                },
                corners: {
                    home: match.team_a_corners || footballConstants_1.DEFAULT_VALUES.CORNER_DEFAULT,
                    away: match.team_b_corners || footballConstants_1.DEFAULT_VALUES.CORNER_DEFAULT,
                    total: match.totalCornerCount || 0
                },
                fouls: {
                    home: match.team_a_fouls || footballConstants_1.DEFAULT_VALUES.STATS_DEFAULT,
                    away: match.team_b_fouls || footballConstants_1.DEFAULT_VALUES.STATS_DEFAULT,
                    total: (match.team_a_fouls || 0) + (match.team_b_fouls || 0)
                },
                offside: {
                    home: match.team_a_offsides || 0,
                    away: match.team_b_offsides || 0,
                    total: (match.team_a_offsides || 0) + (match.team_b_offsides || 0)
                }
            } });
        logger_1.logger.debug('Match data enhanced with analytics', {
            matchId: match.id,
            totalGoals: enhanced.analytics.totalGoals,
            btts: enhanced.analytics.bothTeamsToScore,
            homeAccuracy: enhanced.analytics.shots.home.accuracy,
            awayAccuracy: enhanced.analytics.shots.away.accuracy
        });
        return enhanced;
    }
    /**
     * Transform team data with additional calculations
     * Aligns with footy.yaml Team schema
     */
    static transformTeamData(team) {
        const enhanced = Object.assign(Object.assign({}, team), { additionalStats: {
                hasImage: !!team.image,
                hasStadium: !!team.stadium_name,
                hasPosition: typeof team.table_position === 'number' && team.table_position > 0,
                riskLevel: this.getRiskLevel(team.risk || 0)
            } });
        logger_1.logger.debug('Team data transformed', {
            teamId: team.id,
            teamName: team.name,
            position: team.table_position,
            riskLevel: enhanced.additionalStats.riskLevel
        });
        return enhanced;
    }
    /**
     * Transform player data with additional calculations
     * Aligns with footy.yaml Player schema
     */
    static transformPlayerData(player) {
        const enhanced = Object.assign(Object.assign({}, player), { additionalStats: {
                isYoung: (player.age || 0) < 23,
                isVeteran: (player.age || 0) > 30,
                hasGoals: (player.goals_overall || 0) > 0,
                goalsPerGame: this.calculateGoalsPerGame(player.goals_overall, player.age)
            } });
        logger_1.logger.debug('Player data transformed', {
            playerId: player.id,
            playerName: player.name,
            age: player.age,
            goals: player.goals_overall
        });
        return enhanced;
    }
    /**
     * Transform league data with additional metadata
     * Aligns with footy.yaml League schema
     */
    static transformLeagueData(league) {
        const enhanced = Object.assign(Object.assign({}, league), { metadata: {
                hasSeasons: Array.isArray(league.season) && league.season.length > 0,
                seasonCount: Array.isArray(league.season) ? league.season.length : 0
            } });
        logger_1.logger.debug('League data transformed', {
            leagueName: league.name,
            seasonCount: enhanced.metadata.seasonCount
        });
        return enhanced;
    }
    /**
     * Transform country data
     * Aligns with footy.yaml Country schema
     */
    static transformCountryData(country) {
        const enhanced = Object.assign(Object.assign({}, country), { metadata: {
                hasId: typeof country.id === 'number',
                hasName: !!country.name
            } });
        return enhanced;
    }
    /**
     * Batch transform an array of matches
     */
    static transformMatchArray(matches) {
        return matches.map(match => this.transformMatchData(match));
    }
    /**
     * Get risk level description
     */
    static getRiskLevel(risk) {
        if (risk <= 2)
            return 'Low';
        if (risk <= 5)
            return 'Medium';
        if (risk <= 8)
            return 'High';
        return 'Very High';
    }
    /**
     * Calculate approximate goals per game (rough estimate)
     */
    static calculateGoalsPerGame(goals, age) {
        if (!goals || !age)
            return 0;
        // Rough estimate: assume player has been playing professionally for (age - 18) years
        // and plays about 30 games per year
        const professionalYears = Math.max(1, age - 18);
        const estimatedGames = professionalYears * 30;
        return Math.round((goals / estimatedGames) * 100) / 100; // Round to 2 decimal places
    }
    /**
     * Validate transformed data integrity
     */
    static validateTransformedData(original, transformed) {
        try {
            // Basic validation
            if (!transformed.success || !transformed.data || !transformed.metadata) {
                logger_1.logger.warn('Transformed data missing required fields');
                return false;
            }
            // Check timestamp is valid
            if (!transformed.metadata.timestamp || isNaN(Date.parse(transformed.metadata.timestamp))) {
                logger_1.logger.warn('Invalid timestamp in transformed data');
                return false;
            }
            // Check data array length matches if original is array
            if (Array.isArray(original.data) && Array.isArray(transformed.data)) {
                if (original.data.length !== transformed.data.length) {
                    logger_1.logger.warn('Data array length mismatch after transformation');
                    return false;
                }
            }
            return true;
        }
        catch (error) {
            logger_1.logger.error('Error validating transformed data', { error: error instanceof Error ? error.message : String(error) });
            return false;
        }
    }
}
exports.FootyStatsTransformer = FootyStatsTransformer;
