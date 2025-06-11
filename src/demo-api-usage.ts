import { OpenAPI, DefaultService } from './apis/footy';

// Configure the API with your key
OpenAPI.BASE = 'https://api.football-data-api.com';

// Demo function to show API usage with proper TypeScript types
export async function demoFootyStatsAPI() {
  try {
    console.log('🏈 FootyStats API Demo');
    console.log('======================');

    // 1. Get all available countries (API key is automatically included with default value)
    console.log('\n📍 Fetching countries...');
    const countries = await DefaultService.getCountries({});
    console.log(`Found ${countries.data?.length} countries`);
    console.log('First few countries:', countries.data?.slice(0, 3));

    // 2. Get all available leagues
    console.log('\n🏆 Fetching leagues...');
    const leagues = await DefaultService.getLeagues({});
    console.log(`Found ${leagues.data?.length} leagues`);
    console.log('First league:', leagues.data?.[0]);

    // 3. Get today's matches
    console.log('\n⚽ Fetching today\'s matches...');
    const todaysMatches = await DefaultService.getTodaysMatches({});
    console.log(`Found ${todaysMatches.data?.length} matches today`);
    if (todaysMatches.data && todaysMatches.data.length > 0) {
      const match = todaysMatches.data[0];
      console.log('Sample match:', {
        id: match.id,
        homeID: match.homeID,
        awayID: match.awayID,
        status: match.status,
        homeGoalCount: match.homeGoalCount,
        awayGoalCount: match.awayGoalCount
      });
    }

    // 4. Get league season data (example with Premier League 2018/2019 season ID: 1625)
    console.log('\n📊 Fetching league season data...');
    const seasonData = await DefaultService.getLeagueSeason({ seasonId: 1625 });
    console.log('Season data success:', seasonData.success);

    // 5. Get league matches for a specific season
    console.log('\n🗓️ Fetching league matches...');
    const leagueMatches = await DefaultService.getLeagueMatches({
      seasonId: 1625,
      page: 1,
      maxPerPage: 10
    });
    console.log(`Found ${leagueMatches.data?.length} matches for the season`);

    // 6. Get teams in a league season
    console.log('\n👥 Fetching league teams...');
    const leagueTeams = await DefaultService.getLeagueTeams({
      seasonId: 1625,
      page: 1,
      include: 'stats'
    });
    console.log('Teams data:', leagueTeams.pager);

    // 7. Get BTTS stats
    console.log('\n🎯 Fetching BTTS stats...');
    const bttsStats = await DefaultService.getBttsStats({});
    console.log('BTTS stats success:', bttsStats.success);

    // 8. Get Over 2.5 stats
    console.log('\n📈 Fetching Over 2.5 stats...');
    const over25Stats = await DefaultService.getOver25Stats({});
    console.log('Over 2.5 stats success:', over25Stats.success);

    console.log('\n✅ API Demo completed successfully!');

  } catch (error) {
    console.error('❌ API Error:', error);
  }
}

// Example of how to use specific endpoints with proper typing
export async function getLeagueInfo(seasonId: number) {
  try {
    // Get league season info with full typing support
    const seasonInfo = await DefaultService.getLeagueSeason({ seasonId });

    // Get teams with stats
    const teams = await DefaultService.getLeagueTeams({
      seasonId,
      page: 1,
      include: 'stats'
    });

    // Get recent matches
    const matches = await DefaultService.getLeagueMatches({
      seasonId,
      page: 1,
      maxPerPage: 20
    });

    return {
      season: seasonInfo,
      teams: teams,
      recentMatches: matches
    };
  } catch (error) {
    console.error('Error fetching league info:', error);
    throw error;
  }
}

// Example of how to get team-specific data
export async function getTeamAnalysis(teamId: number) {
  try {
    // Get team details with stats
    const teamData = await DefaultService.getTeam({ teamId, include: 'stats' });

    // Get last X matches stats
    const lastXStats = await DefaultService.getTeamLastXStats({ teamId });

    return {
      team: teamData,
      recentForm: lastXStats
    };
  } catch (error) {
    console.error('Error fetching team analysis:', error);
    throw error;
  }
}

// Example of match analysis
export async function getMatchAnalysis(matchId: number) {
  try {
    // Get detailed match data including H2H and odds
    const matchDetails = await DefaultService.getMatch({ matchId });

    return matchDetails;
  } catch (error) {
    console.error('Error fetching match analysis:', error);
    throw error;
  }
}

// Helper function to search leagues by country
export async function getLeaguesByCountry(countryId: number) {
  try {
    const leagues = await DefaultService.getLeagues({ country: countryId });
    return leagues.data || [];
  } catch (error) {
    console.error('Error fetching leagues by country:', error);
    throw error;
  }
}

// If you want to run the demo
if (require.main === module) {
  demoFootyStatsAPI();
}
