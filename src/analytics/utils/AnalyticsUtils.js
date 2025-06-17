"use strict";
/**
 * 🔧 ANALYTICS UTILITIES
 *
 * Common utilities and helper functions for analytics services
 * Provides statistical calculations, data transformations, and analysis helpers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsUtils = void 0;
class AnalyticsUtils {
    /**
     * 📊 STATISTICAL CALCULATIONS
     */
    static calculateStandardDeviation(values) {
        if (values.length === 0)
            return 0;
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
        const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / values.length;
        return Math.sqrt(variance);
    }
    static calculateMedian(values) {
        if (values.length === 0)
            return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            return (sorted[middle - 1] + sorted[middle]) / 2;
        }
        return sorted[middle];
    }
    static calculatePercentile(values, percentile) {
        if (values.length === 0)
            return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const index = (percentile / 100) * (sorted.length - 1);
        if (Number.isInteger(index)) {
            return sorted[index];
        }
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index - lower;
        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    }
    static calculateAverage(values) {
        if (values.length === 0)
            return 0;
        const sum = values.reduce((acc, val) => acc + val, 0);
        return Math.round((sum / values.length) * 100) / 100; // Round to 2 decimal places
    }
    static calculateTrend(values) {
        if (values.length < 2)
            return 'stable';
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));
        const firstAvg = this.calculateAverage(firstHalf);
        const secondAvg = this.calculateAverage(secondHalf);
        const difference = secondAvg - firstAvg;
        const threshold = firstAvg * 0.05; // 5% threshold
        if (difference > threshold)
            return 'increasing';
        if (difference < -threshold)
            return 'decreasing';
        return 'stable';
    }
    /**
     * 🏈 FOOTBALL-SPECIFIC CALCULATIONS
     */
    static calculateTeamForm(matches, teamId, lastN = 5) {
        const recentMatches = matches
            .filter(match => match.homeID === teamId || match.awayID === teamId)
            .slice(-lastN);
        const form = recentMatches.map(match => {
            const isHome = match.homeID === teamId;
            const teamGoals = isHome ? match.homeGoalCount : match.awayGoalCount;
            const opponentGoals = isHome ? match.awayGoalCount : match.homeGoalCount;
            if (teamGoals > opponentGoals)
                return 'W';
            if (teamGoals < opponentGoals)
                return 'L';
            return 'D';
        });
        return form.join('');
    }
    static calculateGoalAverage(matches, teamId) {
        const teamMatches = matches.filter(match => match.homeID === teamId || match.awayID === teamId);
        if (teamMatches.length === 0)
            return { for: 0, against: 0 };
        const totalGoalsFor = teamMatches.reduce((sum, match) => {
            const isHome = match.homeID === teamId;
            return sum + (isHome ? match.homeGoalCount : match.awayGoalCount);
        }, 0);
        const totalGoalsAgainst = teamMatches.reduce((sum, match) => {
            const isHome = match.homeID === teamId;
            return sum + (isHome ? match.awayGoalCount : match.homeGoalCount);
        }, 0);
        return {
            for: Math.round((totalGoalsFor / teamMatches.length) * 100) / 100,
            against: Math.round((totalGoalsAgainst / teamMatches.length) * 100) / 100
        };
    }
    static calculateBTTSPercentage(matches) {
        if (matches.length === 0)
            return 0;
        const bttsMatches = matches.filter(match => match.homeGoalCount > 0 && match.awayGoalCount > 0);
        return Math.round((bttsMatches.length / matches.length) * 100 * 100) / 100;
    }
    static calculateOver25Percentage(matches) {
        if (matches.length === 0)
            return 0;
        const over25Matches = matches.filter(match => (match.homeGoalCount + match.awayGoalCount) > 2.5);
        return Math.round((over25Matches.length / matches.length) * 100 * 100) / 100;
    }
    static calculateCleanSheetPercentage(matches, teamId) {
        const teamMatches = matches.filter(match => match.homeID === teamId || match.awayID === teamId);
        if (teamMatches.length === 0)
            return 0;
        const cleanSheets = teamMatches.filter(match => {
            const isHome = match.homeID === teamId;
            const goalsAgainst = isHome ? match.awayGoalCount : match.homeGoalCount;
            return goalsAgainst === 0;
        });
        return Math.round((cleanSheets.length / teamMatches.length) * 100 * 100) / 100;
    }
    /**
     * 📈 TREND ANALYSIS
     */
    static calculateMovingAverage(values, window) {
        if (values.length < window)
            return values;
        const movingAverages = [];
        for (let i = window - 1; i < values.length; i++) {
            const windowValues = values.slice(i - window + 1, i + 1);
            const average = windowValues.reduce((sum, val) => sum + val, 0) / window;
            movingAverages.push(Math.round(average * 100) / 100);
        }
        return movingAverages;
    }
    static calculateTrendStrength(values) {
        if (values.length < 2)
            return 0;
        const firstValue = values[0];
        const lastValue = values[values.length - 1];
        if (firstValue === 0)
            return 0;
        const change = ((lastValue - firstValue) / firstValue) * 100;
        return Math.round(change * 100) / 100;
    }
    static detectSeasonality(values, period) {
        if (values.length < period * 2)
            return false;
        const correlations = [];
        for (let lag = 1; lag <= period; lag++) {
            let correlation = 0;
            let count = 0;
            for (let i = lag; i < values.length; i++) {
                correlation += values[i] * values[i - lag];
                count++;
            }
            correlations.push(count > 0 ? correlation / count : 0);
        }
        const maxCorrelation = Math.max(...correlations);
        return maxCorrelation > 0.5; // Threshold for seasonality detection
    }
    /**
     * 🎯 PREDICTION HELPERS
     */
    static calculatePoissonProbability(lambda, k) {
        // Poisson probability: P(X = k) = (λ^k * e^(-λ)) / k!
        const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1);
        return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
    }
    static calculateMatchProbabilities(homeGoalExpectancy, awayGoalExpectancy) {
        let homeWin = 0;
        let draw = 0;
        let awayWin = 0;
        // Calculate probabilities for score combinations up to 5 goals each
        for (let homeGoals = 0; homeGoals <= 5; homeGoals++) {
            for (let awayGoals = 0; awayGoals <= 5; awayGoals++) {
                const probability = this.calculatePoissonProbability(homeGoalExpectancy, homeGoals) *
                    this.calculatePoissonProbability(awayGoalExpectancy, awayGoals);
                if (homeGoals > awayGoals) {
                    homeWin += probability;
                }
                else if (homeGoals < awayGoals) {
                    awayWin += probability;
                }
                else {
                    draw += probability;
                }
            }
        }
        return {
            homeWin: Math.round(homeWin * 100 * 100) / 100,
            draw: Math.round(draw * 100 * 100) / 100,
            awayWin: Math.round(awayWin * 100 * 100) / 100
        };
    }
    /**
     * 🔄 DATA TRANSFORMATION
     */
    static groupMatchesByDate(matches) {
        const grouped = new Map();
        matches.forEach(match => {
            const date = new Date(match.date_unix * 1000).toISOString().split('T')[0];
            if (!grouped.has(date)) {
                grouped.set(date, []);
            }
            grouped.get(date).push(match);
        });
        return grouped;
    }
    static groupMatchesByTeam(matches) {
        const grouped = new Map();
        matches.forEach(match => {
            // Add to home team
            if (!grouped.has(match.homeID)) {
                grouped.set(match.homeID, []);
            }
            grouped.get(match.homeID).push(match);
            // Add to away team
            if (!grouped.has(match.awayID)) {
                grouped.set(match.awayID, []);
            }
            grouped.get(match.awayID).push(match);
        });
        return grouped;
    }
    static filterMatchesByDateRange(matches, startDate, endDate) {
        return matches.filter(match => {
            const matchDate = new Date(match.date_unix * 1000);
            return matchDate >= startDate && matchDate <= endDate;
        });
    }
    /**
     * 🏆 RANKING AND SCORING
     */
    static calculateEloRating(currentRating, opponentRating, result, kFactor = 32) {
        // result: 1 = win, 0.5 = draw, 0 = loss
        const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - currentRating) / 400));
        const newRating = currentRating + kFactor * (result - expectedScore);
        return Math.round(newRating);
    }
    static calculateTeamStrength(matches, teamId) {
        const teamMatches = matches.filter(match => match.homeID === teamId || match.awayID === teamId);
        if (teamMatches.length === 0)
            return 1000; // Default Elo rating
        let rating = 1000;
        teamMatches.forEach(match => {
            const isHome = match.homeID === teamId;
            const teamGoals = isHome ? match.homeGoalCount : match.awayGoalCount;
            const opponentGoals = isHome ? match.awayGoalCount : match.homeGoalCount;
            let result = 0.5; // Draw
            if (teamGoals > opponentGoals)
                result = 1; // Win
            if (teamGoals < opponentGoals)
                result = 0; // Loss
            // Assume opponent rating of 1000 for simplicity
            rating = this.calculateEloRating(rating, 1000, result);
        });
        return rating;
    }
}
exports.AnalyticsUtils = AnalyticsUtils;
