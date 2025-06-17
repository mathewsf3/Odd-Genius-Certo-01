/**
 * 🎯 MATCH CARD COMPONENT - REAL API DATA
 * 
 * ✅ ZERO hardcoded data
 * ✅ Portuguese-BR interface
 * ✅ Green/White theme
 * ✅ Vite React compatibility
 */

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Trophy } from "lucide-react";
import React from "react";
import { cn } from "../lib/utils";

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
  // ✅ NORMALIZED STATUS MAPPING - Following user's checklist
  const statusMap: { [key: string]: { label: string; className: string; icon: string } } = {
    // Live matches
    'live': { label: 'AO VIVO', className: 'bg-red-500 text-white animate-pulse', icon: '🔴' },
    'incomplete': { label: 'AO VIVO', className: 'bg-red-500 text-white animate-pulse', icon: '🔴' },

    // Upcoming matches
    'upcoming': { label: 'EM BREVE', className: 'bg-yellow-100 text-yellow-800', icon: '⏰' },
    'scheduled': { label: 'EM BREVE', className: 'bg-yellow-100 text-yellow-800', icon: '⏰' },

    // Finished matches
    'finished': { label: 'FINALIZADA', className: 'bg-gray-500 text-white', icon: '✅' },
    'complete': { label: 'FINALIZADA', className: 'bg-gray-500 text-white', icon: '✅' },

    // Special cases
    'postponed': { label: 'ADIADA', className: 'bg-yellow-500 text-black', icon: '⚠️' },
    'cancelled': { label: 'CANCELADA', className: 'bg-red-100 text-red-800', icon: '❌' }
  };

  return statusMap[status] || { label: 'EM BREVE', className: 'bg-yellow-100 text-yellow-800', icon: '⏰' };
};

const MatchCard: React.FC<MatchCardProps> = ({
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -5, scale: 1.02 }
  };

  const CardComponent = animado ? motion.div : 'div';

  return (
    <CardComponent
      className={cn(
        "relative w-full max-w-md mx-auto bg-gradient-to-br from-white to-green-50",
        "border-2 border-green-200 rounded-2xl shadow-lg hover:shadow-xl",
        "transition-all duration-300 overflow-hidden", className
      )}
      variants={animado ? cardVariants : undefined}
      initial={animado ? "hidden" : undefined}
      animate={animado ? "visible" : undefined}
      whileHover={animado ? "hover" : undefined}
    >
      {/* Header */}
      <div className="relative p-4 border-b border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 truncate max-w-[200px]">
              Partida • {formatDate()}
            </span>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-bold",
            statusConfig.className,
            match.status === 'incomplete' && "animate-pulse"
          )}>
            {`${statusConfig.icon} ${statusConfig.label}`}
          </div>
        </div>
      </div>

      {/* Teams and Score */}
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          {/* Home Team */}
          <div className="flex flex-col items-center space-y-2 flex-1">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-200 bg-white">
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
            </div>
            <h3 className="text-sm font-bold text-center text-gray-900">{match.home_name}</h3>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">CASA</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center space-y-2 px-4">
            {match.status === 'live' || match.status === 'incomplete' || match.status === 'finished' || match.status === 'complete' ? (
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-green-600">
                  {match.homeGoalCount != null ? match.homeGoalCount : 0}
                </span>
                <span className="text-2xl font-bold text-gray-400">×</span>
                <span className="text-3xl font-bold text-green-600">
                  {match.awayGoalCount != null ? match.awayGoalCount : 0}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Clock className="w-6 h-6 text-green-600 mb-1" />
                <span className="text-lg font-bold text-green-600">{formatTime()}</span>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center space-y-2 flex-1">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-200 bg-white">
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
            </div>
            <h3 className="text-sm font-bold text-center text-gray-900">{match.away_name}</h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">FORA</span>
          </div>
        </div>

        {/* Stadium */}
        <div className="flex items-center justify-center mt-4 pt-4 border-t border-green-200">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-[150px]" title={match.stadium_name || 'Local não informado'}>
                {match.stadium_name || 'Local a definir'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      {onAnalisarPartida && (
        <div className="relative p-4 border-t border-green-200">
          <button
            onClick={() => onAnalisarPartida(match.id)}
            className="w-full px-6 py-3 text-base font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
          >
            Analisar Partida
          </button>
        </div>
      )}
    </CardComponent>
  );
};

export default MatchCard;
export type { MatchCardProps, MatchData };

