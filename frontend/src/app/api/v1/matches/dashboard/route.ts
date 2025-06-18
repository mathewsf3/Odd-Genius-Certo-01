/**
 * 🎯 Dashboard API Route - Next.js API Route Handler
 * 
 * Proxies requests to backend /api/v1/matches/dashboard
 * Implements proper error handling and response formatting
 * Mirrors backend MatchController patterns
 */

import { ApiResponse, DashboardData } from '@/types/api';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timezone = searchParams.get('timezone') || 'America/Sao_Paulo';
    const limit = searchParams.get('limit');
    
    console.log('🎯 Next.js API Route - Dashboard request:', { timezone, limit });
    
    // Build backend URL with parameters
    const backendUrl = new URL(`${BACKEND_URL}/api/v1/matches/dashboard`);
    backendUrl.searchParams.set('timezone', timezone);
    if (limit) {
      backendUrl.searchParams.set('limit', limit);
    }
    
    console.log('📡 Proxying to backend:', backendUrl.toString());
    
    // Make request to backend
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📊 Backend response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ Backend error:', response.status, response.statusText);
      
      // Try to get error details from backend
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `Backend error: ${response.status} ${response.statusText}` };
      }
      
      return NextResponse.json({
        success: false,
        error: errorData.message || 'Backend API error',
        code: 'BACKEND_ERROR',
        timestamp: new Date().toISOString(),
      }, { status: response.status });
    }
    
    const data = await response.json();
    console.log('✅ Dashboard data received:', {
      success: data.success,
      liveMatches: data.data?.liveMatches?.length || 0,
      upcomingMatches: data.data?.upcomingMatches?.length || 0,
    });
    
    // Ensure proper response format
    const dashboardResponse: ApiResponse<DashboardData> = {
      success: true,
      data: {
        totalMatches: data.data?.totalMatches || 0,
        liveMatches: data.data?.liveMatches || [],
        upcomingMatches: data.data?.upcomingMatches || [],
        totalLive: data.data?.totalLive || data.data?.liveMatches?.length || 0,
        totalUpcoming: data.data?.totalUpcoming || data.data?.upcomingMatches?.length || 0,
        lastUpdated: data.data?.lastUpdated || new Date().toISOString(),
      },
      message: data.message || 'Dashboard data retrieved successfully',
    };
    
    // Set cache headers for client-side caching (short TTL for live data)
    const headers = new Headers({
      'Cache-Control': 'public, max-age=30, s-maxage=30', // 30 seconds cache
      'Content-Type': 'application/json',
    });
    
    return NextResponse.json(dashboardResponse, { headers });
    
  } catch (error) {
    console.error('❌ Next.js API Route Error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Internal server error',
      message: 'Failed to fetch dashboard data',
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
