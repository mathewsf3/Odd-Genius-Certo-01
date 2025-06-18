/**
 * 🎯 REFEREE TAB - REFEREE ANALYSIS
 * 
 * ✅ Referee statistics and tendencies
 * ✅ Card averages and match control
 * ✅ Historical performance
 * ✅ Portuguese-BR interface
 */

import { motion } from 'framer-motion';
import { AlertTriangle, Award, BarChart3, User } from 'lucide-react';
import React, { useState } from 'react';
import { useMatch } from '../../hooks/useMatch';
import { useRefereeStats } from '../../hooks/useTeamMatches';

interface RefereeTabProps {
  matchId: number;
}

const RefereeTab: React.FC<RefereeTabProps> = ({ matchId }) => {
  const [range, setRange] = useState<5 | 10 | 'season'>('season');

  // Get match data to extract referee ID
  const { data: match, loading: matchLoading } = useMatch(matchId);
  const refereeId = match?.refereeID || null;

  // Get referee statistics
  const { data: refereeStats, loading: refereeLoading, error: refereeError } = useRefereeStats(refereeId);

  // Process referee data
  const refereeData = refereeStats ? {
    name: refereeStats.name || 'Árbitro da Partida',
    experience: refereeStats.experience || 'N/A',
    totalMatches: refereeStats.total_matches || 0,
    yellowPerGame: refereeStats.yellow_per_game || 0,
    redPerGame: refereeStats.red_per_game || 0,
    goalsPerGame: refereeStats.goals_per_game || 0,
    homeWinPct: refereeStats.home_win_pct || 0,
    drawPct: refereeStats.draw_pct || 0,
    awayWinPct: refereeStats.away_win_pct || 0,
    over25Goals: refereeStats.over25_goals_rate || 0,
    over35Cards: refereeStats.over35_cards_rate || 0,
    bttsRate: refereeStats.btts_rate || 0
  } : {
    name: 'Árbitro da Partida',
    experience: 'N/A',
    totalMatches: 0,
    yellowPerGame: 0,
    redPerGame: 0,
    goalsPerGame: 0,
    homeWinPct: 0,
    drawPct: 0,
    awayWinPct: 0,
    over25Goals: 0,
    over35Cards: 0,
    bttsRate: 0
  };

  const loading = matchLoading || refereeLoading;

  const getStatColor = (value: number, type: 'cards' | 'goals' | 'percentage') => {
    if (type === 'cards') {
      if (value >= 5) return 'text-red-600';
      if (value >= 3) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (type === 'goals') {
      if (value >= 3) return 'text-green-600';
      if (value >= 2) return 'text-yellow-600';
      return 'text-red-600';
    }
    return 'text-blue-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Carregando dados do árbitro...</span>
      </div>
    );
  }

  if (refereeError && !refereeId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Informação do Árbitro Indisponível</h4>
            <p className="text-sm text-yellow-700 mt-1">
              As informações do árbitro não estão disponíveis para esta partida.
            </p>
          </div>
        </div>
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
          {[5, 10, 'season'].map(value => (
            <button
              key={value}
              onClick={() => setRange(value as 5 | 10 | 'season')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                range === value
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {value === 'season' ? 'Temporada' : `Últimos ${value}`}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Referee Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <User className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Informações do Árbitro</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-900">{refereeData.name}</p>
            <p className="text-sm text-gray-600">Nome</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-purple-600">{refereeData.totalMatches}</p>
            <p className="text-sm text-gray-600">Partidas Apitadas</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-purple-600">{refereeData.experience}</p>
            <p className="text-sm text-gray-600">Experiência</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-purple-600">N/A</p>
            <p className="text-sm text-gray-600">Liga Principal</p>
          </div>
        </div>
      </motion.div>

      {/* Card Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">Estatísticas de Cartões</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className={`text-3xl font-bold ${getStatColor(refereeData.yellowPerGame, 'cards')}`}>
              {refereeData.yellowPerGame.toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">Cartões Amarelos/Jogo</p>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className={`text-3xl font-bold ${getStatColor(refereeData.redPerGame, 'cards')}`}>
              {refereeData.redPerGame.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Cartões Vermelhos/Jogo</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">
              {(refereeData.yellowPerGame + refereeData.redPerGame).toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">Total Cartões/Jogo</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Over 3.5 Cartões:</span>
              <span className="font-bold text-purple-600">{refereeData.over35Cards}%</span>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cartões Esperados:</span>
              <span className="font-bold text-purple-600">
                {(refereeData.yellowPerGame + refereeData.redPerGame).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Match Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Controle de Jogo</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className={`text-3xl font-bold ${getStatColor(refereeData.goalsPerGame, 'goals')}`}>
              {refereeData.goalsPerGame.toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">Gols/Jogo</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{refereeData.over25Goals}%</p>
            <p className="text-sm text-gray-600">Over 2.5 Gols</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-3xl font-bold text-orange-600">{refereeData.bttsRate}%</p>
            <p className="text-sm text-gray-600">BTTS (Ambos Marcam)</p>
          </div>
        </div>
      </motion.div>

      {/* Result Tendencies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Award className="w-6 h-6 text-gold-600" />
          <h3 className="text-lg font-semibold text-gray-900">Tendências de Resultado</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{refereeData.homeWinPct}%</p>
            <p className="text-sm text-gray-600">Vitórias Casa</p>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600">{refereeData.drawPct}%</p>
            <p className="text-sm text-gray-600">Empates</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{refereeData.awayWinPct}%</p>
            <p className="text-sm text-gray-600">Vitórias Visitante</p>
          </div>
        </div>
      </motion.div>

      {/* Data Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`border rounded-xl p-4 ${
          refereeStats
            ? 'bg-green-50 border-green-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}
      >
        <div className="flex items-start space-x-3">
          <AlertTriangle className={`w-5 h-5 mt-0.5 ${
            refereeStats ? 'text-green-600' : 'text-yellow-600'
          }`} />
          <div>
            <h4 className={`font-medium ${
              refereeStats ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {refereeStats ? 'Dados Reais do Árbitro' : 'Informação sobre Dados'}
            </h4>
            <p className={`text-sm mt-1 ${
              refereeStats ? 'text-green-700' : 'text-yellow-700'
            }`}>
              {refereeStats
                ? `Estatísticas reais do árbitro ${refereeData.name} obtidas da API FootyStats.`
                : 'Os dados específicos do árbitro não estão disponíveis para esta partida. Dados genéricos são exibidos.'
              }
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RefereeTab;
