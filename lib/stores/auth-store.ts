import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Secure storage using sessionStorage instead of localStorage
const secureStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null
    try {
      return sessionStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string) => {
    if (typeof window === 'undefined') return
    try {
      sessionStorage.setItem(name, value)
    } catch {
      // Silently fail if storage is not available
    }
  },
  removeItem: (name: string) => {
    if (typeof window === 'undefined') return
    try {
      sessionStorage.removeItem(name)
    } catch {
      // Silently fail if storage is not available
    }
  },
}

export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'seller' | 'admin'
  phone?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

interface AuthState {
  // State
  isAuthenticated: boolean
  user: User | null
  token: string | null
  isLoading: boolean
  
  // Actions
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,

      // Actions
      login: (token: string, user: User) => {
        set({
          isAuthenticated: true,
          token,
          user,
          isLoading: false,
        })
      },

      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
          user: null,
          isLoading: false,
        })
        // Clear from secure storage
        secureStorage.removeItem('auth-storage')
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData }
          })
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      clearAuth: () => {
        set({
          isAuthenticated: false,
          token: null,
          user: null,
          isLoading: false,
        })
        secureStorage.removeItem('auth-storage')
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      // Only persist essential data, not loading states
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
)

// Helper functions for easy access
export const useAuth = () => {
  const store = useAuthStore()
  return {
    ...store,
    // Convenience getters
    isLoggedIn: store.isAuthenticated && !!store.token,
    userName: store.user?.name || '',
    userEmail: store.user?.email || '',
    userRole: store.user?.role || 'user',
  }
}

// Token management utilities
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    const authData = secureStorage.getItem('auth-storage')
    if (authData) {
      const parsed = JSON.parse(authData)
      return parsed.state?.token || null
    }
  } catch {
    // Silently fail
  }
  return null
}

export const clearStoredAuth = (): void => {
  if (typeof window === 'undefined') return
  try {
    secureStorage.removeItem('auth-storage')
  } catch {
    // Silently fail
  }
}
