import { useEffect, useRef } from 'react'
import { getRandomChar } from '../utils/matrixConfig'

const PARTICLE_COUNT = 200
const DURATION = 1500 // ms

export default function ParticleExplosion({ onComplete }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const cx = canvas.width / 2
    const cy = canvas.height / 2

    // Create particles radiating from center
    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 12
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        char: getRandomChar(),
        size: 8 + Math.random() * 14,
        alpha: 1,
        decay: 0.008 + Math.random() * 0.015,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.3,
        hue: Math.random() > 0.7 ? 0 : 120, // mostly green, some white
      }
    })

    const startTime = performance.now()
    let animId

    function draw(timestamp) {
      const elapsed = timestamp - startTime
      if (elapsed > DURATION) {
        onComplete()
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        if (p.alpha <= 0) continue

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.08 // slight gravity
        p.vx *= 0.995 // friction
        p.alpha -= p.decay
        p.rotation += p.rotSpeed

        if (p.alpha <= 0) continue

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.font = `${p.size}px monospace`
        ctx.fillStyle =
          p.hue === 0
            ? `rgba(255, 255, 255, ${p.alpha})`
            : `rgba(0, ${Math.round(200 + p.alpha * 55)}, 65, ${p.alpha})`
        ctx.shadowColor = '#00FF41'
        ctx.shadowBlur = p.alpha * 15
        ctx.fillText(p.char, 0, 0)
        ctx.restore()
      }

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(animId)
  }, [onComplete])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 30,
        pointerEvents: 'none',
      }}
    />
  )
}
