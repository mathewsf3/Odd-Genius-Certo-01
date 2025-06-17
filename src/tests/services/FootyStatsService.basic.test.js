"use strict";
/**
 * BASIC FOOTYSTATS SERVICE TEST
 * Simple test to verify service instantiation and basic functionality
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const FootyStatsService_1 = require("../../services/FootyStatsService");
describe('🏈 FootyStatsService Basic Tests', () => {
    let service;
    beforeEach(() => {
        service = new FootyStatsService_1.FootyStatsService();
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield service.shutdown();
    }));
    it('should instantiate the service', () => {
        expect(service).toBeDefined();
        expect(service).toBeInstanceOf(FootyStatsService_1.FootyStatsService);
    });
    it('should get countries', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield service.getCountries();
        expect(result).toBeDefined();
        expect(result.success).toBeDefined();
        expect(result.metadata).toBeDefined();
        console.log('Countries result:', {
            success: result.success,
            dataLength: (_a = result.data) === null || _a === void 0 ? void 0 : _a.length,
            error: result.error
        });
    }), 30000);
    it('should get leagues', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield service.getLeagues();
        expect(result).toBeDefined();
        expect(result.success).toBeDefined();
        expect(result.metadata).toBeDefined();
        console.log('Leagues result:', {
            success: result.success,
            dataLength: (_a = result.data) === null || _a === void 0 ? void 0 : _a.length,
            error: result.error
        });
    }), 30000);
    it('should test league season with a real season ID', () => __awaiter(void 0, void 0, void 0, function* () {
        // First get leagues to find a real season ID
        const leaguesResult = yield service.getLeagues({ chosenOnly: true });
        if (leaguesResult.success && leaguesResult.data && leaguesResult.data.length > 0) {
            const firstLeague = leaguesResult.data[0];
            console.log('Testing with league:', firstLeague);
            // Check if league has seasons
            if (firstLeague.season && firstLeague.season.length > 0) {
                const firstSeason = firstLeague.season[0];
                console.log('Testing with season ID:', firstSeason.id);
                // Try to get season data
                const seasonResult = yield service.getLeagueSeason(firstSeason.id);
                expect(seasonResult).toBeDefined();
                expect(seasonResult.success).toBeDefined();
                expect(seasonResult.metadata).toBeDefined();
                console.log('Season result:', {
                    success: seasonResult.success,
                    error: seasonResult.error
                });
            }
            else {
                console.log('⚠️ League has no seasons available for testing');
            }
        }
        else {
            console.log('⚠️ No leagues available for season testing');
        }
    }), 30000);
    it('should handle invalid season ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield service.getLeagueSeason(-1);
        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid season ID');
    }));
    it('should test league teams with a real season ID', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // First get leagues to find a real season ID
        const leaguesResult = yield service.getLeagues({ chosenOnly: true });
        if (leaguesResult.success && leaguesResult.data && leaguesResult.data.length > 0) {
            const firstLeague = leaguesResult.data[0];
            if (firstLeague.season && firstLeague.season.length > 0) {
                const firstSeason = firstLeague.season[0];
                console.log('Testing league teams with season ID:', firstSeason.id);
                const teamsResult = yield service.getLeagueTeams(firstSeason.id);
                expect(teamsResult).toBeDefined();
                expect(teamsResult.success).toBeDefined();
                expect(teamsResult.metadata).toBeDefined();
                console.log('League teams result:', {
                    success: teamsResult.success,
                    dataLength: (_a = teamsResult.data) === null || _a === void 0 ? void 0 : _a.length,
                    error: teamsResult.error
                });
            }
        }
    }), 30000);
    it('should test league players with a real season ID', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // First get leagues to find a real season ID
        const leaguesResult = yield service.getLeagues({ chosenOnly: true });
        if (leaguesResult.success && leaguesResult.data && leaguesResult.data.length > 0) {
            const firstLeague = leaguesResult.data[0];
            if (firstLeague.season && firstLeague.season.length > 0) {
                const firstSeason = firstLeague.season[0];
                console.log('Testing league players with season ID:', firstSeason.id);
                const playersResult = yield service.getLeaguePlayers(firstSeason.id);
                expect(playersResult).toBeDefined();
                expect(playersResult.success).toBeDefined();
                expect(playersResult.metadata).toBeDefined();
                console.log('League players result:', {
                    success: playersResult.success,
                    dataLength: (_a = playersResult.data) === null || _a === void 0 ? void 0 : _a.length,
                    error: playersResult.error
                });
            }
        }
    }), 30000);
});
