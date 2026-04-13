import { useRef, useCallback } from "react"
import { useTheme } from "@/hooks/use-theme"

export function useCircularTransition() {
  const { theme, setTheme } = useTheme()
  const isTransitioningRef = useRef(false)

  const startTransition = useCallback((coords, callback) => {
    if (isTransitioningRef.current) return

    isTransitioningRef.current = true

    // Set CSS variables for the circular reveal animation - exactly like tweakcn
    const x = (coords.x / window.innerWidth) * 100
    const y = (coords.y / window.innerHeight) * 100

    // Set the CSS variables on document element
    document.documentElement.style.setProperty('--x', `${x}%`)
    document.documentElement.style.setProperty('--y', `${y}%`)

    // Check if View Transitions API is supported
    if ('startViewTransition' in document) {
      const transition = document.startViewTransition(() => {
        callback()
      })

      transition.finished.finally(() => {
        isTransitioningRef.current = false
      })
    } else {
      // Fallback for browsers without View Transitions API
      callback()
      setTimeout(() => {
        isTransitioningRef.current = false
      }, 400)
    }
  }, [])

  const toggleTheme = useCallback((event) => {
    // Get precise click coordinates - use clientX/clientY directly like tweakcn
    const coords = {
      x: event.clientX,
      y: event.clientY
    }

    startTransition(coords, () => {
      setTheme(theme === "dark" ? "light" : "dark")
    })
  }, [theme, setTheme, startTransition])

  const isTransitioning = useCallback(() => {
    return isTransitioningRef.current
  }, [])

  return {
    startTransition,
    toggleTheme,
    isTransitioning
  }
}
