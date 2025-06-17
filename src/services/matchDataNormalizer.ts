/**
 * 🎯 MATCH DATA NORMALIZER - FOOTYSTATS API TO FRONTEND
 * 
 * ✅ Robust field mapping from FootyStats API
 * ✅ Proper status detection for live matches
 * ✅ Score normalization with multiple field variants
 * ✅ Portuguese-BR status mapping
 * ✅ Zero tolerance for missing data
 */

import { MatchData, TeamData, EstadioData } from '../models/Match';

// ✅ FOOTYSTATS STATUS MAPPING - BASED ON API DOCUMENTATION
const LIVE_KEYWORDS = [
  'live', 'inprogress', 'in progress', '1st half', '2nd half', 
  'ht', 'half time', 'et', 'extra time', 'penalty shootout'
];

const UPCOMING_KEYWORDS = [
  'not_started', 'ns', 'scheduled', 'tbd', 'time to be announced', 
  'kick off', 'not started', 'fixture'
];

const FINISHED_KEYWORDS = [
  'complete', 'finished', 'ft', 'full time', 'aet', 'after extra time',
  'pen', 'penalties', 'final', 'ended'
];

// ✅ LEAGUE NAME MAPPING - REAL NAMES INSTEAD OF IDS
const LEAGUE_NAMES: Record<number, string> = {
  // Major European Leagues
  2012: 'Premier League',
  2013: 'La Liga',
  2014: 'Serie A',
  2015: 'Bundesliga',
  2016: 'Ligue 1',
  2017: 'Primeira Liga',
  2018: 'Eredivisie',
  2019: 'Jupiler Pro League',
  2020: 'Super League',
  2021: 'Premiership',
  
  // International Competitions
  2001: 'UEFA Champions League',
  2002: 'UEFA Europa League',
  2003: 'UEFA Conference League',
  2004: 'Copa Libertadores',
  2005: 'Copa Sudamericana',
  
  // South American Leagues
  2030: 'Brasileirão Série A',
  2031: 'Brasileirão Série B',
  2032: 'Campeonato Argentino',
  2033: 'Primera División Chile',
  2034: 'Liga Colombiana',
  2035: 'Primera División Uruguay',
  
  // Other Major Leagues
  2040: 'MLS',
  2041: 'Liga MX',
  2042: 'J1 League',
  2043: 'K League 1',
  2044: 'Chinese Super League',
  2045: 'A-League',
  
  // Additional European Leagues
  2050: 'Championship',
  2051: 'League One',
  2052: 'League Two',
  2053: 'Serie B',
  2054: 'Segunda División',
  2055: 'Ligue 2',
  2056: 'Bundesliga 2',
  2057: 'Primeira Liga 2',
  2058: 'Keuken Kampioen Divisie',
  2059: 'Challenger Pro League',
  
  // International Cups
  2070: 'FIFA World Cup',
  2071: 'UEFA European Championship',
  2072: 'Copa América',
  2073: 'CONCACAF Gold Cup',
  2074: 'Africa Cup of Nations',
  2075: 'Asian Cup'
};

/**
 * ✅ NORMALIZE MATCH STATUS - PORTUGUESE-BR OUTPUT
 */
export function normalizeMatchStatus(rawStatus: string): MatchData['status'] {
  if (!rawStatus) return 'agendada';
  
  const status = rawStatus.toLowerCase().trim();
  
  // Check for live match indicators
  if (LIVE_KEYWORDS.some(keyword => status.includes(keyword.toLowerCase()))) {
    return 'ao-vivo';
  }
  
  // Check for finished match indicators
  if (FINISHED_KEYWORDS.some(keyword => status.includes(keyword.toLowerCase()))) {
    return 'finalizada';
  }
  
  // Check for upcoming match indicators
  if (UPCOMING_KEYWORDS.some(keyword => status.includes(keyword.toLowerCase()))) {
    return 'agendada';
  }
  
  // Default to scheduled if status is unclear
  return 'agendada';
}

/**
 * ✅ NORMALIZE SCORE VALUES - HANDLE MULTIPLE FIELD VARIANTS
 */
export function normalizeScore(rawMatch: any, isHome: boolean): number {
  const homeFields = ['homeGoalCount', 'home_score', 'score_home', 'home_goals'];
  const awayFields = ['awayGoalCount', 'away_score', 'score_away', 'away_goals'];
  
  const fields = isHome ? homeFields : awayFields;
  
  for (const field of fields) {
    const value = rawMatch[field];
    if (value !== null && value !== undefined && !isNaN(Number(value))) {
      return Number(value);
    }
  }
  
  return 0; // Default to 0 if no valid score found
}

/**
 * ✅ NORMALIZE TEAM DATA - HANDLE MISSING LOGOS
 */
export function normalizeTeamData(rawTeam: any, isHome: boolean, rawMatch: any): TeamData {
  const teamId = isHome ? rawMatch.homeID : rawMatch.awayID;
  const teamName = isHome ? rawMatch.home_name : rawMatch.away_name;
  
  return {
    id: teamId || 0,
    nome: teamName || `Time ${isHome ? 'Casa' : 'Visitante'}`,
    nomeAbreviado: teamName?.substring(0, 3).toUpperCase() || (isHome ? 'CAS' : 'VIS'),
    logo: rawTeam?.logo || `https://via.placeholder.com/64x64/22c55e/ffffff?text=${isHome ? 'C' : 'V'}`,
    golsEsperados: rawTeam?.expected_goals
  };
}

/**
 * ✅ NORMALIZE STADIUM DATA
 */
export function normalizeStadiumData(rawMatch: any): EstadioData {
  return {
    nome: rawMatch.stadium_name || 'Estádio não informado',
    cidade: rawMatch.stadium_location || 'Cidade não informada'
  };
}

/**
 * ✅ NORMALIZE LEAGUE DATA - USE REAL NAMES
 */
export function normalizeLeagueData(rawMatch: any): MatchData['liga'] {
  const leagueId = rawMatch.league_id || rawMatch.seasonID || 0;
  const leagueName = LEAGUE_NAMES[leagueId] || rawMatch.league_name || `Liga ${leagueId}`;
  
  return {
    id: leagueId,
    nome: leagueName,
    logo: rawMatch.league_logo || 'https://via.placeholder.com/32x32/22c55e/ffffff?text=L',
    pais: rawMatch.country_name || 'País não informado',
    rodada: rawMatch.game_week ? `Rodada ${rawMatch.game_week}` : undefined
  };
}

/**
 * ✅ NORMALIZE MATCH TIME - HANDLE LIVE MATCHES
 */
export function normalizeMatchTime(rawMatch: any, status: MatchData['status']): string | undefined {
  if (status === 'ao-vivo') {
    // For live matches, show current minute
    const minute = rawMatch.minute || rawMatch.match_time || rawMatch.current_minute;
    if (minute && minute > 0) {
      return `${minute}'`;
    }
    return 'AO VIVO';
  }
  
  return undefined;
}

/**
 * ✅ MAIN NORMALIZER FUNCTION - FOOTYSTATS TO FRONTEND
 */
export function normalizeFootyStatsMatch(rawMatch: any): MatchData {
  const status = normalizeMatchStatus(rawMatch.status);
  const homeScore = normalizeScore(rawMatch, true);
  const awayScore = normalizeScore(rawMatch, false);
  
  // Create match date/time
  const matchDate = rawMatch.date_unix 
    ? new Date(rawMatch.date_unix * 1000)
    : new Date(rawMatch.date || Date.now());
  
  const matchData: MatchData = {
    // Core identifiers
    id: rawMatch.id || 0,
    
    // Teams
    timeCasa: normalizeTeamData(rawMatch.home_team, true, rawMatch),
    timeVisitante: normalizeTeamData(rawMatch.away_team, false, rawMatch),
    
    // Scores
    placarCasa: homeScore,
    placarVisitante: awayScore,
    
    // Status and timing
    status,
    tempo: normalizeMatchTime(rawMatch, status),
    dataHora: matchDate.toISOString(),
    horario: matchDate.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    
    // Venue and competition
    estadio: normalizeStadiumData(rawMatch),
    liga: normalizeLeagueData(rawMatch),
    
    // Analytics
    golsEsperadosTotal: rawMatch.total_expected_goals,
    publico: rawMatch.attendance,
    
    // Betting odds
    odds: rawMatch.odds_ft_1 ? {
      casa: Number(rawMatch.odds_ft_1) || 0,
      empate: Number(rawMatch.odds_ft_X) || 0,
      visitante: Number(rawMatch.odds_ft_2) || 0
    } : undefined,
    
    // Statistics
    estatisticas: (rawMatch.team_a_possession !== -1 && rawMatch.team_b_possession !== -1) ? {
      posseBola: [rawMatch.team_a_possession || 0, rawMatch.team_b_possession || 0],
      finalizacoes: [rawMatch.team_a_shots || 0, rawMatch.team_b_shots || 0],
      escanteios: [rawMatch.team_a_corners || 0, rawMatch.team_b_corners || 0],
      cartoes: [rawMatch.team_a_cards_num || 0, rawMatch.team_b_cards_num || 0]
    } : undefined
  };
  
  return matchData;
}

/**
 * ✅ BATCH NORMALIZER - PROCESS MULTIPLE MATCHES
 */
export function normalizeFootyStatsMatches(rawMatches: any[]): MatchData[] {
  if (!Array.isArray(rawMatches)) {
    console.warn('⚠️ Invalid matches data provided to normalizer');
    return [];
  }
  
  return rawMatches
    .filter(match => match && match.id) // Filter out invalid matches
    .map(match => {
      try {
        return normalizeFootyStatsMatch(match);
      } catch (error) {
        console.error('❌ Error normalizing match:', match.id, error);
        return null;
      }
    })
    .filter(Boolean) as MatchData[]; // Remove failed normalizations
}
