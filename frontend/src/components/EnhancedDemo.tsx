/**
 * 🎯 ENHANCED COMPONENTS DEMO
 * 
 * Demo showcasing the enhanced Dashboard and MatchCard components
 * with Magic UI animations and white/green football theme
 */

import { motion } from 'framer-motion';
import React from 'react';
import EnhancedMatchCard from './EnhancedMatchCard';
import { MagicCard } from './ui/magic-card';
import { NumberTicker } from './ui/number-ticker';
import Particles from './ui/particles';
import { ShimmerButton } from './ui/shimmer-button';
import { TextAnimate } from './ui/text-animate';

// Sample match data for demo
const sampleMatch = {
  id: 1,
  homeID: 100,
  awayID: 101,
  home_name: "Manchester United",
  away_name: "Liverpool",
  home_image: "manchester-united.png",
  away_image: "liverpool.png",
  homeGoalCount: 2,
  awayGoalCount: 1,
  status: "live",
  date_unix: Math.floor(Date.now() / 1000),
  stadium_name: "Old Trafford",
  stadium_location: "Manchester",
  competition_id: 1,
  match_url: "#"
};

const EnhancedDemo: React.FC = () => {
  const handleAnalyze = (matchId: number) => {
    console.log(`Analyzing match ${matchId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white">
      {/* Background Particles */}
      <Particles
        className="fixed inset-0 -z-10"
        quantity={60}
        color="#22c55e"
        staticity={30}
      />

      <div className="relative z-10">
        {/* Header Section */}
        <div className="text-center py-12 px-6">
          <TextAnimate
            animation="blurInUp"
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent mb-4"
            by="word"
          >
            Enhanced Football Dashboard
          </TextAnimate>
          
          <TextAnimate
            animation="fadeIn"
            delay={0.3}
            className="text-xl text-gray-600 mb-8"
          >
            Magic UI Components Demo • White & Green Theme
          </TextAnimate>

          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ShimmerButton
              className="px-6 py-3"
              shimmerColor="#22c55e"
              background="rgba(34, 197, 94, 1)"
            >
              Live Dashboard
            </ShimmerButton>
            
            <ShimmerButton
              className="px-6 py-3"
              shimmerColor="#3b82f6"
              background="rgba(59, 130, 246, 1)"
            >
              Match Analysis
            </ShimmerButton>
          </motion.div>
        </div>

        {/* Demo Statistics */}
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MagicCard className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
              <div className="text-center">
                <NumberTicker
                  value={42}
                  className="text-3xl font-bold text-green-600 block mb-2"
                />
                <TextAnimate animation="slideUp" className="text-green-700 font-semibold">
                  Enhanced Components
                </TextAnimate>
              </div>
            </MagicCard>

            <MagicCard className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
              <div className="text-center">
                <NumberTicker
                  value={15}
                  className="text-3xl font-bold text-blue-600 block mb-2"
                />
                <TextAnimate animation="slideUp" className="text-blue-700 font-semibold">
                  Magic UI Animations
                </TextAnimate>
              </div>
            </MagicCard>

            <MagicCard className="p-6 bg-gradient-to-br from-purple-50 to-white border-purple-200">
              <div className="text-center">
                <NumberTicker
                  value={100}
                  className="text-3xl font-bold text-purple-600 block mb-2"
                  delay={0.5}
                />
                <TextAnimate animation="slideUp" className="text-purple-700 font-semibold">
                  Performance Score
                </TextAnimate>
              </div>
            </MagicCard>
          </div>
        </div>

        {/* Sample Match Card */}
        <div className="max-w-md mx-auto px-6 mb-12">
          <TextAnimate
            animation="blurInUp"
            className="text-2xl font-bold text-center text-gray-900 mb-6"
          >
            Enhanced Match Card
          </TextAnimate>
          
          <EnhancedMatchCard
            match={sampleMatch}
            animado={true}
            onAnalisarPartida={handleAnalyze}
          />
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <TextAnimate
            animation="blurInUp"
            className="text-3xl font-bold text-center text-gray-900 mb-12"
          >
            Key Features
          </TextAnimate>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Magic UI Components",
                description: "Advanced animations with shimmer effects, text animations, and particle systems",
                color: "green"
              },
              {
                title: "Real-time Data",
                description: "Live match data integration with FootyStats API for accurate information",
                color: "blue"
              },
              {
                title: "Responsive Design",
                description: "Mobile-first approach with seamless adaptation across all devices",
                color: "purple"
              },
              {
                title: "Performance Optimized",
                description: "Lazy loading, efficient animations, and optimized API calls",
                color: "orange"
              },
              {
                title: "Modern Theme",
                description: "White and green football-inspired design with glassmorphism effects",
                color: "teal"
              },
              {
                title: "Interactive Elements",
                description: "Hover effects, click animations, and smooth transitions throughout",
                color: "pink"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MagicCard className={`p-6 h-full bg-gradient-to-br from-${feature.color}-50 to-white border-${feature.color}-200`}>
                  <TextAnimate
                    animation="slideUp"
                    className="text-lg font-bold text-gray-900 mb-3"
                  >
                    {feature.title}
                  </TextAnimate>
                  <p className="text-gray-600">{feature.description}</p>
                </MagicCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-12 px-6">
          <TextAnimate
            animation="fadeIn"
            className="text-gray-500 mb-4"
          >
            Enhanced with Magic UI • Built for modern football analytics
          </TextAnimate>
          
          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-green-600 font-medium">System Active</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDemo;
