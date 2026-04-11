import { useState, useEffect, useRef } from 'react'
import { getRandomChar } from '../utils/matrixConfig'
import MatrixRain from './MatrixRain'

const GLITCH_INTERVAL = 80
const ASCII_404 = [
  '██╗  ██╗ ██████╗ ██╗  ██╗',
  '██║  ██║██╔═══██╗██║  ██║',
  '███████║██║   ██║███████║',
  '╚════██║██║   ██║╚════██║',
  '     ██║╚██████╔╝     ██║',
  '     ╚═╝ ╚═════╝      ╚═╝',
]

const MESSAGE = "You've taken the wrong pill..."

function useGlitchText(text, active = true) {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef(0)

  useEffect(() => {
    if (!active) { setDisplay(text); return }
    const interval = setInterval(() => {
      frameRef.current += 1
      setDisplay(
        text.split('').map((ch, i) => {
          if (ch === ' ' || ch === '\n') return ch
          if (frameRef.current > 12 + i * 0.3) return ch
          return getRandomChar()
        }).join('')
      )
      if (frameRef.current > text.length + 15) clearInterval(interval)
    }, GLITCH_INTERVAL)
    return () => clearInterval(interval)
  }, [text, active])

  return display
}

export default function NotFound() {
  const [showContent, setShowContent] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [hoveredBtn, setHoveredBtn] = useState(false)
  const glitchMessage = useGlitchText(MESSAGE, showContent)

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 600)
    const t2 = setTimeout(() => setShowButton(true), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <>
      <MatrixRain />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
        }}
      >
        {/* ASCII 404 */}
        <div
          style={{
            opacity: showContent ? 1 : 0,
            transition: 'opacity 0.8s ease',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 'clamp(0.35rem, 1.2vw, 0.9rem)',
            fontWeight: 700,
            color: '#FF2040',
            textShadow: '0 0 10px #FF2040, 0 0 30px #FF2040, 0 0 60px rgba(255,32,64,0.3)',
            lineHeight: 1.2,
            textAlign: 'center',
            whiteSpace: 'pre',
            letterSpacing: '0.05em',
          }}
        >
          {ASCII_404.map((line, i) => (
            <div key={i}>{showContent ? line.split('').map((ch, j) => {
              const delay = (i * line.length + j) * 0.002
              return (
                <span
                  key={j}
                  style={{
                    display: 'inline-block',
                    animation: showContent ? `fadeInChar 0.4s ${delay}s both` : 'none',
                  }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              )
            }) : ''}</div>
          ))}
        </div>

        {/* Glitch message */}
        <div
          style={{
            opacity: showContent ? 1 : 0,
            transition: 'opacity 1s ease 0.5s',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 'clamp(0.9rem, 2vw, 1.3rem)',
            fontWeight: 700,
            color: '#00FF41',
            textShadow: '0 0 8px #00FF41, 0 0 20px #008F11',
            textAlign: 'center',
            letterSpacing: '0.12em',
          }}
        >
          <span style={{ color: '#008F11', marginRight: 8 }}>&gt;</span>
          {glitchMessage}
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: '1.1em',
              background: '#00FF41',
              marginLeft: 3,
              verticalAlign: 'text-bottom',
              animation: 'blink 0.7s step-end infinite',
            }}
          />
        </div>

        {/* Back button */}
        <div
          style={{
            opacity: showButton ? 1 : 0,
            pointerEvents: showButton ? 'auto' : 'none',
            transition: 'opacity 0.6s ease',
            marginTop: '1rem',
          }}
        >
          <a
            href="/"
            onMouseEnter={() => setHoveredBtn(true)}
            onMouseLeave={() => setHoveredBtn(false)}
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 'clamp(0.75rem, 1.4vw, 1rem)',
              fontWeight: 700,
              letterSpacing: '0.18em',
              cursor: 'pointer',
              padding: '0.55em 1.8em',
              borderRadius: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6em',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.18)',
              color: hoveredBtn ? '#00FF41' : '#00FF41',
              textShadow: hoveredBtn
                ? '0 0 10px #00FF41, 0 0 30px #00FF41'
                : '0 0 8px #00FF41, 0 0 20px #008F11',
              background: hoveredBtn
                ? 'rgba(255,255,255,0.14)'
                : 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: hoveredBtn
                ? 'inset 0 1px 2px rgba(255,255,255,0.2), 0 8px 40px rgba(0,0,0,0.4)'
                : 'inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 30px rgba(0,0,0,0.3)',
              transform: hoveredBtn ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
          >
            [ WAKE UP ]
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeInChar {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
