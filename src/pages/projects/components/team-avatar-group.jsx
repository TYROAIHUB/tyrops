import { useState, useRef } from "react"
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react"

// Soft Egg Pastels
const COLORS = [
  "#f7c7d9", // soft pink
  "#cfeee6", // soft mint
  "#d8cff7", // soft lavender
  "#ffe8a3", // soft yellow
  "#bfe0ff", // soft blue
]

const TEXT_COLORS = [
  "#b05070", // pink → koyu gül
  "#3a8a6a", // mint → koyu yeşil
  "#6a50c0", // lavender → koyu mor
  "#a07800", // yellow → koyu altın
  "#2a6aaa", // blue → koyu mavi
]

const getColorIndex = (name) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return Math.abs(hash) % COLORS.length
}

const getColor = (name) => COLORS[getColorIndex(name)]
const getTextColor = (name) => TEXT_COLORS[getColorIndex(name)]

const getInitials = (name) => {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export function TeamAvatarGroup({ team = [], max = 2 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const springConfig = { stiffness: 100, damping: 15 }
  const x = useMotionValue(0)
  const animationFrameRef = useRef(null)
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig)
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig)

  if (!team.length) return <span className="text-muted-foreground text-sm">—</span>

  const visible = team.slice(0, max)
  const overflow = team.length - max

  const handleMouseMove = (event) => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    animationFrameRef.current = requestAnimationFrame(() => {
      const halfWidth = event.target.offsetWidth / 2
      x.set(event.nativeEvent.offsetX - halfWidth)
    })
  }

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((name) => (
        <div
          key={name}
          className="group relative -mr-1"
          onMouseEnter={() => setHoveredIndex(name)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === name && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 10 } }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{ translateX, rotate, whiteSpace: "nowrap" }}
                className="absolute -top-12 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-3 py-1.5 text-xs shadow-xl"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative z-30 text-sm font-bold text-white">{name}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <div
            onMouseMove={handleMouseMove}
            className="h-7 w-7 rounded-full ring-2 ring-background flex items-center justify-center text-[10px] font-bold shrink-0 cursor-pointer transition duration-500 group-hover:z-30 group-hover:scale-105"
            style={{ backgroundColor: getColor(name), color: getTextColor(name) }}
          >
            {getInitials(name)}
          </div>
        </div>
      ))}
      {overflow > 0 && (
        <div className="h-7 w-7 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground shrink-0">
          +{overflow}
        </div>
      )}
    </div>
  )
}
