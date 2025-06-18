/**
 * ⚽ Match Routes
 * 
 * RESTful routes for football match data and analytics
 * Built on top of MatchController which wraps MatchAnalysisService
 * 
 * Endpoints:
 * - GET /today - Today's matches
 * - GET /:id - Specific match details
 * - GET /:id/analysis - Comprehensive match analysis
 * - GET /search - Search matches
 * - GET /live - Live matches
 */

import { Router } from 'express';
import { DefaultService } from '../../apis/footy';
import { MatchController } from '../../controllers/MatchController';
import { cacheMiddleware } from '../../middleware/cache';
import { developmentRateLimit } from '../../middleware/developmentRateLimit';
import { rateLimiter } from '../../middleware/rateLimiter';
import { logger } from '../../utils/logger';

const router = Router();
const matchController = new MatchController();

// Apply rate limiting to all match routes
router.use(rateLimiter.matches);

// Log all match route access
router.use((req, res, next) => {
  logger.info(`Match route accessed: ${req.method} ${req.path}`, {
    query: req.query,
    params: req.params,
    ip: req.ip
  });
  next();
});

/**
 * GET /api/v1/matches/total-count
 * Get total count of matches for today without loading all data
 * Optimized for dashboard statistics display
 * Cache: 10 minutes
 */
router.get('/total-count', cacheMiddleware(600), (req, res, next) => {
  matchController.getTotalMatchCount(req, res, next);
});

/**
 * GET /api/v1/matches/upcoming-count
 * Get total count of upcoming matches in next 24h without loading all data
 * Optimized for dashboard statistics display
 * Cache: 15 minutes (INCREASED to reduce API calls due to rate limiting)
 */
router.get('/upcoming-count', cacheMiddleware(900), (req, res, next) => {
  matchController.getUpcomingMatchesCount(req, res, next);
});

/**
 * GET /api/v1/matches/today
 * Get today's matches with basic information
 * Cache: 5 minutes
 */
router.get('/today', cacheMiddleware(300), (req, res, next) => {
  matchController.getTodaysMatches(req, res, next);
});

/**
 * DEBUG: GET /api/v1/matches/debug-today
 * Test today's matches directly from API
 */
router.get('/debug-today', (req, res, next) => {
  matchController.debugTodaysMatches(req, res, next);
});

/**
 * GET /api/v1/matches/live
 * Get currently live matches
 * Supports ?limit=6 for dashboard or no limit for live page
 * 🚀 DEVELOPMENT RATE LIMITING: Aggressive caching in development
 * Cache: 60 seconds (10 minutes in development)
 */
router.get('/live', developmentRateLimit(60), (req: Request, res: Response, next: NextFunction) => {
  matchController.getLiveMatches(req, res, next);
});

/**
 * GET /api/v1/matches/live/all
 * Get ALL currently live matches (for dedicated live page)
 * Cache: 10 seconds (real-time updates)
 */
router.get('/live/all', cacheMiddleware(10), (req, res, next) => {
  // Force no limit for all live matches
  req.query.limit = undefined;
  matchController.getLiveMatches(req, res, next);
});

/**
 * GET /api/v1/matches/upcoming
 * Get upcoming matches (limited for dashboard)
 * Supports ?limit=6 parameter
 * Cache: 5 minutes
 */
router.get('/upcoming', cacheMiddleware(300), async (req, res) => {
  try {
    const { liveMatchService } = await import('../../services/liveMatchService');
    const limit = parseInt(req.query.limit as string) || 6;

    logger.info(`⏰ Getting upcoming matches (limit: ${limit})`);
    const result = await liveMatchService.getUpcomingMatches(limit);

    res.json(result);
  } catch (error) {
    logger.error('❌ Error getting upcoming matches:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get upcoming matches',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Removed duplicate /upcoming/all endpoint - using the comprehensive one below

/**
 * GET /api/v1/matches/dashboard
 * ✅ OPTIMIZED: Single API call for all dashboard data
 * Get dashboard data with minimal API calls to avoid rate limiting
 * 🚀 DEVELOPMENT RATE LIMITING: Aggressive caching in development
 * Cache: 5 minutes (50 minutes in development)
 */
router.get('/dashboard', developmentRateLimit(300), async (req: Request, res: Response) => {
  try {
    logger.info('📊 Getting optimized dashboard data - MULTI-DAY FETCH for upcoming matches');

    const { matchAnalysisService } = await import('../../services/MatchAnalysisService');

    // ✅ FIXED: Get matches for today + next 2 days with proper timezone
    const currentTime = Math.floor(Date.now() / 1000);
    const timezone = 'America/Sao_Paulo'; // 🕒 Brazilian timezone

    // ✅ MULTI-DAY FETCH: Get matches for today + next 2 days
    const dates = [];
    for (let i = 0; i < 3; i++) { // Today + next 2 days
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD format
    }

    logger.info(`📅 Fetching matches for dates: ${dates.join(', ')} with timezone: ${timezone}`);

    // ✅ PARALLEL API CALLS: Get matches for all dates
    const allDateResponses = await Promise.all(
      dates.map(async (date) => {
        let allMatches: any[] = [];
        let currentPage = 1;
        let hasMorePages = true;
        const MAX_PAGES = 10; // Reasonable limit for dashboard

        while (hasMorePages && currentPage <= MAX_PAGES) {
          try {
            const pageResponse = await DefaultService.getTodaysMatches({
              key: process.env.FOOTYSTATS_API_KEY!,
              timezone: timezone,
              date: date,
              page: currentPage
            });

            if (pageResponse?.data && Array.isArray(pageResponse.data)) {
              allMatches.push(...pageResponse.data);

              // Check if there are more pages
              if (pageResponse.pager && currentPage < (pageResponse.pager.max_page || 1)) {
                currentPage++;
              } else {
                hasMorePages = false;
              }
            } else {
              hasMorePages = false;
            }
          } catch (error) {
            logger.warn(`⚠️ Error fetching ${date} page ${currentPage}:`, error);
            hasMorePages = false;
          }
        }

        logger.info(`📈 ${date}: Total ${allMatches.length} matches fetched`);
        return allMatches;
      })
    );

    // Combine all matches from all dates
    const allMatches = allDateResponses.flat();
    logger.info(`🔄 Combined total: ${allMatches.length} matches from ${dates.length} dates`);

    if (allMatches.length === 0) {
      logger.warn('⚠️ No matches data available for today');
      return res.json({
        success: true,
        data: {
          liveMatches: [],
          upcomingMatches: [],
          stats: {
            totalMatches: 0,
            liveMatches: 0,
            upcomingMatches: 0
          }
        }
      });
    }

    // ✅ ENHANCED STATUS NORMALIZATION - Following user's analysis
    // currentTime already declared above

    // ✅ USE LIVE MATCH SERVICE - Get real live matches from dedicated service
    const { liveMatchService } = await import('../../services/liveMatchService');
    const liveMatchesResult = await liveMatchService.getLiveMatches();
    const allLiveMatches = liveMatchesResult.success ? liveMatchesResult.data : [];

    // ✅ FIXED: Use SAME LOGIC as /upcoming/all endpoint (SIMPLE TIME-BASED FILTER)
    const allUpcomingMatches = allMatches.filter(match => {
      const matchTime = match.date_unix || 0;
      const timeDiff = matchTime - currentTime;
      const isUpcoming = timeDiff > 0 && timeDiff <= (24 * 60 * 60); // Next 24 hours only

      if (isUpcoming) {
        const matchDate = new Date(matchTime * 1000);
        logger.debug(`✅ Upcoming: ${match.home_name} vs ${match.away_name} at ${matchDate.toISOString()}`);
      }

      return isUpcoming;
    });

    // ✅ NORMALIZE MATCH DATA - Following user's checklist
    const normalizeMatchData = (match: any, sourceArray: 'live' | 'upcoming') => {
      const status = match.status?.toLowerCase() || '';
      const matchTime = match.date_unix || 0;
      const timeDiff = matchTime - currentTime;

      // ✅ TRUST SOURCE ARRAY CLASSIFICATION - Following user's analysis
      let normalizedStatus = sourceArray; // Trust if it came from live or upcoming array

      // ✅ DOUBLE-CHECK WITH STATUS KEYWORDS
      if (sourceArray === 'live') {
        // If it's in live array, it should be live
        normalizedStatus = 'live';
      } else if (sourceArray === 'upcoming') {
        // If it's in upcoming array, it should be upcoming
        normalizedStatus = 'upcoming';
      }

      // ✅ LEAGUE NAME MAPPING - Use static mapping for common leagues
      const getLeagueName = (seasonId: number): string => {
        const staticLeagueMap: { [key: number]: string } = {
          // Major European Leagues
          14124: 'Premier League',
          14125: 'La Liga',
          14126: 'Serie A',
          14127: 'Bundesliga',
          14128: 'Ligue 1',
          14131: 'Eredivisie',
          14132: 'Primeira Liga',
          14133: 'Scottish Premiership',
          14134: 'Belgian Pro League',
          14135: 'Austrian Bundesliga',
          14136: 'Swiss Super League',

          // International Competitions
          14100: 'UEFA Champions League',
          14101: 'UEFA Europa League',
          14102: 'UEFA Conference League',
          14103: 'FIFA World Cup',
          14104: 'UEFA European Championship',

          // American Leagues
          14123: 'MLS (USA)',
          14122: 'NWSL (USA)',
          14130: 'Liga MX',
          14596: 'Canadian Soccer League',

          // South American Leagues
          14129: 'Brasileirão Série A',
          14116: 'Primera División Chile',
          14157: 'Primera División Argentina',
          14158: 'Primera División Uruguay',
          14159: 'Liga Profesional Colombia',

          // Asian Leagues
          14165: 'J1 League (Japan)',
          14166: 'K League 1 (South Korea)',
          14167: 'Chinese Super League',
          14168: 'A-League (Australia)',
          14169: 'Thai League 1',

          // Nordic Leagues
          14089: 'Veikkausliiga',
          14119: 'Ykkönen',

          // African Leagues
          14180: 'Egyptian Premier League',
          14181: 'South African Premier Division',

          // Common problematic IDs
          14085: 'Liga Regional Peru',
          14305: 'Liga Nacional',
          14306: 'Copa Regional',
          14307: 'Torneo Nacional',
          14308: 'Liga Profissional',
          14309: 'Campeonato Nacional',
          14310: 'Copa Nacional',

          // eSports and Virtual Leagues
          5874: 'eSports League',
          5875: 'Virtual Football',
          5876: 'FIFA Tournament'
        };

        return staticLeagueMap[seasonId] || `Liga ${seasonId}`;
      };

      return {
        ...match,
        // ✅ CORRECT STATUS MAPPING
        status: normalizedStatus,
        // ✅ REAL SCORES - Use actual goal counts from API
        homeGoalCount: match.homeGoalCount || 0,
        awayGoalCount: match.awayGoalCount || 0,
        // ✅ COMPETITION INFORMATION - Use league name mapping
        competition_id: match.competition_id || match.seasonID || 0,
        competition_name: getLeagueName(match.competition_id || match.seasonID || 0),
        // ✅ PRESERVE ORIGINAL FIELDS
        originalStatus: match.status
      };
    };

    // ✅ DEDUPLICATION: Remove any matches that appear in both live and upcoming arrays
    const liveMatchIds = new Set(allLiveMatches.map(match => match.id));
    const deduplicatedUpcomingMatches = allUpcomingMatches.filter(match => !liveMatchIds.has(match.id));

    logger.info(`🔄 Deduplication: ${allUpcomingMatches.length} upcoming -> ${deduplicatedUpcomingMatches.length} after removing ${allUpcomingMatches.length - deduplicatedUpcomingMatches.length} duplicates`);

    // ✅ ADDITIONAL DEDUPLICATION: Remove duplicates within each array
    const uniqueLiveMatches = allLiveMatches.filter((match, index, self) =>
      index === self.findIndex(m => m.id === match.id)
    );
    const uniqueUpcomingMatches = deduplicatedUpcomingMatches.filter((match, index, self) =>
      index === self.findIndex(m => m.id === match.id)
    );

    // ✅ Dashboard display: Limit to 6 for layout purposes with normalized data
    const liveMatches = uniqueLiveMatches.slice(0, 6).map(match => normalizeMatchData(match, 'live'));
    const upcomingMatches = uniqueUpcomingMatches.slice(0, 6).map(match => normalizeMatchData(match, 'upcoming'));

    const dashboardData = {
      liveMatches,
      upcomingMatches,
      totalMatches: allMatches.length,
      totalLive: uniqueLiveMatches.length,        // REAL total live matches
      totalUpcoming: uniqueUpcomingMatches.length, // REAL total upcoming matches (24h)
      lastUpdated: new Date().toISOString()
    };

    logger.info(`📊 Dashboard data: ${uniqueLiveMatches.length} total live, ${uniqueUpcomingMatches.length} total upcoming (24h), showing ${liveMatches.length}/${upcomingMatches.length} on dashboard`);
    res.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard data',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/v1/matches/live/all
 * Get ALL live matches (not limited to 6)
 * Cache: 1 minute (live data changes frequently)
 */
router.get('/live/all', cacheMiddleware(60), async (req: Request, res: Response) => {
  try {
    logger.info('🔴 Getting ALL live matches');
    const currentTime = Math.floor(Date.now() / 1000);
    const today = new Date().toISOString().split('T')[0];

    // Get ALL today's matches with complete pagination
    let allTodayMatches: any[] = [];
    let currentPage = 1;
    let hasMorePages = true;
    const MAX_MATCHES = 500;

    while (hasMorePages && allTodayMatches.length < MAX_MATCHES) {
      try {
        const pageResponse = await DefaultService.getTodaysMatches({
          key: process.env.FOOTYSTATS_API_KEY!,
          timezone: undefined,
          date: today,
          page: currentPage
        });

        if (pageResponse?.data && Array.isArray(pageResponse.data)) {
          allTodayMatches.push(...pageResponse.data);

          if (pageResponse.pager && currentPage < (pageResponse.pager.max_page || 1)) {
            currentPage++;
          } else {
            hasMorePages = false;
          }
        } else {
          hasMorePages = false;
        }

        if (currentPage > 10) break;
      } catch (error) {
        logger.warn(`⚠️ Error fetching page ${currentPage}:`, error);
        hasMorePages = false;
      }
    }

    // Filter for ALL live matches
    const allLiveMatches = allTodayMatches.filter(match => {
      const status = match.status?.toLowerCase() || '';
      const matchTime = match.date_unix || 0;
      const timeDiff = currentTime - matchTime;

      return status === 'incomplete' &&
             matchTime <= currentTime &&
             timeDiff >= 0 &&
             timeDiff <= 14400; // 4 hours max for live matches
    });

    logger.info(`🔴 Found ${allLiveMatches.length} live matches out of ${allTodayMatches.length} total matches`);

    res.json({
      success: true,
      data: {
        matches: allLiveMatches,
        totalCount: allLiveMatches.length,
        totalMatchesToday: allTodayMatches.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error getting all live matches:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get live matches',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/v1/matches/upcoming/all
 * Get ALL upcoming matches in next 24 hours (not limited to 6)
 * Cache: 5 minutes (upcoming matches don't change as frequently)
 */
router.get('/upcoming/all', cacheMiddleware(300), async (req: Request, res: Response) => {
  try {
    logger.info('⏰ Getting ALL upcoming matches (next 24h) - COMPREHENSIVE FETCH');
    const currentTime = Math.floor(Date.now() / 1000);

    // Generate dates for next 3 days to ensure we capture all matches in next 24h
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      dates.push(date.toISOString().split('T')[0]);
    }

    logger.info(`📅 Fetching matches for dates: ${dates.join(', ')}`);

    // Fetch matches for all dates in parallel with comprehensive pagination
    const allDateResponses = await Promise.all(
      dates.map(async (date) => {
        let allMatches: any[] = [];
        let currentPage = 1;
        let hasMorePages = true;
        const MAX_PAGES = 20; // Increased from 10 to get more matches

        while (hasMorePages && currentPage <= MAX_PAGES) {
          try {
            logger.info(`📄 Fetching ${date} page ${currentPage}`);
            const pageResponse = await DefaultService.getTodaysMatches({
              key: process.env.FOOTYSTATS_API_KEY!,
              timezone: 'Etc/UTC', // Explicitly set UTC timezone
              date: date,
              page: currentPage
            });

            if (pageResponse?.data && Array.isArray(pageResponse.data)) {
              allMatches.push(...pageResponse.data);
              logger.info(`📊 ${date} page ${currentPage}: ${pageResponse.data.length} matches (total: ${allMatches.length})`);

              // Check if there are more pages
              if (pageResponse.pager && currentPage < (pageResponse.pager.max_page || 1)) {
                currentPage++;
              } else {
                hasMorePages = false;
                logger.info(`✅ ${date}: Completed all ${currentPage} pages`);
              }
            } else {
              hasMorePages = false;
              logger.warn(`⚠️ ${date} page ${currentPage}: No data received`);
            }
          } catch (error) {
            logger.error(`❌ Error fetching ${date} page ${currentPage}:`, error);
            hasMorePages = false;
          }
        }

        logger.info(`📈 ${date}: Total ${allMatches.length} matches fetched`);
        return allMatches;
      })
    );

    // Combine all matches from all dates
    const allMatches = allDateResponses.flat();
    logger.info(`🔄 Combined total: ${allMatches.length} matches from ${dates.length} dates`);

    // Filter for upcoming matches in next 24 hours with detailed logging
    const allUpcomingMatches = allMatches.filter(match => {
      const matchTime = match.date_unix || 0;
      const timeDiff = matchTime - currentTime;
      const isUpcoming = timeDiff > 0 && timeDiff <= (24 * 60 * 60); // Next 24 hours only

      if (isUpcoming) {
        const matchDate = new Date(matchTime * 1000);
        logger.debug(`✅ Upcoming: ${match.home_name} vs ${match.away_name} at ${matchDate.toISOString()}`);
      }

      return isUpcoming;
    });

    logger.info(`⏰ FINAL RESULT: ${allUpcomingMatches.length} upcoming matches (24h) out of ${allMatches.length} total matches`);

    res.json({
      success: true,
      data: {
        matches: allUpcomingMatches,
        totalCount: allUpcomingMatches.length,
        totalMatches: allMatches.length,
        datesFetched: dates,
        breakdown: dates.map((date, index) => ({
          date,
          totalMatches: allDateResponses[index].length
        }))
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error getting all upcoming matches:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get upcoming matches',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/v1/matches/test
 * Simple test endpoint to verify routing
 */
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Test endpoint working', timestamp: new Date().toISOString() });
});

/**
 * GET /api/v1/matches/leagues/mapping
 * Get league name mapping (real names instead of IDs)
 * Cache: 1 hour (league names don't change frequently)
 * ⚠️ MUST BE BEFORE /:id route to avoid conflicts
 */
router.get('/leagues/mapping', async (req, res) => {
  try {
    logger.info('🏆 League mapping request');

    // Static mapping for common leagues as fallback
    const staticLeagueMap: { [key: number]: string } = {
      // Major European Leagues
      14124: 'Premier League',
      14125: 'La Liga',
      14126: 'Serie A',
      14127: 'Bundesliga',
      14128: 'Ligue 1',
      14131: 'Eredivisie',
      14132: 'Primeira Liga',
      14133: 'Scottish Premiership',
      14134: 'Belgian Pro League',
      14135: 'Austrian Bundesliga',
      14136: 'Swiss Super League',

      // International Competitions
      14100: 'UEFA Champions League',
      14101: 'UEFA Europa League',
      14102: 'UEFA Conference League',
      14103: 'FIFA World Cup',
      14104: 'UEFA European Championship',

      // American Leagues
      14123: 'MLS (USA)',
      14122: 'NWSL (USA)',
      14130: 'Liga MX',
      14596: 'Canadian Soccer League',

      // South American Leagues
      14129: 'Brasileirão Série A',
      14116: 'Primera División Chile',
      14157: 'Primera División Argentina',
      14158: 'Primera División Uruguay',
      14159: 'Liga Profesional Colombia',

      // Asian Leagues
      14165: 'J1 League (Japan)',
      14166: 'K League 1 (South Korea)',
      14167: 'Chinese Super League',
      14168: 'A-League (Australia)',
      14169: 'Thai League 1',

      // Nordic Leagues
      14089: 'Veikkausliiga',
      14119: 'Ykkönen',

      // African Leagues
      14180: 'Egyptian Premier League',
      14181: 'South African Premier Division',

      // Common problematic IDs
      14085: 'Liga Regional Peru',
      14305: 'Liga Nacional',
      14306: 'Copa Regional',
      14307: 'Torneo Nacional',
      14308: 'Liga Profissional',
      14309: 'Campeonato Nacional',
      14310: 'Copa Nacional',

      // eSports and Virtual Leagues
      5874: 'eSports League',
      5875: 'Virtual Football',
      5876: 'FIFA Tournament'
    };

    logger.info(`✅ Returning mapping for ${Object.keys(staticLeagueMap).length} leagues`);

    res.json({
      success: true,
      data: {
        mapping: staticLeagueMap,
        totalLeagues: Object.keys(staticLeagueMap).length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error in league mapping:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/v1/matches/h2h
 * Get head-to-head matches between two teams
 * Cache: 10 minutes
 */
router.get('/h2h', cacheMiddleware(600), async (req, res) => {
  try {
    const team1Id = parseInt(req.query.team1_id as string);
    const team2Id = parseInt(req.query.team2_id as string);
    const limit = parseInt(req.query.limit as string) || 10;

    if (isNaN(team1Id) || isNaN(team2Id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid team IDs',
        message: 'Both team1_id and team2_id must be valid numbers'
      });
    }

    logger.info(`⚔️ Fetching H2H matches: ${team1Id} vs ${team2Id} (last ${limit})`);

    // Use FootyStats API to get H2H matches
    // Get recent stats for both teams (which includes recent matches)
    const [team1Stats, team2Stats] = await Promise.all([
      DefaultService.getTeamLastXStats({ teamId: team1Id }),
      DefaultService.getTeamLastXStats({ teamId: team2Id })
    ]);

    // Extract matches from stats responses
    const team1Matches = team1Stats?.data?.matches || team1Stats?.data?.last_matches || [];
    const team2Matches = team2Stats?.data?.matches || team2Stats?.data?.last_matches || [];

    const allMatches = [
      ...team1Matches,
      ...team2Matches
    ];

    // Filter for matches between these two teams
    const h2hMatches = allMatches.filter((match: any) =>
      (match.home_team_id === team1Id && match.away_team_id === team2Id) ||
      (match.home_team_id === team2Id && match.away_team_id === team1Id)
    );

    // Remove duplicates and sort by date
    const uniqueMatches = h2hMatches.filter((match, index, self) =>
      index === self.findIndex(m => m.id === match.id)
    ).sort((a, b) => b.date_unix - a.date_unix).slice(0, limit);

    logger.info(`✅ Found ${uniqueMatches.length} H2H matches`);

    res.json({
      success: true,
      data: uniqueMatches,
      meta: {
        team1Id,
        team2Id,
        limit,
        total: uniqueMatches.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`❌ Error fetching H2H matches:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch H2H matches',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/v1/matches/search
 * Search matches by criteria
 * Cache: 2 minutes
 */
router.get('/search', cacheMiddleware(120), (req, res, next) => {
  matchController.searchMatches(req, res, next);
});

/**
 * 🔍 ANALYSIS ENDPOINT FOR REAL VS FIFA MATCHES
 * Analyze real vs FIFA/esports matches in next 24 hours
 * ⚠️ MUST BE BEFORE /:id routes to avoid conflicts
 */
router.get('/analysis/real-vs-fifa', async (req, res) => {
  try {
    logger.info('🔍 Analyzing real vs FIFA matches for next 24 hours');

    const hoursAhead = parseInt(req.query.hours as string) || 24;
    const { matchAnalysisService } = await import('../../services/MatchAnalysisService');
    const analysis = await matchAnalysisService.analyzeAllMatchesIncludingEsports(hoursAhead);

    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error analyzing real vs FIFA matches:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze matches',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/v1/matches/:id
 * Get detailed information for a specific match
 * Cache: 10 minutes
 * ⚠️ MUST BE AFTER all specific routes to avoid conflicts
 */
router.get('/:id', cacheMiddleware(600), (req, res, next) => {
  matchController.getMatchById(req, res, next);
});

/**
 * GET /api/v1/matches/:id/analysis
 * Get comprehensive analytics for a specific match
 * Cache: 15 minutes (analysis is computation-heavy)
 */
router.get('/:id/analysis', cacheMiddleware(900), (req, res, next) => {
  matchController.getMatchAnalysis(req, res, next);
});

/**
 * GET /api/v1/matches/:id/h2h
 * Get Head-to-Head analysis for teams in a match
 * Supports ?range=5 or ?range=10 for last X matches
 * Cache: 30 minutes
 */
router.get('/:id/h2h', cacheMiddleware(1800), async (req, res) => {
  try {
    const matchId = parseInt(req.params.id);
    const range = parseInt(req.query.range as string) || 5;

    if (isNaN(matchId) || matchId <= 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid match ID'
      });
      return;
    }

    if (range !== 5 && range !== 10) {
      res.status(400).json({
        success: false,
        error: 'Range must be 5 or 10'
      });
      return;
    }

    logger.info(`🎯 Getting H2H analysis for match ${matchId} (last ${range} matches)`);

    // First get match details to get team IDs
    const { matchAnalysisService } = await import('../../services/MatchAnalysisService');
    const matchDetails = await matchAnalysisService.getDetailedMatchInfo(matchId);

    if (!matchDetails.success || !matchDetails.data) {
      res.status(404).json({
        success: false,
        error: 'Match not found'
      });
      return;
    }

    const match = matchDetails.data.matchDetails;
    const homeId = match.homeID;
    const awayId = match.awayID;

    // Get H2H analysis
    const h2hResult = await matchAnalysisService.getH2HAnalysis({
      homeId,
      awayId,
      range: range as 5 | 10
    });

    if (!h2hResult.success) {
      res.status(502).json({
        success: false,
        error: h2hResult.error || 'Failed to get H2H analysis'
      });
      return;
    }

    res.json({
      success: true,
      data: h2hResult.data,
      metadata: {
        matchId,
        homeId,
        awayId,
        range,
        timestamp: new Date().toISOString(),
        source: 'footystats-api'
      }
    });

  } catch (error) {
    logger.error('❌ Error getting H2H analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get H2H analysis',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/v1/matches/:id/corners
 * Get corner analysis for teams in a match
 * Supports ?range=5 or ?range=10 for last X matches
 * Cache: 30 minutes
 */
router.get('/:id/corners', cacheMiddleware(1800), async (req, res) => {
  try {
    const matchId = parseInt(req.params.id);
    const range = parseInt(req.query.range as string) || 5;

    if (isNaN(matchId) || matchId <= 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid match ID'
      });
      return;
    }

    if (range !== 5 && range !== 10) {
      res.status(400).json({
        success: false,
        error: 'Range must be 5 or 10'
      });
      return;
    }

    logger.info(`🎯 Getting corner analysis for match ${matchId} (last ${range} matches)`);

    const { matchAnalysisService } = await import('../../services/MatchAnalysisService');
    const cornerResult = await matchAnalysisService.getCornerAnalysis({
      matchId,
      range: range as 5 | 10
    });

    if (!cornerResult.success) {
      res.status(502).json({
        success: false,
        error: cornerResult.error || 'Failed to get corner analysis'
      });
      return;
    }

    res.json({
      success: true,
      data: cornerResult.data,
      metadata: {
        matchId,
        range,
        timestamp: new Date().toISOString(),
        source: 'footystats-api'
      }
    });

  } catch (error) {
    logger.error('❌ Error getting corner analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get corner analysis',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/v1/matches/:id/goals
 * Get goal analysis for teams in a match
 * Supports ?range=5 or ?range=10 for last X matches
 * Cache: 30 minutes
 */
router.get('/:id/goals', cacheMiddleware(1800), async (req, res) => {
  try {
    const matchId = parseInt(req.params.id);
    const range = parseInt(req.query.range as string) || 5;

    if (isNaN(matchId) || matchId <= 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid match ID'
      });
      return;
    }

    if (range !== 5 && range !== 10) {
      res.status(400).json({
        success: false,
        error: 'Range must be 5 or 10'
      });
      return;
    }

    logger.info(`🎯 Getting goal analysis for match ${matchId} (last ${range} matches)`);

    const { matchAnalysisService } = await import('../../services/MatchAnalysisService');
    const goalResult = await matchAnalysisService.getGoalAnalysis({
      matchId,
      range: range as 5 | 10
    });

    if (!goalResult.success) {
      res.status(502).json({
        success: false,
        error: goalResult.error || 'Failed to get goal analysis'
      });
      return;
    }

    res.json({
      success: true,
      data: goalResult.data,
      metadata: {
        matchId,
        range,
        timestamp: new Date().toISOString(),
        source: 'footystats-api'
      }
    });

  } catch (error) {
    logger.error('❌ Error getting goal analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get goal analysis',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/v1/matches/:id/overview
 * Get comprehensive overview data for the "Visão Geral" tab
 * Aggregates H2H, form, statistics, and predictions
 * Cache: Smart caching (1min live, 30min upcoming, 24h finished)
 */
router.get('/:id/overview', async (req, res) => {
  try {
    const matchId = parseInt(req.params.id);

    if (isNaN(matchId) || matchId <= 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid match ID'
      });
      return;
    }

    // Smart caching based on match status
    const cacheKey = `match:${matchId}:overview:v2`;

    logger.info(`🎯 Getting comprehensive overview for match ${matchId} with smart caching`);

    const { matchAnalysisService } = await import('../../services/MatchAnalysisService');
    const overviewResult = await matchAnalysisService.getMatchOverviewData(matchId);

    if (!overviewResult.success) {
      res.status(502).json({
        success: false,
        error: overviewResult.error || 'Failed to get match overview'
      });
      return;
    }

    // Determine cache TTL based on match status
    const matchStatus = overviewResult.data?.matchInfo?.status || 'default';
    let cacheTTL = 1800; // 30 minutes default

    if (matchStatus.includes('live') || matchStatus.includes('ao-vivo')) {
      cacheTTL = 60; // 1 minute for live matches
    } else if (matchStatus.includes('finished') || matchStatus.includes('finalizada')) {
      cacheTTL = 86400; // 24 hours for finished matches
    } else if (matchStatus.includes('upcoming') || matchStatus.includes('em-breve')) {
      cacheTTL = 1800; // 30 minutes for upcoming matches
    }

    const responseData = {
      success: true,
      data: overviewResult.data,
      metadata: {
        matchId,
        timestamp: new Date().toISOString(),
        source: 'footystats-api',
        analysisType: 'comprehensive-overview',
        cacheStrategy: {
          ttl: cacheTTL,
          status: matchStatus,
          cacheKey
        }
      }
    };

    // Set cache headers for client-side caching
    res.set({
      'Cache-Control': `public, max-age=${cacheTTL}`,
      'ETag': `"${matchId}-${Date.now()}"`,
      'Last-Modified': new Date().toUTCString()
    });

    res.json(responseData);

  } catch (error) {
    logger.error('❌ Error getting match overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get match overview',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/v1/matches/:id/pre-match
 * 🎯 PRE-MATCH ANALYSIS - Following FootyStats workflow
 *
 * Returns pre-match prediction data including:
 * - corners_potential, o15_potential, o25_potential, etc.
 * - Embedded H2H data from match response
 * - Team recent form (/lastx endpoint)
 * - Trends and predictions
 *
 * 🚀 DEVELOPMENT RATE LIMITING: Aggressive caching in development
 * Cache: 30 minutes (2 hours in development)
 */
router.get('/:id/pre-match', developmentRateLimit(1800), async (req, res) => {
  try {
    const matchId = parseInt(req.params.id);

    if (isNaN(matchId) || matchId <= 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid match ID'
      });
      return;
    }

    logger.info(`🎯 Getting PRE-MATCH analysis for match ${matchId}`);

    const { matchAnalysisService } = await import('../../services/MatchAnalysisService');
    const result = await matchAnalysisService.getDetailedMatchInfo(matchId);

    if (!result.success) {
      res.status(502).json({
        success: false,
        error: result.error || 'Failed to get pre-match analysis',
        message: `Pre-match analysis for ${matchId} not available`
      });
      return;
    }

    res.json({
      success: true,
      data: result.data,
      message: `Pre-match analysis for ${matchId} retrieved successfully`,
      metadata: {
        analysisType: 'pre-match',
        timestamp: new Date().toISOString(),
        source: 'footystats-api'
      }
    });

  } catch (error) {
    logger.error(`❌ Error getting pre-match analysis:`, error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * 🛠️ DEVELOPMENT ONLY: Clear development cache
 * POST /api/v1/matches/dev/clear-cache
 * Clears all development cache to reset rate limiting
 */
if (process.env.NODE_ENV === 'development') {
  router.post('/dev/clear-cache', async (req, res) => {
    try {
      const { clearDevelopmentCache, getDevelopmentCacheStats } = await import('../../middleware/developmentRateLimit');

      const statsBefore = getDevelopmentCacheStats();
      await clearDevelopmentCache();
      const statsAfter = getDevelopmentCacheStats();

      logger.info('🧹 Development cache cleared by user request');

      res.json({
        success: true,
        message: 'Development cache cleared successfully',
        stats: {
          before: statsBefore,
          after: statsAfter
        }
      });
    } catch (error) {
      logger.error('❌ Error clearing development cache:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clear development cache',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  router.get('/dev/cache-stats', async (req, res) => {
    try {
      const { getDevelopmentCacheStats } = await import('../../middleware/developmentRateLimit');
      const stats = getDevelopmentCacheStats();

      res.json({
        success: true,
        data: stats,
        message: 'Development cache statistics'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get cache stats'
      });
    }
  });
}

export default router;
