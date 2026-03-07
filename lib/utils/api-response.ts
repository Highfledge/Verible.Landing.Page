/**
 * API Response Utilities
 * 
 * Provides consistent error handling and response formatting for API endpoints.
 * Ensures all responses follow the ApiResponse interface structure.
 */

import { NextResponse } from 'next/server'
import { ApiResponse } from '@/lib/types/api'

/**
 * Create a successful API response
 * 
 * @param data - Response data
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with success structure
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data
    } as ApiResponse<T>,
    { status }
  )
}

/**
 * Create an error API response
 * 
 * @param message - Error message
 * @param status - HTTP status code (default: 500)
 * @returns NextResponse with error structure
 */
export function errorResponse(message: string, status: number = 500): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message
    } as ApiResponse<null>,
    { status }
  )
}

/**
 * Create a validation error response
 * 
 * @param message - Validation error message
 * @returns NextResponse with 400 status
 */
export function validationError(message: string): NextResponse {
  return errorResponse(message, 400)
}

/**
 * Create an unauthorized error response
 * 
 * @param message - Unauthorized message (default: 'Unauthorized')
 * @returns NextResponse with 401 status
 */
export function unauthorizedError(message: string = 'Unauthorized'): NextResponse {
  return errorResponse(message, 401)
}

/**
 * Create a forbidden error response
 * 
 * @param message - Forbidden message (default: 'Forbidden')
 * @returns NextResponse with 403 status
 */
export function forbiddenError(message: string = 'Forbidden'): NextResponse {
  return errorResponse(message, 403)
}

/**
 * Create a not found error response
 * 
 * @param message - Not found message (default: 'Resource not found')
 * @returns NextResponse with 404 status
 */
export function notFoundError(message: string = 'Resource not found'): NextResponse {
  return errorResponse(message, 404)
}

/**
 * Handle database query errors
 * 
 * @param error - Error object
 * @param context - Context description for logging
 * @returns NextResponse with appropriate error message
 */
export function handleDatabaseError(error: any, context: string): NextResponse {
  console.error(`Database error in ${context}:`, error)
  
  // Check for specific database errors
  if (error.code === 'ECONNREFUSED') {
    return errorResponse('Database connection failed', 503)
  }
  
  if (error.code === 'ER_NO_SUCH_TABLE' || error.code === '42P01') {
    return errorResponse('Database table not found', 500)
  }
  
  // Generic database error
  return errorResponse(
    `Failed to ${context}: ${error.message || 'Database error'}`,
    500
  )
}

/**
 * Handle API errors with consistent logging and response
 * 
 * @param error - Error object
 * @param context - Context description for logging
 * @returns NextResponse with error structure
 */
export function handleApiError(error: any, context: string): NextResponse {
  console.error(`Error in ${context}:`, error)
  
  // Handle known error types
  if (error.name === 'ValidationError') {
    return validationError(error.message)
  }
  
  if (error.name === 'UnauthorizedError') {
    return unauthorizedError(error.message)
  }
  
  if (error.name === 'NotFoundError') {
    return notFoundError(error.message)
  }
  
  // Generic error
  return errorResponse(
    error.message || 'Internal server error',
    error.status || 500
  )
}

/**
 * Wrap async API handler with error handling
 * 
 * @param handler - Async handler function
 * @param context - Context description for error logging
 * @returns Wrapped handler with error handling
 */
export function withErrorHandling(
  handler: () => Promise<NextResponse>,
  context: string
): Promise<NextResponse> {
  return handler().catch((error) => handleApiError(error, context))
}
