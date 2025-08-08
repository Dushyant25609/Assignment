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
  summary?: string
  favicon?: string
}

export interface BookmarkWithSummary extends Bookmark {
  summary: string
}
