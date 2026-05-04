import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ErrorStateProps {
  title?: string
  message?: string
  error?: string
  onRetry?: () => void
  showRetry?: boolean
  showHome?: boolean
}

export function ErrorState({ 
  title = "Something went wrong",
  message = "We encountered an error while loading this content.",
  error,
  onRetry,
  showRetry = true,
  showHome = true
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold text-fern mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      
      {error && process.env.NODE_ENV === 'development' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md">
          <p className="text-sm text-red-800 font-mono text-left">{error}</p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3">
        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        
        {showHome && (
          <Button asChild className="bg-apricot hover:bg-apricot/90 text-ivory">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
