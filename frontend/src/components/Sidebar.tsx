/**
 * 🎯 SIDEBAR COMPONENT - NAVIGATION
 * 
 * ✅ Portuguese-BR interface
 * ✅ Green/white theme
 * ✅ Responsive design
 * ✅ Collapsible sidebar
 */

import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Crown,
    Home,
    Play,
    Sparkles,
    Trophy
} from 'lucide-react';
import React from 'react';
import { cn } from '../lib/utils';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  currentPage: 'dashboard' | 'live' | 'upcoming' | 'magicui-test';
  setCurrentPage: (page: 'dashboard' | 'live' | 'upcoming' | 'magicui-test') => void;
}

const getNavigationItems = (currentPage: 'dashboard' | 'live' | 'magicui-test') => [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    isActive: currentPage === 'dashboard',
    page: 'dashboard' as const
  },
  {
    id: 'live-matches',
    label: 'Ao Vivo',
    icon: Play,
    href: '/ao-vivo',
    badge: 'LIVE',
    isActive: currentPage === 'live',
    page: 'live' as const
  },
  {
    id: 'magicui-test',
    label: 'Magic UI Test',
    icon: Sparkles,
    href: '/magicui-test',
    badge: 'TEST',
    isActive: currentPage === 'magicui-test',
    page: 'magicui-test' as const
  },
  {
    id: 'upcoming-matches',
    label: 'Próximas',
    icon: Clock,
    href: '/proximas'
  },
  {
    id: 'leagues',
    label: 'Ligas',
    icon: Trophy,
    href: '/ligas'
  },
  {
    id: 'premium-tips',
    label: 'Tips Premium',
    icon: Crown,
    href: '/tips-premium',
    badge: 'VIP'
  }
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, currentPage, setCurrentPage }) => {
  const navigationItems = getNavigationItems(currentPage);
  return (
    <div className={cn(
      "bg-gradient-to-b from-slate-50/80 to-slate-100/60 border-r border-gray-200 shadow-xl transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      "hidden md:flex flex-col"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50/70 to-emerald-50/70">
        <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Futebol BR
              </h1>
              <p className="text-xs text-gray-600 font-medium">Dashboard Analytics</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => item.page && setCurrentPage(item.page)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left group transition-all duration-300",
                  item.isActive
                    ? "bg-gradient-to-r from-green-100/90 to-emerald-100/90 text-green-700 shadow-md border border-green-200/60"
                    : "text-slate-600 hover:bg-gradient-to-r hover:from-green-50/80 hover:to-emerald-50/80 hover:shadow-sm",
                  collapsed ? "justify-center px-3" : ""
                )}
              >
                <Icon className={cn(
                  "flex-shrink-0 transition-all duration-300",
                  item.isActive ? "text-green-600" : "text-gray-500 group-hover:text-green-600",
                  "w-5 h-5"
                )} />
                
                {!collapsed && (
                  <>
                    <span className="flex-1 font-semibold text-sm truncate">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className={cn(
                        "px-2.5 py-1 text-xs rounded-full font-bold shadow-sm",
                        item.badge === 'LIVE' ? "bg-red-500 text-white animate-pulse" :
                        item.isActive 
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                          : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex justify-center items-center py-2 hover:bg-gradient-to-r hover:from-green-50/80 hover:to-emerald-50/80 transition-all duration-200 rounded-xl"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-green-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-green-600" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
