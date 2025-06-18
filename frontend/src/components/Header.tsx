/**
 * 🎯 Header Component - Application Header
 * 
 * Provides top navigation and controls
 * Portuguese-BR interface with green/white theme
 * Responsive design with mobile menu toggle
 */

'use client';

import React from 'react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export default function Header({
  onToggleMobileMenu,
  onToggleSidebar,
  sidebarCollapsed,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu toggle and sidebar toggle */}
        <div className="flex items-center space-x-3">
          {/* Mobile menu toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden"
            aria-label="Abrir menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop sidebar toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg hidden lg:block"
            aria-label={sidebarCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page title - shown on mobile */}
          <h1 className="text-lg font-semibold text-gray-900 lg:hidden">
            Football Analytics
          </h1>
        </div>

        {/* Right side - User actions and status */}
        <div className="flex items-center space-x-3">
          {/* Live indicator */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-red-700">AO VIVO</span>
          </div>

          {/* Refresh button */}
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            aria-label="Atualizar página"
            title="Atualizar dados"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Settings button */}
          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            aria-label="Configurações"
            title="Configurações"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* User profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-900">Usuário</div>
              <div className="text-xs text-gray-500">Analista</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
