/**
 * 🎯 Match Details API Route - Next.js API Route Handler
 * 
 * Proxies requests to backend /api/v1/matches/:id
 * Handles match-specific data retrieval with proper error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Match } from '@/types/api';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = params.id;
    
    // Validate match ID
    if (!matchId || isNaN(Number(matchId))) {
      return NextResponse.json({
        success: false,
        error: 'Invalid match ID format',
        code: 'VALIDATION_ERROR',
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }
    
    console.log('🎯 Next.js API Route - Match details request:', { matchId });
    
    // Build backend URL
    const backendUrl = `${BACKEND_URL}/api/v1/matches/${matchId}`;
    
    console.log('📡 Proxying to backend:', backendUrl);
    
    // Make request to backend
    const response = await fetch(backendUrl, {
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
      
      // Return 502 Bad Gateway for backend errors (not 404)
      // This distinguishes between missing resources and provider errors
      const statusCode = response.status === 404 ? 502 : response.status;
      
      return NextResponse.json({
        success: false,
        error: errorData.message || 'Backend API error',
        code: 'BACKEND_ERROR',
        timestamp: new Date().toISOString(),
      }, { status: statusCode });
    }
    
    const data = await response.json();
    console.log('✅ Match data received:', {
      success: data.success,
      matchId: data.data?.id || matchId,
      status: data.data?.status,
    });
    
    // Ensure proper response format
    const matchResponse: ApiResponse<Match> = {
      success: true,
      data: data.data,
      message: data.message || `Match ${matchId} retrieved successfully`,
    };
    
    // Set cache headers based on match status
    const match = data.data;
    const isLive = match?.status === 'live';
    const cacheMaxAge = isLive ? 30 : 300; // 30s for live, 5min for others
    
    const headers = new Headers({
      'Cache-Control': `public, max-age=${cacheMaxAge}, s-maxage=${cacheMaxAge}`,
      'Content-Type': 'application/json',
    });
    
    return NextResponse.json(matchResponse, { headers });
    
  } catch (error) {
    console.error('❌ Next.js API Route Error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Internal server error',
      message: 'Failed to fetch match data',
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
