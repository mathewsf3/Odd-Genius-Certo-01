/**
 * 🎯 ENHANCED MATCH CARD COMPONENT - Magic UI Design
 * 
 * ✅ Magic UI components integration
 * ✅ White and green color scheme
 * ✅ Advanced animations and effects
 * ✅ Real API data compatibility
 */

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, TrendingUp, Trophy } from "lucide-react";
import React from "react";
import { cn } from "../lib/utils";
import { MagicCard } from "./ui/magic-card";
import { ShimmerButton } from "./ui/shimmer-button";
import { TextAnimate } from "./ui/text-animate";

// ✅ REAL API DATA INTERFACES - Updated for FootyStats API
interface MatchData {
  id: number;
  homeID: number;
  awayID: number;
  home_name: string;
  away_name: string;
  home_image: string;
  away_image: string;
  homeGoalCount: number;
  awayGoalCount: number;
  status: string;
  date_unix: number;
  stadium_name?: string;
  stadium_location?: string;
  competition_id?: number;
  match_url?: string;
}

interface MatchCardProps {
  match: MatchData;
  className?: string;
  mostrarEstatisticas?: boolean;
  mostrarOdds?: boolean;
  animado?: boolean;
  onAnalisarPartida?: (matchId: number) => void;
}

const getStatusConfig = (status: string) => {
  const statusMap: { [key: string]: { label: string; className: string; icon: string } } = {
    // Live matches
    'live': { label: 'AO VIVO', className: 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50', icon: '🔴' },
    'incomplete': { label: 'AO VIVO', className: 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50', icon: '🔴' },

    // Upcoming matches
    'upcoming': { label: 'EM BREVE', className: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg shadow-yellow-400/50', icon: '⏰' },
    'scheduled': { label: 'EM BREVE', className: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg shadow-yellow-400/50', icon: '⏰' },

    // Finished matches
    'finished': { label: 'FINALIZADA', className: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-600/50', icon: '✅' },
    'complete': { label: 'FINALIZADA', className: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-600/50', icon: '✅' },

    // Special cases
    'postponed': { label: 'ADIADA', className: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/50', icon: '⚠️' },
    'cancelled': { label: 'CANCELADA', className: 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/50', icon: '❌' }
  };

  return statusMap[status] || { label: 'EM BREVE', className: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg shadow-yellow-400/50', icon: '⏰' };
};

const EnhancedMatchCard: React.FC<MatchCardProps> = ({
  match,
  className,
  animado = true,
  onAnalisarPartida
}) => {
  const statusConfig = getStatusConfig(match.status);

  const formatDate = () => {
    if (match.date_unix) {
      const date = new Date(match.date_unix * 1000);
      const today = new Date();
      if (date.toDateString() === today.toDateString()) return 'Hoje';
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
    return 'Data não informada';
  };

  const formatTime = () => {
    if (match.date_unix) {
      return new Date(match.date_unix * 1000).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return 'Horário não informado';
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      }
    },
    hover: { 
      y: -8, 
      scale: 1.03,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
      }
    }
  };

  const CardComponent = animado ? motion.div : 'div';

  return (
    <CardComponent
      className={cn(
        "relative w-full max-w-md mx-auto overflow-hidden", 
        className
      )}
      variants={animado ? cardVariants : undefined}
      initial={animado ? "hidden" : undefined}
      animate={animado ? "visible" : undefined}
      whileHover={animado ? "hover" : undefined}
    >
      <MagicCard 
        className="h-full bg-gradient-to-br from-white via-green-50 to-white border-2 border-green-200/60 shadow-xl"
        gradientColor="#22c55e"
        gradientOpacity={0.3}
      >
        <div className="relative p-6 h-full flex flex-col">
          {/* Header with enhanced animations */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Trophy className="w-5 h-5 text-green-600" />
              </motion.div>
              <TextAnimate 
                animation="blurInUp"
                className="text-sm font-semibold text-green-700"
              >
                {`Partida • ${formatDate()}`}
              </TextAnimate>
            </div>
            
            <motion.div 
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm",
                statusConfig.className,
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <TextAnimate animation="scaleUp" className="flex items-center gap-1">
                {`${statusConfig.icon} ${statusConfig.label}`}
              </TextAnimate>
            </motion.div>
          </div>

          {/* Teams Section with enhanced visuals */}
          <div className="flex-1 flex items-center justify-between mb-6">
            {/* Home Team */}
            <motion.div 
              className="flex flex-col items-center space-y-3 flex-1"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="relative">
                <motion.div 
                  className="w-20 h-20 rounded-full overflow-hidden border-3 border-green-300 bg-white shadow-lg shadow-green-500/20"
                  whileHover={{ 
                    borderColor: "#22c55e",
                    boxShadow: "0 0 25px rgba(34, 197, 94, 0.4)"
                  }}
                >
                  <img
                    src={match.home_image ? `https://footystats.org/img/${match.home_image}` : '/assets/placeholder-team.svg'}
                    alt={match.home_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/assets/placeholder-team.svg';
                    }}
                    loading="lazy"
                  />
                </motion.div>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-full bg-green-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="text-center space-y-2">
                <TextAnimate 
                  animation="slideUp"
                  className="text-sm font-bold text-gray-900 leading-tight"
                >
                  {match.home_name}
                </TextAnimate>
                <motion.span 
                  className="text-xs font-medium text-green-600 bg-gradient-to-r from-green-100 to-green-200 px-3 py-1 rounded-full shadow-sm"
                  whileHover={{ scale: 1.1 }}
                >
                  CASA
                </motion.span>
              </div>
            </motion.div>

            {/* Score/Time Section */}
            <div className="flex flex-col items-center space-y-3 px-6">
              {match.status === 'live' || match.status === 'incomplete' || match.status === 'finished' || match.status === 'complete' ? (
                <motion.div 
                  className="flex items-center space-x-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                >
                  <motion.span 
                    className="text-4xl font-bold text-green-600 drop-shadow-sm"
                    whileHover={{ scale: 1.1, color: "#16a34a" }}
                  >
                    {match.homeGoalCount != null ? match.homeGoalCount : 0}
                  </motion.span>
                  <motion.span 
                    className="text-3xl font-bold text-gray-400"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ×
                  </motion.span>
                  <motion.span 
                    className="text-4xl font-bold text-green-600 drop-shadow-sm"
                    whileHover={{ scale: 1.1, color: "#16a34a" }}
                  >
                    {match.awayGoalCount != null ? match.awayGoalCount : 0}
                  </motion.span>
                </motion.div>
              ) : (
                <motion.div 
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="w-8 h-8 text-green-600 mb-2" />
                  </motion.div>
                  <TextAnimate 
                    animation="blurIn"
                    className="text-lg font-bold text-green-600"
                  >
                    {formatTime()}
                  </TextAnimate>
                </motion.div>
              )}
              
              {/* Live indicator for ongoing matches */}
              {(match.status === 'live' || match.status === 'incomplete') && (
                <motion.div
                  className="flex items-center gap-2 text-red-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium">AO VIVO</span>
                </motion.div>
              )}
            </div>

            {/* Away Team */}
            <motion.div 
              className="flex flex-col items-center space-y-3 flex-1"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="relative">
                <motion.div 
                  className="w-20 h-20 rounded-full overflow-hidden border-3 border-blue-300 bg-white shadow-lg shadow-blue-500/20"
                  whileHover={{ 
                    borderColor: "#3b82f6",
                    boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)"
                  }}
                >
                  <img
                    src={match.away_image ? `https://footystats.org/img/${match.away_image}` : '/assets/placeholder-team.svg'}
                    alt={match.away_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/assets/placeholder-team.svg';
                    }}
                    loading="lazy"
                  />
                </motion.div>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="text-center space-y-2">
                <TextAnimate 
                  animation="slideUp"
                  className="text-sm font-bold text-gray-900 leading-tight"
                >
                  {match.away_name}
                </TextAnimate>
                <motion.span 
                  className="text-xs font-medium text-blue-600 bg-gradient-to-r from-blue-100 to-blue-200 px-3 py-1 rounded-full shadow-sm"
                  whileHover={{ scale: 1.1 }}
                >
                  FORA
                </motion.span>
              </div>
            </motion.div>
          </div>

          {/* Stadium Info */}
          <motion.div 
            className="flex items-center justify-center py-4 border-t border-green-200/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="font-medium">{formatDate()}</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <MapPin className="w-4 h-4 text-green-600" />
                <span 
                  className="font-medium truncate max-w-[150px]" 
                  title={match.stadium_name || 'Local não informado'}
                >
                  {match.stadium_name || 'Local a definir'}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Action Button */}
          {onAnalisarPartida && (
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <ShimmerButton
                onClick={() => onAnalisarPartida(match.id)}
                className="w-full py-4 text-base font-semibold rounded-xl"
                shimmerColor="#22c55e"
                background="rgba(34, 197, 94, 1)"
              >
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Analisar Partida</span>
                </div>
              </ShimmerButton>
            </motion.div>
          )}
        </div>
      </MagicCard>
    </CardComponent>
  );
};

export default EnhancedMatchCard;
export type { MatchCardProps, MatchData };
