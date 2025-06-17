"use strict";
/**
 * 🏟️ MATCH ANALYTICS SERVICE
 *
 * Advanced match analysis and prediction service
 * Utilizes: getMatch, getTodaysMatches, getLeagueMatches endpoints
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
exports.MatchAnalyticsService = void 0;
const BaseAnalyticsService_1 = require("../core/BaseAnalyticsService");
const AnalyticsUtils_1 = require("../utils/AnalyticsUtils");
class MatchAnalyticsService extends BaseAnalyticsService_1.BaseAnalyticsService {
    /**
     * 🎯 PREDICT MATCH OUTCOME
     * Advanced match prediction using multiple data sources
     */
    predictMatch(homeTeamId_1, awayTeamId_1) {
        return __awaiter(this, arguments, void 0, function* (homeTeamId, awayTeamId, options = {}) {
            const startTime = Date.now();
            const cacheKey = `match_prediction:${homeTeamId}:${awayTeamId}:${JSON.stringify(options)}`;
            try {
                this.log(`🎯 Predicting match: Team ${homeTeamId} vs Team ${awayTeamId}`);
                const computedResult = yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    // Get team data
                    const [homeTeamResult, awayTeamResult] = yield Promise.all([
                        this.footyStatsService.getTeam(homeTeamId, true),
                        this.footyStatsService.getTeam(awayTeamId, true)
                    ]);
                    if (!homeTeamResult.success || !awayTeamResult.success) {
                        throw new Error('Failed to fetch team data');
                    }
                    // Get recent form if requested
                    let homeForm = [];
                    let awayForm = [];
                    if (options.includeForm) {
                        const [homeStatsResult, awayStatsResult] = yield Promise.all([
                            this.footyStatsService.getTeamLastXStats(homeTeamId),
                            this.footyStatsService.getTeamLastXStats(awayTeamId)
                        ]);
                        // Extract match data from stats (simplified for this example)
                        homeForm = this.extractMatchesFromStats(homeStatsResult.data);
                        awayForm = this.extractMatchesFromStats(awayStatsResult.data);
                    }
                    // Calculate predictions
                    const predictions = this.calculateMatchPredictions(homeTeamResult.data, awayTeamResult.data, homeForm, awayForm, options);
                    const result = {
                        matchId: 0, // Will be set when actual match is created
                        homeTeam: homeTeamResult.data.name,
                        awayTeam: awayTeamResult.data.name,
                        predictions,
                        confidence: this.calculatePredictionConfidence(homeForm, awayForm, options),
                        factors: this.identifyKeyFactors(homeTeamResult.data, awayTeamResult.data, homeForm, awayForm)
                    };
                    return result;
                }));
                // Extract cached flag and create final result
                const { _cached } = computedResult, data = __rest(computedResult, ["_cached"]);
                return this.createAnalyticsResult(data, 'match_prediction', startTime, 2, // Basic data points
                _cached || false);
            }
            catch (error) {
                this.log(`❌ Error predicting match: ${error}`, 'error');
                return this.createErrorResult(`Failed to predict match: ${error instanceof Error ? error.message : String(error)}`, 'match_prediction', startTime);
            }
        });
    }
    /**
     * 📊 ANALYZE TODAY'S MATCHES
     * Comprehensive analysis of all today's matches
     */
    analyzeTodaysMatches(date) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const targetDate = date || new Date().toISOString().split('T')[0];
            const cacheKey = `todays_matches_analysis:${targetDate}`;
            try {
                this.log(`📊 Analyzing today's matches for ${targetDate}`);
                return yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    // Get today's matches
                    const matchesResult = yield this.footyStatsService.getTodaysMatches(targetDate);
                    if (!matchesResult.success || !matchesResult.data) {
                        throw new Error('Failed to fetch today\'s matches');
                    }
                    const matches = matchesResult.data;
                    this.log(`📋 Found ${matches.length} matches for ${targetDate}`);
                    // Analyze each match
                    const analysisPromises = matches.map((match) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const prediction = yield this.predictMatch(match.homeID, match.awayID, {
                                includeForm: true,
                                formMatches: 5
                            });
                            if (prediction.success && prediction.data) {
                                return Object.assign(Object.assign({}, prediction.data), { matchId: match.id });
                            }
                            return null;
                        }
                        catch (error) {
                            this.log(`⚠️ Failed to analyze match ${match.id}: ${error}`, 'warn');
                            return null;
                        }
                    }));
                    const analyses = yield Promise.all(analysisPromises);
                    const validAnalyses = analyses.filter(analysis => analysis !== null);
                    return this.createAnalyticsResult(validAnalyses, 'todays_matches_analysis', startTime, matches.length);
                }));
            }
            catch (error) {
                this.log(`❌ Error analyzing today's matches: ${error}`, 'error');
                return this.createErrorResult(`Failed to analyze today's matches: ${error instanceof Error ? error.message : String(error)}`, 'todays_matches_analysis', startTime);
            }
        });
    }
    /**
     * ⚡ GET LIVE MATCH INSIGHTS
     * Real-time analysis for ongoing matches
     */
    getLiveMatchInsights(matchId) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = `live_match_insights:${matchId}`;
            try {
                this.log(`⚡ Getting live insights for match ${matchId}`);
                return yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    // Get match details
                    const matchResult = yield this.footyStatsService.getMatch(matchId);
                    if (!matchResult.success || !matchResult.data) {
                        throw new Error('Failed to fetch match data');
                    }
                    const match = matchResult.data;
                    // Calculate live insights
                    const insights = {
                        matchId: match.id,
                        momentum: this.calculateMomentum(match),
                        keyEvents: this.identifyKeyEvents(match),
                        predictions: {
                            nextGoal: this.predictNextGoal(match),
                            finalScore: this.predictFinalScore(match),
                            confidence: this.calculateLiveConfidence(match)
                        }
                    };
                    return this.createAnalyticsResult(insights, 'live_match_insights', startTime, 1);
                }), 60); // Cache for only 1 minute for live data
            }
            catch (error) {
                this.log(`❌ Error getting live match insights: ${error}`, 'error');
                return this.createErrorResult(`Failed to get live match insights: ${error instanceof Error ? error.message : String(error)}`, 'live_match_insights', startTime);
            }
        });
    }
    /**
     * 📈 ANALYZE HISTORICAL MATCH TRENDS
     * Historical analysis for pattern identification
     */
    analyzeHistoricalTrends(teamId, leagueId, dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const cacheKey = `historical_trends:${teamId}:${leagueId}:${dateRange === null || dateRange === void 0 ? void 0 : dateRange.start}:${dateRange === null || dateRange === void 0 ? void 0 : dateRange.end}`;
            try {
                this.log(`📈 Analyzing historical trends`);
                return yield this.getCachedOrCompute(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    // Implementation for historical trend analysis
                    // This would involve fetching league matches and analyzing patterns
                    const trends = {
                        goalTrends: [],
                        formTrends: [],
                        seasonalPatterns: [],
                        venueEffects: []
                    };
                    return this.createAnalyticsResult(trends, 'historical_trends', startTime, 0);
                }));
            }
            catch (error) {
                this.log(`❌ Error analyzing historical trends: ${error}`, 'error');
                return this.createErrorResult(`Failed to analyze historical trends: ${error instanceof Error ? error.message : String(error)}`, 'historical_trends', startTime);
            }
        });
    }
    /**
     * 🔧 PRIVATE HELPER METHODS
     */
    calculateMatchPredictions(homeTeam, awayTeam, homeForm, awayForm, options) {
        // Calculate goal expectancies based on team strength and form
        const homeGoalExpectancy = this.calculateGoalExpectancy(homeTeam, homeForm, true);
        const awayGoalExpectancy = this.calculateGoalExpectancy(awayTeam, awayForm, false);
        // Use Poisson distribution for match outcome probabilities
        const matchProbs = AnalyticsUtils_1.AnalyticsUtils.calculateMatchProbabilities(homeGoalExpectancy, awayGoalExpectancy);
        // Calculate BTTS and Over 2.5 probabilities
        const btts = this.calculateBTTSProbability(homeGoalExpectancy, awayGoalExpectancy);
        const over25 = this.calculateOver25Probability(homeGoalExpectancy, awayGoalExpectancy);
        return {
            homeWin: matchProbs.homeWin,
            draw: matchProbs.draw,
            awayWin: matchProbs.awayWin,
            btts,
            over25
        };
    }
    calculateGoalExpectancy(team, form, isHome) {
        // Base expectancy from team strength (simplified)
        let expectancy = 1.5; // League average
        // Adjust for home advantage
        if (isHome)
            expectancy *= 1.1;
        // Adjust based on recent form
        if (form.length > 0) {
            const recentGoals = form.slice(-5).map(match => {
                const isTeamHome = match.homeID === team.id;
                return isTeamHome ? match.homeGoalCount : match.awayGoalCount;
            });
            const formAverage = AnalyticsUtils_1.AnalyticsUtils.calculateAverage(recentGoals);
            expectancy = (expectancy + formAverage) / 2;
        }
        return Math.max(0.1, expectancy); // Minimum expectancy
    }
    calculateBTTSProbability(homeExpectancy, awayExpectancy) {
        // Probability that both teams score at least 1 goal
        const homeNoGoal = AnalyticsUtils_1.AnalyticsUtils.calculatePoissonProbability(homeExpectancy, 0);
        const awayNoGoal = AnalyticsUtils_1.AnalyticsUtils.calculatePoissonProbability(awayExpectancy, 0);
        const bttsProb = (1 - homeNoGoal) * (1 - awayNoGoal);
        return Math.round(bttsProb * 100 * 100) / 100;
    }
    calculateOver25Probability(homeExpectancy, awayExpectancy) {
        // Probability of more than 2.5 total goals
        let over25Prob = 0;
        for (let homeGoals = 0; homeGoals <= 5; homeGoals++) {
            for (let awayGoals = 0; awayGoals <= 5; awayGoals++) {
                if (homeGoals + awayGoals > 2.5) {
                    const prob = AnalyticsUtils_1.AnalyticsUtils.calculatePoissonProbability(homeExpectancy, homeGoals) *
                        AnalyticsUtils_1.AnalyticsUtils.calculatePoissonProbability(awayExpectancy, awayGoals);
                    over25Prob += prob;
                }
            }
        }
        return Math.round(over25Prob * 100 * 100) / 100;
    }
    calculatePredictionConfidence(homeForm, awayForm, options) {
        let confidence = 50; // Base confidence
        // Increase confidence based on available data
        if (homeForm.length >= 5)
            confidence += 10;
        if (awayForm.length >= 5)
            confidence += 10;
        if (options.includeH2H)
            confidence += 15;
        if (options.includeVenue)
            confidence += 10;
        return Math.min(95, confidence); // Cap at 95%
    }
    identifyKeyFactors(homeTeam, awayTeam, homeForm, awayForm) {
        const factors = [];
        // Add factors based on analysis
        if (homeForm.length > 0) {
            const homeFormString = AnalyticsUtils_1.AnalyticsUtils.calculateTeamForm(homeForm, homeTeam.id, 5);
            factors.push(`Home team form: ${homeFormString}`);
        }
        if (awayForm.length > 0) {
            const awayFormString = AnalyticsUtils_1.AnalyticsUtils.calculateTeamForm(awayForm, awayTeam.id, 5);
            factors.push(`Away team form: ${awayFormString}`);
        }
        factors.push('Home advantage considered');
        factors.push('Goal expectancy calculated');
        return factors;
    }
    extractMatchesFromStats(statsData) {
        // This would extract match data from team stats
        // Implementation depends on the actual stats data structure
        return [];
    }
    calculateMomentum(match) {
        // Analyze current match state to determine momentum
        // This is simplified - would need more detailed match data
        if (match.homeGoalCount > match.awayGoalCount)
            return 'home';
        if (match.awayGoalCount > match.homeGoalCount)
            return 'away';
        return 'neutral';
    }
    identifyKeyEvents(match) {
        const events = [];
        if (match.homeGoalCount > 0)
            events.push(`${match.homeGoalCount} home goals`);
        if (match.awayGoalCount > 0)
            events.push(`${match.awayGoalCount} away goals`);
        if (match.team_a_red_cards && match.team_a_red_cards > 0)
            events.push(`${match.team_a_red_cards} home red cards`);
        if (match.team_b_red_cards && match.team_b_red_cards > 0)
            events.push(`${match.team_b_red_cards} away red cards`);
        return events;
    }
    predictNextGoal(match) {
        // Simplified next goal prediction
        if (match.homeGoalCount > match.awayGoalCount)
            return 'home';
        if (match.awayGoalCount > match.homeGoalCount)
            return 'away';
        return 'none';
    }
    predictFinalScore(match) {
        // Simplified final score prediction
        return {
            home: match.homeGoalCount + 1,
            away: match.awayGoalCount
        };
    }
    calculateLiveConfidence(match) {
        // Calculate confidence based on match progress and current state
        return 75; // Simplified
    }
}
exports.MatchAnalyticsService = MatchAnalyticsService;
