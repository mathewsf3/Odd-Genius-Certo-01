/**
 * 🎯 OverviewTab Component - Match Overview Analysis
 * 
 * Displays comprehensive match overview with key statistics
 * Portuguese-BR interface with green/white theme
 * Shows predictions, team form, and key metrics
 */

'use client';

import React from 'react';
import { Match, MatchAnalysis } from '@/types/api';
import { isMatchLive, isMatchUpcoming } from '@/services/api';

interface OverviewTabProps {
  match: Match;
  analysis: MatchAnalysis | null;
  onRefresh: () => void;
}

export default function OverviewTab({ match, analysis, onRefresh }: OverviewTabProps) {
  const isLive = isMatchLive(match);
  const isUpcoming = isMatchUpcoming(match);
  
  // Get team data with fallbacks
  const homeTeam = {
    name: match.home?.name || match.home_name || 'Time Casa',
    score: match.home?.score ?? match.homeGoalCount ?? 0,
  };
  
  const awayTeam = {
    name: match.away?.name || match.away_name || 'Time Visitante',
    score: match.away?.score ?? match.awayGoalCount ?? 0,
  };

  // Get predictions if available
  const predictions = analysis?.predictions || {
    homeWin: match.odds_ft_1 ? (1 / match.odds_ft_1 * 100) : 0,
    draw: match.odds_ft_x ? (1 / match.odds_ft_x * 100) : 0,
    awayWin: match.odds_ft_2 ? (1 / match.odds_ft_2 * 100) : 0,
    btts: 0,
    over25: 0,
  };

  return (
    <div className="space-y-6">
      {/* Match Status Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Visão Geral da Partida
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{homeTeam.name}</div>
            <div className="text-sm text-gray-600">Time da Casa</div>
            {(isLive || match.status === 'finished') && (
              <div className="text-3xl font-bold text-green-600 mt-2">{homeTeam.score}</div>
            )}
          </div>
          
          <div className="text-center">
            <div className="text-lg text-gray-600">
              {isLive ? 'AO VIVO' : isUpcoming ? 'PRÓXIMA' : 'ENCERRADA'}
            </div>
            <div className="text-sm text-gray-500">
              {match.status === 'live' && match.minute ? `${match.minute}'` : ''}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{awayTeam.name}</div>
            <div className="text-sm text-gray-600">Time Visitante</div>
            {(isLive || match.status === 'finished') && (
              <div className="text-3xl font-bold text-green-600 mt-2">{awayTeam.score}</div>
            )}
          </div>
        </div>
      </div>

      {/* Predictions Card */}
      {(predictions.homeWin > 0 || predictions.draw > 0 || predictions.awayWin > 0) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 Previsões da Partida
          </h3>
          
          <div className="space-y-4">
            {/* Win Probabilities */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Vitória {homeTeam.name}</span>
                <span>{predictions.homeWin.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${predictions.homeWin}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Empate</span>
                <span>{predictions.draw.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${predictions.draw}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Vitória {awayTeam.name}</span>
                <span>{predictions.awayWin.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${predictions.awayWin}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Match Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📈 Estatísticas da Partida
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Goals */}
          {(isLive || match.status === 'finished') && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {homeTeam.score + awayTeam.score}
              </div>
              <div className="text-sm text-gray-600">Gols Total</div>
            </div>
          )}
          
          {/* Corners */}
          {match.team_a_corners !== undefined && match.team_a_corners >= 0 && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {(match.team_a_corners || 0) + (match.team_b_corners || 0)}
              </div>
              <div className="text-sm text-gray-600">Escanteios</div>
            </div>
          )}
          
          {/* Cards */}
          {match.team_a_yellow_cards !== undefined && match.team_a_yellow_cards >= 0 && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {(match.team_a_yellow_cards || 0) + (match.team_b_yellow_cards || 0)}
              </div>
              <div className="text-sm text-gray-600">Cartões</div>
            </div>
          )}
          
          {/* Odds */}
          {match.odds_ft_1 && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {match.odds_ft_1.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Odd Casa</div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ℹ️ Informações Adicionais
        </h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">ID da Partida:</span>
            <span className="font-medium">{match.id}</span>
          </div>
          
          {match.stadium_name && (
            <div className="flex justify-between">
              <span className="text-gray-600">Estádio:</span>
              <span className="font-medium">{match.stadium_name}</span>
            </div>
          )}
          
          {match.date_unix && (
            <div className="flex justify-between">
              <span className="text-gray-600">Data:</span>
              <span className="font-medium">
                {new Date(match.date_unix * 1000).toLocaleString('pt-BR')}
              </span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium capitalize">{match.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
