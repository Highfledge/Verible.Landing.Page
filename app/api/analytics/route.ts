/**
 * Analytics API Routes
 * 
 * Provides endpoints for retrieving analytics data including:
 * - Overview metrics
 * - Trust distribution
 * - Platform coverage
 * - Platform performance
 * - Scoring criteria
 * - Platform summary
 * - Trust ecosystem metrics
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/middleware/auth'
import { ApiResponse } from '@/lib/types/api'

/**
 * GET /api/analytics
 * Returns a list of available analytics endpoints
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.message || 'Unauthorized'
        } as ApiResponse<null>,
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        endpoints: [
          '/api/analytics/overview',
          '/api/analytics/trust-distribution',
          '/api/analytics/platform-coverage',
          '/api/analytics/platform-performance',
          '/api/analytics/scoring-criteria',
          '/api/analytics/platform-summary',
          '/api/analytics/trust-ecosystem'
        ]
      }
    } as ApiResponse<{ endpoints: string[] }>)
  } catch (error: any) {
    console.error('Error in analytics endpoint:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Internal server error'
      } as ApiResponse<null>,
      { status: 500 }
    )
  }
}
