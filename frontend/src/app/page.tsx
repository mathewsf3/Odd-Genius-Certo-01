'use client';

import Dashboard from '@/components/Dashboard';
import Layout from '@/components/Layout';
import { getDashboardData, getLiveMatches, getUpcomingMatches } from '@/services/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function FootballDashboard() {
  const router = useRouter();
  const [apiStatus, setApiStatus] = useState<string>('Not tested');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTestPanel, setShowTestPanel] = useState(false);

  const handleAnalyzeMatch = (matchId: number) => {
    console.log(`🎯 Navigating to match analysis: ${matchId}`);
    router.push(`/match/${matchId}/analysis`);
  };

  const testAPI = async () => {
    setIsLoading(true);
    setApiStatus('Testing...');

    try {
      console.log('🎯 Next.js - Testing new API integration...');

      // Test dashboard API
      const dashboardResult = await getDashboardData({ timezone: 'America/Sao_Paulo' });
      console.log('Dashboard API result:', dashboardResult);

      // Test live matches API
      const liveResult = await getLiveMatches(3);
      console.log('Live matches API result:', liveResult);

      // Test upcoming matches API
      const upcomingResult = await getUpcomingMatches(3, 48);
      console.log('Upcoming matches API result:', upcomingResult);

      setApiStatus(`✅ New API Integration Working!
        Dashboard: ${dashboardResult.totalLive} live, ${dashboardResult.totalUpcoming} upcoming
        Live API: ${liveResult.totalLive} matches
        Upcoming API: ${upcomingResult.totalUpcoming} matches`);

    } catch (error) {
      console.error('API test error:', error);
      setApiStatus(`❌ API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout currentPage="dashboard">
      <Dashboard onAnalyzeMatch={handleAnalyzeMatch} />

      {/* Developer Test Panel - Toggle with keyboard shortcut */}
      {showTestPanel && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-md z-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">API Test Panel</h3>
            <button
              onClick={() => setShowTestPanel(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded text-sm">
              <div className="font-medium text-gray-700 mb-1">Status:</div>
              <div className={`whitespace-pre-line ${isLoading ? 'text-yellow-600' : 'text-gray-600'}`}>
                {apiStatus}
              </div>
            </div>

            <button
              onClick={testAPI}
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                isLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Testing...' : 'Test All APIs'}
            </button>
          </div>
        </div>
      )}

      {/* Keyboard shortcut to toggle test panel */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setShowTestPanel(!showTestPanel)}
          className="px-3 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
          title="Toggle API Test Panel (Ctrl+T)"
        >
          🔧 Dev Tools
        </button>
      </div>
    </Layout>
  );
}
