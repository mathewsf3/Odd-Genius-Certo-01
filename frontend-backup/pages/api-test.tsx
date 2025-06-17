/**
 * 🧪 API TEST PAGE - Debug frontend-backend connection
 */

"use client";

import { useEffect, useState } from 'react';

export default function ApiTestPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testApis = async () => {
      const tests = [
        { name: 'Live Matches', url: 'http://localhost:3000/api/v1/matches/live' },
        { name: 'Upcoming Matches', url: 'http://localhost:3000/api/v1/matches/upcoming' },
        { name: 'Today Matches', url: 'http://localhost:3000/api/v1/matches/today' },
        { name: 'Dashboard', url: 'http://localhost:3000/api/v1/matches/dashboard' }
      ];

      const testResults: any = {};

      for (const test of tests) {
        try {
          console.log(`Testing ${test.name}...`);
          const response = await fetch(test.url);
          const data = await response.json();
          
          testResults[test.name] = {
            status: response.status,
            success: data.success,
            dataLength: Array.isArray(data.data) ? data.data.length : 'Not array',
            error: data.error || null
          };
        } catch (error) {
          testResults[test.name] = {
            status: 'ERROR',
            error: error instanceof Error ? error.message : String(error)
          };
        }
      }

      setResults(testResults);
      setLoading(false);
    };

    testApis();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Testing API Connections...</h1>
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Results</h1>
      
      <div className="space-y-4">
        {Object.entries(results).map(([name, result]: [string, any]) => (
          <div key={name} className="border p-4 rounded">
            <h2 className="font-bold text-lg">{name}</h2>
            <div className="mt-2">
              <p><strong>Status:</strong> {result.status}</p>
              <p><strong>Success:</strong> {String(result.success)}</p>
              <p><strong>Data Length:</strong> {result.dataLength}</p>
              {result.error && <p className="text-red-600"><strong>Error:</strong> {result.error}</p>}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <a href="/" className="text-blue-600 hover:underline">← Back to Dashboard</a>
      </div>
    </div>
  );
}
