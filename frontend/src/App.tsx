/**
 * 🎯 MAIN APP - COMPLETE FOOTBALL DASHBOARD
 *
 * ✅ ZERO demo/mock/fallback data
 * ✅ Complete dashboard with sidebar
 * ✅ Enhanced match cards
 * ✅ Portuguese-BR interface
 * ✅ Real API integration only
 */

import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import LiveCenter from './components/LiveCenter';
import MagicUITestPage from './pages/MagicUITestPage';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'live' | 'magicui-test'>('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'live':
        return <LiveCenter />;
      case 'magicui-test':
        return <MagicUITestPage />;
      default:
        return <Dashboard />;
    }
  };

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
