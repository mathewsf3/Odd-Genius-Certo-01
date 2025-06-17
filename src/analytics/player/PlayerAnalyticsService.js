"use strict";
/**
 * 👤 PLAYER & REFEREE ANALYTICS SERVICE
 *
 * Advanced player and referee analysis service
 * Utilizes: getPlayerStats, getLeaguePlayers, getRefereeStats, getLeagueReferees endpoints
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerAnalyticsService = void 0;
const BaseAnalyticsService_1 = require("../core/BaseAnalyticsService");
const PlayerAnalyticsHelpers_1 = require("../utils/PlayerAnalyticsHelpers");
class PlayerAnalyticsService extends BaseAnalyticsService_1.BaseAnalyticsService {
    /**
     * 📊 ANALYZE PLAYER PERFORMANCE
     * Comprehensive player performance analysis
     */
    analyzePlayerPerformance(playerId_1) {
        return __awaiter(this, arguments, void 0, function* (playerId, options = {}) {
            const startTime = Date.now();
            const cacheKey = `player_analysis:${playerId}:${JSON.stringify(options)}`;
            try {
                this.log(`📊 Analyzing player performance for player ${playerId}`);
                const computedResult = yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    // Get player stats
                    const playerStatsResult = yield this.footyStatsService.getPlayerStats(playerId);
                    if (!playerStatsResult.success || !playerStatsResult.data) {
                        throw new Error('Failed to fetch player stats');
                    }
                    const playerData = playerStatsResult.data;
                    // Create player object from stats data
                    const player = {
                        id: playerId,
                        name: playerData.name || `Player ${playerId}`,
                        position: playerData.position || 'Unknown'
                    };
                    // Get additional match data if needed for form analysis
                    let matches = [];
                    if (options.includeForm) {
                        // In a real implementation, you would fetch matches where this player participated
                        // For now, we'll use empty array
                        matches = [];
                    }
                    // Calculate performance metrics
                    const performance = PlayerAnalyticsHelpers_1.PlayerAnalyticsHelpers.calculatePlayerPerformance(player, matches, playerData);
                    // Calculate ranking (simplified - would need league context)
                    const ranking = {
                        overallRank: 1, // Would be calculated against other players
                        positionRank: 1, // Would be calculated against players in same position
                        totalPlayers: 100 // Would be actual count
                    };
                    // Generate insights
                    const insights = this.generatePlayerInsights(performance);
                    const analysis = {
                        player,
                        performance,
                        ranking,
                        insights
                    };
                    return { analysis, count: matches.length + 1 };
                }));
                // Extract cached flag and create final result
                const { _cached } = computedResult, data = __rest(computedResult, ["_cached"]);
                return this.createAnalyticsResult(data.analysis, 'player_performance_analysis', startTime, data.count, _cached || false);
            }
            catch (error) {
                this.log(`❌ Error analyzing player performance: ${error}`, 'error');
                return this.createErrorResult(`Failed to analyze player performance: ${error instanceof Error ? error.message : String(error)}`, 'player_performance_analysis', startTime);
            }
        });
    }
    /**
     * 🏁 ANALYZE REFEREE PERFORMANCE
     * Comprehensive referee performance analysis
     */
    analyzeRefereePerformance(refereeId_1) {
        return __awaiter(this, arguments, void 0, function* (refereeId, options = {}) {
            const startTime = Date.now();
            const cacheKey = `referee_analysis:${refereeId}:${JSON.stringify(options)}`;
            try {
                this.log(`🏁 Analyzing referee performance for referee ${refereeId}`);
                const computedResult = yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    // Get referee stats
                    const refereeStatsResult = yield this.footyStatsService.getRefereeStats(refereeId);
                    if (!refereeStatsResult.success || !refereeStatsResult.data) {
                        throw new Error('Failed to fetch referee stats');
                    }
                    const refereeData = refereeStatsResult.data;
                    // Create referee object from stats data
                    const referee = {
                        id: refereeId,
                        name: refereeData.name || `Referee ${refereeId}`
                    };
                    // Get matches officiated by this referee (simplified)
                    const matches = []; // Would fetch actual matches
                    // Calculate performance metrics
                    const performance = PlayerAnalyticsHelpers_1.PlayerAnalyticsHelpers.calculateRefereePerformance(referee, matches, refereeData);
                    // Calculate impact analysis if requested
                    let impact;
                    if (options.includeImpact) {
                        impact = PlayerAnalyticsHelpers_1.PlayerAnalyticsHelpers.analyzeRefereeImpact(performance, matches, [] // Would include teams data
                        );
                    }
                    else {
                        impact = {
                            referee: performance,
                            impact: {
                                homeAdvantageEffect: 0,
                                gameFlowEffect: 0,
                                cardTendency: 'average',
                                goalTendency: 'average'
                            },
                            teamEffects: []
                        };
                    }
                    // Calculate ranking
                    const ranking = {
                        overallRank: 1, // Would be calculated against other referees
                        totalReferees: 50 // Would be actual count
                    };
                    // Generate insights
                    const insights = this.generateRefereeInsights(performance);
                    const analysis = {
                        referee,
                        performance,
                        impact,
                        ranking,
                        insights
                    };
                    return { analysis, count: matches.length + 1 };
                }));
                // Extract cached flag and create final result
                const { _cached } = computedResult, data = __rest(computedResult, ["_cached"]);
                return this.createAnalyticsResult(data.analysis, 'referee_performance_analysis', startTime, data.count, _cached || false);
            }
            catch (error) {
                this.log(`❌ Error analyzing referee performance: ${error}`, 'error');
                return this.createErrorResult(`Failed to analyze referee performance: ${error instanceof Error ? error.message : String(error)}`, 'referee_performance_analysis', startTime);
            }
        });
    }
    /**
     * 🏆 ANALYZE LEAGUE PLAYERS
     * Analyze all players in a league season
     */
    analyzeLeaguePlayers(seasonId_1) {
        return __awaiter(this, arguments, void 0, function* (seasonId, options = {}) {
            const startTime = Date.now();
            const cacheKey = `league_players_analysis:${seasonId}:${JSON.stringify(options)}`;
            try {
                this.log(`🏆 Analyzing players in league season ${seasonId}`);
                const computedResult = yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    // Get all players in the league
                    const playersResult = yield this.footyStatsService.getLeaguePlayers(seasonId, true);
                    if (!playersResult.success || !playersResult.data) {
                        throw new Error('Failed to fetch league players');
                    }
                    let players = playersResult.data;
                    this.log(`📋 Found ${players.length} players in league season ${seasonId}`);
                    // Apply position filter if specified
                    if (options.positionFilter) {
                        players = players.filter((player) => { var _a; return (_a = player.position) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(options.positionFilter.toLowerCase()); });
                    }
                    // Limit players if specified
                    if (options.maxPlayers) {
                        players = players.slice(0, options.maxPlayers);
                    }
                    // Analyze each player
                    const analysisPromises = players.map((playerData) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const player = {
                                id: playerData.id,
                                name: playerData.name,
                                position: playerData.position
                            };
                            const performance = PlayerAnalyticsHelpers_1.PlayerAnalyticsHelpers.calculatePlayerPerformance(player, [], // Would include matches
                            playerData);
                            const analysis = {
                                player,
                                performance,
                                ranking: {
                                    overallRank: 0, // Will be calculated after all analyses
                                    positionRank: 0,
                                    totalPlayers: players.length
                                },
                                insights: this.generatePlayerInsights(performance)
                            };
                            return analysis;
                        }
                        catch (error) {
                            this.log(`⚠️ Failed to analyze player ${playerData.id}: ${error}`, 'warn');
                            return null;
                        }
                    }));
                    const analyses = yield Promise.all(analysisPromises);
                    const validAnalyses = analyses.filter(analysis => analysis !== null);
                    // Calculate rankings
                    this.calculatePlayerRankings(validAnalyses);
                    // Generate top performers analysis if requested
                    let topPerformers;
                    if (options.includeTopPerformers) {
                        const playerMetrics = validAnalyses.map(analysis => analysis.performance);
                        topPerformers = PlayerAnalyticsHelpers_1.PlayerAnalyticsHelpers.analyzeTopPerformers(playerMetrics);
                    }
                    // Generate comparisons if requested
                    let comparisons;
                    if (options.includeComparisons && validAnalyses.length >= 2) {
                        comparisons = this.generatePlayerComparisons(validAnalyses.slice(0, 10)); // Top 10 comparisons
                    }
                    const result = {
                        players: validAnalyses,
                        topPerformers,
                        comparisons
                    };
                    return { result, count: players.length };
                }));
                // Extract cached flag and create final result
                const { _cached } = computedResult, data = __rest(computedResult, ["_cached"]);
                return this.createAnalyticsResult(data.result, 'league_players_analysis', startTime, data.count, _cached || false);
            }
            catch (error) {
                this.log(`❌ Error analyzing league players: ${error}`, 'error');
                return this.createErrorResult(`Failed to analyze league players: ${error instanceof Error ? error.message : String(error)}`, 'league_players_analysis', startTime);
            }
        });
    }
    /**
     * 🏁 ANALYZE LEAGUE REFEREES
     * Analyze all referees in a league season
     */
    analyzeLeagueReferees(seasonId_1) {
        return __awaiter(this, arguments, void 0, function* (seasonId, options = {}) {
            const startTime = Date.now();
            const cacheKey = `league_referees_analysis:${seasonId}:${JSON.stringify(options)}`;
            try {
                this.log(`🏁 Analyzing referees in league season ${seasonId}`);
                const computedResult = yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    // Get all referees in the league
                    const refereesResult = yield this.footyStatsService.getLeagueReferees(seasonId);
                    if (!refereesResult.success || !refereesResult.data) {
                        throw new Error('Failed to fetch league referees');
                    }
                    const referees = refereesResult.data;
                    this.log(`📋 Found ${referees.length} referees in league season ${seasonId}`);
                    // Analyze each referee
                    const analysisPromises = referees.map((refereeData) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const analysis = yield this.analyzeRefereePerformance(refereeData.id, options);
                            return analysis.success ? analysis.data : null;
                        }
                        catch (error) {
                            this.log(`⚠️ Failed to analyze referee ${refereeData.id}: ${error}`, 'warn');
                            return null;
                        }
                    }));
                    const analyses = yield Promise.all(analysisPromises);
                    const validAnalyses = analyses.filter(analysis => analysis !== null);
                    // Calculate rankings
                    this.calculateRefereeRankings(validAnalyses);
                    return { validAnalyses, count: referees.length };
                }));
                // Extract cached flag and create final result
                const { _cached } = computedResult, data = __rest(computedResult, ["_cached"]);
                return this.createAnalyticsResult(data.validAnalyses, 'league_referees_analysis', startTime, data.count, _cached || false);
            }
            catch (error) {
                this.log(`❌ Error analyzing league referees: ${error}`, 'error');
                return this.createErrorResult(`Failed to analyze league referees: ${error instanceof Error ? error.message : String(error)}`, 'league_referees_analysis', startTime);
            }
        });
    }
    /**
     * ⚔️ COMPARE PLAYERS
     * Direct comparison between two players
     */
    comparePlayers(player1Id, player2Id) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = `player_comparison:${player1Id}:${player2Id}`;
            try {
                this.log(`⚔️ Comparing players: ${player1Id} vs ${player2Id}`);
                const computedResult = yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    // Get both players' analyses
                    const [player1Result, player2Result] = yield Promise.all([
                        this.analyzePlayerPerformance(player1Id),
                        this.analyzePlayerPerformance(player2Id)
                    ]);
                    if (!player1Result.success || !player2Result.success) {
                        throw new Error('Failed to fetch player data for comparison');
                    }
                    // Perform comparison
                    const comparison = PlayerAnalyticsHelpers_1.PlayerAnalyticsHelpers.comparePlayers(player1Result.data.performance, player2Result.data.performance);
                    return { comparison, count: 2 };
                }));
                // Extract cached flag and create final result
                const { _cached } = computedResult, data = __rest(computedResult, ["_cached"]);
                return this.createAnalyticsResult(data.comparison, 'player_comparison', startTime, data.count, _cached || false);
            }
            catch (error) {
                this.log(`❌ Error comparing players: ${error}`, 'error');
                return this.createErrorResult(`Failed to compare players: ${error instanceof Error ? error.message : String(error)}`, 'player_comparison', startTime);
            }
        });
    }
    /**
     * 🔧 PRIVATE HELPER METHODS
     */
    generatePlayerInsights(performance) {
        return {
            isTopScorer: performance.goalsPerGame > 0.5,
            isTopAssister: performance.assistsPerGame > 0.3,
            isConsistent: performance.consistency > 70,
            isRisingStar: performance.appearances < 20 && performance.impactRating > 70,
            isVeteran: performance.appearances > 30 && performance.consistency > 70
        };
    }
    generateRefereeInsights(performance) {
        return {
            isStrict: performance.strictnessRating > 70,
            isConsistent: performance.consistency > 70,
            affectsHomeAdvantage: Math.abs(performance.homeWinPercentage - 47.5) > 10,
            isControversial: performance.controversyRating > 50
        };
    }
    calculatePlayerRankings(analyses) {
        // Sort by impact rating for overall ranking
        const sortedByImpact = [...analyses].sort((a, b) => b.performance.impactRating - a.performance.impactRating);
        sortedByImpact.forEach((analysis, index) => {
            analysis.ranking.overallRank = index + 1;
        });
        // Calculate position rankings
        const positionGroups = new Map();
        analyses.forEach(analysis => {
            const position = analysis.player.position || 'Unknown';
            if (!positionGroups.has(position)) {
                positionGroups.set(position, []);
            }
            positionGroups.get(position).push(analysis);
        });
        positionGroups.forEach(positionPlayers => {
            const sortedByPosition = positionPlayers.sort((a, b) => b.performance.impactRating - a.performance.impactRating);
            sortedByPosition.forEach((analysis, index) => {
                analysis.ranking.positionRank = index + 1;
            });
        });
    }
    calculateRefereeRankings(analyses) {
        // Sort by consistency for overall ranking
        const sortedByConsistency = [...analyses].sort((a, b) => b.performance.consistency - a.performance.consistency);
        sortedByConsistency.forEach((analysis, index) => {
            analysis.ranking.overallRank = index + 1;
        });
    }
    generatePlayerComparisons(analyses) {
        const comparisons = [];
        // Generate comparisons between top players
        for (let i = 0; i < Math.min(5, analyses.length); i++) {
            for (let j = i + 1; j < Math.min(5, analyses.length); j++) {
                const comparison = PlayerAnalyticsHelpers_1.PlayerAnalyticsHelpers.comparePlayers(analyses[i].performance, analyses[j].performance);
                comparisons.push(comparison);
            }
        }
        return comparisons;
    }
}
exports.PlayerAnalyticsService = PlayerAnalyticsService;
