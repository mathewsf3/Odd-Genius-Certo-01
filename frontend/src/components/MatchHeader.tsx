/**
 * 🎯 MatchHeader Component - Match Analysis Header
 * 
 * Displays match information header for analysis pages
 * Portuguese-BR interface with green/white theme
 * Shows teams, score, status, and navigation controls
 */

'use client';

import { formatMatchTime, getMatchStatusText, isMatchLive } from '@/services/api';
import { Match } from '@/types/api';
import Image from 'next/image';

interface MatchHeaderProps {
  match: Match;
  onBack: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export default function MatchHeader({ match, onBack, onRefresh, loading = false }: MatchHeaderProps) {
  const isLive = isMatchLive(match);
  
  // Helper functions for data validation
  function getValidScore(score: unknown): number {
    const numScore = Number(score);
    return isNaN(numScore) ? 0 : numScore;
  }

  function getValidImageUrl(url: unknown): string | null {
    if (!url || typeof url !== 'string') return null;

    // Handle relative URLs by making them absolute
    if (url.startsWith('teams/') || url.startsWith('images/')) {
      return `https://footystats.org/${url}`;
    }

    // Handle already absolute URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Handle root-relative URLs
    if (url.startsWith('/')) {
      return url;
    }

    // Invalid URL format
    return null;
  }

  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Get team data with fallbacks and proper validation
  const homeTeam = {
    id: match.home?.id || match.homeID,
    name: match.home?.name || match.home_name || 'Time Casa',
    logo: getValidImageUrl(match.home?.logo || match.home_image),
    score: getValidScore(match.home?.score ?? match.homeGoalCount),
  };

  const awayTeam = {
    id: match.away?.id || match.awayID,
    name: match.away?.name || match.away_name || 'Time Visitante',
    logo: getValidImageUrl(match.away?.logo || match.away_image),
    score: getValidScore(match.away?.score ?? match.awayGoalCount),
  };
  
  // Get league information
  const league = {
    name: match.league?.name || match.competition_name || 'Liga',
    country: match.league?.country || match.country_name || '',
  };

  const getScoreDisplay = () => {
    if (isLive || match.status === 'finished') {
      return `${homeTeam.score} x ${awayTeam.score}`;
    }
    return 'vs';
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Voltar ao Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-3">
            {/* Live indicator */}
            {isLive && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-700">AO VIVO</span>
              </div>
            )}
            
            {/* Refresh button */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className={`p-2 rounded-lg transition-colors ${
                loading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Atualizar dados"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Match Information */}
        <div className="text-center">
          {/* League */}
          <div className="text-sm text-gray-600 mb-4">
            {league.name}
            {league.country && ` • ${league.country}`}
          </div>

          {/* Teams and Score */}
          <div className="flex items-center justify-center space-x-8 mb-4">
            {/* Home Team */}
            <div className="flex flex-col items-center space-y-3 flex-1 max-w-xs">
              <div className="relative w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                {homeTeam.logo && isValidUrl(homeTeam.logo) ? (
                  <Image
                    src={homeTeam.logo}
                    alt={`${homeTeam.name} logo`}
                    width={64}
                    height={64}
                    className="object-contain rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                    unoptimized={homeTeam.logo.startsWith('https://footystats.org')}
                  />
                ) : (
                  <span className="text-xl font-bold text-gray-500">
                    {homeTeam.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900">{homeTeam.name}</h2>
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center space-y-2">
              <div className={`text-3xl font-bold ${
                isLive ? 'text-red-600' : 'text-gray-700'
              }`}>
                {getScoreDisplay()}
              </div>
              <div className="text-sm text-gray-600">
                {getMatchStatusText(match)}
              </div>
              {match.status === 'upcoming' && (
                <div className="text-xs text-gray-500">
                  {formatMatchTime(match)}
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center space-y-3 flex-1 max-w-xs">
              <div className="relative w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                {awayTeam.logo && isValidUrl(awayTeam.logo) ? (
                  <Image
                    src={awayTeam.logo}
                    alt={`${awayTeam.name} logo`}
                    width={64}
                    height={64}
                    className="object-contain rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                    unoptimized={awayTeam.logo.startsWith('https://footystats.org')}
                  />
                ) : (
                  <span className="text-xl font-bold text-gray-500">
                    {awayTeam.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900">{awayTeam.name}</h2>
              </div>
            </div>
          </div>

          {/* Match ID for debugging */}
          <div className="text-xs text-gray-400">
            ID da Partida: {match.id}
          </div>
        </div>
      </div>
    </div>
  );
}
