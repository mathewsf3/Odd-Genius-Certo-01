"use strict";
/**
 * 👤 PLAYER & REFEREE ANALYTICS HELPERS
 *
 * Specialized helper functions for player and referee analytics
 * Supports Player & Referee Analytics Services in Phase 3
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerAnalyticsHelpers = void 0;
const AnalyticsUtils_1 = require("./AnalyticsUtils");
class PlayerAnalyticsHelpers {
    /**
     * 📊 CALCULATE PLAYER PERFORMANCE METRICS
     * Comprehensive performance analysis for a player
     */
    static calculatePlayerPerformance(player, matches, playerStats) {
        // Extract basic stats from player data or provided stats
        const appearances = (playerStats === null || playerStats === void 0 ? void 0 : playerStats.appearances) || 0;
        const goals = (playerStats === null || playerStats === void 0 ? void 0 : playerStats.goals) || 0;
        const assists = (playerStats === null || playerStats === void 0 ? void 0 : playerStats.assists) || 0;
        const averageRating = (playerStats === null || playerStats === void 0 ? void 0 : playerStats.averageRating) || 0;
        const minutesPlayed = (playerStats === null || playerStats === void 0 ? void 0 : playerStats.minutesPlayed) || 0;
        // Calculate derived metrics
        const goalsPerGame = appearances > 0 ? goals / appearances : 0;
        const assistsPerGame = appearances > 0 ? assists / appearances : 0;
        const averageMinutesPerGame = appearances > 0 ? minutesPlayed / appearances : 0;
        // Calculate form (simplified - would need match-by-match data)
        const form = this.calculatePlayerForm(matches, player.id);
        // Calculate consistency and impact
        const consistency = this.calculatePlayerConsistency(playerStats);
        const impactRating = this.calculatePlayerImpact(goals, assists, averageRating, appearances);
        return {
            playerId: player.id,
            playerName: player.name,
            position: player.position || 'Unknown',
            appearances,
            goals,
            assists,
            averageRating,
            goalsPerGame: Math.round(goalsPerGame * 100) / 100,
            assistsPerGame: Math.round(assistsPerGame * 100) / 100,
            minutesPlayed,
            averageMinutesPerGame: Math.round(averageMinutesPerGame),
            form,
            consistency,
            impactRating
        };
    }
    /**
     * 🏁 CALCULATE REFEREE PERFORMANCE METRICS
     * Comprehensive performance analysis for a referee
     */
    static calculateRefereePerformance(referee, matches, refereeStats) {
        const refereeMatches = matches.filter(match => match.refereeID === referee.id);
        if (refereeMatches.length === 0) {
            return this.getEmptyRefereeMetrics(referee);
        }
        // Calculate basic metrics
        const matchesOfficiated = refereeMatches.length;
        const totalCards = refereeMatches.reduce((sum, match) => sum + (match.team_a_red_cards || 0) + (match.team_b_red_cards || 0), 0);
        const totalGoals = refereeMatches.reduce((sum, match) => sum + match.homeGoalCount + match.awayGoalCount, 0);
        let homeWins = 0, awayWins = 0, draws = 0;
        refereeMatches.forEach(match => {
            if (match.homeGoalCount > match.awayGoalCount)
                homeWins++;
            else if (match.awayGoalCount > match.homeGoalCount)
                awayWins++;
            else
                draws++;
        });
        const averageCardsPerGame = totalCards / matchesOfficiated;
        const averageGoalsPerGame = totalGoals / matchesOfficiated;
        const homeWinPercentage = (homeWins / matchesOfficiated) * 100;
        const awayWinPercentage = (awayWins / matchesOfficiated) * 100;
        const drawPercentage = (draws / matchesOfficiated) * 100;
        // Calculate advanced metrics
        const strictnessRating = this.calculateRefereeStrictness(averageCardsPerGame);
        const consistency = this.calculateRefereeConsistency(refereeMatches);
        const controversyRating = this.calculateRefereeControversy(refereeMatches);
        return {
            refereeId: referee.id,
            refereeName: referee.name,
            matchesOfficiated,
            averageCardsPerGame: Math.round(averageCardsPerGame * 100) / 100,
            averageGoalsPerGame: Math.round(averageGoalsPerGame * 100) / 100,
            homeWinPercentage: Math.round(homeWinPercentage * 100) / 100,
            awayWinPercentage: Math.round(awayWinPercentage * 100) / 100,
            drawPercentage: Math.round(drawPercentage * 100) / 100,
            strictnessRating,
            consistency,
            controversyRating
        };
    }
    /**
     * ⚔️ COMPARE TWO PLAYERS
     * Detailed comparison between two players
     */
    static comparePlayers(player1Metrics, player2Metrics) {
        const comparison = {
            betterGoalScorer: player1Metrics.goalsPerGame >= player2Metrics.goalsPerGame ? 1 : 2,
            betterAssister: player1Metrics.assistsPerGame >= player2Metrics.assistsPerGame ? 1 : 2,
            moreConsistent: player1Metrics.consistency >= player2Metrics.consistency ? 1 : 2,
            higherImpact: player1Metrics.impactRating >= player2Metrics.impactRating ? 1 : 2,
            overallBetter: 1, // Will be calculated
            confidenceLevel: 0 // Will be calculated
        };
        // Calculate overall better player
        const player1Score = (comparison.betterGoalScorer === 1 ? 1 : 0) +
            (comparison.betterAssister === 1 ? 1 : 0) +
            (comparison.moreConsistent === 1 ? 1 : 0) +
            (comparison.higherImpact === 1 ? 1 : 0);
        comparison.overallBetter = player1Score >= 2 ? 1 : 2;
        // Calculate confidence level
        const scoreDifference = Math.abs(player1Score - 2);
        comparison.confidenceLevel = Math.min(95, 60 + (scoreDifference * 15));
        return {
            player1: player1Metrics,
            player2: player2Metrics,
            comparison
        };
    }
    /**
     * 🎯 ANALYZE REFEREE IMPACT
     * Analyze how a referee affects matches and teams
     */
    static analyzeRefereeImpact(refereeMetrics, matches, teams) {
        const refereeMatches = matches.filter(match => match.refereeID === refereeMetrics.refereeId);
        // Calculate impact metrics
        const homeAdvantageEffect = this.calculateHomeAdvantageEffect(refereeMatches);
        const gameFlowEffect = this.calculateGameFlowEffect(refereeMatches);
        const cardTendency = this.determineCardTendency(refereeMetrics.averageCardsPerGame);
        const goalTendency = this.determineGoalTendency(refereeMetrics.averageGoalsPerGame);
        // Calculate team-specific effects
        const teamEffects = this.calculateTeamEffects(refereeMatches, teams);
        return {
            referee: refereeMetrics,
            impact: {
                homeAdvantageEffect,
                gameFlowEffect,
                cardTendency,
                goalTendency
            },
            teamEffects
        };
    }
    /**
     * 🏆 ANALYZE TOP PERFORMERS
     * Identify top performers in various categories
     */
    static analyzeTopPerformers(playerMetrics, maxPerCategory = 5) {
        const sortedByGoals = [...playerMetrics].sort((a, b) => b.goalsPerGame - a.goalsPerGame);
        const sortedByAssists = [...playerMetrics].sort((a, b) => b.assistsPerGame - a.assistsPerGame);
        const sortedByConsistency = [...playerMetrics].sort((a, b) => b.consistency - a.consistency);
        const sortedByImpact = [...playerMetrics].sort((a, b) => b.impactRating - a.impactRating);
        // Rising stars (high impact with fewer appearances)
        const risingStars = playerMetrics
            .filter(player => player.appearances < 20 && player.impactRating > 70)
            .sort((a, b) => b.impactRating - a.impactRating);
        // Veteran performers (high consistency with many appearances)
        const veteranPerformers = playerMetrics
            .filter(player => player.appearances > 30 && player.consistency > 70)
            .sort((a, b) => b.consistency - a.consistency);
        return {
            topScorers: sortedByGoals.slice(0, maxPerCategory),
            topAssisters: sortedByAssists.slice(0, maxPerCategory),
            mostConsistent: sortedByConsistency.slice(0, maxPerCategory),
            highestImpact: sortedByImpact.slice(0, maxPerCategory),
            risingStars: risingStars.slice(0, maxPerCategory),
            veteranPerformers: veteranPerformers.slice(0, maxPerCategory)
        };
    }
    /**
     * 🔧 PRIVATE HELPER METHODS
     */
    static calculatePlayerForm(matches, playerId) {
        // Simplified form calculation - would need detailed match data
        // For now, return a placeholder
        return 'WWDLW';
    }
    static calculatePlayerConsistency(playerStats) {
        // Calculate consistency based on performance variation
        // Simplified calculation
        if (!playerStats || !playerStats.matchRatings)
            return 50;
        const ratings = playerStats.matchRatings;
        const stdDev = AnalyticsUtils_1.AnalyticsUtils.calculateStandardDeviation(ratings);
        const avgRating = AnalyticsUtils_1.AnalyticsUtils.calculateAverage(ratings);
        // Lower standard deviation relative to average = higher consistency
        const consistencyScore = Math.max(0, 100 - (stdDev / avgRating) * 100);
        return Math.round(consistencyScore);
    }
    static calculatePlayerImpact(goals, assists, averageRating, appearances) {
        if (appearances === 0)
            return 0;
        const goalImpact = (goals / appearances) * 30; // Max 30 points for goals
        const assistImpact = (assists / appearances) * 20; // Max 20 points for assists
        const ratingImpact = (averageRating / 10) * 50; // Max 50 points for rating
        const totalImpact = goalImpact + assistImpact + ratingImpact;
        return Math.min(100, Math.round(totalImpact));
    }
    static getEmptyRefereeMetrics(referee) {
        return {
            refereeId: referee.id,
            refereeName: referee.name,
            matchesOfficiated: 0,
            averageCardsPerGame: 0,
            averageGoalsPerGame: 0,
            homeWinPercentage: 0,
            awayWinPercentage: 0,
            drawPercentage: 0,
            strictnessRating: 50,
            consistency: 50,
            controversyRating: 0
        };
    }
    static calculateRefereeStrictness(averageCardsPerGame) {
        // Convert cards per game to strictness rating (0-100)
        // Assuming 0-6 cards per game range
        const strictness = Math.min(100, (averageCardsPerGame / 6) * 100);
        return Math.round(strictness);
    }
    static calculateRefereeConsistency(matches) {
        if (matches.length < 3)
            return 50;
        // Calculate consistency based on card distribution
        const cardsPerMatch = matches.map(match => (match.team_a_red_cards || 0) + (match.team_b_red_cards || 0));
        const stdDev = AnalyticsUtils_1.AnalyticsUtils.calculateStandardDeviation(cardsPerMatch);
        const avgCards = AnalyticsUtils_1.AnalyticsUtils.calculateAverage(cardsPerMatch);
        // Lower variation = higher consistency
        const consistencyScore = avgCards > 0 ? Math.max(0, 100 - (stdDev / avgCards) * 50) : 50;
        return Math.round(consistencyScore);
    }
    static calculateRefereeControversy(matches) {
        // Simplified controversy calculation
        // In reality, would need more detailed match data
        let controversyScore = 0;
        matches.forEach(match => {
            const totalCards = (match.team_a_red_cards || 0) + (match.team_b_red_cards || 0);
            if (totalCards > 4)
                controversyScore += 10; // High card count
            const goalDifference = Math.abs(match.homeGoalCount - match.awayGoalCount);
            if (goalDifference > 3)
                controversyScore += 5; // Unusual scoreline
        });
        return Math.min(100, controversyScore);
    }
    static calculateHomeAdvantageEffect(matches) {
        if (matches.length === 0)
            return 0;
        const homeWins = matches.filter(match => match.homeGoalCount > match.awayGoalCount).length;
        const homeWinRate = (homeWins / matches.length) * 100;
        // Compare to typical home advantage (around 45-50%)
        const typicalHomeAdvantage = 47.5;
        const effect = homeWinRate - typicalHomeAdvantage;
        return Math.round(effect * 100) / 100;
    }
    static calculateGameFlowEffect(matches) {
        if (matches.length === 0)
            return 0;
        const totalGoals = matches.reduce((sum, match) => sum + match.homeGoalCount + match.awayGoalCount, 0);
        const averageGoals = totalGoals / matches.length;
        // Compare to typical goals per game (around 2.5-3.0)
        const typicalGoalsPerGame = 2.75;
        const effect = averageGoals - typicalGoalsPerGame;
        return Math.round(effect * 100) / 100;
    }
    static determineCardTendency(averageCards) {
        if (averageCards < 2)
            return 'lenient';
        if (averageCards > 4)
            return 'strict';
        return 'average';
    }
    static determineGoalTendency(averageGoals) {
        if (averageGoals < 2.2)
            return 'low-scoring';
        if (averageGoals > 3.2)
            return 'high-scoring';
        return 'average';
    }
    static calculateTeamEffects(matches, teams) {
        const teamEffects = [];
        teams.forEach(team => {
            const teamMatches = matches.filter(match => match.homeID === team.id || match.awayID === team.id);
            if (teamMatches.length === 0)
                return;
            let wins = 0;
            let totalGoals = 0;
            let totalCards = 0;
            teamMatches.forEach(match => {
                const isHome = match.homeID === team.id;
                const teamGoals = isHome ? match.homeGoalCount : match.awayGoalCount;
                const opponentGoals = isHome ? match.awayGoalCount : match.homeGoalCount;
                const teamCards = isHome ? (match.team_a_red_cards || 0) : (match.team_b_red_cards || 0);
                if (teamGoals > opponentGoals)
                    wins++;
                totalGoals += teamGoals;
                totalCards += teamCards;
            });
            teamEffects.push({
                teamId: team.id,
                teamName: team.name,
                winRateWithReferee: Math.round((wins / teamMatches.length) * 100 * 100) / 100,
                averageGoalsWithReferee: Math.round((totalGoals / teamMatches.length) * 100) / 100,
                averageCardsWithReferee: Math.round((totalCards / teamMatches.length) * 100) / 100
            });
        });
        return teamEffects.sort((a, b) => b.winRateWithReferee - a.winRateWithReferee);
    }
}
exports.PlayerAnalyticsHelpers = PlayerAnalyticsHelpers;
