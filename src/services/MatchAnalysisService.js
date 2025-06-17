"use strict";
/**
 * 🎯 SIMPLE MATCH ANALYSIS SERVICE - STRESS TEST VERSION
 *
 * This service tests our foundation by:
 * 1. Getting today's matches
 * 2. Selecting a match for detailed analysis
 * 3. Getting comprehensive match data
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchAnalysisService = exports.MatchAnalysisService = void 0;
const footy_1 = require("../apis/footy");
const { DefaultService } = footy_1;
const API_KEY = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756';
class MatchAnalysisService {
    constructor() {
        console.log('🔧 MatchAnalysisService initialized');
        // ✅ CACHE: Store today's matches to avoid redundant API calls
        this.todaysMatchesCache = new Map(); // date -> response
        this.cacheTimestamps = new Map(); // date -> timestamp
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
    }

    /**
     * ✅ OPTIMIZED: Get today's matches with intelligent caching
     * This prevents multiple redundant API calls
     */
    async getTodaysMatchesOptimized(date) {
        const today = date || new Date().toISOString().split('T')[0];
        const now = Date.now();

        // Check if we have valid cached data
        const cachedData = this.todaysMatchesCache.get(today);
        const cacheTime = this.cacheTimestamps.get(today);

        if (cachedData && cacheTime && (now - cacheTime) < this.CACHE_DURATION) {
            console.log(`📦 Using cached matches for ${today}`);
            return cachedData;
        }

        try {
            console.log(`🔍 Fetching fresh matches for: ${today}`);
            const response = await DefaultService.getTodaysMatches(
                API_KEY,
                undefined, // timezone
                today,
                1 // page
            );

            // Cache the response
            this.todaysMatchesCache.set(today, response);
            this.cacheTimestamps.set(today, now);

            console.log(`✅ Cached ${response?.data?.length || 0} matches for ${today}`);
            return response;

        } catch (error) {
            console.error(`❌ Error fetching matches for ${today}:`, error);
            // Return cached data if available, even if expired
            if (cachedData) {
                console.log(`📦 Returning expired cache for ${today} due to API error`);
                return cachedData;
            }
            throw error;
        }
    }

    /**
     * Get upcoming matches from FootyStats API
     * ✅ OPTIMIZED: Uses shared cache to reduce API calls
     */
    getUpcomingMatches() {
        return __awaiter(this, arguments, void 0, function* (limit = 6) {
            try {
                console.log(`🔍 Getting ${limit} upcoming matches from all leagues...`);

                const currentTime = Math.floor(Date.now() / 1000);
                let allUpcomingMatches = [];

                // Get matches for the next 3 days to ensure we have enough upcoming matches
                for (let dayOffset = 1; dayOffset <= 3; dayOffset++) {
                    const futureDate = new Date();
                    futureDate.setDate(futureDate.getDate() + dayOffset);
                    const dateString = futureDate.toISOString().split('T')[0];

                    console.log(`📅 Fetching matches for: ${dateString}`);

                    try {
                        // ✅ OPTIMIZED: Use cached method instead of direct API call
                        const dayMatches = yield this.getTodaysMatchesOptimized(dateString);

                        if (dayMatches && dayMatches.data && Array.isArray(dayMatches.data)) {
                            const matches = dayMatches.data.filter((match) => {
                                const matchTime = match.date_unix || 0;
                                return matchTime > currentTime; // Only future matches
                            });

                            allUpcomingMatches.push(...matches);
                            console.log(`📊 Found ${matches.length} upcoming matches for ${dateString}`);
                        }
                    } catch (dayError) {
                        console.warn(`⚠️ Could not get matches for ${dateString}:`, dayError.message);
                    }

                    // If we have enough matches, break early
                    if (allUpcomingMatches.length >= limit * 2) {
                        break;
                    }
                }

                // Sort by date and take the requested limit
                const sortedMatches = allUpcomingMatches
                    .sort((a, b) => (a.date_unix || 0) - (b.date_unix || 0))
                    .slice(0, limit);

                console.log(`🎯 Returning ${sortedMatches.length} upcoming matches from all leagues`);
                return sortedMatches;
            }
            catch (error) {
                console.error('❌ Error in getUpcomingMatches:', error);
                return [];
            }
        });
    }
    /**
     * Get live matches from FootyStats API
     * ✅ FIXED: No default limit - let caller decide (dashboard=6, live page=all)
     */
    getLiveMatches() {
        return __awaiter(this, arguments, void 0, function* (limit) {
            try {
                console.log(`🔍 Getting ${limit ? `${limit} live matches` : 'ALL live matches'}...`);
                // ✅ OPTIMIZED: Use cached method instead of direct API call
                const today = new Date().toISOString().split('T')[0];
                const todaysMatches = yield this.getTodaysMatchesOptimized(today);

                console.log('✅ Got response from cached getTodaysMatches for live filtering');
                if (!todaysMatches || !todaysMatches.data) {
                    console.log('❌ No live matches data returned');
                    return [];
                }
                const matches = Array.isArray(todaysMatches.data) ? todaysMatches.data : [];
                console.log(`📊 Found ${matches.length} total today's matches`);

                // Filter for live/in-progress matches
                const currentTime = Math.floor(Date.now() / 1000);
                const liveMatches = matches.filter((match) => {
                    var _a;
                    const status = ((_a = match.status) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
                    const matchTime = match.date_unix || 0;

                    // ✅ FIXED: Match is live if:
                    // 1. Status is incomplete (not finished)
                    // 2. Match has started (matchTime <= currentTime)
                    const matchStarted = matchTime <= currentTime;
                    const isLive = status === 'incomplete' && matchStarted;

                    if (isLive) {
                        console.log(`🔴 Found live match: ${match.home_name || match.homeID} vs ${match.away_name || match.awayID}, started ${Math.floor((currentTime - matchTime) / 60)} minutes ago`);
                    }

                    return isLive;
                });

                // ✅ FIXED: Apply limit only if specified (dashboard=6, live page=all)
                const resultMatches = limit ? liveMatches.slice(0, limit) : liveMatches;
                console.log(`🎯 Filtered to ${resultMatches.length} live matches${limit ? ` (limited from ${liveMatches.length} total)` : ' (all matches)'}`);
                return resultMatches;
            }
            catch (error) {
                console.error('❌ Error in getLiveMatches:', error);
                return [];
            }
        });
    }
    /**
     * Get total count of matches for a specific date without loading all data
     * Optimized for dashboard statistics display
     */
    getTotalMatchCount(date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const today = date || new Date().toISOString().split('T')[0];
                console.log(`📊 Getting total match count for: ${today}`);
                // ✅ OPTIMIZED: Use cached method instead of direct API call
                const response = yield this.getTodaysMatchesOptimized(today);

                if (response === null || response === void 0 ? void 0 : response.pager.total_results) {
                    console.log(`📊 Total matches available in API: ${response.pager.total_results}`);
                    return {
                        success: true,
                        totalMatches: response.pager.total_results
                    };
                }
                console.log('⚠️ No pager information available');
                return { success: false, totalMatches: 0 };
            }
            catch (error) {
                console.error('❌ Error getting total match count:', error);
                return { success: false, totalMatches: 0 };
            }
        });
    }
    /**
     * Get count of upcoming matches in the next 24 hours
     * Optimized for dashboard statistics display
     */
    getUpcomingMatchesCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('📊 Getting upcoming matches count for next 24 hours...');
                const currentTime = Math.floor(Date.now() / 1000);
                const next24Hours = currentTime + (24 * 60 * 60); // 24 hours from now

                let totalUpcoming = 0;
                let totalIn24h = 0;

                // Check today and tomorrow for upcoming matches
                for (let dayOffset = 0; dayOffset <= 1; dayOffset++) {
                    const checkDate = new Date();
                    checkDate.setDate(checkDate.getDate() + dayOffset);
                    const dateString = checkDate.toISOString().split('T')[0];

                    try {
                        // ✅ OPTIMIZED: Use cached method instead of direct API call
                        const response = yield this.getTodaysMatchesOptimized(dateString);

                        if (response?.data && Array.isArray(response.data)) {
                            const dayMatches = response.data.filter((match) => {
                                const matchTime = match.date_unix || 0;
                                const isUpcoming = matchTime > currentTime;
                                const isIn24h = matchTime <= next24Hours;

                                if (isUpcoming) {
                                    totalUpcoming++;
                                    if (isIn24h) {
                                        totalIn24h++;
                                    }
                                }

                                return isUpcoming;
                            });

                            console.log(`📅 ${dateString}: ${dayMatches.length} upcoming matches`);
                        }
                    } catch (error) {
                        console.warn(`⚠️ Could not get matches for ${dateString}:`, error);
                    }
                }

                console.log(`📊 Total upcoming: ${totalUpcoming}, In 24h: ${totalIn24h}`);

                return {
                    success: true,
                    totalUpcoming,
                    totalIn24h
                };
            }
            catch (error) {
                console.error('❌ Error getting upcoming matches count:', error);
                return {
                    success: false,
                    totalUpcoming: 0,
                    totalIn24h: 0
                };
            }
        });
    }
    /**
     * Step 1: Get basic match information from today's matches
     */
    getBasicMatchInfo(date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔍 Getting today\'s matches...');
                const today = date || new Date().toISOString().split('T')[0];
                console.log(`📅 Looking for matches on: ${today}`);
                const todaysMatches = yield footy_1.DefaultService.getTodaysMatches(API_KEY, undefined, // timezone
                today, // date
                1 // page
                );
                console.log('✅ Got response from getTodaysMatches');
                console.log('Response data:', JSON.stringify(todaysMatches, null, 2));
                if (!todaysMatches || !todaysMatches.data) {
                    return {
                        success: false,
                        error: 'No matches data returned'
                    };
                }
                const matches = Array.isArray(todaysMatches.data) ? todaysMatches.data : [];
                console.log(`📊 Found ${matches.length} matches`);
                if (matches.length === 0) {
                    return {
                        success: true,
                        totalMatches: 0,
                        error: 'No matches found for today'
                    };
                }
                // Select the first match for analysis
                const selectedMatch = matches[0];
                console.log(`🎯 Selected match:`, selectedMatch);
                return {
                    success: true,
                    selectedMatch,
                    totalMatches: matches.length
                };
            }
            catch (error) {
                console.error('❌ Error in getBasicMatchInfo:', error);
                return {
                    success: false,
                    error: `Failed to get basic match info: ${error instanceof Error ? error.message : String(error)}`
                };
            }
        });
    }
    /**
     * Step 2: Get detailed match analysis
     */
    getDetailedMatchInfo(matchId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`🔍 Getting detailed info for match ID: ${matchId}`);
                // Get match details
                const matchDetails = yield footy_1.DefaultService.getMatch(matchId, API_KEY);
                console.log('✅ Got match details');
                // For now, return basic structure - we can expand this later
                return {
                    success: true,
                    data: {
                        matchDetails,
                        homeTeam: null, // We'll add this later
                        awayTeam: null, // We'll add this later
                        analysisTimestamp: new Date().toISOString()
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in getDetailedMatchInfo:', error);
                return {
                    success: false,
                    error: `Failed to get detailed match info: ${error instanceof Error ? error.message : String(error)}`
                };
            }
        });
    }
    /**
     * Step 3: Comprehensive Match Analysis
     * This is the main method that provides detailed football analytics
     */
    getMatchAnalysis(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`🎯 Starting comprehensive analysis for match ID: ${options.matchId}`);
                // Step 1: Get basic match details
                const matchDetails = yield footy_1.DefaultService.getMatch(options.matchId, API_KEY);
                console.log('✅ Retrieved match details');
                if (!(matchDetails === null || matchDetails === void 0 ? void 0 : matchDetails.data)) {
                    return {
                        success: false,
                        error: 'Failed to retrieve match details',
                        metadata: {
                            totalMatchesToday: 0,
                            analysisTimestamp: new Date().toISOString(),
                            dataSource: 'footystats-api'
                        }
                    };
                }
                const match = matchDetails.data; // Type assertion for match object
                console.log(`📊 Analyzing: ${match.homeID} vs ${match.awayID}`);
                // Step 2: Get team statistics if requested
                let homeTeamData = { info: null, lastXMatches: null };
                let awayTeamData = { info: null, lastXMatches: null };
                if (options.includeTeamStats) {
                    try {
                        console.log('📈 Fetching team statistics...');
                        // Get team info and recent form
                        const [homeTeamInfo, awayTeamInfo] = yield Promise.all([
                            footy_1.DefaultService.getTeam(match.homeID, API_KEY).catch(e => {
                                console.warn(`⚠️ Could not get home team ${match.homeID}:`, e.message);
                                return null;
                            }),
                            footy_1.DefaultService.getTeam(match.awayID, API_KEY).catch(e => {
                                console.warn(`⚠️ Could not get away team ${match.awayID}:`, e.message);
                                return null;
                            })
                        ]);
                        // Get recent form data
                        const [homeRecentStats, awayRecentStats] = yield Promise.all([
                            footy_1.DefaultService.getTeamLastXStats(match.homeID, API_KEY).catch(e => {
                                console.warn(`⚠️ Could not get home team stats for ${match.homeID}:`, e.message);
                                return null;
                            }),
                            footy_1.DefaultService.getTeamLastXStats(match.awayID, API_KEY).catch(e => {
                                console.warn(`⚠️ Could not get away team stats for ${match.awayID}:`, e.message);
                                return null;
                            })
                        ]);
                        homeTeamData = {
                            info: (homeTeamInfo === null || homeTeamInfo === void 0 ? void 0 : homeTeamInfo.data) || null,
                            lastXMatches: (homeRecentStats === null || homeRecentStats === void 0 ? void 0 : homeRecentStats.data) || null
                        };
                        awayTeamData = {
                            info: (awayTeamInfo === null || awayTeamInfo === void 0 ? void 0 : awayTeamInfo.data) || null,
                            lastXMatches: (awayRecentStats === null || awayRecentStats === void 0 ? void 0 : awayRecentStats.data) || null
                        };
                        console.log('✅ Team statistics retrieved');
                    }
                    catch (error) {
                        console.warn('⚠️ Some team statistics could not be retrieved:', error);
                    }
                }
                // Step 3: Get referee stats if requested
                let refereeData = null;
                if (options.includeRefereeStats && match.refereeID) {
                    try {
                        console.log('👨‍⚖️ Fetching referee statistics...');
                        const refereeStats = yield footy_1.DefaultService.getRefereeStats(match.refereeID, API_KEY);
                        refereeData = (refereeStats === null || refereeStats === void 0 ? void 0 : refereeStats.data) || null;
                        console.log('✅ Referee statistics retrieved');
                    }
                    catch (error) {
                        console.warn('⚠️ Referee statistics could not be retrieved:', error);
                    }
                }
                // Step 4: Calculate analytics based on available data
                const analytics = this.calculateMatchAnalytics(match, homeTeamData, awayTeamData, refereeData);
                // Step 5: Get total matches for metadata
                let totalMatchesToday = 0;
                try {
                    const todaysMatches = yield footy_1.DefaultService.getTodaysMatches(API_KEY, undefined, new Date().toISOString().split('T')[0], 1);
                    totalMatchesToday = Array.isArray(todaysMatches === null || todaysMatches === void 0 ? void 0 : todaysMatches.data) ? todaysMatches.data.length : 0;
                }
                catch (error) {
                    console.warn('⚠️ Could not get today\'s matches count:', error);
                }
                console.log('🎉 Comprehensive analysis completed successfully!');
                return {
                    success: true,
                    data: {
                        selectedMatch: match,
                        analytics,
                        homeTeam: homeTeamData,
                        awayTeam: awayTeamData,
                        referee: refereeData
                    },
                    metadata: {
                        totalMatchesToday,
                        analysisTimestamp: new Date().toISOString(),
                        dataSource: 'footystats-api'
                    }
                };
            }
            catch (error) {
                console.error('❌ Error in comprehensive match analysis:', error);
                return {
                    success: false,
                    error: `Comprehensive analysis failed: ${error instanceof Error ? error.message : String(error)}`,
                    metadata: {
                        totalMatchesToday: 0,
                        analysisTimestamp: new Date().toISOString(),
                        dataSource: 'footystats-api'
                    }
                };
            }
        });
    }
    /**
     * Calculate match analytics based on available data
     */
    calculateMatchAnalytics(match, homeTeam, awayTeam, referee) {
        console.log('🧮 Calculating match analytics with real data...');
        // Calculate real analytics based on actual data
        const analytics = this.calculateRealAnalytics(match, homeTeam, awayTeam, referee);
        // Enhanced analytics if team data is available
        if (homeTeam.lastXMatches && awayTeam.lastXMatches) {
            console.log('📊 Enhancing analytics with team statistics...');
            // Calculate more accurate predictions based on recent form
            // This is a simplified calculation - in production, you'd use more sophisticated models
            try {
                const homeAvgGoals = this.calculateAverageGoals(homeTeam.lastXMatches, 'home');
                const awayAvgGoals = this.calculateAverageGoals(awayTeam.lastXMatches, 'away');
                analytics.goals.expectedGoals = homeAvgGoals + awayAvgGoals;
                analytics.goals.over25Probability = analytics.goals.expectedGoals > 2.5 ? 0.65 : 0.35;
                analytics.goals.bttsLikelihood = (homeAvgGoals > 0.8 && awayAvgGoals > 0.8) ? 0.60 : 0.40;
                console.log(`📈 Enhanced predictions: Expected goals: ${analytics.goals.expectedGoals.toFixed(2)}`);
            }
            catch (error) {
                console.warn('⚠️ Could not enhance analytics with team data:', error);
            }
        }
        // Enhanced analytics if referee data is available
        if (referee) {
            console.log('👨‍⚖️ Enhancing analytics with referee statistics...');
            // Adjust card predictions based on referee tendencies
            // This would be more sophisticated in production
            analytics.cards.totalExpected = analytics.cards.totalExpected * 1.1; // Slight adjustment
        }
        return analytics;
    }
    /**
     * Calculate real analytics using actual FootyStats data
     */
    calculateRealAnalytics(match, homeTeam, awayTeam, referee) {
        console.log('📊 Calculating real analytics from FootyStats data...');
        // Initialize analytics with real data calculations
        const analytics = {
            corners: this.calculateRealCornerAnalytics(match, homeTeam, awayTeam),
            cards: this.calculateRealCardAnalytics(match, homeTeam, awayTeam, referee),
            goals: this.calculateRealGoalAnalytics(match, homeTeam, awayTeam)
        };
        console.log('✅ Real analytics calculated successfully');
        return analytics;
    }
    /**
     * Calculate real corner analytics from team data
     */
    calculateRealCornerAnalytics(match, homeTeam, awayTeam) {
        // Use actual match data if available
        if ((match === null || match === void 0 ? void 0 : match.team_a_corners) !== undefined && (match === null || match === void 0 ? void 0 : match.team_b_corners) !== undefined) {
            return {
                totalExpected: match.team_a_corners + match.team_b_corners,
                homeExpected: match.team_a_corners,
                awayExpected: match.team_b_corners
            };
        }
        // Calculate from team statistics if available
        let homeExpected = 5.5; // Default
        let awayExpected = 5.0; // Default
        if ((homeTeam === null || homeTeam === void 0 ? void 0 : homeTeam.lastXMatches) && Array.isArray(homeTeam.lastXMatches)) {
            homeExpected = this.calculateAverageCorners(homeTeam.lastXMatches, 'home');
        }
        if ((awayTeam === null || awayTeam === void 0 ? void 0 : awayTeam.lastXMatches) && Array.isArray(awayTeam.lastXMatches)) {
            awayExpected = this.calculateAverageCorners(awayTeam.lastXMatches, 'away');
        }
        return {
            totalExpected: homeExpected + awayExpected,
            homeExpected,
            awayExpected
        };
    }
    /**
     * Calculate real card analytics from team and referee data
     */
    calculateRealCardAnalytics(match, homeTeam, awayTeam, referee) {
        // Use actual match data if available
        if ((match === null || match === void 0 ? void 0 : match.team_a_cards_num) !== undefined && (match === null || match === void 0 ? void 0 : match.team_b_cards_num) !== undefined) {
            const totalCards = match.team_a_cards_num + match.team_b_cards_num;
            return {
                totalExpected: totalCards,
                yellowExpected: totalCards * 0.9, // Estimate 90% yellow cards
                redExpected: totalCards * 0.1 // Estimate 10% red cards
            };
        }
        // Calculate from team and referee statistics
        let baseCards = 4.0;
        // Adjust based on referee tendencies if available
        if (referee === null || referee === void 0 ? void 0 : referee.average_cards_per_game) {
            baseCards = referee.average_cards_per_game;
        }
        // Adjust based on team discipline if available
        if ((homeTeam === null || homeTeam === void 0 ? void 0 : homeTeam.disciplinaryRecord) && (awayTeam === null || awayTeam === void 0 ? void 0 : awayTeam.disciplinaryRecord)) {
            const teamAdjustment = (homeTeam.disciplinaryRecord + awayTeam.disciplinaryRecord) / 2;
            baseCards = baseCards * (1 + teamAdjustment * 0.1);
        }
        return {
            totalExpected: baseCards,
            yellowExpected: baseCards * 0.85,
            redExpected: baseCards * 0.15
        };
    }
    /**
     * Calculate real goal analytics from team data
     */
    calculateRealGoalAnalytics(match, homeTeam, awayTeam) {
        // Use actual match data if available
        if ((match === null || match === void 0 ? void 0 : match.homeGoalCount) !== undefined && (match === null || match === void 0 ? void 0 : match.awayGoalCount) !== undefined) {
            const totalGoals = match.homeGoalCount + match.awayGoalCount;
            return {
                expectedGoals: totalGoals,
                over25Probability: totalGoals > 2.5 ? 1.0 : 0.0,
                bttsLikelihood: (match.homeGoalCount > 0 && match.awayGoalCount > 0) ? 1.0 : 0.0
            };
        }
        // Calculate from team statistics
        const homeAvgGoals = this.calculateAverageGoals(homeTeam === null || homeTeam === void 0 ? void 0 : homeTeam.lastXMatches, 'home');
        const awayAvgGoals = this.calculateAverageGoals(awayTeam === null || awayTeam === void 0 ? void 0 : awayTeam.lastXMatches, 'away');
        const expectedGoals = homeAvgGoals + awayAvgGoals;
        // Calculate probabilities based on expected goals
        const over25Probability = this.calculateOver25Probability(expectedGoals);
        const bttsLikelihood = this.calculateBTTSLikelihood(homeAvgGoals, awayAvgGoals);
        return {
            expectedGoals,
            over25Probability,
            bttsLikelihood
        };
    }
    /**
     * Calculate average goals from recent matches
     */
    calculateAverageGoals(matches, venue) {
        if (!Array.isArray(matches) || matches.length === 0) {
            // Return league average based on venue
            return venue === 'home' ? 1.45 : 1.25;
        }
        try {
            const totalGoals = matches.reduce((sum, match) => {
                const goals = venue === 'home' ?
                    (match.homeGoalCount || match.homeGoals || 0) :
                    (match.awayGoalCount || match.awayGoals || 0);
                return sum + (typeof goals === 'number' ? goals : 0);
            }, 0);
            return totalGoals / matches.length;
        }
        catch (error) {
            console.warn('⚠️ Error calculating average goals:', error);
            return venue === 'home' ? 1.45 : 1.25;
        }
    }
    /**
     * Calculate average corners from recent matches
     */
    calculateAverageCorners(matches, venue) {
        if (!Array.isArray(matches) || matches.length === 0) {
            return venue === 'home' ? 5.5 : 5.0;
        }
        try {
            const totalCorners = matches.reduce((sum, match) => {
                const corners = venue === 'home' ?
                    (match.team_a_corners || 0) :
                    (match.team_b_corners || 0);
                return sum + (typeof corners === 'number' ? corners : 0);
            }, 0);
            return totalCorners / matches.length;
        }
        catch (error) {
            console.warn('⚠️ Error calculating average corners:', error);
            return venue === 'home' ? 5.5 : 5.0;
        }
    }
    /**
     * Calculate Over 2.5 goals probability based on expected goals
     */
    calculateOver25Probability(expectedGoals) {
        // Use Poisson distribution approximation
        if (expectedGoals <= 1.5)
            return 0.2;
        if (expectedGoals <= 2.0)
            return 0.35;
        if (expectedGoals <= 2.5)
            return 0.5;
        if (expectedGoals <= 3.0)
            return 0.65;
        if (expectedGoals <= 3.5)
            return 0.75;
        return 0.85;
    }
    /**
     * Calculate BTTS likelihood based on team goal averages
     */
    calculateBTTSLikelihood(homeAvgGoals, awayAvgGoals) {
        // Both teams need to score at least 1 goal
        const homeScoreProbability = homeAvgGoals > 0.8 ? 0.7 : homeAvgGoals > 0.5 ? 0.5 : 0.3;
        const awayScoreProbability = awayAvgGoals > 0.8 ? 0.7 : awayAvgGoals > 0.5 ? 0.5 : 0.3;
        // Combined probability (independent events)
        return homeScoreProbability * awayScoreProbability;
    }
    /**
     * Step 4: COMPREHENSIVE API ENDPOINT TESTING
     * Tests ALL available FootyStats API endpoints to ensure complete data coverage
     */
    testAllEndpoints() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            console.log('🧪 TESTING ALL FOOTYSTATS API ENDPOINTS');
            console.log('='.repeat(60));
            const endpointResults = {};
            const failedEndpoints = [];
            let successfulEndpoints = 0;
            // 1. BASIC ENDPOINTS
            console.log('\n📋 TESTING BASIC ENDPOINTS...');
            // Get Leagues
            try {
                console.log('🔍 Testing getLeagues...');
                const leagues = yield footy_1.DefaultService.getLeagues(API_KEY);
                endpointResults.getLeagues = {
                    success: true,
                    dataCount: Array.isArray(leagues.data) ? leagues.data.length : 0,
                    hasData: !!leagues.data
                };
                console.log(`✅ getLeagues: Found ${endpointResults.getLeagues.dataCount} leagues`);
                successfulEndpoints++;
            }
            catch (error) {
                console.error(`❌ getLeagues failed:`, error);
                endpointResults.getLeagues = { success: false, error: error instanceof Error ? error.message : String(error) };
                failedEndpoints.push('getLeagues');
            }
            // Get Countries
            try {
                console.log('🔍 Testing getCountries...');
                const countries = yield footy_1.DefaultService.getCountries(API_KEY);
                endpointResults.getCountries = {
                    success: true,
                    dataCount: Array.isArray(countries.data) ? countries.data.length : 0,
                    hasData: !!countries.data
                };
                console.log(`✅ getCountries: Found ${endpointResults.getCountries.dataCount} countries`);
                successfulEndpoints++;
            }
            catch (error) {
                console.error(`❌ getCountries failed:`, error);
                endpointResults.getCountries = { success: false, error: error instanceof Error ? error.message : String(error) };
                failedEndpoints.push('getCountries');
            }
            // Get Today's Matches
            try {
                console.log('🔍 Testing getTodaysMatches...');
                const todaysMatches = yield footy_1.DefaultService.getTodaysMatches(API_KEY, undefined, new Date().toISOString().split('T')[0], 1);
                endpointResults.getTodaysMatches = {
                    success: true,
                    dataCount: Array.isArray(todaysMatches.data) ? todaysMatches.data.length : 0,
                    hasData: !!todaysMatches.data
                };
                console.log(`✅ getTodaysMatches: Found ${endpointResults.getTodaysMatches.dataCount} matches`);
                successfulEndpoints++;
            }
            catch (error) {
                console.error(`❌ getTodaysMatches failed:`, error);
                endpointResults.getTodaysMatches = { success: false, error: error instanceof Error ? error.message : String(error) };
                failedEndpoints.push('getTodaysMatches');
            }
            // 2. STATISTICS ENDPOINTS
            console.log('\n📊 TESTING STATISTICS ENDPOINTS...');
            // BTTS Stats
            try {
                console.log('🔍 Testing getBttsStats...');
                const bttsStats = yield footy_1.DefaultService.getBttsStats(API_KEY);
                endpointResults.getBttsStats = {
                    success: true,
                    hasData: !!bttsStats.data,
                    dataType: typeof bttsStats.data
                };
                console.log(`✅ getBttsStats: BTTS statistics retrieved`);
                successfulEndpoints++;
            }
            catch (error) {
                console.error(`❌ getBttsStats failed:`, error);
                endpointResults.getBttsStats = { success: false, error: error instanceof Error ? error.message : String(error) };
                failedEndpoints.push('getBttsStats');
            }
            // Over 2.5 Stats
            try {
                console.log('🔍 Testing getOver25Stats...');
                const over25Stats = yield footy_1.DefaultService.getOver25Stats(API_KEY);
                endpointResults.getOver25Stats = {
                    success: true,
                    hasData: !!over25Stats.data,
                    dataType: typeof over25Stats.data
                };
                console.log(`✅ getOver25Stats: Over 2.5 statistics retrieved`);
                successfulEndpoints++;
            }
            catch (error) {
                console.error(`❌ getOver25Stats failed:`, error);
                endpointResults.getOver25Stats = { success: false, error: error instanceof Error ? error.message : String(error) };
                failedEndpoints.push('getOver25Stats');
            }
            // 3. CONDITIONAL TESTING (with actual data)
            console.log('\n🎯 TESTING CONDITIONAL ENDPOINTS WITH REAL DATA...');
            // Try to get a real league season for testing
            let testSeasonId = null;
            if (((_a = endpointResults.getLeagues) === null || _a === void 0 ? void 0 : _a.success) && endpointResults.getLeagues.dataCount > 0) {
                try {
                    const leagues = yield footy_1.DefaultService.getLeagues(API_KEY);
                    if (leagues.data && Array.isArray(leagues.data) && leagues.data.length > 0) {
                        // Try to find a league with recent data (Premier League, La Liga, etc.)
                        const majorLeague = leagues.data.find((league) => {
                            var _a, _b, _c;
                            return ((_a = league.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('premier')) ||
                                ((_b = league.name) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes('la liga')) ||
                                ((_c = league.name) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes('bundesliga')) ||
                                league.id < 100;
                        } // Often major leagues have lower IDs
                        ) || leagues.data[0];
                        if (majorLeague === null || majorLeague === void 0 ? void 0 : majorLeague.id) {
                            testSeasonId = majorLeague.id;
                            console.log(`🎯 Selected test league: ${majorLeague.name || 'Unknown'} (ID: ${testSeasonId})`);
                        }
                    }
                }
                catch (error) {
                    console.warn('⚠️ Could not select test league for conditional testing');
                }
            }
            // League Season (if we have a league ID)
            if (testSeasonId) {
                try {
                    console.log(`🔍 Testing getLeagueSeason with ID ${testSeasonId}...`);
                    const leagueSeason = yield footy_1.DefaultService.getLeagueSeason(testSeasonId, API_KEY);
                    endpointResults.getLeagueSeason = {
                        success: true,
                        hasData: !!leagueSeason.data,
                        testSeasonId
                    };
                    console.log(`✅ getLeagueSeason: Season data retrieved for league ${testSeasonId}`);
                    successfulEndpoints++;
                }
                catch (error) {
                    console.error(`❌ getLeagueSeason failed:`, error);
                    endpointResults.getLeagueSeason = { success: false, error: error instanceof Error ? error.message : String(error), testSeasonId };
                    failedEndpoints.push('getLeagueSeason');
                }
                // League Matches
                try {
                    console.log(`🔍 Testing getLeagueMatches with ID ${testSeasonId}...`);
                    const leagueMatches = yield footy_1.DefaultService.getLeagueMatches(testSeasonId, API_KEY, 1, 50);
                    endpointResults.getLeagueMatches = {
                        success: true,
                        dataCount: Array.isArray(leagueMatches.data) ? leagueMatches.data.length : 0,
                        hasData: !!leagueMatches.data,
                        testSeasonId
                    };
                    console.log(`✅ getLeagueMatches: Found ${endpointResults.getLeagueMatches.dataCount} matches for league ${testSeasonId}`);
                    successfulEndpoints++;
                }
                catch (error) {
                    console.error(`❌ getLeagueMatches failed:`, error);
                    endpointResults.getLeagueMatches = { success: false, error: error instanceof Error ? error.message : String(error), testSeasonId };
                    failedEndpoints.push('getLeagueMatches');
                }
                // League Teams
                try {
                    console.log(`🔍 Testing getLeagueTeams with ID ${testSeasonId}...`);
                    const leagueTeams = yield footy_1.DefaultService.getLeagueTeams(testSeasonId, API_KEY, 1);
                    endpointResults.getLeagueTeams = {
                        success: true,
                        dataCount: Array.isArray(leagueTeams.data) ? leagueTeams.data.length : 0,
                        hasData: !!leagueTeams.data,
                        testSeasonId
                    };
                    console.log(`✅ getLeagueTeams: Found ${endpointResults.getLeagueTeams.dataCount} teams for league ${testSeasonId}`);
                    successfulEndpoints++;
                }
                catch (error) {
                    console.error(`❌ getLeagueTeams failed:`, error);
                    endpointResults.getLeagueTeams = { success: false, error: error instanceof Error ? error.message : String(error), testSeasonId };
                    failedEndpoints.push('getLeagueTeams');
                }
                // League Tables
                try {
                    console.log(`🔍 Testing getLeagueTables with ID ${testSeasonId}...`);
                    const leagueTables = yield footy_1.DefaultService.getLeagueTables(testSeasonId, API_KEY);
                    endpointResults.getLeagueTables = {
                        success: true,
                        hasData: !!leagueTables.data,
                        testSeasonId
                    };
                    console.log(`✅ getLeagueTables: League tables retrieved for league ${testSeasonId}`);
                    successfulEndpoints++;
                }
                catch (error) {
                    console.error(`❌ getLeagueTables failed:`, error);
                    endpointResults.getLeagueTables = { success: false, error: error instanceof Error ? error.message : String(error), testSeasonId };
                    failedEndpoints.push('getLeagueTables');
                } // League Players
                try {
                    console.log(`🔍 Testing getLeaguePlayers with ID ${testSeasonId}...`);
                    const leaguePlayers = yield footy_1.DefaultService.getLeaguePlayers(testSeasonId, API_KEY);
                    endpointResults.getLeaguePlayers = {
                        success: true,
                        dataCount: Array.isArray(leaguePlayers.data) ? leaguePlayers.data.length : 0,
                        hasData: !!leaguePlayers.data,
                        testSeasonId
                    };
                    console.log(`✅ getLeaguePlayers: Found ${endpointResults.getLeaguePlayers.dataCount} players for league ${testSeasonId}`);
                    successfulEndpoints++;
                }
                catch (error) {
                    console.error(`❌ getLeaguePlayers failed:`, error);
                    endpointResults.getLeaguePlayers = { success: false, error: error instanceof Error ? error.message : String(error), testSeasonId };
                    failedEndpoints.push('getLeaguePlayers');
                }
                // League Referees
                try {
                    console.log(`🔍 Testing getLeagueReferees with ID ${testSeasonId}...`);
                    const leagueReferees = yield footy_1.DefaultService.getLeagueReferees(testSeasonId, API_KEY);
                    endpointResults.getLeagueReferees = {
                        success: true,
                        dataCount: Array.isArray(leagueReferees.data) ? leagueReferees.data.length : 0,
                        hasData: !!leagueReferees.data,
                        testSeasonId
                    };
                    console.log(`✅ getLeagueReferees: Found ${endpointResults.getLeagueReferees.dataCount} referees for league ${testSeasonId}`);
                    successfulEndpoints++;
                }
                catch (error) {
                    console.error(`❌ getLeagueReferees failed:`, error);
                    endpointResults.getLeagueReferees = { success: false, error: error instanceof Error ? error.message : String(error), testSeasonId };
                    failedEndpoints.push('getLeagueReferees');
                }
            }
            else {
                console.log('⚠️ Skipping league-specific endpoints (no test league available)');
                endpointResults.getLeagueSeason = { success: false, error: 'No test league available', skipped: true };
                endpointResults.getLeagueMatches = { success: false, error: 'No test league available', skipped: true };
                endpointResults.getLeagueTeams = { success: false, error: 'No test league available', skipped: true };
                endpointResults.getLeagueTables = { success: false, error: 'No test league available', skipped: true };
                endpointResults.getLeaguePlayers = { success: false, error: 'No test league available', skipped: true };
                endpointResults.getLeagueReferees = { success: false, error: 'No test league available', skipped: true };
                failedEndpoints.push('getLeagueSeason', 'getLeagueMatches', 'getLeagueTeams', 'getLeagueTables', 'getLeaguePlayers', 'getLeagueReferees');
            }
            // 4. ENTITY-SPECIFIC TESTING (with real IDs)
            console.log('\n🏠 TESTING ENTITY-SPECIFIC ENDPOINTS...');
            // Try to get real match/team/player IDs from today's matches
            let testMatchId = null;
            let testTeamId = null;
            let testPlayerId = null;
            let testRefereeId = null;
            if (((_b = endpointResults.getTodaysMatches) === null || _b === void 0 ? void 0 : _b.success) && endpointResults.getTodaysMatches.dataCount > 0) {
                try {
                    const todaysMatches = yield footy_1.DefaultService.getTodaysMatches(API_KEY, undefined, new Date().toISOString().split('T')[0], 1);
                    if (todaysMatches.data && Array.isArray(todaysMatches.data) && todaysMatches.data.length > 0) {
                        const firstMatch = todaysMatches.data[0];
                        testMatchId = firstMatch.id;
                        testTeamId = firstMatch.homeID || firstMatch.awayID;
                        testRefereeId = firstMatch.refereeID;
                        console.log(`🎯 Selected test IDs - Match: ${testMatchId}, Team: ${testTeamId}, Referee: ${testRefereeId}`);
                    }
                }
                catch (error) {
                    console.warn('⚠️ Could not extract test IDs from today\'s matches');
                }
            }
            // Match Details
            if (testMatchId) {
                try {
                    console.log(`🔍 Testing getMatch with ID ${testMatchId}...`);
                    const matchDetails = yield footy_1.DefaultService.getMatch(testMatchId, API_KEY);
                    endpointResults.getMatch = {
                        success: true,
                        hasData: !!matchDetails.data,
                        testMatchId
                    };
                    console.log(`✅ getMatch: Match details retrieved for match ${testMatchId}`);
                    successfulEndpoints++;
                }
                catch (error) {
                    console.error(`❌ getMatch failed:`, error);
                    endpointResults.getMatch = { success: false, error: error instanceof Error ? error.message : String(error), testMatchId };
                    failedEndpoints.push('getMatch');
                }
            }
            else {
                console.log('⚠️ Skipping getMatch (no test match ID available)');
                endpointResults.getMatch = { success: false, error: 'No test match ID available', skipped: true };
                failedEndpoints.push('getMatch');
            }
            // Team Details
            if (testTeamId) {
                try {
                    console.log(`🔍 Testing getTeam with ID ${testTeamId}...`);
                    const teamDetails = yield footy_1.DefaultService.getTeam(testTeamId, API_KEY);
                    endpointResults.getTeam = {
                        success: true,
                        hasData: !!teamDetails.data,
                        testTeamId
                    };
                    console.log(`✅ getTeam: Team details retrieved for team ${testTeamId}`);
                    successfulEndpoints++;
                }
                catch (error) {
                    console.error(`❌ getTeam failed:`, error);
                    endpointResults.getTeam = { success: false, error: error instanceof Error ? error.message : String(error), testTeamId };
                    failedEndpoints.push('getTeam');
                }
                // Team Last X Stats
                try {
                    console.log(`🔍 Testing getTeamLastXStats with ID ${testTeamId}...`);
                    const teamStats = yield footy_1.DefaultService.getTeamLastXStats(testTeamId, API_KEY);
                    endpointResults.getTeamLastXStats = {
                        success: true,
                        hasData: !!teamStats.data,
                        testTeamId
                    };
                    console.log(`✅ getTeamLastXStats: Team stats retrieved for team ${testTeamId}`);
                    successfulEndpoints++;
                }
                catch (error) {
                    console.error(`❌ getTeamLastXStats failed:`, error);
                    endpointResults.getTeamLastXStats = { success: false, error: error instanceof Error ? error.message : String(error), testTeamId };
                    failedEndpoints.push('getTeamLastXStats');
                }
            }
            else {
                console.log('⚠️ Skipping team endpoints (no test team ID available)');
                endpointResults.getTeam = { success: false, error: 'No test team ID available', skipped: true };
                endpointResults.getTeamLastXStats = { success: false, error: 'No test team ID available', skipped: true };
                failedEndpoints.push('getTeam', 'getTeamLastXStats');
            }
            // Referee Stats
            if (testRefereeId) {
                try {
                    console.log(`🔍 Testing getRefereeStats with ID ${testRefereeId}...`);
                    const refereeStats = yield footy_1.DefaultService.getRefereeStats(testRefereeId, API_KEY);
                    endpointResults.getRefereeStats = {
                        success: true,
                        hasData: !!refereeStats.data,
                        testRefereeId
                    };
                    console.log(`✅ getRefereeStats: Referee stats retrieved for referee ${testRefereeId}`);
                    successfulEndpoints++;
                }
                catch (error) {
                    console.error(`❌ getRefereeStats failed:`, error);
                    endpointResults.getRefereeStats = { success: false, error: error instanceof Error ? error.message : String(error), testRefereeId };
                    failedEndpoints.push('getRefereeStats');
                }
            }
            else {
                console.log('⚠️ Skipping getRefereeStats (no test referee ID available)');
                endpointResults.getRefereeStats = { success: false, error: 'No test referee ID available', skipped: true };
                failedEndpoints.push('getRefereeStats');
            } // Player Stats (try with a known player ID or skip)
            if (((_c = endpointResults.getLeaguePlayers) === null || _c === void 0 ? void 0 : _c.success) && endpointResults.getLeaguePlayers.dataCount > 0) {
                try {
                    const leaguePlayers = yield footy_1.DefaultService.getLeaguePlayers(testSeasonId, API_KEY);
                    if (leaguePlayers.data && Array.isArray(leaguePlayers.data) && leaguePlayers.data.length > 0) {
                        testPlayerId = leaguePlayers.data[0].id;
                    }
                }
                catch (error) {
                    console.warn('⚠️ Could not get test player ID');
                }
            }
            if (testPlayerId) {
                try {
                    console.log(`🔍 Testing getPlayerStats with ID ${testPlayerId}...`);
                    const playerStats = yield footy_1.DefaultService.getPlayerStats(testPlayerId, API_KEY);
                    endpointResults.getPlayerStats = {
                        success: true,
                        hasData: !!playerStats.data,
                        testPlayerId
                    };
                    console.log(`✅ getPlayerStats: Player stats retrieved for player ${testPlayerId}`);
                    successfulEndpoints++;
                }
                catch (error) {
                    console.error(`❌ getPlayerStats failed:`, error);
                    endpointResults.getPlayerStats = { success: false, error: error instanceof Error ? error.message : String(error), testPlayerId };
                    failedEndpoints.push('getPlayerStats');
                }
            }
            else {
                console.log('⚠️ Skipping getPlayerStats (no test player ID available)');
                endpointResults.getPlayerStats = { success: false, error: 'No test player ID available', skipped: true };
                failedEndpoints.push('getPlayerStats');
            }
            // 5. CALCULATE RESULTS
            const totalEndpoints = Object.keys(endpointResults).length;
            const failureRate = (failedEndpoints.length / totalEndpoints) * 100;
            const successRate = (successfulEndpoints / totalEndpoints) * 100;
            const summary = `
🎯 COMPREHENSIVE API ENDPOINT TEST RESULTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 OVERALL STATISTICS:
   • Total Endpoints Tested: ${totalEndpoints}
   • Successful Endpoints: ${successfulEndpoints}
   • Failed Endpoints: ${failedEndpoints.length}
   • Success Rate: ${successRate.toFixed(1)}%
   • Failure Rate: ${failureRate.toFixed(1)}%

✅ WORKING ENDPOINTS:
${Object.entries(endpointResults)
                .filter(([_, result]) => result.success)
                .map(([endpoint, result]) => `   • ${endpoint} ${result.dataCount ? `(${result.dataCount} items)` : ''}`)
                .join('\n')}

${failedEndpoints.length > 0 ? `❌ FAILED ENDPOINTS:
${failedEndpoints.map(endpoint => `   • ${endpoint}`).join('\n')}` : '🎉 ALL ENDPOINTS WORKING!'}

🔍 DATA COVERAGE ASSESSMENT:
   • Basic endpoints (leagues, countries, matches): ${['getLeagues', 'getCountries', 'getTodaysMatches'].every(e => { var _a; return (_a = endpointResults[e]) === null || _a === void 0 ? void 0 : _a.success; }) ? '✅ WORKING' : '❌ ISSUES'}
   • Statistics endpoints (BTTS, Over 2.5): ${['getBttsStats', 'getOver25Stats'].every(e => { var _a; return (_a = endpointResults[e]) === null || _a === void 0 ? void 0 : _a.success; }) ? '✅ WORKING' : '❌ ISSUES'}
   • League data endpoints: ${['getLeagueSeason', 'getLeagueMatches', 'getLeagueTeams'].some(e => { var _a; return (_a = endpointResults[e]) === null || _a === void 0 ? void 0 : _a.success; }) ? '✅ PARTIAL/WORKING' : '❌ ISSUES'}
   • Entity-specific endpoints: ${['getMatch', 'getTeam', 'getTeamLastXStats'].some(e => { var _a; return (_a = endpointResults[e]) === null || _a === void 0 ? void 0 : _a.success; }) ? '✅ PARTIAL/WORKING' : '❌ ISSUES'}

🚀 RECOMMENDATION FOR BACKEND DEVELOPMENT:
${successRate >= 80 ? '✅ EXCELLENT - Proceed with confidence! Most endpoints working.' :
                successRate >= 60 ? '⚠️ GOOD - Most core functionality available, some limitations.' :
                    '❌ REVIEW NEEDED - Significant endpoint issues detected.'}
`;
            console.log(summary);
            return {
                success: successRate >= 50, // Consider it successful if at least 50% of endpoints work
                endpointResults,
                totalEndpoints,
                successfulEndpoints,
                failedEndpoints,
                summary
            };
        });
    }
}
exports.MatchAnalysisService = MatchAnalysisService;
// Export a singleton instance
exports.matchAnalysisService = new MatchAnalysisService();
