import { Routes, Route } from 'react-router-dom'

// Pages
import AuthPage from '@/pages/AuthPage'
import BookmarksPage from '@/pages/BookmarksPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'

function App() {
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<BookmarksPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
