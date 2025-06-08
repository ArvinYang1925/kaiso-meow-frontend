import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ScreenLoadingProps {
  isLoading: boolean
  message?: string
  className?: string
  portal?: boolean
  delay?: number
}

export const ScreenLoading = ({ 
  isLoading, 
  message = "載入中...", 
  className,
  portal = true,
  delay = 200
}: ScreenLoadingProps) => {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowLoading(true)
      }, delay)
    } else {
      setShowLoading(false)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isLoading, delay])

  if (!showLoading) return null

  const loadingElement = (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-background/80 backdrop-blur-sm",
        "animate-in fade-in-0 duration-300",
        className
      )}
      role="status" 
      aria-live="polite"
    >
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-orange-400" />
        <p className="text-sm text-white font-medium max-w-xs text-center drop-shadow-sm">
          {message}
        </p>
      </div>
    </div>
  )

  if (portal) {
    return createPortal(loadingElement, document.body)
  }

  return loadingElement
}