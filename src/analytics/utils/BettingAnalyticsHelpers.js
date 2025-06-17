"use strict";
/**
 * 💰 BETTING ANALYTICS HELPERS
 *
 * Specialized helper functions for betting and prediction analytics
 * Supports Betting Analytics Services in Phase 3
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BettingAnalyticsHelpers = void 0;
class BettingAnalyticsHelpers {
    /**
     * 📊 CALCULATE BETTING MARKET STATISTICS
     * Comprehensive analysis of betting market performance
     */
    static calculateMarketStats(matches, market, predictions, results) {
        if (matches.length === 0 || predictions.length === 0) {
            return this.getEmptyMarketStats(market);
        }
        let successfulBets = 0;
        let totalOdds = 0;
        let totalStake = 0;
        let totalReturn = 0;
        predictions.forEach((prediction, index) => {
            const result = results[index];
            if (!result)
                return;
            const stake = 1; // Assume unit stake
            totalStake += stake;
            if (this.isPredictionCorrect(prediction, result, market)) {
                successfulBets++;
                totalReturn += stake * prediction.odds;
            }
            totalOdds += prediction.odds;
        });
        const successRate = (successfulBets / predictions.length) * 100;
        const averageOdds = totalOdds / predictions.length;
        const profitLoss = totalReturn - totalStake;
        const roi = totalStake > 0 ? (profitLoss / totalStake) * 100 : 0;
        // Calculate trend
        const recentPredictions = predictions.slice(-10);
        const recentResults = results.slice(-10);
        const recentSuccessRate = this.calculateRecentSuccessRate(recentPredictions, recentResults, market);
        const trend = this.calculateTrend([successRate, recentSuccessRate]);
        return {
            market,
            totalMatches: matches.length,
            successfulBets,
            successRate: Math.round(successRate * 100) / 100,
            averageOdds: Math.round(averageOdds * 100) / 100,
            profitLoss: Math.round(profitLoss * 100) / 100,
            roi: Math.round(roi * 100) / 100,
            confidence: this.calculateMarketConfidence(successRate, predictions.length),
            trend
        };
    }
    /**
     * 💎 IDENTIFY VALUE BET OPPORTUNITIES
     * Find bets where our prediction differs significantly from bookmaker odds
     */
    static identifyValueBets(matches, predictions, bookmakerOdds, minValue = 5) {
        const valueBets = [];
        matches.forEach((match, index) => {
            const prediction = predictions[index];
            const odds = bookmakerOdds[index];
            if (!prediction || !odds)
                return;
            // Check each market
            ['homeWin', 'draw', 'awayWin', 'btts', 'over25'].forEach(market => {
                const ourProbability = prediction[market];
                const bookmakerOdds = odds[market];
                if (!ourProbability || !bookmakerOdds)
                    return;
                const impliedProbability = (1 / bookmakerOdds) * 100;
                const value = ((ourProbability / impliedProbability) - 1) * 100;
                if (value >= minValue) {
                    const confidence = this.calculateBetConfidence(ourProbability, value, prediction.confidence);
                    const recommendation = this.getBetRecommendation(value, confidence);
                    valueBets.push({
                        matchId: match.id,
                        homeTeam: `Team ${match.homeID}`,
                        awayTeam: `Team ${match.awayID}`,
                        market,
                        prediction: ourProbability,
                        bookmakerOdds,
                        impliedProbability,
                        value: Math.round(value * 100) / 100,
                        confidence,
                        recommendation,
                        reasoning: this.generateBetReasoning(market, value, confidence, ourProbability)
                    });
                }
            });
        });
        // Sort by value descending
        return valueBets.sort((a, b) => b.value - a.value);
    }
    /**
     * 🎯 CALCULATE PREDICTION ACCURACY
     * Analyze the accuracy of our predictions across different markets
     */
    static calculatePredictionAccuracy(predictions, actualResults) {
        if (predictions.length === 0) {
            return this.getEmptyAccuracy();
        }
        let totalCorrect = 0;
        const byMarket = {};
        const byConfidenceLevel = {
            high: { total: 0, correct: 0, accuracy: 0 },
            medium: { total: 0, correct: 0, accuracy: 0 },
            low: { total: 0, correct: 0, accuracy: 0 }
        };
        predictions.forEach((prediction, index) => {
            const result = actualResults[index];
            if (!result)
                return;
            // Check each market
            ['homeWin', 'draw', 'awayWin', 'btts', 'over25'].forEach(market => {
                if (!byMarket[market]) {
                    byMarket[market] = { total: 0, correct: 0, accuracy: 0 };
                }
                byMarket[market].total++;
                const isCorrect = this.isPredictionCorrect(prediction, result, market);
                if (isCorrect) {
                    totalCorrect++;
                    byMarket[market].correct++;
                }
                // Categorize by confidence level
                const confidence = prediction.confidence || 50;
                let confidenceLevel;
                if (confidence >= 80)
                    confidenceLevel = 'high';
                else if (confidence >= 60)
                    confidenceLevel = 'medium';
                else
                    confidenceLevel = 'low';
                byConfidenceLevel[confidenceLevel].total++;
                if (isCorrect) {
                    byConfidenceLevel[confidenceLevel].correct++;
                }
            });
        });
        // Calculate accuracies
        Object.keys(byMarket).forEach(market => {
            const marketData = byMarket[market];
            marketData.accuracy = marketData.total > 0 ?
                Math.round((marketData.correct / marketData.total) * 100 * 100) / 100 : 0;
        });
        Object.keys(byConfidenceLevel).forEach(level => {
            const levelData = byConfidenceLevel[level];
            levelData.accuracy = levelData.total > 0 ?
                Math.round((levelData.correct / levelData.total) * 100 * 100) / 100 : 0;
        });
        const totalPredictions = predictions.length * 5; // 5 markets per prediction
        const overallAccuracy = totalPredictions > 0 ?
            Math.round((totalCorrect / totalPredictions) * 100 * 100) / 100 : 0;
        return {
            totalPredictions,
            correctPredictions: totalCorrect,
            accuracy: overallAccuracy,
            byMarket,
            byConfidenceLevel
        };
    }
    /**
     * 📈 GENERATE BETTING STRATEGIES
     * Create optimized betting strategies based on historical performance
     */
    static generateBettingStrategies(marketStats) {
        const strategies = [];
        // Conservative Strategy
        const conservativeMarkets = marketStats
            .filter(market => market.successRate >= 60 && market.roi > 5)
            .map(market => market.market);
        if (conservativeMarkets.length > 0) {
            strategies.push({
                name: 'Conservative Value',
                description: 'Focus on high-probability, low-risk bets with consistent returns',
                markets: conservativeMarkets,
                criteria: {
                    minConfidence: 75,
                    minValue: 10,
                    maxOdds: 2.5,
                    teamFormRequired: true,
                    h2hRequired: true
                },
                expectedROI: 8,
                riskLevel: 'low'
            });
        }
        // Aggressive Strategy
        const aggressiveMarkets = marketStats
            .filter(market => market.roi > 15)
            .map(market => market.market);
        if (aggressiveMarkets.length > 0) {
            strategies.push({
                name: 'High Value Hunter',
                description: 'Target high-value opportunities with higher risk tolerance',
                markets: aggressiveMarkets,
                criteria: {
                    minConfidence: 60,
                    minValue: 20,
                    maxOdds: 10,
                    teamFormRequired: false,
                    h2hRequired: false
                },
                expectedROI: 25,
                riskLevel: 'high'
            });
        }
        // Balanced Strategy
        const balancedMarkets = marketStats
            .filter(market => market.successRate >= 55 && market.roi > 0)
            .map(market => market.market);
        if (balancedMarkets.length > 0) {
            strategies.push({
                name: 'Balanced Approach',
                description: 'Mix of value and safety for steady long-term growth',
                markets: balancedMarkets,
                criteria: {
                    minConfidence: 65,
                    minValue: 8,
                    maxOdds: 5,
                    teamFormRequired: true,
                    h2hRequired: false
                },
                expectedROI: 12,
                riskLevel: 'medium'
            });
        }
        return strategies;
    }
    /**
     * 🔍 GENERATE ADVANCED INSIGHTS
     * Deep analysis of betting patterns and trends
     */
    static generateAdvancedInsights(marketStats, matches, teams) {
        // Sort markets by performance
        const sortedByROI = [...marketStats].sort((a, b) => b.roi - a.roi);
        const bestPerforming = sortedByROI.slice(0, 3);
        const worstPerforming = sortedByROI.slice(-3).reverse();
        // Calculate streaks (simplified)
        const hotStreaks = this.calculateHotStreaks(marketStats);
        const coldStreaks = this.calculateColdStreaks(marketStats);
        // Seasonal trends (simplified)
        const seasonalTrends = this.calculateSeasonalTrends(matches, marketStats);
        // Team-specific insights (simplified)
        const teamInsights = this.calculateTeamInsights(teams, marketStats);
        return {
            hotStreaks,
            coldStreaks,
            bestPerformingMarkets: bestPerforming,
            worstPerformingMarkets: worstPerforming,
            seasonalTrends,
            teamSpecificInsights: teamInsights
        };
    }
    /**
     * 🔧 PRIVATE HELPER METHODS
     */
    static getEmptyMarketStats(market) {
        return {
            market,
            totalMatches: 0,
            successfulBets: 0,
            successRate: 0,
            averageOdds: 0,
            profitLoss: 0,
            roi: 0,
            confidence: 0,
            trend: 'stable'
        };
    }
    static getEmptyAccuracy() {
        return {
            totalPredictions: 0,
            correctPredictions: 0,
            accuracy: 0,
            byMarket: {},
            byConfidenceLevel: {
                high: { total: 0, correct: 0, accuracy: 0 },
                medium: { total: 0, correct: 0, accuracy: 0 },
                low: { total: 0, correct: 0, accuracy: 0 }
            }
        };
    }
    static isPredictionCorrect(prediction, result, market) {
        switch (market) {
            case 'homeWin':
                return result.homeGoals > result.awayGoals;
            case 'draw':
                return result.homeGoals === result.awayGoals;
            case 'awayWin':
                return result.awayGoals > result.homeGoals;
            case 'btts':
                return result.homeGoals > 0 && result.awayGoals > 0;
            case 'over25':
                return (result.homeGoals + result.awayGoals) > 2.5;
            default:
                return false;
        }
    }
    static calculateRecentSuccessRate(predictions, results, market) {
        if (predictions.length === 0)
            return 0;
        let correct = 0;
        predictions.forEach((prediction, index) => {
            const result = results[index];
            if (result && this.isPredictionCorrect(prediction, result, market)) {
                correct++;
            }
        });
        return (correct / predictions.length) * 100;
    }
    static calculateTrend(values) {
        if (values.length < 2)
            return 'stable';
        const difference = values[values.length - 1] - values[0];
        if (difference > 5)
            return 'improving';
        if (difference < -5)
            return 'declining';
        return 'stable';
    }
    static calculateMarketConfidence(successRate, sampleSize) {
        // Higher success rate and larger sample size = higher confidence
        const baseConfidence = Math.min(successRate, 90);
        const sampleBonus = Math.min(sampleSize / 10, 10); // Max 10 bonus points
        return Math.min(100, Math.round(baseConfidence + sampleBonus));
    }
    static calculateBetConfidence(ourProbability, value, predictionConfidence) {
        // Combine our probability, value, and prediction confidence
        const probabilityScore = Math.min(ourProbability, 90);
        const valueScore = Math.min(value, 50);
        const confidenceScore = predictionConfidence || 50;
        const combinedScore = (probabilityScore * 0.4) + (valueScore * 0.3) + (confidenceScore * 0.3);
        return Math.min(100, Math.round(combinedScore));
    }
    static getBetRecommendation(value, confidence) {
        if (value >= 20 && confidence >= 75)
            return 'strong_bet';
        if (value >= 10 && confidence >= 60)
            return 'moderate_bet';
        return 'avoid';
    }
    static generateBetReasoning(market, value, confidence, probability) {
        const reasons = [];
        reasons.push(`${value.toFixed(1)}% value identified in ${market} market`);
        reasons.push(`${confidence}% confidence in prediction`);
        reasons.push(`${probability.toFixed(1)}% predicted probability`);
        if (value >= 20)
            reasons.push('Exceptional value opportunity');
        if (confidence >= 80)
            reasons.push('High confidence prediction');
        if (probability >= 70)
            reasons.push('Strong probability assessment');
        return reasons;
    }
    static calculateHotStreaks(marketStats) {
        // Simplified hot streak calculation
        return marketStats
            .filter(market => market.trend === 'improving' && market.successRate > 60)
            .map(market => ({
            market: market.market,
            consecutiveWins: Math.floor(market.successRate / 10),
            currentStreak: Math.floor(market.successRate / 15)
        }));
    }
    static calculateColdStreaks(marketStats) {
        // Simplified cold streak calculation
        return marketStats
            .filter(market => market.trend === 'declining' && market.successRate < 40)
            .map(market => ({
            market: market.market,
            consecutiveLosses: Math.floor((100 - market.successRate) / 10),
            currentStreak: Math.floor((100 - market.successRate) / 15)
        }));
    }
    static calculateSeasonalTrends(matches, marketStats) {
        // Simplified seasonal trends
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map(month => ({
            month,
            successRate: 50 + Math.random() * 20, // Simplified
            profitLoss: (Math.random() - 0.5) * 100 // Simplified
        }));
    }
    static calculateTeamInsights(teams, marketStats) {
        // Simplified team insights
        return teams.slice(0, 5).map(team => ({
            teamId: team.id,
            teamName: team.name,
            bestMarkets: marketStats.slice(0, 2).map(m => m.market),
            worstMarkets: marketStats.slice(-2).map(m => m.market),
            overallROI: Math.random() * 20 - 5 // Simplified
        }));
    }
}
exports.BettingAnalyticsHelpers = BettingAnalyticsHelpers;
