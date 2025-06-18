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
  competition_name?: string;
  country_name?: string;
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
  // ✅ ENHANCED STATUS MAPPING - Including FootyStats live statuses
  const normalizedStatus = status.toLowerCase();
  const statusMap: { [key: string]: { label: string; className: string; icon: string } } = {
    // Live matches - All FootyStats live statuses
    'live': { label: 'AO VIVO', className: 'bg-red-500 text-white animate-pulse', icon: '🔴' },
    'inplay': { label: 'AO VIVO', className: 'bg-red-500 text-white animate-pulse', icon: '🔴' },
    '1st half': { label: 'AO VIVO', className: 'bg-red-500 text-white animate-pulse', icon: '🔴' },
    '2nd half': { label: 'AO VIVO', className: 'bg-red-500 text-white animate-pulse', icon: '🔴' },
    'ht': { label: 'INTERVALO', className: 'bg-orange-500 text-white animate-pulse', icon: '⏸️' },
    'et': { label: 'PRORROGAÇÃO', className: 'bg-red-600 text-white animate-pulse', icon: '🔴' },
    'penalties': { label: 'PÊNALTIS', className: 'bg-purple-500 text-white animate-pulse', icon: '⚽' },
    'incomplete': { label: 'AO VIVO', className: 'bg-red-500 text-white animate-pulse', icon: '🔴' },

    // Upcoming matches
    'upcoming': { label: 'EM BREVE', className: 'bg-yellow-100 text-yellow-800', icon: '⏰' },
    'not_started': { label: 'EM BREVE', className: 'bg-yellow-100 text-yellow-800', icon: '⏰' },
    'ns': { label: 'EM BREVE', className: 'bg-yellow-100 text-yellow-800', icon: '⏰' },
    'scheduled': { label: 'EM BREVE', className: 'bg-yellow-100 text-yellow-800', icon: '⏰' },
    'kick off': { label: 'EM BREVE', className: 'bg-yellow-100 text-yellow-800', icon: '⏰' },
    'tbd': { label: 'A DEFINIR', className: 'bg-gray-100 text-gray-800', icon: '❓' },

    // Finished matches
    'finished': { label: 'FINALIZADA', className: 'bg-gray-500 text-white', icon: '✅' },
    'complete': { label: 'FINALIZADA', className: 'bg-gray-500 text-white', icon: '✅' },
    'ft': { label: 'FINALIZADA', className: 'bg-gray-500 text-white', icon: '✅' },

    // Special cases
    'postponed': { label: 'ADIADA', className: 'bg-yellow-500 text-black', icon: '⚠️' },
    'cancelled': { label: 'CANCELADA', className: 'bg-red-100 text-red-800', icon: '❌' },
    'suspended': { label: 'SUSPENSA', className: 'bg-red-200 text-red-900', icon: '⛔' }
  };

  return statusMap[normalizedStatus] || { label: 'EM BREVE', className: 'bg-yellow-100 text-yellow-800', icon: '⏰' };
};

// ✅ UTILITY FUNCTION FOR LOGO URL HANDLING
const buildLogoUrl = (imagePath: string | null | undefined, teamId: number): string => {
  // If empty → return placeholder
  if (!imagePath || imagePath === 'null' || imagePath.trim() === '') {
    return '/default-team.svg';
  }

  // If already absolute (http/https) → ensure https
  if (imagePath.startsWith('http')) {
    return imagePath.replace('http://', 'https://');
  }

  // Use new CDN: https://cdn.footystats.org/img/
  return `https://cdn.footystats.org/img/${imagePath}`;
};

// ✅ UTILITY FUNCTION TO DETERMINE IF SCORE SHOULD BE SHOWN
const shouldShowScore = (status: string): boolean => {
  const normalizedStatus = status.toLowerCase();
  const scoreStatuses = [
    'live', 'inplay', '1st half', '2nd half', 'ht', 'et', 'penalties',
    'incomplete', 'finished', 'complete', 'ft', 'suspended'
  ];
  return scoreStatuses.includes(normalizedStatus);
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
              {match.competition_name || `Liga ${match.competition_id || 'N/A'}`} • {formatDate()}
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
                src={buildLogoUrl(match.home_image, match.homeID)}
                alt={match.home_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  // 1st fallback: try CDN generic by ID
                  target.onerror = () => {
                    // 2nd fallback: placeholder local
                    target.src = '/default-team.svg';
                  };
                  target.src = `https://cdn.footystats.org/img/team-logo/${match.homeID}.png`;
                }}
                loading="lazy"
              />
            </div>
            <h3 className="text-sm font-bold text-center text-gray-900">{match.home_name}</h3>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">CASA</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center space-y-2 px-4">
            {shouldShowScore(match.status) ? (
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
                src={buildLogoUrl(match.away_image, match.awayID)}
                alt={match.away_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  // 1st fallback: try CDN generic by ID
                  target.onerror = () => {
                    // 2nd fallback: placeholder local
                    target.src = '/default-team.svg';
                  };
                  target.src = `https://cdn.footystats.org/img/team-logo/${match.awayID}.png`;
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
            onClick={() => {
              console.log(`🎯 Clicando em Analisar Partida - Match ID: ${match.id}`);
              onAnalisarPartida(match.id);
            }}
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

