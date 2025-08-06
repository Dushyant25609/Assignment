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

// Post types
export interface Post {
  id: string
  title: string
  content: string
  excerpt?: string
  slug: string
  published: boolean
  featuredImage?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  _count: {
    comments: number
    likes: number
  }
  isLiked?: boolean
}

export interface CreatePostData {
  title: string
  content: string
  excerpt?: string
  published: boolean
  featuredImage?: string
  tags: string[]
}

export interface UpdatePostData extends Partial<CreatePostData> {}

// Comment types
export interface Comment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    avatar?: string
  }
}

export interface CreateCommentData {
  content: string
  postId: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface PaginationData {
  page: number
  limit: number
  total: number
  pages: number
}

export interface PostsResponse {
  posts: Post[]
  pagination: PaginationData
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
}

// Component Props
export interface BaseProps {
  className?: string
  children?: React.ReactNode
}

// Loading states
export interface LoadingState {
  isLoading: boolean
  error: string | null
}
