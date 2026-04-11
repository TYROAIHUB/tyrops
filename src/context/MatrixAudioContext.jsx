import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useMatrixAudio } from '../hooks/useMatrixAudio'

const MatrixAudioCtx = createContext(null)

export function MatrixAudioProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(false)
  const audio = useMatrixAudio()
  const prevEnabled = useRef(false)

  useEffect(() => {
    if (soundEnabled && !prevEnabled.current) {
      audio.startAmbient()
    } else if (!soundEnabled && prevEnabled.current) {
      audio.stopAmbient()
    }
    prevEnabled.current = soundEnabled
  }, [soundEnabled, audio])

  useEffect(() => {
    return () => audio.cleanup()
  }, [audio])

  function toggleSound() {
    setSoundEnabled((prev) => !prev)
  }

  return (
    <MatrixAudioCtx.Provider
      value={{ soundEnabled, toggleSound, enableSound: () => setSoundEnabled(true), playKeystroke: audio.playKeystroke }}
    >
      {children}
    </MatrixAudioCtx.Provider>
  )
}

export function useAudio() {
  return useContext(MatrixAudioCtx)
}
