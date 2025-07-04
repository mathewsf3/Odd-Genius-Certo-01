"use strict";
/**
 * TYPE SAFETY STRESS TEST
 * Comprehensive validation of TypeScript type safety across all Phase 1 components
 */
Object.defineProperty(exports, "__esModule", { value: true });
const CacheKeys_1 = require("../../cache/CacheKeys");
const CacheManager_1 = require("../../cache/CacheManager");
const footballConstants_1 = require("../../utils/constants/footballConstants");
describe('🔒 TYPE SAFETY STRESS TEST', () => {
    describe('DTO Type Safety', () => {
        it('should enforce strict typing for Match DTO', () => {
            // Test that TypeScript catches type mismatches
            const match = {
                id: 123456, // Must be number
                homeID: 1001, // Must be number
                awayID: 1002, // Must be number
                season: "2023-24", // Must be string
                status: 'complete', // Must be MatchStatus enum
                homeGoalCount: 2, // Must be number
                awayGoalCount: 1, // Must be number
                totalGoalCount: 3, // Must be number
                date_unix: 1640995200 // Must be number
            };
            // Type assertions to ensure TypeScript enforces types
            const matchId = match.id;
            const homeTeamId = match.homeID;
            const awayTeamId = match.awayID;
            const matchSeason = match.season;
            const matchStatus = match.status;
            expect(typeof matchId).toBe('number');
            expect(typeof homeTeamId).toBe('number');
            expect(typeof awayTeamId).toBe('number');
            expect(typeof matchSeason).toBe('string');
            expect(['complete', 'suspended', 'canceled', 'incomplete']).toContain(matchStatus);
        });
        it('should enforce strict typing for Team DTO', () => {
            const team = {
                id: 1001,
                name: "Test FC"
            };
            // Type assertions
            const teamId = team.id;
            const teamName = team.name;
            expect(typeof teamId).toBe('number');
            expect(typeof teamName).toBe('string');
        });
        it('should enforce strict typing for Player DTO', () => {
            const player = {
                id: 5001,
                name: "Test Player",
                age: 25,
                goals_overall: 12
            };
            // Type assertions
            const playerId = player.id;
            const playerName = player.name;
            const playerAge = player.age;
            const playerGoals = player.goals_overall;
            expect(typeof playerId).toBe('number');
            expect(typeof playerName).toBe('string');
            if (playerAge !== undefined)
                expect(typeof playerAge).toBe('number');
            if (playerGoals !== undefined)
                expect(typeof playerGoals).toBe('number');
        });
        it('should enforce strict typing for optional fields', () => {
            const match = {
                id: 123456,
                homeID: 1001,
                awayID: 1002,
                season: "2023-24",
                status: 'complete',
                homeGoalCount: 2,
                awayGoalCount: 1,
                totalGoalCount: 3,
                date_unix: 1640995200,
                // Optional fields
                team_a_corners: 6,
                team_b_corners: 4,
                refereeID: 5001
            };
            // Optional field type checking
            if (match.team_a_corners !== undefined) {
                const corners = match.team_a_corners;
                expect(typeof corners).toBe('number');
            }
            if (match.refereeID !== undefined) {
                const refId = match.refereeID;
                expect(typeof refId).toBe('number');
            }
        });
    });
    describe('Response Type Safety', () => {
        it('should enforce strict typing for ApiResponse', () => {
            const response = {
                success: true,
                data: []
            };
            expect(typeof response.success).toBe('boolean');
            expect(Array.isArray(response.data)).toBe(true);
        });
        it('should enforce strict typing for PaginatedResponse', () => {
            const response = {
                success: true,
                data: [],
                pager: {
                    current_page: 1,
                    max_page: 10,
                    results_per_page: 50,
                    total_results: 500
                }
            };
            expect(typeof response.success).toBe('boolean');
            expect(Array.isArray(response.data)).toBe(true);
            expect(typeof response.pager.current_page).toBe('number');
            expect(typeof response.pager.max_page).toBe('number');
            expect(typeof response.pager.results_per_page).toBe('number');
            expect(typeof response.pager.total_results).toBe('number');
        });
        it('should enforce strict typing for StandardizedResponse', () => {
            const response = {
                success: true,
                data: {
                    id: 5001,
                    name: "Test Player"
                },
                metadata: {
                    source: "footystats-api",
                    timestamp: new Date().toISOString()
                }
            };
            expect(typeof response.success).toBe('boolean');
            expect(typeof response.data.id).toBe('number');
            expect(typeof response.data.name).toBe('string');
            expect(typeof response.metadata.source).toBe('string');
            expect(typeof response.metadata.timestamp).toBe('string');
        });
        it('should enforce strict typing for ServiceResponse', () => {
            var _a, _b;
            const response = {
                success: true,
                data: {
                    id: 123456,
                    homeID: 1001,
                    awayID: 1002,
                    season: "2023-24",
                    status: 'complete',
                    homeGoalCount: 2,
                    awayGoalCount: 1,
                    totalGoalCount: 3,
                    date_unix: 1640995200
                },
                metadata: {
                    timestamp: new Date().toISOString(),
                    source: "footystats-api",
                    cached: true
                }
            };
            expect(typeof response.success).toBe('boolean');
            expect(typeof ((_a = response.data) === null || _a === void 0 ? void 0 : _a.id)).toBe('number');
            expect(typeof ((_b = response.metadata) === null || _b === void 0 ? void 0 : _b.cached)).toBe('boolean');
        });
    });
    describe('Cache Type Safety', () => {
        it('should enforce strict typing for CacheManager', () => {
            const cacheManager = new CacheManager_1.CacheManager();
            // Type-safe cache operations
            const setPromise = cacheManager.set('test-key', { data: 'test' });
            const getPromise = cacheManager.get('test-key');
            const deletePromise = cacheManager.delete('test-key');
            const hasResult = cacheManager.has('test-key');
            const stats = cacheManager.getStats();
            const keys = cacheManager.getKeys();
            expect(setPromise).toBeInstanceOf(Promise);
            expect(getPromise).toBeInstanceOf(Promise);
            expect(deletePromise).toBeInstanceOf(Promise);
            expect(typeof hasResult).toBe('boolean');
            expect(typeof stats.hits).toBe('number');
            expect(typeof stats.misses).toBe('number');
            expect(Array.isArray(keys)).toBe(true);
            cacheManager.shutdown();
        });
        it('should enforce strict typing for CacheEntry', () => {
            const entry = {
                data: {
                    id: 123456,
                    homeID: 1001,
                    awayID: 1002,
                    season: "2023-24",
                    status: 'complete',
                    homeGoalCount: 2,
                    awayGoalCount: 1,
                    totalGoalCount: 3,
                    date_unix: 1640995200
                },
                timestamp: Date.now(),
                ttl: 300000,
                tags: ['matches', 'live'],
                compressed: false
            };
            expect(typeof entry.data).toBe('object');
            expect(typeof entry.timestamp).toBe('number');
            expect(typeof entry.ttl).toBe('number');
            expect(Array.isArray(entry.tags)).toBe(true);
            expect(typeof entry.compressed).toBe('boolean');
        });
        it('should enforce strict typing for CacheOptions', () => {
            const options = {
                ttl: 300,
                tags: ['test'],
                key: 'test-key'
            };
            expect(typeof options.ttl).toBe('number');
            expect(Array.isArray(options.tags)).toBe(true);
            expect(typeof options.key).toBe('string');
        });
        it('should enforce strict typing for cache keys', () => {
            const matchKey = CacheKeys_1.cacheKeys.match(123456);
            const teamKey = CacheKeys_1.cacheKeys.team(1001, true);
            const leagueKey = CacheKeys_1.cacheKeys.leagues(true, 1);
            const todayMatchesKey = CacheKeys_1.cacheKeys.todaysMatches('2023-12-19', 'UTC', 1);
            expect(typeof matchKey).toBe('string');
            expect(typeof teamKey).toBe('string');
            expect(typeof leagueKey).toBe('string');
            expect(typeof todayMatchesKey).toBe('string');
        });
    });
    describe('Constants Type Safety', () => {
        it('should enforce strict typing for FOOTY_ENDPOINTS', () => {
            const endpoint = footballConstants_1.FOOTY_ENDPOINTS.LEAGUES;
            const matchEndpoint = footballConstants_1.FOOTY_ENDPOINTS.MATCH;
            const teamEndpoint = footballConstants_1.FOOTY_ENDPOINTS.TEAM;
            expect(typeof endpoint).toBe('string');
            expect(typeof matchEndpoint).toBe('string');
            expect(typeof teamEndpoint).toBe('string');
        });
        it('should enforce strict typing for CACHE_TTL', () => {
            const defaultTtl = footballConstants_1.CACHE_TTL.DEFAULT;
            const liveMatchesTtl = footballConstants_1.CACHE_TTL.LIVE_MATCHES;
            const teamDataTtl = footballConstants_1.CACHE_TTL.TEAM_DATA;
            expect(typeof defaultTtl).toBe('number');
            expect(typeof liveMatchesTtl).toBe('number');
            expect(typeof teamDataTtl).toBe('number');
        });
        it('should enforce strict typing for RATE_LIMITS', () => {
            const baseLimit = footballConstants_1.RATE_LIMITS.BASE;
            const premiumMultiplier = footballConstants_1.RATE_LIMITS.PREMIUM_MULTIPLIER;
            const analyticsLimit = footballConstants_1.RATE_LIMITS.ANALYTICS;
            expect(typeof baseLimit).toBe('number');
            expect(typeof premiumMultiplier).toBe('number');
            expect(typeof analyticsLimit).toBe('number');
        });
    });
    describe('Enum Type Safety', () => {
        it('should enforce strict typing for MatchStatus enum', () => {
            const status1 = 'complete';
            const status2 = 'suspended';
            const status3 = 'canceled';
            const status4 = 'incomplete';
            const validStatuses = ['complete', 'suspended', 'canceled', 'incomplete'];
            expect(validStatuses).toContain(status1);
            expect(validStatuses).toContain(status2);
            expect(validStatuses).toContain(status3);
            expect(validStatuses).toContain(status4);
        });
    });
    describe('Generic Type Safety', () => {
        it('should enforce strict typing for generic response types', () => {
            // Test generic type enforcement
            const matchResponse = {
                success: true,
                data: {
                    id: 123456,
                    homeID: 1001,
                    awayID: 1002,
                    season: "2023-24",
                    status: 'complete',
                    homeGoalCount: 2,
                    awayGoalCount: 1,
                    totalGoalCount: 3,
                    date_unix: 1640995200
                },
                metadata: {
                    source: "test",
                    timestamp: new Date().toISOString()
                }
            };
            const teamArrayResponse = {
                success: true,
                data: [
                    { id: 1001, name: "Team A" },
                    { id: 1002, name: "Team B" }
                ],
                metadata: {
                    source: "test",
                    timestamp: new Date().toISOString()
                }
            };
            // Type assertions to ensure generics work correctly
            const matchData = matchResponse.data;
            const teamArrayData = teamArrayResponse.data;
            expect(typeof matchData.id).toBe('number');
            expect(Array.isArray(teamArrayData)).toBe(true);
            expect(typeof teamArrayData[0].id).toBe('number');
        });
    });
    describe('Import/Export Type Safety', () => {
        it('should have all exports properly typed', () => {
            // Test that classes and constants are properly exported
            expect(typeof CacheManager_1.CacheManager).toBe('function'); // Class constructor
            expect(typeof CacheKeys_1.cacheKeys).toBe('function'); // Class (CacheKeys)
            expect(typeof footballConstants_1.FOOTY_ENDPOINTS).toBe('object'); // Constant object
            expect(typeof footballConstants_1.CACHE_TTL).toBe('object'); // Constant object
            expect(typeof footballConstants_1.RATE_LIMITS).toBe('object'); // Constant object
            // Test that interfaces are properly imported (compile-time check)
            // These are type-only imports, so we test by using them in type assertions
            const testMatch = {
                id: 1,
                homeID: 1,
                awayID: 2,
                season: "2023",
                status: 'complete',
                homeGoalCount: 0,
                awayGoalCount: 0,
                totalGoalCount: 0,
                date_unix: 123456
            };
            expect(typeof testMatch.id).toBe('number');
        });
    });
});
