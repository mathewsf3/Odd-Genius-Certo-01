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
 * Cache: 60 seconds (INCREASED to reduce API calls due to rate limiting)
 */
router.get('/live', cacheMiddleware(60), (req, res, next) => {
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
 * GET /api/v1/matches/upcoming/all
 * Get ALL upcoming matches in next 48 hours (for dedicated upcoming page)
 * Supports ?hours=48 parameter to customize time range
 * Cache: 5 minutes
 */
router.get('/upcoming/all', cacheMiddleware(300), (req, res, next) => {
  // Force no limit for all upcoming matches
  req.query.limit = undefined;
  req.query.status = 'upcoming';
  matchController.searchMatches(req, res, next);
});

/**
 * GET /api/v1/matches/dashboard
 * ✅ OPTIMIZED: Single API call for all dashboard data
 * Get dashboard data with minimal API calls to avoid rate limiting
 * Cache: 5 minutes
 */
router.get('/dashboard', cacheMiddleware(300), async (req, res) => {
  try {
    logger.info('📊 Getting optimized dashboard data with single API call');

    const { matchAnalysisService } = await import('../../services/MatchAnalysisService');

    // ✅ FIXED: Use complete pagination like the working methods
    const currentTime = Math.floor(Date.now() / 1000);
    const today = new Date().toISOString().split('T')[0];

    // Get ALL today's matches with complete pagination (like getLiveMatches does)
    let allTodayMatches: any[] = [];
    let currentPage = 1;
    let hasMorePages = true;
    const MAX_MATCHES = 500; // Reasonable limit

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

          // Check if there are more pages
          if (pageResponse.pager && currentPage < (pageResponse.pager.max_page || 1)) {
            currentPage++;
          } else {
            hasMorePages = false;
          }
        } else {
          hasMorePages = false;
        }

        // Safety check
        if (currentPage > 10) break;
      } catch (error) {
        logger.warn(`⚠️ Error fetching page ${currentPage}:`, error);
        hasMorePages = false;
      }
    }

    logger.info(`📊 Fetched ${allTodayMatches.length} matches for ${today} across ${currentPage} pages`);

    // Use the fetched matches
    const allMatches = allTodayMatches;

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

    // ✅ FIXED: Calculate REAL totals first, then limit for display
    const allLiveMatches = allMatches.filter(match => {
      const status = match.status?.toLowerCase() || '';
      const matchTime = match.date_unix || 0;
      const timeDiff = currentTime - matchTime;

      // Match is live if:
      // 1. Status is incomplete (ongoing)
      // 2. Match time has passed (started)
      // 3. Not too old (within 4 hours = 14400 seconds)
      return status === 'incomplete' &&
             matchTime <= currentTime &&
             timeDiff >= 0 &&
             timeDiff <= 14400; // 4 hours max for live matches
    });

    // ✅ FIXED: Calculate REAL upcoming matches in next 24h with detailed logging
    let upcomingCount = 0;
    const allUpcomingMatches = allMatches.filter(match => {
      const matchTime = match.date_unix || 0;
      const timeDiff = matchTime - currentTime;
      const isUpcoming = timeDiff > 0 && timeDiff <= (24 * 60 * 60); // Next 24 hours only

      // Debug logging for first few upcoming matches
      if (isUpcoming && upcomingCount < 5) {
        const matchDate = new Date(matchTime * 1000);
        logger.debug(`🔍 Upcoming match found: ${match.home_name} vs ${match.away_name} at ${matchDate.toISOString()}`);
        upcomingCount++;
      }

      return isUpcoming;
    });

    // ✅ Dashboard display: Limit to 6 for layout purposes
    const liveMatches = allLiveMatches.slice(0, 6);
    const upcomingMatches = allUpcomingMatches.slice(0, 6);

    const dashboardData = {
      liveMatches,
      upcomingMatches,
      stats: {
        totalMatches: allMatches.length,
        liveMatches: allLiveMatches.length,        // REAL total live matches
        upcomingMatches: allUpcomingMatches.length // REAL total upcoming matches (24h)
      }
    };

    logger.info(`📊 Dashboard data: ${allLiveMatches.length} total live, ${allUpcomingMatches.length} total upcoming (24h), showing ${liveMatches.length}/${upcomingMatches.length} on dashboard`);
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
router.get('/live/all', cacheMiddleware(60), async (req, res) => {
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
router.get('/upcoming/all', cacheMiddleware(300), async (req, res) => {
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
      14310: 'Copa Nacional'
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

export default router;
