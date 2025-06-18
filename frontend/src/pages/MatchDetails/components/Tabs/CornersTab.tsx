/**
 * 🎯 CORNERS TAB - CORNER KICK ANALYSIS
 * 
 * ✅ Corner statistics for both teams
 * ✅ Last 5/10 games analysis
 * ✅ Over/Under corner predictions
 * ✅ Portuguese-BR interface
 */

import { motion } from 'framer-motion';
import { CornerDownLeft, Target, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { useTeamMatches } from '../../hooks/useTeamMatches';

interface CornersTabProps {
  homeId: number;
  awayId: number;
}

interface CornerStats {
  played: number;
  totalCorners: number;
  cornersFor: number;
  cornersAgainst: number;
  avgTotal: number;
  avgFor: number;
  avgAgainst: number;
  over8: number;
  over9: number;
  over10: number;
}

const CornersTab: React.FC<CornersTabProps> = ({ homeId, awayId }) => {
  const [range, setRange] = useState<5 | 10>(5);
  
  const { data: homeMatches, loading: homeLoading } = useTeamMatches(homeId, range);
  const { data: awayMatches, loading: awayLoading } = useTeamMatches(awayId, range);

  const calculateCornerStats = (matches: any[], teamId: number): CornerStats => {
    if (!matches || matches.length === 0) {
      return {
        played: 0,
        totalCorners: 0,
        cornersFor: 0,
        cornersAgainst: 0,
        avgTotal: 0,
        avgFor: 0,
        avgAgainst: 0,
        over8: 0,
        over9: 0,
        over10: 0
      };
    }

    let totalCorners = 0;
    let cornersFor = 0;
    let cornersAgainst = 0;
    let over8 = 0;
    let over9 = 0;
    let over10 = 0;

    matches.forEach(match => {
      const isHome = match.home_team_id === teamId;
      const teamCorners = isHome ? (match.home_corner_count || 0) : (match.away_corner_count || 0);
      const opponentCorners = isHome ? (match.away_corner_count || 0) : (match.home_corner_count || 0);
      const matchTotal = (match.corner_total || teamCorners + opponentCorners);

      cornersFor += teamCorners;
      cornersAgainst += opponentCorners;
      totalCorners += matchTotal;

      if (matchTotal > 8) over8++;
      if (matchTotal > 9) over9++;
      if (matchTotal > 10) over10++;
    });

    return {
      played: matches.length,
      totalCorners,
      cornersFor,
      cornersAgainst,
      avgTotal: matches.length > 0 ? totalCorners / matches.length : 0,
      avgFor: matches.length > 0 ? cornersFor / matches.length : 0,
      avgAgainst: matches.length > 0 ? cornersAgainst / matches.length : 0,
      over8,
      over9,
      over10
    };
  };

  const homeStats = calculateCornerStats(homeMatches, homeId);
  const awayStats = calculateCornerStats(awayMatches, awayId);
  const combinedAvg = homeStats.played > 0 && awayStats.played > 0 
    ? (homeStats.avgTotal + awayStats.avgTotal) / 2 
    : 0;

  const loading = homeLoading || awayLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600">Carregando dados de escanteios...</span>
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
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Últimos {value}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Home Team */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CornerDownLeft className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Time da Casa</h3>
          </div>
          
          <div className="space-y-3">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{homeStats.avgFor.toFixed(1)}</p>
              <p className="text-sm text-green-700">Escanteios/Jogo</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Jogos:</span>
                <span className="font-medium">{homeStats.played}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">{homeStats.cornersFor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Média Total:</span>
                <span className="font-medium">{homeStats.avgTotal.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Combined */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800">Projeção</h3>
          </div>
          
          <div className="space-y-3">
            <div className="text-center p-3 bg-blue-600 text-white rounded-lg">
              <p className="text-2xl font-bold">{combinedAvg.toFixed(1)}</p>
              <p className="text-sm">Escanteios Esperados</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-blue-800">
                <span>Casa + Visitante:</span>
                <span className="font-medium">{(homeStats.avgFor + awayStats.avgFor).toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-blue-800">
                <span>Média Histórica:</span>
                <span className="font-medium">{combinedAvg.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Away Team */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CornerDownLeft className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Time Visitante</h3>
          </div>
          
          <div className="space-y-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{awayStats.avgFor.toFixed(1)}</p>
              <p className="text-sm text-blue-700">Escanteios/Jogo</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Jogos:</span>
                <span className="font-medium">{awayStats.played}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">{awayStats.cornersFor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Média Total:</span>
                <span className="font-medium">{awayStats.avgTotal.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Over/Under Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Análise Over/Under</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Over 8.5 */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Over 8.5</h4>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Casa</p>
                <p className="text-lg font-bold text-green-600">
                  {homeStats.played > 0 ? ((homeStats.over8 / homeStats.played) * 100).toFixed(0) : 0}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Visitante</p>
                <p className="text-lg font-bold text-blue-600">
                  {awayStats.played > 0 ? ((awayStats.over8 / awayStats.played) * 100).toFixed(0) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Over 9.5 */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Over 9.5</h4>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Casa</p>
                <p className="text-lg font-bold text-green-600">
                  {homeStats.played > 0 ? ((homeStats.over9 / homeStats.played) * 100).toFixed(0) : 0}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Visitante</p>
                <p className="text-lg font-bold text-blue-600">
                  {awayStats.played > 0 ? ((awayStats.over9 / awayStats.played) * 100).toFixed(0) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Over 10.5 */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Over 10.5</h4>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Casa</p>
                <p className="text-lg font-bold text-green-600">
                  {homeStats.played > 0 ? ((homeStats.over10 / homeStats.played) * 100).toFixed(0) : 0}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Visitante</p>
                <p className="text-lg font-bold text-blue-600">
                  {awayStats.played > 0 ? ((awayStats.over10 / awayStats.played) * 100).toFixed(0) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CornersTab;
