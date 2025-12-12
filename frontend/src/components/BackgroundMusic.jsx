import React, { useState, useRef, useEffect } from 'react'

const BackgroundMusic = () => {
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3
    }
  }, [])

  const toggleMute = async () => {
    if (audioRef.current) {
      try {
        if (!isPlaying) {
          setIsLoading(true)
          await audioRef.current.play()
          setIsPlaying(true)
          setIsLoading(false)
        }
        audioRef.current.muted = !isMuted
        setIsMuted(!isMuted)
      } catch (error) {
        console.error('Audio playback error:', error)
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src="/background-music.mp3" type="audio/mpeg" />
      </audio>
      <button
        onClick={toggleMute}
        disabled={isLoading}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#1db954] text-xl shadow-lg transition hover:scale-110 disabled:opacity-50 disabled:cursor-wait"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        title={isLoading ? 'Loading...' : isMuted ? 'Click to play music' : 'Mute music'}
      >
        {isLoading ? '⏳' : isMuted ? '🔇' : '🔊'}
      </button>
    </>
  )
}

export default BackgroundMusic
