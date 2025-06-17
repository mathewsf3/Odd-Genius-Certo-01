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

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'live'>('dashboard');

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      setSidebarCollapsed={setSidebarCollapsed}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    >
      {currentPage === 'dashboard' ? <Dashboard /> : <LiveCenter />}
    </Layout>
  );
}

export default App;
