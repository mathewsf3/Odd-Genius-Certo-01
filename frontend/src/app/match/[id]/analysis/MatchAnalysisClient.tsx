/**
 * 🎯 Match Analysis Client Component
 * 
 * Client-side component for match analysis with tabbed interface
 * Portuguese-BR interface with green/white theme
 * Handles interactive features and real-time updates
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Match, MatchAnalysis } from '@/types/api';
import MatchHeader from '@/components/MatchHeader';
import MatchTabs from '@/components/MatchTabs';
import OverviewTab from '@/components/tabs/OverviewTab';
import H2HTab from '@/components/tabs/H2HTab';
import StatisticsTab from '@/components/tabs/StatisticsTab';
import CornersTab from '@/components/tabs/CornersTab';
import RefereeTab from '@/components/tabs/RefereeTab';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

interface MatchAnalysisClientProps {
  initialMatch: Match;
  initialAnalysis: MatchAnalysis | null;
  matchId: number;
}

type TabType = 'overview' | 'h2h' | 'statistics' | 'corners' | 'referee';

const tabs = [
  { id: 'overview', label: 'Visão Geral', icon: '📊' },
  { id: 'h2h', label: 'Histórico H2H', icon: '⚔️' },
  { id: 'statistics', label: 'Estatísticas', icon: '📈' },
  { id: 'corners', label: 'Escanteios', icon: '📐' },
  { id: 'referee', label: 'Árbitro', icon: '👨‍⚖️' },
] as const;

export default function MatchAnalysisClient({
  initialMatch,
  initialAnalysis,
  matchId,
}: MatchAnalysisClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [match, setMatch] = useState<Match>(initialMatch);
  const [analysis, setAnalysis] = useState<MatchAnalysis | null>(initialAnalysis);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBackToDashboard = () => {
    console.log('🎯 Navigating back to dashboard');
    router.push('/');
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Refreshing match data for ID: ${matchId}`);
      
      // Refresh match data
      const matchResponse = await fetch(`/api/v1/matches/${matchId}`);
      if (matchResponse.ok) {
        const matchData = await matchResponse.json();
        setMatch(matchData.data);
      }
      
      // Refresh analysis data
      const analysisResponse = await fetch(`/api/v1/matches/${matchId}/analysis`);
      if (analysisResponse.ok) {
        const analysisData = await analysisResponse.json();
        setAnalysis(analysisData.data);
      }
      
      console.log('✅ Data refreshed successfully');
    } catch (err) {
      console.error('❌ Error refreshing data:', err);
      setError('Erro ao atualizar dados da partida');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            match={match} 
            analysis={analysis}
            onRefresh={refreshData}
          />
        );
      case 'h2h':
        return (
          <H2HTab 
            match={match} 
            analysis={analysis}
            onRefresh={refreshData}
          />
        );
      case 'statistics':
        return (
          <StatisticsTab 
            match={match} 
            analysis={analysis}
            onRefresh={refreshData}
          />
        );
      case 'corners':
        return (
          <CornersTab 
            match={match} 
            analysis={analysis}
            onRefresh={refreshData}
          />
        );
      case 'referee':
        return (
          <RefereeTab 
            match={match} 
            analysis={analysis}
            onRefresh={refreshData}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-gray-500">
            Aba não encontrada
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Match Header */}
      <MatchHeader 
        match={match}
        onBack={handleBackToDashboard}
        onRefresh={refreshData}
        loading={loading}
      />

      {/* Error Display */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <ErrorMessage 
            message={error} 
            onRetry={refreshData}
            variant="warning"
          />
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <MatchTabs 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-6">
        {loading && !match ? (
          <LoadingSpinner message="Carregando análise da partida..." />
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
}
