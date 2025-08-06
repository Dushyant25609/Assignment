// User types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'USER' | 'ADMIN' | 'MODERATOR'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
  }
}
// Component Props
export interface BaseProps {
  className?: string
  children?: React.ReactNode
}
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

// Loading states
export interface LoadingState {
  isLoading: boolean
  error: string | null
}
