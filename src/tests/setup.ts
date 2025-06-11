// Jest setup file for API tests

// Increase timeout for all tests
jest.setTimeout(30000);

// Global test configuration
beforeAll(() => {
  console.log('🧪 Starting FootyStats API Test Suite');
  console.log('=====================================');
});

afterAll(() => {
  console.log('✅ FootyStats API Test Suite Completed');
  console.log('======================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Add custom matchers if needed
expect.extend({
  toBeValidApiResponse(received) {
    const pass = received &&
      typeof received === 'object' &&
      typeof received.success === 'boolean' &&
      received.data !== undefined;

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid API response`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid API response with success and data properties`,
        pass: false,
      };
    }
  },
});
