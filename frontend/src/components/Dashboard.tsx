/**
 * 🎯 Dashboard Component - Main Football Analytics Dashboard
 * 
 * Displays live and upcoming matches with real-time updates
 * Portuguese-BR interface with green/white theme
 * Uses Next.js best practices for data fetching and state management
 */

'use client';

import { useDashboardOverview } from '@/hooks/useDashboard';
import { Match } from '@/types/api';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import MatchCard from './MatchCard';

interface DashboardProps {
  onAnalyzeMatch?: (matchId: number) => void;
  className?: string;
}

export default function Dashboard({ onAnalyzeMatch, className = '' }: DashboardProps) {
  const {
    data: dashboardData,
    loading,
    error,
    refresh,
    lastUpdated
  } = useDashboardOverview(6); // Show 6 matches per section

  // Helper function to safely render numbers
  const safeNumber = (value: unknown): string => {
    if (value === null || value === undefined) return '0';
    const num = Number(value);
    return isNaN(num) ? '0' : String(num);
  };

  // Helper function to deduplicate matches by ID
  const deduplicateMatches = (matches: Match[]): Match[] => {
    if (!matches || !Array.isArray(matches)) return [];

    const seen = new Set();
    return matches.filter(match => {
      if (!match || !match.id) return false;
      if (seen.has(match.id)) {
        console.warn(`🔄 Duplicate match ID detected: ${match.id}`);
        return false;
      }
      seen.add(match.id);
      return true;
    });
  };

  if (loading && !dashboardData) {
    return (
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Carregando dashboard..." />
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage 
            message={error} 
            onRetry={refresh}
            title="Erro ao carregar dashboard"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              ⚽ Dashboard de Futebol
            </h1>
            <button
              onClick={refresh}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                loading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? '🔄 Atualizando...' : '🔄 Atualizar'}
            </button>
          </div>
          
          {/* Stats Overview */}
          {dashboardData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <div className="w-6 h-6 text-red-600">🔴</div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {safeNumber(dashboardData.totalLive)}
                    </div>
                    <div className="text-sm text-gray-600">Partidas ao vivo</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <div className="w-6 h-6 text-blue-600">📅</div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {safeNumber(dashboardData.totalUpcoming)}
                    </div>
                    <div className="text-sm text-gray-600">Próximas 48h</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <div className="w-6 h-6 text-green-600">⚽</div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {safeNumber(dashboardData.totalMatches)}
                    </div>
                    <div className="text-sm text-gray-600">Partidas hoje</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {lastUpdated && (
            <div className="text-sm text-gray-500">
              Última atualização: {lastUpdated.toLocaleString('pt-BR')}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && dashboardData && (
          <div className="mb-6">
            <ErrorMessage 
              message={error} 
              onRetry={refresh}
              variant="warning"
            />
          </div>
        )}

        {/* Live Matches Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              🔴 Partidas ao Vivo
              {dashboardData && (
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                  {safeNumber(dashboardData.liveMatches?.length)}
                </span>
              )}
            </h2>
            <a 
              href="/live" 
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Ver todas →
            </a>
          </div>
          
          {dashboardData?.liveMatches?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deduplicateMatches(dashboardData.liveMatches).map((match, index) => (
                <MatchCard
                  key={`live-${match.id}-${index}-${Date.now()}`}
                  match={match}
                  onAnalyzeMatch={onAnalyzeMatch}
                  showAnalysisButton={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="text-gray-500">
                <div className="text-4xl mb-2">⚽</div>
                <div className="text-lg font-medium mb-1">Nenhuma partida ao vivo</div>
                <div className="text-sm">Aguarde o início das próximas partidas</div>
              </div>
            </div>
          )}
        </section>

        {/* Upcoming Matches Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              📅 Próximas Partidas
              {dashboardData && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {safeNumber(dashboardData.upcomingMatches?.length)}
                </span>
              )}
            </h2>
            <a 
              href="/upcoming" 
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Ver todas →
            </a>
          </div>
          
          {dashboardData?.upcomingMatches?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deduplicateMatches(dashboardData.upcomingMatches).map((match, index) => (
                <MatchCard
                  key={`upcoming-${match.id}-${index}-${Date.now()}`}
                  match={match}
                  onAnalyzeMatch={onAnalyzeMatch}
                  showAnalysisButton={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="text-gray-500">
                <div className="text-4xl mb-2">📅</div>
                <div className="text-lg font-medium mb-1">Nenhuma partida próxima</div>
                <div className="text-sm">Não há partidas programadas para as próximas 48 horas</div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
