/**
 * 🎯 MAGIC UI TEST LAUNCHER
 * 
 * Easy access to all MagicUI test components
 */

"use client";

import { motion } from 'framer-motion';
import { Activity, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { AnimatedGradientText, BorderBeam, Glow, MagicCard } from '../src/components/ui/magic-components';

const testPages = [
  {
    id: 'demo',
    title: 'MagicUI Demo',
    description: 'Simple demo of all MagicUI components',
    href: '/test-magic',
    icon: Sparkles,
    color: '#10B981'
  },
  {
    id: 'dashboard',
    title: 'Enhanced Dashboard',
    description: 'Full dashboard with MagicUI effects',
    href: '/test-dashboard',
    icon: Activity,
    color: '#3B82F6'
  },
  {
    id: 'comparison',
    title: 'Side-by-Side Comparison',
    description: 'Compare original vs enhanced versions',
    href: '/test-magic-ui',
    icon: Eye,
    color: '#8B5CF6'
  }
];

export default function MagicUILauncher() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Glow color="#8B5CF6" size={12}>
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </Glow>
          
          <AnimatedGradientText 
            colors={['#8B5CF6', '#EC4899', '#10B981']}
            className="text-4xl font-bold mb-4"
          >
            MagicUI Test Suite
          </AnimatedGradientText>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Choose a test to see your enhanced components in action
          </p>
        </motion.div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testPages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={page.href}>
                <MagicCard 
                  className="h-full cursor-pointer"
                  gradientFrom={page.color}
                  gradientTo={page.color}
                >
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 h-full flex flex-col">
                    <BorderBeam 
                      size={80} 
                      duration={5 + index} 
                      colorFrom={page.color}
                      colorTo={page.color}
                    />
                    
                    <div className="flex items-center space-x-3 mb-4">
                      <Glow color={page.color} size={6}>
                        <page.icon className="w-8 h-8" style={{ color: page.color }} />
                      </Glow>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {page.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 flex-1 mb-4">
                      {page.description}
                    </p>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg text-center font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Launch Test →
                    </motion.div>
                  </div>
                </MagicCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              🎯 What to Expect
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>✨ Interactive hover effects</div>
              <div>🌈 Animated gradients</div>
              <div>💫 Glowing elements</div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
