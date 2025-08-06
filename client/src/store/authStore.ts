import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/types'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
  initializeAuth: () => void
  updateUser: (userData: Partial<User>) => void
  setAuth: (user: User, token: string) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authService.login({ email, password })
          const { user, token } = response.data
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          
          toast.success(`Welcome back, ${user.name}!`)
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed'
          set({
            isLoading: false,
            error: errorMessage,
          })
          toast.error(errorMessage)
          throw error
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authService.register({ name, email, password })
          const { user, token } = response.data
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          
          toast.success(`Welcome, ${user.name}!`)
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed'
          set({
            isLoading: false,
            error: errorMessage,
          })
          toast.error(errorMessage)
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
        
        // Clear token from localStorage
        localStorage.removeItem('auth-storage')
        
        toast.success('Logged out successfully')
      },

      clearError: () => {
        set({ error: null })
      },

      initializeAuth: () => {
        const state = get()
        if (state.token && state.user) {
          set({ isAuthenticated: true })
        }
      },

      updateUser: (userData: Partial<User>) => {
        const state = get()
        if (state.user) {
          set({
            user: { ...state.user, ...userData },
          })
        }
      },

      setAuth: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
