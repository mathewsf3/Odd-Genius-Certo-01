/**
 * 🎯 ENHANCED DASHBOARD COMPONENT - Magic UI Design
 * 
 * ✅ Magic UI components integration
 * ✅ Advanced animations and effects
 * ✅ White and green football theme
 * ✅ Real API data integration
 */

import { motion } from 'framer-motion';
import { Activity, BarChart3, Clock, RefreshCw, TrendingUp, Zap } from 'lucide-react';
import React from 'react';
import { useDashboardData } from '../hooks/useMatchData';
import { cn } from '../lib/utils';
import EnhancedMatchCard from './EnhancedMatchCard';
import { MagicCard } from './ui/magic-card';
import { NumberTicker } from './ui/number-ticker';
import Particles from './ui/particles';
import { ShimmerButton } from './ui/shimmer-button';
import { TextAnimate } from './ui/text-animate';

const EnhancedDashboard: React.FC = () => {
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
  console.log(`🎯 ENHANCED DASHBOARD DEBUG:`, {
    liveMatches: liveMatches.length,
    upcomingMatches: upcomingMatches.length,
    stats,
    loading,
    error,
    lastUpdated,
    firstLiveMatch: liveMatches[0]
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Particles */}
      <Particles
        className="absolute inset-0 -z-10"
        quantity={80}
        color="#22c55e"
        staticity={50}
      />
      
      <motion.div 
        className="p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Enhanced Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 via-white to-green-100/50 blur-3xl -z-10" />
            
            <TextAnimate
              animation="blurInUp"
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent mb-4"
              by="word"
            >
              Dashboard de Futebol
            </TextAnimate>
            
            <TextAnimate
              animation="fadeIn"
              delay={0.3}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Dados em tempo real da API FootyStats com análises avançadas
            </TextAnimate>

            {/* Live indicator */}
            <motion.div 
              className="flex items-center justify-center gap-2 mt-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="w-3 h-3 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-medium text-green-600">Sistema Ativo</span>
            </motion.div>
          </motion.div>

          {/* Enhanced Statistics Summary */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {/* Total Matches Card */}
            <MagicCard 
              className="relative overflow-hidden border-green-200"
              gradientColor="#22c55e"
            >
              <div className="bg-gradient-to-br from-green-50 via-white to-green-100 p-6 h-full">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <TextAnimate 
                      animation="slideUp" 
                      className="text-lg font-semibold text-green-800"
                    >
                      Partidas Hoje
                    </TextAnimate>
                    <div className="flex items-baseline gap-2">
                      <NumberTicker
                        value={loading ? 0 : stats.totalMatches}
                        className="text-4xl font-bold text-green-600"
                      />
                      {!loading && (
                        <motion.span
                          className="text-sm text-green-500"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 }}
                        >
                          partidas
                        </motion.span>
                      )}
                    </div>
                    <p className="text-sm text-green-600 font-medium">dados reais da API</p>
                  </div>
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <BarChart3 className="w-14 h-14 text-green-500 drop-shadow-sm" />
                  </motion.div>
                </div>
              </div>
            </MagicCard>

            {/* Live Matches Card */}
            <MagicCard 
              className="relative overflow-hidden border-red-200"
              gradientColor="#ef4444"
            >
              <div className="bg-gradient-to-br from-red-50 via-white to-red-100 p-6 h-full">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <TextAnimate 
                      animation="slideUp" 
                      className="text-lg font-semibold text-red-800"
                    >
                      Ao Vivo
                    </TextAnimate>
                    <div className="flex items-baseline gap-2">
                      <NumberTicker
                        value={loading ? 0 : stats.liveMatches}
                        className="text-4xl font-bold text-red-600"
                      />
                      {!loading && (
                        <motion.span
                          className="text-sm text-red-500"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 }}
                        >
                          ao vivo
                        </motion.span>
                      )}
                    </div>
                    <p className="text-sm text-red-600 font-medium">partidas acontecendo agora</p>
                  </div>
                  <motion.div
                    className="relative"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-red-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                </div>
              </div>
            </MagicCard>

            {/* Upcoming Matches Card */}
            <MagicCard 
              className="relative overflow-hidden border-blue-200"
              gradientColor="#3b82f6"
            >
              <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 h-full">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <TextAnimate 
                      animation="slideUp" 
                      className="text-lg font-semibold text-blue-800"
                    >
                      Próximas 24h
                    </TextAnimate>
                    <div className="flex items-baseline gap-2">
                      <NumberTicker
                        value={loading ? 0 : stats.upcomingMatches}
                        className="text-4xl font-bold text-blue-600"
                      />
                      {!loading && (
                        <motion.span
                          className="text-sm text-blue-500"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 }}
                        >
                          próximas
                        </motion.span>
                      )}
                    </div>
                    <p className="text-sm text-blue-600 font-medium">partidas programadas</p>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="w-14 h-14 text-blue-500 drop-shadow-sm" />
                  </motion.div>
                </div>
              </div>
            </MagicCard>
          </motion.div>

          {/* Enhanced Live Matches Section */}
          <motion.section variants={itemVariants}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <TextAnimate 
                  animation="blurInUp"
                  className="text-3xl font-bold text-gray-900 mb-2"
                >
                  Partidas ao Vivo
                </TextAnimate>
                <TextAnimate 
                  animation="fadeIn"
                  delay={0.2}
                  className="text-gray-600"
                >
                  Acompanhe os jogos em tempo real com análises detalhadas
                </TextAnimate>
              </div>
              
              <ShimmerButton
                onClick={refetch}
                className="px-6 py-3"
                shimmerColor="#22c55e"
                background="rgba(34, 197, 94, 1)"
              >
                <div className="flex items-center space-x-2">
                  <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                  <span className="font-medium">Atualizar</span>
                </div>
              </ShimmerButton>
            </div>
            
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="bg-gradient-to-br from-white to-green-50 border-2 border-green-200 rounded-2xl p-6 animate-pulse h-80"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-full h-full bg-gradient-to-r from-green-200 to-green-300 rounded-xl" />
                  </motion.div>
                ))}
              </div>
            )}

            {error && (
              <MagicCard className="p-8 border-red-200">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-12 h-12 text-red-500" />
                  </motion.div>
                  <TextAnimate animation="fadeIn" className="text-red-600 text-lg font-semibold">
                    {error}
                  </TextAnimate>
                  <ShimmerButton
                    onClick={refetch}
                    className="px-6 py-3"
                    shimmerColor="#ef4444"
                    background="rgba(239, 68, 68, 1)"
                  >
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4" />
                      <span>Tentar Novamente</span>
                    </div>
                  </ShimmerButton>
                </div>
              </MagicCard>
            )}

            {!loading && !error && liveMatches.length === 0 && (
              <MagicCard className="p-8 border-gray-200">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Clock className="w-12 h-12 text-gray-400" />
                  </motion.div>
                  <TextAnimate animation="fadeIn" className="text-gray-500 text-lg">
                    Não há partidas ao vivo no momento
                  </TextAnimate>
                  <p className="text-gray-400 text-sm">Dados atualizados da API FootyStats</p>
                </div>
              </MagicCard>
            )}

            {!loading && !error && liveMatches.length > 0 && (
              <>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {liveMatches.slice(0, 6).map((match, index) => (
                    <motion.div
                      key={match.id}
                      variants={itemVariants}
                      transition={{ delay: index * 0.1 }}
                    >
                      <EnhancedMatchCard
                        match={match}
                        mostrarEstatisticas={true}
                        mostrarOdds={false}
                        animado={true}
                        onAnalisarPartida={handleAnalyzeMatch}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {stats.liveMatches > 6 && (
                  <motion.div 
                    className="flex justify-center mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <ShimmerButton
                      onClick={() => window.location.href = '/partidas-ao-vivo'}
                      className="px-8 py-4 text-lg font-semibold"
                      shimmerColor="#22c55e"
                      background="rgba(34, 197, 94, 1)"
                    >
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5" />
                        <span>Ver Mais Partidas ao Vivo</span>
                        <motion.span 
                          className="bg-green-400 text-green-900 text-sm px-3 py-1 rounded-full font-bold"
                          whileHover={{ scale: 1.1 }}
                        >
                          +{stats.liveMatches - 6}
                        </motion.span>
                      </div>
                    </ShimmerButton>
                  </motion.div>
                )}
              </>
            )}
          </motion.section>

          {/* Enhanced Upcoming Matches Section */}
          <motion.section variants={itemVariants}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <TextAnimate 
                  animation="blurInUp"
                  className="text-3xl font-bold text-gray-900 mb-2"
                >
                  Próximas Partidas
                </TextAnimate>
                <TextAnimate 
                  animation="fadeIn"
                  delay={0.2}
                  className="text-gray-600"
                >
                  Jogos programados com análises preditivas
                </TextAnimate>
              </div>
            </div>

            {!loading && !error && upcomingMatches.length > 0 && (
              <>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {upcomingMatches.slice(0, 6).map((match, index) => (
                    <motion.div
                      key={match.id}
                      variants={itemVariants}
                      transition={{ delay: index * 0.1 }}
                    >
                      <EnhancedMatchCard
                        match={match}
                        mostrarEstatisticas={false}
                        mostrarOdds={true}
                        animado={true}
                        onAnalisarPartida={handleAnalyzeMatch}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {stats.upcomingMatches > 6 && (
                  <motion.div 
                    className="flex justify-center mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <ShimmerButton
                      onClick={() => window.location.href = '/proximas-partidas'}
                      className="px-8 py-4 text-lg font-semibold"
                      shimmerColor="#3b82f6"
                      background="rgba(59, 130, 246, 1)"
                    >
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5" />
                        <span>Ver Mais Próximas Partidas</span>
                        <motion.span 
                          className="bg-blue-400 text-blue-900 text-sm px-3 py-1 rounded-full font-bold"
                          whileHover={{ scale: 1.1 }}
                        >
                          +{stats.upcomingMatches - 6}
                        </motion.span>
                      </div>
                    </ShimmerButton>
                  </motion.div>
                )}
              </>
            )}
          </motion.section>

        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedDashboard;
