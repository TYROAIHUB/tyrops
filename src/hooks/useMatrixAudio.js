import { useRef, useCallback } from 'react'

export function useMatrixAudio() {
  const ctxRef = useRef(null)
  const nodesRef = useRef(null)
  const isPlayingRef = useRef(false)

  // Lazily create AudioContext on first user interaction
  function getCtx() {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext
      ctxRef.current = new AC()
    }
    return ctxRef.current
  }

  const startAmbient = useCallback(() => {
    if (isPlayingRef.current) return
    const ctx = getCtx()
    if (ctx.state === 'suspended') ctx.resume()

    const master = ctx.createGain()
    master.gain.setValueAtTime(0, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2)
    master.connect(ctx.destination)

    // Base drone: two detuned sawtooth oscillators → beat frequency
    const osc1 = ctx.createOscillator()
    osc1.type = 'sawtooth'
    osc1.frequency.value = 55
    const osc1Gain = ctx.createGain()
    osc1Gain.gain.value = 0.3
    osc1.connect(osc1Gain).connect(master)
    osc1.start()

    const osc2 = ctx.createOscillator()
    osc2.type = 'sawtooth'
    osc2.frequency.value = 57
    const osc2Gain = ctx.createGain()
    osc2Gain.gain.value = 0.3
    osc2.connect(osc2Gain).connect(master)
    osc2.start()

    // Mid hum: sine with LFO modulation
    const osc3 = ctx.createOscillator()
    osc3.type = 'sine'
    osc3.frequency.value = 110
    const osc3Gain = ctx.createGain()
    osc3Gain.gain.value = 0.2

    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.2
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 3
    lfo.connect(lfoGain).connect(osc3.frequency)
    lfo.start()

    osc3.connect(osc3Gain).connect(master)
    osc3.start()

    // High shimmer: bandpass-filtered white noise
    const bufferSize = ctx.sampleRate * 2
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    noise.loop = true
    const bandpass = ctx.createBiquadFilter()
    bandpass.type = 'bandpass'
    bandpass.frequency.value = 2000
    bandpass.Q.value = 5
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.15
    noise.connect(bandpass).connect(noiseGain).connect(master)
    noise.start()

    nodesRef.current = { master, osc1, osc2, osc3, lfo, noise }
    isPlayingRef.current = true
  }, [])

  const stopAmbient = useCallback(() => {
    if (!isPlayingRef.current || !nodesRef.current) return
    const ctx = getCtx()
    const { master, osc1, osc2, osc3, lfo, noise } = nodesRef.current

    // Fade out over 1 second then stop
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1)

    setTimeout(() => {
      try {
        osc1.stop()
        osc2.stop()
        osc3.stop()
        lfo.stop()
        noise.stop()
      } catch (_) {
        // already stopped
      }
      nodesRef.current = null
      isPlayingRef.current = false
    }, 1100)
  }, [])

  const playKeystroke = useCallback(() => {
    const ctx = getCtx()
    if (ctx.state === 'suspended') return

    const now = ctx.currentTime

    // Noise burst — mekanik daktilo tık
    const bufferSize = Math.floor(ctx.sampleRate * 0.05)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const noiseData = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    // Highpass — keskin karakter
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 3000 + Math.random() * 2000
    hp.Q.value = 1

    // Bandpass — metalik rezonans
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 4000 + Math.random() * 1000
    bp.Q.value = 8

    // Envelope
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    noise.connect(hp).connect(bp).connect(gain).connect(ctx.destination)
    noise.start(now)

    // Metalik click overlay — tuş çarpma sesi
    const click = ctx.createOscillator()
    click.type = 'sine'
    click.frequency.value = 1200 + Math.random() * 600
    const clickGain = ctx.createGain()
    clickGain.gain.setValueAtTime(0.03, now)
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008)
    click.connect(clickGain).connect(ctx.destination)
    click.start(now)
    click.stop(now + 0.01)
  }, [])

  const toggle = useCallback(() => {
    if (isPlayingRef.current) {
      stopAmbient()
      return false
    } else {
      startAmbient()
      return true
    }
  }, [startAmbient, stopAmbient])

  const cleanup = useCallback(() => {
    if (isPlayingRef.current) stopAmbient()
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => {})
      ctxRef.current = null
    }
  }, [stopAmbient])

  return { startAmbient, stopAmbient, playKeystroke, toggle, cleanup }
}
