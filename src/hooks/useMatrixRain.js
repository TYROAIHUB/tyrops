import { useEffect, useRef } from 'react'
import { FONT_SIZE, THEME, getRandomChar } from '../utils/matrixConfig'

const GLOW_RADIUS = 150 // px — mouse glow area
const COPYRIGHT_TEXT = '\u00A9 TTECH Business Solutions'

export function useMatrixRain(canvasRef) {
  const dropsRef = useRef([])
  const animFrameRef = useRef(null)
  const resizeTimerRef = useRef(null)
  const lastTimeRef = useRef(0)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const copyrightVisibleRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const FRAME_INTERVAL = 50

    function initDrops(columns) {
      const rows = Math.ceil(canvas.height / FONT_SIZE)
      return Array.from({ length: columns }, () =>
        Math.floor(Math.random() * -rows)
      )
    }

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const columns = Math.floor(canvas.width / FONT_SIZE)
      dropsRef.current = initDrops(columns)
      ctx.fillStyle = THEME.background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    function handleMouseMove(e) {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    function handleMouseLeave() {
      mouseRef.current.x = -1000
      mouseRef.current.y = -1000
    }

    function draw(timestamp) {
      animFrameRef.current = requestAnimationFrame(draw)

      if (timestamp - lastTimeRef.current < FRAME_INTERVAL) return
      lastTimeRef.current = timestamp

      const { width, height } = canvas
      const columns = Math.floor(width / FONT_SIZE)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      ctx.fillStyle = `rgba(0, 0, 0, ${THEME.fadeOpacity})`
      ctx.fillRect(0, 0, width, height)

      ctx.font = `${FONT_SIZE}px monospace`

      for (let i = 0; i < columns; i++) {
        const char = getRandomChar()
        const x = i * FONT_SIZE
        const y = dropsRef.current[i] * FONT_SIZE

        // Distance from mouse to this character
        const dx = x - mx
        const dy = y - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < GLOW_RADIUS) {
          // Proximity glow: closer = brighter
          const intensity = 1 - dist / GLOW_RADIUS
          const r = Math.round(intensity * 180)
          const g = Math.round(255 - intensity * 40)
          const b = Math.round(intensity * 100)
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
          ctx.shadowColor = '#00FF41'
          ctx.shadowBlur = intensity * 20
        } else {
          ctx.fillStyle = THEME.headColor
          ctx.shadowBlur = 0
        }

        ctx.fillText(char, x, y)

        // Trail character
        if (dropsRef.current[i] > 0) {
          const trailY = y - FONT_SIZE
          const tdx = x - mx
          const tdy = trailY - my
          const tDist = Math.sqrt(tdx * tdx + tdy * tdy)

          if (tDist < GLOW_RADIUS) {
            const tIntensity = 1 - tDist / GLOW_RADIUS
            ctx.fillStyle = `rgb(${Math.round(tIntensity * 100)}, ${Math.round(200 + tIntensity * 55)}, ${Math.round(tIntensity * 60)})`
            ctx.shadowBlur = tIntensity * 12
          } else {
            ctx.fillStyle = THEME.brightColor
            ctx.shadowBlur = 0
          }

          ctx.fillText(getRandomChar(), x, trailY)
        }

        // Reset shadow
        ctx.shadowBlur = 0

        dropsRef.current[i] += 1

        if (y > height) {
          if (!copyrightVisibleRef.current) copyrightVisibleRef.current = true
          if (Math.random() > 0.975) dropsRef.current[i] = 0
        }
      }

      // Copyright text at bottom
      if (copyrightVisibleRef.current) {
        const cpFont = Math.max(12, Math.floor(width / 95))
        ctx.save()
        ctx.font = `${cpFont}px "Courier New", monospace`
        ctx.fillStyle = 'rgba(0, 255, 65, 0.25)'
        ctx.shadowColor = '#00FF41'
        ctx.shadowBlur = 4
        ctx.textAlign = 'center'
        ctx.fillText(COPYRIGHT_TEXT, width / 2, height - 12)
        ctx.restore()
      }
    }

    function handleResize() {
      clearTimeout(resizeTimerRef.current)
      resizeTimerRef.current = setTimeout(resize, 150)
    }

    resize()
    animFrameRef.current = requestAnimationFrame(draw)
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      clearTimeout(resizeTimerRef.current)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [canvasRef])
}
