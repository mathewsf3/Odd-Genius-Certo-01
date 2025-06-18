/**
 * 🎯 DATA NORMALIZATION SERVICE
 * 
 * ✅ Normalizes FootyStats API responses
 * ✅ Handles multiple score field variants
 * ✅ Proper status mapping for live/upcoming/finished
 * ✅ Logo URL construction with fallbacks
 */

import type { MatchData } from '../../components/MatchCard';
import type { LivescoreMatch } from './fetchLivescores';

// ✅ STATUS CONSTANTS - FOOTYSTATS API STATUSES
const LIVE_KEYWORDS = [
  'live', 'inplay', '1st half', '2nd half', 'ht', 'et', 'penalties', 'incomplete'
];

const UPCOMING_KEYWORDS = [
  'not_started', 'ns', 'scheduled', 'kick off', 'tbd', 'upcoming'
];

const FINISHED_KEYWORDS = [
  'finished', 'complete', 'ft', 'full-time'
];

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

// ✅ NORMALIZE STATUS FROM FOOTYSTATS API
const normalizeStatus = (rawStatus: string): 'live' | 'upcoming' | 'finished' => {
  const status = rawStatus.toLowerCase().trim();
  
  if (LIVE_KEYWORDS.some(keyword => status.includes(keyword))) {
    return 'live';
  }
  
  if (UPCOMING_KEYWORDS.some(keyword => status.includes(keyword))) {
    return 'upcoming';
  }
  
  if (FINISHED_KEYWORDS.some(keyword => status.includes(keyword))) {
    return 'finished';
  }
  
  // Default to upcoming for unknown statuses
  return 'upcoming';
};

// ✅ NORMALIZE SCORE FIELDS - HANDLE ALL VARIANTS
const normalizeScore = (match: LivescoreMatch): { home: number; away: number } => {
  // Try different score field variants from FootyStats API
  const homeScore = match.homeGoalCount ?? match.score_home ?? match.home_score ?? 0;
  const awayScore = match.awayGoalCount ?? match.score_away ?? match.away_score ?? 0;
  
  return {
    home: Number(homeScore),
    away: Number(awayScore)
  };
};

// ✅ MAIN NORMALIZATION FUNCTION
export function normalise(rawMatch: LivescoreMatch): MatchData {
  const normalizedStatus = normalizeStatus(rawMatch.status);
  const scores = normalizeScore(rawMatch);
  
  return {
    id: rawMatch.id,
    homeID: rawMatch.homeID,
    awayID: rawMatch.awayID,
    home_name: rawMatch.home_name,
    away_name: rawMatch.away_name,
    home_image: buildLogoUrl(rawMatch.home_image, rawMatch.homeID),
    away_image: buildLogoUrl(rawMatch.away_image, rawMatch.awayID),
    homeGoalCount: scores.home,
    awayGoalCount: scores.away,
    status: normalizedStatus,
    date_unix: rawMatch.date_unix,
    stadium_name: rawMatch.stadium_name,
    stadium_location: rawMatch.stadium_location,
    competition_id: rawMatch.competition_id,
    competition_name: rawMatch.competition_name,
    country_name: rawMatch.country_name
  };
}

// ✅ BATCH NORMALIZATION FOR ARRAYS
export function normaliseMatches(rawMatches: LivescoreMatch[]): MatchData[] {
  if (!Array.isArray(rawMatches)) {
    console.warn('normaliseMatches: Input is not an array', rawMatches);
    return [];
  }
  
  return rawMatches.map(normalise);
}

// ✅ FILTER FUNCTIONS FOR DIFFERENT MATCH TYPES
export function filterLiveMatches(matches: MatchData[]): MatchData[] {
  return matches.filter(match => match.status === 'live');
}

export function filterUpcomingMatches(matches: MatchData[]): MatchData[] {
  return matches.filter(match => match.status === 'upcoming');
}

export function filterFinishedMatches(matches: MatchData[]): MatchData[] {
  return matches.filter(match => match.status === 'finished');
}

// ✅ UTILITY FUNCTION TO GET MATCH COUNTS BY STATUS
export function getMatchCounts(matches: MatchData[]): {
  live: number;
  upcoming: number;
  finished: number;
  total: number;
} {
  const live = filterLiveMatches(matches);
  const upcoming = filterUpcomingMatches(matches);
  const finished = filterFinishedMatches(matches);
  
  return {
    live: live.length,
    upcoming: upcoming.length,
    finished: finished.length,
    total: matches.length
  };
}
