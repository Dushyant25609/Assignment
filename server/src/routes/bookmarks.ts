import { Router } from 'express'
import { BookmarkService } from '../services/bookmarkService'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Apply authentication middleware to all bookmark routes
router.use(authenticateToken)

// Create a new bookmark
router.post('/', async (req, res) => {
  try {
    const { title, url, description } = req.body
    const userId = (req as any).user.userId

    if (!title || !url) {
      return res.status(400).json({ 
        message: 'Title and URL are required' 
      })
    }

    const bookmark = await BookmarkService.createBookmark(userId, {
      title,
      url,
      description
    })

    return res.status(201).json(bookmark)
  } catch (error) {
    console.error('Create bookmark error:', error)
    return res.status(500).json({ 
      message: 'Failed to create bookmark' 
    })
  }
})

// Get user's bookmarks with pagination
router.get('/', async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    const result = await BookmarkService.getUserBookmarks(userId, page, limit)
    return res.json(result)
  } catch (error) {
    console.error('Get bookmarks error:', error)
    return res.status(500).json({ 
      message: 'Failed to fetch bookmarks' 
    })
  }
})

// Search bookmarks
router.get('/search', async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const query = req.query.q as string
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    if (!query) {
      return res.status(400).json({ 
        message: 'Search query is required' 
      })
    }

    const result = await BookmarkService.searchBookmarks(userId, query, page, limit)
    return res.json(result)
  } catch (error) {
    console.error('Search bookmarks error:', error)
    return res.status(500).json({ 
      message: 'Failed to search bookmarks' 
    })
  }
})

// Get a specific bookmark
router.get('/:id', async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const { id } = req.params

    const bookmark = await BookmarkService.getBookmarkById(id, userId)
    
    if (!bookmark) {
      return res.status(404).json({ 
        message: 'Bookmark not found' 
      })
    }

    return res.json(bookmark)
  } catch (error) {
    console.error('Get bookmark error:', error)
    return res.status(500).json({ 
      message: 'Failed to fetch bookmark' 
    })
  }
})

// Update a bookmark
router.put('/:id', async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const { id } = req.params
    const { title, url, description } = req.body

    const result = await BookmarkService.updateBookmark(id, userId, {
      title,
      url,
      description
    })

    if (result.count === 0) {
      return res.status(404).json({ 
        message: 'Bookmark not found' 
      })
    }

    // Fetch updated bookmark
    const updatedBookmark = await BookmarkService.getBookmarkById(id, userId)
    return res.json(updatedBookmark)
  } catch (error) {
    console.error('Update bookmark error:', error)
    return res.status(500).json({ 
      message: 'Failed to update bookmark' 
    })
  }
})

// Delete a bookmark
router.delete('/:id', async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const { id } = req.params

    const result = await BookmarkService.deleteBookmark(id, userId)

    if (result.count === 0) {
      return res.status(404).json({ 
        message: 'Bookmark not found' 
      })
    }

    return res.status(204).send()
  } catch (error) {
    console.error('Delete bookmark error:', error)
    return res.status(500).json({ 
      message: 'Failed to delete bookmark' 
    })
  }
})

export default router
