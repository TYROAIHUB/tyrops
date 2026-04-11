import { useAudio } from '../context/MatrixAudioContext'

export default function SoundToggle() {
  const { soundEnabled, toggleSound } = useAudio()

  return (
    <button
      onClick={toggleSound}
      aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 50,
        width: 40,
        height: 40,
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.15)',
        background: soundEnabled
          ? 'rgba(0, 255, 65, 0.08)'
          : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        boxShadow:
          'inset 0 1px 1px rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        padding: 0,
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke={soundEnabled ? '#00FF41' : '#666'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter: soundEnabled ? 'drop-shadow(0 0 6px #00FF41)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Speaker body */}
        <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill={soundEnabled ? 'rgba(0,255,65,0.15)' : 'none'} />
        {soundEnabled ? (
          <>
            {/* Sound waves */}
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        ) : (
          <>
            {/* Mute X */}
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        )}
      </svg>
    </button>
  )
}
