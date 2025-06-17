/**
 * 🎯 ENHANCED DASHBOARD COMPONENT - 100% REAL API DATA
 *
 * ✅ ZERO hardcoded data
 * ✅ Enhanced MatchCard integration
 * ✅ Expected Goals analytics
 * ✅ Real-time match updates
 * ✅ Portuguese-BR interface
 * ✅ Green/White theme
 * ✅ Responsive design
 * ✅ Error handling without fallbacks
 */

"use client";

import { motion } from 'framer-motion';
import { AlertCircle, Clock, RefreshCw } from 'lucide-react';
import React from 'react';
import MatchCard from './MatchCard';
import { useLiveMatches, useTodaysMatches, useUpcomingMatches } from './hooks/useMatchData';

// ✅ LOADING SKELETON - NO MOCK DATA
const MatchCardSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="w-20 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="w-16 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="w-12 h-8 bg-gray-300 rounded"></div>
          <div className="flex items-center space-x-3">
            <div className="w-16 h-4 bg-gray-300 rounded"></div>
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ✅ ERROR STATE - NO FALLBACK DATA
const ErrorState = ({ 
  message, 
  onRetry 
}: { 
  message: string; 
  onRetry: () => void; 
}) => (
  <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-xl">
    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
    <h3 className="text-lg font-semibold text-red-800 mb-2">
      Erro ao Carregar Dados
    </h3>
    <p className="text-red-600 text-center mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
    >
      <RefreshCw className="w-4 h-4" />
      <span>Tentar Novamente</span>
    </button>
  </div>
);

// ✅ EMPTY STATE - NO MOCK DATA
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-xl">
    <Clock className="w-12 h-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-semibold text-gray-600 mb-2">
      Nenhuma Partida Encontrada
    </h3>
    <p className="text-gray-500 text-center">{message}</p>
  </div>
);

// ✅ SECTION HEADER COMPONENT
const SectionHeader = ({ 
  title, 
  subtitle, 
  lastUpdated,
  onRefresh 
}: {
  title: string;
  subtitle: string;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
}) => (
  <div className="flex justify-between items-center mb-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
      {lastUpdated && (
        <p className="text-xs text-gray-500 mt-1">
          Última atualização: {lastUpdated.toLocaleTimeString('pt-BR')}
        </p>
      )}
    </div>
    {onRefresh && (
      <button
        onClick={onRefresh}
        className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        <span className="text-sm">Atualizar</span>
      </button>
    )}
  </div>
);

// ✅ MAIN DASHBOARD COMPONENT
const Dashboard: React.FC = () => {
  // ✅ REAL DATA HOOKS - NO FALLBACKS
  const { 
    matches: liveMatches, 
    loading: liveLoading, 
    error: liveError, 
    refetch: refetchLive,
    lastUpdated: liveLastUpdated
  } = useLiveMatches();

  const { 
    matches: upcomingMatches, 
    loading: upcomingLoading, 
    error: upcomingError, 
    refetch: refetchUpcoming,
    lastUpdated: upcomingLastUpdated
  } = useUpcomingMatches(6);

  const { 
    matches: todaysMatches, 
    loading: todaysLoading, 
    error: todaysError, 
    refetch: refetchTodays,
    lastUpdated: todaysLastUpdated
  } = useTodaysMatches();

  // ✅ HANDLE MATCH ANALYSIS - REAL NAVIGATION
  const handleAnalisarPartida = (matchId: number) => {
    // Navigate to match analysis page
    window.location.href = `/partida/${matchId}/analise`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ✅ DASHBOARD HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard de Futebol
          </h1>
          <p className="text-xl text-gray-600">
            Acompanhe partidas ao vivo e próximos jogos em tempo real
          </p>
        </motion.div>

        {/* ✅ STATISTICS SUMMARY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800">Partidas Hoje</h3>
                <p className="text-3xl font-bold text-green-600">
                  {todaysMatches.length}
                </p>
                <p className="text-sm text-green-600">jogos programados</p>
              </div>
              <BarChart3 className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-800">Ao Vivo</h3>
                <p className="text-3xl font-bold text-red-600">
                  {liveMatches.length}
                </p>
                <p className="text-sm text-red-600">partidas em andamento</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Próximas</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {upcomingMatches.length}
                </p>
                <p className="text-sm text-blue-600">jogos agendados</p>
              </div>
              <Clock className="w-12 h-12 text-blue-500" />
            </div>
          </div>
        </motion.div>

        {/* ✅ TODAY'S FEATURED MATCHES */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SectionHeader
            title="Partidas do Dia"
            subtitle="Principais jogos de hoje"
            lastUpdated={todaysLastUpdated}
            onRefresh={refetchTodays}
          />
          
          {todaysLoading && <MatchCardSkeleton count={3} />}
          
          {todaysError && (
            <ErrorState message={todaysError} onRetry={refetchTodays} />
          )}
          
          {!todaysLoading && !todaysError && todaysMatches.length === 0 && (
            <EmptyState message="Não há partidas programadas para hoje" />
          )}
          
          {!todaysLoading && !todaysError && todaysMatches.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todaysMatches.slice(0, 3).map((match) => (
                <MatchCard
                  key={match.id}
                  match={match} // ✅ REAL DATA FROM API
                  mostrarEstatisticas={false}
                  mostrarOdds={true}
                  animado={true}
                  onAnalisarPartida={handleAnalisarPartida}
                />
              ))}
            </div>
          )}
        </motion.section>

        {/* ✅ LIVE MATCHES SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionHeader
            title="Partidas ao Vivo"
            subtitle="Acompanhe os jogos em tempo real"
            lastUpdated={liveLastUpdated}
            onRefresh={refetchLive}
          />
          
          {liveLoading && <MatchCardSkeleton count={6} />}
          
          {liveError && (
            <ErrorState message={liveError} onRetry={refetchLive} />
          )}
          
          {!liveLoading && !liveError && liveMatches.length === 0 && (
            <EmptyState message="Não há partidas ao vivo no momento" />
          )}
          
          {!liveLoading && !liveError && liveMatches.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveMatches.slice(0, 6).map((match) => (
                <MatchCard
                  key={match.id}
                  match={match} // ✅ REAL DATA FROM API
                  mostrarEstatisticas={true}
                  mostrarOdds={false}
                  animado={true}
                  onAnalisarPartida={handleAnalisarPartida}
                />
              ))}
            </div>
          )}
        </motion.section>

        {/* ✅ UPCOMING MATCHES SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SectionHeader
            title="Próximas Partidas"
            subtitle="Jogos programados para os próximos dias"
            lastUpdated={upcomingLastUpdated}
            onRefresh={refetchUpcoming}
          />
          
          {upcomingLoading && <MatchCardSkeleton count={6} />}
          
          {upcomingError && (
            <ErrorState message={upcomingError} onRetry={refetchUpcoming} />
          )}
          
          {!upcomingLoading && !upcomingError && upcomingMatches.length === 0 && (
            <EmptyState message="Não há próximas partidas programadas" />
          )}
          
          {!upcomingLoading && !upcomingError && upcomingMatches.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match} // ✅ REAL DATA FROM API
                  mostrarEstatisticas={false}
                  mostrarOdds={true}
                  animado={true}
                  onAnalisarPartida={handleAnalisarPartida}
                />
              ))}
            </div>
          )}
        </motion.section>

      </div>
    </div>
  );
};

export default Dashboard;
