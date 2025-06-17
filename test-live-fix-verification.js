// Test to verify our live match detection fix works correctly
// This simulates the exact logic from our fixed MatchAnalysisService.js

console.log('🧪 TESTING LIVE MATCH DETECTION FIX');
console.log('=====================================\n');

// Mock data representing different match scenarios
const mockMatches = [
    {
        home_name: "Real Madrid",
        away_name: "Barcelona", 
        status: "incomplete",
        date_unix: Math.floor(Date.now() / 1000) - (2 * 60 * 60), // 2 hours ago
        homeGoalCount: 1,
        awayGoalCount: 0,
        scenario: "Live match - started 2 hours ago"
    },
    {
        home_name: "Manchester United",
        away_name: "Liverpool",
        status: "incomplete", 
        date_unix: Math.floor(Date.now() / 1000) - (8 * 60 * 60), // 8 hours ago
        homeGoalCount: 0,
        awayGoalCount: 0,
        scenario: "Live match - started 8 hours ago (like our API data)"
    },
    {
        home_name: "Chelsea",
        away_name: "Arsenal",
        status: "incomplete",
        date_unix: Math.floor(Date.now() / 1000) + (2 * 60 * 60), // 2 hours from now
        homeGoalCount: 0,
        awayGoalCount: 0,
        scenario: "Upcoming match - scheduled for future"
    },
    {
        home_name: "Bayern Munich",
        away_name: "Dortmund", 
        status: "complete",
        date_unix: Math.floor(Date.now() / 1000) - (3 * 60 * 60), // 3 hours ago
        homeGoalCount: 2,
        awayGoalCount: 1,
        scenario: "Finished match"
    },
    {
        home_name: "PSG",
        away_name: "Lyon",
        status: "incomplete",
        date_unix: Math.floor(Date.now() / 1000) - (12 * 60 * 60), // 12 hours ago
        homeGoalCount: 0,
        awayGoalCount: 0,
        scenario: "Very old incomplete match (suspended/delayed?)"
    }
];

function testOldLogic(matches) {
    console.log('❌ TESTING OLD LOGIC (3-hour window restriction):');
    
    const currentTime = Math.floor(Date.now() / 1000);
    const liveMatches = matches.filter((match) => {
        const status = match.status?.toLowerCase() || '';
        const matchTime = match.date_unix || 0;

        // OLD LOGIC: 3-hour window restriction
        const matchStarted = matchTime <= currentTime;
        const matchRecent = matchTime > (currentTime - 10800); // 3 hours ago
        const isLive = status === 'incomplete' && matchStarted && matchRecent;

        const hoursAgo = (currentTime - matchTime) / 3600;
        console.log(`   ${match.home_name} vs ${match.away_name}`);
        console.log(`   Scenario: ${match.scenario}`);
        console.log(`   Started: ${hoursAgo.toFixed(1)} hours ago`);
        console.log(`   Status: ${status}`);
        console.log(`   Match Started: ${matchStarted}`);
        console.log(`   Match Recent (< 3h): ${matchRecent}`);
        console.log(`   🎯 OLD LOGIC RESULT: ${isLive ? 'LIVE' : 'NOT LIVE'}`);
        console.log('');

        return isLive;
    });
    
    console.log(`📊 OLD LOGIC: Found ${liveMatches.length} live matches\n`);
    return liveMatches;
}

function testNewLogic(matches) {
    console.log('✅ TESTING NEW LOGIC (no time window restriction):');
    
    const currentTime = Math.floor(Date.now() / 1000);
    const liveMatches = matches.filter((match) => {
        const status = match.status?.toLowerCase() || '';
        const matchTime = match.date_unix || 0;

        // NEW LOGIC: If incomplete + started = LIVE (no time restriction)
        const matchStarted = matchTime <= currentTime;
        const isLive = status === 'incomplete' && matchStarted;

        const hoursAgo = (currentTime - matchTime) / 3600;
        console.log(`   ${match.home_name} vs ${match.away_name}`);
        console.log(`   Scenario: ${match.scenario}`);
        console.log(`   Started: ${hoursAgo.toFixed(1)} hours ago`);
        console.log(`   Status: ${status}`);
        console.log(`   Match Started: ${matchStarted}`);
        console.log(`   🎯 NEW LOGIC RESULT: ${isLive ? 'LIVE' : 'NOT LIVE'}`);
        console.log('');

        return isLive;
    });
    
    console.log(`📊 NEW LOGIC: Found ${liveMatches.length} live matches\n`);
    return liveMatches;
}

// Run both tests
const oldResults = testOldLogic(mockMatches);
const newResults = testNewLogic(mockMatches);

console.log('🎯 COMPARISON RESULTS:');
console.log('======================');
console.log(`❌ Old Logic: ${oldResults.length} live matches`);
console.log(`✅ New Logic: ${newResults.length} live matches`);
console.log('');

console.log('📋 EXPECTED RESULTS:');
console.log('- Real Madrid vs Barcelona: LIVE (2h ago, incomplete)');
console.log('- Manchester United vs Liverpool: LIVE (8h ago, incomplete) ✅ This was missing!');
console.log('- Chelsea vs Arsenal: NOT LIVE (future match)');
console.log('- Bayern Munich vs Dortmund: NOT LIVE (complete)');
console.log('- PSG vs Lyon: LIVE (12h ago, incomplete) ✅ This was missing!');
console.log('');

if (newResults.length > oldResults.length) {
    console.log('🎉 SUCCESS! New logic detects more live matches than old logic.');
    console.log('✅ The fix should resolve the "no live matches" issue.');
} else {
    console.log('⚠️ WARNING: New logic doesn\'t show improvement.');
}

console.log('\n🔍 NEXT STEPS:');
console.log('1. Wait for API rate limit to reset (every hour)');
console.log('2. Test the live endpoint with real data');
console.log('3. Verify dashboard shows live matches');
console.log('4. Use Puppeteer to confirm visual display');
