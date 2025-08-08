import { Bookmark, CreateBookmarkRequest, UpdateBookmarkRequest, BookmarkResponse } from '@/types/bookmark'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api'

class BookmarkServiceClass {
  private getAuthHeaders(): HeadersInit {
    const authData = localStorage.getItem('auth-storage')
    let token = null
    
    if (authData) {
      try {
        const { state } = JSON.parse(authData)
        token = state.token
      } catch (error) {
        console.warn('Failed to parse auth data from localStorage')
      }
    }
    
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }
    return response.json()
  }

  /**
   * Create a new bookmark
   */
  async createBookmark(data: CreateBookmarkRequest): Promise<Bookmark> {
    const response = await fetch(`${API_BASE_URL}/bookmarks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    })

    return this.handleResponse<Bookmark>(response)
  }

  /**
   * Get user's bookmarks with pagination
   */
  async getBookmarks(page = 1, limit = 20): Promise<BookmarkResponse> {
    const response = await fetch(
      `${API_BASE_URL}/bookmarks?page=${page}&limit=${limit}`,
      {
        headers: this.getAuthHeaders()
      }
    )

    return this.handleResponse<BookmarkResponse>(response)
  }

  /**
   * Get a specific bookmark by ID
   */
  async getBookmarkById(id: string): Promise<Bookmark> {
    const response = await fetch(`${API_BASE_URL}/bookmarks/${id}`, {
      headers: this.getAuthHeaders()
    })

    return this.handleResponse<Bookmark>(response)
  }

  /**
   * Update a bookmark
   */
  async updateBookmark(id: string, data: UpdateBookmarkRequest): Promise<Bookmark> {
    const response = await fetch(`${API_BASE_URL}/bookmarks/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    })

    return this.handleResponse<Bookmark>(response)
  }

  /**
   * Delete a bookmark
   */
  async deleteBookmark(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bookmarks/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Delete failed' }))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }
  }

  /**
   * Search bookmarks
   */
  async searchBookmarks(query: string, page = 1, limit = 20): Promise<BookmarkResponse> {
    const response = await fetch(
      `${API_BASE_URL}/bookmarks/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      {
        headers: this.getAuthHeaders()
      }
    )

    return this.handleResponse<BookmarkResponse>(response)
  }
}

export const bookmarkService = new BookmarkServiceClass()
