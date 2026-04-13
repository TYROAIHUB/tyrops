import { useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"

// Renders a number that smoothly tweens to `value` whenever it changes.
// formatter: (n: number) => string (default: integer)
export function AnimatedCounter({ value, formatter, duration = 1.2, className = "" }) {
  const target = Number(value || 0)
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 80, damping: 20, duration: duration * 1000 })
  const display = useTransform(spring, (latest) =>
    typeof formatter === "function" ? formatter(latest) : Math.round(latest).toLocaleString()
  )

  useEffect(() => {
    mv.set(target)
  }, [target, mv])

  return <motion.span className={className}>{display}</motion.span>
}
