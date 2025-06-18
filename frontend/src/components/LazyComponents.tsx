/**
 * 🎯 Lazy Components - Code Splitting for Performance
 * 
 * Implements lazy loading for heavy components
 * Reduces initial bundle size and improves performance
 */

'use client';

import React, { Suspense, lazy } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Lazy load heavy components
export const LazyDashboard = lazy(() => import('./Dashboard'));
export const LazyMatchAnalysisClient = lazy(() => import('../app/match/[id]/analysis/MatchAnalysisClient'));
export const LazyOverviewTab = lazy(() => import('./tabs/OverviewTab'));
export const LazyH2HTab = lazy(() => import('./tabs/H2HTab'));
export const LazyStatisticsTab = lazy(() => import('./tabs/StatisticsTab'));
export const LazyCornersTab = lazy(() => import('./tabs/CornersTab'));
export const LazyRefereeTab = lazy(() => import('./tabs/RefereeTab'));

// Wrapper component with loading fallback
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export function LazyWrapper({ children, fallback, className }: LazyWrapperProps) {
  const defaultFallback = (
    <div className={`flex items-center justify-center p-8 ${className || ''}`}>
      <LoadingSpinner message="Carregando componente..." />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}

// Pre-configured lazy components with proper fallbacks
export function LazyDashboardWithFallback(props: any) {
  return (
    <LazyWrapper fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Carregando dashboard..." />
        </div>
      </div>
    }>
      <LazyDashboard {...props} />
    </LazyWrapper>
  );
}

export function LazyMatchAnalysisWithFallback(props: any) {
  return (
    <LazyWrapper fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Carregando análise da partida..." />
        </div>
      </div>
    }>
      <LazyMatchAnalysisClient {...props} />
    </LazyWrapper>
  );
}

// Tab components with fallbacks
export function LazyTabWrapper({ 
  children, 
  tabName 
}: { 
  children: React.ReactNode; 
  tabName: string; 
}) {
  return (
    <LazyWrapper fallback={
      <div className="p-6">
        <LoadingSpinner message={`Carregando ${tabName}...`} />
      </div>
    }>
      {children}
    </LazyWrapper>
  );
}

// Higher-order component for lazy loading with error boundary
interface LazyComponentProps {
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  props?: any;
}

export function LazyComponent({ 
  component: Component, 
  fallback, 
  errorFallback, 
  props = {} 
}: LazyComponentProps) {
  const defaultErrorFallback = (
    <div className="p-6 text-center">
      <div className="text-red-600 mb-2">❌</div>
      <div className="text-sm text-gray-600">
        Erro ao carregar componente. Tente recarregar a página.
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={errorFallback || defaultErrorFallback}>
      <LazyWrapper fallback={fallback}>
        <Component {...props} />
      </LazyWrapper>
    </ErrorBoundary>
  );
}

// Error boundary for lazy components
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Preload utilities for better UX
export const preloadComponents = {
  dashboard: () => import('./Dashboard'),
  matchAnalysis: () => import('../app/match/[id]/analysis/MatchAnalysisClient'),
  overviewTab: () => import('./tabs/OverviewTab'),
  h2hTab: () => import('./tabs/H2HTab'),
  statisticsTab: () => import('./tabs/StatisticsTab'),
  cornersTab: () => import('./tabs/CornersTab'),
  refereeTab: () => import('./tabs/RefereeTab'),
};

// Preload on hover for better perceived performance
export function usePreloadOnHover() {
  const preloadDashboard = () => preloadComponents.dashboard();
  const preloadMatchAnalysis = () => preloadComponents.matchAnalysis();
  
  return {
    preloadDashboard,
    preloadMatchAnalysis,
    preloadAllTabs: () => {
      preloadComponents.overviewTab();
      preloadComponents.h2hTab();
      preloadComponents.statisticsTab();
      preloadComponents.cornersTab();
      preloadComponents.refereeTab();
    },
  };
}

// Component size tracking for optimization
export function trackComponentSize(componentName: string) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes(componentName)) {
          console.log(`📦 Component ${componentName} loaded:`, {
            size: entry.transferSize,
            duration: entry.duration,
          });
        }
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
    
    return () => observer.disconnect();
  }
  
  return () => {};
}

// Export all lazy components for easy importing
export {
  LazyDashboard,
  LazyMatchAnalysisClient,
  LazyOverviewTab,
  LazyH2HTab,
  LazyStatisticsTab,
  LazyCornersTab,
  LazyRefereeTab,
};
