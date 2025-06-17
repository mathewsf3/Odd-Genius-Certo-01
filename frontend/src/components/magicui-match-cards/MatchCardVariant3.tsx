/**
 * Match Card Variant 3: Meteors & Cool Mode
 * Features: Meteors effect, Cool mode interactions, pulsating buttons
 */

import { motion } from 'framer-motion';
import { Activity, Clock, Flame, MapPin, Star } from 'lucide-react';
import React from 'react';
import { Badge } from '../ui/badge-simple';
import { CoolMode } from '../ui/cool-mode';
import { Meteors } from '../ui/meteors';
import { PulsatingButton } from '../ui/pulsating-button';

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

interface MatchCardVariant3Props {
  match: Match;
  onClick?: (match: Match) => void;
}

const MatchCardVariant3: React.FC<MatchCardVariant3Props> = ({ match, onClick }) => {
  const formatKickoff = (kickoff: string) => {
    return new Date(kickoff).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getMatchIntensity = () => {
    if (match.stats) {
      const totalShots = match.stats.homeShots + match.stats.awayShots;
      const totalScore = match.stats.homeScore + match.stats.awayScore;
      return Math.min(Math.round((totalShots + totalScore * 3) / 2), 50);
    }
    return 20;
  };

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -15 }}
      animate={{ opacity: 1, rotateY: 0 }}
      whileHover={{ 
        scale: 1.02,
        rotateY: 2,
        transition: { duration: 0.3 }
      }}
      transition={{ 
        duration: 0.6,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className="relative w-full max-w-lg mx-auto perspective-1000"
    >
      <div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/20 cursor-pointer shadow-2xl"
        onClick={() => onClick?.(match)}
      >
        {/* Meteors Background Effect */}
        <div className="absolute inset-0">
          <Meteors 
            number={getMatchIntensity()} 
            className="animate-meteor-effect"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 p-6 space-y-4">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge 
                variant={match.status === 'live' ? 'destructive' : 'secondary'} 
                className="bg-purple-600/20 text-purple-200 border-purple-400/30"
              >
                {match.status === 'live' ? (
                  <div className="flex items-center space-x-1">
                    <motion.div 
                      className="w-2 h-2 bg-red-400 rounded-full"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.7, 1]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span>LIVE {match.minute}'</span>
                  </div>
                ) : (
                  <span className="capitalize">{match.status}</span>
                )}
              </Badge>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-2 text-purple-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm">{formatKickoff(match.kickoff)}</span>
            </motion.div>
          </div>

          {/* Teams Battle Section */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-4 items-center">
              {/* Home Team */}
              <CoolMode options={{ particle: "circle" }}>
                <motion.div 
                  className="text-center space-y-3 group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative">
                    <motion.div 
                      className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-blue-300/30"
                      whileHover={{ 
                        boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
                        scale: 1.1
                      }}
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(59, 130, 246, 0.3)",
                          "0 0 30px rgba(59, 130, 246, 0.5)",
                          "0 0 20px rgba(59, 130, 246, 0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {match.homeTeam.abbreviation}
                    </motion.div>
                    
                    {/* Power Level Indicator */}
                    <motion.div 
                      className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Star className="w-3 h-3 text-yellow-800" />
                    </motion.div>
                  </div>
                  
                  <div>
                    <div className="font-bold text-white text-sm">{match.homeTeam.name}</div>
                    <div className="text-xs text-purple-300">Home Team</div>
                  </div>
                </motion.div>
              </CoolMode>

              {/* VS / Score Center */}
              <div className="text-center">
                {match.status === 'live' && match.stats ? (
                  <motion.div 
                    className="space-y-2"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300,
                      delay: 0.4 
                    }}
                  >
                    <div className="flex items-center justify-center space-x-4">
                      <motion.span 
                        className="text-4xl font-bold text-blue-400"
                        animate={{ 
                          textShadow: [
                            "0 0 10px rgba(59, 130, 246, 0.5)",
                            "0 0 20px rgba(59, 130, 246, 0.8)",
                            "0 0 10px rgba(59, 130, 246, 0.5)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {match.stats.homeScore}
                      </motion.span>
                      
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Flame className="w-6 h-6 text-orange-400" />
                      </motion.div>
                      
                      <motion.span 
                        className="text-4xl font-bold text-red-400"
                        animate={{ 
                          textShadow: [
                            "0 0 10px rgba(239, 68, 68, 0.5)",
                            "0 0 20px rgba(239, 68, 68, 0.8)",
                            "0 0 10px rgba(239, 68, 68, 0.5)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      >
                        {match.stats.awayScore}
                      </motion.span>
                    </div>
                    
                    <div className="text-xs text-purple-300">Live Score</div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="space-y-2"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="text-3xl font-bold text-purple-300">VS</div>
                    <div className="text-xs text-purple-400">Battle Begins</div>
                  </motion.div>
                )}
              </div>

              {/* Away Team */}
              <CoolMode options={{ particle: "circle" }}>
                <motion.div 
                  className="text-center space-y-3 group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative">
                    <motion.div 
                      className="w-20 h-20 mx-auto bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-red-300/30"
                      whileHover={{ 
                        boxShadow: "0 0 30px rgba(239, 68, 68, 0.6)",
                        scale: 1.1
                      }}
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(239, 68, 68, 0.3)",
                          "0 0 30px rgba(239, 68, 68, 0.5)",
                          "0 0 20px rgba(239, 68, 68, 0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      {match.awayTeam.abbreviation}
                    </motion.div>
                    
                    {/* Power Level Indicator */}
                    <motion.div 
                      className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Star className="w-3 h-3 text-yellow-800" />
                    </motion.div>
                  </div>
                  
                  <div>
                    <div className="font-bold text-white text-sm">{match.awayTeam.name}</div>
                    <div className="text-xs text-purple-300">Away Team</div>
                  </div>
                </motion.div>
              </CoolMode>
            </div>
          </div>

          {/* Battle Stats */}
          {match.status === 'live' && match.stats && (
            <motion.div 
              className="bg-black/30 rounded-xl p-4 border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Activity className="w-5 h-5 text-purple-400" />
                <span className="text-purple-200 font-medium">Battle Stats</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{match.stats.homeShots}</div>
                  <div className="text-xs text-blue-300">Attacks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{match.stats.awayShots}</div>
                  <div className="text-xs text-red-300">Attacks</div>
                </div>
              </div>
              
              {/* Possession Battle */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-purple-300 mb-1">
                  <span>Control</span>
                  <span>{match.stats.homePossession}% - {match.stats.awayPossession}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-500 to-red-500"
                    initial={{ width: "50%" }}
                    animate={{ width: `${match.stats.homePossession}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Venue */}
          {match.venue && (
            <motion.div 
              className="flex items-center justify-center space-x-2 text-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{match.venue}</span>
            </motion.div>
          )}

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          >
            <CoolMode options={{ 
              particle: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Soccer%20Ball.png"
            }}>
              <PulsatingButton 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none shadow-lg"
                pulseColor="#a855f7"
                duration="2s"
              >
                <motion.span 
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Flame className="w-5 h-5" />
                  <span className="font-bold">Enter Battle Arena</span>
                </motion.span>
              </PulsatingButton>
            </CoolMode>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCardVariant3;
