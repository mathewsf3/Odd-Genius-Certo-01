/**
 * 🎯 ENHANCED MAGIC UI MATCH CARD - TEST VERSION
 * 
 * ✅ MagicUI Components Integration
 * ✅ Beautiful animations and effects
 * ✅ Hover interactions
 * ✅ Glowing borders and backgrounds
 * ✅ Animated gradients
 * ✅ Real API data integration
 * ✅ Enhanced user experience
 */

"use client";

import { motion } from "framer-motion";
import { Activity, Clock, MapPin, Star, Target, TrendingUp, Trophy, Zap } from "lucide-react";
import { AnimatedGradientText, BorderBeam, Floating, Glow, MagicCard, Pulse } from "../ui/magic-components";
import { cn } from "../ui/utils";

// ✅ REAL API DATA INTERFACES - MAPPED FROM BACKEND
interface TeamData {
  id: number;
  nome: string;
  nomeAbreviado: string;
  logo: string;
  golsEsperados?: number;
}

interface EstadioData {
  nome: string;
  cidade: string;
}

interface MatchData {
  id: number;
  timeCasa: TeamData;
  timeVisitante: TeamData;
  placarCasa: number;
  placarVisitante: number;
  status: 'agendada' | 'ao-vivo' | 'finalizada' | 'adiada';
  tempo?: string;
  dataHora: string;
  horario: string;
  estadio: EstadioData;
  liga: {
    id: number;
    nome: string;
    logo: string;
    pais: string;
    rodada?: string;
  };
  golsEsperadosTotal?: number;
  publico?: number;
  odds?: {
    casa: number;
    empate: number;
    visitante: number;
  };
  estatisticas?: {
    posseBola: [number, number];
    finalizacoes: [number, number];
    escanteios: [number, number];
    cartoes: [number, number];
  };
}

interface EnhancedMatchCardProps {
  match: MatchData;
  className?: string;
  mostrarEstatisticas?: boolean;
  mostrarOdds?: boolean;
  animado?: boolean;
  onAnalisarPartida?: (matchId: number) => void;
}

// ✨ ENHANCED STATUS CONFIGURATIONS WITH MAGIC EFFECTS
const getEnhancedStatusConfig = (status: MatchData['status']) => {
  const configs = {
    'ao-vivo': {
      label: 'AO VIVO',
      className: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
      gradientColors: ['#EF4444', '#F59E0B', '#EF4444'],
      glowColor: '#EF4444',
      icon: '🔴'
    },
    'finalizada': {
      label: 'FINALIZADA',
      className: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
      gradientColors: ['#6B7280', '#9CA3AF', '#6B7280'],
      glowColor: '#6B7280',
      icon: '✅'
    },
    'agendada': {
      label: 'AGENDADA',
      className: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
      gradientColors: ['#10B981', '#22C55E', '#059669'],
      glowColor: '#10B981',
      icon: '⏰'
    },
    'adiada': {
      label: 'ADIADA',
      className: 'bg-gradient-to-r from-orange-500 to-yellow-500 text-black',
      gradientColors: ['#F59E0B', '#FBBF24', '#F59E0B'],
      glowColor: '#F59E0B',
      icon: '⏸️'
    }
  };
  return configs[status];
};

export default function EnhancedMatchCard({
  match,
  className,
  mostrarEstatisticas = true,
  mostrarOdds = true,
  animado = true,
  onAnalisarPartida
}: EnhancedMatchCardProps) {
  const statusConfig = getEnhancedStatusConfig(match.status);

  // ✨ Animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hover: { 
      scale: 1.02,
      y: -5,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const teamVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, delay: 0.2 }
    }
  };

  const scoreVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, delay: 0.4, type: "spring" }
    }
  };

  return (
    <motion.div
      variants={animado ? cardVariants : undefined}
      initial={animado ? "hidden" : undefined}
      animate={animado ? "visible" : undefined}
      whileHover={animado ? "hover" : undefined}
      className={cn("relative overflow-hidden", className)}
    >
      {/* ✨ MAGIC CARD WITH INTERACTIVE EFFECTS */}
      <MagicCard
        className="p-0 shadow-none border-none"
        gradientFrom="#10B981"
        gradientTo="#22C55E"
        gradientColor="#10B98130"
      >
        <div className="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
          {/* ✨ BORDER BEAM ANIMATION */}
          <BorderBeam 
            size={100} 
            duration={8} 
            colorFrom={statusConfig.gradientColors[0]}
            colorTo={statusConfig.gradientColors[2]}
          />
          
          <div className="p-6 space-y-4">
            {/* ✨ HEADER WITH ENHANCED STATUS */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Glow color={statusConfig.glowColor} size={6}>
                  <Trophy className="w-5 h-5 text-green-600" />
                </Glow>
                <div>
                  <AnimatedGradientText 
                    colors={statusConfig.gradientColors}
                    className="text-sm font-semibold"
                  >
                    {match.liga.nome}
                  </AnimatedGradientText>
                  {match.liga.rodada && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {match.liga.rodada}
                    </p>
                  )}
                </div>
              </div>
              
              {/* ✨ ENHANCED STATUS BADGE */}
              <Pulse duration={match.status === 'ao-vivo' ? 1.5 : 0}>
                <Glow 
                  color={statusConfig.glowColor} 
                  size={match.status === 'ao-vivo' ? 8 : 4}
                >
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1",
                    statusConfig.className
                  )}>
                    <span>{statusConfig.icon}</span>
                    <span>{statusConfig.label}</span>
                  </div>
                </Glow>
              </Pulse>
            </div>

            {/* ✨ TEAMS AND SCORE WITH FLOATING EFFECTS */}
            <div className="flex items-center justify-between">
              {/* Home Team */}
              <motion.div 
                variants={teamVariants}
                className="flex items-center space-x-3 flex-1"
              >
                <Floating duration={4} distance={5}>
                  <Glow color="#10B981" size={3}>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 flex items-center justify-center overflow-hidden border-2 border-green-200 dark:border-green-700">
                      {match.timeCasa.logo ? (                        <img 
                          src={match.timeCasa.logo} 
                          alt={match.timeCasa.nome}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextEl = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextEl) nextEl.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ display: match.timeCasa.logo ? 'none' : 'flex' }}>
                        {match.timeCasa.nomeAbreviado.substring(0, 2)}
                      </div>
                    </div>
                  </Glow>
                </Floating>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {match.timeCasa.nome}
                  </p>
                  {match.timeCasa.golsEsperados && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Target className="w-3 h-3" />
                      <span>xG: {match.timeCasa.golsEsperados.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* ✨ ENHANCED SCORE WITH GLOW */}
              <motion.div 
                variants={scoreVariants}
                className="px-4"
              >
                {match.status === 'finalizada' || match.status === 'ao-vivo' ? (
                  <Glow color="#10B981" size={6}>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-xl shadow-lg">
                      {match.placarCasa} - {match.placarVisitante}
                    </div>
                  </Glow>
                ) : (
                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{match.horario}</span>
                    </div>
                  </div>
                )}
                
                {match.tempo && match.status === 'ao-vivo' && (
                  <Pulse>
                    <div className="text-center mt-1">
                      <span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-1 rounded">
                        {match.tempo}
                      </span>
                    </div>
                  </Pulse>
                )}
              </motion.div>

              {/* Away Team */}
              <motion.div 
                variants={teamVariants}
                className="flex items-center space-x-3 flex-1 flex-row-reverse"
              >
                <Floating duration={4.5} distance={5}>
                  <Glow color="#10B981" size={3}>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 flex items-center justify-center overflow-hidden border-2 border-green-200 dark:border-green-700">
                      {match.timeVisitante.logo ? (                        <img 
                          src={match.timeVisitante.logo} 
                          alt={match.timeVisitante.nome}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextEl = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextEl) nextEl.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ display: match.timeVisitante.logo ? 'none' : 'flex' }}>
                        {match.timeVisitante.nomeAbreviado.substring(0, 2)}
                      </div>
                    </div>
                  </Glow>
                </Floating>
                <div className="flex-1 min-w-0 text-right">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {match.timeVisitante.nome}
                  </p>
                  {match.timeVisitante.golsEsperados && (
                    <div className="flex items-center justify-end space-x-1 text-xs text-gray-500">
                      <span>xG: {match.timeVisitante.golsEsperados.toFixed(1)}</span>
                      <Target className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* ✨ ENHANCED VENUE INFO */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg py-2 px-3"
            >
              <MapPin className="w-4 h-4" />
              <span>{match.estadio.nome}, {match.estadio.cidade}</span>
            </motion.div>

            {/* ✨ ENHANCED STATISTICS */}
            {mostrarEstatisticas && match.estatisticas && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg p-3 space-y-2"
              >
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Estatísticas da Partida</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <StatItem 
                    label="Posse de Bola" 
                    values={match.estatisticas.posseBola} 
                    isPercentage 
                  />
                  <StatItem 
                    label="Finalizações" 
                    values={match.estatisticas.finalizacoes} 
                  />
                  <StatItem 
                    label="Escanteios" 
                    values={match.estatisticas.escanteios} 
                  />
                  <StatItem 
                    label="Cartões" 
                    values={match.estatisticas.cartoes} 
                  />
                </div>
              </motion.div>
            )}

            {/* ✨ ENHANCED ODDS */}
            {mostrarOdds && match.odds && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 1.0 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-3"
              >
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Odds</span>
                </h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <OddItem label="Casa" value={match.odds.casa} />
                  <OddItem label="Empate" value={match.odds.empate} />
                  <OddItem label="Visitante" value={match.odds.visitante} />
                </div>
              </motion.div>
            )}

            {/* ✨ ENHANCED ACTION BUTTON */}
            {onAnalisarPartida && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <button
                  onClick={() => onAnalisarPartida(match.id)}
                  className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Zap className="w-4 h-4" />
                  <span>Analisar Partida</span>
                  <Star className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </MagicCard>
    </motion.div>
  );
}

// ✨ ENHANCED STAT ITEM COMPONENT
function StatItem({ 
  label, 
  values, 
  isPercentage = false 
}: { 
  label: string; 
  values: [number, number]; 
  isPercentage?: boolean; 
}) {
  const total = values[0] + values[1];
  const homePercentage = total > 0 ? (values[0] / total) * 100 : 50;
  
  return (
    <div>
      <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-1">
        <span>{isPercentage ? `${values[0]}%` : values[0]}</span>
        <span className="font-medium">{label}</span>
        <span>{isPercentage ? `${values[1]}%` : values[1]}</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
          initial={{ width: "50%" }}
          animate={{ width: `${homePercentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </div>
  );
}

// ✨ ENHANCED ODD ITEM COMPONENT
function OddItem({ label, value }: { label: string; value: number }) {
  return (
    <Glow color="#3B82F6" size={2}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center border border-blue-200 dark:border-blue-800">
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className="font-bold text-blue-600 dark:text-blue-400">{value.toFixed(2)}</div>
      </div>
    </Glow>
  );
}
