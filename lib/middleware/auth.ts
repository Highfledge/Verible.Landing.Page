/**
 * Authentication Middleware
 * 
 * Provides JWT token verification for protected API endpoints.
 * Validates the Authorization header and extracts user information.
 */

import { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export interface AuthResult {
  authenticated: boolean
  user?: {
    id: string
    email: string
    role: string
  }
  message?: string
}

/**
 * Verify JWT token from Authorization header
 * 
 * @param request - Next.js request object
 * @returns Authentication result with user data if successful
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Extract Authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return {
        authenticated: false,
        message: 'No authorization header provided'
      }
    }

    // Check Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      return {
        authenticated: false,
        message: 'Invalid authorization header format'
      }
    }

    // Extract token
    const token = authHeader.substring(7)
    
    if (!token) {
      return {
        authenticated: false,
        message: 'No token provided'
      }
    }

    // Get JWT secret from environment
    const jwtSecret = process.env.JWT_SECRET
    
    if (!jwtSecret) {
      console.error('JWT_SECRET not configured')
      return {
        authenticated: false,
        message: 'Server configuration error'
      }
    }

    // Verify token
    const secret = new TextEncoder().encode(jwtSecret)
    const { payload } = await jwtVerify(token, secret)

    // Extract user information from payload
    const userId = payload.sub || payload.userId as string
    const email = payload.email as string
    const role = payload.role as string

    if (!userId) {
      return {
        authenticated: false,
        message: 'Invalid token payload'
      }
    }

    return {
      authenticated: true,
      user: {
        id: userId,
        email: email || '',
        role: role || 'user'
      }
    }
  } catch (error: any) {
    console.error('Token verification error:', error)
    
    // Handle specific JWT errors
    if (error.code === 'ERR_JWT_EXPIRED') {
      return {
        authenticated: false,
        message: 'Token has expired'
      }
    }
    
    if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
      return {
        authenticated: false,
        message: 'Invalid token signature'
      }
    }

    return {
      authenticated: false,
      message: 'Token verification failed'
    }
  }
}

/**
 * Middleware wrapper for API routes
 * Returns 401 response if authentication fails
 */
export function withAuth(
  handler: (request: NextRequest, authResult: AuthResult) => Promise<Response>
) {
  return async (request: NextRequest) => {
    const authResult = await verifyAuth(request)
    
    if (!authResult.authenticated) {
      return new Response(
        JSON.stringify({
          success: false,
          message: authResult.message || 'Unauthorized'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    return handler(request, authResult)
  }
}
