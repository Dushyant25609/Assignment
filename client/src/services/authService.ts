import axios from 'axios'
import type { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse,
  User,
  ApiResponse 
} from '@/types'

const API_BASE_URL = 'http://localhost:5001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('auth-storage')
    if (authData) {
      try {
        const { state } = JSON.parse(authData)
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`
        }
      } catch (error) {
        console.warn('Failed to parse auth data from localStorage')
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid auth data
      localStorage.removeItem('auth-storage')
      // Optionally redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', credentials)
    return response.data
  },

  // OAuth methods
  initiateGoogleOAuth: () => {
    window.location.href = `${API_BASE_URL}/auth/google`
  },

  handleOAuthCallback: (token: string, userData: string): AuthResponse => {
    try {
      const user = JSON.parse(decodeURIComponent(userData))
      return {
        success: true,
        message: 'OAuth login successful',
        data: {
          user,
          token
        }
      }
    } catch (error) {
      throw new Error('Failed to parse OAuth callback data')
    }
  },

  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/me')
    return response.data
  },

  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.put('/auth/profile', userData)
    return response.data
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse> => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    })
    return response.data
  },
}

export { api }
