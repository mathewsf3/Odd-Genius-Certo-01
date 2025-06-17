/**
 * Magic UI Match Cards Showcase
 * Displays all 4 match card variants with sample data
 */

import { motion } from 'framer-motion';
import React from 'react';
import MatchCardVariant1 from './MatchCardVariant1';
import MatchCardVariant2 from './MatchCardVariant2';
import MatchCardVariant3 from './MatchCardVariant3';
import MatchCardVariant4 from './MatchCardVariant4';

// Sample match data
const sampleMatches = [
  {
    id: 1,
    homeTeam: {
      id: 1,
      name: "Manchester United",
      abbreviation: "MUN"
    },
    awayTeam: {
      id: 2,
      name: "Liverpool FC",
      abbreviation: "LIV"
    },
    status: 'live' as const,
    kickoff: new Date().toISOString(),
    venue: "Old Trafford",
    minute: 67,
    stats: {
      homeScore: 2,
      awayScore: 1,
      homeShots: 12,
      awayShots: 8,
      homePossession: 58,
      awayPossession: 42
    },
    odds: {
      home: 2.1,
      draw: 3.4,
      away: 3.2
    }
  },
  {
    id: 2,
    homeTeam: {
      id: 3,
      name: "Arsenal FC",
      abbreviation: "ARS"
    },
    awayTeam: {
      id: 4,
      name: "Chelsea FC",
      abbreviation: "CHE"
    },
    status: 'upcoming' as const,
    kickoff: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    venue: "Emirates Stadium",
    odds: {
      home: 1.8,
      draw: 3.6,
      away: 4.2
    }
  },
  {
    id: 3,
    homeTeam: {
      id: 5,
      name: "Real Madrid",
      abbreviation: "RMD"
    },
    awayTeam: {
      id: 6,
      name: "FC Barcelona",
      abbreviation: "BAR"
    },
    status: 'finished' as const,
    kickoff: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    venue: "Santiago Bernabéu",
    stats: {
      homeScore: 3,
      awayScore: 1,
      homeShots: 15,
      awayShots: 10,
      homePossession: 52,
      awayPossession: 48
    },
    odds: {
      home: 2.3,
      draw: 3.1,
      away: 2.9
    }
  },
  {
    id: 4,
    homeTeam: {
      id: 7,
      name: "Bayern Munich",
      abbreviation: "BAY"
    },
    awayTeam: {
      id: 8,
      name: "Borussia Dortmund",
      abbreviation: "BVB"
    },
    status: 'live' as const,
    kickoff: new Date().toISOString(),
    venue: "Allianz Arena",
    minute: 23,
    stats: {
      homeScore: 0,
      awayScore: 1,
      homeShots: 6,
      awayShots: 4,
      homePossession: 64,
      awayPossession: 36
    },
    odds: {
      home: 1.5,
      draw: 4.2,
      away: 6.8
    }
  }
];

const MatchCardsShowcase: React.FC = () => {
  const handleMatchClick = (match: any) => {
    console.log('Match clicked:', match);
    // Handle match click navigation or modal
  };

  const cardVariants = [
    {
      title: "Neon Glow Card",
      description: "Features animated beams, neon gradient borders, and shimmer effects",
      component: MatchCardVariant1
    },
    {
      title: "Magic Spotlight Card", 
      description: "Magic card with spotlight effects, border beam animations, and rainbow buttons",
      component: MatchCardVariant2
    },
    {
      title: "Meteors Battle Card",
      description: "Space-themed with meteors effects, cool mode interactions, and pulsating buttons",
      component: MatchCardVariant3
    },
    {
      title: "Interactive Sparkles Card",
      description: "Interactive hover effects, sparkles text, and ripple interactions",
      component: MatchCardVariant4
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Magic UI Match Cards
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four stunning match card variants built with Magic UI components. 
            Each showcases different animations and interactive effects.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="space-y-16">
          {cardVariants.map((variant, index) => {
            const CardComponent = variant.component;
            const match = sampleMatches[index];
            
            return (
              <motion.div
                key={index}
                className="space-y-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                {/* Variant Info */}
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {variant.title}
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {variant.description}
                  </p>
                </div>

                {/* Card Display */}
                <div className="flex justify-center">
                  <div className="w-full max-w-lg">
                    <CardComponent 
                      match={match} 
                      onClick={handleMatchClick}
                    />
                  </div>
                </div>

                {/* Divider */}
                {index < cardVariants.length - 1 && (
                  <motion.div 
                    className="flex justify-center pt-8"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.8, delay: (index * 0.2) + 0.4 }}
                  >
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-border to-transparent" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-16 pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-muted-foreground">
            Built with ❤️ using Magic UI Components & Framer Motion
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
              React
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
              Magic UI
            </span>
            <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm">
              Framer Motion
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MatchCardsShowcase;
