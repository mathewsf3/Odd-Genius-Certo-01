/**
 * 🎯 CornersTab Component - Corner Analysis
 * 
 * Displays corner statistics and analysis
 * Portuguese-BR interface with green/white theme
 */

'use client';

import React from 'react';
import { Match, MatchAnalysis } from '@/types/api';

interface CornersTabProps {
  match: Match;
  analysis: MatchAnalysis | null;
  onRefresh: () => void;
}

export default function CornersTab({ match, analysis, onRefresh }: CornersTabProps) {
  const homeTeam = {
    name: match.home?.name || match.home_name || 'Time Casa',
  };
  
  const awayTeam = {
    name: match.away?.name || match.away_name || 'Time Visitante',
  };

  const homeCorners = match.team_a_corners || 0;
  const awayCorners = match.team_b_corners || 0;
  const totalCorners = homeCorners + awayCorners;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📐 Análise de Escanteios
        </h3>
        <p className="text-gray-600">
          Estatísticas de escanteios entre <strong>{homeTeam.name}</strong> e <strong>{awayTeam.name}</strong>
        </p>
      </div>

      {/* Corner Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          📊 Estatísticas de Escanteios
        </h4>
        
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{homeCorners}</div>
            <div className="text-sm text-green-700">{homeTeam.name}</div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-600">{totalCorners}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{awayCorners}</div>
            <div className="text-sm text-blue-700">{awayTeam.name}</div>
          </div>
        </div>

        {/* Corner Distribution */}
        {totalCorners > 0 && (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{homeTeam.name}</span>
                <span>{((homeCorners / totalCorners) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(homeCorners / totalCorners) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{awayTeam.name}</span>
                <span>{((awayCorners / totalCorners) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(awayCorners / totalCorners) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Corner Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          🎯 Análise de Escanteios
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{totalCorners}</div>
            <div className="text-sm text-gray-600">Total de Escanteios</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {totalCorners > 0 ? (totalCorners / 2).toFixed(1) : '0.0'}
            </div>
            <div className="text-sm text-gray-600">Média por Time</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {homeCorners > awayCorners ? homeTeam.name.substring(0, 3) : 
               awayCorners > homeCorners ? awayTeam.name.substring(0, 3) : 'EMP'}
            </div>
            <div className="text-sm text-gray-600">Mais Escanteios</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {Math.abs(homeCorners - awayCorners)}
            </div>
            <div className="text-sm text-gray-600">Diferença</div>
          </div>
        </div>
      </div>

      {/* Corner Timing */}
      {(match.team_a_fh_corners !== undefined || match.team_a_2h_corners !== undefined) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            ⏱️ Escanteios por Tempo
          </h4>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">1º Tempo</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{homeTeam.name}:</span>
                  <span className="font-medium">{match.team_a_fh_corners || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{awayTeam.name}:</span>
                  <span className="font-medium">{match.team_b_fh_corners || 0}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium text-gray-700">Total:</span>
                  <span className="font-bold">{(match.team_a_fh_corners || 0) + (match.team_b_fh_corners || 0)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">2º Tempo</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{homeTeam.name}:</span>
                  <span className="font-medium">{match.team_a_2h_corners || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{awayTeam.name}:</span>
                  <span className="font-medium">{match.team_b_2h_corners || 0}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium text-gray-700">Total:</span>
                  <span className="font-bold">{(match.team_a_2h_corners || 0) + (match.team_b_2h_corners || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
