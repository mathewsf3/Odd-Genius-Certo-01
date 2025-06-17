/**
 * Match Card Variant 1: Neon Glow Card
 * Features: NeonGradientCard, animated beam effects, shimmer buttons
 */

import { motion } from 'framer-motion';
import { Clock, MapPin, TrendingUp } from 'lucide-react';
import React, { useRef } from 'react';
import { AnimatedBeam } from '../ui/animated-beam';
import { NeonGradientCard } from '../ui/neon-gradient-card';
import { ShimmerButton } from '../ui/shimmer-button';

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

interface MatchCardVariant1Props {
  match: Match;
  onClick?: (match: Match) => void;
}

const MatchCardVariant1: React.FC<MatchCardVariant1Props> = ({ match, onClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const homeTeamRef = useRef<HTMLDivElement>(null);
  const awayTeamRef = useRef<HTMLDivElement>(null);
  const vsRef = useRef<HTMLDivElement>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return '#00ff88';
      case 'upcoming': return '#ffaa00';
      case 'finished': return '#ff4444';
      default: return '#888888';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative w-full max-w-lg mx-auto"
    >
      <NeonGradientCard
        borderSize={2}
        borderRadius={16}
        neonColors={{
          firstColor: '#22c55e',
          secondColor: '#10b981'
        }}
        className="p-6 cursor-pointer"
        onClick={() => onClick?.(match)}
      >
        {/* Animated Beam Container */}
        <div ref={containerRef} className="relative mb-4">
          {/* Teams Container */}
          <div className="flex items-center justify-between relative">
            {/* Home Team */}
            <motion.div 
              ref={homeTeamRef}
              className="flex flex-col items-center space-y-2"
              whileHover={{ scale: 1.1 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {match.homeTeam.abbreviation.slice(0, 2)}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {match.homeTeam.name}
              </span>
            </motion.div>

            {/* VS / Score Center */}
            <div ref={vsRef} className="flex flex-col items-center space-y-1">
              {match.status === 'live' && match.stats ? (
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {match.stats.homeScore}
                  </span>
                  <span className="text-lg text-gray-500">-</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {match.stats.awayScore}
                  </span>
                </div>
              ) : (
                <div className="text-lg font-bold text-gray-600 dark:text-gray-400">
                  VS
                </div>
              )}
              
              {/* Live indicator */}
              {match.status === 'live' && (
                <motion.div 
                  className="flex items-center space-x-1"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs font-medium text-red-500">
                    LIVE {match.minute}'
                  </span>
                </motion.div>
              )}
            </div>

            {/* Away Team */}
            <motion.div 
              ref={awayTeamRef}
              className="flex flex-col items-center space-y-2"
              whileHover={{ scale: 1.1 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {match.awayTeam.abbreviation.slice(0, 2)}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {match.awayTeam.name}
              </span>
            </motion.div>
          </div>

          {/* Animated Beams */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={homeTeamRef}
            toRef={vsRef}
            curvature={-20}
            duration={3}
            gradientStartColor="#22c55e"
            gradientStopColor="#10b981"
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={awayTeamRef}
            toRef={vsRef}
            curvature={20}
            duration={3}
            gradientStartColor="#22c55e"
            gradientStopColor="#10b981"
            reverse
          />
        </div>

        {/* Match Info */}
        <div className="space-y-3">
          {/* Time and Venue */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatKickoff(match.kickoff)}</span>
            </div>
            {match.venue && (
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">{match.venue}</span>
              </div>
            )}
          </div>

          {/* Live Stats */}
          {match.status === 'live' && match.stats && (
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{match.stats.homeShots}</div>
                <div className="text-gray-500">Shots</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-600">
                  {match.stats.homePossession}%-{match.stats.awayPossession}%
                </div>
                <div className="text-gray-500">Possession</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{match.stats.awayShots}</div>
                <div className="text-gray-500">Shots</div>
              </div>
            </div>
          )}

          {/* Odds */}
          {match.odds && (
            <div className="flex justify-between text-xs">
              <div className="text-center">
                <div className="font-bold">{match.odds.home}</div>
                <div className="text-gray-500">Home</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{match.odds.draw}</div>
                <div className="text-gray-500">Draw</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{match.odds.away}</div>
                <div className="text-gray-500">Away</div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-4 flex justify-center">
          <ShimmerButton
            className="w-full"
            shimmerColor="#22c55e"
            background="rgba(34, 197, 94, 0.1)"
          >
            <span className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>View Details</span>
            </span>
          </ShimmerButton>
        </div>
      </NeonGradientCard>
    </motion.div>
  );
};

export default MatchCardVariant1;
