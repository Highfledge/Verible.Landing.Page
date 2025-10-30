/**
 * Type Exports
 * 
 * Centralized exports for commonly used API types.
 * Re-export from generated types for easier imports.
 */

export type {
  // Auth types
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  
  // User types
  User,
  
  // Common types
  ApiError,
  ApiResponse,
} from './generated/types';

// Re-export all paths and components for advanced usage
export type { paths, components } from './generated/types';
