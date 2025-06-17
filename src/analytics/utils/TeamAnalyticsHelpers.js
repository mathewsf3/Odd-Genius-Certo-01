"use strict";
/**
 * 🏈 TEAM ANALYTICS HELPERS
 *
 * Specialized helper functions for team-specific analytics
 * Supports Team Analytics Services in Phase 3
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamAnalyticsHelpers = void 0;
const AnalyticsUtils_1 = require("./AnalyticsUtils");
class TeamAnalyticsHelpers {
    /**
     * 📊 CALCULATE TEAM PERFORMANCE METRICS
     * Comprehensive performance analysis for a team
     */
    static calculatePerformanceMetrics(matches, teamId) {
        const teamMatches = matches.filter(match => match.homeID === teamId || match.awayID === teamId);
        if (teamMatches.length === 0) {
            return this.getEmptyPerformanceMetrics();
        }
        let wins = 0, draws = 0, losses = 0;
        let goalsFor = 0, goalsAgainst = 0, cleanSheets = 0, failedToScore = 0;
        teamMatches.forEach(match => {
            const isHome = match.homeID === teamId;
            const teamGoals = isHome ? match.homeGoalCount : match.awayGoalCount;
            const opponentGoals = isHome ? match.awayGoalCount : match.homeGoalCount;
            goalsFor += teamGoals;
            goalsAgainst += opponentGoals;
            if (teamGoals === 0)
                failedToScore++;
            if (opponentGoals === 0)
                cleanSheets++;
            if (teamGoals > opponentGoals)
                wins++;
            else if (teamGoals < opponentGoals)
                losses++;
            else
                draws++;
        });
        const totalMatches = teamMatches.length;
        const bttsMatches = teamMatches.filter(match => match.homeGoalCount > 0 && match.awayGoalCount > 0).length;
        const over25Matches = teamMatches.filter(match => (match.homeGoalCount + match.awayGoalCount) > 2.5).length;
        return {
            wins,
            draws,
            losses,
            goalsFor,
            goalsAgainst,
            goalDifference: goalsFor - goalsAgainst,
            cleanSheets,
            failedToScore,
            averageGoalsFor: AnalyticsUtils_1.AnalyticsUtils.calculateAverage([goalsFor / totalMatches]),
            averageGoalsAgainst: AnalyticsUtils_1.AnalyticsUtils.calculateAverage([goalsAgainst / totalMatches]),
            winPercentage: (wins / totalMatches) * 100,
            drawPercentage: (draws / totalMatches) * 100,
            lossPercentage: (losses / totalMatches) * 100,
            cleanSheetPercentage: (cleanSheets / totalMatches) * 100,
            bttsPercentage: (bttsMatches / totalMatches) * 100,
            over25Percentage: (over25Matches / totalMatches) * 100
        };
    }
    /**
     * 📈 ANALYZE TEAM FORM
     * Detailed form analysis including trends and momentum
     */
    static analyzeTeamForm(matches, teamId, formLength = 5) {
        const teamMatches = matches
            .filter(match => match.homeID === teamId || match.awayID === teamId)
            .slice(-formLength);
        if (teamMatches.length === 0) {
            return this.getEmptyFormAnalysis();
        }
        const form = teamMatches.map(match => {
            const isHome = match.homeID === teamId;
            const teamGoals = isHome ? match.homeGoalCount : match.awayGoalCount;
            const opponentGoals = isHome ? match.awayGoalCount : match.homeGoalCount;
            if (teamGoals > opponentGoals)
                return 'W';
            if (teamGoals < opponentGoals)
                return 'L';
            return 'D';
        }).join('');
        const formPoints = this.calculateFormPoints(form);
        const formGoalsFor = teamMatches.reduce((sum, match) => {
            const isHome = match.homeID === teamId;
            return sum + (isHome ? match.homeGoalCount : match.awayGoalCount);
        }, 0);
        const formGoalsAgainst = teamMatches.reduce((sum, match) => {
            const isHome = match.homeID === teamId;
            return sum + (isHome ? match.awayGoalCount : match.homeGoalCount);
        }, 0);
        const formTrend = this.calculateFormTrend(form);
        const momentum = this.calculateMomentum(form, formGoalsFor, formGoalsAgainst);
        const consistency = this.calculateConsistency(form);
        return {
            form,
            formPoints,
            formGoalsFor,
            formGoalsAgainst,
            formTrend,
            momentum,
            consistency
        };
    }
    /**
     * ⚔️ COMPARE TWO TEAMS
     * Comprehensive head-to-head comparison
     */
    static compareTeams(allMatches, homeTeamId, awayTeamId, h2hMatches) {
        const homeTeamMetrics = this.calculatePerformanceMetrics(allMatches, homeTeamId);
        const awayTeamMetrics = this.calculatePerformanceMetrics(allMatches, awayTeamId);
        // Head-to-head analysis
        const h2hData = h2hMatches || allMatches.filter(match => (match.homeID === homeTeamId && match.awayID === awayTeamId) ||
            (match.homeID === awayTeamId && match.awayID === homeTeamId));
        const headToHead = this.analyzeHeadToHead(h2hData, homeTeamId, awayTeamId);
        const prediction = this.predictMatchOutcome(homeTeamMetrics, awayTeamMetrics, headToHead);
        return {
            homeTeam: homeTeamMetrics,
            awayTeam: awayTeamMetrics,
            headToHead,
            prediction
        };
    }
    /**
     * 🏠 CALCULATE HOME/AWAY PERFORMANCE
     * Separate analysis for home and away performance
     */
    static calculateHomeAwayPerformance(matches, teamId) {
        const homeMatches = matches.filter(match => match.homeID === teamId);
        const awayMatches = matches.filter(match => match.awayID === teamId);
        return {
            home: this.calculatePerformanceMetrics(homeMatches, teamId),
            away: this.calculatePerformanceMetrics(awayMatches, teamId)
        };
    }
    /**
     * 📊 CALCULATE TEAM STRENGTH RATING
     * Overall team strength based on multiple factors
     */
    static calculateTeamStrength(metrics, form) {
        const performanceScore = (metrics.winPercentage * 0.4 +
            (metrics.goalDifference > 0 ? Math.min(metrics.goalDifference * 2, 40) : 0) * 0.3 +
            metrics.cleanSheetPercentage * 0.2 +
            (100 - metrics.lossPercentage) * 0.1);
        const formScore = (form.formPoints * 4 + // Max 60 points for perfect form
            form.consistency * 0.4);
        const momentumBonus = form.momentum === 'high' ? 10 : form.momentum === 'medium' ? 5 : 0;
        const trendBonus = form.formTrend === 'improving' ? 5 : form.formTrend === 'declining' ? -5 : 0;
        const totalScore = performanceScore * 0.6 + formScore * 0.4 + momentumBonus + trendBonus;
        return Math.max(0, Math.min(100, Math.round(totalScore)));
    }
    /**
     * 🔧 PRIVATE HELPER METHODS
     */
    static getEmptyPerformanceMetrics() {
        return {
            wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0,
            goalDifference: 0, cleanSheets: 0, failedToScore: 0,
            averageGoalsFor: 0, averageGoalsAgainst: 0,
            winPercentage: 0, drawPercentage: 0, lossPercentage: 0,
            cleanSheetPercentage: 0, bttsPercentage: 0, over25Percentage: 0
        };
    }
    static getEmptyFormAnalysis() {
        return {
            form: '', formPoints: 0, formGoalsFor: 0, formGoalsAgainst: 0,
            formTrend: 'stable', momentum: 'low', consistency: 0
        };
    }
    static calculateFormPoints(form) {
        return form.split('').reduce((points, result) => {
            if (result === 'W')
                return points + 3;
            if (result === 'D')
                return points + 1;
            return points;
        }, 0);
    }
    static calculateFormTrend(form) {
        if (form.length < 3)
            return 'stable';
        const firstHalf = form.slice(0, Math.floor(form.length / 2));
        const secondHalf = form.slice(Math.floor(form.length / 2));
        const firstHalfPoints = this.calculateFormPoints(firstHalf) / firstHalf.length;
        const secondHalfPoints = this.calculateFormPoints(secondHalf) / secondHalf.length;
        const difference = secondHalfPoints - firstHalfPoints;
        if (difference > 0.5)
            return 'improving';
        if (difference < -0.5)
            return 'declining';
        return 'stable';
    }
    static calculateMomentum(form, goalsFor, goalsAgainst) {
        const recentForm = form.slice(-3); // Last 3 matches
        const recentPoints = this.calculateFormPoints(recentForm);
        const goalDifference = goalsFor - goalsAgainst;
        if (recentPoints >= 7 && goalDifference > 0)
            return 'high';
        if (recentPoints >= 4 || goalDifference >= 0)
            return 'medium';
        return 'low';
    }
    static calculateConsistency(form) {
        if (form.length === 0)
            return 0;
        const results = form.split('');
        const winStreak = this.getLongestStreak(results, 'W');
        const lossStreak = this.getLongestStreak(results, 'L');
        const maxStreak = Math.max(winStreak, lossStreak);
        // Lower streaks indicate higher consistency
        const consistencyScore = Math.max(0, 100 - (maxStreak * 15));
        return Math.round(consistencyScore);
    }
    static getLongestStreak(results, target) {
        let maxStreak = 0;
        let currentStreak = 0;
        results.forEach(result => {
            if (result === target) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            }
            else {
                currentStreak = 0;
            }
        });
        return maxStreak;
    }
    static analyzeHeadToHead(h2hMatches, homeTeamId, awayTeamId) {
        if (h2hMatches.length === 0) {
            return {
                totalMeetings: 0, homeWins: 0, awayWins: 0, draws: 0,
                homeAdvantage: 0, averageGoals: 0, bttsPercentage: 0
            };
        }
        let homeWins = 0, awayWins = 0, draws = 0, totalGoals = 0, bttsCount = 0;
        h2hMatches.forEach(match => {
            const homeGoals = match.homeGoalCount;
            const awayGoals = match.awayGoalCount;
            totalGoals += homeGoals + awayGoals;
            if (homeGoals > 0 && awayGoals > 0)
                bttsCount++;
            if (homeGoals > awayGoals) {
                if (match.homeID === homeTeamId)
                    homeWins++;
                else
                    awayWins++;
            }
            else if (awayGoals > homeGoals) {
                if (match.awayID === awayTeamId)
                    awayWins++;
                else
                    homeWins++;
            }
            else {
                draws++;
            }
        });
        return {
            totalMeetings: h2hMatches.length,
            homeWins,
            awayWins,
            draws,
            homeAdvantage: (homeWins / h2hMatches.length) * 100,
            averageGoals: totalGoals / h2hMatches.length,
            bttsPercentage: (bttsCount / h2hMatches.length) * 100
        };
    }
    static predictMatchOutcome(homeMetrics, awayMetrics, h2h) {
        // Simple prediction based on performance metrics
        const homeStrength = homeMetrics.winPercentage + (homeMetrics.goalDifference * 2);
        const awayStrength = awayMetrics.winPercentage + (awayMetrics.goalDifference * 2);
        const homeAdvantage = 10; // 10% home advantage
        const adjustedHomeStrength = homeStrength + homeAdvantage;
        const total = adjustedHomeStrength + awayStrength + 30; // 30 for draw probability base
        const homeWinProbability = (adjustedHomeStrength / total) * 100;
        const awayWinProbability = (awayStrength / total) * 100;
        const drawProbability = 100 - homeWinProbability - awayWinProbability;
        const confidence = h2h.totalMeetings > 5 ? 75 : 60; // Higher confidence with more H2H data
        return {
            homeWinProbability: Math.round(homeWinProbability),
            drawProbability: Math.round(drawProbability),
            awayWinProbability: Math.round(awayWinProbability),
            confidence
        };
    }
}
exports.TeamAnalyticsHelpers = TeamAnalyticsHelpers;
