import { demoFootyStatsAPI } from './demo-api-usage';

// Simple test to verify API is working
async function testAPI() {
  console.log('🧪 Testing FootyStats API Integration...\n');
  
  try {
    await demoFootyStatsAPI();
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testAPI();
