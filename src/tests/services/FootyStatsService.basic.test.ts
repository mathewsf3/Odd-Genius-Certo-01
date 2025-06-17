/**
 * BASIC FOOTYSTATS SERVICE TEST
 * Simple test to verify service instantiation and basic functionality
 */

import { FootyStatsService } from '../../services/FootyStatsService';

describe('🏈 FootyStatsService Basic Tests', () => {
  let service: FootyStatsService;

  beforeEach(() => {
    service = new FootyStatsService();
  });

  afterEach(async () => {
    await service.shutdown();
  });

  it('should instantiate the service', () => {
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(FootyStatsService);
  });

  it('should get countries', async () => {
    const result = await service.getCountries();
    
    expect(result).toBeDefined();
    expect(result.success).toBeDefined();
    expect(result.metadata).toBeDefined();
    
    console.log('Countries result:', {
      success: result.success,
      dataLength: result.data?.length,
      error: result.error
    });
  }, 30000);

  it('should get leagues', async () => {
    const result = await service.getLeagues();

    expect(result).toBeDefined();
    expect(result.success).toBeDefined();
    expect(result.metadata).toBeDefined();

    console.log('Leagues result:', {
      success: result.success,
      dataLength: result.data?.length,
      error: result.error
    });
  }, 30000);

  it('should test league season with a real season ID', async () => {
    // First get leagues to find a real season ID
    const leaguesResult = await service.getLeagues({ chosenOnly: true });

    if (leaguesResult.success && leaguesResult.data && leaguesResult.data.length > 0) {
      const firstLeague = leaguesResult.data[0];
      console.log('Testing with league:', firstLeague);

      // Check if league has seasons
      if (firstLeague.season && firstLeague.season.length > 0) {
        const firstSeason = firstLeague.season[0];
        console.log('Testing with season ID:', firstSeason.id);

        // Try to get season data
        const seasonResult = await service.getLeagueSeason(firstSeason.id);

        expect(seasonResult).toBeDefined();
        expect(seasonResult.success).toBeDefined();
        expect(seasonResult.metadata).toBeDefined();

        console.log('Season result:', {
          success: seasonResult.success,
          error: seasonResult.error
        });
      } else {
        console.log('⚠️ League has no seasons available for testing');
      }
    } else {
      console.log('⚠️ No leagues available for season testing');
    }
  }, 30000);

  it('should handle invalid season ID', async () => {
    const result = await service.getLeagueSeason(-1);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid season ID');
  });

  it('should test league teams with a real season ID', async () => {
    // First get leagues to find a real season ID
    const leaguesResult = await service.getLeagues({ chosenOnly: true });

    if (leaguesResult.success && leaguesResult.data && leaguesResult.data.length > 0) {
      const firstLeague = leaguesResult.data[0];

      if (firstLeague.season && firstLeague.season.length > 0) {
        const firstSeason = firstLeague.season[0];
        console.log('Testing league teams with season ID:', firstSeason.id);

        const teamsResult = await service.getLeagueTeams(firstSeason.id);

        expect(teamsResult).toBeDefined();
        expect(teamsResult.success).toBeDefined();
        expect(teamsResult.metadata).toBeDefined();

        console.log('League teams result:', {
          success: teamsResult.success,
          dataLength: teamsResult.data?.length,
          error: teamsResult.error
        });
      }
    }
  }, 30000);

  it('should test league players with a real season ID', async () => {
    // First get leagues to find a real season ID
    const leaguesResult = await service.getLeagues({ chosenOnly: true });

    if (leaguesResult.success && leaguesResult.data && leaguesResult.data.length > 0) {
      const firstLeague = leaguesResult.data[0];

      if (firstLeague.season && firstLeague.season.length > 0) {
        const firstSeason = firstLeague.season[0];
        console.log('Testing league players with season ID:', firstSeason.id);

        const playersResult = await service.getLeaguePlayers(firstSeason.id);

        expect(playersResult).toBeDefined();
        expect(playersResult.success).toBeDefined();
        expect(playersResult.metadata).toBeDefined();

        console.log('League players result:', {
          success: playersResult.success,
          dataLength: playersResult.data?.length,
          error: playersResult.error
        });
      }
    }
  }, 30000);
});
