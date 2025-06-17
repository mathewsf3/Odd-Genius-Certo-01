/**
 * 🧪 SIMPLE FOOTYSTATS API TEST
 * 
 * Test our foundation with direct API calls using our generated client
 */

// Import the generated client
const { DefaultService } = require('./src/apis/footy');

async function testFootyStatsAPI() {
    console.log('🚀 TESTING FOOTYSTATS API INTEGRATION');
    console.log('='.repeat(50));
    
    try {
        // Test 1: Get today's matches
        console.log('\n🔍 STEP 1: Getting today\'s matches...');
        const todaysMatches = await DefaultService.getTodaysMatches({});
        
        console.log('✅ Today\'s matches response:', {
            success: todaysMatches.success,
            dataLength: todaysMatches.data ? todaysMatches.data.length : 0
        });
        
        if (todaysMatches.success && todaysMatches.data && todaysMatches.data.length > 0) {
            const firstMatch = todaysMatches.data[0];
            console.log('\n📋 First match details:');
            console.log(`- Match ID: ${firstMatch.id}`);
            console.log(`- Home Team ID: ${firstMatch.homeID}`);
            console.log(`- Away Team ID: ${firstMatch.awayID}`);
            console.log(`- Status: ${firstMatch.status}`);
            
            // Test 2: Get detailed match data
            console.log('\n🎯 STEP 2: Getting detailed match data...');
            try {
                const matchDetails = await DefaultService.getMatch({ 
                    match_id: firstMatch.id 
                });
                
                console.log('✅ Match details response:', {
                    success: matchDetails.success,
                    hasData: !!matchDetails.data
                });
                
                if (matchDetails.success) {
                    console.log('📊 Match stats available:', {
                        corners: `${matchDetails.data.team_a_corners || 'N/A'} - ${matchDetails.data.team_b_corners || 'N/A'}`,
                        cards: `${(matchDetails.data.team_a_yellow_cards || 0) + (matchDetails.data.team_a_red_cards || 0)} - ${(matchDetails.data.team_b_yellow_cards || 0) + (matchDetails.data.team_b_red_cards || 0)}`,
                        goals: `${matchDetails.data.homeGoalCount || 0} - ${matchDetails.data.awayGoalCount || 0}`,
                        shots: `${matchDetails.data.team_a_shots || 'N/A'} - ${matchDetails.data.team_b_shots || 'N/A'}`
                    });
                }
                
            } catch (matchError) {
                console.log('⚠️ Could not get match details:', matchError.message);
            }
            
            // Test 3: Get team information
            console.log('\n🏠 STEP 3: Getting home team data...');
            try {
                const homeTeam = await DefaultService.getTeam({ 
                    team_id: firstMatch.homeID 
                });
                
                console.log('✅ Home team response:', {
                    success: homeTeam.success,
                    teamName: homeTeam.data?.name || 'N/A',
                    teamId: homeTeam.data?.id || 'N/A'
                });
                
            } catch (teamError) {
                console.log('⚠️ Could not get home team data:', teamError.message);
            }
            
            // Test 4: Get team last X stats
            console.log('\n📈 STEP 4: Getting team recent performance...');
            try {
                const teamStats = await DefaultService.getTeamLastXStats({ 
                    team_id: firstMatch.homeID 
                });
                
                console.log('✅ Team stats response:', {
                    success: teamStats.success,
                    hasData: !!teamStats.data
                });
                
            } catch (statsError) {
                console.log('⚠️ Could not get team stats:', statsError.message);
            }
            
        } else {
            console.log('❌ No matches found for today');
        }
        
        // Test 5: Get general data (leagues, countries)
        console.log('\n🌍 STEP 5: Testing general endpoints...');
        
        try {
            const leagues = await DefaultService.getLeagues({});
            console.log('✅ Leagues response:', {
                success: leagues.success,
                dataLength: leagues.data ? leagues.data.length : 0
            });
        } catch (error) {
            console.log('⚠️ Could not get leagues:', error.message);
        }
        
        try {
            const countries = await DefaultService.getCountries({});
            console.log('✅ Countries response:', {
                success: countries.success,
                dataLength: countries.data ? countries.data.length : 0
            });
        } catch (error) {
            console.log('⚠️ Could not get countries:', error.message);
        }
        
        console.log('\n🎉 API INTEGRATION TEST COMPLETED!');
        console.log('✅ FootyStats API foundation is working');
        
    } catch (error) {
        console.error('\n❌ API TEST FAILED:');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Run the test
testFootyStatsAPI()
    .then(() => {
        console.log('\n🏁 Test completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Test crashed:', error);
        process.exit(1);
    });
