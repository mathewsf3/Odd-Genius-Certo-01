"use strict";
/**
 * 🧪 SIMPLE STRESS TEST - Foundation Validation
 *
 * This script tests our basic foundation:
 * 1. Get today's matches
 * 2. Select a match
 * 3. Get detailed match data
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
exports.runSimpleStressTest = runSimpleStressTest;
const MatchAnalysisService_1 = require("./src/services/MatchAnalysisService");
function runSimpleStressTest() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🚀 STARTING SIMPLE FOUNDATION STRESS TEST');
        console.log('='.repeat(60));
        try {
            // Test 1: Get basic match info
            console.log('\n🔍 STEP 1: Getting today\'s matches...');
            const basicInfo = yield MatchAnalysisService_1.matchAnalysisService.getBasicMatchInfo();
            console.log('\n📋 BASIC INFO RESULTS:');
            console.log(`- Success: ${basicInfo.success}`);
            console.log(`- Total Matches: ${basicInfo.totalMatches || 0}`);
            if (basicInfo.error) {
                console.log(`- Error: ${basicInfo.error}`);
                return { success: false, step: 1, error: basicInfo.error };
            }
            if (!basicInfo.selectedMatch) {
                console.log('- No matches available for analysis');
                return { success: true, step: 1, message: 'No matches today' };
            }
            console.log(`- Selected Match ID: ${basicInfo.selectedMatch.id}`);
            console.log(`- Home Team ID: ${basicInfo.selectedMatch.homeID}`);
            console.log(`- Away Team ID: ${basicInfo.selectedMatch.awayID}`);
            // Test 2: Get detailed match info
            console.log('\n🎯 STEP 2: Getting detailed match data...');
            const detailedInfo = yield MatchAnalysisService_1.matchAnalysisService.getDetailedMatchInfo(basicInfo.selectedMatch.id);
            console.log('\n📊 DETAILED INFO RESULTS:');
            console.log(`- Success: ${detailedInfo.success}`);
            if (detailedInfo.error) {
                console.log(`- Error: ${detailedInfo.error}`);
                return { success: false, step: 2, error: detailedInfo.error };
            }
            if (detailedInfo.data) {
                console.log(`- Has Match Details: ${!!detailedInfo.data.matchDetails}`);
                console.log(`- Analysis Timestamp: ${detailedInfo.data.analysisTimestamp}`);
            }
            console.log('\n🎉 FOUNDATION STRESS TEST COMPLETED SUCCESSFULLY!');
            console.log('✅ Basic foundation is working correctly');
            return {
                success: true,
                step: 2,
                matchesFound: basicInfo.totalMatches,
                selectedMatchId: basicInfo.selectedMatch.id
            };
        }
        catch (error) {
            console.error('\n❌ STRESS TEST FAILED:');
            console.error('Error:', error instanceof Error ? error.message : String(error));
            if (error instanceof Error && error.stack) {
                console.error('Stack:', error.stack);
            }
            return { success: false, step: 0, error: error instanceof Error ? error.message : String(error) };
        }
    });
}
// Run the stress test
if (require.main === module) {
    runSimpleStressTest()
        .then((result) => {
        console.log('\n🏁 Test runner completed');
        console.log('Final Result:', JSON.stringify(result, null, 2));
        process.exit(result.success ? 0 : 1);
    })
        .catch((error) => {
        console.error('\n💥 Test runner crashed:', error);
        process.exit(1);
    });
}
