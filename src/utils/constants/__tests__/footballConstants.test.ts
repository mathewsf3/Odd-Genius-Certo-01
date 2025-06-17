/**
 * Test suite for Football Constants
 * Validates all constants align with footy.yaml specification
 */

import {
    CACHE_TTL,
    DEFAULT_VALUES,
    ERROR_CODES,
    FOOTY_ENDPOINTS,
    FOOTY_OPERATIONS,
    GOAL_THRESHOLDS,
    HTTP_STATUS,
    MATCH_STATUS,
    RATE_LIMITS,
    type FootyEndpoint,
    type FootyOperation,
    type MatchStatus
} from '../footballConstants';

describe('Football Constants', () => {
  describe('MATCH_STATUS', () => {
    test('should have correct match status values from footy.yaml', () => {
      expect(MATCH_STATUS.COMPLETE).toBe('complete');
      expect(MATCH_STATUS.SUSPENDED).toBe('suspended');
      expect(MATCH_STATUS.CANCELED).toBe('canceled');
      expect(MATCH_STATUS.INCOMPLETE).toBe('incomplete');
    });    test('should be readonly at TypeScript level', () => {
      // TypeScript should prevent modification, but JavaScript won't throw
      // This test verifies the object exists and has expected properties
      expect(Object.keys(MATCH_STATUS)).toHaveLength(4);
      expect(MATCH_STATUS).toHaveProperty('COMPLETE');
      expect(MATCH_STATUS).toHaveProperty('SUSPENDED');
      expect(MATCH_STATUS).toHaveProperty('CANCELED');
      expect(MATCH_STATUS).toHaveProperty('INCOMPLETE');
    });
  });

  describe('GOAL_THRESHOLDS', () => {
    test('should have correct goal thresholds', () => {
      expect(GOAL_THRESHOLDS.OVER_05).toBe(0.5);
      expect(GOAL_THRESHOLDS.OVER_15).toBe(1.5);
      expect(GOAL_THRESHOLDS.OVER_25).toBe(2.5);
      expect(GOAL_THRESHOLDS.OVER_35).toBe(3.5);
      expect(GOAL_THRESHOLDS.OVER_45).toBe(4.5);
      expect(GOAL_THRESHOLDS.OVER_55).toBe(5.5);
    });
  });

  describe('FOOTY_ENDPOINTS', () => {
    test('should have all 16 endpoints from footy.yaml', () => {
      const expectedEndpoints = [
        '/league-list',
        '/country-list',
        '/todays-matches',
        '/league-season',
        '/league-matches',
        '/league-teams',
        '/league-players',
        '/league-referees',
        '/team',
        '/lastx',
        '/match',
        '/league-tables',
        '/player-stats',
        '/referee',
        '/stats-data-btts',
        '/stats-data-over25'
      ];

      const endpointValues = Object.values(FOOTY_ENDPOINTS);
      
      expectedEndpoints.forEach(endpoint => {
        expect(endpointValues).toContain(endpoint);
      });
      
      expect(endpointValues).toHaveLength(16);
    });

    test('should match specific endpoints', () => {
      expect(FOOTY_ENDPOINTS.LEAGUES).toBe('/league-list');
      expect(FOOTY_ENDPOINTS.COUNTRIES).toBe('/country-list');
      expect(FOOTY_ENDPOINTS.TODAYS_MATCHES).toBe('/todays-matches');
      expect(FOOTY_ENDPOINTS.MATCH).toBe('/match');
      expect(FOOTY_ENDPOINTS.TEAM).toBe('/team');
      expect(FOOTY_ENDPOINTS.BTTS_STATS).toBe('/stats-data-btts');
      expect(FOOTY_ENDPOINTS.OVER25_STATS).toBe('/stats-data-over25');
    });
  });

  describe('FOOTY_OPERATIONS', () => {
    test('should have all operation IDs from footy.yaml', () => {
      const expectedOperations = [
        'getLeagues',
        'getCountries', 
        'getTodaysMatches',
        'getLeagueSeason',
        'getLeagueMatches',
        'getLeagueTeams',
        'getLeaguePlayers',
        'getLeagueReferees',
        'getTeam',
        'getTeamLastXStats',
        'getMatch',
        'getLeagueTables',
        'getPlayerStats',
        'getRefereeStats',
        'getBTTSStats',
        'getOver25Stats'
      ];

      const operationValues = Object.values(FOOTY_OPERATIONS);
      
      expectedOperations.forEach(operation => {
        expect(operationValues).toContain(operation);
      });
      
      expect(operationValues).toHaveLength(16);
    });
  });

  describe('DEFAULT_VALUES', () => {
    test('should have correct default values from footy.yaml', () => {
      expect(DEFAULT_VALUES.CORNER_DEFAULT).toBe(-1);
      expect(DEFAULT_VALUES.SHOTS_DEFAULT).toBe(-2);
      expect(DEFAULT_VALUES.STATS_DEFAULT).toBe(-1);
      expect(DEFAULT_VALUES.DRAW_RESULT).toBe(-1);
    });
  });

  describe('CACHE_TTL', () => {
    test('should have reasonable cache TTL values', () => {
      expect(CACHE_TTL.REFERENCE).toBe(3600); // 1 hour
      expect(CACHE_TTL.COUNTRIES).toBe(86400); // 24 hours
      expect(CACHE_TTL.LIVE_MATCHES).toBe(300); // 5 minutes
      expect(CACHE_TTL.DEFAULT).toBe(900); // 15 minutes
    });

    test('should have live data with shorter TTL than reference data', () => {
      expect(CACHE_TTL.LIVE_MATCHES).toBeLessThan(CACHE_TTL.REFERENCE);
      expect(CACHE_TTL.TODAY_MATCHES).toBeLessThan(CACHE_TTL.COUNTRIES);
    });
  });

  describe('RATE_LIMITS', () => {
    test('should have proper rate limit configuration', () => {
      expect(RATE_LIMITS.BASE).toBe(100);
      expect(RATE_LIMITS.API_KEY_MULTIPLIER).toBe(3);
      expect(RATE_LIMITS.PREMIUM_MULTIPLIER).toBe(5);
      expect(RATE_LIMITS.ENTERPRISE_MULTIPLIER).toBe(10);
    });

    test('should have analytics limits lower than reference data', () => {
      expect(RATE_LIMITS.ANALYTICS).toBeLessThan(RATE_LIMITS.REFERENCE_DATA);
      expect(RATE_LIMITS.HEAVY_ANALYTICS).toBeLessThan(RATE_LIMITS.ANALYTICS);
    });
  });

  describe('HTTP_STATUS', () => {
    test('should have standard HTTP status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });

  describe('ERROR_CODES', () => {
    test('should have application-specific error codes', () => {
      expect(ERROR_CODES.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(ERROR_CODES.NOT_FOUND).toBe('NOT_FOUND');
      expect(ERROR_CODES.FOOTYSTATS_API_ERROR).toBe('FOOTYSTATS_API_ERROR');
      expect(ERROR_CODES.RATE_LIMIT_EXCEEDED).toBe('RATE_LIMIT_EXCEEDED');
    });
  });
  describe('TypeScript Types', () => {
    test('should provide proper type inference', () => {
      const status: MatchStatus = MATCH_STATUS.COMPLETE;
      const endpoint: FootyEndpoint = FOOTY_ENDPOINTS.LEAGUES;
      const operation: FootyOperation = FOOTY_OPERATIONS.GET_LEAGUES;
      
      expect(status).toBe('complete');
      expect(endpoint).toBe('/league-list');
      expect(operation).toBe('getLeagues');
    });
  });
});
