#!/usr/bin/env node

/**
 * 🎯 MAGIC UI TEST RUNNER
 * 
 * This script helps evaluate and test all Magic UI match card variants
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Magic UI Test Environment...\n');

// Build the project first
console.log('📦 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Start the development server
console.log('🌐 Starting development server...');
try {
  console.log('🎨 Magic UI Test Page will be available at:');
  console.log('   📱 Main Dashboard: http://localhost:5173/');
  console.log('   🧪 Magic UI Tests: http://localhost:5173/magic-ui-test');
  console.log('\n🔥 Features to test:');
  console.log('   • Basic Match Card');
  console.log('   • Animated Beam Effects');
  console.log('   • Border Beam Animation');
  console.log('   • Magic Card with Spotlight');
  console.log('   • Meteors Background');
  console.log('   • Sparkles Effect');
  console.log('   • Particles System');
  console.log('   • Rainbow Button');
  console.log('\n💡 Each variant shows different visual effects and interactions');
  console.log('📊 Compare performance and visual appeal of each variant\n');
  
  execSync('npm run dev', { stdio: 'inherit', cwd: __dirname });
} catch (error) {
  console.error('❌ Server failed to start:', error.message);
  process.exit(1);
}
