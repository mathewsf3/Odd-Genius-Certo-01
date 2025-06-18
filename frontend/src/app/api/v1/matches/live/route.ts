/**
 * 🎯 Live Matches API Route - Next.js API Route Handler
 * 
 * Proxies requests to backend /api/v1/matches/live
 * Handles real-time live match data with short caching
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, LiveMatch } from '@/types/api';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const forceRefresh = searchParams.get('forceRefresh') === 'true';
    
    console.log('🎯 Next.js API Route - Live matches request:', { limit, forceRefresh });
    
    // Build backend URL with parameters
    const backendUrl = new URL(`${BACKEND_URL}/api/v1/matches/live`);
    if (limit) {
      backendUrl.searchParams.set('limit', limit);
    }
    if (forceRefresh) {
      backendUrl.searchParams.set('forceRefresh', 'true');
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
    console.log('✅ Live matches data received:', {
      success: data.success,
      totalLive: data.data?.totalLive || data.data?.liveMatches?.length || 0,
      isLimited: data.data?.isLimited,
      lastUpdated: data.data?.lastUpdated,
    });
    
    // Ensure proper response format
    const liveMatchesResponse: ApiResponse<{
      liveMatches: LiveMatch[];
      totalLive: number;
      lastUpdated: string;
      nextUpdate?: string;
      isLimited: boolean;
      limit: number | null;
    }> = {
      success: true,
      data: {
        liveMatches: data.data?.liveMatches || [],
        totalLive: data.data?.totalLive || data.data?.liveMatches?.length || 0,
        lastUpdated: data.data?.lastUpdated || new Date().toISOString(),
        nextUpdate: data.data?.nextUpdate,
        isLimited: data.data?.isLimited || false,
        limit: data.data?.limit || null,
      },
      message: data.message || 'Live matches retrieved successfully',
    };
    
    // Set cache headers for live data (very short TTL)
    const headers = new Headers({
      'Cache-Control': 'public, max-age=15, s-maxage=15', // 15 seconds cache for live data
      'Content-Type': 'application/json',
    });
    
    return NextResponse.json(liveMatchesResponse, { headers });
    
  } catch (error) {
    console.error('❌ Next.js API Route Error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Internal server error',
      message: 'Failed to fetch live matches data',
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
