import { useRef } from 'react'
import { useMatrixRain } from '../hooks/useMatrixRain'

export default function MatrixRain() {
  const canvasRef = useRef(null)
  useMatrixRain(canvasRef)

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    />
  )
}
