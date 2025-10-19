// Simple integration test to verify frontend-backend alignment
// Run this with: node test-integration.js

const { testApiConnectionWithReport } = require('./src/lib/api-connection-test.ts');

async function runIntegrationTest() {
  console.log('🧪 Running Frontend-Backend Integration Test...\n');
  
  try {
    const { testSuite, report } = await testApiConnectionWithReport();
    
    console.log('\n📋 Test Summary:');
    console.log(`✅ Passed: ${testSuite.passedTests}/${testSuite.totalTests}`);
    console.log(`❌ Failed: ${testSuite.failedTests}/${testSuite.totalTests}`);
    console.log(`⏱️  Duration: ${testSuite.totalDuration}ms`);
    console.log(`📊 Success Rate: ${((testSuite.passedTests / testSuite.totalTests) * 100).toFixed(1)}%`);
    
    // Save report to file
    const fs = require('fs');
    fs.writeFileSync('API_CONNECTION_TEST_REPORT.md', report);
    console.log('\n📄 Detailed report saved to: API_CONNECTION_TEST_REPORT.md');
    
    // Exit with appropriate code
    process.exit(testSuite.failedTests > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    process.exit(1);
  }
}

runIntegrationTest();
