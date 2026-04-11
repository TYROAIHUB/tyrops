import { useState, useCallback } from 'react'
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
  APP: 'app',
}

function AppContent() {
  const [phase, setPhase] = useState(PHASE.INTRO)
  const audio = useAudio()

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
    setTimeout(() => {
      if (audio) audio.disableSound()
      setPhase(PHASE.APP)
    }, 2000)
  }, [audio])

  const isGlitching = phase === PHASE.GLITCH

  return (
    <>
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

      {phase === PHASE.ENTERED && (
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

      {phase === PHASE.APP && (
        <div className="fixed inset-0 z-20 bg-background text-foreground animate-in fade-in duration-700">
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-lg">App placeholder — buraya uygulama gelecek</p>
          </div>
        </div>
      )}

      {phase !== PHASE.APP && <SoundToggle />}
    </>
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
