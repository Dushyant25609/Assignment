import { useState, useEffect } from 'react'
import { AuthForm } from '@/components/AuthForm'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function AuthPage({ loginFlag = false }: { loginFlag?: boolean }) {
  const [isLogin, setIsLogin] = useState(loginFlag)
  const [isFlipping, setIsFlipping] = useState(false)
  const { login, register, isAuthenticated, isLoading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleToggle = () => {
    setIsFlipping(true)
    setTimeout(() => {
      setIsLogin(!isLogin)
      setTimeout(() => {
        setIsFlipping(false)
      }, 50)
    }, 150)
  }

  const handleSubmit = async (data: { email: string; password: string; name?: string }) => {
    try {
      if (isLogin) {
        await login(data.email, data.password)
        toast.success('Welcome back!')
      } else {
        await register(data.name || '', data.email, data.password)
        toast.success('Account created successfully!')
      }
      navigate('/')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-md">
        <div 
          className={`flip-card transform-gpu transition-all duration-300 ${
            isFlipping ? 'flipping' : ''
          }`}
        >
          <AuthForm 
            isLogin={isLogin} 
            onToggle={handleToggle} 
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-secondary/10 blur-3xl"></div>
      </div>
    </div>
  )
}
