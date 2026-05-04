import { Loader2 } from "lucide-react"

interface PageLoaderProps {
  message?: string
  size?: "sm" | "md" | "lg"
}

export function PageLoader({ message = "Loading...", size = "md" }: PageLoaderProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  const messageSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`animate-spin text-apricot ${sizeClasses[size]} mb-4`} />
      <p className={`text-muted-foreground ${messageSizeClasses[size]}`}>
        {message}
      </p>
    </div>
  )
}
