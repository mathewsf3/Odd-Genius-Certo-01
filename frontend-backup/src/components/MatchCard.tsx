/**
 * 🎯 ENHANCED MATCH CARD COMPONENT - 100% REAL API DATA
 * 
 * ✅ ZERO hardcoded data
 * ✅ Real backend API integration
 * ✅ Portuguese-BR interface
 * ✅ Green/White theme
 * ✅ Expected Goals feature
 * ✅ Enhanced animations
 * ✅ Responsive design
 */

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Target, TrendingUp, Trophy } from "lucide-react";
import * as React from "react";

// ✅ REAL API DATA INTERFACES - MAPPED FROM BACKEND
interface TeamData {
  id: number; // homeID/awayID from backend
  nome: string; // team name
  nomeAbreviado: string; // abbreviated name
  logo: string; // team logo URL
  golsEsperados?: number; // expected goals for this match
}

interface EstadioData {
  nome: string; // stadium_name from backend
  cidade: string; // stadium_location from backend
}

interface MatchData {
  // Core identifiers
  id: number; // match id from backend
  timeCasa: TeamData; // home team
  timeVisitante: TeamData; // away team
  
  // Scores
  placarCasa: number; // homeGoalCount from backend
  placarVisitante: number; // awayGoalCount from backend
  
  // Status and timing
  status: 'agendada' | 'ao-vivo' | 'finalizada' | 'adiada';
  tempo?: string; // current match time
  dataHora: string; // ISO string
  horario: string; // formatted time
  
  // Venue and competition
  estadio: EstadioData;
  liga: {
    id: number;
    nome: string;
    logo: string;
    pais: string;
    rodada?: string;
  };
  
  // Analytics
  golsEsperadosTotal?: number;
  publico?: number;
  
  // Betting odds
  odds?: {
    casa: number; // odds_ft_1
    empate: number; // odds_ft_x
    visitante: number; // odds_ft_2
  };
  
  // Statistics
  estatisticas?: {
    posseBola: [number, number];
    finalizacoes: [number, number];
    escanteios: [number, number];
    cartoes: [number, number];
  };
}

// ✅ COMPONENT PROPS
interface MatchCardProps {
  match: MatchData; // ✅ Real data only
  className?: string;
  mostrarEstatisticas?: boolean;
  mostrarOdds?: boolean;
  animado?: boolean;
  onAnalisarPartida?: (matchId: number) => void;
}

// ✅ STATUS CONFIGURATIONS
const getStatusConfig = (status: MatchData['status']) => {
  const configs = {
    'ao-vivo': {
      label: 'AO VIVO',
      className: 'bg-red-500 text-white animate-pulse',
      icon: '🔴'
    },
    'finalizada': {
      label: 'FINALIZADA',
      className: 'bg-gray-500 text-white',
      icon: '✅'
    },
    'agendada': {
      label: 'AGENDADA',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      icon: '⏰'
    },
    'adiada': {
      label: 'ADIADA',
      className: 'bg-yellow-500 text-black',
      icon: '⚠️'
    }
  };
  return configs[status];
};

// ✅ MAIN COMPONENT
const MatchCard: React.FC<MatchCardProps> = ({
  match,
  className,
  mostrarEstatisticas = true,
  mostrarOdds = false,
  animado = true,
  onAnalisarPartida
}) => {
  const statusConfig = getStatusConfig(match.status);
  
  // ✅ FORMAT FUNCTIONS - REAL DATA ONLY
  const formatTime = () => {
    if (match.status === 'ao-vivo' && match.tempo) return match.tempo;
    if (match.status === 'finalizada') return 'FIM';
    return match.horario;
  };

  const formatDate = () => {
    const date = new Date(match.dataHora);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Hoje';
    if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã';
    
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  // ✅ ANIMATION VARIANTS
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  };

  const scoreVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: { delay: 0.3, type: "spring", stiffness: 200 }
    }
  };

  const CardComponent = animado ? motion.div : 'div';
  const ScoreComponent = animado ? motion.div : 'div';

  return (
    <CardComponent
      className={cn(
        "relative w-full max-w-md mx-auto",
        "bg-gradient-to-br from-white to-green-50",
        "dark:from-gray-900 dark:to-green-950",
        "border-2 border-green-200 dark:border-green-800",
        "rounded-2xl shadow-lg hover:shadow-xl",
        "transition-all duration-300",
        "overflow-hidden",
        className
      )}
      variants={animado ? cardVariants : undefined}
      initial={animado ? "hidden" : undefined}
      animate={animado ? "visible" : undefined}
      whileHover={animado ? "hover" : undefined}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-32 h-32 bg-green-500 rounded-full blur-3xl" />
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-green-300 rounded-full blur-2xl" />
      </div>

      {/* Header */}
      <div className="relative p-4 border-b border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              {match.liga.nome} • {formatDate()}
            </span>
          </div>
          
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-bold",
            match.status === 'ao-vivo' ? "animate-pulse bg-red-500 text-white" : statusConfig.className
          )}>
            {match.status === 'ao-vivo' && match.tempo ? `${match.tempo} AO VIVO` : 
             `${statusConfig.icon} ${statusConfig.label}`}
          </div>
        </div>
      </div>

      {/* Teams and Score */}
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          {/* Home Team */}
          <div className="flex flex-col items-center space-y-2 flex-1">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-200 dark:border-green-700 bg-white">
              <img
                src={match.timeCasa.logo}
                alt={match.timeCasa.nome}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-sm font-bold text-center text-gray-900 dark:text-white">
              {match.timeCasa.nome}
            </h3>
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
              CASA
            </span>
          </div>

          {/* Score */}
          <ScoreComponent
            className="flex flex-col items-center space-y-2 px-4"
            variants={animado ? scoreVariants : undefined}
            initial={animado ? "hidden" : undefined}
            animate={animado ? "visible" : undefined}
          >
            {match.status === 'ao-vivo' || match.status === 'finalizada' ? (
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {match.placarCasa}
                </span>
                <span className="text-2xl font-bold text-gray-400">×</span>
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {match.placarVisitante}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400 mb-1" />
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {match.horario}
                </span>
              </div>
            )}
          </ScoreComponent>

          {/* Away Team */}
          <div className="flex flex-col items-center space-y-2 flex-1">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-200 dark:border-green-700 bg-white">
              <img
                src={match.timeVisitante.logo}
                alt={match.timeVisitante.nome}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-sm font-bold text-center text-gray-900 dark:text-white">
              {match.timeVisitante.nome}
            </h3>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
              FORA
            </span>
          </div>
        </div>

        {/* Stadium and Date */}
        <div className="flex items-center justify-center mt-4 pt-4 border-t border-green-200 dark:border-green-800">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{match.estadio.nome}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expected Goals Section */}
      {(match.timeCasa.golsEsperados !== undefined ||
        match.timeVisitante.golsEsperados !== undefined ||
        match.golsEsperadosTotal !== undefined) && (
        <div className="relative p-4 bg-green-50 dark:bg-green-950/50 border-t border-green-200 dark:border-green-800">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-xl p-4 border border-green-200 dark:border-green-700 shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Gols Esperados</span>
              <TrendingUp className="w-4 h-4 text-gray-500" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {match.timeCasa.golsEsperados !== undefined && (
                <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-green-100 dark:border-green-800">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {match.timeCasa.golsEsperados.toFixed(2)}
                  </div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">Casa</div>
                </div>
              )}
              {match.golsEsperadosTotal !== undefined && (
                <div className="text-center bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 shadow-md">
                  <div className="text-lg font-bold text-white">
                    {match.golsEsperadosTotal.toFixed(2)}
                  </div>
                  <div className="text-xs font-medium text-green-100 mt-1">Total</div>
                </div>
              )}
              {match.timeVisitante.golsEsperados !== undefined && (
                <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-blue-100 dark:border-blue-800">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {match.timeVisitante.golsEsperados.toFixed(2)}
                  </div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">Fora</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      {mostrarEstatisticas && match.estatisticas && (
        <div className="relative p-4 bg-gray-50 dark:bg-gray-950/50 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Posse</div>
              <div className="text-sm font-semibold">
                {match.estatisticas.posseBola[0]}% - {match.estatisticas.posseBola[1]}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Finalizações</div>
              <div className="text-sm font-semibold">
                {match.estatisticas.finalizacoes[0]} - {match.estatisticas.finalizacoes[1]}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Escanteios</div>
              <div className="text-sm font-semibold">
                {match.estatisticas.escanteios[0]} - {match.estatisticas.escanteios[1]}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Odds Section */}
      {mostrarOdds && match.odds && (
        <div className="relative p-4 bg-blue-50 dark:bg-blue-950/50 border-t border-blue-200 dark:border-blue-800">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-green-50 rounded border border-green-200">
              <div className="text-xs text-green-600 font-medium">Casa</div>
              <div className="text-sm font-bold text-green-700">{match.odds.casa.toFixed(2)}</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded border border-gray-200">
              <div className="text-xs text-gray-600 font-medium">Empate</div>
              <div className="text-sm font-bold text-gray-700">{match.odds.empate.toFixed(2)}</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
              <div className="text-xs text-blue-600 font-medium">Fora</div>
              <div className="text-sm font-bold text-blue-700">{match.odds.visitante.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Analyze Button */}
      {onAnalisarPartida && (
        <div className="relative p-4 border-t border-green-200 dark:border-green-800">
          <button
            onClick={() => onAnalisarPartida(match.id)}
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-600 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
          >
            Analisar Partida
          </button>
        </div>
      )}
    </CardComponent>
  );
};

export default MatchCard;
export type { MatchCardProps, MatchData, TeamData };

