import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🎯 Next.js API Route - Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:3000/health');
    const healthStatus = healthResponse.ok;
    const healthData = await healthResponse.text();
    
    console.log('Health check:', { status: healthResponse.status, data: healthData });
    
    // Test dashboard API
    const dashboardResponse = await fetch('http://localhost:3000/api/v1/matches/dashboard?timezone=America/Sao_Paulo');
    const dashboardStatus = dashboardResponse.ok;
    
    let dashboardData = null;
    if (dashboardStatus) {
      dashboardData = await dashboardResponse.json();
    }
    
    console.log('Dashboard check:', { status: dashboardResponse.status, hasData: !!dashboardData });
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      backend: {
        health: {
          status: healthResponse.status,
          ok: healthStatus,
          data: healthData
        },
        dashboard: {
          status: dashboardResponse.status,
          ok: dashboardStatus,
          liveMatches: dashboardData?.data?.liveMatches?.length || 0,
          upcomingMatches: dashboardData?.data?.upcomingMatches?.length || 0
        }
      },
      message: healthStatus && dashboardStatus 
        ? '✅ Backend connection successful!' 
        : '❌ Backend connection failed'
    });
    
  } catch (error) {
    console.error('API test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: '❌ Backend connection failed'
    }, { status: 500 });
  }
}
