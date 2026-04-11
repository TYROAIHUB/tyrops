import { useState, useEffect, useRef } from 'react'
import { getRandomChar } from '../utils/matrixConfig'

// ASCII art for TYROX + "ENTER THE TYROX" subtitle
const LOGO_LINES = [
  '╔════════════════════════════════════════════════╗',
  '║                                                ║',
  '║  ████████ ██    ██ ██████   ██████  ██   ██    ║',
  '║     ██     ██  ██  ██   ██ ██    ██  ██ ██     ║',
  '║     ██      ████   ██████  ██    ██   ███      ║',
  '║     ██       ██    ██   ██ ██    ██  ██ ██     ║',
  '║     ██       ██    ██   ██  ██████  ██   ██    ║',
  '║                                                ║',
  '╚════════════════════════════════════════════════╝',
]

const SCRAMBLE_ROUNDS = 12
const SCRAMBLE_INTERVAL = 60
const REVEAL_STAGGER = 80

// Button scramble config
const BTN_SCRAMBLE_ROUNDS = 8
const BTN_SCRAMBLE_INTERVAL = 50
const BTN_YES = '[ ENTER ]'
const BTN_NO = '[ EXIT ]'

// Pill-shaped SVG icon (capsule)
function PillIcon({ color, glowColor, size = 28 }) {
  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox="0 0 28 14"
      style={{
        filter: `drop-shadow(0 0 6px ${glowColor}) drop-shadow(0 0 14px ${glowColor})`,
      }}
    >
      <rect
        x="0.5"
        y="0.5"
        width="27"
        height="13"
        rx="6.5"
        fill={color}
        stroke={glowColor}
        strokeWidth="0.5"
      />
      <line
        x1="14"
        y1="1"
        x2="14"
        y2="13"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="0.8"
      />
      <rect
        x="0.5"
        y="0.5"
        width="13.5"
        height="13"
        rx="6.5"
        fill={color}
        opacity="0.8"
      />
      <rect
        x="14"
        y="0.5"
        width="13.5"
        height="13"
        rx="6.5"
        fill={color}
        opacity="0.5"
      />
      <ellipse
        cx="8"
        cy="5"
        rx="5"
        ry="2.5"
        fill="rgba(255,255,255,0.25)"
      />
    </svg>
  )
}

// Scramble text hook for buttons
function useTextScramble(target, startDelay = 0, enabled = false) {
  const [text, setText] = useState(() =>
    target
      .split('')
      .map((ch) => (ch === ' ' ? ' ' : getRandomChar()))
      .join('')
  )
  const [done, setDone] = useState(false)
  const roundRef = useRef(0)
  const timerRef = useRef([])

  useEffect(() => {
    if (!enabled) return

    const start = setTimeout(() => {
      const interval = setInterval(() => {
        roundRef.current += 1
        const round = roundRef.current

        setText(
          target
            .split('')
            .map((ch, i) => {
              if (ch === ' ') return ' '
              if (round >= BTN_SCRAMBLE_ROUNDS - Math.floor((i / target.length) * 3))
                return ch
              return getRandomChar()
            })
            .join('')
        )

        if (round >= BTN_SCRAMBLE_ROUNDS + 3) {
          clearInterval(interval)
          setDone(true)
        }
      }, BTN_SCRAMBLE_INTERVAL)
      timerRef.current.push(interval)
    }, startDelay)
    timerRef.current.push(start)

    return () =>
      timerRef.current.forEach((t) => {
        clearTimeout(t)
        clearInterval(t)
      })
  }, [enabled])

  return { text, done }
}

export default function LogoReveal({ onClick, onExit, interactive = false }) {
  const [lines, setLines] = useState(() =>
    LOGO_LINES.map((line) =>
      line
        .split('')
        .map((ch) => (ch === ' ' ? ' ' : getRandomChar()))
        .join('')
    )
  )
  const [revealed, setRevealed] = useState(false)
  const [hoveredBtn, setHoveredBtn] = useState(null)
  const roundsRef = useRef(LOGO_LINES.map(() => 0))
  const timersRef = useRef([])

  // Button text scramble (starts after logo reveals)
  const yesScramble = useTextScramble(BTN_YES, 200, revealed && interactive)
  const noScramble = useTextScramble(BTN_NO, 400, revealed && interactive)

  useEffect(() => {
    LOGO_LINES.forEach((targetLine, lineIndex) => {
      const startDelay = lineIndex * REVEAL_STAGGER

      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          roundsRef.current[lineIndex] += 1
          const round = roundsRef.current[lineIndex]

          setLines((prev) => {
            const updated = [...prev]
            updated[lineIndex] = targetLine
              .split('')
              .map((targetChar, charIndex) => {
                if (targetChar === ' ') return ' '
                const revealThreshold =
                  SCRAMBLE_ROUNDS - Math.floor((charIndex / targetLine.length) * 4)
                if (round >= revealThreshold) return targetChar
                return getRandomChar()
              })
              .join('')
            return updated
          })

          if (round >= SCRAMBLE_ROUNDS + 4) {
            clearInterval(interval)
            if (roundsRef.current.every((r) => r >= SCRAMBLE_ROUNDS + 4)) {
              setRevealed(true)
            }
          }
        }, SCRAMBLE_INTERVAL)

        timersRef.current.push(interval)
      }, startDelay)

      timersRef.current.push(timer)
    })

    return () => {
      timersRef.current.forEach((t) => {
        clearTimeout(t)
        clearInterval(t)
      })
    }
  }, [])

  const showBtns = interactive && revealed

  const btnBase = {
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: 'clamp(0.7rem, 1.4vw, 1rem)',
    fontWeight: 700,
    letterSpacing: '0.2em',
    cursor: 'pointer',
    padding: '0.6em 1.5em',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    gap: '0.7em',
    border: 'none',
    background: 'transparent',
    transition: 'all 0.3s ease',
  }

  return (
    <div
      style={{
        padding: interactive ? '1em 1.5em' : 0,
        borderRadius: interactive ? 20 : 0,
        background:
          interactive && revealed
            ? 'rgba(255,255,255,0.04)'
            : 'transparent',
        border:
          interactive && revealed
            ? '1px solid rgba(255,255,255,0.15)'
            : '1px solid transparent',
        backdropFilter:
          interactive && revealed ? 'blur(16px) saturate(180%)' : 'none',
        WebkitBackdropFilter:
          interactive && revealed ? 'blur(16px) saturate(180%)' : 'none',
        boxShadow:
          interactive && revealed
            ? 'inset 0 1px 1px rgba(255,255,255,0.08), 0 4px 30px rgba(0,0,0,0.3)'
            : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <pre
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 'clamp(0.3rem, 0.75vw, 0.58rem)',
          lineHeight: 1.4,
          color: revealed ? '#00FF41' : '#00CC33',
          textShadow: revealed
            ? '0 0 10px #00FF41, 0 0 30px #00FF41, 0 0 60px #008F11'
            : '0 0 5px #00FF41',
          transition: 'text-shadow 0.3s ease, color 0.3s ease',
          textAlign: 'center',
          whiteSpace: 'pre',
          letterSpacing: '0.05em',
          margin: 0,
        }}
      >
        {lines.join('\n')}
      </pre>

      {/* YES/NO buttons with scramble reveal */}
      {showBtns && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1em',
            gap: '1.5em',
          }}
        >
          {/* YES - Red Pill */}
          <button
            onClick={yesScramble.done ? onClick : undefined}
            onMouseEnter={() => setHoveredBtn('enter')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              ...btnBase,
              cursor: yesScramble.done ? 'pointer' : 'default',
              color: hoveredBtn === 'enter' ? '#FF4060' : '#00FF41',
              textShadow:
                hoveredBtn === 'enter'
                  ? '0 0 10px #FF2040, 0 0 30px #FF2040'
                  : '0 0 8px #00FF41, 0 0 20px #008F11',
              transform: hoveredBtn === 'enter' && yesScramble.done ? 'scale(1.08)' : 'scale(1)',
            }}
          >
            <PillIcon
              color="#CC1030"
              glowColor="#FF2040"
              size={hoveredBtn === 'enter' ? 34 : 28}
            />
            {yesScramble.text}
          </button>

          {/* NO - Blue Pill */}
          <button
            onClick={noScramble.done ? onExit : undefined}
            onMouseEnter={() => setHoveredBtn('exit')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              ...btnBase,
              cursor: noScramble.done ? 'pointer' : 'default',
              color: hoveredBtn === 'exit' ? '#40A0FF' : '#00FF41',
              textShadow:
                hoveredBtn === 'exit'
                  ? '0 0 10px #2080FF, 0 0 30px #2080FF'
                  : '0 0 8px #00FF41, 0 0 20px #008F11',
              transform: hoveredBtn === 'exit' && noScramble.done ? 'scale(1.08)' : 'scale(1)',
            }}
          >
            {noScramble.text}
            <PillIcon
              color="#1060AA"
              glowColor="#2080FF"
              size={hoveredBtn === 'exit' ? 34 : 28}
            />
          </button>
        </div>
      )}
    </div>
  )
}
