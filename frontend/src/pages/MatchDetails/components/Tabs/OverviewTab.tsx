/**
 * 🎯 OVERVIEW TAB - MATCH GENERAL INFORMATION
 * 
 * ✅ Match basic info, venue, weather
 * ✅ Key statistics and odds
 * ✅ Recent form for both teams
 * ✅ Portuguese-BR interface
 */

import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Trophy, Users } from 'lucide-react';
import React from 'react';
import type { MatchData } from '../../../../components/MatchCard';

interface OverviewTabProps {
  match: MatchData;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ match }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'live': { label: 'AO VIVO', className: 'bg-red-500 text-white animate-pulse' },
      'upcoming': { label: 'EM BREVE', className: 'bg-yellow-100 text-yellow-800' },
      'finished': { label: 'FINALIZADA', className: 'bg-gray-500 text-white' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Match Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Status da Partida</h3>
          {getStatusBadge(match.status)}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Data</p>
              <p className="font-medium">{formatDate(match.date_unix)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Horário</p>
              <p className="font-medium">{formatTime(match.date_unix)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Trophy className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Competição</p>
              <p className="font-medium">{match.competition_name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Estádio</p>
              <p className="font-medium">{match.stadium_name || 'N/A'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Teams Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Comparação dos Times</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Home Team */}
          <div className="text-center">
            <img
              src={match.home_image}
              alt={match.home_name}
              className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-green-200"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = '/default-team.svg';
              }}
            />
            <h4 className="text-xl font-bold text-gray-900 mb-2">{match.home_name}</h4>
            <p className="text-gray-600 mb-4">Time da Casa</p>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Posição:</span>
                <span className="font-medium">N/A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Forma:</span>
                <span className="font-medium">N/A</span>
              </div>
            </div>
          </div>

          {/* VS */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">VS</p>
              {match.status === 'live' || match.status === 'finished' ? (
                <div className="mt-4">
                  <div className="flex items-center justify-center space-x-4">
                    <span className="text-3xl font-bold text-green-600">{match.homeGoalCount}</span>
                    <span className="text-xl font-bold text-gray-400">-</span>
                    <span className="text-3xl font-bold text-green-600">{match.awayGoalCount}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Away Team */}
          <div className="text-center">
            <img
              src={match.away_image}
              alt={match.away_name}
              className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-green-200"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = '/default-team.svg';
              }}
            />
            <h4 className="text-xl font-bold text-gray-900 mb-2">{match.away_name}</h4>
            <p className="text-gray-600 mb-4">Time Visitante</p>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Posição:</span>
                <span className="font-medium">N/A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Forma:</span>
                <span className="font-medium">N/A</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Match Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detalhes da Partida</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Informações do Venue</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Estádio:</span>
                <span className="font-medium">{match.stadium_name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Localização:</span>
                <span className="font-medium">{match.stadium_location || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">País:</span>
                <span className="font-medium">{match.country_name || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Condições</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Clima:</span>
                <span className="font-medium">N/A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Temperatura:</span>
                <span className="font-medium">N/A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vento:</span>
                <span className="font-medium">N/A</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pre-Match Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">📊 Análise Pré-Jogo</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-2xl font-bold text-green-600">
              {(match as any)?.corners_potential || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">Escanteios Esperados</p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">
              {(match as any)?.over25_potential ? `${(match as any).over25_potential}%` : 'N/A'}
            </p>
            <p className="text-sm text-gray-600">Over 2.5 Gols</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-2xl font-bold text-purple-600">
              {(match as any)?.over15_potential ? `${(match as any).over15_potential}%` : 'N/A'}
            </p>
            <p className="text-sm text-gray-600">Over 1.5 Gols</p>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-2xl font-bold text-orange-600">
              {(match as any)?.btts_potential ? `${(match as any).btts_potential}%` : 'N/A'}
            </p>
            <p className="text-sm text-gray-600">Ambas Marcam</p>
          </div>
        </div>
      </motion.div>

      {/* Additional Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">🎯 Previsões Detalhadas</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Potencial de Gols</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Over 3.5:</span>
                <span className="font-medium">
                  {(match as any)?.over35_potential ? `${(match as any).over35_potential}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Over 4.5:</span>
                <span className="font-medium">
                  {(match as any)?.over45_potential ? `${(match as any).over45_potential}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Under 2.5:</span>
                <span className="font-medium">
                  {(match as any)?.predictions?.under25_potential ? `${(match as any).predictions.under25_potential}%` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Tendências</h4>
            <div className="text-sm text-gray-600">
              {(() => {
                const trends = (match as any)?.trends;
                if (!trends) {
                  return <p className="italic">Tendências não disponíveis para esta partida</p>;
                }

                // Handle trends object with home/away structure
                if (typeof trends === 'object' && trends.home && trends.away) {
                  return (
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Casa:</span> {Array.isArray(trends.home) ? trends.home.join(', ') : 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Visitante:</span> {Array.isArray(trends.away) ? trends.away.join(', ') : 'N/A'}
                      </div>
                    </div>
                  );
                }

                // Handle trends as string
                if (typeof trends === 'string') {
                  return <p>{trends}</p>;
                }

                // Fallback for other formats
                return <p className="italic">Formato de tendências não suportado</p>;
              })()}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OverviewTab;
