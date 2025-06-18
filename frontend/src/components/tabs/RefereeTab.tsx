/**
 * 🎯 RefereeTab Component - Referee Analysis
 * 
 * Displays referee information and statistics
 * Portuguese-BR interface with green/white theme
 */

'use client';

import React from 'react';
import { Match, MatchAnalysis } from '@/types/api';

interface RefereeTabProps {
  match: Match;
  analysis: MatchAnalysis | null;
  onRefresh: () => void;
}

export default function RefereeTab({ match, analysis, onRefresh }: RefereeTabProps) {
  const homeTeam = {
    name: match.home?.name || match.home_name || 'Time Casa',
  };
  
  const awayTeam = {
    name: match.away?.name || match.away_name || 'Time Visitante',
  };

  const totalYellowCards = (match.team_a_yellow_cards || 0) + (match.team_b_yellow_cards || 0);
  const totalRedCards = (match.team_a_red_cards || 0) + (match.team_b_red_cards || 0);
  const totalCards = totalYellowCards + totalRedCards;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          👨‍⚖️ Análise da Arbitragem
        </h3>
        <p className="text-gray-600">
          Informações sobre a arbitragem da partida entre <strong>{homeTeam.name}</strong> e <strong>{awayTeam.name}</strong>
        </p>
      </div>

      {/* Referee Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          ℹ️ Informações do Árbitro
        </h4>
        
        <div className="space-y-3">
          {match.refereeID ? (
            <div className="flex justify-between">
              <span className="text-gray-600">ID do Árbitro:</span>
              <span className="font-medium">{match.refereeID}</span>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <div className="text-2xl mb-2">👨‍⚖️</div>
              <div>Informações do árbitro não disponíveis</div>
            </div>
          )}
        </div>
      </div>

      {/* Cards Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          🟨 Estatísticas de Cartões
        </h4>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-3">Cartões Amarelos</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{homeTeam.name}:</span>
                <span className="font-medium">{match.team_a_yellow_cards || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{awayTeam.name}:</span>
                <span className="font-medium">{match.team_b_yellow_cards || 0}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium text-gray-700">Total:</span>
                <span className="font-bold text-yellow-600">{totalYellowCards}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-3">Cartões Vermelhos</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{homeTeam.name}:</span>
                <span className="font-medium">{match.team_a_red_cards || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{awayTeam.name}:</span>
                <span className="font-medium">{match.team_b_red_cards || 0}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium text-gray-700">Total:</span>
                <span className="font-bold text-red-600">{totalRedCards}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Distribution */}
        {totalCards > 0 && (
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700">Distribuição de Cartões</h5>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{homeTeam.name}</span>
                <span>{(((match.team_a_yellow_cards || 0) + (match.team_a_red_cards || 0)) / totalCards * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${((match.team_a_yellow_cards || 0) + (match.team_a_red_cards || 0)) / totalCards * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{awayTeam.name}</span>
                <span>{(((match.team_b_yellow_cards || 0) + (match.team_b_red_cards || 0)) / totalCards * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${((match.team_b_yellow_cards || 0) + (match.team_b_red_cards || 0)) / totalCards * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disciplinary Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          📊 Resumo Disciplinar
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{totalYellowCards}</div>
            <div className="text-sm text-yellow-700">Cartões Amarelos</div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{totalRedCards}</div>
            <div className="text-sm text-red-700">Cartões Vermelhos</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{totalCards}</div>
            <div className="text-sm text-gray-600">Total de Cartões</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {totalCards > 0 ? (totalCards / 2).toFixed(1) : '0.0'}
            </div>
            <div className="text-sm text-gray-600">Média por Time</div>
          </div>
        </div>
      </div>

      {/* Card Timing */}
      {(match.team_a_fh_cards !== undefined || match.team_a_2h_cards !== undefined) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            ⏱️ Cartões por Tempo
          </h4>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">1º Tempo</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{homeTeam.name}:</span>
                  <span className="font-medium">{match.team_a_fh_cards || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{awayTeam.name}:</span>
                  <span className="font-medium">{match.team_b_fh_cards || 0}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium text-gray-700">Total:</span>
                  <span className="font-bold">{(match.team_a_fh_cards || 0) + (match.team_b_fh_cards || 0)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">2º Tempo</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{homeTeam.name}:</span>
                  <span className="font-medium">{match.team_a_2h_cards || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{awayTeam.name}:</span>
                  <span className="font-medium">{match.team_b_2h_cards || 0}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium text-gray-700">Total:</span>
                  <span className="font-bold">{(match.team_a_2h_cards || 0) + (match.team_b_2h_cards || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
