
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/ui/modal'
import { SearchBar } from '@/components/SearchBar'
import { BookmarkCard } from '@/components/BookmarkCard'
import { Header } from '@/components/Header'
import { Plus, FileText, Users, Leaf, Zap, Clock, Home, Code, Utensils, Lightbulb, MapPin } from 'lucide-react'

interface Bookmark {
  id: number
  title: string
  description: string
  icon: JSX.Element
  gradient: string
  url?: string
}

const initialBookmarks: Bookmark[] = [
  {
    id: 1,
    title: "The Future of AI in Software Development",
    description: "AI is transforming software development, automating tasks and enhancing efficiency. Learn about the latest trends and tools.",
    icon: <Code className="w-8 h-8" />,
    gradient: "from-purple-500 to-pink-600"
  },
  {
    id: 2,
    title: "Exploring the Metaverse: Opportunities and Challenges",
    description: "Dive into the metaverse, a digital frontier with vast potential. Explore its opportunities and challenges for businesses and individuals.",
    icon: <Zap className="w-8 h-8" />,
    gradient: "from-teal-500 to-blue-600"
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    description: "Embrace sustainable living with practical tips for reducing your environmental impact. Learn about eco-friendly products and practices.",
    icon: <Leaf className="w-8 h-8" />,
    gradient: "from-green-500 to-emerald-600"
  },
  {
    id: 4,
    title: "The Art of Effective Communication",
    description: "Improve your communication skills with proven techniques for effective interactions. Learn how to convey your message clearly and confidently.",
    icon: <Users className="w-8 h-8" />,
    gradient: "from-blue-500 to-cyan-600"
  },
  {
    id: 5,
    title: "Mastering Time Management for Productivity",
    description: "Boost your productivity by mastering time management techniques. Learn how to prioritize tasks and avoid distractions.",
    icon: <Clock className="w-8 h-8" />,
    gradient: "from-gray-500 to-slate-600"
  },
  {
    id: 6,
    title: "The Rise of Remote Work: Best Practices and Tools",
    description: "Remote work is on the rise. Discover best practices and tools for successful remote collaboration and productivity.",
    icon: <Home className="w-8 h-8" />,
    gradient: "from-orange-500 to-red-600"
  },
  {
    id: 7,
    title: "Understanding Blockchain Technology and its Applications",
    description: "Understand the fundamentals of blockchain technology and its diverse applications beyond cryptocurrency.",
    icon: <FileText className="w-8 h-8" />,
    gradient: "from-indigo-500 to-purple-600"
  },
  {
    id: 8,
    title: "Healthy Eating Habits for a Balanced Diet",
    description: "Adopt healthy eating habits and improved well-being. Learn about essential nutrients and meal planning.",
    icon: <Utensils className="w-8 h-8" />,
    gradient: "from-yellow-500 to-orange-600"
  },
  {
    id: 9,
    title: "The Power of Mindfulness and Meditation",
    description: "Discover the power of mindfulness and meditation for stress reduction and mental clarity. Learn simple techniques to incorporate into your daily routine.",
    icon: <Lightbulb className="w-8 h-8" />,
    gradient: "from-rose-500 to-pink-600"
  },
  {
    id: 10,
    title: "Travel Guide: Hidden Gems in Southeast Asia",
    description: "Explore the hidden gems of Southeast Asia with this comprehensive travel guide. Discover unique destinations and cultural experiences.",
    icon: <MapPin className="w-8 h-8" />,
    gradient: "from-emerald-500 to-teal-600"
  }
]

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newBookmark, setNewBookmark] = useState({
    title: '',
    description: '',
    url: ''
  })

  // Initialize dark mode on component mount
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode')
    const isDarkMode = savedMode === 'true' || 
      (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    setDarkMode(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    
    // Apply dark mode to document root
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleAddBookmark = () => {
    if (newBookmark.title && newBookmark.description) {
      const bookmark: Bookmark = {
        id: Date.now(),
        title: newBookmark.title,
        description: newBookmark.description,
        url: newBookmark.url,
        icon: <FileText className="w-8 h-8" />,
        gradient: "from-blue-500 to-purple-600"
      }
      
      setBookmarks([...bookmarks, bookmark])
      setNewBookmark({ title: '', description: '', url: '' })
      setIsModalOpen(false)
    }
  }

  // Filter bookmarks based on search term
  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                My Bookmarks
              </h2>
              <div className="flex items-center gap-4">
                <SearchBar 
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  placeholder="Search bookmarks..."
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
                <p className="text-muted-foreground text-lg">
                  {searchTerm ? 'No bookmarks found matching your search.' : 'No bookmarks yet. Add your first bookmark!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    title={bookmark.title}
                    description={bookmark.description}
                    icon={bookmark.icon}
                    gradient={bookmark.gradient}
                    onClick={() => {
                      if (bookmark.url) {
                        window.open(bookmark.url, '_blank')
                      } else {
                        console.log(`Clicked on ${bookmark.title}`)
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Bookmark"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title
              </label>
              <Input
                value={newBookmark.title}
                onChange={(e) => setNewBookmark({...newBookmark, title: e.target.value})}
                placeholder="Enter bookmark title"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <Textarea
                value={newBookmark.description}
                onChange={(e) => setNewBookmark({...newBookmark, description: e.target.value})}
                placeholder="Enter bookmark description"
                className="w-full"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                URL (optional)
              </label>
              <Input
                value={newBookmark.url}
                onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
                placeholder="https://example.com"
                className="w-full"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddBookmark}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Add Bookmark
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
