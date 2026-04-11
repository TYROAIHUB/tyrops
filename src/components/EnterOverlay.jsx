import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRandomChar } from '../utils/matrixConfig'
import { useAudio } from '../context/MatrixAudioContext'

const INTRO_LINES = [
  { text: 'Wake up...', delay: 500 },
  { text: 'The Matrix has you...', delay: 700 },
  { text: 'Choose your pill.', delay: 700 },
]

const TYPE_SPEED = 35 // ms per character
const BTN_SCRAMBLE_ROUNDS = 8
const BTN_SCRAMBLE_INTERVAL = 50

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
      <rect x="0.5" y="0.5" width="27" height="13" rx="6.5" fill={color} stroke={glowColor} strokeWidth="0.5" />
      <line x1="14" y1="1" x2="14" y2="13" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
      <rect x="0.5" y="0.5" width="13.5" height="13" rx="6.5" fill={color} opacity="0.8" />
      <rect x="14" y="0.5" width="13.5" height="13" rx="6.5" fill={color} opacity="0.5" />
      <ellipse cx="8" cy="5" rx="5" ry="2.5" fill="rgba(255,255,255,0.25)" />
    </svg>
  )
}

// Scramble text hook for buttons
function useTextScramble(target, startDelay = 0, enabled = false) {
  const [text, setText] = useState(() =>
    target.split('').map((ch) => (ch === ' ' ? ' ' : getRandomChar())).join('')
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
          target.split('').map((ch, i) => {
            if (ch === ' ') return ' '
            if (round >= BTN_SCRAMBLE_ROUNDS - Math.floor((i / target.length) * 3)) return ch
            return getRandomChar()
          }).join('')
        )
        if (round >= BTN_SCRAMBLE_ROUNDS + 3) {
          clearInterval(interval)
          setDone(true)
        }
      }, BTN_SCRAMBLE_INTERVAL)
      timerRef.current.push(interval)
    }, startDelay)
    timerRef.current.push(start)
    return () => timerRef.current.forEach((t) => { clearTimeout(t); clearInterval(t) })
  }, [enabled])

  return { text, done }
}

export default function EnterOverlay({ onEnter }) {
  const [displayedLines, setDisplayedLines] = useState([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [introComplete, setIntroComplete] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [hoveredBtn, setHoveredBtn] = useState(null)
  const intervalRef = useRef(null)
  const audio = useAudio()
  const navigate = useNavigate()

  // Button text scramble
  const enterScramble = useTextScramble('[ ENTER ]', 100, showButton)
  const exitScramble = useTextScramble('[ EXIT ]', 300, showButton)

  // Typewriter effect
  useEffect(() => {
    if (currentLineIndex >= INTRO_LINES.length) {
      setTimeout(() => setShowButton(true), 600)
      setIntroComplete(true)
      return
    }

    const line = INTRO_LINES[currentLineIndex]

    if (currentCharIndex === 0) {
      const pauseTimer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, ''])
        setCurrentCharIndex(1)
      }, currentLineIndex === 0 ? 500 : line.delay)
      return () => clearTimeout(pauseTimer)
    }

    if (currentCharIndex <= line.text.length) {
      intervalRef.current = setTimeout(() => {
        if (audio) audio.playKeystroke()
        setDisplayedLines((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = line.text.slice(0, currentCharIndex)
          return updated
        })
        setCurrentCharIndex((c) => c + 1)
      }, TYPE_SPEED)
      return () => clearTimeout(intervalRef.current)
    }

    const nextTimer = setTimeout(() => {
      setCurrentLineIndex((i) => i + 1)
      setCurrentCharIndex(0)
    }, 400)
    return () => clearTimeout(nextTimer)
  }, [currentLineIndex, currentCharIndex])

  function handleClick() {
    onEnter()
  }

  function handleSkip() {
    if (introComplete) return
    setDisplayedLines(INTRO_LINES.map((l) => l.text))
    setCurrentLineIndex(INTRO_LINES.length)
    setIntroComplete(true)
    setShowButton(true)
  }

  const btnBase = {
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: 'clamp(0.75rem, 1.6vw, 1.1rem)',
    fontWeight: 700,
    letterSpacing: '0.18em',
    cursor: 'pointer',
    padding: '0.55em 1.5em',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    gap: '0.8em',
    border: '1px solid rgba(255,255,255,0.18)',
    transition: 'all 0.3s ease',
  }

  return (
    <div
      onClick={!introComplete ? handleSkip : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        transition: 'opacity 0.3s ease-out',
        cursor: !introComplete ? 'pointer' : 'default',
      }}
    >
      {/* Typewriter text */}
      <div
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
          fontWeight: 700,
          color: '#00FF41',
          textShadow: '0 0 8px #00FF41, 0 0 20px #008F11',
          textAlign: 'left',
          lineHeight: 2,
          marginBottom: showButton ? '2.5rem' : 0,
          transition: 'margin-bottom 0.5s ease',
          minHeight: '10em',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {displayedLines.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'pre' }}>
            <span style={{ color: '#008F11', marginRight: 8 }}>&gt;</span>
            {line}
            {i === displayedLines.length - 1 && !introComplete && (
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: '1.2em',
                  background: '#00FF41',
                  marginLeft: 2,
                  verticalAlign: 'text-bottom',
                  animation: 'blink 0.7s step-end infinite',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ENTER and EXIT buttons with pill icons */}
      <div
        style={{
          opacity: showButton ? 1 : 0,
          pointerEvents: showButton ? 'auto' : 'none',
          transition: 'opacity 0.5s ease',
          display: 'flex',
          gap: 'clamp(1rem, 3vw, 2.5rem)',
          alignItems: 'center',
        }}
      >
        {/* ENTER - Red Pill */}
        <button
          onClick={enterScramble.done ? handleClick : undefined}
          onMouseEnter={() => setHoveredBtn('enter')}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            ...btnBase,
            color: hoveredBtn === 'enter' ? '#FF4060' : '#00FF41',
            textShadow:
              hoveredBtn === 'enter'
                ? '0 0 10px #FF2040, 0 0 30px #FF2040'
                : '0 0 8px #00FF41, 0 0 20px #008F11',
            background:
              hoveredBtn === 'enter'
                ? 'rgba(255,255,255,0.14)'
                : 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow:
              hoveredBtn === 'enter'
                ? 'inset 0 1px 2px rgba(255,255,255,0.2), 0 8px 40px rgba(0,0,0,0.4)'
                : 'inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 30px rgba(0,0,0,0.3)',
            transform: hoveredBtn === 'enter' && enterScramble.done ? 'scale(1.05)' : 'scale(1)',
            cursor: enterScramble.done ? 'pointer' : 'default',
          }}
        >
          <PillIcon
            color="#CC1030"
            glowColor="#FF2040"
            size={hoveredBtn === 'enter' ? 28 : 22}
          />
          {enterScramble.text}
        </button>

        {/* EXIT - Blue Pill */}
        <button
          onClick={exitScramble.done ? () => navigate('/exit') : undefined}
          onMouseEnter={() => setHoveredBtn('exit')}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            ...btnBase,
            color: hoveredBtn === 'exit' ? '#40A0FF' : '#00FF41',
            textShadow:
              hoveredBtn === 'exit'
                ? '0 0 10px #2080FF, 0 0 30px #2080FF'
                : '0 0 8px #00FF41, 0 0 20px #008F11',
            background:
              hoveredBtn === 'exit'
                ? 'rgba(255,255,255,0.14)'
                : 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow:
              hoveredBtn === 'exit'
                ? 'inset 0 1px 2px rgba(255,255,255,0.2), 0 8px 40px rgba(0,0,0,0.4)'
                : 'inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 30px rgba(0,0,0,0.3)',
            transform: hoveredBtn === 'exit' && exitScramble.done ? 'scale(1.05)' : 'scale(1)',
            cursor: exitScramble.done ? 'pointer' : 'default',
          }}
        >
          {exitScramble.text}
          <PillIcon
            color="#1060AA"
            glowColor="#2080FF"
            size={hoveredBtn === 'exit' ? 28 : 22}
          />
        </button>
      </div>
    </div>
  )
}
