/**
 * Verible API Configuration
 * 
 * Configuration for Verible backend API integration
 * Base URL: https://verible-backend.vercel.app
 * Documentation: https://documenter.getpostman.com/view/36179911/2sB3QMK8Z5#620f27da-eb25-4320-bbc4-beddb661fa45
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://verible-backend.vercel.app',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      VERIFY: '/api/auth/verify',
      REFRESH: '/api/auth/refresh',
      LOGOUT: '/api/auth/logout',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE: '/user/profile',
    },
    SELLERS: {
      LIST: '/sellers',
      DETAILS: '/sellers/:id',
      VERIFY: '/sellers/verify',
    },
  },
} as const;

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;
