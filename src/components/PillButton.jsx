import { useState, useEffect, useRef } from 'react'
import { getRandomChar } from '../utils/matrixConfig'

const SCRAMBLE_ROUNDS = 8
const SCRAMBLE_INTERVAL = 50

const PILL_ART = {
  enter: [
    '╭──────────────╮',
    '│  ●   ENTER   │',
    '╰──────────────╯',
  ],
  exit: [
    '╭──────────────╮',
    '│  ●    EXIT   │',
    '╰──────────────╯',
  ],
}

const COLORS = {
  enter: {
    main: '#FF2040',
    bright: '#FF4060',
    glow: '#FF0030',
    dim: '#CC1030',
  },
  exit: {
    main: '#2080FF',
    bright: '#40A0FF',
    glow: '#0060FF',
    dim: '#1060CC',
  },
}

export default function PillButton({ type = 'enter', onClick, delay = 0 }) {
  const targetLines = PILL_ART[type]
  const color = COLORS[type]

  const [lines, setLines] = useState(() =>
    targetLines.map((line) =>
      line
        .split('')
        .map((ch) => (ch === ' ' ? ' ' : getRandomChar()))
        .join('')
    )
  )
  const [revealed, setRevealed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const roundsRef = useRef(targetLines.map(() => 0))
  const timersRef = useRef([])

  useEffect(() => {
    const startTimer = setTimeout(() => {
      targetLines.forEach((targetLine, lineIndex) => {
        const interval = setInterval(() => {
          roundsRef.current[lineIndex] += 1
          const round = roundsRef.current[lineIndex]

          setLines((prev) => {
            const updated = [...prev]
            updated[lineIndex] = targetLine
              .split('')
              .map((targetChar, charIndex) => {
                if (targetChar === ' ') return ' '
                const threshold =
                  SCRAMBLE_ROUNDS -
                  Math.floor((charIndex / targetLine.length) * 3)
                if (round >= threshold) return targetChar
                return getRandomChar()
              })
              .join('')
            return updated
          })

          if (round >= SCRAMBLE_ROUNDS + 3) {
            clearInterval(interval)
            if (roundsRef.current.every((r) => r >= SCRAMBLE_ROUNDS + 3)) {
              setRevealed(true)
            }
          }
        }, SCRAMBLE_INTERVAL)
        timersRef.current.push(interval)
      })
    }, delay)
    timersRef.current.push(startTimer)

    return () =>
      timersRef.current.forEach((t) => {
        clearTimeout(t)
        clearInterval(t)
      })
  }, [])

  const isClickable = revealed && !!onClick

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'transform 0.3s ease',
        transform: hovered && revealed ? 'scale(1.08)' : 'scale(1)',
      }}
    >
      <pre
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 'clamp(0.45rem, 1.1vw, 0.85rem)',
          lineHeight: 1.4,
          color: revealed ? color.main : color.dim,
          textShadow:
            hovered && revealed
              ? `0 0 15px ${color.glow}, 0 0 40px ${color.glow}, 0 0 80px ${color.dim}`
              : revealed
                ? `0 0 10px ${color.glow}, 0 0 30px ${color.dim}`
                : `0 0 5px ${color.glow}`,
          transition: 'text-shadow 0.3s ease, color 0.3s ease',
          textAlign: 'center',
          whiteSpace: 'pre',
          letterSpacing: '0.05em',
          padding: '0.6em 1em',
          borderRadius: 12,
          background: revealed
            ? hovered
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(255,255,255,0.04)'
            : 'transparent',
          border: revealed
            ? `1px solid ${color.main}30`
            : '1px solid transparent',
          backdropFilter: revealed ? 'blur(16px) saturate(180%)' : 'none',
          WebkitBackdropFilter: revealed ? 'blur(16px) saturate(180%)' : 'none',
          boxShadow: revealed
            ? hovered
              ? `inset 0 1px 2px rgba(255,255,255,0.15), 0 8px 40px ${color.glow}30`
              : `inset 0 1px 1px rgba(255,255,255,0.08), 0 4px 30px ${color.glow}20`
            : 'none',
        }}
      >
        {lines.join('\n')}
      </pre>
    </div>
  )
}
