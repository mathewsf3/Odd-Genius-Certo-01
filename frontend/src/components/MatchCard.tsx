/**
 * 🎯 MatchCard Component - Enhanced Match Display
 * 
 * Displays match information with proper styling and interaction
 * Supports live, upcoming, and finished match states
 * Portuguese-BR interface with green/white theme
 */

'use client';

import { formatMatchTime, getMatchStatusText, isMatchLive, isMatchUpcoming } from '@/services/api';
import { Match } from '@/types/api';
import Image from 'next/image';
import React from 'react';

interface MatchCardProps {
  match: Match;
  onAnalyzeMatch?: (matchId: number) => void;
  showAnalysisButton?: boolean;
  className?: string;
}

export default function MatchCard({ 
  match, 
  onAnalyzeMatch, 
  showAnalysisButton = true,
  className = '' 
}: MatchCardProps) {
  
  const isLive = isMatchLive(match);
  const isUpcoming = isMatchUpcoming(match);
  
  // ✅ GET TEAM DATA - Following requirements A5 priority order
  const homeTeam = {
    id: match.home?.id || match.homeID,
    name: match.home?.name || match.home_name || 'Time Casa',
    logo: getLogo(match.home?.logo || match.home_image),
    score: getValidScore(match.home?.score ?? match.homeGoalCount),
  };

  const awayTeam = {
    id: match.away?.id || match.awayID,
    name: match.away?.name || match.away_name || 'Time Visitante',
    logo: getLogo(match.away?.logo || match.away_image),
    score: getValidScore(match.away?.score ?? match.awayGoalCount),
  };

  // Helper functions for data validation
  function getValidScore(score: unknown): number {
    const numScore = Number(score);
    return isNaN(numScore) ? 0 : numScore;
  }

  // ✅ LOGO VALIDATION - Following requirements A4 & A5
  function getLogo(url?: string): string | null {
    if (!url) return null;

    // If it's already a full URL, return it
    if (/^(https?:)?\/\//.test(url)) return url;

    // Handle FootyStats relative paths - prepend domain
    return `https://footystats.org/${url.replace(/^\/*/, '')}`;
  }


  
  // League name mapping for better display
  const getLeagueName = (competitionId: number, competitionName: string): string => {
    const leagueMap: { [key: number]: string } = {
      // Major European Leagues
      14124: 'Premier League',
      14125: 'La Liga',
      14126: 'Serie A',
      14127: 'Bundesliga',
      14128: 'Ligue 1',
      14131: 'Eredivisie',
      14132: 'Primeira Liga',
      14133: 'Scottish Premiership',
      14134: 'Belgian Pro League',
      14089: 'Veikkausliiga', // Finnish league
      14119: 'Ykkönen', // Finnish second division
      14360: 'A Lyga', // Lithuanian league
      12937: 'Linafoot', // Congo DR league

      // International Competitions
      14100: 'UEFA Champions League',
      14101: 'UEFA Europa League',
      14102: 'UEFA Conference League',

      // Other leagues
      5874: 'eSports League', // eSports matches
    };

    return leagueMap[competitionId] || competitionName || 'Liga';
  };

  // Get league information with proper name mapping
  const league = {
    id: match.league?.id || match.competition_id,
    name: getLeagueName(match.competition_id || 0, match.league?.name || match.competition_name || ''),
  };
  
  // Status styling
  const getStatusStyle = () => {
    if (isLive) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (isUpcoming) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // ✅ LIVE SCORE LOGIC - Following requirements A1 & A2
  const getScoreDisplay = () => {
    if (isLive) {
      // Priority order for live scores as per requirements
      let homeScore = 0;
      let awayScore = 0;

      // Check for live override first
      const matchWithLiveScore = match as { liveScore?: { home?: number; away?: number } };
      if (matchWithLiveScore.liveScore?.home !== undefined && matchWithLiveScore.liveScore?.away !== undefined) {
        homeScore = getValidScore(matchWithLiveScore.liveScore.home);
        awayScore = getValidScore(matchWithLiveScore.liveScore.away);
      }
      // Fallback to homeGoalCount/awayGoalCount
      else if (match.homeGoalCount !== undefined && match.awayGoalCount !== undefined) {
        homeScore = getValidScore(match.homeGoalCount);
        awayScore = getValidScore(match.awayGoalCount);
      }
      // Additional fallback sources
      else {
        const matchWithScores = match as { score_home?: number; score_away?: number };
        homeScore = getValidScore(matchWithScores.score_home ?? homeTeam.score);
        awayScore = getValidScore(matchWithScores.score_away ?? awayTeam.score);
      }

      return `${homeScore} x ${awayScore}`;
    }

    // For finished matches, show final score
    if (match.status === 'finished') {
      const homeScore = getValidScore(match.homeGoalCount ?? homeTeam.score);
      const awayScore = getValidScore(match.awayGoalCount ?? awayTeam.score);
      return `${homeScore} x ${awayScore}`;
    }

    // For upcoming matches, show 'vs'
    return 'vs';
  };
  
  const handleAnalyzeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAnalyzeMatch) {
      onAnalyzeMatch(match.id);
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 ${className} ${isLive ? 'ring-2 ring-red-200' : ''}`}>
      {/* Header with League and Status */}
      <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
        <div className="text-sm text-gray-600 truncate flex items-center">
          {isLive && (
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
          )}
          {league.name}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle()}`}>
          {getMatchStatusText(match)}
        </div>
      </div>
      
      {/* Main Match Content */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Home Team */}
          <div className="flex-1 flex items-center space-x-3">
            <div className="relative w-8 h-8 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
              {homeTeam.logo ? (
                <Image
                  src={homeTeam.logo}
                  alt={`${homeTeam.name} logo`}
                  width={32}
                  height={32}
                  className="object-contain rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-xs font-bold text-gray-500">${homeTeam.name.charAt(0).toUpperCase()}</span>`;
                    }
                  }}
                  unoptimized={true}
                />
              ) : (
                <span className="text-xs font-bold text-gray-500">
                  {homeTeam.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 truncate">
                {homeTeam.name}
              </div>
            </div>
          </div>
          
          {/* Score */}
          <div className="px-4 py-2 mx-4 flex-shrink-0">
            <div className={`text-lg font-bold text-center ${
              isLive ? 'text-red-600' : 'text-gray-700'
            }`}>
              {getScoreDisplay()}
            </div>
            {isLive && match.minute && (
              <div className="text-xs text-red-600 text-center mt-1">
                {String(match.minute)}&apos;
              </div>
            )}
          </div>
          
          {/* Away Team */}
          <div className="flex-1 flex items-center space-x-3 justify-end">
            <div className="min-w-0 flex-1 text-right">
              <div className="text-sm font-medium text-gray-900 truncate">
                {awayTeam.name}
              </div>
            </div>
            <div className="relative w-8 h-8 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
              {awayTeam.logo ? (
                <Image
                  src={awayTeam.logo}
                  alt={`${awayTeam.name} logo`}
                  width={32}
                  height={32}
                  className="object-contain rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-xs font-bold text-gray-500">${awayTeam.name.charAt(0).toUpperCase()}</span>`;
                    }
                  }}
                  unoptimized={true}
                />
              ) : (
                <span className="text-xs font-bold text-gray-500">
                  {awayTeam.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Additional Info for Upcoming Matches */}
        {isUpcoming && (
          <div className="mt-3 text-center">
            <div className="text-xs text-gray-500">
              {formatMatchTime(match)}
            </div>
          </div>
        )}
        
        {/* Analysis Button */}
        {showAnalysisButton && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={handleAnalyzeClick}
              className="w-full px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 hover:border-green-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              📊 Análise da Partida
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
