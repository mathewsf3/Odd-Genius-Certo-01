/**
 * 🎯 Match Analysis API Route - Next.js API Route Handler
 * 
 * Proxies requests to backend /api/v1/matches/:id/analysis
 * Handles comprehensive match analysis data with proper caching
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, MatchAnalysis } from '@/types/api';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = params.id;
    const { searchParams } = new URL(request.url);
    
    // Validate match ID
    if (!matchId || isNaN(Number(matchId))) {
      return NextResponse.json({
        success: false,
        error: 'Invalid match ID format',
        code: 'VALIDATION_ERROR',
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }
    
    console.log('🎯 Next.js API Route - Match analysis request:', { matchId });
    
    // Build backend URL with query parameters
    const backendUrl = new URL(`${BACKEND_URL}/api/v1/matches/${matchId}/analysis`);
    
    // Forward query parameters
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value);
    });
    
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
    console.log('✅ Match analysis data received:', {
      success: data.success,
      matchId: data.data?.matchId || matchId,
      hasH2H: !!data.data?.h2hMatches,
      hasPredictions: !!data.data?.predictions,
    });
    
    // Ensure proper response format
    const analysisResponse: ApiResponse<MatchAnalysis> = {
      success: true,
      data: data.data,
      message: data.message || `Match ${matchId} analysis retrieved successfully`,
    };
    
    // Set cache headers for analysis data (longer TTL since it's less volatile)
    const headers = new Headers({
      'Cache-Control': 'public, max-age=600, s-maxage=600', // 10 minutes cache
      'Content-Type': 'application/json',
    });
    
    return NextResponse.json(analysisResponse, { headers });
    
  } catch (error) {
    console.error('❌ Next.js API Route Error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Internal server error',
      message: 'Failed to fetch match analysis data',
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
