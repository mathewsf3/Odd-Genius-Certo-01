/**
 * 🎯 Match Analysis Page - Server-Rendered Match Analysis
 * 
 * Displays comprehensive match analysis with tabbed interface
 * Portuguese-BR interface with green/white theme
 * Uses Next.js App Router with server-side rendering
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MatchAnalysisClient from './MatchAnalysisClient';

interface MatchAnalysisPageProps {
  params: {
    id: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: MatchAnalysisPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const matchId = parseInt(resolvedParams.id);
  
  if (isNaN(matchId)) {
    return {
      title: 'Partida não encontrada - Football Analytics',
    };
  }

  try {
    // Fetch match data for metadata
    const response = await fetch(`http://localhost:3000/api/v1/matches/${matchId}`, {
      cache: 'no-store', // Always fetch fresh data for metadata
    });

    if (!response.ok) {
      return {
        title: 'Partida não encontrada - Football Analytics',
      };
    }

    const data = await response.json();
    const match = data.data;

    const homeTeam = match.home?.name || match.home_name || 'Time Casa';
    const awayTeam = match.away?.name || match.away_name || 'Time Visitante';

    return {
      title: `${homeTeam} vs ${awayTeam} - Análise da Partida | Football Analytics`,
      description: `Análise completa da partida entre ${homeTeam} e ${awayTeam}. Estatísticas, histórico de confrontos, previsões e muito mais.`,
      keywords: ['futebol', 'análise', 'estatísticas', 'partida', homeTeam, awayTeam],
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Análise da Partida - Football Analytics',
    };
  }
}

// Server-side data fetching
async function getMatchData(matchId: number) {
  try {
    console.log(`🎯 SSR - Fetching match data for ID: ${matchId}`);
    
    // Fetch match details
    const matchResponse = await fetch(`http://localhost:3000/api/v1/matches/${matchId}`, {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!matchResponse.ok) {
      console.error(`❌ SSR - Match fetch failed: ${matchResponse.status}`);
      return null;
    }

    const matchData = await matchResponse.json();
    console.log(`✅ SSR - Match data fetched successfully`);

    // Fetch match analysis
    const analysisResponse = await fetch(`http://localhost:3000/api/v1/matches/${matchId}/analysis`, {
      cache: 'no-store',
    });

    let analysisData = null;
    if (analysisResponse.ok) {
      analysisData = await analysisResponse.json();
      console.log(`✅ SSR - Analysis data fetched successfully`);
    } else {
      console.warn(`⚠️ SSR - Analysis fetch failed: ${analysisResponse.status}`);
    }

    return {
      match: matchData.data,
      analysis: analysisData?.data || null,
    };
  } catch (error) {
    console.error('❌ SSR - Error fetching match data:', error);
    return null;
  }
}

export default async function MatchAnalysisPage({ params }: MatchAnalysisPageProps) {
  const resolvedParams = await params;
  const matchId = parseInt(resolvedParams.id);
  
  // Validate match ID
  if (isNaN(matchId) || matchId <= 0) {
    console.error(`❌ SSR - Invalid match ID: ${params.id}`);
    notFound();
  }

  // Fetch server-side data
  const data = await getMatchData(matchId);
  
  if (!data || !data.match) {
    console.error(`❌ SSR - Match not found: ${matchId}`);
    notFound();
  }

  console.log(`🎯 SSR - Rendering match analysis page for: ${matchId}`);

  return (
    <MatchAnalysisClient 
      initialMatch={data.match}
      initialAnalysis={data.analysis}
      matchId={matchId}
    />
  );
}
