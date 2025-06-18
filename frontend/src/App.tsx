/**
 * 🎯 MAIN APP - COMPLETE FOOTBALL DASHBOARD
 *
 * ✅ ZERO demo/mock/fallback data
 * ✅ Complete dashboard with sidebar
 * ✅ Enhanced match cards
 * ✅ Portuguese-BR interface
 * ✅ Real API integration only
 * ✅ Match details page with routing
 */

import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import LiveCenter from './components/LiveCenter';
import MagicUITestPage from './pages/MagicUITestPage';
import MatchDetailsPage from './pages/MatchDetails';

type PageType = 'dashboard' | 'live' | 'magicui-test' | 'match-details';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  // ✅ URL-BASED ROUTING - Parse URL on load and changes
  useEffect(() => {
    const parseCurrentRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      console.log(`🎯 App.tsx - Parsing route: path=${path}, hash=${hash}`);

      // Check for match details route: /partida/123/analise or #/partida/123/analise
      const matchDetailsRegex = /\/partida\/(\d+)\/analise/;
      const matchInPath = path.match(matchDetailsRegex);
      const matchInHash = hash.match(matchDetailsRegex);

      if (matchInPath || matchInHash) {
        const matchId = parseInt(matchInPath?.[1] || matchInHash?.[1] || '0');
        console.log(`🎯 App.tsx - Found match details route with ID: ${matchId}`);
        setSelectedMatchId(matchId);
        setCurrentPage('match-details');
        return;
      }

      // Check for other routes
      if (path.includes('/live') || hash.includes('/live')) {
        setCurrentPage('live');
        return;
      }

      if (path.includes('/magicui-test') || hash.includes('/magicui-test')) {
        setCurrentPage('magicui-test');
        return;
      }

      // Default to dashboard
      setCurrentPage('dashboard');
      setSelectedMatchId(null);
    };

    // Parse route on initial load
    parseCurrentRoute();

    // Listen for URL changes (back/forward buttons)
    const handlePopState = () => {
      console.log('🎯 App.tsx - URL changed via back/forward button');
      parseCurrentRoute();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Monitor state changes
  console.log(`🎯 App.tsx - Render: currentPage=${currentPage}, selectedMatchId=${selectedMatchId}`);

  const handleMatchAnalysis = (matchId: number) => {
    console.log(`🎯 App.tsx - handleMatchAnalysis chamado com matchId: ${matchId}`);
    console.log(`🎯 App.tsx - Estado atual antes da mudança: currentPage=${currentPage}, selectedMatchId=${selectedMatchId}`);

    // ✅ REAL URL NAVIGATION - Change URL and update state
    const newUrl = `/partida/${matchId}/analise`;
    console.log(`🎯 App.tsx - Navegando para URL: ${newUrl}`);

    // Update URL without page reload
    window.history.pushState({ matchId, page: 'match-details' }, '', newUrl);

    // Update state
    setSelectedMatchId(matchId);
    setCurrentPage('match-details');

    console.log(`🎯 App.tsx - URL e estado atualizados: ${newUrl}, matchId=${matchId}`);
  };

  const handleBackToDashboard = () => {
    console.log('🎯 App.tsx - handleBackToDashboard chamado');

    // ✅ REAL URL NAVIGATION - Go back to dashboard
    window.history.pushState({ page: 'dashboard' }, '', '/');

    setSelectedMatchId(null);
    setCurrentPage('dashboard');

    console.log('🎯 App.tsx - Voltou para dashboard, URL: /');
  };

  const renderCurrentPage = () => {
    console.log(`🎯 App.tsx - renderCurrentPage chamado: currentPage=${currentPage}, selectedMatchId=${selectedMatchId}`);

    switch (currentPage) {
      case 'live':
        console.log(`🎯 App.tsx - Renderizando LiveCenter`);
        return <LiveCenter onAnalyzeMatch={handleMatchAnalysis} />;
      case 'magicui-test':
        console.log(`🎯 App.tsx - Renderizando MagicUITestPage`);
        return <MagicUITestPage />;
      case 'match-details':
        console.log(`🎯 App.tsx - Renderizando MatchDetailsPage com matchId: ${selectedMatchId}`);
        return selectedMatchId ? (
          <MatchDetailsPage
            matchId={selectedMatchId}
            onBack={handleBackToDashboard}
          />
        ) : (
          <Dashboard onAnalyzeMatch={handleMatchAnalysis} />
        );
      default:
        console.log(`🎯 App.tsx - Renderizando Dashboard (default)`);
        return <Dashboard onAnalyzeMatch={handleMatchAnalysis} />;
    }
  };

  // Don't render Layout for match details page
  console.log(`🎯 App.tsx - Verificando se deve renderizar sem Layout: currentPage=${currentPage}`);
  if (currentPage === 'match-details') {
    console.log(`🎯 App.tsx - Renderizando MatchDetailsPage sem Layout`);
    return renderCurrentPage();
  }

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      setSidebarCollapsed={setSidebarCollapsed}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    >
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;
