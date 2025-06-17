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
        
        // Check actual statuses in the data
        if (response.data && Array.isArray(response.data)) {
            const allStatuses = [...new Set(response.data.map(match => match.status))];
            console.log('\n📋 All unique statuses found:', allStatuses);

            // Sample matches with their statuses and times
            const sampleMatches = response.data.slice(0, 5).map(match => ({
                teams: `${match.home_name} vs ${match.away_name}`,
                status: match.status,
                date_unix: match.date_unix,
                date_readable: match.date_unix ? new Date(match.date_unix * 1000).toISOString() : 'No time',
                homeGoals: match.homeGoalCount || 0,
                awayGoals: match.awayGoalCount || 0,
                hasStarted: match.date_unix ? match.date_unix < Math.floor(Date.now() / 1000) : false
            }));

            console.log('\n🔍 Sample matches:');
            sampleMatches.forEach((match, i) => {
                console.log(`${i + 1}. ${match.teams}`);
                console.log(`   Status: ${match.status}`);
                console.log(`   Time: ${match.date_readable}`);
                console.log(`   Score: ${match.homeGoals}-${match.awayGoals}`);
                console.log(`   Started: ${match.hasStarted}`);
                console.log('');
            });

            // Count matches by status
            const statusCounts = {};
            response.data.forEach(match => {
                const status = match.status || 'unknown';
                statusCounts[status] = (statusCounts[status] || 0) + 1;
            });

            console.log('📊 Status distribution:');
            Object.entries(statusCounts).forEach(([status, count]) => {
                console.log(`   ${status}: ${count} matches`);
            });

            // Let's examine the 'incomplete' matches specifically
            const incompleteMatches = response.data.filter(match => match.status === 'incomplete');
            console.log(`\n🔍 DETAILED ANALYSIS OF ${incompleteMatches.length} 'INCOMPLETE' MATCHES:`);

            incompleteMatches.forEach((match, i) => {
                const matchTime = match.date_unix ? new Date(match.date_unix * 1000) : null;
                const currentTime = new Date();
                const hasStarted = matchTime && matchTime < currentTime;
                const timeDiff = matchTime ? Math.floor((currentTime - matchTime) / (1000 * 60)) : null;

                console.log(`\n${i + 1}. ${match.home_name} vs ${match.away_name}`);
                console.log(`   Status: ${match.status}`);
                console.log(`   Scheduled: ${matchTime ? matchTime.toISOString() : 'No time'}`);
                console.log(`   Current: ${currentTime.toISOString()}`);
                console.log(`   Has Started: ${hasStarted}`);
                console.log(`   Time Diff: ${timeDiff ? `${timeDiff} minutes ${hasStarted ? 'ago' : 'from now'}` : 'Unknown'}`);
                console.log(`   Score: ${match.homeGoalCount || 0}-${match.awayGoalCount || 0}`);
                console.log(`   Goals Activity: ${(match.homeGoalCount > 0 || match.awayGoalCount > 0) ? 'YES' : 'NO'}`);
            });
        }

        console.log('\n✅ API test completed');
        
    } catch (error) {
        console.error('❌ API test failed:', error);
    }
}

testAPI();
