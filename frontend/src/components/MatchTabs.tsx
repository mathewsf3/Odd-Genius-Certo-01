/**
 * 🎯 MatchTabs Component - Tabbed Navigation for Match Analysis
 * 
 * Provides tabbed interface for different analysis views
 * Portuguese-BR interface with green/white theme
 * Responsive design with mobile support
 */

'use client';

import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface MatchTabsProps {
  tabs: readonly Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function MatchTabs({ tabs, activeTab, onTabChange, className = '' }: MatchTabsProps) {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}
