"use strict";
/**
 * 🏆 LEAGUE ANALYTICS SERVICE
 *
 * Advanced league analysis and comparison service
 * Utilizes: getLeagues, getLeagueSeason, getLeagueTables, getLeagueMatches endpoints
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
exports.LeagueAnalyticsService = void 0;
const BaseAnalyticsService_1 = require("../core/BaseAnalyticsService");
const AnalyticsUtils_1 = require("../utils/AnalyticsUtils");
const LeagueAnalyticsHelpers_1 = require("../utils/LeagueAnalyticsHelpers");
class LeagueAnalyticsService extends BaseAnalyticsService_1.BaseAnalyticsService {
    /**
     * 📊 ANALYZE LEAGUE SEASON
     * Comprehensive league season analysis
     */
    analyzeLeagueSeason(seasonId_1) {
        return __awaiter(this, arguments, void 0, function* (seasonId, options = {}) {
            const startTime = Date.now();
            const cacheKey = `league_season_analysis:${seasonId}:${JSON.stringify(options)}`;
            try {
                this.log(`📊 Analyzing league season ${seasonId}`);
                const computedResult = yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    // Get league season data
                    const seasonResult = yield this.footyStatsService.getLeagueSeason(seasonId);
                    if (!seasonResult.success || !seasonResult.data) {
                        throw new Error('Failed to fetch league season data');
                    }
                    const league = seasonResult.data;
                    // Get league matches
                    const matchesResult = yield this.footyStatsService.getLeagueMatches(seasonId);
                    if (!matchesResult.success || !matchesResult.data) {
                        throw new Error('Failed to fetch league matches');
                    }
                    const matches = matchesResult.data;
                    // Get league teams
                    const teamsResult = yield this.footyStatsService.getLeagueTeams(seasonId);
                    if (!teamsResult.success || !teamsResult.data) {
                        throw new Error('Failed to fetch league teams');
                    }
                    const teams = teamsResult.data;
                    // Calculate statistics
                    const statistics = LeagueAnalyticsHelpers_1.LeagueAnalyticsHelpers.calculateLeagueStatistics(matches);
                    // Generate table if requested
                    let table;
                    if (options.includeTable) {
                        table = LeagueAnalyticsHelpers_1.LeagueAnalyticsHelpers.generateLeagueTable(matches, teams);
                        if (options.maxTeams) {
                            table = table.slice(0, options.maxTeams);
                        }
                    }
                    // Analyze trends if requested
                    let trends;
                    let topScorers;
                    let bestDefense;
                    if (options.includeTrends || options.includeTopScorers || options.includeBestDefense) {
                        const seasonAnalysis = LeagueAnalyticsHelpers_1.LeagueAnalyticsHelpers.analyzeSeasonTrends(matches, teams, league.season || 'Unknown');
                        if (options.includeTrends) {
                            trends = seasonAnalysis.trends;
                        }
                        if (options.includeTopScorers) {
                            topScorers = seasonAnalysis.topScorers;
                        }
                        if (options.includeBestDefense) {
                            bestDefense = seasonAnalysis.bestDefense;
                        }
                    }
                    // Generate insights
                    const insights = this.generateLeagueInsights(statistics, table);
                    const analysis = {
                        league,
                        statistics,
                        table,
                        topScorers,
                        bestDefense,
                        trends,
                        insights
                    };
                    return { analysis, count: matches.length + teams.length + 1 };
                }));
                // Extract cached flag and create final result
                const { _cached } = computedResult, data = __rest(computedResult, ["_cached"]);
                return this.createAnalyticsResult(data.analysis, 'league_season_analysis', startTime, data.count, _cached || false);
            }
            catch (error) {
                this.log(`❌ Error analyzing league season: ${error}`, 'error');
                return this.createErrorResult(`Failed to analyze league season: ${error instanceof Error ? error.message : String(error)}`, 'league_season_analysis', startTime);
            }
        });
    }
    /**
     * 🏆 GET LEAGUE TABLES
     * Get current league standings with analytics
     */
    getLeagueTablesWithAnalytics(seasonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = `league_tables_analytics:${seasonId}`;
            try {
                this.log(`🏆 Getting league tables with analytics for season ${seasonId}`);
                const computedResult = yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    // Get official league tables
                    const tablesResult = yield this.footyStatsService.getLeagueTables(seasonId);
                    if (!tablesResult.success || !tablesResult.data) {
                        throw new Error('Failed to fetch league tables');
                    }
                    // Get matches for additional analytics
                    const matchesResult = yield this.footyStatsService.getLeagueMatches(seasonId);
                    const teamsResult = yield this.footyStatsService.getLeagueTeams(seasonId);
                    let analyticsTable = [];
                    let analytics = {};
                    if (matchesResult.success && teamsResult.success &&
                        matchesResult.data && teamsResult.data) {
                        // Generate our own table with analytics
                        analyticsTable = LeagueAnalyticsHelpers_1.LeagueAnalyticsHelpers.generateLeagueTable(matchesResult.data, teamsResult.data);
                        // Calculate additional analytics
                        analytics = {
                            statistics: LeagueAnalyticsHelpers_1.LeagueAnalyticsHelpers.calculateLeagueStatistics(matchesResult.data),
                            formTable: this.generateFormTable(analyticsTable),
                            homeAwayTable: this.generateHomeAwayTable(analyticsTable),
                            trends: this.analyzeTableTrends(analyticsTable)
                        };
                    }
                    const result = {
                        table: analyticsTable.length > 0 ? analyticsTable : tablesResult.data,
                        analytics
                    };
                    return { result, count: (((_a = matchesResult.data) === null || _a === void 0 ? void 0 : _a.length) || 0) + (((_b = teamsResult.data) === null || _b === void 0 ? void 0 : _b.length) || 0) };
                }));
                // Extract cached flag and create final result
                const { _cached } = computedResult, data = __rest(computedResult, ["_cached"]);
                return this.createAnalyticsResult(data.result, 'league_tables_analytics', startTime, data.count, _cached || false);
            }
            catch (error) {
                this.log(`❌ Error getting league tables: ${error}`, 'error');
                return this.createErrorResult(`Failed to get league tables: ${error instanceof Error ? error.message : String(error)}`, 'league_tables_analytics', startTime);
            }
        });
    }
    /**
     * ⚔️ COMPARE COMPETITIONS
     * Compare multiple leagues/competitions
     */
    compareCompetitions(seasonIds_1) {
        return __awaiter(this, arguments, void 0, function* (seasonIds, options = {}) {
            const startTime = Date.now();
            const cacheKey = `competition_comparison:${seasonIds.join(',')}:${JSON.stringify(options)}`;
            try {
                this.log(`⚔️ Comparing ${seasonIds.length} competitions`);
                const computedResult = yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    const competitions = [];
                    // Fetch data for each competition
                    for (const seasonId of seasonIds.slice(0, options.maxLeagues || 10)) {
                        try {
                            const [seasonResult, matchesResult, teamsResult] = yield Promise.all([
                                this.footyStatsService.getLeagueSeason(seasonId),
                                this.footyStatsService.getLeagueMatches(seasonId),
                                this.footyStatsService.getLeagueTeams(seasonId)
                            ]);
                            if (seasonResult.success && matchesResult.success && teamsResult.success &&
                                seasonResult.data && matchesResult.data && teamsResult.data) {
                                competitions.push({
                                    leagueId: seasonId.toString(),
                                    leagueName: seasonResult.data.name || `League ${seasonId}`,
                                    matches: matchesResult.data,
                                    teams: teamsResult.data
                                });
                            }
                        }
                        catch (error) {
                            this.log(`⚠️ Failed to fetch data for season ${seasonId}: ${error}`, 'warn');
                        }
                    }
                    if (competitions.length === 0) {
                        throw new Error('No valid competition data found');
                    }
                    // Perform comparison
                    const comparison = LeagueAnalyticsHelpers_1.LeagueAnalyticsHelpers.compareCompetitions(competitions);
                    return { comparison, count: competitions.reduce((sum, comp) => sum + comp.matches.length + comp.teams.length, 0) };
                }));
                // Extract cached flag and create final result
                const { _cached } = computedResult, data = __rest(computedResult, ["_cached"]);
                return this.createAnalyticsResult(data.comparison, 'competition_comparison', startTime, data.count, _cached || false);
            }
            catch (error) {
                this.log(`❌ Error comparing competitions: ${error}`, 'error');
                return this.createErrorResult(`Failed to compare competitions: ${error instanceof Error ? error.message : String(error)}`, 'competition_comparison', startTime);
            }
        });
    }
    /**
     * 📈 ANALYZE LEAGUE TRENDS
     * Analyze trends across multiple seasons
     */
    analyzeLeagueTrends(seasonIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = `league_trends:${seasonIds.join(',')}`;
            try {
                this.log(`📈 Analyzing trends across ${seasonIds.length} seasons`);
                const computedResult = yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    const seasonAnalyses = [];
                    // Analyze each season
                    for (const seasonId of seasonIds) {
                        const analysis = yield this.analyzeLeagueSeason(seasonId, {
                            includeTrends: true,
                            includeTable: false
                        });
                        if (analysis.success && analysis.data) {
                            seasonAnalyses.push({
                                seasonId,
                                season: analysis.data.league.season,
                                statistics: analysis.data.statistics,
                                trends: analysis.data.trends
                            });
                        }
                    }
                    // Calculate multi-season trends
                    const trends = this.calculateMultiSeasonTrends(seasonAnalyses);
                    return { trends, count: seasonAnalyses.length };
                }));
                // Extract cached flag and create final result
                const { _cached } = computedResult, data = __rest(computedResult, ["_cached"]);
                return this.createAnalyticsResult(data.trends, 'league_trends', startTime, data.count, _cached || false);
            }
            catch (error) {
                this.log(`❌ Error analyzing league trends: ${error}`, 'error');
                return this.createErrorResult(`Failed to analyze league trends: ${error instanceof Error ? error.message : String(error)}`, 'league_trends', startTime);
            }
        });
    }
    /**
     * 🔧 PRIVATE HELPER METHODS
     */
    generateLeagueInsights(statistics, table) {
        return {
            mostCompetitive: table ? this.isCompetitive(table) : false,
            highScoring: statistics.averageGoalsPerMatch > 2.8,
            defensive: statistics.averageGoalsPerMatch < 2.2,
            homeAdvantage: Math.round(statistics.homeWinPercentage)
        };
    }
    isCompetitive(table) {
        if (table.length < 4)
            return false;
        const topPoints = table[0].points;
        const fourthPoints = table[3].points;
        const pointGap = topPoints - fourthPoints;
        // Competitive if top 4 are within 15 points
        return pointGap <= 15;
    }
    generateFormTable(table) {
        return table
            .map(team => ({
            position: team.position,
            teamName: team.teamName,
            form: team.form,
            formPoints: this.calculateFormPoints(team.form)
        }))
            .sort((a, b) => b.formPoints - a.formPoints)
            .map((team, index) => (Object.assign(Object.assign({}, team), { formPosition: index + 1 })));
    }
    generateHomeAwayTable(table) {
        return table.map(team => ({
            teamName: team.teamName,
            homeRecord: team.homeRecord,
            awayRecord: team.awayRecord,
            homePoints: (team.homeRecord.won * 3) + team.homeRecord.drawn,
            awayPoints: (team.awayRecord.won * 3) + team.awayRecord.drawn
        }));
    }
    analyzeTableTrends(table) {
        const pointsDistribution = table.map(team => team.points);
        const goalDifferenceDistribution = table.map(team => team.goalDifference);
        return {
            pointsSpread: Math.max(...pointsDistribution) - Math.min(...pointsDistribution),
            averagePoints: AnalyticsUtils_1.AnalyticsUtils.calculateAverage(pointsDistribution),
            competitiveness: AnalyticsUtils_1.AnalyticsUtils.calculateStandardDeviation(pointsDistribution),
            goalDifferenceSpread: Math.max(...goalDifferenceDistribution) - Math.min(...goalDifferenceDistribution)
        };
    }
    calculateFormPoints(form) {
        return form.split('').reduce((points, result) => {
            if (result === 'W')
                return points + 3;
            if (result === 'D')
                return points + 1;
            return points;
        }, 0);
    }
    calculateMultiSeasonTrends(seasonAnalyses) {
        if (seasonAnalyses.length < 2) {
            return { message: 'Need at least 2 seasons for trend analysis' };
        }
        const goalAverages = seasonAnalyses.map(season => season.statistics.averageGoalsPerMatch);
        const homeWinPercentages = seasonAnalyses.map(season => season.statistics.homeWinPercentage);
        const bttsPercentages = seasonAnalyses.map(season => season.statistics.bttsPercentage);
        return {
            goalTrend: AnalyticsUtils_1.AnalyticsUtils.calculateTrend(goalAverages),
            homeAdvantageTrend: AnalyticsUtils_1.AnalyticsUtils.calculateTrend(homeWinPercentages),
            bttsTrend: AnalyticsUtils_1.AnalyticsUtils.calculateTrend(bttsPercentages),
            seasonComparison: seasonAnalyses.map(season => ({
                season: season.season,
                goalsPerGame: season.statistics.averageGoalsPerMatch,
                homeWinRate: season.statistics.homeWinPercentage,
                bttsRate: season.statistics.bttsPercentage
            }))
        };
    }
}
exports.LeagueAnalyticsService = LeagueAnalyticsService;
