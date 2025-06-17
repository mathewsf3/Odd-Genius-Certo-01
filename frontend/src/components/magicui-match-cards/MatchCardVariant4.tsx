/**
 * Match Card Variant 4: Interactive Hover with Sparkles
 * Features: Interactive hover buttons, sparkles text, ripple effects
 */

import { motion } from 'framer-motion';
import { Award, Clock, MapPin, TrendingUp, Zap } from 'lucide-react';
import React from 'react';
import { Badge } from '../ui/badge-simple';
import { InteractiveHoverButton } from '../ui/interactive-hover-button';
import { RippleButton } from '../ui/ripple-button';
import { SparklesText } from '../ui/sparkles-text';

interface Team {
  id: number;
  name: string;
  abbreviation: string;
  logo?: string;
}

interface MatchStats {
  homeScore: number;
  awayScore: number;
  homeShots: number;
  awayShots: number;
  homePossession: number;
  awayPossession: number;
}

interface Match {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  status: 'live' | 'upcoming' | 'finished';
  kickoff: string;
  venue?: string;
  minute?: number;
  stats?: MatchStats;
  odds?: {
    home: number;
    draw: number;
    away: number;
  };
}

interface MatchCardVariant4Props {
  match: Match;
  onClick?: (match: Match) => void;
}

const MatchCardVariant4: React.FC<MatchCardVariant4Props> = ({ match, onClick }) => {
  const formatKickoff = (kickoff: string) => {
    return new Date(kickoff).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getWinningTeam = () => {
    if (match.stats && match.status === 'finished') {
      if (match.stats.homeScore > match.stats.awayScore) return 'home';
      if (match.stats.awayScore > match.stats.homeScore) return 'away';
      return 'draw';
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      transition={{ 
        duration: 0.5,
        type: "spring",
        stiffness: 150,
        damping: 20
      }}
      className="relative w-full max-w-lg mx-auto group"
    >
      <div 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
        onClick={() => onClick?.(match)}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500" />

        <div className="relative z-10 p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Badge 
                variant={match.status === 'live' ? 'destructive' : match.status === 'finished' ? 'secondary' : 'default'}
                className="px-3 py-1"
              >
                {match.status === 'live' ? (
                  <div className="flex items-center space-x-2">
                    <motion.div 
                      className="w-2 h-2 bg-red-500 rounded-full"
                      animate={{ 
                        scale: [1, 1.4, 1],
                        opacity: [1, 0.6, 1]
                      }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    <span>LIVE {match.minute}'</span>
                  </div>
                ) : (
                  <span className="capitalize font-medium">{match.status}</span>
                )}
              </Badge>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-2 text-muted-foreground"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{formatKickoff(match.kickoff)}</span>
            </motion.div>
          </div>

          {/* Teams Section */}
          <div className="grid grid-cols-3 gap-6 items-center">
            {/* Home Team */}
            <motion.div 
              className="text-center space-y-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <motion.div 
                  className={`w-18 h-18 mx-auto rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl ${
                    getWinningTeam() === 'home' 
                      ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600' 
                      : 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700'
                  }`}
                  whileHover={{ 
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  {match.homeTeam.abbreviation}
                </motion.div>
                
                {getWinningTeam() === 'home' && (
                  <motion.div 
                    className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                  >
                    <Award className="w-4 h-4 text-yellow-800" />
                  </motion.div>
                )}
              </div>
              
              <div>
                <SparklesText 
                  text={match.homeTeam.name}
                  className="font-bold text-sm"
                  sparklesCount={getWinningTeam() === 'home' ? 8 : 3}
                />
                <div className="text-xs text-muted-foreground mt-1">Home</div>
              </div>
            </motion.div>

            {/* Score/VS Center */}
            <div className="text-center space-y-2">
              {match.status === 'live' && match.stats ? (
                <motion.div 
                  className="space-y-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300,
                    delay: 0.3 
                  }}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <motion.span 
                      className={`text-3xl font-bold ${
                        getWinningTeam() === 'home' ? 'text-yellow-600' : 'text-blue-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {match.stats.homeScore}
                    </motion.span>
                    
                    <motion.div
                      className="text-xl text-muted-foreground"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      :
                    </motion.div>
                    
                    <motion.span 
                      className={`text-3xl font-bold ${
                        getWinningTeam() === 'away' ? 'text-yellow-600' : 'text-red-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {match.stats.awayScore}
                    </motion.span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {match.status === 'finished' ? 'Final Score' : 'Current Score'}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  className="space-y-2"
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <SparklesText 
                    text="VS"
                    className="text-2xl font-bold text-muted-foreground"
                    sparklesCount={5}
                  />
                  <div className="text-xs text-muted-foreground">
                    {match.status === 'upcoming' ? 'Upcoming Match' : 'Match Over'}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Away Team */}
            <motion.div 
              className="text-center space-y-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <motion.div 
                  className={`w-18 h-18 mx-auto rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl ${
                    getWinningTeam() === 'away' 
                      ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600' 
                      : 'bg-gradient-to-br from-red-500 via-red-600 to-red-700'
                  }`}
                  whileHover={{ 
                    rotate: [0, 5, -5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  {match.awayTeam.abbreviation}
                </motion.div>
                
                {getWinningTeam() === 'away' && (
                  <motion.div 
                    className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                  >
                    <Award className="w-4 h-4 text-yellow-800" />
                  </motion.div>
                )}
              </div>
              
              <div>
                <SparklesText 
                  text={match.awayTeam.name}
                  className="font-bold text-sm"
                  sparklesCount={getWinningTeam() === 'away' ? 8 : 3}
                />
                <div className="text-xs text-muted-foreground mt-1">Away</div>
              </div>
            </motion.div>
          </div>

          {/* Match Stats */}
          {match.status === 'live' && match.stats && (
            <motion.div 
              className="bg-muted/30 rounded-2xl p-4 space-y-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <SparklesText 
                  text="Live Stats"
                  className="font-semibold text-primary"
                  sparklesCount={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                  <div className="text-xl font-bold text-blue-600">{match.stats.homeShots}</div>
                  <div className="text-xs text-blue-600/70">Home Shots</div>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-xl">
                  <div className="text-xl font-bold text-red-600">{match.stats.awayShots}</div>
                  <div className="text-xs text-red-600/70">Away Shots</div>
                </div>
              </div>
              
              {/* Possession Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-blue-600">Possession</span>
                  <span className="text-muted-foreground">
                    {match.stats.homePossession}% - {match.stats.awayPossession}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-500 to-red-500"
                    initial={{ width: "50%" }}
                    animate={{ width: `${match.stats.homePossession}%` }}
                    transition={{ duration: 1.5, delay: 0.6 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Venue */}
          {match.venue && (
            <motion.div 
              className="flex items-center justify-center space-x-2 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{match.venue}</span>
            </motion.div>
          )}

          {/* Interactive Buttons */}
          <motion.div 
            className="flex space-x-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex-1">
              <InteractiveHoverButton className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <span className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Quick Analysis</span>
                </span>
              </InteractiveHoverButton>
            </div>
            
            <RippleButton 
              className="px-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              rippleColor="#3b82f6"
            >
              <TrendingUp className="w-4 h-4" />
            </RippleButton>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCardVariant4;
