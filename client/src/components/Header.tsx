import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Moon, Sun, User, LogIn } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

export function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout()
    } else {
      navigate('/auth')
    }
  }

  return (
    <header className="flex items-center justify-between p-6 border-b border-border bg-background">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">L</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">
          LinkSaver
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-full"
        >
          {darkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        
        {isAuthenticated && user ? (
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name?.charAt(0) || <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAuthClick}
              className="text-sm"
            >
              Sign out
            </Button>
          </div>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={handleAuthClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign in
          </Button>
        )}
      </div>
    </header>
  )
}
