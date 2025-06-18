/**
 * 🎯 MATCH DETAILS PAGE - COMPREHENSIVE MATCH ANALYSIS
 * 
 * ✅ Multiple tabs: Overview, H2H, Statistics, Corners, Referee
 * ✅ Real-time data from FootyStats API
 * ✅ Portuguese-BR interface
 * ✅ No mock data or fallbacks
 */

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin, Trophy, Users } from 'lucide-react';
import React, { useState } from 'react';
import CornersTab from './components/Tabs/CornersTab';
import H2HTab from './components/Tabs/H2HTab';
import OverviewTab from './components/Tabs/OverviewTab';
import RefereeTab from './components/Tabs/RefereeTab';
import StatsTab from './components/Tabs/StatsTab';
import { useMatch } from './hooks/useMatch';
import { useTeamMatches } from './hooks/useTeamMatches';

interface MatchDetailsPageProps {
  matchId: number;
  onBack?: () => void;
}

const MatchDetailsPage: React.FC<MatchDetailsPageProps> = ({ matchId, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'h2h' | 'stats' | 'corners' | 'referee'>('overview');

  const { data: match, loading: matchLoading, error: matchError } = useMatch(matchId);
  const { data: homeMatches } = useTeamMatches(match?.homeID || 0, 10);
  const { data: awayMatches } = useTeamMatches(match?.awayID || 0, 10);

  // 🔍 DEBUG: Log component state
  console.log('🎯 MatchDetailsPage State:', {
    matchId,
    match,
    matchLoading,
    matchError,
    homeMatches,
    awayMatches
  });

  if (matchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes da partida...</p>
          <p className="text-sm text-gray-500 mt-2">Match ID: {matchId}</p>
          <p className="text-sm text-gray-500">Loading: {String(matchLoading)}</p>
          <p className="text-sm text-gray-500">Error: {matchError || 'None'}</p>
        </div>
      </div>
    );
  }

  if (matchError || !match) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar detalhes da partida</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Trophy },
    { id: 'h2h', label: 'H2H', icon: Users },
    { id: 'stats', label: 'Estatísticas', icon: Calendar },
    { id: 'corners', label: 'Escanteios', icon: MapPin },
    { id: 'referee', label: 'Árbitro', icon: Clock }
  ];

  const renderTabContent = () => {
    // Extract H2H data from match details (embedded in API response)
    const h2hMatches = (match as any)?.h2hMatches || [];

    switch (activeTab) {
      case 'overview':
        return <OverviewTab match={match} />;
      case 'h2h':
        return <H2HTab homeId={match.homeID} awayId={match.awayID} h2hMatches={h2hMatches} />;
      case 'stats':
        return <StatsTab matchId={match.id} homeMatches={homeMatches} awayMatches={awayMatches} />;
      case 'corners':
        return <CornersTab homeId={match.homeID} awayId={match.awayID} />;
      case 'referee':
        return <RefereeTab matchId={match.id} />;
      default:
        return <OverviewTab match={match} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {match.home_name} vs {match.away_name}
              </h1>
              <p className="text-gray-600">
                {match.competition_name} • {formatDate(match.date_unix)}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">{formatTime(match.date_unix)}</p>
              <p className="text-sm font-medium text-green-600">{match.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Match Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Home Team */}
            <div className="flex items-center space-x-4">
              <img
                src={match.home_image}
                alt={match.home_name}
                className="w-16 h-16 rounded-full"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = '/default-team.svg';
                }}
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{match.home_name}</h2>
                <p className="text-gray-600">Casa</p>
              </div>
            </div>

            {/* Score */}
            <div className="text-center">
              {match.status === 'live' || match.status === 'finished' ? (
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-green-600">{match.homeGoalCount}</span>
                  <span className="text-2xl font-bold text-gray-400">×</span>
                  <span className="text-4xl font-bold text-green-600">{match.awayGoalCount}</span>
                </div>
              ) : (
                <div className="text-center">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-green-600">{formatTime(match.date_unix)}</p>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <h2 className="text-xl font-bold text-gray-900">{match.away_name}</h2>
                <p className="text-gray-600">Visitante</p>
              </div>
              <img
                src={match.away_image}
                alt={match.away_name}
                className="w-16 h-16 rounded-full"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = '/default-team.svg';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default MatchDetailsPage;
