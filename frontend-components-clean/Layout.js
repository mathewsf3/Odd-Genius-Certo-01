"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const Sidebar_1 = __importDefault(require("./Sidebar"));
const Dashboard_1 = __importDefault(require("./Dashboard"));
const navigation_1 = require("./config/navigation");
const useMatchData_1 = require("./hooks/useMatchData");
const utils_1 = require("@/lib/utils");
// ✅ MOBILE MENU BUTTON
const MobileMenuButton = ({ onClick }) => (<button onClick={onClick} className="fixed top-4 left-4 z-50 md:hidden bg-white/80 backdrop-blur-sm border border-green-200 rounded-lg p-2 shadow-lg hover:bg-green-50 transition-colors" aria-label="Abrir menu de navegação">
    <lucide_react_1.Menu className="w-5 h-5 text-green-600"/>
  </button>);
// ✅ MOBILE SIDEBAR OVERLAY
const MobileSidebarOverlay = ({ isOpen, onClose, children }) => {
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 z-40 md:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative w-64 h-full">
        {children}
      </div>
    </div>);
};
// ✅ MAIN LAYOUT COMPONENT
const Layout = ({ children, currentPath = "/dashboard", showSidebar = true, className }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, react_1.useState)(false);
    const [isMobile, setIsMobile] = (0, react_1.useState)(false);
    // ✅ REAL DATA FROM API HOOKS
    const { matches: liveMatches, loading: liveLoading, error: liveError } = (0, useMatchData_1.useLiveMatches)();
    const { matches: upcomingMatches, loading: upcomingLoading, error: upcomingError } = (0, useMatchData_1.useUpcomingMatches)(50); // Get more for accurate count
    // ✅ RESPONSIVE DETECTION
    (0, react_1.useEffect)(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    // ✅ CLOSE MOBILE MENU ON ROUTE CHANGE
    (0, react_1.useEffect)(() => {
        setIsMobileMenuOpen(false);
    }, [currentPath]);
    // ✅ KEYBOARD NAVIGATION
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMobileMenuOpen]);
    // ✅ CREATE NAVIGATION WITH REAL DATA
    const navigationItems = (0, navigation_1.createNavigationItems)(liveMatches.length, // ✅ Real live matches count
    upcomingMatches.length, // ✅ Real upcoming matches count
    currentPath);
    // ✅ NAVIGATION HANDLERS
    const navigationHandlers = (0, navigation_1.createNavigationHandlers)({
        push: (href) => {
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
    return (<div className={(0, utils_1.cn)("flex h-screen bg-gray-50", className)}>
      {/* Mobile Menu Button */}
      {isMobile && showSidebar && (<MobileMenuButton onClick={handleMobileMenuToggle}/>)}

      {/* Desktop Sidebar */}
      {!isMobile && showSidebar && (<Sidebar_1.default navigationItems={navigationItems} // ✅ Real data with API counts
         isLoading={sidebarLoading} error={sidebarError} currentPath={currentPath} onNavigate={navigationHandlers.onNavigate} className="hidden md:block"/>)}

      {/* Mobile Sidebar */}
      {isMobile && showSidebar && (<MobileSidebarOverlay isOpen={isMobileMenuOpen} onClose={handleMobileMenuClose}>
          <Sidebar_1.default navigationItems={navigationItems} // ✅ Real data with API counts
         isLoading={sidebarLoading} error={sidebarError} currentPath={currentPath} onNavigate={(item) => {
                navigationHandlers.onNavigate(item);
                handleMobileMenuClose();
            }} className="h-full"/>
        </MobileSidebarOverlay>)}

      {/* Main Content */}
      <main className={(0, utils_1.cn)("flex-1 overflow-auto", isMobile ? "pt-16" : "", // Add top padding for mobile menu button
        showSidebar ? "" : "w-full")}>
        {children || <Dashboard_1.default />}
      </main>
    </div>);
};
exports.default = Layout;
