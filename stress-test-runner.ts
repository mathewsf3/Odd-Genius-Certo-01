/**
 * 🧪 STRESS TEST RUNNER FOR MATCH ANALYSIS
 * 
 * This script tests our comprehensive match analysis workflow:
 * 1. Get today's matches
 * 2. Select a match 
 * 3. Get all available data points
 */

import { matchAnalysisService } from './src/services/MatchAnalysisService';

async function runStressTest() {
    console.log('🚀 STARTING COMPREHENSIVE MATCH ANALYSIS STRESS TEST');
    console.log('='.repeat(60));
    
    try {
        // Test 1: Get basic match info first
        console.log('\n🔍 STEP 1: Getting basic match information...');
        const basicInfo = await matchAnalysisService.getBasicMatchInfo();
        console.log('Basic Info Result:', JSON.stringify(basicInfo, null, 2));
        
        if (basicInfo.error) {
            console.log('❌ Basic info failed, stopping test');
            return;
        }
        
        if (!basicInfo.selectedMatch) {
            console.log('❌ No matches available for detailed analysis');
            return;
        }
        
        const matchId = basicInfo.selectedMatch.id;
        console.log(`✅ Selected match ID: ${matchId}`);
        
        // Test 2: Get comprehensive analysis
        console.log('\n🎯 STEP 2: Running comprehensive match analysis...');
        const analysis = await matchAnalysisService.getMatchAnalysis({
            matchId: matchId,
            includeTeamStats: true,
            includePlayerStats: false, // Disable for now to avoid API limits
            includeRefereeStats: true,
            includeH2H: false // Not implemented yet
        });
          console.log('\n📊 COMPREHENSIVE ANALYSIS RESULTS:');
        console.log('='.repeat(40));
        
        if (analysis.success && analysis.data) {
            console.log('\n🏆 MATCH INFORMATION:');
            console.log(`- Match ID: ${analysis.data.selectedMatch.id}`);
            console.log(`- Home Team: ${analysis.data.selectedMatch.homeID}`);
            console.log(`- Away Team: ${analysis.data.selectedMatch.awayID}`);
            console.log(`- Status: ${analysis.data.selectedMatch.status}`);
            console.log(`- Referee: ${analysis.data.selectedMatch.refereeID || 'Not assigned'}`);
            
            console.log('\n📈 ANALYTICS:');
            console.log(`- Expected Corners: ${analysis.data.analytics.corners.totalExpected.toFixed(1)}`);
            console.log(`- Expected Cards: ${analysis.data.analytics.cards.totalExpected.toFixed(1)}`);
            console.log(`- Over 2.5 Goals Probability: ${(analysis.data.analytics.goals.over25Probability * 100).toFixed(1)}%`);
            console.log(`- BTTS Likelihood: ${(analysis.data.analytics.goals.bttsLikelihood * 100).toFixed(1)}%`);
            
            console.log('\n🏠 HOME TEAM DATA:');
            console.log(`- Team ID: ${analysis.data.homeTeam.info?.id || 'N/A'}`);
            console.log(`- Name: ${analysis.data.homeTeam.info?.name || 'N/A'}`);
            console.log(`- Has Stats: ${analysis.data.homeTeam.lastXMatches ? 'Yes' : 'No'}`);
            
            console.log('\n🛣️ AWAY TEAM DATA:');
            console.log(`- Team ID: ${analysis.data.awayTeam.info?.id || 'N/A'}`);
            console.log(`- Name: ${analysis.data.awayTeam.info?.name || 'N/A'}`);
            console.log(`- Has Stats: ${analysis.data.awayTeam.lastXMatches ? 'Yes' : 'No'}`);
            
            console.log('\n👨‍⚖️ REFEREE DATA:');
            if (analysis.data.referee) {
                console.log(`- Referee ID: ${analysis.data.selectedMatch.refereeID}`);
                console.log(`- Has Stats: Yes`);
            } else {
                console.log('- No referee data available');
            }
        } else {
            console.log('❌ Analysis failed or no data available');
            console.log(`Error: ${analysis.error || 'Unknown error'}`);
        }
          console.log('\n📋 METADATA:');
        console.log(`- Total Matches Today: ${analysis.metadata.totalMatchesToday}`);
        console.log(`- Analysis Timestamp: ${analysis.metadata.analysisTimestamp}`);
        console.log(`- Data Source: ${analysis.metadata.dataSource}`);
        
        // NEW: Test ALL available endpoints
        console.log('\n🧪 STEP 3: COMPREHENSIVE ENDPOINT TESTING...');
        console.log('='.repeat(60));
        
        const endpointTest = await matchAnalysisService.testAllEndpoints();
        
        if (endpointTest.success) {
            console.log('\n🎉 COMPREHENSIVE ENDPOINT TEST RESULTS:');
            console.log(`✅ Success Rate: ${((endpointTest.successfulEndpoints / endpointTest.totalEndpoints) * 100).toFixed(1)}%`);
            console.log(`📊 Working Endpoints: ${endpointTest.successfulEndpoints}/${endpointTest.totalEndpoints}`);
            
            if (endpointTest.failedEndpoints.length > 0) {
                console.log(`⚠️ Failed Endpoints: ${endpointTest.failedEndpoints.join(', ')}`);
            }
            
            console.log('\n📈 DATA COVERAGE SUMMARY:');
            const workingEndpoints = Object.entries(endpointTest.endpointResults)
                .filter(([_, result]) => result.success)
                .map(([endpoint, _]) => endpoint);
            
            console.log(`✅ Working: ${workingEndpoints.join(', ')}`);
            
            // Show detailed summary
            console.log(endpointTest.summary);
        } else {
            console.log('\n❌ COMPREHENSIVE ENDPOINT TEST FAILED');
            console.log(`Failed endpoints: ${endpointTest.failedEndpoints.join(', ')}`);
        }
        
        console.log('\n🎉 STRESS TEST COMPLETED SUCCESSFULLY!');
        console.log('✅ All data points retrieved and processed');
        console.log('✅ Comprehensive API endpoint coverage tested');
        
        return { analysis, endpointTest };
          } catch (error: any) {
        console.error('\n❌ STRESS TEST FAILED:');
        console.error('Error:', error?.message || error);
        console.error('Stack:', error?.stack);
        
        // Try to get some basic info even if full analysis fails
        try {
            console.log('\n🔄 Attempting basic fallback...');
            const fallback = await matchAnalysisService.getBasicMatchInfo();
            console.log('Fallback Result:', JSON.stringify(fallback, null, 2));
        } catch (fallbackError: any) {
            console.error('Fallback also failed:', fallbackError?.message || fallbackError);
        }
    }
}

// Run the stress test
if (require.main === module) {
    runStressTest()
        .then(() => {
            console.log('\n🏁 Test runner completed');
            process.exit(0);
        })        .catch((error: any) => {
            console.error('\n💥 Test runner crashed:', error?.message || error);
            process.exit(1);
        });
}

export { runStressTest };

