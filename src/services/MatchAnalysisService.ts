/**
 * 🎯 CLEAN MATCH ANALYSIS SERVICE
 * 
 * Essential functionality for match analysis without problematic test methods
 * Focuses on core features: overview, H2H, corners, goals analysis
 */

import { DefaultService } from '../apis/footy';
import { requestDeduplication } from './RequestDeduplicationService';

const API_KEY = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756';

// ✅ CORE INTERFACES
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
        h2hMatches: any[];
        analysisTimestamp: string;
        predictions: {
            corners_potential: number;
            over15_potential: number;
            over25_potential: number;
            over35_potential: number;
            over45_potential: number;
            under15_potential: number;
            under25_potential: number;
            under35_potential: number;
            btts_potential: number;
            trends: any;
        };
    };
    error?: string;
}

export interface MatchAnalysisOptions {
    matchId: number;
    includeTeamStats?: boolean;
    includePlayerStats?: boolean;
    includeRefereeStats?: boolean;
    includeH2H?: boolean;
    range?: 5 | 10;
}

export interface H2HAnalysisOptions {
    homeId: number;
    awayId: number;
    range?: 5 | 10;
}

export interface MatchAnalysisResult {
    success: boolean;
    data?: any;
    error?: string;
}

export interface CornerAnalysisOptions {
    matchId: number;
    range?: 5 | 10;
}

export interface GoalAnalysisOptions {
    matchId: number;
    range?: 5 | 10;
}

export class MatchAnalysisService {

    /**
     * Get basic match info (missing method)
     */
    async getBasicMatchInfo(date?: string): Promise<BasicMatchInfo> {
        try {
            console.log(`🔍 Getting basic match info for date: ${date || 'today'}`);

            // Get today's matches as basic info
            const response = await DefaultService.getTodaysMatches({
                key: API_KEY,
                timezone: 'America/Sao_Paulo',
                date: date || new Date().toISOString().split('T')[0]
            });

            if (!response?.data) {
                return {
                    success: false,
                    error: 'No matches found'
                };
            }

            const matches = Array.isArray(response.data) ? response.data : [response.data];

            return {
                success: true,
                totalMatches: matches.length,
                selectedMatch: matches[0] || null
            };
        } catch (error) {
            console.error('❌ Error getting basic match info:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get basic match info'
            };
        }
    }

    /**
     * Get match analysis (alias for getDetailedMatchInfo)
     */
    async getMatchAnalysis(options: MatchAnalysisOptions): Promise<MatchAnalysisResult> {
        try {
            const result = await this.getDetailedMatchInfo(options.matchId);
            return {
                success: result.success,
                data: result.data,
                error: result.error
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get match analysis'
            };
        }
    }

    /**
     * Get live matches
     */
    async getLiveMatches(limit?: number): Promise<any[]> {
        try {
            console.log(`🔴 Getting live matches (limit: ${limit || 'all'})`);

            const response = await DefaultService.getTodaysMatches({
                key: API_KEY,
                timezone: 'America/Sao_Paulo',
                date: new Date().toISOString().split('T')[0]
            });

            if (!response?.data) {
                return [];
            }

            const matches = Array.isArray(response.data) ? response.data : [response.data];
            const liveMatches = matches.filter((match: any) =>
                match.status === 'live' ||
                match.status === 'inplay' ||
                match.status === '1st Half' ||
                match.status === '2nd Half'
            );

            return limit ? liveMatches.slice(0, limit) : liveMatches;
        } catch (error) {
            console.error('❌ Error getting live matches:', error);
            return [];
        }
    }

    /**
     * Get upcoming matches
     */
    async getUpcomingMatches(limit?: number, hours?: number): Promise<any[]> {
        try {
            console.log(`⏰ Getting upcoming matches (limit: ${limit || 'all'}, hours: ${hours || 24})`);

            const response = await DefaultService.getTodaysMatches({
                key: API_KEY,
                timezone: 'America/Sao_Paulo',
                date: new Date().toISOString().split('T')[0]
            });

            if (!response?.data) {
                return [];
            }

            const matches = Array.isArray(response.data) ? response.data : [response.data];
            const now = new Date();
            const maxTime = new Date(now.getTime() + (hours || 24) * 60 * 60 * 1000);

            const upcomingMatches = matches.filter((match: any) => {
                const matchTime = new Date(match.date_unix * 1000);
                return matchTime > now && matchTime <= maxTime &&
                       (match.status === 'Not Started' || match.status === 'NS');
            });

            return limit ? upcomingMatches.slice(0, limit) : upcomingMatches;
        } catch (error) {
            console.error('❌ Error getting upcoming matches:', error);
            return [];
        }
    }

    /**
     * Get total match count
     */
    async getTotalMatchCount(date?: string): Promise<{ totalMatches: number; success: boolean }> {
        try {
            const response = await DefaultService.getTodaysMatches({
                key: API_KEY,
                timezone: 'America/Sao_Paulo',
                date: date || new Date().toISOString().split('T')[0]
            });

            if (!response?.data) {
                return { totalMatches: 0, success: false };
            }

            const matches = Array.isArray(response.data) ? response.data : [response.data];
            return { totalMatches: matches.length, success: true };
        } catch (error) {
            console.error('❌ Error getting total match count:', error);
            return { totalMatches: 0, success: false };
        }
    }

    /**
     * Debug today's matches
     */
    async debugTodaysMatches(): Promise<any> {
        try {
            const response = await DefaultService.getTodaysMatches({
                key: API_KEY,
                timezone: 'America/Sao_Paulo',
                date: new Date().toISOString().split('T')[0]
            });

            return {
                success: true,
                data: response?.data || [],
                debug: {
                    timestamp: new Date().toISOString(),
                    apiKey: API_KEY.substring(0, 8) + '...',
                    responseType: typeof response?.data,
                    isArray: Array.isArray(response?.data)
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Debug failed'
            };
        }
    }

    /**
     * Get detailed match analysis
     */
    async getDetailedMatchInfo(matchId: number): Promise<DetailedMatchInfo> {
        console.log(`🔍 Getting PRE-MATCH ANALYSIS for match ID: ${matchId}`);
        try {
            if (!matchId || isNaN(matchId) || matchId <= 0) {
                console.error(`❌ Invalid matchId: ${matchId}`);
                return {
                    success: false,
                    error: `Invalid match ID: ${matchId}`
                };
            }

            console.log(`🔍 Calling FootyStats API for PRE-MATCH data ${matchId}...`);

            const requestKey = `match-details-${matchId}`;
            const matchDetails = await requestDeduplication.executeRequest(
                requestKey,
                () => DefaultService.getMatch({
                    matchId: matchId,
                    key: API_KEY
                }),
                { timeout: 15000, logDuplicates: true }
            );

            console.log('✅ Got PRE-MATCH details from FootyStats API');

            if (!matchDetails?.data) {
                return {
                    success: false,
                    error: 'No match data returned from API'
                };
            }

            const match = matchDetails.data as any;
            console.log(`📊 PRE-MATCH Analysis: ${match.home_name} vs ${match.away_name}`);

            // Get team recent form for enhanced predictions
            let homeTeamStats = null;
            let awayTeamStats = null;

            try {
                console.log('📈 Fetching team recent form for enhanced predictions...');
                const [homeStats, awayStats] = await Promise.all([
                    DefaultService.getTeamLastXStats({
                        teamId: match.homeID,
                        key: API_KEY
                    }).catch(e => {
                        console.warn(`⚠️ Could not get home team stats for ${match.homeID}:`, e.message);
                        return null;
                    }),
                    DefaultService.getTeamLastXStats({
                        teamId: match.awayID,
                        key: API_KEY
                    }).catch(e => {
                        console.warn(`⚠️ Could not get away team stats for ${match.awayID}:`, e.message);
                        return null;
                    })
                ]);

                homeTeamStats = homeStats?.data || null;
                awayTeamStats = awayStats?.data || null;
                console.log('✅ Team recent form retrieved for enhanced predictions');
            } catch (error) {
                console.warn('⚠️ Team stats could not be retrieved:', error);
            }

            const h2hMatches = match.h2h || [];
            console.log(`📊 H2H Matches found: ${Array.isArray(h2hMatches) ? h2hMatches.length : 0}`);

            return {
                success: true,
                data: {
                    matchDetails: match,
                    homeTeam: homeTeamStats,
                    awayTeam: awayTeamStats,
                    h2hMatches: Array.isArray(h2hMatches) ? h2hMatches : [],
                    analysisTimestamp: new Date().toISOString(),
                    predictions: {
                        corners_potential: match.corners_potential || 0,
                        over15_potential: match.o15_potential || 0,
                        over25_potential: match.o25_potential || 0,
                        over35_potential: match.o35_potential || 0,
                        over45_potential: match.o45_potential || 0,
                        under15_potential: match.u15_potential || 0,
                        under25_potential: match.u25_potential || 0,
                        under35_potential: match.u35_potential || 0,
                        btts_potential: match.btts_potential || 0,
                        trends: match.trends || null
                    }
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
     * Get comprehensive match overview data
     */
    async getMatchOverviewData(matchId: number): Promise<any> {
        try {
            console.log(`🎯 Getting comprehensive overview data for match ${matchId}`);

            const matchDetails = await DefaultService.getMatch({
                matchId: matchId,
                key: API_KEY
            });

            if (!matchDetails?.data) {
                return {
                    success: false,
                    error: 'Match not found'
                };
            }

            const match = Array.isArray(matchDetails.data) ? matchDetails.data[0] : matchDetails.data;
            const homeId = match.homeID;
            const awayId = match.awayID;

            // Get basic data from FootyStats endpoints
            const [homeTeamMatches, awayTeamMatches] = await Promise.all([
                DefaultService.getTeamLastXStats({
                    teamId: homeId,
                    key: API_KEY
                }).catch(err => {
                    console.warn(`Failed to get home team matches: ${err.message}`);
                    return { data: [] };
                }),
                DefaultService.getTeamLastXStats({
                    teamId: awayId,
                    key: API_KEY
                }).catch(err => {
                    console.warn(`Failed to get away team matches: ${err.message}`);
                    return { data: [] };
                })
            ]);

            // Calculate team form and statistics
            const homeForm = this.calculateTeamForm(homeTeamMatches?.data || []);
            const awayForm = this.calculateTeamForm(awayTeamMatches?.data || []);
            const homeTeamStats = this.extractTeamStatistics(homeTeamMatches?.data);
            const awayTeamStats = this.extractTeamStatistics(awayTeamMatches?.data);

            // Generate predictions
            const predictions = this.generateMatchPredictions(homeForm, awayForm, null);

            const overview = {
                matchInfo: {
                    id: match.id,
                    homeTeam: match.home_name,
                    awayTeam: match.away_name,
                    competition: match.competition_name,
                    date_unix: match.date_unix,
                    venue: match.stadium_name,
                    status: match.status,
                    league_id: match.league_id,
                    season_id: match.season_id
                },
                h2hSummary: {
                    totalMatches: 0,
                    homeWins: 0,
                    awayWins: 0,
                    draws: 0,
                    homeWinPercentage: 0,
                    awayWinPercentage: 0,
                    drawPercentage: 0
                },
                homeTeamForm: homeForm,
                awayTeamForm: awayForm,
                homeTeamStats: homeTeamStats,
                awayTeamStats: awayTeamStats,
                keyStatistics: {
                    corners: {
                        totalCornersExpected: homeTeamStats.averageCornersFor + awayTeamStats.averageCornersFor,
                        over9CornersLikelihood: 0.5,
                        over11CornersLikelihood: 0.3
                    },
                    goals: {
                        expectedGoals: homeTeamStats.averageGoalsFor + awayTeamStats.averageGoalsFor,
                        over15Likelihood: 0.5,
                        over25Likelihood: 0.4,
                        bttsLikelihood: 0.4
                    },
                    btts: {
                        likelihood: this.calculateBTTSLikelihood(homeTeamStats, awayTeamStats),
                        homeTeamScoring: homeTeamStats.averageGoalsFor > 1.0,
                        awayTeamScoring: awayTeamStats.averageGoalsFor > 1.0
                    },
                    over25: {
                        likelihood: this.calculateOver25Likelihood(homeTeamStats, awayTeamStats),
                        expectedTotalGoals: homeTeamStats.averageGoalsFor + awayTeamStats.averageGoalsFor
                    }
                },
                predictions: predictions,
                marketTrends: {
                    bttsPopularity: 0,
                    over25Popularity: 0,
                    marketConfidence: predictions.confidence,
                    dataQuality: predictions.dataQuality || 0.5
                }
            };

            return {
                success: true,
                data: overview
            };

        } catch (error) {
            console.error('❌ Error getting match overview data:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get match overview data'
            };
        }
    }

    /**
     * Get H2H analysis between two teams
     */
    async getH2HAnalysis(options: H2HAnalysisOptions): Promise<any> {
        try {
            console.log(`🎯 Getting H2H analysis: Team ${options.homeId} vs Team ${options.awayId} (last ${options.range || 5} matches)`);

            const [homeTeamMatches, awayTeamMatches] = await Promise.all([
                DefaultService.getTeamLastXStats({
                    teamId: options.homeId,
                    key: API_KEY
                }),
                DefaultService.getTeamLastXStats({
                    teamId: options.awayId,
                    key: API_KEY
                })
            ]);

            if (!homeTeamMatches?.data && !awayTeamMatches?.data) {
                return {
                    success: false,
                    error: 'No team match data available'
                };
            }

            const homeMatches = Array.isArray(homeTeamMatches?.data) ? homeTeamMatches.data : [];
            const awayMatches = Array.isArray(awayTeamMatches?.data) ? awayTeamMatches.data : [];

            const h2hMatches = homeMatches.filter((match: any) =>
                (match.homeID === options.homeId && match.awayID === options.awayId) ||
                (match.homeID === options.awayId && match.awayID === options.homeId)
            );

            const limitedMatches = h2hMatches.slice(0, options.range || 5);

            const homeWins = limitedMatches.filter((match: any) =>
                (match.homeID === options.homeId && match.homeGoalCount > match.awayGoalCount) ||
                (match.awayID === options.homeId && match.awayGoalCount > match.homeGoalCount)
            ).length;

            const awayWins = limitedMatches.filter((match: any) =>
                (match.homeID === options.awayId && match.homeGoalCount > match.awayGoalCount) ||
                (match.awayID === options.awayId && match.awayGoalCount > match.homeGoalCount)
            ).length;

            const draws = limitedMatches.filter((match: any) =>
                match.homeGoalCount === match.awayGoalCount
            ).length;

            return {
                success: true,
                data: {
                    matches: limitedMatches,
                    summary: {
                        totalMatches: limitedMatches.length,
                        homeWins,
                        awayWins,
                        draws,
                        homeWinPercentage: limitedMatches.length > 0 ? (homeWins / limitedMatches.length) * 100 : 0,
                        awayWinPercentage: limitedMatches.length > 0 ? (awayWins / limitedMatches.length) * 100 : 0,
                        drawPercentage: limitedMatches.length > 0 ? (draws / limitedMatches.length) * 100 : 0
                    }
                }
            };
        } catch (error) {
            console.error('❌ Error getting H2H analysis:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get H2H analysis'
            };
        }
    }

    /**
     * Get corner analysis for teams involved in a match
     */
    async getCornerAnalysis(options: CornerAnalysisOptions): Promise<any> {
        try {
            console.log(`🎯 Getting corner analysis for match ${options.matchId} (last ${options.range || 5} matches)`);

            const matchDetails = await DefaultService.getMatch({
                matchId: options.matchId,
                key: API_KEY
            });

            if (!matchDetails?.data) {
                return {
                    success: false,
                    error: 'Match not found'
                };
            }

            const match = Array.isArray(matchDetails.data) ? matchDetails.data[0] : matchDetails.data;
            const homeId = match.homeID;
            const awayId = match.awayID;

            const [homeMatches, awayMatches] = await Promise.all([
                DefaultService.getTeamLastXStats({
                    teamId: homeId,
                    key: API_KEY
                }),
                DefaultService.getTeamLastXStats({
                    teamId: awayId,
                    key: API_KEY
                })
            ]);

            const homeCornerStats = this.calculateCornerStats(homeMatches?.data || []);
            const awayCornerStats = this.calculateCornerStats(awayMatches?.data || []);

            return {
                success: true,
                data: {
                    homeTeam: {
                        id: homeId,
                        name: match.home_name,
                        cornerStats: homeCornerStats
                    },
                    awayTeam: {
                        id: awayId,
                        name: match.away_name,
                        cornerStats: awayCornerStats
                    },
                    predictions: {
                        totalCornersExpected: homeCornerStats.averageFor + awayCornerStats.averageFor,
                        over9CornersLikelihood: this.calculateCornerProbability(homeCornerStats, awayCornerStats, 9),
                        over11CornersLikelihood: this.calculateCornerProbability(homeCornerStats, awayCornerStats, 11)
                    }
                }
            };
        } catch (error) {
            console.error('❌ Error getting corner analysis:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get corner analysis'
            };
        }
    }

    /**
     * Get goal analysis for teams involved in a match
     */
    async getGoalAnalysis(options: GoalAnalysisOptions): Promise<any> {
        try {
            console.log(`🎯 Getting goal analysis for match ${options.matchId} (last ${options.range || 5} matches)`);

            const matchDetails = await DefaultService.getMatch({
                matchId: options.matchId,
                key: API_KEY
            });

            if (!matchDetails?.data) {
                return {
                    success: false,
                    error: 'Match not found'
                };
            }

            const match = Array.isArray(matchDetails.data) ? matchDetails.data[0] : matchDetails.data;
            const homeId = match.homeID;
            const awayId = match.awayID;

            const [homeMatches, awayMatches] = await Promise.all([
                DefaultService.getTeamLastXStats({
                    teamId: homeId,
                    key: API_KEY
                }),
                DefaultService.getTeamLastXStats({
                    teamId: awayId,
                    key: API_KEY
                })
            ]);

            const homeGoalStats = this.calculateGoalStats(homeMatches?.data || []);
            const awayGoalStats = this.calculateGoalStats(awayMatches?.data || []);

            return {
                success: true,
                data: {
                    homeTeam: {
                        id: homeId,
                        name: match.home_name,
                        goalStats: homeGoalStats
                    },
                    awayTeam: {
                        id: awayId,
                        name: match.away_name,
                        goalStats: awayGoalStats
                    },
                    predictions: {
                        expectedGoals: homeGoalStats.averageScored + awayGoalStats.averageScored,
                        over15Likelihood: this.calculateGoalProbability(homeGoalStats, awayGoalStats, 1.5),
                        over25Likelihood: this.calculateGoalProbability(homeGoalStats, awayGoalStats, 2.5),
                        bttsLikelihood: this.calculateBTTSProbability(homeGoalStats, awayGoalStats)
                    }
                }
            };
        } catch (error) {
            console.error('❌ Error getting goal analysis:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get goal analysis'
            };
        }
    }

    // ✅ HELPER METHODS

    private calculateTeamForm(matches: any[]): any {
        if (!matches || matches.length === 0) {
            return {
                wins: 0,
                draws: 0,
                losses: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                winPercentage: 0,
                form: ''
            };
        }

        let wins = 0;
        let draws = 0;
        let losses = 0;
        let goalsFor = 0;
        let goalsAgainst = 0;
        let formString = '';

        matches.slice(0, 5).forEach((match: any) => {
            const scored = match.goalsFor || 0;
            const conceded = match.goalsAgainst || 0;

            goalsFor += scored;
            goalsAgainst += conceded;

            if (scored > conceded) {
                wins++;
                formString += 'W';
            } else if (scored === conceded) {
                draws++;
                formString += 'D';
            } else {
                losses++;
                formString += 'L';
            }
        });

        const totalMatches = wins + draws + losses;
        const winPercentage = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

        return {
            wins,
            draws,
            losses,
            goalsFor,
            goalsAgainst,
            winPercentage,
            form: formString
        };
    }

    private extractTeamStatistics(matchData: any[]): any {
        if (!matchData || !Array.isArray(matchData) || matchData.length === 0) {
            return {
                averageGoalsFor: 0,
                averageGoalsAgainst: 0,
                averageCornersFor: 0,
                averageCornersAgainst: 0,
                cleanSheetPercentage: 0,
                disciplineRating: 0,
                homeAdvantage: 0
            };
        }

        const totalMatches = matchData.length;
        let totalGoalsFor = 0;
        let totalGoalsAgainst = 0;
        let totalCornersFor = 0;
        let totalCornersAgainst = 0;
        let cleanSheets = 0;

        matchData.forEach((match: any) => {
            totalGoalsFor += match.goalsFor || 0;
            totalGoalsAgainst += match.goalsAgainst || 0;
            totalCornersFor += match.cornersFor || 0;
            totalCornersAgainst += match.cornersAgainst || 0;
            if ((match.goalsAgainst || 0) === 0) cleanSheets++;
        });

        return {
            averageGoalsFor: totalMatches > 0 ? totalGoalsFor / totalMatches : 0,
            averageGoalsAgainst: totalMatches > 0 ? totalGoalsAgainst / totalMatches : 0,
            averageCornersFor: totalMatches > 0 ? totalCornersFor / totalMatches : 0,
            averageCornersAgainst: totalMatches > 0 ? totalCornersAgainst / totalMatches : 0,
            cleanSheetPercentage: totalMatches > 0 ? (cleanSheets / totalMatches) * 100 : 0,
            disciplineRating: 0,
            homeAdvantage: 0
        };
    }

    private generateMatchPredictions(homeForm: any, awayForm: any, h2hSummary: any): any {
        const homeAdvantage = 0.1;

        let homeWinProb = 0.33;
        let drawProb = 0.33;
        let awayWinProb = 0.33;

        if (homeForm.winPercentage > awayForm.winPercentage) {
            homeWinProb += 0.15;
            awayWinProb -= 0.1;
            drawProb -= 0.05;
        } else if (awayForm.winPercentage > homeForm.winPercentage) {
            awayWinProb += 0.15;
            homeWinProb -= 0.1;
            drawProb -= 0.05;
        }

        homeWinProb += homeAdvantage;
        awayWinProb -= homeAdvantage / 2;
        drawProb -= homeAdvantage / 2;

        const total = homeWinProb + drawProb + awayWinProb;
        homeWinProb = homeWinProb / total;
        drawProb = drawProb / total;
        awayWinProb = awayWinProb / total;

        const confidence = Math.min(0.9, 0.5 + (h2hSummary?.totalMatches || 0) * 0.05);

        return {
            homeWinProbability: Math.round(homeWinProb * 100) / 100,
            drawProbability: Math.round(drawProb * 100) / 100,
            awayWinProbability: Math.round(awayWinProb * 100) / 100,
            confidence: Math.round(confidence * 100) / 100,
            dataQuality: 0.7
        };
    }

    private calculateCornerStats(matches: any[]): any {
        if (!matches || matches.length === 0) {
            return {
                averageFor: 0,
                averageAgainst: 0,
                totalMatches: 0
            };
        }

        const totalCornersFor = matches.reduce((sum, match) => sum + (match.cornersFor || 0), 0);
        const totalCornersAgainst = matches.reduce((sum, match) => sum + (match.cornersAgainst || 0), 0);

        return {
            averageFor: totalCornersFor / matches.length,
            averageAgainst: totalCornersAgainst / matches.length,
            totalMatches: matches.length,
            totalCornersFor,
            totalCornersAgainst
        };
    }

    private calculateGoalStats(matches: any[]): any {
        if (!matches || matches.length === 0) {
            return {
                averageScored: 0,
                averageConceded: 0,
                totalMatches: 0
            };
        }

        const totalGoalsScored = matches.reduce((sum, match) => sum + (match.goalsFor || 0), 0);
        const totalGoalsConceded = matches.reduce((sum, match) => sum + (match.goalsAgainst || 0), 0);

        return {
            averageScored: totalGoalsScored / matches.length,
            averageConceded: totalGoalsConceded / matches.length,
            totalMatches: matches.length,
            totalGoalsScored,
            totalGoalsConceded
        };
    }

    private calculateCornerProbability(homeStats: any, awayStats: any, threshold: number): number {
        const expectedCorners = homeStats.averageFor + awayStats.averageFor;
        return expectedCorners > threshold ? 0.65 : 0.35;
    }

    private calculateGoalProbability(homeStats: any, awayStats: any, threshold: number): number {
        const expectedGoals = homeStats.averageScored + awayStats.averageScored;
        return expectedGoals > threshold ? 0.60 : 0.40;
    }

    private calculateBTTSProbability(homeStats: any, awayStats: any): number {
        const homeScoring = homeStats.averageScored > 0.8;
        const awayScoring = awayStats.averageScored > 0.8;
        return (homeScoring && awayScoring) ? 0.65 : 0.35;
    }

    private calculateBTTSLikelihood(homeStats: any, awayStats: any): number {
        const homeScoring = homeStats.averageGoalsFor > 1.0;
        const awayScoring = awayStats.averageGoalsFor > 1.0;
        const homeDefense = homeStats.averageGoalsAgainst < 1.5;
        const awayDefense = awayStats.averageGoalsAgainst < 1.5;

        if (homeScoring && awayScoring) {
            return 0.75;
        } else if ((homeScoring && !awayDefense) || (awayScoring && !homeDefense)) {
            return 0.60;
        } else {
            return 0.35;
        }
    }

    private calculateOver25Likelihood(homeStats: any, awayStats: any): number {
        const totalExpectedGoals = homeStats.averageGoalsFor + awayStats.averageGoalsFor;

        if (totalExpectedGoals > 3.0) {
            return 0.80;
        } else if (totalExpectedGoals > 2.5) {
            return 0.65;
        } else if (totalExpectedGoals > 2.0) {
            return 0.45;
        } else {
            return 0.25;
        }
    }
}

// Create and export singleton instance
export const matchAnalysisService = new MatchAnalysisService();
