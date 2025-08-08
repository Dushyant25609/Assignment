export interface Bookmark {
  id: string
  title: string
  url: string
  description?: string
  summary?: string
  favicon?: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface CreateBookmarkRequest {
  title: string
  url: string
  description?: string
}

export interface UpdateBookmarkRequest {
  title?: string
  url?: string
  description?: string
}

export interface BookmarkResponse {
  bookmarks: Bookmark[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
