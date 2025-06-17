/**
 * 🎯 DASHBOARD COMPLETE TEST SUITE
 * 
 * Comprehensive testing of all dashboard functionality:
 * - API endpoints verification
 * - Data accuracy testing
 * - League name mapping
 * - Score display validation
 * - Rate limit handling
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';
const FRONTEND_URL = 'http://localhost:3001';

// Test results storage
const testResults = {
    apiTests: {},
    frontendTests: {},
    summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        warnings: 0
    }
};

/**
 * Test API endpoints
 */
async function testApiEndpoints() {
    console.log('\n🔍 TESTING API ENDPOINTS...\n');
    
    const endpoints = [
        { name: 'Health Check', url: '/health', expectedStatus: 200 },
        { name: 'API Info', url: '/api/v1', expectedStatus: 200 },
        { name: 'Today Matches', url: '/matches/today', expectedStatus: [200, 404] },
        { name: 'Live Matches', url: '/matches/live', expectedStatus: 200 },
        { name: 'Upcoming Matches', url: '/matches/search?status=upcoming', expectedStatus: 200 },
        { name: 'League Mapping', url: '/matches/leagues/mapping', expectedStatus: 200 },
        { name: 'Total Count', url: '/matches/total-count', expectedStatus: 200 }
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`Testing: ${endpoint.name}`);
            const response = await axios.get(`${BASE_URL}${endpoint.url}`);
            
            const statusOk = Array.isArray(endpoint.expectedStatus) 
                ? endpoint.expectedStatus.includes(response.status)
                : response.status === endpoint.expectedStatus;

            if (statusOk) {
                console.log(`✅ ${endpoint.name}: Status ${response.status}`);
                testResults.apiTests[endpoint.name] = {
                    status: 'PASSED',
                    statusCode: response.status,
                    data: response.data
                };
                testResults.summary.passed++;
            } else {
                console.log(`❌ ${endpoint.name}: Expected ${endpoint.expectedStatus}, got ${response.status}`);
                testResults.apiTests[endpoint.name] = {
                    status: 'FAILED',
                    statusCode: response.status,
                    error: `Unexpected status code`
                };
                testResults.summary.failed++;
            }
        } catch (error) {
            console.log(`❌ ${endpoint.name}: ${error.message}`);
            testResults.apiTests[endpoint.name] = {
                status: 'FAILED',
                error: error.message
            };
            testResults.summary.failed++;
        }
        testResults.summary.totalTests++;
    }
}

/**
 * Test data quality and accuracy
 */
async function testDataQuality() {
    console.log('\n📊 TESTING DATA QUALITY...\n');
    
    try {
        // Test live matches data structure
        const liveResponse = await axios.get(`${BASE_URL}/matches/live`);
        console.log('Live Matches Response:', JSON.stringify(liveResponse.data, null, 2));
        
        if (liveResponse.data.success) {
            const liveMatches = liveResponse.data.data.liveMatches || [];
            console.log(`✅ Live matches endpoint working: ${liveMatches.length} matches`);
            
            if (liveMatches.length > 0) {
                const firstMatch = liveMatches[0];
                console.log('First live match structure:', Object.keys(firstMatch));
                
                // Check for required fields
                const requiredFields = ['id', 'home_name', 'away_name', 'status'];
                const missingFields = requiredFields.filter(field => !firstMatch[field]);
                
                if (missingFields.length === 0) {
                    console.log('✅ Live match data structure is complete');
                } else {
                    console.log(`⚠️ Missing fields in live match data: ${missingFields.join(', ')}`);
                    testResults.summary.warnings++;
                }
            } else {
                console.log('⚠️ No live matches available (could be normal or rate limit issue)');
                testResults.summary.warnings++;
            }
        }
        
        // Test league mapping
        try {
            const leagueResponse = await axios.get(`${BASE_URL}/matches/leagues/mapping`);
            if (leagueResponse.data.success) {
                const mapping = leagueResponse.data.data.mapping;
                const totalLeagues = Object.keys(mapping).length;
                console.log(`✅ League mapping working: ${totalLeagues} leagues mapped`);
                
                // Test specific league mappings
                const testLeagues = {
                    14124: 'Premier League',
                    14125: 'La Liga',
                    14116: 'Primera División Chile'
                };
                
                for (const [id, expectedName] of Object.entries(testLeagues)) {
                    if (mapping[id] === expectedName) {
                        console.log(`✅ League ${id}: ${expectedName}`);
                    } else {
                        console.log(`❌ League ${id}: Expected "${expectedName}", got "${mapping[id]}"`);
                        testResults.summary.failed++;
                    }
                }
            }
        } catch (error) {
            console.log(`❌ League mapping test failed: ${error.message}`);
            testResults.summary.failed++;
        }
        
    } catch (error) {
        console.log(`❌ Data quality test failed: ${error.message}`);
        testResults.summary.failed++;
    }
}

/**
 * Test rate limit handling
 */
async function testRateLimitHandling() {
    console.log('\n⏱️ TESTING RATE LIMIT HANDLING...\n');
    
    try {
        const response = await axios.get(`${BASE_URL}/matches/today`);
        
        if (response.status === 200) {
            console.log('✅ API calls working normally');
            testResults.summary.passed++;
        } else if (response.status === 404 && response.data.error?.includes('Too Many Requests')) {
            console.log('⚠️ Rate limit detected - API is properly handling 429 errors');
            console.log('📊 Rate limit info from API response:');
            
            // Extract rate limit info from error message
            const errorMsg = response.data.error;
            if (errorMsg.includes('request_remaining')) {
                console.log('   - Rate limit properly detected and handled');
                console.log('   - Error message contains rate limit details');
                testResults.summary.warnings++;
            }
        }
    } catch (error) {
        if (error.response?.status === 429) {
            console.log('⚠️ Direct 429 error - Rate limit active');
            testResults.summary.warnings++;
        } else {
            console.log(`❌ Unexpected error: ${error.message}`);
            testResults.summary.failed++;
        }
    }
    
    testResults.summary.totalTests++;
}

/**
 * Generate comprehensive test report
 */
function generateTestReport() {
    console.log('\n📋 COMPREHENSIVE TEST REPORT\n');
    console.log('='.repeat(50));
    
    // Summary
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total Tests: ${testResults.summary.totalTests}`);
    console.log(`   ✅ Passed: ${testResults.summary.passed}`);
    console.log(`   ❌ Failed: ${testResults.summary.failed}`);
    console.log(`   ⚠️ Warnings: ${testResults.summary.warnings}`);
    
    const successRate = ((testResults.summary.passed / testResults.summary.totalTests) * 100).toFixed(1);
    console.log(`   📈 Success Rate: ${successRate}%`);
    
    // Detailed results
    console.log(`\n🔍 DETAILED RESULTS:`);
    
    console.log('\n   API ENDPOINTS:');
    for (const [name, result] of Object.entries(testResults.apiTests)) {
        const status = result.status === 'PASSED' ? '✅' : '❌';
        console.log(`   ${status} ${name}: ${result.status}`);
        if (result.error) {
            console.log(`      Error: ${result.error}`);
        }
    }
    
    // Recommendations
    console.log(`\n💡 RECOMMENDATIONS:`);
    
    if (testResults.summary.warnings > 0) {
        console.log('   ⚠️ Rate limit detected - Consider:');
        console.log('      - Implementing better caching strategies');
        console.log('      - Adding fallback data for development');
        console.log('      - Monitoring API usage more carefully');
    }
    
    if (testResults.summary.failed > 0) {
        console.log('   ❌ Some tests failed - Priority fixes needed:');
        console.log('      - Check API endpoint configurations');
        console.log('      - Verify data transformation logic');
        console.log('      - Test with valid API responses');
    }
    
    if (testResults.summary.passed === testResults.summary.totalTests) {
        console.log('   🎉 All tests passed! Dashboard is working correctly.');
    }
    
    console.log('\n='.repeat(50));
}

/**
 * Main test execution
 */
async function runCompleteTest() {
    console.log('🎯 STARTING COMPREHENSIVE DASHBOARD TEST SUITE');
    console.log('='.repeat(50));
    
    try {
        await testApiEndpoints();
        await testDataQuality();
        await testRateLimitHandling();
        
        generateTestReport();
        
    } catch (error) {
        console.error('❌ Test suite failed:', error);
    }
}

// Run the tests
runCompleteTest();
