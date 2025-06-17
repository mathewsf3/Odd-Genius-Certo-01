"use strict";
/**
 * 👥 TEAM ANALYTICS SERVICE
 *
 * Advanced team analysis and comparison service
 * Utilizes: getTeam, getTeamLastXStats, getLeagueTeams endpoints
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
exports.TeamAnalyticsService = void 0;
const BaseAnalyticsService_1 = require("../core/BaseAnalyticsService");
const AnalyticsUtils_1 = require("../utils/AnalyticsUtils");
const TeamAnalyticsHelpers_1 = require("../utils/TeamAnalyticsHelpers");
class TeamAnalyticsService extends BaseAnalyticsService_1.BaseAnalyticsService {
    /**
     * 📊 ANALYZE TEAM PERFORMANCE
     * Comprehensive team performance analysis
     */
    analyzeTeamPerformance(teamId_1) {
        return __awaiter(this, arguments, void 0, function* (teamId, options = {}) {
            const startTime = Date.now();
            const cacheKey = `team_analysis:${teamId}:${JSON.stringify(options)}`;
            try {
                this.log(`📊 Analyzing team performance for team ${teamId}`);
                const computedResult = yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    // Get team data
                    const teamResult = yield this.footyStatsService.getTeam(teamId, true);
                    if (!teamResult.success || !teamResult.data) {
                        throw new Error('Failed to fetch team data');
                    }
                    const team = teamResult.data;
                    // Get team's recent stats for form analysis
                    let recentMatches = [];
                    if (options.includeForm) {
                        const statsResult = yield this.footyStatsService.getTeamLastXStats(teamId);
                        if (statsResult.success && statsResult.data) {
                            recentMatches = this.extractMatchesFromStats(statsResult.data);
                        }
                    }
                    // Calculate performance metrics
                    const performance = TeamAnalyticsHelpers_1.TeamAnalyticsHelpers.calculatePerformanceMetrics(recentMatches, teamId);
                    // Analyze form
                    const form = options.includeForm
                        ? TeamAnalyticsHelpers_1.TeamAnalyticsHelpers.analyzeTeamForm(recentMatches, teamId, options.formMatches || 5)
                        : TeamAnalyticsHelpers_1.TeamAnalyticsHelpers.analyzeTeamForm([], teamId);
                    // Calculate home/away performance
                    const homeAwayPerformance = options.includeHomeAway
                        ? TeamAnalyticsHelpers_1.TeamAnalyticsHelpers.calculateHomeAwayPerformance(recentMatches, teamId)
                        : { home: performance, away: performance };
                    // Calculate strength rating
                    const strengthRating = options.includeStrengthRating
                        ? TeamAnalyticsHelpers_1.TeamAnalyticsHelpers.calculateTeamStrength(performance, form)
                        : 0;
                    // Analyze trends
                    const trends = this.analyzeTrends(recentMatches, teamId);
                    const analysis = {
                        team,
                        performance,
                        form,
                        homeAwayPerformance,
                        strengthRating,
                        trends
                    };
                    return analysis;
                }));
                // Extract cached flag and create final result
                const { _cached } = computedResult, data = __rest(computedResult, ["_cached"]);
                return this.createAnalyticsResult(data, 'team_performance_analysis', startTime, 1, // Basic data points
                _cached || false);
            }
            catch (error) {
                this.log(`❌ Error analyzing team performance: ${error}`, 'error');
                return this.createErrorResult(`Failed to analyze team performance: ${error instanceof Error ? error.message : String(error)}`, 'team_performance_analysis', startTime);
            }
        });
    }
    /**
     * ⚔️ COMPARE TWO TEAMS
     * Head-to-head team comparison with predictions
     */
    compareTeams(homeTeamId_1, awayTeamId_1) {
        return __awaiter(this, arguments, void 0, function* (homeTeamId, awayTeamId, options = {}) {
            const startTime = Date.now();
            const cacheKey = `team_comparison:${homeTeamId}:${awayTeamId}:${JSON.stringify(options)}`;
            try {
                this.log(`⚔️ Comparing teams: ${homeTeamId} vs ${awayTeamId}`);
                const computedResult = yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    // Get both teams' data
                    const [homeTeamResult, awayTeamResult] = yield Promise.all([
                        this.footyStatsService.getTeam(homeTeamId, true),
                        this.footyStatsService.getTeam(awayTeamId, true)
                    ]);
                    if (!homeTeamResult.success || !awayTeamResult.success) {
                        throw new Error('Failed to fetch team data');
                    }
                    // Get recent matches for both teams
                    let homeMatches = [];
                    let awayMatches = [];
                    let allMatches = [];
                    if (options.includeForm) {
                        const [homeStatsResult, awayStatsResult] = yield Promise.all([
                            this.footyStatsService.getTeamLastXStats(homeTeamId),
                            this.footyStatsService.getTeamLastXStats(awayTeamId)
                        ]);
                        if (homeStatsResult.success) {
                            homeMatches = this.extractMatchesFromStats(homeStatsResult.data);
                        }
                        if (awayStatsResult.success) {
                            awayMatches = this.extractMatchesFromStats(awayStatsResult.data);
                        }
                        allMatches = [...homeMatches, ...awayMatches];
                    }
                    // Get head-to-head matches if requested
                    let h2hMatches = [];
                    if (options.includeH2H) {
                        // In a real implementation, you would fetch H2H matches
                        // For now, we'll filter from available matches
                        h2hMatches = allMatches.filter(match => (match.homeID === homeTeamId && match.awayID === awayTeamId) ||
                            (match.homeID === awayTeamId && match.awayID === homeTeamId));
                    }
                    // Perform comparison
                    const comparison = TeamAnalyticsHelpers_1.TeamAnalyticsHelpers.compareTeams(allMatches, homeTeamId, awayTeamId, h2hMatches.length > 0 ? h2hMatches : undefined);
                    return comparison;
                }));
                // Extract cached flag and create final result
                const { _cached } = computedResult, data = __rest(computedResult, ["_cached"]);
                return this.createAnalyticsResult(data, 'team_comparison', startTime, 1, // Basic data points
                _cached || false);
            }
            catch (error) {
                this.log(`❌ Error comparing teams: ${error}`, 'error');
                return this.createErrorResult(`Failed to compare teams: ${error instanceof Error ? error.message : String(error)}`, 'team_comparison', startTime);
            }
        });
    }
    /**
     * 🏆 ANALYZE LEAGUE TEAMS
     * Analyze all teams in a league season
     */
    analyzeLeagueTeams(seasonId_1) {
        return __awaiter(this, arguments, void 0, function* (seasonId, options = {}) {
            const startTime = Date.now();
            const cacheKey = `league_teams_analysis:${seasonId}:${JSON.stringify(options)}`;
            try {
                this.log(`🏆 Analyzing teams in league season ${seasonId}`);
                const computedResult = yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    // Get all teams in the league
                    const teamsResult = yield this.footyStatsService.getLeagueTeams(seasonId, {
                        includeStats: true
                    });
                    if (!teamsResult.success || !teamsResult.data) {
                        throw new Error('Failed to fetch league teams');
                    }
                    const teams = teamsResult.data;
                    this.log(`📋 Found ${teams.length} teams in league season ${seasonId}`);
                    // Analyze each team
                    const analysisPromises = teams.map((team) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const analysis = yield this.analyzeTeamPerformance(team.id, options);
                            return analysis.success ? analysis.data : null;
                        }
                        catch (error) {
                            this.log(`⚠️ Failed to analyze team ${team.id}: ${error}`, 'warn');
                            return null;
                        }
                    }));
                    const analyses = yield Promise.all(analysisPromises);
                    const validAnalyses = analyses.filter(analysis => analysis !== null);
                    return validAnalyses;
                }));
                // Extract cached flag and create final result
                const { _cached } = computedResult, data = __rest(computedResult, ["_cached"]);
                return this.createAnalyticsResult(data, 'league_teams_analysis', startTime, 1, // Basic data points
                _cached || false);
            }
            catch (error) {
                this.log(`❌ Error analyzing league teams: ${error}`, 'error');
                return this.createErrorResult(`Failed to analyze league teams: ${error instanceof Error ? error.message : String(error)}`, 'league_teams_analysis', startTime);
            }
        });
    }
    /**
     * 📈 GET TEAM FORM TRENDS
     * Analyze team form trends over time
     */
    getTeamFormTrends(teamId_1) {
        return __awaiter(this, arguments, void 0, function* (teamId, matchCount = 10) {
            const startTime = Date.now();
            const cacheKey = `team_form_trends:${teamId}:${matchCount}`;
            try {
                this.log(`📈 Getting form trends for team ${teamId}`);
                const computedResult = yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    // Get team's recent matches
                    const statsResult = yield this.footyStatsService.getTeamLastXStats(teamId);
                    if (!statsResult.success || !statsResult.data) {
                        throw new Error('Failed to fetch team stats');
                    }
                    const matches = this.extractMatchesFromStats(statsResult.data);
                    const recentMatches = matches.slice(-matchCount);
                    // Analyze form trends
                    const formTrends = this.analyzeFormTrends(recentMatches, teamId);
                    return formTrends;
                }));
                // Extract cached flag and create final result
                const { _cached } = computedResult, data = __rest(computedResult, ["_cached"]);
                return this.createAnalyticsResult(data, 'team_form_trends', startTime, 1, // Basic data points
                _cached || false);
            }
            catch (error) {
                this.log(`❌ Error getting team form trends: ${error}`, 'error');
                return this.createErrorResult(`Failed to get team form trends: ${error instanceof Error ? error.message : String(error)}`, 'team_form_trends', startTime);
            }
        });
    }
    /**
     * 🔧 PRIVATE HELPER METHODS
     */
    extractMatchesFromStats(statsData) {
        // This would extract match data from team stats
        // Implementation depends on the actual stats data structure
        // For now, return empty array - would be implemented based on real API response
        return [];
    }
    analyzeTrends(matches, teamId) {
        if (matches.length < 5) {
            return {
                goalScoring: 'stable',
                defending: 'stable',
                overall: 'stable'
            };
        }
        // Analyze goal scoring trend
        const goalsByMatch = matches.map(match => {
            const isHome = match.homeID === teamId;
            return isHome ? match.homeGoalCount : match.awayGoalCount;
        });
        // Analyze defending trend (goals conceded)
        const goalsConcededByMatch = matches.map(match => {
            const isHome = match.homeID === teamId;
            return isHome ? match.awayGoalCount : match.homeGoalCount;
        });
        // Calculate trends
        const goalScoringTrend = AnalyticsUtils_1.AnalyticsUtils.calculateTrend(goalsByMatch);
        const defendingTrend = AnalyticsUtils_1.AnalyticsUtils.calculateTrend(goalsConcededByMatch.map(g => -g)); // Invert for defending
        // Overall trend based on goal difference
        const goalDifferenceByMatch = goalsByMatch.map((goals, index) => goals - goalsConcededByMatch[index]);
        const overallTrend = AnalyticsUtils_1.AnalyticsUtils.calculateTrend(goalDifferenceByMatch);
        return {
            goalScoring: goalScoringTrend,
            defending: defendingTrend,
            overall: overallTrend
        };
    }
    analyzeFormTrends(matches, teamId) {
        const formAnalysis = TeamAnalyticsHelpers_1.TeamAnalyticsHelpers.analyzeTeamForm(matches, teamId);
        const performance = TeamAnalyticsHelpers_1.TeamAnalyticsHelpers.calculatePerformanceMetrics(matches, teamId);
        return {
            form: formAnalysis,
            performance,
            trends: this.analyzeTrends(matches, teamId),
            strengthRating: TeamAnalyticsHelpers_1.TeamAnalyticsHelpers.calculateTeamStrength(performance, formAnalysis)
        };
    }
}
exports.TeamAnalyticsService = TeamAnalyticsService;
