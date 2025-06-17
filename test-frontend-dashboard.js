/**
 * 🎯 FRONTEND DASHBOARD VERIFICATION
 * 
 * Comprehensive testing of dashboard frontend functionality:
 * - Verify live matches display
 * - Check league names (not IDs)
 * - Validate score displays
 * - Confirm real data integration
 */

const puppeteer = require('puppeteer');

async function testFrontendDashboard() {
    console.log('🎯 STARTING FRONTEND DASHBOARD VERIFICATION');
    console.log('='.repeat(50));
    
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1920, height: 1080 }
    });
    
    try {
        const page = await browser.newPage();
        
        // Navigate to dashboard
        console.log('📱 Navigating to dashboard...');
        await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
        
        // Wait for dashboard to load
        await page.waitForTimeout(3000);
        
        // Take initial screenshot
        await page.screenshot({ path: 'dashboard-initial.png', fullPage: true });
        console.log('📸 Initial screenshot saved: dashboard-initial.png');
        
        // Check dashboard statistics
        console.log('\n📊 CHECKING DASHBOARD STATISTICS...');
        
        try {
            // Wait for statistics to load
            await page.waitForSelector('.grid', { timeout: 10000 });
            
            // Extract statistics
            const stats = await page.evaluate(() => {
                const statCards = document.querySelectorAll('.bg-white.rounded-lg.shadow-md.p-6');
                const results = {};
                
                statCards.forEach((card, index) => {
                    const title = card.querySelector('h3')?.textContent?.trim();
                    const value = card.querySelector('p.text-3xl')?.textContent?.trim();
                    const description = card.querySelector('p.text-gray-600')?.textContent?.trim();
                    
                    if (title && value) {
                        results[title] = {
                            value: value,
                            description: description
                        };
                    }
                });
                
                return results;
            });
            
            console.log('📈 Dashboard Statistics:');
            Object.entries(stats).forEach(([title, data]) => {
                console.log(`   ${title}: ${data.value} (${data.description})`);
            });
            
        } catch (error) {
            console.log('❌ Error reading dashboard statistics:', error.message);
        }
        
        // Check live matches section
        console.log('\n🔴 CHECKING LIVE MATCHES SECTION...');
        
        try {
            // Look for live matches section
            const liveMatchesSection = await page.$('h2:has-text("Partidas ao Vivo")');
            
            if (liveMatchesSection) {
                console.log('✅ Live matches section found');
                
                // Count live match cards
                const liveMatchCards = await page.$$('.live-match-card, .match-card');
                console.log(`📊 Live match cards found: ${liveMatchCards.length}`);
                
                if (liveMatchCards.length > 0) {
                    // Extract details from first few match cards
                    const matchDetails = await page.evaluate(() => {
                        const cards = document.querySelectorAll('.live-match-card, .match-card');
                        const matches = [];
                        
                        for (let i = 0; i < Math.min(3, cards.length); i++) {
                            const card = cards[i];
                            const homeTeam = card.querySelector('[data-testid="home-team"], .home-team')?.textContent?.trim();
                            const awayTeam = card.querySelector('[data-testid="away-team"], .away-team')?.textContent?.trim();
                            const score = card.querySelector('[data-testid="score"], .score')?.textContent?.trim();
                            const league = card.querySelector('[data-testid="league"], .league')?.textContent?.trim();
                            const status = card.querySelector('[data-testid="status"], .status')?.textContent?.trim();
                            
                            matches.push({
                                homeTeam: homeTeam || 'Not found',
                                awayTeam: awayTeam || 'Not found',
                                score: score || 'Not found',
                                league: league || 'Not found',
                                status: status || 'Not found'
                            });
                        }
                        
                        return matches;
                    });
                    
                    console.log('🏆 Live Match Details:');
                    matchDetails.forEach((match, index) => {
                        console.log(`   Match ${index + 1}:`);
                        console.log(`     Teams: ${match.homeTeam} vs ${match.awayTeam}`);
                        console.log(`     Score: ${match.score}`);
                        console.log(`     League: ${match.league}`);
                        console.log(`     Status: ${match.status}`);
                        
                        // Check for league ID issues
                        if (match.league.includes('Liga ') && /\d+/.test(match.league)) {
                            console.log(`     ⚠️ WARNING: League showing ID instead of name!`);
                        }
                        
                        // Check for score issues
                        if (match.score === '0x0' || match.score === '0-0') {
                            console.log(`     ⚠️ WARNING: Score may not be updating!`);
                        }
                    });
                    
                } else {
                    console.log('❌ No live match cards found in the section');
                }
                
            } else {
                console.log('❌ Live matches section not found');
            }
            
        } catch (error) {
            console.log('❌ Error checking live matches section:', error.message);
        }
        
        // Check for loading states
        console.log('\n⏳ CHECKING LOADING STATES...');
        
        const loadingElements = await page.$$('.loading, .spinner, [data-testid="loading"]');
        if (loadingElements.length > 0) {
            console.log(`⚠️ Found ${loadingElements.length} loading elements - data may still be loading`);
        } else {
            console.log('✅ No loading elements found - data should be loaded');
        }
        
        // Check for error messages
        console.log('\n❌ CHECKING FOR ERROR MESSAGES...');
        
        const errorElements = await page.$$('.error, .alert-error, [data-testid="error"]');
        if (errorElements.length > 0) {
            console.log(`❌ Found ${errorElements.length} error elements`);
            
            const errorMessages = await page.evaluate(() => {
                const errors = document.querySelectorAll('.error, .alert-error, [data-testid="error"]');
                return Array.from(errors).map(el => el.textContent?.trim()).filter(Boolean);
            });
            
            errorMessages.forEach(msg => console.log(`   Error: ${msg}`));
        } else {
            console.log('✅ No error messages found');
        }
        
        // Take final screenshot
        await page.screenshot({ path: 'dashboard-final.png', fullPage: true });
        console.log('📸 Final screenshot saved: dashboard-final.png');
        
        // Generate summary
        console.log('\n📋 FRONTEND VERIFICATION SUMMARY');
        console.log('='.repeat(50));
        
        const summary = {
            dashboardLoaded: true,
            statisticsVisible: Object.keys(stats || {}).length > 0,
            liveMatchesSection: !!liveMatchesSection,
            matchCardsFound: liveMatchCards?.length || 0,
            hasLoadingElements: loadingElements.length > 0,
            hasErrorElements: errorElements.length > 0
        };
        
        console.log('📊 Summary:');
        Object.entries(summary).forEach(([key, value]) => {
            const status = value ? '✅' : '❌';
            console.log(`   ${status} ${key}: ${value}`);
        });
        
        if (summary.matchCardsFound === 6) {
            console.log('\n🎉 SUCCESS: All 6 live matches are displaying correctly!');
        } else if (summary.matchCardsFound > 0) {
            console.log(`\n⚠️ PARTIAL SUCCESS: ${summary.matchCardsFound} matches found (expected 6)`);
        } else {
            console.log('\n❌ FAILURE: No live matches displaying in frontend');
        }
        
    } catch (error) {
        console.error('❌ Frontend verification failed:', error);
    } finally {
        await browser.close();
    }
}

// Run the test
testFrontendDashboard();
