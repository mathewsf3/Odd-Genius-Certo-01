/**
 * 🎯 LAYOUT COMPONENT - 100% REAL API DATA
 * 
 * ✅ ZERO hardcoded data
 * ✅ Sidebar + Dashboard integration
 * ✅ Real navigation with API counts
 * ✅ Portuguese-BR interface
 * ✅ Responsive design
 * ✅ File management rule applied
 */

"use client";

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import { createNavigationItems, createNavigationHandlers } from './config/navigation';
import { useLiveMatches, useUpcomingMatches } from './hooks/useMatchData';
import { cn } from '@/lib/utils';

// ✅ LAYOUT PROPS - REAL DATA ONLY
interface LayoutProps {
  children?: React.ReactNode;
  currentPath?: string;
  showSidebar?: boolean;
  className?: string;
}

// ✅ MOBILE MENU BUTTON
const MobileMenuButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed top-4 left-4 z-50 md:hidden bg-white/80 backdrop-blur-sm border border-green-200 rounded-lg p-2 shadow-lg hover:bg-green-50 transition-colors"
    aria-label="Abrir menu de navegação"
  >
    <Menu className="w-5 h-5 text-green-600" />
  </button>
);

// ✅ MOBILE SIDEBAR OVERLAY
const MobileSidebarOverlay: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-64 h-full">
        {children}
      </div>
    </div>
  );
};

// ✅ MAIN LAYOUT COMPONENT
const Layout: React.FC<LayoutProps> = ({
  children,
  currentPath = "/dashboard",
  showSidebar = true,
  className
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ REAL DATA FROM API HOOKS
  const { 
    matches: liveMatches, 
    loading: liveLoading, 
    error: liveError 
  } = useLiveMatches();
  
  const { 
    matches: upcomingMatches, 
    loading: upcomingLoading, 
    error: upcomingError 
  } = useUpcomingMatches(50); // Get more for accurate count

  // ✅ RESPONSIVE DETECTION
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ CLOSE MOBILE MENU ON ROUTE CHANGE
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  // ✅ KEYBOARD NAVIGATION
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // ✅ CREATE NAVIGATION WITH REAL DATA
  const navigationItems = createNavigationItems(
    liveMatches.length, // ✅ Real live matches count
    upcomingMatches.length, // ✅ Real upcoming matches count
    currentPath
  );

  // ✅ NAVIGATION HANDLERS
  const navigationHandlers = createNavigationHandlers({
    push: (href: string) => {
      window.location.href = href;
    }
  });

  // ✅ HANDLE MOBILE MENU
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // ✅ SIDEBAR LOADING STATE
  const sidebarLoading = liveLoading || upcomingLoading;
  const sidebarError = liveError || upcomingError;

  return (
    <div className={cn("flex h-screen bg-gray-50", className)}>
      {/* Mobile Menu Button */}
      {isMobile && showSidebar && (
        <MobileMenuButton onClick={handleMobileMenuToggle} />
      )}

      {/* Desktop Sidebar */}
      {!isMobile && showSidebar && (
        <Sidebar
          navigationItems={navigationItems} // ✅ Real data with API counts
          isLoading={sidebarLoading}
          error={sidebarError}
          currentPath={currentPath}
          onNavigate={navigationHandlers.onNavigate}
          className="hidden md:block"
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && showSidebar && (
        <MobileSidebarOverlay 
          isOpen={isMobileMenuOpen} 
          onClose={handleMobileMenuClose}
        >
          <Sidebar
            navigationItems={navigationItems} // ✅ Real data with API counts
            isLoading={sidebarLoading}
            error={sidebarError}
            currentPath={currentPath}
            onNavigate={(item) => {
              navigationHandlers.onNavigate(item);
              handleMobileMenuClose();
            }}
            className="h-full"
          />
        </MobileSidebarOverlay>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-auto",
        isMobile ? "pt-16" : "", // Add top padding for mobile menu button
        showSidebar ? "" : "w-full"
      )}>
        {children || <Dashboard />}
      </main>
    </div>
  );
};

export default Layout;
export type { LayoutProps };
