/**
 * 🎯 MAIN PAGE - 100% REAL API DATA
 * 
 * ✅ ZERO demo/mock/fallback data
 * ✅ Complete dashboard with sidebar
 * ✅ Enhanced match cards
 * ✅ Portuguese-BR interface
 * ✅ Real API integration only
 */

"use client";

import MatchCard from '@/components/MatchCard';
import { useLiveMatches, useTodaysMatches, useUpcomingMatches } from '@/hooks/useMatchData';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Clock,
    Crown,
    Home,
    Play,
    RefreshCw,
    Trophy
} from 'lucide-react';
import { useState } from 'react';

// ✅ NAVIGATION ITEMS - REAL STRUCTURE
const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    isActive: true
  },
  {
    id: 'live-matches',
    label: 'Ao Vivo',
    icon: Play,
    href: '/ao-vivo',
    badge: 'LIVE'
  },
  {
    id: 'upcoming-matches',
    label: 'Próximas',
    icon: Clock,
    href: '/proximas'
  },
  {
    id: 'leagues',
    label: 'Ligas',
    icon: Trophy,
    href: '/ligas'
  },
  {
    id: 'premium-tips',
    label: 'Tips Premium',
    icon: Crown,
    href: '/tips-premium',
    badge: 'VIP'
  }
];

export default function HomePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ✅ REAL API DATA - ZERO FALLBACKS
  const { 
    matches: liveMatches, 
    loading: liveLoading, 
    error: liveError, 
    refetch: refetchLive 
  } = useLiveMatches();
  
  const { 
    matches: upcomingMatches, 
    loading: upcomingLoading, 
    error: upcomingError, 
    refetch: refetchUpcoming 
  } = useUpcomingMatches(6);
  
  const { 
    matches: todaysMatches, 
    loading: todaysLoading, 
    error: todaysError, 
    refetch: refetchTodays 
  } = useTodaysMatches();

  const handleAnalyzeMatch = (matchId: number) => {
    window.location.href = `/partida/${matchId}/analise`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={cn(
        "bg-gradient-to-b from-slate-50/80 to-slate-100/60 border-r border-gray-200 shadow-xl transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64",
        "hidden md:flex flex-col"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50/70 to-emerald-50/70">
          <div className={cn("flex items-center gap-3", sidebarCollapsed ? "justify-center" : "")}>
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  Futebol BR
                </h1>
                <p className="text-xs text-gray-600 font-medium">Dashboard Analytics</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left group transition-all duration-300",
                    item.isActive 
                      ? "bg-gradient-to-r from-green-100/90 to-emerald-100/90 text-green-700 shadow-md border border-green-200/60"
                      : "text-slate-600 hover:bg-gradient-to-r hover:from-green-50/80 hover:to-emerald-50/80 hover:shadow-sm",
                    sidebarCollapsed ? "justify-center px-3" : ""
                  )}
                >
                  <Icon className={cn(
                    "flex-shrink-0 transition-all duration-300",
                    item.isActive ? "text-green-600" : "text-gray-500 group-hover:text-green-600",
                    "w-5 h-5"
                  )} />
                  
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 font-semibold text-sm truncate">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className={cn(
                          "px-2.5 py-1 text-xs rounded-full font-bold shadow-sm",
                          item.badge === 'LIVE' ? "bg-red-500 text-white animate-pulse" :
                          item.isActive 
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                            : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-gray-200 p-3">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex justify-center items-center py-2 hover:bg-gradient-to-r hover:from-green-50/80 hover:to-emerald-50/80 transition-all duration-200 rounded-xl"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-green-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-green-600" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
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
                    {todaysLoading ? "..." : todaysMatches.length}
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
                    {liveLoading ? "..." : liveMatches.length}
                  </p>
                  <p className="text-sm text-red-600">tempo real</p>
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
                    {upcomingLoading ? "..." : upcomingMatches.length}
                  </p>
                  <p className="text-sm text-blue-600">programadas</p>
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
                onClick={refetchLive}
                className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <RefreshCw className={cn("w-4 h-4", liveLoading && "animate-spin")} />
                <span className="text-sm">Atualizar</span>
              </button>
            </div>
            
            {liveLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
                    <div className="w-full h-48 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            )}
            
            {liveError && (
              <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-center mb-4">{liveError}</p>
                <button
                  onClick={refetchLive}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Tentar Novamente</span>
                </button>
              </div>
            )}
            
            {!liveLoading && !liveError && liveMatches.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-xl">
                <p className="text-gray-500 text-center">Não há partidas ao vivo no momento</p>
                <p className="text-gray-400 text-sm mt-2">Dados atualizados da API FootyStats</p>
              </div>
            )}
            
            {!liveLoading && !liveError && liveMatches.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveMatches.map((match) => (
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
            )}
          </motion.section>

        </div>
      </main>
    </div>
  );
}
