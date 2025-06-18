/**
 * 🎯 H2H TAB - HEAD-TO-HEAD ANALYSIS
 * 
 * ✅ Last 5/10 games between teams
 * ✅ Goal statistics and averages
 * ✅ Win/loss records
 * ✅ Portuguese-BR interface
 */

import { motion } from 'framer-motion';
import { Target, TrendingUp, Trophy } from 'lucide-react';
import React, { useState } from 'react';
import type { TeamMatch } from '../../hooks/useTeamMatches';

interface H2HTabProps {
  homeId: number;
  awayId: number;
  h2hMatches?: any[]; // H2H data from match details
}

interface TeamStats {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  avgGoalsFor: number;
  avgGoalsAgainst: number;
}

const H2HTab: React.FC<H2HTabProps> = ({ homeId, awayId, h2hMatches: embeddedH2H = [] }) => {
  const [range, setRange] = useState<5 | 10>(5);

  // ✅ Use embedded H2H data from match details (pre-match analysis)
  const h2hMatches = Array.isArray(embeddedH2H) ? embeddedH2H.slice(0, range) : [];
  const loading = false; // No loading since data is already embedded
  const error = null; // No error since data comes from parent

  console.log('🔍 H2H Tab - Using embedded H2H data:', {
    homeId,
    awayId,
    embeddedCount: embeddedH2H.length,
    displayCount: h2hMatches.length,
    range
  });

  const calculateTeamStats = (matches: TeamMatch[], teamId: number): TeamStats => {
    const teamMatches = matches.filter(match => 
      match.home_team_id === teamId || match.away_team_id === teamId
    );

    let wins = 0;
    let draws = 0;
    let losses = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    teamMatches.forEach(match => {
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
      played: teamMatches.length,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      avgGoalsFor: teamMatches.length > 0 ? goalsFor / teamMatches.length : 0,
      avgGoalsAgainst: teamMatches.length > 0 ? goalsAgainst / teamMatches.length : 0
    };
  };

  const homeStats = calculateTeamStats(h2hMatches, homeId);
  const awayStats = calculateTeamStats(h2hMatches, awayId);
  const combinedAvgGoals = h2hMatches.length > 0 
    ? (homeStats.goalsFor + awayStats.goalsFor) / h2hMatches.length 
    : 0;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600">Carregando dados H2H...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Erro ao carregar dados H2H: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Range Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[5, 10].map(value => (
            <button
              key={value}
              onClick={() => setRange(value as 5 | 10)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                range === value
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Últimos {value}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Home Team Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Time da Casa</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Jogos:</span>
              <span className="font-medium">{homeStats.played}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vitórias:</span>
              <span className="font-medium text-green-600">{homeStats.wins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Empates:</span>
              <span className="font-medium text-yellow-600">{homeStats.draws}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Derrotas:</span>
              <span className="font-medium text-red-600">{homeStats.losses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gols Feitos:</span>
              <span className="font-medium">{homeStats.goalsFor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Média de Gols:</span>
              <span className="font-medium">{homeStats.avgGoalsFor.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Combined Stats */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-800">Estatísticas Combinadas</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-green-700">Total de Jogos:</span>
              <span className="font-medium text-green-800">{h2hMatches.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Média de Gols:</span>
              <span className="font-medium text-green-800">{combinedAvgGoals.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Total de Gols:</span>
              <span className="font-medium text-green-800">{homeStats.goalsFor + awayStats.goalsFor}</span>
            </div>
          </div>
        </div>

        {/* Away Team Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Time Visitante</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Jogos:</span>
              <span className="font-medium">{awayStats.played}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vitórias:</span>
              <span className="font-medium text-green-600">{awayStats.wins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Empates:</span>
              <span className="font-medium text-yellow-600">{awayStats.draws}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Derrotas:</span>
              <span className="font-medium text-red-600">{awayStats.losses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gols Feitos:</span>
              <span className="font-medium">{awayStats.goalsFor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Média de Gols:</span>
              <span className="font-medium">{awayStats.avgGoalsFor.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Matches Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Histórico de Confrontos</h3>
        </div>

        {/* ✅ DEFENSIVE RENDERING: Check if h2hMatches is array and handle empty state */}
        {!Array.isArray(h2hMatches) ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Erro ao carregar dados de confronto direto</p>
            <p className="text-gray-400 text-sm mt-2">Tente recarregar a página</p>
          </div>
        ) : h2hMatches.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum confronto direto encontrado nos últimos {range} jogos</p>
            <p className="text-gray-400 text-sm mt-2">Os times podem não ter se enfrentado recentemente</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-3 font-medium text-gray-900">Data</th>
                  <th className="text-left p-3 font-medium text-gray-900">Casa</th>
                  <th className="text-center p-3 font-medium text-gray-900">Resultado</th>
                  <th className="text-right p-3 font-medium text-gray-900">Visitante</th>
                  <th className="text-center p-3 font-medium text-gray-900">Competição</th>
                </tr>
              </thead>
              <tbody>
                {h2hMatches.map((match, index) => (
                  <tr
                    key={`h2h-match-${match.id || index}-${index}`}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="p-3 text-gray-600">
                      {match.date_unix ? formatDate(match.date_unix) : 'Data não disponível'}
                    </td>
                    <td className="p-3 font-medium">{match.home_name || 'Time não informado'}</td>
                    <td className="p-3 text-center">
                      <span className="font-bold text-green-600">
                        {match.home_score ?? 0} - {match.away_score ?? 0}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-right">{match.away_name || 'Time não informado'}</td>
                    <td className="p-3 text-center text-gray-600">
                      {match.competition_name || `Liga ${match.competition_id || 'N/A'}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default H2HTab;
