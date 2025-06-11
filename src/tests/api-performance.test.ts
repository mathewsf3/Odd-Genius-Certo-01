import { DefaultService, OpenAPI } from '../apis/footy';

// Configure API for testing
OpenAPI.BASE = 'https://api.football-data-api.com';

describe('FootyStats API Performance Tests', () => {
  // Test response times
  describe('Response Time Tests', () => {
    test('countries endpoint should respond within 5 seconds', async () => {
      const startTime = Date.now();
      
      const response = await DefaultService.getCountries({});
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(response.success).toBe(true);
      expect(responseTime).toBeLessThan(5000); // 5 seconds
      
      console.log(`Countries endpoint response time: ${responseTime}ms`);
    });

    test('leagues endpoint should respond within 5 seconds', async () => {
      const startTime = Date.now();
      
      const response = await DefaultService.getLeagues({});
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(response.success).toBe(true);
      expect(responseTime).toBeLessThan(5000);
      
      console.log(`Leagues endpoint response time: ${responseTime}ms`);
    });

    test('today\'s matches should respond within 10 seconds', async () => {
      const startTime = Date.now();
      
      const response = await DefaultService.getTodaysMatches({});
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(response.success).toBe(true);
      expect(responseTime).toBeLessThan(10000); // 10 seconds
      
      console.log(`Today's matches response time: ${responseTime}ms`);
    });
  });

  // Test concurrent requests
  describe('Concurrent Request Tests', () => {
    test('should handle multiple concurrent requests', async () => {
      const startTime = Date.now();
      
      const promises = [
        DefaultService.getCountries({}),
        DefaultService.getLeagues({}),
        DefaultService.getTodaysMatches({}),
        DefaultService.getBttsStats({}),
        DefaultService.getOver25Stats({})
      ];
      
      const responses = await Promise.all(promises);
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // All requests should succeed
      responses.forEach((response, index) => {
        expect(response.success).toBe(true);
      });
      
      // Concurrent requests should be faster than sequential
      expect(totalTime).toBeLessThan(15000); // 15 seconds for all concurrent
      
      console.log(`5 concurrent requests completed in: ${totalTime}ms`);
    });

    test('should handle pagination efficiently', async () => {
      const startTime = Date.now();
      
      // Test multiple pages of today's matches
      const pagePromises = [
        DefaultService.getTodaysMatches({ page: 1 }),
        DefaultService.getTodaysMatches({ page: 2 }),
        DefaultService.getTodaysMatches({ page: 3 })
      ];
      
      const responses = await Promise.all(pagePromises);
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      responses.forEach((response) => {
        expect(response.success).toBe(true);
        expect(response.pager).toBeDefined();
      });
      
      console.log(`3 paginated requests completed in: ${totalTime}ms`);
    });
  });

  // Test data consistency
  describe('Data Consistency Tests', () => {
    test('should return consistent data across multiple calls', async () => {
      // Make the same request multiple times
      const responses = await Promise.all([
        DefaultService.getCountries({}),
        DefaultService.getCountries({}),
        DefaultService.getCountries({})
      ]);
      
      // All responses should be successful
      responses.forEach(response => {
        expect(response.success).toBe(true);
      });
      
      // Data should be consistent
      const firstResponseLength = responses[0].data?.length || 0;
      responses.forEach(response => {
        expect(response.data?.length).toBe(firstResponseLength);
      });
      
      console.log(`Consistent data across ${responses.length} calls: ${firstResponseLength} countries`);
    });

    test('should return consistent league data', async () => {
      const responses = await Promise.all([
        DefaultService.getLeagues({}),
        DefaultService.getLeagues({})
      ]);
      
      responses.forEach(response => {
        expect(response.success).toBe(true);
      });
      
      const firstResponseLength = responses[0].data?.length || 0;
      expect(responses[1].data?.length).toBe(firstResponseLength);
      
      console.log(`Consistent league data: ${firstResponseLength} leagues`);
    });
  });

  // Test rate limiting behavior
  describe('Rate Limiting Tests', () => {
    test('should handle rapid sequential requests', async () => {
      const requests = [];
      const startTime = Date.now();
      
      // Make 10 rapid sequential requests
      for (let i = 0; i < 10; i++) {
        requests.push(
          DefaultService.getCountries({}).catch(error => ({ error, index: i }))
        );
      }
      
      const results = await Promise.all(requests);
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Count successful vs failed requests
      const successful = results.filter(result => !('error' in result));
      const failed = results.filter(result => 'error' in result);
      
      console.log(`10 rapid requests: ${successful.length} successful, ${failed.length} failed in ${totalTime}ms`);
      
      // At least some should succeed
      expect(successful.length).toBeGreaterThan(0);
    });
  });

  // Test memory usage and cleanup
  describe('Memory and Cleanup Tests', () => {
    test('should not leak memory with multiple requests', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Make many requests
      const promises = [];
      for (let i = 0; i < 20; i++) {
        promises.push(DefaultService.getCountries({}));
      }
      
      await Promise.all(promises);
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      console.log(`Memory increase after 20 requests: ${Math.round(memoryIncrease / 1024 / 1024)}MB`);
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  // Test different parameter combinations
  describe('Parameter Combination Tests', () => {
    test('should handle various parameter combinations for leagues', async () => {
      const testCases = [
        { chosenLeaguesOnly: 'true' as const },
        { country: 826 }, // UK
        { chosenLeaguesOnly: 'false' as const, country: 250 }, // France
        {} // No parameters
      ];
      
      const responses = await Promise.all(
        testCases.map(params => DefaultService.getLeagues(params))
      );
      
      responses.forEach((response, index) => {
        expect(response.success).toBe(true);
        console.log(`Test case ${index + 1}: ${response.data?.length || 0} leagues`);
      });
    });

    test('should handle various date and timezone combinations', async () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const testCases = [
        { date: today },
        { date: yesterday },
        { timezone: 'Europe/London' },
        { date: today, timezone: 'America/New_York' },
        {} // Default parameters
      ];
      
      const responses = await Promise.all(
        testCases.map(params => DefaultService.getTodaysMatches(params))
      );
      
      responses.forEach((response, index) => {
        expect(response.success).toBe(true);
        console.log(`Date/timezone test ${index + 1}: ${response.data?.length || 0} matches`);
      });
    });
  });
});
