import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import MatrixRain from './components/MatrixRain'
import EnterOverlay from './components/EnterOverlay'
import ParticleExplosion from './components/ParticleExplosion'
import LogoReveal from './components/LogoReveal'
import SoundToggle from './components/SoundToggle'
import { MatrixAudioProvider, useAudio } from './context/MatrixAudioContext'
import './App.css'

const PHASE = {
  INTRO: 'intro',
  GLITCH: 'glitch',
  FLASH: 'flash',
  EXPLOSION: 'explosion',
  ENTERED: 'entered',
  FADEOUT: 'fadeout',
  APP: 'app',
}

function AppContent() {
  const [phase, setPhase] = useState(PHASE.INTRO)
  const audio = useAudio()
  const navigate = useNavigate()

  const handleEnter = useCallback(() => {
    // Enable sound on enter
    if (audio) audio.enableSound()

    // Start glitch
    setPhase(PHASE.GLITCH)

    // After glitch → flash → explosion
    setTimeout(() => {
      setPhase(PHASE.FLASH)
      setTimeout(() => {
        setPhase(PHASE.EXPLOSION)
      }, 200)
    }, 800)
  }, [audio])

  const handleExplosionDone = useCallback(() => {
    setPhase(PHASE.ENTERED)
    // After logo reveal, start fade-out
    setTimeout(() => {
      if (audio) audio.disableSound()
      setPhase(PHASE.FADEOUT)
    }, 2000)
  }, [audio])

  const handleFadeOutDone = useCallback(() => {
    navigate('/app')
  }, [navigate])

  const isGlitching = phase === PHASE.GLITCH

  return (
    <div className="matrix-intro">
      <div className={isGlitching ? 'glitch-active' : ''}>
        <MatrixRain />
      </div>

      {phase === PHASE.INTRO && <EnterOverlay onEnter={handleEnter} />}

      {/* White flash between glitch and explosion */}
      {phase === PHASE.FLASH && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 25,
            background: '#FFFFFF',
            animation: 'flash-white 0.2s ease-out forwards',
          }}
        />
      )}

      {phase === PHASE.EXPLOSION && (
        <ParticleExplosion onComplete={handleExplosionDone} />
      )}

      {(phase === PHASE.ENTERED || phase === PHASE.FADEOUT) && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <LogoReveal />
        </div>
      )}

      {/* Smooth fade-to-black before navigating to dashboard */}
      {phase === PHASE.FADEOUT && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: '#000',
            animation: 'fade-to-black 800ms ease-in forwards',
          }}
          onAnimationEnd={handleFadeOutDone}
        />
      )}

      <SoundToggle />
    </div>
  )
}

function App() {
  return (
    <MatrixAudioProvider>
      <AppContent />
    </MatrixAudioProvider>
  )
}

export default App
