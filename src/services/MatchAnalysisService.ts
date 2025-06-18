/**
 * 🎯 SIMPLE MATCH ANALYSIS SERVICE - STRESS TEST VERSION
 * 
 * This service tests our foundation by:
 * 1. Getting today's matches
 * 2. Selecting a match for detailed analysis  
 * 3. Getting comprehensive match data
 */

import { DefaultService } from '../apis/footy';

const API_KEY = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756';

export interface BasicMatchInfo {
    success: boolean;
    selectedMatch?: any;
    totalMatches?: number;
    error?: string;
}

export interface DetailedMatchInfo {
    success: boolean;
    data?: {
        matchDetails: any;
        homeTeam: any;
        awayTeam: any;
        analysisTimestamp: string;
    };
    error?: string;
}

export interface MatchAnalysisOptions {
    matchId: number;
    includeTeamStats?: boolean;
    includePlayerStats?: boolean;
    includeRefereeStats?: boolean;
    includeH2H?: boolean;
}

export interface MatchAnalysisResult {
    success: boolean;
    data?: {
        selectedMatch: any;
        analytics: {
            corners: {
                totalExpected: number;
                homeExpected: number;
                awayExpected: number;
            };
            cards: {
                totalExpected: number;
                yellowExpected: number;
                redExpected: number;
            };
            goals: {
                over25Probability: number;
                bttsLikelihood: number;
                expectedGoals: number;
            };
        };
        homeTeam: {
            info?: any;
            lastXMatches?: any;
        };
        awayTeam: {
            info?: any;
            lastXMatches?: any;
        };
        referee?: any;
    };
    metadata: {
        totalMatchesToday: number;
        analysisTimestamp: string;
        dataSource: string;
    };
    error?: string;
}

export class MatchAnalysisService {

    /**
     * Get upcoming matches from FootyStats API
     * FIXED: Gets matches from ALL leagues, not just one hardcoded league
     */
    async getUpcomingMatches(limit?: number, hours: number = 48): Promise<any[]> {
        try {
            console.log(`🔍 Getting upcoming matches${limit ? ` (limit: ${limit})` : ' (all)'} for next ${hours} hours...`);

            // Get current timestamp and future time range
            const currentTime = Math.floor(Date.now() / 1000);
            const futureTime = currentTime + (hours * 60 * 60); // Convert hours to seconds

            const allUpcomingMatches: any[] = [];

            // Get matches for today and next few days to cover the time range + global time zones
            const daysToCheck = Math.ceil(hours / 24) + 2; // Add 2 days buffer for global time zone coverage

            for (let dayOffset = 0; dayOffset < daysToCheck; dayOffset++) {
                const targetDate = new Date();
                targetDate.setDate(targetDate.getDate() + dayOffset);
                const dateString = targetDate.toISOString().split('T')[0];

                console.log(`📅 Checking matches for ${dateString} with complete pagination...`);

                try {
                    // ✅ ENHANCED PAGINATION - Fetch all pages for each day
                    let dayPage = 1;
                    let hasMoreDayPages = true;
                    let dayMatches: any[] = [];
                    const MAX_MATCHES_PER_DAY = 500; // Reasonable limit per day

                    while (hasMoreDayPages && dayMatches.length < MAX_MATCHES_PER_DAY) {
                        console.log(`📄 Fetching page ${dayPage} for ${dateString}... (${dayMatches.length}/${MAX_MATCHES_PER_DAY} matches collected)`);

                        const pageResponse = await DefaultService.getTodaysMatches(
                            API_KEY,
                            undefined, // timezone
                            dateString, // date
                            dayPage
                        );

                        if (pageResponse && pageResponse.data && Array.isArray(pageResponse.data)) {
                            const pageMatches = pageResponse.data;

                            // Only add matches up to our daily limit
                            const remainingSlots = MAX_MATCHES_PER_DAY - dayMatches.length;
                            const matchesToAdd = pageMatches.slice(0, remainingSlots);
                            dayMatches.push(...matchesToAdd);

                            console.log(`✅ Page ${dayPage} for ${dateString}: Added ${matchesToAdd.length}/${pageMatches.length} matches (Day Total: ${dayMatches.length}/${MAX_MATCHES_PER_DAY})`);

                            // Check pagination info
                            if (pageResponse.pager) {
                                const totalPages = pageResponse.pager.max_page || 1;
                                console.log(`📊 Day ${dateString} Pagination: Page ${dayPage}/${totalPages}, API Total: ${pageResponse.pager.total_results}`);

                                // Stop if we've reached our limit or no more pages
                                if (dayMatches.length >= MAX_MATCHES_PER_DAY || dayPage >= totalPages) {
                                    hasMoreDayPages = false;
                                    if (dayMatches.length >= MAX_MATCHES_PER_DAY) {
                                        console.log(`🎯 Reached daily match limit (${MAX_MATCHES_PER_DAY}) for ${dateString}, stopping pagination`);
                                    }
                                } else {
                                    dayPage++;
                                }
                            } else {
                                // No pagination info, assume single page
                                hasMoreDayPages = false;
                            }

                            // Safety check to prevent infinite loops
                            if (dayPage > 10) {
                                console.log(`⚠️ Safety limit reached (10 pages) for ${dateString}, stopping pagination`);
                                break;
                            }
                        } else {
                            console.log(`❌ No data returned for page ${dayPage} of ${dateString}`);
                            hasMoreDayPages = false;
                        }
                    }

                    // Add all matches from this day to the overall collection
                    allUpcomingMatches.push(...dayMatches);
                    console.log(`📊 Found ${dayMatches.length} total matches for ${dateString} across ${dayPage} pages`);

                } catch (dayError) {
                    console.warn(`⚠️ Failed to get matches for ${dateString}:`, dayError);
                    // Continue with other days
                }
            }

            console.log(`📊 Total matches collected: ${allUpcomingMatches.length}`);

            // ✅ COMPREHENSIVE UPCOMING FILTERING: Accept ALL possible scheduled status values globally
            const upcomingMatches = allUpcomingMatches.filter((match: any) => {
                // ✅ COMPREHENSIVE STATUS CHECK - Include all possible upcoming/scheduled statuses
                const status = match.status?.toLowerCase() || '';

                // Upcoming/scheduled status keywords (broader detection)
                const upcomingKeywords = [
                    'incomplete', 'scheduled', 'pending', 'not started', 'upcoming', 'fixture',
                    'tbd', 'to be determined', 'awaiting', 'confirmed', 'vs', 'preview',
                    'pre-match', 'prematch', 'before', 'future'
                ];

                // Finished/live status keywords (to exclude from upcoming)
                const excludeKeywords = [
                    'full-time', 'ft', 'ended', 'finished', 'complete', 'final',
                    'live', 'in progress', 'in-progress', 'playing', 'ongoing', 'active',
                    'started', '1st half', 'first half', 'half-time', 'halftime',
                    '2nd half', 'second half', 'paused', 'stoppage', 'extra time',
                    'postponed', 'cancelled', 'canceled', 'abandoned', 'void'
                ];

                // Check if status indicates upcoming match
                const isUpcomingStatus = upcomingKeywords.some(keyword => status.includes(keyword));
                const isExcluded = excludeKeywords.some(keyword => status.includes(keyword));

                // Time calculations for global coverage
                const matchTime = match.date_unix || 0;
                const isFuture = matchTime > currentTime;
                const isWithinRange = matchTime <= futureTime;

                // ✅ EXCLUDE ESPORTS/VIRTUAL MATCHES
                const isEsports = this.isEsportsMatch(match);
                if (isEsports) {
                    console.log(`🚫 EXCLUDED ESPORTS: ${match.home_name} vs ${match.away_name}`);
                    return false;
                }

                // ✅ COMPREHENSIVE UPCOMING DETECTION: Multiple conditions for global coverage
                // 1. Status indicates upcoming/scheduled AND not excluded
                // 2. OR match is in future, within range, and not excluded (catch matches with unknown statuses)
                const isUpcoming = (isUpcomingStatus && !isExcluded && isFuture && isWithinRange) ||
                                 (!isExcluded && isFuture && isWithinRange);

                if (isUpcoming) {
                    const matchDate = new Date(matchTime * 1000).toLocaleString();
                    const hoursUntil = Math.floor((matchTime - currentTime) / 3600);
                    console.log(`📅 UPCOMING MATCH: ${match.home_name} vs ${match.away_name} (${matchDate}, in ${hoursUntil}h)`);
                } else if (isFuture && isWithinRange) {
                    // Log matches that are future but weren't detected as upcoming for debugging
                    console.log(`⚠️ FUTURE BUT NOT UPCOMING:`, {
                        teams: `${match.home_name} vs ${match.away_name}`,
                        status: status,
                        hoursUntil: Math.floor((matchTime - currentTime) / 3600),
                        isUpcomingStatus,
                        isExcluded
                    });
                }

                return isUpcoming;
            });

            // Sort by date (earliest first)
            upcomingMatches.sort((a, b) => (a.date_unix || 0) - (b.date_unix || 0));

            // Apply limit if specified (for dashboard), otherwise return all (for upcoming page)
            const resultMatches = limit ? upcomingMatches.slice(0, limit) : upcomingMatches;

            console.log(`🎯 Filtered to ${resultMatches.length} upcoming matches${limit ? ` (limited from ${upcomingMatches.length} total)` : ''}`);

            return resultMatches;

        } catch (error) {
            console.error('❌ Error in getUpcomingMatches:', error);
            return [];
        }
    }

    /**
     * Monitor API rate limit from response metadata
     */
    private logApiQuota(response: any, endpoint: string): void {
        if (response?.metadata) {
            const remaining = parseInt(response.metadata.request_remaining || '0');
            const limit = parseInt(response.metadata.request_limit || '0');
            const resetMessage = response.metadata.request_reset_message || 'Unknown';

            console.log(`📊 API QUOTA [${endpoint}]: ${remaining}/${limit} remaining (${resetMessage})`);

            if (remaining < 100) {
                console.warn(`⚠️ API QUOTA LOW: Only ${remaining} requests remaining!`);
            }

            if (remaining < 0) {
                console.error(`🚨 API QUOTA EXCEEDED: ${remaining} requests over limit! ${resetMessage}`);
            }
        }
    }

    /**
     * DIRECT DEBUG METHOD - Test what's actually in today's matches
     */
    async debugTodaysMatches(): Promise<any> {
        try {
            console.log(`🚨 DIRECT DEBUG: Testing today's matches API directly`);

            const today = new Date().toISOString().split('T')[0];
            console.log(`📅 Testing date: ${today}`);

            // Get first page only for debugging
            const response = await DefaultService.getTodaysMatches(
                API_KEY,
                undefined,
                today,
                1
            );

            if (!response || !response.data) {
                console.log(`❌ No response data`);
                return { error: 'No response data' };
            }

            // Monitor API quota
            this.logApiQuota(response, 'debugTodaysMatches');

            const matches = Array.isArray(response.data) ? response.data : [];
            console.log(`📊 Got ${matches.length} matches from API`);

            // Log all unique statuses
            const allStatuses = [...new Set(matches.map((match: any) => match.status))];
            console.log(`🔍 ALL STATUSES:`, allStatuses);

            // Log first 3 matches with full details
            const sampleMatches = matches.slice(0, 3).map((match: any) => ({
                teams: `${match.home_name} vs ${match.away_name}`,
                status: match.status,
                date_unix: match.date_unix,
                date_readable: match.date_unix ? new Date(match.date_unix * 1000).toISOString() : 'No time',
                homeGoals: match.homeGoalCount || 0,
                awayGoals: match.awayGoalCount || 0
            }));

            console.log(`🔍 SAMPLE MATCHES:`, sampleMatches);

            return {
                success: true,
                totalMatches: matches.length,
                allStatuses,
                sampleMatches,
                pager: response.pager
            };

        } catch (error) {
            console.error('❌ Debug error:', error);
            return { error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    /**
     * Get live matches from FootyStats API
     * ✅ FIXED: Uses new normalizer for proper score and status handling
     */
    async getLiveMatches(limit?: number): Promise<any[]> {
        try {
            console.log(`🔍 Getting live matches${limit ? ` (limit: ${limit})` : ' (all)'}...`);

            // Get current timestamp for live match detection (used in filter below)

            // Get ALL today's matches from all leagues with complete pagination
            const today = new Date().toISOString().split('T')[0];

            let allMatches: any[] = [];
            let currentPage = 1;
            let hasMorePages = true;
            const MAX_MATCHES = 1000; // Reasonable limit for live match processing

            // ✅ ENHANCED PAGINATION - Fetch all available matches for accurate live detection
            while (hasMorePages && allMatches.length < MAX_MATCHES) {
                console.log(`📄 Fetching page ${currentPage} for live match detection... (${allMatches.length}/${MAX_MATCHES} matches collected)`);

                const todaysMatches = await DefaultService.getTodaysMatches(
                    API_KEY,
                    undefined, // timezone
                    today,     // date
                    currentPage
                );

                if (!todaysMatches || !todaysMatches.data) {
                    console.log(`❌ No data returned for page ${currentPage}`);
                    break;
                }

                const pageMatches = Array.isArray(todaysMatches.data) ? todaysMatches.data : [];

                // Only add matches up to our limit
                const remainingSlots = MAX_MATCHES - allMatches.length;
                const matchesToAdd = pageMatches.slice(0, remainingSlots);
                allMatches.push(...matchesToAdd);

                console.log(`✅ Page ${currentPage}: Added ${matchesToAdd.length}/${pageMatches.length} matches (Total: ${allMatches.length}/${MAX_MATCHES})`);

                // Check pagination info
                if (todaysMatches.pager) {
                    const totalPages = todaysMatches.pager.max_page || 1;
                    console.log(`📊 Live Match Pagination: Page ${currentPage}/${totalPages}, API Total: ${todaysMatches.pager.total_results}`);

                    // Stop if we've reached our limit or no more pages
                    if (allMatches.length >= MAX_MATCHES || currentPage >= totalPages) {
                        hasMorePages = false;
                        if (allMatches.length >= MAX_MATCHES) {
                            console.log(`🎯 Reached match limit (${MAX_MATCHES}) for live detection, stopping pagination`);
                        }
                    } else {
                        currentPage++;
                    }
                } else {
                    // No pagination info, assume single page
                    hasMorePages = false;
                }

                // Safety check to prevent infinite loops
                if (currentPage > 10) {
                    console.log('⚠️ Safety limit reached (10 pages), stopping pagination');
                    break;
                }
            }

            console.log(`📊 Found ${allMatches.length} total today's matches across ${currentPage} pages for live filtering`);

            if (allMatches.length === 0) {
                console.log('❌ No matches data returned from any page');
                return [];
            }

            const matches = allMatches;
            console.log(`📊 Processing ${matches.length} total today's matches for live detection`);

            // ✅ CRITICAL DEBUG: Force logging to see if this section is reached
            console.log(`🚨 CRITICAL DEBUG: Starting live match analysis with ${matches.length} matches`);

            // ✅ DEBUG: Log all unique statuses in the data to understand what we're working with
            const allStatuses = [...new Set(matches.map((match: any) => match.status))];
            console.log(`🔍 ALL UNIQUE STATUSES IN TODAY'S MATCHES:`, allStatuses);

            // ✅ ENHANCED DEBUG: Count matches by status
            const statusCounts: { [key: string]: number } = {};
            matches.forEach((match: any) => {
                const status = match.status || 'unknown';
                statusCounts[status] = (statusCounts[status] || 0) + 1;
            });
            console.log(`📊 STATUS DISTRIBUTION:`, statusCounts);

            // ✅ DEBUG: Log time analysis for sample matches
            const currentTime = Math.floor(Date.now() / 1000);
            console.log(`🕐 Current UTC Time: ${new Date(currentTime * 1000).toISOString()}`);

            // Log first 5 matches for debugging
            const sampleMatches = matches.slice(0, 5).map((match: any) => {
                const matchTime = match.date_unix || 0;
                const timeDiff = currentTime - matchTime;
                return {
                    teams: `${match.home_name} vs ${match.away_name}`,
                    status: match.status,
                    matchTime: matchTime ? new Date(matchTime * 1000).toISOString() : 'No time',
                    timeDiffMinutes: Math.floor(timeDiff / 60),
                    hasStarted: matchTime > 0 && matchTime < currentTime,
                    isWithinLiveWindow: timeDiff > 0 && timeDiff < (4 * 60 * 60)
                };
            });

            console.log(`🔍 SAMPLE MATCHES TIME ANALYSIS:`, sampleMatches);



            // ✅ NORMALIZE AND FILTER LIVE MATCHES - Use new normalizer
            const normalizedMatches = normalizeFootyStatsMatches(allMatches);

            // Filter for live matches using normalized status
            const liveMatches = normalizedMatches.filter(match =>
                match.status === 'ao-vivo'
            );

            console.log(`🔍 Found ${liveMatches.length} live matches from ${allMatches.length} total matches`);

            // Apply limit if specified (for dashboard vs live page)
            const resultMatches = limit ? liveMatches.slice(0, limit) : liveMatches;

            console.log(`🎯 Filtered to ${resultMatches.length} live matches${limit ? ` (limited from ${liveMatches.length} total)` : ''}`);

            return resultMatches;

        } catch (error) {
            console.error('❌ Error in getLiveMatches:', error);
            return [];
        }
    }

    /**
     * Get total count of matches for a specific date without loading all data
     * Optimized for dashboard statistics display
     */
    async getTotalMatchCount(date?: string): Promise<{ totalMatches: number; success: boolean }> {
        try {
            const today = date || new Date().toISOString().split('T')[0];
            console.log(`📊 Getting total match count for: ${today}`);

            // Make only one API call to get pager information
            const response = await DefaultService.getTodaysMatches(
                API_KEY,
                undefined, // timezone
                today,     // date
                1          // Only first page to get pager info
            );

            if (response?.pager?.total_results) {
                console.log(`📊 Total matches available in API: ${response.pager.total_results}`);
                return {
                    success: true,
                    totalMatches: response.pager.total_results
                };
            }

            console.log('⚠️ No pager information available');
            return { success: false, totalMatches: 0 };
        } catch (error) {
            console.error('❌ Error getting total match count:', error);
            return { success: false, totalMatches: 0 };
        }
    }

    /**
     * ✅ OPTIMIZED: Get today's matches for dashboard with single API call
     * Used by dashboard endpoint to minimize API calls
     * @param date - Date in YYYY-MM-DD format
     * @returns Promise<FootyStatsResponse>
     */
    async getTodaysMatchesOptimized(date: string): Promise<any> {
        console.log(`📊 Getting optimized today's matches for: ${date}`);

        try {
            // ✅ OPTIMIZED: Single API call to get all today's matches
            const response = await DefaultService.getTodaysMatches(
                API_KEY,
                undefined, // timezone
                date,      // date
                1          // page
            );

            console.log(`📊 Optimized matches response: ${response.data?.length || 0} matches`);
            return response;
        } catch (error) {
            console.error('❌ Error getting optimized today\'s matches:', error);
            throw error;
        }
    }

    /**
     * Step 1: Get basic match information from today's matches with complete pagination
     */
    async getBasicMatchInfo(date?: string): Promise<BasicMatchInfo> {
        try {
            console.log('🔍 Getting today\'s matches with complete pagination...');

            const today = date || new Date().toISOString().split('T')[0];
            console.log(`📅 Looking for matches on: ${today}`);

            let allMatches: any[] = [];
            let currentPage = 1;
            let hasMorePages = true;
            let totalPages = 1;
            const MAX_MATCHES = 1000; // ✅ INCREASED LIMIT - Allow hundreds of matches per day

            // ✅ ENHANCED PAGINATION - Fetch all available matches without artificial limits
            while (hasMorePages && allMatches.length < MAX_MATCHES) {
                console.log(`📄 Fetching page ${currentPage}... (${allMatches.length}/${MAX_MATCHES} matches collected)`);

                const todaysMatches = await DefaultService.getTodaysMatches(
                    API_KEY,
                    undefined, // timezone
                    today,     // date
                    currentPage
                );

                // ✅ DETAILED API RESPONSE LOGGING
                console.log(`📊 API RESPONSE DEBUG - Page ${currentPage}:`, {
                    success: !!todaysMatches,
                    hasData: !!todaysMatches?.data,
                    dataLength: Array.isArray(todaysMatches?.data) ? todaysMatches.data.length : 0,
                    pager: todaysMatches?.pager,
                    firstMatch: todaysMatches?.data?.[0] ? {
                        id: todaysMatches.data[0].id,
                        teams: `${todaysMatches.data[0].home_name} vs ${todaysMatches.data[0].away_name}`,
                        status: todaysMatches.data[0].status,
                        date_unix: todaysMatches.data[0].date_unix,
                        date_readable: new Date((todaysMatches.data[0].date_unix || 0) * 1000).toISOString()
                    } : null
                });

                if (!todaysMatches || !todaysMatches.data) {
                    console.log(`❌ No data returned for page ${currentPage}`);
                    break;
                }

                const pageMatches = Array.isArray(todaysMatches.data) ? todaysMatches.data : [];

                // Only add matches up to our limit
                const remainingSlots = MAX_MATCHES - allMatches.length;
                const matchesToAdd = pageMatches.slice(0, remainingSlots);
                allMatches.push(...matchesToAdd);

                console.log(`✅ Page ${currentPage}: Added ${matchesToAdd.length}/${pageMatches.length} matches (Total: ${allMatches.length}/${MAX_MATCHES})`);

                // Check pagination info and limits
                if (todaysMatches.pager) {
                    totalPages = todaysMatches.pager.max_page || 1;
                    console.log(`📊 Pagination: Page ${currentPage}/${totalPages}, API Total: ${todaysMatches.pager.total_results}, Our Limit: ${MAX_MATCHES}`);

                    // Stop if we've reached our limit or no more pages
                    if (allMatches.length >= MAX_MATCHES || currentPage >= totalPages) {
                        hasMorePages = false;
                        if (allMatches.length >= MAX_MATCHES) {
                            console.log(`🎯 Reached match limit (${MAX_MATCHES}), stopping pagination for optimal performance`);
                        }
                    } else {
                        currentPage++;
                    }
                } else {
                    // No pagination info, assume single page
                    hasMorePages = false;
                }

                // Safety check to prevent infinite loops
                if (currentPage > 5) {
                    console.log('⚠️ Safety limit reached (5 pages), stopping pagination');
                    break;
                }
            }

            console.log(`📊 Found ${allMatches.length} total today's matches across ${currentPage} pages`);

            if (allMatches.length === 0) {
                return {
                    success: true,
                    totalMatches: 0,
                    error: 'No matches found for today'
                };
            }

            // Select the first match for analysis
            const selectedMatch = allMatches[0];
            console.log(`🎯 Selected match:`, selectedMatch);

            return {
                success: true,
                selectedMatch,
                totalMatches: allMatches.length
            };

        } catch (error) {
            console.error('❌ Error in getBasicMatchInfo:', error);
            return {
                success: false,
                error: `Failed to get basic match info: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }
    
    /**
     * Step 2: Get detailed match analysis
     */
    async getDetailedMatchInfo(matchId: number): Promise<DetailedMatchInfo> {
        console.log(`🚀 ENTERING getDetailedMatchInfo with matchId: ${matchId}, type: ${typeof matchId}`);
        console.log(`🔍 About to enter try block...`);
        try {
            console.log(`🔍 INSIDE try block - first line!`);
            console.log(`🔍 Getting detailed info for match ID: ${matchId}`);
            console.log(`🔍 Match ID type: ${typeof matchId}, value: ${matchId}`);
            console.log(`🔍 About to validate matchId...`);

            // Validate matchId - SIMPLIFIED
            console.log(`🔍 Validating matchId: ${matchId}, type: ${typeof matchId}`);
            console.log(`🔍 !matchId: ${!matchId}`);
            console.log(`🔍 isNaN(matchId): ${isNaN(matchId)}`);

            if (!matchId || isNaN(matchId)) {
                console.error(`❌ Invalid matchId: ${matchId}`);
                return {
                    success: false,
                    error: `Invalid match ID: ${matchId}`
                };
            }

            console.log(`🔍 matchId validation passed! Proceeding...`);

            console.log(`🔍 matchId validation passed!`);

            // Get match details
            console.log(`🔍 Calling DefaultService.getMatch with matchId: ${matchId}, key: ${API_KEY ? 'present' : 'missing'}`);
            console.log(`🔍 Parameters being passed: { matchId: ${Number(matchId)}, key: ${API_KEY} }`);
            console.log(`🔍 Number(matchId) result: ${Number(matchId)}, type: ${typeof Number(matchId)}`);

            const params = { matchId: Number(matchId), key: API_KEY };
            console.log(`🔍 Final params object:`, params);
            console.log(`🔍 params.matchId:`, params.matchId);
            console.log(`🔍 params.key:`, params.key);

            // Try direct call without destructuring
            console.log(`🔍 About to call DefaultService.getMatch with:`);
            console.log(`🔍   - matchId: ${matchId} (type: ${typeof matchId})`);
            console.log(`🔍   - Number(matchId): ${Number(matchId)} (type: ${typeof Number(matchId)})`);
            console.log(`🔍   - API_KEY: ${API_KEY ? 'present' : 'missing'}`);

            const callParams = {
                matchId: Number(matchId),
                key: API_KEY
            };
            console.log(`🔍 Final call parameters:`, JSON.stringify(callParams, null, 2));

            // FIXED: Pass parameters with destructuring, not as object
            const matchDetails = await DefaultService.getMatch({
                matchId: Number(matchId),
                key: API_KEY
            });
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
            
        } catch (error) {
            console.error('❌ Error in getDetailedMatchInfo:', error);
            return {
                success: false,
                error: `Failed to get detailed match info: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }

    /**
     * Step 3: Comprehensive Match Analysis
     * This is the main method that provides detailed football analytics
     */
    async getMatchAnalysis(options: MatchAnalysisOptions): Promise<MatchAnalysisResult> {
        try {
            console.log(`🎯 Starting comprehensive analysis for match ID: ${options.matchId}`);
            
            // Step 1: Get basic match details
            const matchDetails = await DefaultService.getMatch({ matchId: options.matchId, key: API_KEY });
            console.log('✅ Retrieved match details');
            
            if (!matchDetails?.data) {
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

            const match = matchDetails.data as any; // Type assertion for match object
            console.log(`📊 Analyzing: ${match.homeID} vs ${match.awayID}`);

            // Step 2: Get team statistics if requested
            let homeTeamData: { info: any; lastXMatches: any } = { info: null, lastXMatches: null };
            let awayTeamData: { info: any; lastXMatches: any } = { info: null, lastXMatches: null };

            if (options.includeTeamStats) {
                try {
                    console.log('📈 Fetching team statistics...');
                    
                    // Get team info and recent form
                    const [homeTeamInfo, awayTeamInfo] = await Promise.all([
                        DefaultService.getTeam(match.homeID, API_KEY).catch(e => {
                            console.warn(`⚠️ Could not get home team ${match.homeID}:`, e.message);
                            return null;
                        }),
                        DefaultService.getTeam(match.awayID, API_KEY).catch(e => {
                            console.warn(`⚠️ Could not get away team ${match.awayID}:`, e.message);
                            return null;
                        })
                    ]);

                    // Get recent form data
                    const [homeRecentStats, awayRecentStats] = await Promise.all([
                        DefaultService.getTeamLastXStats(match.homeID, API_KEY).catch(e => {
                            console.warn(`⚠️ Could not get home team stats for ${match.homeID}:`, e.message);
                            return null;
                        }),
                        DefaultService.getTeamLastXStats(match.awayID, API_KEY).catch(e => {
                            console.warn(`⚠️ Could not get away team stats for ${match.awayID}:`, e.message);
                            return null;
                        })
                    ]);

                    homeTeamData = {
                        info: homeTeamInfo?.data || null,
                        lastXMatches: homeRecentStats?.data || null
                    };

                    awayTeamData = {
                        info: awayTeamInfo?.data || null,
                        lastXMatches: awayRecentStats?.data || null
                    };

                    console.log('✅ Team statistics retrieved');
                } catch (error) {
                    console.warn('⚠️ Some team statistics could not be retrieved:', error);
                }
            }

            // Step 3: Get referee stats if requested
            let refereeData = null;
            if (options.includeRefereeStats && match.refereeID) {
                try {
                    console.log('👨‍⚖️ Fetching referee statistics...');
                    const refereeStats = await DefaultService.getRefereeStats(match.refereeID, API_KEY);
                    refereeData = refereeStats?.data || null;
                    console.log('✅ Referee statistics retrieved');
                } catch (error) {
                    console.warn('⚠️ Referee statistics could not be retrieved:', error);
                }
            }

            // Step 4: Calculate analytics based on available data
            const analytics = this.calculateMatchAnalytics(match, homeTeamData, awayTeamData, refereeData);

            // Step 5: Get total matches for metadata
            let totalMatchesToday = 0;
            try {
                const todaysMatches = await DefaultService.getTodaysMatches(
                    API_KEY,
                    undefined,
                    new Date().toISOString().split('T')[0],
                    1
                );
                totalMatchesToday = Array.isArray(todaysMatches?.data) ? todaysMatches.data.length : 0;
            } catch (error) {
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

        } catch (error) {
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
    }

    /**
     * Calculate match analytics based on available data
     */
    private calculateMatchAnalytics(match: any, homeTeam: any, awayTeam: any, referee: any) {
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
            } catch (error) {
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
    private calculateRealAnalytics(match: any, homeTeam: any, awayTeam: any, referee: any) {
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
    private calculateRealCornerAnalytics(match: any, homeTeam: any, awayTeam: any) {
        // Use actual match data if available
        if (match?.team_a_corners !== undefined && match?.team_b_corners !== undefined) {
            return {
                totalExpected: match.team_a_corners + match.team_b_corners,
                homeExpected: match.team_a_corners,
                awayExpected: match.team_b_corners
            };
        }

        // Calculate from team statistics if available
        let homeExpected = 5.5; // Default
        let awayExpected = 5.0; // Default

        if (homeTeam?.lastXMatches && Array.isArray(homeTeam.lastXMatches)) {
            homeExpected = this.calculateAverageCorners(homeTeam.lastXMatches, 'home');
        }

        if (awayTeam?.lastXMatches && Array.isArray(awayTeam.lastXMatches)) {
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
    private calculateRealCardAnalytics(match: any, homeTeam: any, awayTeam: any, referee: any) {
        // Use actual match data if available
        if (match?.team_a_cards_num !== undefined && match?.team_b_cards_num !== undefined) {
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
        if (referee?.average_cards_per_game) {
            baseCards = referee.average_cards_per_game;
        }

        // Adjust based on team discipline if available
        if (homeTeam?.disciplinaryRecord && awayTeam?.disciplinaryRecord) {
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
    private calculateRealGoalAnalytics(match: any, homeTeam: any, awayTeam: any) {
        // Use actual match data if available
        if (match?.homeGoalCount !== undefined && match?.awayGoalCount !== undefined) {
            const totalGoals = match.homeGoalCount + match.awayGoalCount;
            return {
                expectedGoals: totalGoals,
                over25Probability: totalGoals > 2.5 ? 1.0 : 0.0,
                bttsLikelihood: (match.homeGoalCount > 0 && match.awayGoalCount > 0) ? 1.0 : 0.0
            };
        }

        // Calculate from team statistics
        const homeAvgGoals = this.calculateAverageGoals(homeTeam?.lastXMatches, 'home');
        const awayAvgGoals = this.calculateAverageGoals(awayTeam?.lastXMatches, 'away');
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
    private calculateAverageGoals(matches: any, venue: 'home' | 'away'): number {
        if (!Array.isArray(matches) || matches.length === 0) {
            // Return league average based on venue
            return venue === 'home' ? 1.45 : 1.25;
        }

        try {
            const totalGoals = matches.reduce((sum: number, match: any) => {
                const goals = venue === 'home' ?
                    (match.homeGoalCount || match.homeGoals || 0) :
                    (match.awayGoalCount || match.awayGoals || 0);
                return sum + (typeof goals === 'number' ? goals : 0);
            }, 0);

            return totalGoals / matches.length;
        } catch (error) {
            console.warn('⚠️ Error calculating average goals:', error);
            return venue === 'home' ? 1.45 : 1.25;
        }
    }

    /**
     * Calculate average corners from recent matches
     */
    private calculateAverageCorners(matches: any, venue: 'home' | 'away'): number {
        if (!Array.isArray(matches) || matches.length === 0) {
            return venue === 'home' ? 5.5 : 5.0;
        }

        try {
            const totalCorners = matches.reduce((sum: number, match: any) => {
                const corners = venue === 'home' ?
                    (match.team_a_corners || 0) :
                    (match.team_b_corners || 0);
                return sum + (typeof corners === 'number' ? corners : 0);
            }, 0);

            return totalCorners / matches.length;
        } catch (error) {
            console.warn('⚠️ Error calculating average corners:', error);
            return venue === 'home' ? 5.5 : 5.0;
        }
    }

    /**
     * Calculate Over 2.5 goals probability based on expected goals
     */
    private calculateOver25Probability(expectedGoals: number): number {
        // Use Poisson distribution approximation
        if (expectedGoals <= 1.5) return 0.2;
        if (expectedGoals <= 2.0) return 0.35;
        if (expectedGoals <= 2.5) return 0.5;
        if (expectedGoals <= 3.0) return 0.65;
        if (expectedGoals <= 3.5) return 0.75;
        return 0.85;
    }

    /**
     * Calculate BTTS likelihood based on team goal averages
     */
    private calculateBTTSLikelihood(homeAvgGoals: number, awayAvgGoals: number): number {
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
    async testAllEndpoints(): Promise<{
        success: boolean;
        endpointResults: Record<string, any>;
        totalEndpoints: number;
        successfulEndpoints: number;
        failedEndpoints: string[];
        summary: string;
    }> {
        console.log('🧪 TESTING ALL FOOTYSTATS API ENDPOINTS');
        console.log('='.repeat(60));

        const endpointResults: Record<string, any> = {};
        const failedEndpoints: string[] = [];
        let successfulEndpoints = 0;

        // 1. BASIC ENDPOINTS
        console.log('\n📋 TESTING BASIC ENDPOINTS...');
        
        // Get Leagues
        try {
            console.log('🔍 Testing getLeagues...');
            const leagues = await DefaultService.getLeagues(API_KEY);
            endpointResults.getLeagues = {
                success: true,
                dataCount: Array.isArray(leagues.data) ? leagues.data.length : 0,
                hasData: !!leagues.data
            };
            console.log(`✅ getLeagues: Found ${endpointResults.getLeagues.dataCount} leagues`);
            successfulEndpoints++;
        } catch (error) {
            console.error(`❌ getLeagues failed:`, error);
            endpointResults.getLeagues = { success: false, error: error instanceof Error ? error.message : String(error) };
            failedEndpoints.push('getLeagues');
        }

        // Get Countries
        try {
            console.log('🔍 Testing getCountries...');
            const countries = await DefaultService.getCountries(API_KEY);
            endpointResults.getCountries = {
                success: true,
                dataCount: Array.isArray(countries.data) ? countries.data.length : 0,
                hasData: !!countries.data
            };
            console.log(`✅ getCountries: Found ${endpointResults.getCountries.dataCount} countries`);
            successfulEndpoints++;
        } catch (error) {
            console.error(`❌ getCountries failed:`, error);
            endpointResults.getCountries = { success: false, error: error instanceof Error ? error.message : String(error) };
            failedEndpoints.push('getCountries');
        }

        // Get Today's Matches
        try {
            console.log('🔍 Testing getTodaysMatches...');
            const todaysMatches = await DefaultService.getTodaysMatches(
                API_KEY,
                undefined,
                new Date().toISOString().split('T')[0],
                1
            );
            endpointResults.getTodaysMatches = {
                success: true,
                dataCount: Array.isArray(todaysMatches.data) ? todaysMatches.data.length : 0,
                hasData: !!todaysMatches.data
            };
            console.log(`✅ getTodaysMatches: Found ${endpointResults.getTodaysMatches.dataCount} matches`);
            successfulEndpoints++;
        } catch (error) {
            console.error(`❌ getTodaysMatches failed:`, error);
            endpointResults.getTodaysMatches = { success: false, error: error instanceof Error ? error.message : String(error) };
            failedEndpoints.push('getTodaysMatches');
        }

        // 2. STATISTICS ENDPOINTS
        console.log('\n📊 TESTING STATISTICS ENDPOINTS...');

        // BTTS Stats
        try {
            console.log('🔍 Testing getBttsStats...');
            const bttsStats = await DefaultService.getBttsStats(API_KEY);
            endpointResults.getBttsStats = {
                success: true,
                hasData: !!bttsStats.data,
                dataType: typeof bttsStats.data
            };
            console.log(`✅ getBttsStats: BTTS statistics retrieved`);
            successfulEndpoints++;
        } catch (error) {
            console.error(`❌ getBttsStats failed:`, error);
            endpointResults.getBttsStats = { success: false, error: error instanceof Error ? error.message : String(error) };
            failedEndpoints.push('getBttsStats');
        }

        // Over 2.5 Stats
        try {
            console.log('🔍 Testing getOver25Stats...');
            const over25Stats = await DefaultService.getOver25Stats(API_KEY);
            endpointResults.getOver25Stats = {
                success: true,
                hasData: !!over25Stats.data,
                dataType: typeof over25Stats.data
            };
            console.log(`✅ getOver25Stats: Over 2.5 statistics retrieved`);
            successfulEndpoints++;
        } catch (error) {
            console.error(`❌ getOver25Stats failed:`, error);
            endpointResults.getOver25Stats = { success: false, error: error instanceof Error ? error.message : String(error) };
            failedEndpoints.push('getOver25Stats');
        }

        // 3. CONDITIONAL TESTING (with actual data)
        console.log('\n🎯 TESTING CONDITIONAL ENDPOINTS WITH REAL DATA...');

        // Try to get a real league season for testing
        let testSeasonId: number | null = null;
        if (endpointResults.getLeagues?.success && endpointResults.getLeagues.dataCount > 0) {
            try {
                const leagues = await DefaultService.getLeagues(API_KEY);
                if (leagues.data && Array.isArray(leagues.data) && leagues.data.length > 0) {
                    // Try to find a league with recent data (Premier League, La Liga, etc.)
                    const majorLeague = leagues.data.find((league: any) => 
                        league.name?.toLowerCase().includes('premier') ||
                        league.name?.toLowerCase().includes('la liga') ||
                        league.name?.toLowerCase().includes('bundesliga') ||
                        league.id < 100 // Often major leagues have lower IDs
                    ) || leagues.data[0];
                    
                    if (majorLeague?.id) {
                        testSeasonId = majorLeague.id;
                        console.log(`🎯 Selected test league: ${majorLeague.name || 'Unknown'} (ID: ${testSeasonId})`);
                    }
                }
            } catch (error) {
                console.warn('⚠️ Could not select test league for conditional testing');
            }
        }

        // League Season (if we have a league ID)
        if (testSeasonId) {
            try {
                console.log(`🔍 Testing getLeagueSeason with ID ${testSeasonId}...`);
                const leagueSeason = await DefaultService.getLeagueSeason(testSeasonId, API_KEY);
                endpointResults.getLeagueSeason = {
                    success: true,
                    hasData: !!leagueSeason.data,
                    testSeasonId
                };
                console.log(`✅ getLeagueSeason: Season data retrieved for league ${testSeasonId}`);
                successfulEndpoints++;
            } catch (error) {
                console.error(`❌ getLeagueSeason failed:`, error);
                endpointResults.getLeagueSeason = { success: false, error: error instanceof Error ? error.message : String(error), testSeasonId };
                failedEndpoints.push('getLeagueSeason');
            }

            // League Matches
            try {
                console.log(`🔍 Testing getLeagueMatches with ID ${testSeasonId}...`);
                const leagueMatches = await DefaultService.getLeagueMatches(testSeasonId, API_KEY, 1, 50);
                endpointResults.getLeagueMatches = {
                    success: true,
                    dataCount: Array.isArray(leagueMatches.data) ? leagueMatches.data.length : 0,
                    hasData: !!leagueMatches.data,
                    testSeasonId
                };
                console.log(`✅ getLeagueMatches: Found ${endpointResults.getLeagueMatches.dataCount} matches for league ${testSeasonId}`);
                successfulEndpoints++;
            } catch (error) {
                console.error(`❌ getLeagueMatches failed:`, error);
                endpointResults.getLeagueMatches = { success: false, error: error instanceof Error ? error.message : String(error), testSeasonId };
                failedEndpoints.push('getLeagueMatches');
            }

            // League Teams
            try {
                console.log(`🔍 Testing getLeagueTeams with ID ${testSeasonId}...`);
                const leagueTeams = await DefaultService.getLeagueTeams(testSeasonId, API_KEY, 1);
                endpointResults.getLeagueTeams = {
                    success: true,
                    dataCount: Array.isArray(leagueTeams.data) ? leagueTeams.data.length : 0,
                    hasData: !!leagueTeams.data,
                    testSeasonId
                };
                console.log(`✅ getLeagueTeams: Found ${endpointResults.getLeagueTeams.dataCount} teams for league ${testSeasonId}`);
                successfulEndpoints++;
            } catch (error) {
                console.error(`❌ getLeagueTeams failed:`, error);
                endpointResults.getLeagueTeams = { success: false, error: error instanceof Error ? error.message : String(error), testSeasonId };
                failedEndpoints.push('getLeagueTeams');
            }

            // League Tables
            try {
                console.log(`🔍 Testing getLeagueTables with ID ${testSeasonId}...`);
                const leagueTables = await DefaultService.getLeagueTables(testSeasonId, API_KEY);
                endpointResults.getLeagueTables = {
                    success: true,
                    hasData: !!leagueTables.data,
                    testSeasonId
                };
                console.log(`✅ getLeagueTables: League tables retrieved for league ${testSeasonId}`);
                successfulEndpoints++;
            } catch (error) {
                console.error(`❌ getLeagueTables failed:`, error);
                endpointResults.getLeagueTables = { success: false, error: error instanceof Error ? error.message : String(error), testSeasonId };
                failedEndpoints.push('getLeagueTables');
            }            // League Players
            try {
                console.log(`🔍 Testing getLeaguePlayers with ID ${testSeasonId}...`);
                const leaguePlayers = await DefaultService.getLeaguePlayers(testSeasonId, API_KEY);
                endpointResults.getLeaguePlayers = {
                    success: true,
                    dataCount: Array.isArray(leaguePlayers.data) ? leaguePlayers.data.length : 0,
                    hasData: !!leaguePlayers.data,
                    testSeasonId
                };
                console.log(`✅ getLeaguePlayers: Found ${endpointResults.getLeaguePlayers.dataCount} players for league ${testSeasonId}`);
                successfulEndpoints++;
            } catch (error) {
                console.error(`❌ getLeaguePlayers failed:`, error);
                endpointResults.getLeaguePlayers = { success: false, error: error instanceof Error ? error.message : String(error), testSeasonId };
                failedEndpoints.push('getLeaguePlayers');
            }

            // League Referees
            try {
                console.log(`🔍 Testing getLeagueReferees with ID ${testSeasonId}...`);
                const leagueReferees = await DefaultService.getLeagueReferees(testSeasonId, API_KEY);
                endpointResults.getLeagueReferees = {
                    success: true,
                    dataCount: Array.isArray(leagueReferees.data) ? leagueReferees.data.length : 0,
                    hasData: !!leagueReferees.data,
                    testSeasonId
                };
                console.log(`✅ getLeagueReferees: Found ${endpointResults.getLeagueReferees.dataCount} referees for league ${testSeasonId}`);
                successfulEndpoints++;
            } catch (error) {
                console.error(`❌ getLeagueReferees failed:`, error);
                endpointResults.getLeagueReferees = { success: false, error: error instanceof Error ? error.message : String(error), testSeasonId };
                failedEndpoints.push('getLeagueReferees');
            }
        } else {
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
        let testMatchId: number | null = null;
        let testTeamId: number | null = null;
        let testPlayerId: number | null = null;
        let testRefereeId: number | null = null;

        if (endpointResults.getTodaysMatches?.success && endpointResults.getTodaysMatches.dataCount > 0) {
            try {
                const todaysMatches = await DefaultService.getTodaysMatches(API_KEY, undefined, new Date().toISOString().split('T')[0], 1);
                if (todaysMatches.data && Array.isArray(todaysMatches.data) && todaysMatches.data.length > 0) {
                    const firstMatch = todaysMatches.data[0];
                    testMatchId = firstMatch.id;
                    testTeamId = firstMatch.homeID || firstMatch.awayID;
                    testRefereeId = firstMatch.refereeID;
                    console.log(`🎯 Selected test IDs - Match: ${testMatchId}, Team: ${testTeamId}, Referee: ${testRefereeId}`);
                }
            } catch (error) {
                console.warn('⚠️ Could not extract test IDs from today\'s matches');
            }
        }

        // Match Details
        if (testMatchId) {
            try {
                console.log(`🔍 Testing getMatch with ID ${testMatchId}...`);
                const matchDetails = await DefaultService.getMatch(testMatchId, API_KEY);
                endpointResults.getMatch = {
                    success: true,
                    hasData: !!matchDetails.data,
                    testMatchId
                };
                console.log(`✅ getMatch: Match details retrieved for match ${testMatchId}`);
                successfulEndpoints++;
            } catch (error) {
                console.error(`❌ getMatch failed:`, error);
                endpointResults.getMatch = { success: false, error: error instanceof Error ? error.message : String(error), testMatchId };
                failedEndpoints.push('getMatch');
            }
        } else {
            console.log('⚠️ Skipping getMatch (no test match ID available)');
            endpointResults.getMatch = { success: false, error: 'No test match ID available', skipped: true };
            failedEndpoints.push('getMatch');
        }

        // Team Details
        if (testTeamId) {
            try {
                console.log(`🔍 Testing getTeam with ID ${testTeamId}...`);
                const teamDetails = await DefaultService.getTeam(testTeamId, API_KEY);
                endpointResults.getTeam = {
                    success: true,
                    hasData: !!teamDetails.data,
                    testTeamId
                };
                console.log(`✅ getTeam: Team details retrieved for team ${testTeamId}`);
                successfulEndpoints++;
            } catch (error) {
                console.error(`❌ getTeam failed:`, error);
                endpointResults.getTeam = { success: false, error: error instanceof Error ? error.message : String(error), testTeamId };
                failedEndpoints.push('getTeam');
            }

            // Team Last X Stats
            try {
                console.log(`🔍 Testing getTeamLastXStats with ID ${testTeamId}...`);
                const teamStats = await DefaultService.getTeamLastXStats(testTeamId, API_KEY);
                endpointResults.getTeamLastXStats = {
                    success: true,
                    hasData: !!teamStats.data,
                    testTeamId
                };
                console.log(`✅ getTeamLastXStats: Team stats retrieved for team ${testTeamId}`);
                successfulEndpoints++;
            } catch (error) {
                console.error(`❌ getTeamLastXStats failed:`, error);
                endpointResults.getTeamLastXStats = { success: false, error: error instanceof Error ? error.message : String(error), testTeamId };
                failedEndpoints.push('getTeamLastXStats');
            }
        } else {
            console.log('⚠️ Skipping team endpoints (no test team ID available)');
            endpointResults.getTeam = { success: false, error: 'No test team ID available', skipped: true };
            endpointResults.getTeamLastXStats = { success: false, error: 'No test team ID available', skipped: true };
            failedEndpoints.push('getTeam', 'getTeamLastXStats');
        }

        // Referee Stats
        if (testRefereeId) {
            try {
                console.log(`🔍 Testing getRefereeStats with ID ${testRefereeId}...`);
                const refereeStats = await DefaultService.getRefereeStats(testRefereeId, API_KEY);
                endpointResults.getRefereeStats = {
                    success: true,
                    hasData: !!refereeStats.data,
                    testRefereeId
                };
                console.log(`✅ getRefereeStats: Referee stats retrieved for referee ${testRefereeId}`);
                successfulEndpoints++;
            } catch (error) {
                console.error(`❌ getRefereeStats failed:`, error);
                endpointResults.getRefereeStats = { success: false, error: error instanceof Error ? error.message : String(error), testRefereeId };
                failedEndpoints.push('getRefereeStats');
            }
        } else {
            console.log('⚠️ Skipping getRefereeStats (no test referee ID available)');
            endpointResults.getRefereeStats = { success: false, error: 'No test referee ID available', skipped: true };
            failedEndpoints.push('getRefereeStats');
        }        // Player Stats (try with a known player ID or skip)
        if (endpointResults.getLeaguePlayers?.success && endpointResults.getLeaguePlayers.dataCount > 0) {
            try {
                const leaguePlayers = await DefaultService.getLeaguePlayers(testSeasonId!, API_KEY);
                if (leaguePlayers.data && Array.isArray(leaguePlayers.data) && leaguePlayers.data.length > 0) {
                    testPlayerId = leaguePlayers.data[0].id;
                }
            } catch (error) {
                console.warn('⚠️ Could not get test player ID');
            }
        }

        if (testPlayerId) {
            try {
                console.log(`🔍 Testing getPlayerStats with ID ${testPlayerId}...`);
                const playerStats = await DefaultService.getPlayerStats(testPlayerId, API_KEY);
                endpointResults.getPlayerStats = {
                    success: true,
                    hasData: !!playerStats.data,
                    testPlayerId
                };
                console.log(`✅ getPlayerStats: Player stats retrieved for player ${testPlayerId}`);
                successfulEndpoints++;
            } catch (error) {
                console.error(`❌ getPlayerStats failed:`, error);
                endpointResults.getPlayerStats = { success: false, error: error instanceof Error ? error.message : String(error), testPlayerId };
                failedEndpoints.push('getPlayerStats');
            }
        } else {
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
   • Basic endpoints (leagues, countries, matches): ${['getLeagues', 'getCountries', 'getTodaysMatches'].every(e => endpointResults[e]?.success) ? '✅ WORKING' : '❌ ISSUES'}
   • Statistics endpoints (BTTS, Over 2.5): ${['getBttsStats', 'getOver25Stats'].every(e => endpointResults[e]?.success) ? '✅ WORKING' : '❌ ISSUES'}
   • League data endpoints: ${['getLeagueSeason', 'getLeagueMatches', 'getLeagueTeams'].some(e => endpointResults[e]?.success) ? '✅ PARTIAL/WORKING' : '❌ ISSUES'}
   • Entity-specific endpoints: ${['getMatch', 'getTeam', 'getTeamLastXStats'].some(e => endpointResults[e]?.success) ? '✅ PARTIAL/WORKING' : '❌ ISSUES'}

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
    }

    /**
     * ✅ CHECK IF MATCH IS ESPORTS/VIRTUAL
     * Filters out esports, virtual football, and esoccer matches
     */
    private isEsportsMatch(match: any): boolean {
        const homeTeam = (match.home_name || '').toLowerCase();
        const awayTeam = (match.away_name || '').toLowerCase();
        const competition = (match.competition_name || '').toLowerCase();

        // Keywords that indicate esports/virtual matches
        const esportsKeywords = [
            'esport', 'esports', 'e-sport', 'e-sports',
            'virtual', 'esoccer', 'e-soccer',
            'battle', 'cyber', 'digital',
            'fifa', 'pes', 'pro evolution',
            'simulation', 'sim', 'online'
        ];

        // Check for usernames in parentheses (common in FIFA/esports)
        const hasUsernames = /\([^)]+\)/.test(homeTeam) || /\([^)]+\)/.test(awayTeam);

        // Check if any keyword appears in team names or competition
        const textToCheck = `${homeTeam} ${awayTeam} ${competition}`;
        const hasKeywords = esportsKeywords.some(keyword => textToCheck.includes(keyword));

        return hasKeywords || hasUsernames;
    }

    /**
     * 🔍 ANALYZE ALL MATCHES (INCLUDING ESPORTS) FOR RESEARCH
     * Temporary method to analyze real vs FIFA matches without filtering
     */
    async analyzeAllMatchesIncludingEsports(hoursAhead: number = 24): Promise<{
        totalMatches: number;
        realFootball: number;
        esportsMatches: number;
        realMatches: any[];
        esportsMatchesList: any[];
        analysis: any;
    }> {
        try {
            console.log(`🔍 ANALYZING ALL MATCHES (including esports) for next ${hoursAhead} hours...`);

            const currentTime = Math.floor(Date.now() / 1000);
            const futureTime = currentTime + (hoursAhead * 3600);

            let allUpcomingMatches: any[] = [];
            const today = new Date();

            // Collect matches for the specified time period
            for (let i = 0; i < Math.ceil(hoursAhead / 24); i++) {
                const checkDate = new Date(today);
                checkDate.setDate(today.getDate() + i);
                const dateStr = checkDate.toISOString().split('T')[0];

                console.log(`📅 Checking matches for ${dateStr}...`);

                const todaysMatches = await DefaultService.getTodaysMatches(
                    API_KEY,
                    undefined,
                    dateStr,
                    1
                );

                if (todaysMatches?.data && Array.isArray(todaysMatches.data)) {
                    allUpcomingMatches.push(...todaysMatches.data);
                    console.log(`📊 Found ${todaysMatches.data.length} matches for ${dateStr}`);
                }
            }

            console.log(`📊 Total matches collected: ${allUpcomingMatches.length}`);

            // Filter for upcoming matches (but don't exclude esports yet)
            const upcomingMatches = allUpcomingMatches.filter((match: any) => {
                const status = match.status?.toLowerCase() || '';
                const matchTime = match.date_unix || 0;
                const isFuture = matchTime > currentTime;
                const isWithinRange = matchTime <= futureTime;

                // ✅ CRITICAL FIX: 'incomplete' is only upcoming if match hasn't started yet
                // If 'incomplete' + started = it's LIVE, not upcoming
                const isScheduled = status === 'incomplete' && isFuture;

                return isScheduled && isWithinRange;
            });

            // Now separate real vs esports
            const realMatches: any[] = [];
            const esportsMatchesList: any[] = [];

            upcomingMatches.forEach((match: any) => {
                if (this.isEsportsMatch(match)) {
                    esportsMatchesList.push(match);
                } else {
                    realMatches.push(match);
                }
            });

            // Create analysis
            const analysis = {
                timeWindow: `${hoursAhead} hours`,
                totalUpcoming: upcomingMatches.length,
                realFootballCount: realMatches.length,
                esportsCount: esportsMatchesList.length,
                realFootballPercentage: Math.round((realMatches.length / upcomingMatches.length) * 100),
                esportsPercentage: Math.round((esportsMatchesList.length / upcomingMatches.length) * 100),
                sampleRealMatches: realMatches.slice(0, 5).map(m => ({
                    home: m.home_name,
                    away: m.away_name,
                    competition: m.competition_name,
                    time: new Date(m.date_unix * 1000).toLocaleString()
                })),
                sampleEsportsMatches: esportsMatchesList.slice(0, 5).map(m => ({
                    home: m.home_name,
                    away: m.away_name,
                    competition: m.competition_name,
                    time: new Date(m.date_unix * 1000).toLocaleString()
                }))
            };

            console.log(`🎯 ANALYSIS COMPLETE:`);
            console.log(`   📊 Total upcoming matches: ${upcomingMatches.length}`);
            console.log(`   ⚽ Real football: ${realMatches.length} (${analysis.realFootballPercentage}%)`);
            console.log(`   🎮 Esports/FIFA: ${esportsMatchesList.length} (${analysis.esportsPercentage}%)`);

            return {
                totalMatches: upcomingMatches.length,
                realFootball: realMatches.length,
                esportsMatches: esportsMatchesList.length,
                realMatches,
                esportsMatchesList,
                analysis
            };

        } catch (error) {
            console.error('❌ Error in analyzeAllMatchesIncludingEsports:', error);
            throw error;
        }
    }

}

// Export a singleton instance
export const matchAnalysisService = new MatchAnalysisService();
