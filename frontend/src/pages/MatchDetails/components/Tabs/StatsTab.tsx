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
import { useMatchStats } from '../../hooks/useMatch';
import type { TeamMatch } from '../../hooks/useTeamMatches';

interface StatsTabProps {
  matchId: number;
  homeMatches?: TeamMatch[];
  awayMatches?: TeamMatch[];
}

const StatsTab: React.FC<StatsTabProps> = ({ matchId, homeMatches = [], awayMatches = [] }) => {
  const { data: matchStats, loading, error } = useMatchStats(matchId);

  const calculateTeamForm = (matches: TeamMatch[], teamId: number) => {
    const recentMatches = matches.slice(0, 5);
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    recentMatches.forEach(match => {
      const isHome = match.home_team_id === teamId;
      const teamScore = isHome ? match.home_score : match.away_score;
      const opponentScore = isHome ? match.away_score : match.home_score;

      goalsFor += teamScore;
      goalsAgainst += opponentScore;

      if (teamScore > opponentScore) wins++;
      else if (teamScore === opponentScore) draws++;
      else losses++;
    });

    return {
      played: recentMatches.length,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      avgGoalsFor: recentMatches.length > 0 ? goalsFor / recentMatches.length : 0,
      avgGoalsAgainst: recentMatches.length > 0 ? goalsAgainst / recentMatches.length : 0,
      form: recentMatches.map(match => {
        const isHome = match.home_team_id === teamId;
        const teamScore = isHome ? match.home_score : match.away_score;
        const opponentScore = isHome ? match.away_score : match.home_score;
        
        if (teamScore > opponentScore) return 'W';
        if (teamScore === opponentScore) return 'D';
        return 'L';
      })
    };
  };

  const homeTeamId = homeMatches[0]?.home_team_id || homeMatches[0]?.away_team_id;
  const awayTeamId = awayMatches[0]?.home_team_id || awayMatches[0]?.away_team_id;

  const homeForm = homeTeamId ? calculateTeamForm(homeMatches, homeTeamId) : null;
  const awayForm = awayTeamId ? calculateTeamForm(awayMatches, awayTeamId) : null;

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

          {homeForm ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Últimos 5 jogos:</span>
                <div className="flex space-x-1">
                  {homeForm.form.map((result, index) => (
                    <span
                      key={index}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getFormBadgeColor(result)}`}
                    >
                      {result}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{homeForm.wins}</p>
                  <p className="text-sm text-gray-600">Vitórias</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{homeForm.avgGoalsFor.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">Gols/Jogo</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Dados não disponíveis</p>
          )}
        </div>

        {/* Away Team Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Forma do Time Visitante</h3>
          </div>

          {awayForm ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Últimos 5 jogos:</span>
                <div className="flex space-x-1">
                  {awayForm.form.map((result, index) => (
                    <span
                      key={index}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getFormBadgeColor(result)}`}
                    >
                      {result}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{awayForm.wins}</p>
                  <p className="text-sm text-gray-600">Vitórias</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{awayForm.avgGoalsFor.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">Gols/Jogo</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Dados não disponíveis</p>
          )}
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

        {matchStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{matchStats.possession_home || 'N/A'}%</p>
              <p className="text-sm text-gray-600">Posse Casa</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{matchStats.possession_away || 'N/A'}%</p>
              <p className="text-sm text-gray-600">Posse Visitante</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{matchStats.shots_home || 'N/A'}</p>
              <p className="text-sm text-gray-600">Chutes Casa</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{matchStats.shots_away || 'N/A'}</p>
              <p className="text-sm text-gray-600">Chutes Visitante</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Posse de Bola', 'Chutes', 'Escanteios', 'Cartões'].map((stat) => (
              <div key={stat} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-400">N/A</p>
                <p className="text-sm text-gray-600">{stat}</p>
              </div>
            ))}
          </div>
        )}
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
              <span className="text-gray-600">Média de Gols (Casa):</span>
              <span className="font-bold text-green-600">
                {homeForm ? homeForm.avgGoalsFor.toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Média de Gols (Visitante):</span>
              <span className="font-bold text-blue-600">
                {awayForm ? awayForm.avgGoalsFor.toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Média Combinada:</span>
              <span className="font-bold text-purple-600">
                {homeForm && awayForm 
                  ? ((homeForm.avgGoalsFor + awayForm.avgGoalsFor) / 2).toFixed(2)
                  : 'N/A'
                }
              </span>
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
              <span className="text-gray-600">Gols Sofridos (Casa):</span>
              <span className="font-bold text-green-600">
                {homeForm ? homeForm.avgGoalsAgainst.toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gols Sofridos (Visitante):</span>
              <span className="font-bold text-blue-600">
                {awayForm ? awayForm.avgGoalsAgainst.toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Clean Sheets:</span>
              <span className="font-bold text-purple-600">N/A</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsTab;
