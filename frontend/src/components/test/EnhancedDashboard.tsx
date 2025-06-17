/**
 * 🎯 ENHANCED MAGIC UI DASHBOARD - TEST VERSION
 *
 * ✅ MagicUI Components Integration
 * ✅ Stunning visual effects and animations
 * ✅ Interactive hover states
 * ✅ Glowing elements and borders
 * ✅ Animated gradients and transitions
 * ✅ Real API data integration
 * ✅ Enhanced user experience
 * ✅ Portuguese-BR interface
 * ✅ Responsive design
 */

"use client";

import { useLiveMatches, useTodaysMatches, useUpcomingMatches } from '@/hooks/useMatchData';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, AlertCircle, Clock, RefreshCw, Sparkles, Star, TrendingUp, Zap } from 'lucide-react';
import {
    AnimatedGradientText,
    BorderBeam,
    Floating,
    Glow,
    MagicCard,
    Pulse,
    ShineBorder
} from '../ui/magic-components';
import EnhancedMatchCard from './EnhancedMatchCard';

// ✨ ENHANCED LOADING SKELETON WITH MAGIC EFFECTS
const EnhancedMatchCardSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className="relative"
      >
        <MagicCard className="p-0">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 space-y-4">
            <BorderBeam size={80} duration={6} />
            
            {/* Header skeleton */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Pulse>
                  <div className="w-5 h-5 bg-gradient-to-r from-green-300 to-emerald-300 rounded animate-pulse"></div>
                </Pulse>
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                  <div className="w-16 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
              <Floating distance={3}>
                <div className="w-20 h-6 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full animate-pulse"></div>
              </Floating>
            </div>
            
            {/* Teams skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Glow color="#10B981" size={4}>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full animate-pulse"></div>
                </Glow>
                <div className="w-20 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              </div>
              
              <Pulse duration={2}>
                <div className="w-16 h-10 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg animate-pulse"></div>
              </Pulse>
              
              <div className="flex items-center space-x-3">
                <div className="w-20 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <Glow color="#10B981" size={4}>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full animate-pulse"></div>
                </Glow>
              </div>
            </div>
            
            {/* Bottom skeleton */}
            <div className="w-full h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </MagicCard>
      </motion.div>
    ))}
  </div>
);

// ✨ ENHANCED ERROR COMPONENT
const EnhancedErrorDisplay = ({ 
  message, 
  onRetry 
}: { 
  message: string; 
  onRetry?: () => void; 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="relative"
  >
    <MagicCard
      gradientFrom="#EF4444"
      gradientTo="#F87171"
      gradientColor="#EF444430"
    >
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <ShineBorder shineColor="#EF4444" duration={10} />
        
        <Pulse>
          <Glow color="#EF4444" size={8}>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          </Glow>
        </Pulse>
        
        <AnimatedGradientText 
          colors={['#EF4444', '#F87171', '#EF4444']}
          className="text-lg font-semibold mb-2"
        >
          Erro ao Carregar Dados
        </AnimatedGradientText>
        
        <p className="text-red-600 dark:text-red-400 mb-4">{message}</p>
        
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Tentar Novamente</span>
          </motion.button>
        )}
      </div>
    </MagicCard>
  </motion.div>
);

// ✨ ENHANCED SECTION HEADER
const EnhancedSectionHeader = ({ 
  title, 
  icon: Icon, 
  count, 
  isLive = false 
}: { 
  title: string; 
  icon: any; 
  count?: number; 
  isLive?: boolean; 
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center justify-between mb-6"
  >
    <div className="flex items-center space-x-3">
      {isLive ? (
        <Pulse duration={1.5}>
          <Glow color="#EF4444" size={8}>
            <Icon className="w-8 h-8 text-red-500" />
          </Glow>
        </Pulse>
      ) : (
        <Glow color="#10B981" size={6}>
          <Icon className="w-8 h-8 text-green-600" />
        </Glow>
      )}
      
      <div>
        <AnimatedGradientText 
          colors={isLive ? ['#EF4444', '#F87171', '#EF4444'] : ['#10B981', '#22C55E', '#059669']}
          className="text-2xl font-bold"
        >
          {title}
        </AnimatedGradientText>
        {count !== undefined && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {count} {count === 1 ? 'partida' : 'partidas'}
          </p>
        )}
      </div>
    </div>
    
    {isLive && (
      <Floating distance={4}>
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          <span>AO VIVO</span>
        </div>
      </Floating>
    )}
  </motion.div>
);

// ✨ ENHANCED MATCHES GRID
const EnhancedMatchesGrid = ({ 
  matches, 
  title 
}: { 
  matches: any[]; 
  title: string; 
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ staggerChildren: 0.1 }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  >
    <AnimatePresence mode="popLayout">
      {matches.map((match, index) => (
        <motion.div
          key={match.id}
          layout
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ 
            delay: index * 0.1,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          <EnhancedMatchCard
            match={match}
            mostrarEstatisticas={true}
            mostrarOdds={true}
            animado={true}
            onAnalisarPartida={(matchId) => {
              console.log(`Analisando partida ${matchId}`);
              // Add your analysis logic here
            }}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  </motion.div>
);

// ✨ MAIN ENHANCED DASHBOARD COMPONENT
export default function EnhancedDashboard() {
  const { 
    matches: liveMatches, 
    loading: liveLoading, 
    error: liveError, 
    refetch: refetchLive 
  } = useLiveMatches();
  
  const { 
    matches: todaysMatches, 
    loading: todayLoading, 
    error: todayError, 
    refetch: refetchToday 
  } = useTodaysMatches();
  
  const { 
    matches: upcomingMatches, 
    loading: upcomingLoading, 
    error: upcomingError, 
    refetch: refetchUpcoming 
  } = useUpcomingMatches();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      {/* ✨ ENHANCED HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-green-200 dark:border-green-800"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"></div>
        <ShineBorder shineColor={["#10B981", "#22C55E", "#059669"]} duration={12} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Glow color="#10B981" size={10}>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </Glow>
              
              <div>
                <AnimatedGradientText 
                  colors={['#10B981', '#22C55E', '#059669']}
                  className="text-3xl font-bold"
                >
                  Dashboard Futebol
                </AnimatedGradientText>
                <p className="text-gray-600 dark:text-gray-400">
                  Dados em tempo real com MagicUI
                </p>
              </div>
            </div>
            
            <Floating distance={8}>
              <Glow color="#10B981" size={6}>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Enhanced</span>
                </div>
              </Glow>
            </Floating>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ✨ LIVE MATCHES SECTION */}
        <section className="mb-12">
          <EnhancedSectionHeader
            title="Partidas ao Vivo"
            icon={Activity}
            count={liveMatches?.length}
            isLive={true}
          />
          
          {liveLoading ? (
            <EnhancedMatchCardSkeleton count={3} />
          ) : liveError ? (
            <EnhancedErrorDisplay
              message="Falha ao carregar partidas ao vivo"
              onRetry={refetchLive}
            />
          ) : liveMatches && liveMatches.length > 0 ? (
            <EnhancedMatchesGrid matches={liveMatches} title="Ao Vivo" />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <MagicCard>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center">
                  <Glow color="#6B7280" size={4}>
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  </Glow>
                  <AnimatedGradientText 
                    colors={['#6B7280', '#9CA3AF', '#6B7280']}
                    className="text-xl font-semibold mb-2"
                  >
                    Nenhuma partida ao vivo
                  </AnimatedGradientText>
                  <p className="text-gray-500">
                    Não há partidas acontecendo no momento
                  </p>
                </div>
              </MagicCard>
            </motion.div>
          )}
        </section>

        {/* ✨ TODAY'S MATCHES SECTION */}
        <section className="mb-12">
          <EnhancedSectionHeader
            title="Partidas de Hoje"
            icon={TrendingUp}
            count={todaysMatches?.length}
          />
          
          {todayLoading ? (
            <EnhancedMatchCardSkeleton count={6} />
          ) : todayError ? (
            <EnhancedErrorDisplay
              message="Falha ao carregar partidas de hoje"
              onRetry={refetchToday}
            />
          ) : todaysMatches && todaysMatches.length > 0 ? (
            <EnhancedMatchesGrid matches={todaysMatches} title="Hoje" />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <MagicCard>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center">
                  <Glow color="#6B7280" size={4}>
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  </Glow>
                  <AnimatedGradientText 
                    colors={['#6B7280', '#9CA3AF', '#6B7280']}
                    className="text-xl font-semibold mb-2"
                  >
                    Nenhuma partida hoje
                  </AnimatedGradientText>
                  <p className="text-gray-500">
                    Não há partidas programadas para hoje
                  </p>
                </div>
              </MagicCard>
            </motion.div>
          )}
        </section>

        {/* ✨ UPCOMING MATCHES SECTION */}
        <section className="mb-12">
          <EnhancedSectionHeader
            title="Próximas Partidas"
            icon={Zap}
            count={upcomingMatches?.length}
          />
          
          {upcomingLoading ? (
            <EnhancedMatchCardSkeleton count={6} />
          ) : upcomingError ? (
            <EnhancedErrorDisplay
              message="Falha ao carregar próximas partidas"
              onRetry={refetchUpcoming}
            />
          ) : upcomingMatches && upcomingMatches.length > 0 ? (
            <EnhancedMatchesGrid matches={upcomingMatches} title="Próximas" />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <MagicCard>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center">
                  <Glow color="#6B7280" size={4}>
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  </Glow>
                  <AnimatedGradientText 
                    colors={['#6B7280', '#9CA3AF', '#6B7280']}
                    className="text-xl font-semibold mb-2"
                  >
                    Nenhuma partida próxima
                  </AnimatedGradientText>
                  <p className="text-gray-500">
                    Não há partidas programadas
                  </p>
                </div>
              </MagicCard>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
