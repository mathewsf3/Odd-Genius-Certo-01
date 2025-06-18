/**
 * 🎯 UPCOMING MATCHES PAGE - ALL TODAY'S UPCOMING MATCHES
 * 
 * ✅ Displays all upcoming matches for today
 * ✅ Uses MatchCard components
 * ✅ Real API data integration
 * ✅ Portuguese-BR interface
 * ✅ No mock data or fallbacks
 */

import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import MatchCard from '../components/MatchCard';
import type { MatchData } from '../components/MatchCard';

interface UpcomingMatchesProps {
  onAnalyzeMatch: (matchId: number) => void;
}

const UpcomingMatches: React.FC<UpcomingMatchesProps> = ({ onAnalyzeMatch }) => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingMatches = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 UpcomingMatches - Fetching upcoming matches...');

        const response = await fetch('/api/v1/matches/upcoming?timezone=America/Sao_Paulo');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('📊 UpcomingMatches - API Response:', data);

        if (data.success && data.data) {
          setMatches(data.data);
          console.log(`✅ UpcomingMatches - Loaded ${data.data.length} upcoming matches`);
        } else {
          throw new Error(data.message || 'Failed to fetch upcoming matches');
        }
      } catch (err) {
        console.error('❌ UpcomingMatches - Error fetching matches:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar partidas');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMatches();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Próximas Partidas</h1>
            <p className="text-gray-600">Todas as partidas de hoje</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Próximas Partidas</h1>
            <p className="text-gray-600">Todas as partidas de hoje</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-red-900">Erro ao Carregar Partidas</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Próximas Partidas</h1>
          <p className="text-gray-600">Todas as partidas de hoje • {matches.length} partidas encontradas</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{matches.length}</p>
                <p className="text-sm text-gray-600">Total de Partidas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {matches.filter(m => m.status === 'upcoming').length}
                </p>
                <p className="text-sm text-gray-600">Em Breve</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <MapPin className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(matches.map(m => m.competition_name)).size}
                </p>
                <p className="text-sm text-gray-600">Competições</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set([...matches.map(m => m.home_name), ...matches.map(m => m.away_name)]).size}
                </p>
                <p className="text-sm text-gray-600">Times</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Matches Grid */}
        {matches.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <MatchCard
                  match={match}
                  onAnalyzeMatch={onAnalyzeMatch}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 p-12 text-center"
          >
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhuma Partida Encontrada</h3>
            <p className="text-gray-600">Não há partidas programadas para hoje.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UpcomingMatches;
