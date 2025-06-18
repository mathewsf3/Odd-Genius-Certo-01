/**
 * 🎯 H2HTab Component - Head-to-Head Analysis
 * 
 * Displays historical matchups between teams
 * Portuguese-BR interface with green/white theme
 * Shows recent encounters and statistics
 */

'use client';

import React from 'react';
import { Match, MatchAnalysis } from '@/types/api';
import MatchCard from '@/components/MatchCard';

interface H2HTabProps {
  match: Match;
  analysis: MatchAnalysis | null;
  onRefresh: () => void;
}

export default function H2HTab({ match, analysis, onRefresh }: H2HTabProps) {
  const homeTeam = {
    name: match.home?.name || match.home_name || 'Time Casa',
  };
  
  const awayTeam = {
    name: match.away?.name || match.away_name || 'Time Visitante',
  };

  const h2hMatches = analysis?.h2hMatches || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ⚔️ Histórico de Confrontos
        </h3>
        <p className="text-gray-600">
          Últimos confrontos entre <strong>{homeTeam.name}</strong> e <strong>{awayTeam.name}</strong>
        </p>
      </div>

      {/* H2H Statistics Summary */}
      {h2hMatches.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            📊 Resumo dos Confrontos
          </h4>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {h2hMatches.filter(m => {
                  const homeWon = (m.home?.name === homeTeam.name || m.home_name === homeTeam.name) && 
                                  (m.home?.score || m.homeGoalCount || 0) > (m.away?.score || m.awayGoalCount || 0);
                  const awayWon = (m.away?.name === homeTeam.name || m.away_name === homeTeam.name) && 
                                  (m.away?.score || m.awayGoalCount || 0) > (m.home?.score || m.homeGoalCount || 0);
                  return homeWon || awayWon;
                }).length}
              </div>
              <div className="text-sm text-green-700">Vitórias {homeTeam.name}</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {h2hMatches.filter(m => {
                  const homeScore = m.home?.score || m.homeGoalCount || 0;
                  const awayScore = m.away?.score || m.awayGoalCount || 0;
                  return homeScore === awayScore;
                }).length}
              </div>
              <div className="text-sm text-gray-600">Empates</div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {h2hMatches.filter(m => {
                  const homeWon = (m.home?.name === awayTeam.name || m.home_name === awayTeam.name) && 
                                  (m.home?.score || m.homeGoalCount || 0) > (m.away?.score || m.awayGoalCount || 0);
                  const awayWon = (m.away?.name === awayTeam.name || m.away_name === awayTeam.name) && 
                                  (m.away?.score || m.awayGoalCount || 0) > (m.home?.score || m.homeGoalCount || 0);
                  return homeWon || awayWon;
                }).length}
              </div>
              <div className="text-sm text-blue-700">Vitórias {awayTeam.name}</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Matches */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-semibold text-gray-900">
            🕒 Confrontos Recentes
          </h4>
          <span className="text-sm text-gray-500">
            {h2hMatches.length} partida(s) encontrada(s)
          </span>
        </div>
        
        {h2hMatches.length > 0 ? (
          <div className="space-y-4">
            {h2hMatches.slice(0, 10).map((h2hMatch, index) => (
              <MatchCard
                key={`h2h-${h2hMatch.id}-${index}`}
                match={h2hMatch}
                showAnalysisButton={false}
                className="hover:shadow-md transition-shadow"
              />
            ))}
            
            {h2hMatches.length > 10 && (
              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                  Mostrando 10 de {h2hMatches.length} confrontos
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">
              <div className="text-4xl mb-2">⚔️</div>
              <div className="text-lg font-medium mb-1">Nenhum confronto encontrado</div>
              <div className="text-sm">
                Não há histórico de partidas entre estes times em nossa base de dados
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional H2H Stats */}
      {h2hMatches.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            📈 Estatísticas dos Confrontos
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {(h2hMatches.reduce((sum, m) => sum + (m.home?.score || m.homeGoalCount || 0) + (m.away?.score || m.awayGoalCount || 0), 0) / h2hMatches.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Média de Gols</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {h2hMatches.filter(m => {
                  const homeScore = m.home?.score || m.homeGoalCount || 0;
                  const awayScore = m.away?.score || m.awayGoalCount || 0;
                  return homeScore > 0 && awayScore > 0;
                }).length}
              </div>
              <div className="text-sm text-gray-600">Ambos Marcaram</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {h2hMatches.filter(m => {
                  const totalGoals = (m.home?.score || m.homeGoalCount || 0) + (m.away?.score || m.awayGoalCount || 0);
                  return totalGoals > 2.5;
                }).length}
              </div>
              <div className="text-sm text-gray-600">Mais de 2.5 Gols</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {h2hMatches.length}
              </div>
              <div className="text-sm text-gray-600">Total de Jogos</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
