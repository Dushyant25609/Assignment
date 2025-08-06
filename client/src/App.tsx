import { Routes, Route } from 'react-router-dom'

// Pages
import HomePage from '@/pages/HomePage'

function App() {
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
