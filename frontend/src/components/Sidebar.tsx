/**
 * 🎯 Sidebar Component - Navigation Sidebar
 * 
 * Provides navigation for the football analytics dashboard
 * Portuguese-BR interface with green/white theme
 * Responsive design with mobile support
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  collapsed: boolean;
  mobileMenuOpen: boolean;
  currentPage: string;
  onToggleCollapse: () => void;
  onCloseMobileMenu: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    href: '/',
  },
  {
    id: 'live',
    label: 'Partidas ao Vivo',
    icon: '🔴',
    href: '/live',
  },
  {
    id: 'upcoming',
    label: 'Próximas Partidas',
    icon: '📅',
    href: '/upcoming',
  },
  {
    id: 'leagues',
    label: 'Ligas',
    icon: '🏆',
    href: '/leagues',
  },
  {
    id: 'analytics',
    label: 'Análises',
    icon: '📈',
    href: '/analytics',
  },
  {
    id: 'tips',
    label: 'Dicas Premium',
    icon: '💎',
    href: '/tips',
    badge: 'PRO',
  },
];

export default function Sidebar({
  collapsed,
  mobileMenuOpen,
  currentPage,
  onToggleCollapse,
  onCloseMobileMenu,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`fixed top-0 left-0 z-30 h-full bg-white border-r border-gray-200 transition-all duration-300 hidden lg:block ${
        collapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            {collapsed ? (
              <div className="text-2xl">⚽</div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="text-2xl">⚽</div>
                <div className="text-xl font-bold text-green-600">Football Analytics</div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="ml-3 flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="ml-2 px-2 py-1 text-xs font-bold text-green-800 bg-green-200 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            ))}
          </nav>

          {/* Collapse Toggle */}
          <div className="p-2 border-t border-gray-200">
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
            >
              <span className="text-lg">
                {collapsed ? '→' : '←'}
              </span>
              {!collapsed && <span className="ml-2">Recolher</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">⚽</div>
              <div className="text-xl font-bold text-green-600">Football Analytics</div>
            </div>
            <button
              onClick={onCloseMobileMenu}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={onCloseMobileMenu}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="ml-3 flex-1">{item.label}</span>
                {item.badge && (
                  <span className="ml-2 px-2 py-1 text-xs font-bold text-green-800 bg-green-200 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
