/**
 * 🎯 DASHBOARD COMPONENT - MAIN CONTENT
 * 
 * ✅ Live matches section
 * ✅ Today's matches section
 * ✅ Upcoming matches section
 * ✅ Real API data integration
 * ✅ Portuguese-BR interface
 */

import { motion } from 'framer-motion';
import { BarChart3, Clock, RefreshCw } from 'lucide-react';
import React from 'react';
import { useDashboardData } from '../hooks/useMatchData';
import { cn } from '../lib/utils';
import MatchCard from './MatchCard';

const Dashboard: React.FC = () => {
  // ✅ OPTIMIZED: Single API call for all dashboard data
  const {
    data: dashboardData,
    loading,
    error,
    refetch,
    lastUpdated
  } = useDashboardData();

  // Extract data from the optimized response
  const liveMatches = dashboardData?.liveMatches || [];
  const upcomingMatches = dashboardData?.upcomingMatches || [];
  const stats = dashboardData?.stats || {
    totalMatches: 0,
    liveMatches: 0,
    upcomingMatches: 0
  };

  const handleAnalyzeMatch = (matchId: number) => {
    window.location.href = `/partida/${matchId}/analise`;
  };

  // ✅ DEBUG LOGS
  console.log(`🎯 OPTIMIZED DASHBOARD DEBUG:`, {
    liveMatches: liveMatches.length,
    upcomingMatches: upcomingMatches.length,
    stats,
    loading,
    error,
    lastUpdated,
    firstLiveMatch: liveMatches[0]
  });

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard de Futebol
          </h1>
          <p className="text-xl text-gray-600">
            Dados em tempo real da API FootyStats
          </p>
        </motion.div>

        {/* Statistics Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800">Partidas Hoje</h3>
                <p className="text-3xl font-bold text-green-600">
                  {loading ? "..." : stats.totalMatches}
                </p>
                <p className="text-sm text-green-600">dados reais da API</p>
              </div>
              <BarChart3 className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-800">Ao Vivo</h3>
                <p className="text-3xl font-bold text-red-600">
                  {loading ? "..." : stats.liveMatches}
                </p>
                <p className="text-sm text-red-600">partidas ao vivo agora</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Próximas 24h</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {loading ? "..." : stats.upcomingMatches}
                </p>
                <p className="text-sm text-blue-600">partidas nas próximas 24h</p>
              </div>
              <Clock className="w-12 h-12 text-blue-500" />
            </div>
          </div>
        </motion.div>

        {/* Live Matches */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Partidas ao Vivo</h2>
              <p className="text-gray-600">Dados em tempo real da API FootyStats</p>
            </div>
            <button
              onClick={refetch}
              className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              <span className="text-sm">Atualizar</span>
            </button>
          </div>
          
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
                  <div className="w-full h-48 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-center mb-4">{error}</p>
              <button
                onClick={refetch}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tentar Novamente</span>
              </button>
            </div>
          )}

          {!loading && !error && liveMatches.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-gray-500 text-center">Não há partidas ao vivo no momento</p>
              <p className="text-gray-400 text-sm mt-2">Dados atualizados da API FootyStats</p>
            </div>
          )}

          {!loading && !error && liveMatches.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveMatches.slice(0, 6).map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    mostrarEstatisticas={true}
                    mostrarOdds={false}
                    animado={true}
                    onAnalisarPartida={handleAnalyzeMatch}
                  />
                ))}
              </div>

              {stats.liveMatches > 6 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => window.location.href = '/partidas-ao-vivo'}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                  >
                    <span>Ver Mais Partidas ao Vivo</span>
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      +{stats.liveMatches - 6}
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </motion.section>

        {/* Upcoming Matches */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Próximas Partidas</h2>
              <p className="text-gray-600">Jogos programados para os próximos dias</p>
            </div>
            <button
              onClick={refetch}
              className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              <span className="text-sm">Atualizar</span>
            </button>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
                  <div className="w-full h-48 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center p-8 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-600 text-center mb-4">{error}</p>
              <button
                onClick={refetch}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tentar Novamente</span>
              </button>
            </div>
          )}

          {!loading && !error && upcomingMatches.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-gray-500 text-center">Não há partidas programadas no momento</p>
              <p className="text-gray-400 text-sm mt-2">Dados atualizados da API FootyStats</p>
            </div>
          )}

          {!loading && !error && upcomingMatches.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingMatches.slice(0, 6).map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    mostrarEstatisticas={false}
                    mostrarOdds={true}
                    animado={true}
                    onAnalisarPartida={handleAnalyzeMatch}
                  />
                ))}
              </div>

              {stats.upcomingMatches > 6 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => window.location.href = '/proximas-partidas'}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                  >
                    <span>Ver Mais Próximas Partidas</span>
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      +{stats.upcomingMatches - 6}
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </motion.section>

      </div>
    </div>
  );
};

export default Dashboard;
