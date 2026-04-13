import { useState, useEffect, useCallback, useRef } from "react"

export function useScrollFade(scrollRef) {
  const [showFade, setShowFade] = useState(true)
  const rafId = useRef(null)

  const handleScroll = useCallback(() => {
    if (rafId.current) return
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null
      if (!scrollRef.current) return
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      setShowFade(scrollTop + clientHeight < scrollHeight - 10)
    })
  }, [scrollRef])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    handleScroll()
    el.addEventListener("scroll", handleScroll, { passive: true })
    const ro = new ResizeObserver(handleScroll)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", handleScroll)
      ro.disconnect()
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [scrollRef, handleScroll])

  return showFade
}
