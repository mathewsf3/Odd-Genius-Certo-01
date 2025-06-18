/**
 * 🎯 Upcoming Matches API Route - Next.js API Route Handler
 * 
 * Proxies requests to backend /api/v1/matches/upcoming
 * Handles upcoming match data with appropriate caching
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, UpcomingMatch } from '@/types/api';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const hours = searchParams.get('hours') || '48';
    const timezone = searchParams.get('timezone') || 'America/Sao_Paulo';
    
    console.log('🎯 Next.js API Route - Upcoming matches request:', { limit, hours, timezone });
    
    // Build backend URL with parameters
    const backendUrl = new URL(`${BACKEND_URL}/api/v1/matches/upcoming`);
    if (limit) {
      backendUrl.searchParams.set('limit', limit);
    }
    backendUrl.searchParams.set('hours', hours);
    backendUrl.searchParams.set('timezone', timezone);
    
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
    console.log('✅ Upcoming matches data received:', {
      success: data.success,
      totalUpcoming: data.data?.length || 0,
      isLimited: data.isLimited,
      hours: data.hours,
    });
    
    // Ensure proper response format
    const upcomingMatchesResponse: ApiResponse<{
      upcomingMatches: UpcomingMatch[];
      totalUpcoming: number;
      isLimited: boolean;
      limit: number | null;
      hours: number;
      timezone: string;
    }> = {
      success: true,
      data: {
        upcomingMatches: data.data || [],
        totalUpcoming: data.data?.length || 0,
        isLimited: data.isLimited || false,
        limit: data.limit || null,
        hours: parseInt(data.hours || hours),
        timezone: timezone,
      },
      message: data.message || 'Upcoming matches retrieved successfully',
    };
    
    // Set cache headers for upcoming matches (moderate TTL)
    const headers = new Headers({
      'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 minutes cache
      'Content-Type': 'application/json',
    });
    
    return NextResponse.json(upcomingMatchesResponse, { headers });
    
  } catch (error) {
    console.error('❌ Next.js API Route Error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Internal server error',
      message: 'Failed to fetch upcoming matches data',
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
