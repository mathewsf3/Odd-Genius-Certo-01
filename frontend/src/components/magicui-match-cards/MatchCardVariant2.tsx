/**
 * Match Card Variant 2: Magic Card with Border Beam
 * Features: MagicCard spotlight effect, BorderBeam animation, rainbow buttons
 */

import { motion } from 'framer-motion';
import { Clock, MapPin, Target, Zap } from 'lucide-react';
import React from 'react';
import { Badge } from '../ui/badge-simple';
import { BorderBeam } from '../ui/border-beam';
import { MagicCard } from '../ui/magic-card';
import { RainbowButton } from '../ui/rainbow-button';

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

interface MatchCardVariant2Props {
  match: Match;
  onClick?: (match: Match) => void;
}

const MatchCardVariant2: React.FC<MatchCardVariant2Props> = ({ match, onClick }) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'live': return 'destructive';
      case 'upcoming': return 'secondary';
      case 'finished': return 'outline';
      default: return 'default';
    }
  };

  const formatKickoff = (kickoff: string) => {
    return new Date(kickoff).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className="relative w-full max-w-lg mx-auto"
    >
      <MagicCard
        className="relative overflow-hidden cursor-pointer border-2"
        gradientSize={300}
        gradientColor="#22c55e20"
        gradientFrom="#22c55e"
        gradientTo="#10b981"
        onClick={() => onClick?.(match)}
      >
        {/* Border Beam Animation */}
        <BorderBeam
          size={200}
          duration={8}
          colorFrom="#22c55e"
          colorTo="#10b981"
        />
        
        <div className="p-6 space-y-4">
          {/* Header with Status */}
          <div className="flex items-center justify-between">
            <Badge variant={getStatusBadgeVariant(match.status)} className="capitalize">
              {match.status === 'live' ? (
                <div className="flex items-center space-x-1">
                  <motion.div 
                    className="w-2 h-2 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span>LIVE {match.minute}'</span>
                </div>
              ) : (
                match.status
              )}
            </Badge>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formatKickoff(match.kickoff)}</span>
            </div>
          </div>

          {/* Teams Section */}
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Home Team */}
            <motion.div 
              className="text-center space-y-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="relative">
                <motion.div 
                  className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {match.homeTeam.abbreviation.slice(0, 2)}
                </motion.div>
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-0"
                  whileHover={{ opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div>
                <div className="font-semibold text-sm">{match.homeTeam.name}</div>
                <div className="text-xs text-muted-foreground">Home</div>
              </div>
            </motion.div>

            {/* Score/VS */}
            <div className="text-center">
              {match.status === 'live' && match.stats ? (
                <motion.div 
                  className="space-y-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <motion.span 
                      className="text-3xl font-bold text-foreground"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      {match.stats.homeScore}
                    </motion.span>
                    <span className="text-xl text-muted-foreground">-</span>
                    <motion.span 
                      className="text-3xl font-bold text-foreground"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      {match.stats.awayScore}
                    </motion.span>
                  </div>
                  <div className="text-xs text-muted-foreground">Final Score</div>
                </motion.div>
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-muted-foreground">VS</div>
                  <div className="text-xs">
                    {match.status === 'upcoming' ? 'Kickoff' : 'Match'}
                  </div>
                </div>
              )}
            </div>

            {/* Away Team */}
            <motion.div 
              className="text-center space-y-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="relative">
                <motion.div 
                  className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                  whileHover={{ rotate: -360 }}
                  transition={{ duration: 0.6 }}
                >
                  {match.awayTeam.abbreviation.slice(0, 2)}
                </motion.div>
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-br from-red-400 to-red-600 rounded-full opacity-0"
                  whileHover={{ opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div>
                <div className="font-semibold text-sm">{match.awayTeam.name}</div>
                <div className="text-xs text-muted-foreground">Away</div>
              </div>
            </motion.div>
          </div>

          {/* Stats Grid */}
          {match.status === 'live' && match.stats && (
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-lg font-bold">{match.stats.homeShots}</span>
                </div>
                <div className="text-xs text-muted-foreground">Home Shots</div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Target className="w-4 h-4 text-red-500" />
                  <span className="text-lg font-bold">{match.stats.awayShots}</span>
                </div>
                <div className="text-xs text-muted-foreground">Away Shots</div>
              </div>
            </motion.div>
          )}

          {/* Betting Odds */}
          {match.odds && (
            <motion.div 
              className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Betting Odds</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="font-bold text-blue-600">{match.odds.home}</div>
                  <div className="text-xs text-muted-foreground">Home</div>
                </div>
                <div>
                  <div className="font-bold text-gray-600">{match.odds.draw}</div>
                  <div className="text-xs text-muted-foreground">Draw</div>
                </div>
                <div>
                  <div className="font-bold text-red-600">{match.odds.away}</div>
                  <div className="text-xs text-muted-foreground">Away</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Venue Info */}
          {match.venue && (
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{match.venue}</span>
            </div>
          )}

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <RainbowButton className="w-full" size="lg">
              <motion.span 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="w-4 h-4" />
                <span>Analyze Match</span>
              </motion.span>
            </RainbowButton>
          </motion.div>
        </div>
      </MagicCard>
    </motion.div>
  );
};

export default MatchCardVariant2;
