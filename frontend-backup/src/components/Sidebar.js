"use strict";
/**
 * 🎯 SIDEBAR COMPONENT - 100% REAL API DATA
 *
 * ✅ ZERO hardcoded data
 * ✅ Real navigation integration
 * ✅ Portuguese-BR interface
 * ✅ Green/White theme
 * ✅ Responsive design
 * ✅ File management rule applied
 */
"use client";
/**
 * 🎯 SIDEBAR COMPONENT - 100% REAL API DATA
 *
 * ✅ ZERO hardcoded data
 * ✅ Real navigation integration
 * ✅ Portuguese-BR interface
 * ✅ Green/White theme
 * ✅ Responsive design
 * ✅ File management rule applied
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
// ✅ MAIN SIDEBAR COMPONENT - REAL DATA ONLY
const Sidebar = ({ navigationItems, // ✅ Real data from parent
isLoading = false, error = null, defaultCollapsed = false, onNavigate, className = "", currentPath = "" }) => {
    const [isCollapsed, setIsCollapsed] = (0, react_1.useState)(defaultCollapsed);
    const [activeItem, setActiveItem] = (0, react_1.useState)("");
    const [isMobile, setIsMobile] = (0, react_1.useState)(false);
    const [mobileOpen, setMobileOpen] = (0, react_1.useState)(false);
    const [openSubmenus, setOpenSubmenus] = (0, react_1.useState)(new Set());
    const sidebarRef = (0, react_1.useRef)(null);
    // ✅ RESPONSIVE DETECTION
    (0, react_1.useEffect)(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    // ✅ KEYBOARD NAVIGATION
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && mobileOpen) {
                setMobileOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [mobileOpen]);
    // ✅ SET ACTIVE ITEM BASED ON CURRENT PATH
    (0, react_1.useEffect)(() => {
        const findActiveItem = (items) => {
            for (const item of items) {
                if (item.href === currentPath) {
                    return item.id;
                }
                if (item.children) {
                    const childActive = findActiveItem(item.children);
                    if (childActive)
                        return childActive;
                }
            }
            return "";
        };
        setActiveItem(findActiveItem(navigationItems));
    }, [currentPath, navigationItems]);
    // ✅ HANDLE NAVIGATION - REAL ROUTING
    const handleItemClick = (item) => {
        setActiveItem(item.id);
        if (item.onClick) {
            item.onClick();
        }
        if (onNavigate) {
            onNavigate(item);
        }
        // Navigate to href if provided
        if (item.href) {
            window.location.href = item.href;
        }
        if (isMobile && !item.children) {
            setMobileOpen(false);
        }
    };
    // ✅ KEYBOARD ACCESSIBILITY
    const handleKeyNavigation = (event, item) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleItemClick(item);
        }
    };
    // ✅ SUBMENU TOGGLE
    const toggleSubmenu = (itemId) => {
        setOpenSubmenus(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            }
            else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };
    // ✅ RENDER NAVIGATION ITEM
    const renderNavigationItem = (item, level = 0) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;
        const hasChildren = item.children && item.children.length > 0;
        const isSubmenuOpen = openSubmenus.has(item.id);
        return (<div key={item.id} className={`${level > 0 ? 'ml-0' : ''}`}>
        <button onClick={() => {
                if (hasChildren) {
                    toggleSubmenu(item.id);
                }
                handleItemClick(item);
            }} onKeyDown={(e) => handleKeyNavigation(e, item)} className={(0, utils_1.cn)("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left group", "transition-all duration-300 ease-in-out transform", "focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:scale-[1.02]", isActive
                ? "bg-gradient-to-r from-green-100/90 to-emerald-100/90 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300 shadow-md border border-green-200/60 dark:border-green-700/60"
                : "text-slate-600 dark:text-slate-300 hover:text-foreground hover:bg-gradient-to-r hover:from-green-50/80 hover:to-emerald-50/80 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 hover:shadow-sm hover:scale-[1.01]", isCollapsed && !isMobile ? "justify-center px-3" : "")} aria-label={item.label} role="menuitem" aria-expanded={hasChildren ? isSubmenuOpen : undefined}>
          {Icon && (<Icon className={(0, utils_1.cn)("flex-shrink-0 transition-all duration-300 group-hover:scale-110", isActive ? "text-green-600 dark:text-green-400" : "text-foreground/50 group-hover:text-green-600/80", isCollapsed && !isMobile ? "w-5 h-5" : "w-5 h-5")}/>)}
          
          {(!isCollapsed || isMobile) && (<>
              <span className="flex-1 font-semibold text-sm truncate group-hover:text-foreground transition-colors duration-200">
                {item.label}
              </span>
              {item.badge && (<span className={(0, utils_1.cn)("px-2.5 py-1 text-xs rounded-full font-bold shadow-sm", isActive
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                        : "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300")}>
                  {item.badge}
                </span>)}
              {hasChildren && (<div className="ml-auto">
                  {isSubmenuOpen ? (<lucide_react_1.ChevronUp className="w-4 h-4 text-foreground/60 group-hover:text-foreground"/>) : (<lucide_react_1.ChevronDown className="w-4 h-4 text-foreground/60 group-hover:text-foreground"/>)}
                </div>)}
            </>)}
        </button>
        
        {hasChildren && (!isCollapsed || isMobile) && isSubmenuOpen && (<div className="mt-2 ml-2 space-y-1 border-l-2 border-green-100 dark:border-green-800/50 pl-4">
            {item.children.map(child => renderNavigationItem(child, level + 1))}
          </div>)}
      </div>);
    };
    // ✅ LOADING STATE - NO MOCK DATA
    const renderLoadingState = () => (<div className="space-y-2 p-3">
      {[...Array(6)].map((_, i) => (<div key={i} className="flex items-center gap-3">
          <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
          {(!isCollapsed || isMobile) && <div className="flex-1 h-4 bg-gray-300 rounded animate-pulse"></div>}
        </div>))}
    </div>);
    // ✅ ERROR STATE - NO FALLBACK DATA
    const renderErrorState = () => (<div className="p-4 text-center">
      <div className="text-red-500 dark:text-red-400 mb-2">
        <lucide_react_1.Shield className="w-8 h-8 mx-auto"/>
      </div>
      <p className="text-sm text-foreground/60">
        {error || "Erro ao carregar navegação"}
      </p>
    </div>);
    // ✅ EMPTY STATE - NO MOCK DATA
    const renderEmptyState = () => (<div className="p-4 text-center">
      <div className="text-foreground/40 mb-2">
        <lucide_react_1.Menu className="w-8 h-8 mx-auto"/>
      </div>
      <p className="text-sm text-foreground/60">
        Nenhum item de navegação disponível
      </p>
    </div>);
    return (<div ref={sidebarRef} className={className}>
      <div className={(0, utils_1.cn)("h-full flex flex-col bg-gradient-to-b from-slate-50/80 to-slate-100/60 dark:from-slate-900/90 dark:to-slate-800/80 border-r border-border/50 shadow-xl", isCollapsed && !isMobile ? "w-16" : "w-64", "transition-all duration-300 ease-in-out backdrop-blur-sm")}>
        {/* Header */}
        <div className="p-4 border-b border-border/30 bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-green-900/30 dark:to-emerald-900/30">
          <div className={(0, utils_1.cn)("flex items-center gap-3", isCollapsed && !isMobile ? "justify-center" : "")}>
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <lucide_react_1.Trophy className="w-6 h-6 text-white"/>
            </div>
            {(!isCollapsed || isMobile) && (<div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent">
                  Futebol BR
                </h1>
                <p className="text-xs text-foreground/60 font-medium">Dashboard Analytics</p>
              </div>)}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4" role="menu" aria-label="Navegação principal">
            {isLoading ? (renderLoadingState()) : error ? (renderErrorState()) : navigationItems.length === 0 ? (renderEmptyState()) : (<div className="space-y-2">
                {navigationItems.map(item => renderNavigationItem(item))}
              </div>)}
          </nav>
        </div>

        {/* Collapse Toggle - Desktop Only */}
        {!isMobile && (<>
            <div className="border-t border-border/30"></div>
            <div className="p-3">
              <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-full flex justify-center items-center py-2 hover:bg-gradient-to-r hover:from-green-50/80 hover:to-emerald-50/80 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-200 hover:scale-105 rounded-xl" aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}>
                {isCollapsed ? (<lucide_react_1.ChevronRight className="w-4 h-4 text-green-600"/>) : (<lucide_react_1.ChevronLeft className="w-4 h-4 text-green-600"/>)}
              </button>
            </div>
          </>)}
      </div>
    </div>);
};
exports.default = Sidebar;
