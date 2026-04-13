import { useEffect, useRef, useCallback } from 'react'

const TILE = 16          // px per tile
const DURATION = 1800    // total dissolve ms
const BATCH_INTERVAL = 30 // ms between batches

/**
 * Canvas-based digital dissolve.
 * Tiles randomly flip from transparent → white, revealing light behind.
 * Edges dissolve first, center last — like Matrix characters decaying.
 */
export default function MatrixDissolve({ onComplete }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  const start = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w
    canvas.height = h

    const cols = Math.ceil(w / TILE)
    const rows = Math.ceil(h / TILE)
    const cx = cols / 2
    const cy = rows / 2
    const maxDist = Math.sqrt(cx * cx + cy * cy)

    // Build shuffled tile list with distance-biased ordering
    const tiles = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const dist = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2) / maxDist
        // Edges first (low score → drawn earlier), center last + random jitter
        const score = (1 - dist) * 0.7 + Math.random() * 0.3
        tiles.push({ c, r, score })
      }
    }
    // Sort: low score first (edges), high score last (center)
    tiles.sort((a, b) => a.score - b.score)

    const total = tiles.length
    const batchCount = Math.ceil(DURATION / BATCH_INTERVAL)
    const tilesPerBatch = Math.ceil(total / batchCount)
    let drawn = 0
    const t0 = performance.now()

    function draw() {
      const elapsed = performance.now() - t0
      const targetDrawn = Math.min(total, Math.floor((elapsed / DURATION) * total))

      // Draw tiles in batches
      ctx.fillStyle = '#ffffff'
      while (drawn < targetDrawn) {
        const tile = tiles[drawn]
        // Slight size variation for organic feel
        const size = TILE + (Math.random() > 0.5 ? 1 : 0)
        ctx.fillRect(tile.c * TILE, tile.r * TILE, size, size)
        drawn++
      }

      if (drawn < total) {
        rafRef.current = requestAnimationFrame(draw)
      } else {
        // Fill any tiny gaps
        ctx.fillRect(0, 0, w, h)
        onComplete?.()
      }
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [onComplete])

  useEffect(() => {
    // Small delay to let the phase settle
    const t = setTimeout(start, 50)
    return () => {
      clearTimeout(t)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [start])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    />
  )
}
