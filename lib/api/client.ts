import axios from 'axios'
import { API_CONFIG, API_HEADERS } from './config'
import { getStoredToken } from '../stores/auth-store'


// Create axios instance
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_HEADERS,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      if (typeof window !== 'undefined') {
        // Clear auth store
        import('../stores/auth-store').then(({ useAuthStore }) => {
          useAuthStore.getState().clearAuth()
        })
        window.location.href = '/auth?mode=login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API functions
export const authAPI = {
  // Register user
  register: async (data: {
    name: string
    email: string
    password: string
    role: string
    phone: string
    verificationMethod: string
  }) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data)
    return response.data
  },

  // Verify email
  verify: async (data: {
    code: string
    emailOrPhone: string
  }) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY, data)
    return response.data
  },

  // Resend verification code
  resendVerification: async (data: {
    emailOrPhone: string
    method: string
  }) => {
    const response = await apiClient.post('/auth/verify/resend', data)
    return response.data
  },

  // Login user
  login: async (data: {
    emailOrPhone: string
    password: string
  }) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, data)
    return response.data
  },

  // Forgot password
  forgotPassword: async (data: {
    emailOrPhone: string
    method: string
  }) => {
    const response = await apiClient.post('/api/auth/password/forgot', data)
    return response.data
  },

  // Reset password
  resetPassword: async (data: {
    resetToken: string
    newPassword: string
    emailOrPhone: string
  }) => {
    const response = await apiClient.post('/api/auth/password/reset', data)
    return response.data
  },

  // Delete current user account
  deleteAccount: async () => {
    const response = await apiClient.delete('/api/auth/me')
    return response.data
  },

  // Get current user profile
  getMe: async () => {
    const response = await apiClient.get('/api/auth/me')
    return response.data
  }
}

// Sellers API functions
export const sellersAPI = {
  // Extract seller profile (for logged in users)
  extractProfile: async (data: { profileUrl: string }) => {
    console.log("----->>>>>>", data)
    const response = await apiClient.post('/api/sellers/extract-profile', data)
    return response.data
  },

  // Get seller score by URL (for non-logged in users)
  scoreByUrl: async (data: { profileUrl: string }) => {
    console.log("----->>>>>>", data)
    const response = await apiClient.post('/api/sellers/score-by-url', data)
    return response.data
  },

  // Get top sellers
  getTopSellers: async (params?: {
    search?: string
    limit?: number
    offset?: number
  }) => {
    const response = await apiClient.get('/api/sellers/top', { params })
    return response.data
  },

  // Get all sellers
  getAllSellers: async (params?: {
    search?: string
    limit?: number
    offset?: number
  }) => {
    const response = await apiClient.get('/api/sellers/all', { params })
    return response.data
  },

  // Flag a seller
  flagSeller: async (sellerId: string, reason: string) => {
    const response = await apiClient.post(`/api/sellers/${sellerId}/flag`, {
      reason
    })
    return response.data
  },

  // Endorse a seller
  endorseSeller: async (sellerId: string, reason: string) => {
    const response = await apiClient.post(`/api/sellers/${sellerId}/endorse`, {
      reason
    })
    return response.data
  },

  // Delete a flag
  deleteFlag: async (sellerId: string) => {
    const response = await apiClient.delete(`/api/sellers/${sellerId}/flag`)
    return response.data
  },

  // Delete an endorsement
  deleteEndorsement: async (sellerId: string) => {
    const response = await apiClient.delete(`/api/sellers/${sellerId}/flag/endorse`)
    return response.data
  },

  // Become a seller (claim profile)
  becomeSeller: async (payload: { platform: string; profileUrl: string }) => {
    const response = await apiClient.post('/api/sellers/become-seller', payload)
    return response.data
  }
}

export const usersAPI = {
  // Update user profile (currently name only)
  updateProfile: async (payload: { name: string }) => {
    const response = await apiClient.put('/api/users/profile', payload)
    return response.data
  },

  // Get my feedback history
  getMyFeedback: async () => {
    const response = await apiClient.get('/api/users/my-feedback')
    return response.data
  },

  // Get my interactions (flags and endorsements)
  getMyInteractions: async () => {
    const response = await apiClient.get('/api/users/my-interactions')
    return response.data
  }
}
