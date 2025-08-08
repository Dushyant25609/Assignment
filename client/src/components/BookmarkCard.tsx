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
        "border-border bg-card text-card-foreground hover:bg-card/95 dark:hover:bg-card/90",
        "transform-gpu will-change-transform h-96 flex flex-col overflow-hidden shadow-sm dark:shadow-lg",
        "hover:border-border/60 dark:hover:border-border/80",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="p-4 flex-shrink-0">
        <div 
          className={cn(
            "w-full h-24 rounded-lg mb-3 flex items-center justify-center shadow-inner",
            "transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg",
            imageUrl ? "bg-cover bg-center" : `bg-gradient-to-br ${gradient}`
          )}
          {...(imageUrl && { style: { backgroundImage: `url(${imageUrl})` } })}
        >
          {!imageUrl && (
            <div className="text-white text-3xl drop-shadow-sm">
              {icon}
            </div>
          )}
        </div>
        <CardTitle className="text-base font-semibold line-clamp-2 text-foreground group-hover:text-foreground/90">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto min-h-0 pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-muted/20 dark:scrollbar-thumb-muted-foreground/50 dark:scrollbar-track-muted/30">
          <CardDescription className="text-sm text-muted-foreground whitespace-pre-wrap break-words leading-relaxed overflow-wrap-anywhere">
            {description || (
              <span className="text-muted-foreground/60 italic">Loading summary...</span>
            )}
          </CardDescription>
        </div>
        {description && description.length > 100 && (
          <div className="mt-2 pt-2 border-t border-border/50 text-xs text-primary/70 dark:text-primary/80 flex-shrink-0 font-medium">
            ✨ AI-generated content
          </div>
        )}
      </CardContent>
    </Card>
  )
}
