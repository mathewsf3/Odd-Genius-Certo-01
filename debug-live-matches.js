const { DefaultService } = require('./src/apis/footy');

const API_KEY = '4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756';

async function comprehensiveLiveMatchAnalysis() {
    try {
        console.log('🔍 COMPREHENSIVE LIVE MATCH ANALYSIS');
        console.log('=====================================\n');
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        const currentTime = Math.floor(Date.now() / 1000);
        console.log(`📅 Analyzing date: ${today}`);
        console.log(`⏰ Current time: ${new Date().toISOString()}`);
        console.log(`⏰ Current Unix: ${currentTime}\n`);
        
        // Test getTodaysMatches
        console.log('1. 📡 FETCHING TODAY\'S MATCHES...');
        const response = await DefaultService.getTodaysMatches(
            API_KEY,
            undefined, // timezone
            today,     // date
            1          // page
        );
        
        if (!response || !response.data) {
            console.log('❌ No data received from API');
            return;
        }
        
        console.log(`✅ Received ${response.data.length} matches\n`);
        
        // Analyze all matches
        console.log('2. 🔍 ANALYZING ALL MATCHES...');
        const analysis = {
            total: response.data.length,
            byStatus: {},
            potentialLive: [],
            definitelyUpcoming: [],
            definitelyFinished: []
        };
        
        response.data.forEach((match, i) => {
            const status = match.status || 'unknown';
            analysis.byStatus[status] = (analysis.byStatus[status] || 0) + 1;
            
            const matchTime = match.date_unix || 0;
            const hasStarted = matchTime < currentTime;
            const timeDiff = Math.abs(currentTime - matchTime);
            const hoursFromNow = timeDiff / 3600;
            
            // Categorize matches
            if (status === 'complete') {
                analysis.definitelyFinished.push(match);
            } else if (status === 'incomplete') {
                if (hasStarted) {
                    analysis.potentialLive.push({
                        ...match,
                        hoursAgo: hoursFromNow,
                        hasGoals: (match.homeGoalCount > 0 || match.awayGoalCount > 0)
                    });
                } else {
                    analysis.definitelyUpcoming.push(match);
                }
            }
        });
        
        console.log('📊 STATUS DISTRIBUTION:');
        Object.entries(analysis.byStatus).forEach(([status, count]) => {
            console.log(`   ${status}: ${count} matches`);
        });
        
        console.log(`\n🔴 POTENTIAL LIVE MATCHES: ${analysis.potentialLive.length}`);
        if (analysis.potentialLive.length > 0) {
            analysis.potentialLive.forEach((match, i) => {
                console.log(`\n${i + 1}. ${match.home_name} vs ${match.away_name}`);
                console.log(`   Status: ${match.status}`);
                console.log(`   Started: ${match.hoursAgo.toFixed(1)} hours ago`);
                console.log(`   Score: ${match.homeGoalCount || 0}-${match.awayGoalCount || 0}`);
                console.log(`   Has Goals: ${match.hasGoals ? 'YES' : 'NO'}`);
                console.log(`   League: ${match.league_name || 'Unknown'}`);
                console.log(`   Match Time: ${match.date_unix ? new Date(match.date_unix * 1000).toISOString() : 'No time'}`);
            });
        } else {
            console.log('   ❌ No matches with "incomplete" status that have started');
        }
        
        console.log(`\n🟡 UPCOMING MATCHES: ${analysis.definitelyUpcoming.length}`);
        console.log(`🟢 FINISHED MATCHES: ${analysis.definitelyFinished.length}\n`);
        
        // 3. TEST OUR BACKEND LIVE DETECTION LOGIC
        console.log('3. 🧪 TESTING BACKEND LIVE DETECTION LOGIC...');
        
        if (analysis.potentialLive.length > 0) {
            console.log('Testing our live detection logic on potential live matches:');
            
            analysis.potentialLive.forEach((match, i) => {
                const status = match.status?.toLowerCase() || '';
                const matchTime = match.date_unix || 0;
                const hasStarted = matchTime < currentTime;
                const isWithinLiveWindow = (currentTime - matchTime) <= (24 * 60 * 60); // 24 hours
                const isFinished = status === 'complete';
                
                // Live status keywords (from our backend)
                const liveKeywords = [
                    'live', 'in progress', 'in-progress', 'playing', 'ongoing', 'active',
                    'started', '1st half', 'first half', 'half-time', 'halftime', 'ht',
                    '2nd half', 'second half', 'paused', 'stoppage', 'extra time', 'et',
                    'penalties', 'penalty shootout', 'pen', 'delayed', 'suspended',
                    'incomplete'
                ];
                
                const isLiveStatus = liveKeywords.some(keyword => status.includes(keyword));
                const hasGoalActivity = (match.homeGoalCount > 0 || match.awayGoalCount > 0);
                
                // Special handling for 'incomplete' status
                const isIncompleteStatus = status === 'incomplete';
                const isIncompleteAndLive = isIncompleteStatus && hasStarted && isWithinLiveWindow;
                const isIncompleteAndUpcoming = isIncompleteStatus && !hasStarted;
                
                // Our backend's live detection logic
                const isLive = isIncompleteAndLive ||
                              (isLiveStatus && !isIncompleteStatus && !isFinished && hasStarted) ||
                              (hasStarted && isWithinLiveWindow && !isFinished && !isIncompleteAndUpcoming) ||
                              (hasStarted && hasGoalActivity && !isFinished);
                
                console.log(`\n${i + 1}. ${match.home_name} vs ${match.away_name}`);
                console.log(`   ✅ isIncompleteAndLive: ${isIncompleteAndLive}`);
                console.log(`   ✅ isLiveStatus: ${isLiveStatus}`);
                console.log(`   ✅ hasStarted: ${hasStarted}`);
                console.log(`   ✅ isWithinLiveWindow: ${isWithinLiveWindow}`);
                console.log(`   ✅ isFinished: ${isFinished}`);
                console.log(`   🎯 SHOULD BE DETECTED AS LIVE: ${isLive ? 'YES' : 'NO'}`);
            });
        } else {
            console.log('   ❌ No potential live matches to test logic on');
        }
        
        // 4. TEST BACKEND API DIRECTLY
        console.log('\n4. 🔗 TESTING BACKEND API DIRECTLY...');
        try {
            const backendResponse = await fetch('http://localhost:3000/api/v1/matches/live');
            const backendData = await backendResponse.json();
            
            console.log('Backend /live endpoint response:');
            console.log(`   Success: ${backendData.success}`);
            console.log(`   Total Live: ${backendData.data?.totalLive || 0}`);
            console.log(`   Live Matches Count: ${backendData.data?.liveMatches?.length || 0}`);
            console.log(`   Message: ${backendData.message}`);
            
            if (backendData.data?.liveMatches?.length > 0) {
                console.log('\n   Live matches from backend:');
                backendData.data.liveMatches.forEach((match, i) => {
                    console.log(`   ${i + 1}. ${match.home_name} vs ${match.away_name} (${match.status})`);
                });
            }
        } catch (error) {
            console.log(`   ❌ Error testing backend: ${error.message}`);
        }
        
        console.log('\n✅ COMPREHENSIVE ANALYSIS COMPLETED');
        console.log('=====================================');
        
        return analysis;
        
    } catch (error) {
        console.error('❌ Analysis failed:', error);
    }
}

// Run the analysis
comprehensiveLiveMatchAnalysis();
