/**
 * 🎯 MAGIC UI TEST PAGE
 * 
 * A test page to showcase the enhanced dashboard and match cards
 * with beautiful MagicUI components and effects
 */

"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Dashboard from '../components/Dashboard';
import EnhancedDashboard from '../components/test/EnhancedDashboard';
import { AnimatedGradientText, Glow, Pulse } from '../components/ui/magic-components';

// ✨ TEST COMPONENT SWITCHER
export default function MagicUITestPage() {
  const [viewMode, setViewMode] = useState<'original' | 'enhanced'>('enhanced');
  const [showComparison, setShowComparison] = useState(false);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'original' ? 'enhanced' : 'original');
  };

  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      {/* ✨ CONTROL HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-purple-200 dark:border-purple-800 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Glow color="#8B5CF6" size={8}>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </Glow>
              
              <div>
                <AnimatedGradientText 
                  colors={['#8B5CF6', '#EC4899', '#8B5CF6']}
                  className="text-2xl font-bold"
                >
                  MagicUI Test Dashboard
                </AnimatedGradientText>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Compare original vs enhanced components
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleViewMode}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300 ${
                  viewMode === 'enhanced' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {viewMode === 'enhanced' ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                <span>{viewMode === 'enhanced' ? 'Enhanced' : 'Original'}</span>
              </motion.button>
              
              {/* Comparison Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleComparison}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300 ${
                  showComparison 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {showComparison ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{showComparison ? 'Split View' : 'Single View'}</span>
              </motion.button>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="mt-4 flex items-center justify-center">
            <Pulse duration={2}>
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span>
                  Showing: {viewMode === 'enhanced' ? 'MagicUI Enhanced Version' : 'Original Version'}
                  {showComparison && ' (Split View)'}
                </span>
              </div>
            </Pulse>
          </div>
        </div>
      </motion.div>

      {/* ✨ MAIN CONTENT */}
      <div className="relative">
        {showComparison ? (
          /* Split View Mode */
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
            {/* Left Side - Original */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative border-r border-gray-200 dark:border-gray-700"
            >
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                  Original
                </div>
              </div>
              <div className="h-full overflow-auto">
                <Dashboard />
              </div>
            </motion.div>
            
            {/* Right Side - Enhanced */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="absolute top-4 right-4 z-10">
                <Glow color="#8B5CF6" size={4}>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg text-sm font-semibold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Enhanced</span>
                  </div>
                </Glow>
              </div>
              <div className="h-full overflow-auto">
                <EnhancedDashboard />
              </div>
            </motion.div>
          </div>
        ) : (
          /* Single View Mode */
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {viewMode === 'enhanced' ? <EnhancedDashboard /> : <Dashboard />}
          </motion.div>
        )}
      </div>

      {/* ✨ FLOATING INFO PANEL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Glow color="#8B5CF6" size={6}>
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-purple-200 dark:border-purple-800 rounded-xl p-4 shadow-xl max-w-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="font-semibold text-gray-900 dark:text-white">MagicUI Features</span>
            </div>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>✨ Interactive hover effects</li>
              <li>🌈 Animated gradients</li>
              <li>💫 Glowing borders</li>
              <li>🎭 Smooth animations</li>
              <li>🎯 Enhanced UX</li>
              <li>⚡ Performance optimized</li>
            </ul>
          </div>
        </Glow>
      </motion.div>
    </div>
  );
}
