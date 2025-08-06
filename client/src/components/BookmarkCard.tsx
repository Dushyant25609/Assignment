import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface BookmarkCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  imageUrl?: string
  gradient?: string
  className?: string
  onClick?: () => void
}

export function BookmarkCard({
  title,
  description,
  icon,
  imageUrl,
  gradient = "from-blue-500 to-purple-600",
  className,
  onClick
}: BookmarkCardProps) {
  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        "border-border bg-card text-card-foreground hover:bg-card/90",
        "transform-gpu will-change-transform",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="p-4">
        <div 
          className={cn(
            "w-full h-32 rounded-lg mb-4 flex items-center justify-center",
            "transition-all duration-300 group-hover:scale-105",
            imageUrl ? "bg-cover bg-center" : `bg-gradient-to-br ${gradient}`
          )}
          {...(imageUrl && { style: { backgroundImage: `url(${imageUrl})` } })}
        >
          {!imageUrl && (
            <div className="text-white text-4xl">
              {icon}
            </div>
          )}
        </div>
        <CardTitle className="text-lg font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
