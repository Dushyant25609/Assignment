import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/ui/modal'
import { SearchBar } from '@/components/SearchBar'
import { BookmarkCard } from '@/components/BookmarkCard'
import { Header } from '@/components/Header'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Plus, Trash2, ExternalLink, Globe } from 'lucide-react'
import { bookmarkService } from '@/services/bookmarkService'
import { jinaApi } from '@/services/jinaApi'
import { useAuthStore } from '@/store/authStore'
import { Bookmark, CreateBookmarkRequest } from '@/types/bookmark'

export default function BookmarksPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [darkMode, setDarkMode] = useState(false)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [newBookmark, setNewBookmark] = useState<CreateBookmarkRequest>({
    title: '',
    description: '',
    url: ''
  })
  const [isCreating, setIsCreating] = useState(false)

  // Initialize dark mode
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode')
    const isDarkMode = savedMode === 'true' || 
      (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    setDarkMode(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to auth...')
      navigate('/auth')
      return
    }
  }, [isAuthenticated, navigate])

  // Load bookmarks on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadBookmarks()
    }
  }, [isAuthenticated])

  // Filter bookmarks based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredBookmarks(bookmarks)
    } else {
      const filtered = bookmarks.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredBookmarks(filtered)
    }
  }, [bookmarks, searchTerm])

  const loadBookmarks = async () => {
    try {
      setIsLoading(true)
      const response = await bookmarkService.getBookmarks()
      setBookmarks(response.bookmarks)
    } catch (error) {
      console.error('Failed to load bookmarks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleAddBookmark = async () => {
    if (!newBookmark.title || !newBookmark.url) {
      return
    }

    try {
      setIsCreating(true)
      
      // Auto-fill title from URL if not provided
      let finalBookmark = { ...newBookmark }
      if (!finalBookmark.title.trim()) {
        finalBookmark.title = jinaApi.extractTitleFromUrl(finalBookmark.url)
      }

      const createdBookmark = await bookmarkService.createBookmark(finalBookmark)
      setBookmarks([createdBookmark, ...bookmarks])
      setNewBookmark({ title: '', description: '', url: '' })
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to create bookmark:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteBookmark = async (id: string) => {
    try {
      setIsDeleting(id)
      await bookmarkService.deleteBookmark(id)
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id))
      if (selectedBookmark?.id === id) {
        setIsDetailModalOpen(false)
        setSelectedBookmark(null)
      }
    } catch (error) {
      console.error('Failed to delete bookmark:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleBookmarkClick = (bookmark: Bookmark) => {
    setSelectedBookmark(bookmark)
    setIsDetailModalOpen(true)
  }

  const handleVisitUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (isLoading) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <LoadingSpinner className="w-8 h-8" />
        </div>
      </div>
    )
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                LinkSaver
              </h2>
              <div className="flex items-center gap-4">
                <SearchBar 
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  placeholder="Search by title..."
                />
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bookmark
                </Button>
              </div>
            </div>

            {filteredBookmarks.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg mb-2">
                  {searchTerm ? `No bookmarks found with title matching "${searchTerm}"` : 'Welcome to LinkSaver!'}
                </p>
                {!searchTerm && (
                  <p className="text-muted-foreground text-sm">
                    Start saving your favorite links with AI-powered summaries
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBookmarks.map((bookmark) => (
                  <div key={bookmark.id} className="relative group">
                    <BookmarkCard
                      title={bookmark.title}
                      description={bookmark.description || bookmark.summary || 'No description available'}
                      imageUrl={bookmark.favicon}
                      onClick={() => handleBookmarkClick(bookmark)}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleVisitUrl(bookmark.url)
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteBookmark(bookmark.id)
                          }}
                          disabled={isDeleting === bookmark.id}
                        >
                          {isDeleting === bookmark.id ? (
                            <LoadingSpinner className="w-4 h-4" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Add Bookmark Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Bookmark"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                URL *
              </label>
              <Input
                value={newBookmark.url}
                onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
                placeholder="https://example.com"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <Input
                value={newBookmark.title}
                onChange={(e) => setNewBookmark({...newBookmark, title: e.target.value})}
                placeholder="Enter bookmark title (auto-filled from URL if empty)"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description (optional)
              </label>
              <Textarea
                value={newBookmark.description}
                onChange={(e) => setNewBookmark({...newBookmark, description: e.target.value})}
                placeholder="Enter bookmark description"
                className="w-full"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddBookmark}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isCreating || !newBookmark.title || !newBookmark.url}
              >
                {isCreating ? (
                  <>
                    <LoadingSpinner className="w-4 h-4 mr-2" />
                    Creating...
                  </>
                ) : (
                  'Add Bookmark'
                )}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Bookmark Detail Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={selectedBookmark?.title || 'Bookmark Details'}
          size="lg"
        >
          {selectedBookmark && (
            <div className="space-y-6">
              {/* Header with URL and favicon */}
              <div className="bg-muted/50 dark:bg-muted/20 p-4 rounded-lg border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  {selectedBookmark.favicon && (
                    <img 
                      src={selectedBookmark.favicon} 
                      alt="Favicon" 
                      className="w-6 h-6 flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  )}
                  <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <a 
                      href={selectedBookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2 break-all"
                    >
                      <span className="truncate">{selectedBookmark.url}</span>
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    </a>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground/80">
                  Added on {new Date(selectedBookmark.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              
              {/* Description Section */}
              {selectedBookmark.description && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-lg text-foreground">Description</h4>
                    <div className="h-px bg-border flex-1"></div>
                  </div>
                  <div className="bg-card border border-border p-4 rounded-lg shadow-sm">
                    <p className="text-foreground/80 leading-relaxed break-words">
                      {selectedBookmark.description}
                    </p>
                  </div>
                </div>
              )}
              
              {/* AI Summary Section */}
              {selectedBookmark.summary && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-lg text-foreground">AI-Generated Summary</h4>
                    <div className="h-px bg-border flex-1"></div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      ✨ AI
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 p-4 rounded-lg border border-primary/20 dark:border-primary/30">
                    <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-primary/10 dark:scrollbar-thumb-primary/50 dark:scrollbar-track-primary/20">
                      <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
                        {selectedBookmark.summary}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground/70">Bookmark ID:</span> 
                  <span className="font-mono text-xs ml-1">{selectedBookmark.id.slice(0, 8)}...</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleVisitUrl(selectedBookmark.url)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all hover:shadow-md"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Site
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteBookmark(selectedBookmark.id)}
                    disabled={isDeleting === selectedBookmark.id}
                    className="shadow-sm transition-all hover:shadow-md"
                  >
                    {isDeleting === selectedBookmark.id ? (
                      <LoadingSpinner className="w-4 h-4 mr-2" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}
