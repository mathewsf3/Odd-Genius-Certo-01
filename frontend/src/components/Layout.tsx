/**
 * 🎯 LAYOUT COMPONENT - MAIN APP STRUCTURE
 * 
 * ✅ Sidebar navigation
 * ✅ Main content area
 * ✅ Responsive design
 * ✅ Portuguese-BR interface
 * ✅ Green/white theme
 */

import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  currentPage: 'dashboard' | 'live' | 'magicui-test';
  setCurrentPage: (page: 'dashboard' | 'live' | 'magicui-test') => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  sidebarCollapsed,
  setSidebarCollapsed,
  currentPage,
  setCurrentPage
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
