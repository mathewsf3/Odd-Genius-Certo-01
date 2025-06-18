/**
 * 🎯 StatisticsTab Component - Match Statistics
 * 
 * Displays detailed match statistics and team performance
 * Portuguese-BR interface with green/white theme
 */

'use client';

import React from 'react';
import { Match, MatchAnalysis } from '@/types/api';

interface StatisticsTabProps {
  match: Match;
  analysis: MatchAnalysis | null;
  onRefresh: () => void;
}

export default function StatisticsTab({ match, analysis, onRefresh }: StatisticsTabProps) {
  const homeTeam = {
    name: match.home?.name || match.home_name || 'Time Casa',
  };
  
  const awayTeam = {
    name: match.away?.name || match.away_name || 'Time Visitante',
  };

  const stats = [
    {
      label: 'Gols',
      home: match.homeGoalCount || 0,
      away: match.awayGoalCount || 0,
    },
    {
      label: 'Chutes no Alvo',
      home: match.team_a_shotsOnTarget || 0,
      away: match.team_b_shotsOnTarget || 0,
    },
    {
      label: 'Chutes Totais',
      home: match.team_a_shots || 0,
      away: match.team_b_shots || 0,
    },
    {
      label: 'Posse de Bola (%)',
      home: match.team_a_possession || 0,
      away: match.team_b_possession || 0,
    },
    {
      label: 'Escanteios',
      home: match.team_a_corners || 0,
      away: match.team_b_corners || 0,
    },
    {
      label: 'Cartões Amarelos',
      home: match.team_a_yellow_cards || 0,
      away: match.team_b_yellow_cards || 0,
    },
    {
      label: 'Cartões Vermelhos',
      home: match.team_a_red_cards || 0,
      away: match.team_b_red_cards || 0,
    },
    {
      label: 'Faltas',
      home: match.team_a_fouls || 0,
      away: match.team_b_fouls || 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📈 Estatísticas da Partida
        </h3>
        <p className="text-gray-600">
          Estatísticas detalhadas entre <strong>{homeTeam.name}</strong> e <strong>{awayTeam.name}</strong>
        </p>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1 text-right">
                <span className="text-lg font-semibold text-gray-900">{stat.home}</span>
              </div>
              <div className="flex-1 text-center px-4">
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
              <div className="flex-1 text-left">
                <span className="text-lg font-semibold text-gray-900">{stat.away}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          📊 Estatísticas Adicionais
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {((match.team_a_possession || 0) + (match.team_b_possession || 0)) > 0 ? 
                Math.round((match.team_a_possession || 0) + (match.team_b_possession || 0)) : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Posse Total</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {(match.team_a_shots || 0) + (match.team_b_shots || 0)}
            </div>
            <div className="text-sm text-gray-600">Chutes Totais</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {(match.team_a_corners || 0) + (match.team_b_corners || 0)}
            </div>
            <div className="text-sm text-gray-600">Escanteios Totais</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {(match.team_a_yellow_cards || 0) + (match.team_b_yellow_cards || 0) + 
               (match.team_a_red_cards || 0) + (match.team_b_red_cards || 0)}
            </div>
            <div className="text-sm text-gray-600">Cartões Totais</div>
          </div>
        </div>
      </div>
    </div>
  );
}
