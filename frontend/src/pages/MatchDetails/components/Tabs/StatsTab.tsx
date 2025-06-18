/**
 * 🎯 STATS TAB - DETAILED MATCH STATISTICS
 * 
 * ✅ Team performance metrics
 * ✅ Form analysis
 * ✅ Goal statistics
 * ✅ Portuguese-BR interface
 */

import { motion } from 'framer-motion';
import { BarChart3, Target, TrendingUp, Zap } from 'lucide-react';
import React from 'react';
import { useMatch, useMatchStats } from '../../hooks/useMatch';
import type { TeamMatch } from '../../hooks/useTeamMatches';

interface StatsTabProps {
  matchId: number;
  homeMatches?: TeamMatch[];
  awayMatches?: TeamMatch[];
}

const StatsTab: React.FC<StatsTabProps> = ({ matchId, homeMatches = [], awayMatches = [] }) => {
  const { data: matchStats, loading, error } = useMatchStats(matchId);
  const { data: match } = useMatch(matchId);

  // Extract data from match details if available
  const matchData = match || {};

  // Get the actual match details from the nested structure
  const matchDetails = matchData.matchDetails || matchData;
  const h2hData = matchDetails.h2h || {};
  const bettingStats = h2hData.betting_stats || {};

  // Check if we have any meaningful data
  const hasMatchData = matchDetails && Object.keys(matchDetails).length > 0;
  const hasH2HData = h2hData && Object.keys(h2hData).length > 0;
  const hasBettingStats = bettingStats && Object.keys(bettingStats).length > 0;

  // Use match analysis data or fallback to calculated form
  const homeTeamStats = {
    ppg: matchDetails.home_ppg || 0,
    avgGoals: bettingStats.avg_goals ? bettingStats.avg_goals / 2 : 1.5, // Default average
    wins: h2hData.previous_matches_results?.team_a_wins || 0,
    totalMatches: h2hData.previous_matches_results?.totalMatches || 0,
    winPercentage: h2hData.previous_matches_results?.team_a_win_percent || 0
  };

  const awayTeamStats = {
    ppg: matchDetails.away_ppg || 0,
    avgGoals: bettingStats.avg_goals ? bettingStats.avg_goals / 2 : 1.5, // Default average
    wins: h2hData.previous_matches_results?.team_b_wins || 0,
    totalMatches: h2hData.previous_matches_results?.totalMatches || 0,
    winPercentage: h2hData.previous_matches_results?.team_b_win_percent || 0
  };

  // Goal potential data from match analysis with realistic defaults
  const goalPotentials = {
    over05: matchDetails.o05_potential || 75, // Default 75% chance of over 0.5 goals
    over15: matchDetails.o15_potential || 60, // Default 60% chance of over 1.5 goals
    over25: matchDetails.o25_potential || 40, // Default 40% chance of over 2.5 goals
    over35: matchDetails.o35_potential || 20, // Default 20% chance of over 3.5 goals
    btts: matchDetails.btts_potential || 50,  // Default 50% chance of both teams to score
    avgGoals: matchDetails.avg_potential || 2.5 // Default 2.5 goals average
  };

  const getFormBadgeColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-green-500 text-white';
      case 'D': return 'bg-yellow-500 text-white';
      case 'L': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600">Carregando estatísticas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Data availability notice */}
      {(!hasMatchData || (!matchDetails.o05_potential && !hasH2HData)) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Dados Limitados Disponíveis
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {!hasH2HData && !matchDetails.o05_potential
                    ? "Estas equipes têm histórico limitado. Estatísticas baseadas em médias gerais."
                    : "Algumas estatísticas podem estar baseadas em dados limitados."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Team Form Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Home Team Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Forma do Time da Casa</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{homeTeamStats.wins}</p>
                <p className="text-sm text-gray-600">Vitórias H2H</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{homeTeamStats.ppg.toFixed(1)}</p>
                <p className="text-sm text-gray-600">PPG</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{homeTeamStats.avgGoals.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Gols/Jogo</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{homeTeamStats.winPercentage.toFixed(0)}%</p>
                <p className="text-sm text-gray-600">% Vitórias</p>
              </div>
            </div>
          </div>
        </div>

        {/* Away Team Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Forma do Time Visitante</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{awayTeamStats.wins}</p>
                <p className="text-sm text-gray-600">Vitórias H2H</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{awayTeamStats.ppg.toFixed(1)}</p>
                <p className="text-sm text-gray-600">PPG</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{awayTeamStats.avgGoals.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Gols/Jogo</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{awayTeamStats.winPercentage.toFixed(0)}%</p>
                <p className="text-sm text-gray-600">% Vitórias</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Match Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Estatísticas da Partida</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{goalPotentials.over25.toFixed(0)}%</p>
            <p className="text-sm text-gray-600">Over 2.5 Gols</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{goalPotentials.btts.toFixed(0)}%</p>
            <p className="text-sm text-gray-600">BTTS</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{goalPotentials.avgGoals.toFixed(1)}</p>
            <p className="text-sm text-gray-600">Média Gols</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{goalPotentials.over15.toFixed(0)}%</p>
            <p className="text-sm text-gray-600">Over 1.5 Gols</p>
          </div>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Attack */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Ataque</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Potencial Over 0.5:</span>
              <span className="font-bold text-green-600">{goalPotentials.over05.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Potencial Over 1.5:</span>
              <span className="font-bold text-blue-600">{goalPotentials.over15.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Potencial Over 2.5:</span>
              <span className="font-bold text-purple-600">{goalPotentials.over25.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Potencial Over 3.5:</span>
              <span className="font-bold text-orange-600">{goalPotentials.over35.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Defense */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Zap className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Defesa</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">BTTS Potencial:</span>
              <span className="font-bold text-green-600">{goalPotentials.btts.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Média de Gols:</span>
              <span className="font-bold text-blue-600">{goalPotentials.avgGoals.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">PPG Casa:</span>
              <span className="font-bold text-green-600">{homeTeamStats.ppg.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">PPG Visitante:</span>
              <span className="font-bold text-blue-600">{awayTeamStats.ppg.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsTab;
