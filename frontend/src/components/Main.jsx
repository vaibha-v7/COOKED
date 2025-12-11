import React from 'react'

const Main = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/login`
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0324] [background:radial-gradient(circle_at_20%_20%,rgba(111,66,193,0.28),transparent_32%),_radial-gradient(circle_at_80%_10%,rgba(18,144,255,0.22),transparent_32%),_radial-gradient(circle_at_50%_90%,rgba(255,124,0,0.18),transparent_38%),_linear-gradient(160deg,#0b0324_0%,#0c0a1a_55%,#0c0a1a_100%)] px-4 py-12 text-[#e7e9ff] font-['Space_Grotesk'] sm:px-6 lg:px-8">
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-8 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-[0.02em] text-[#ff8c32] [text-shadow:4px_4px_0_#0d0d0d,6px_6px_0_#000000] font-['Press_Start_2P']">
          COOKED
        </h1>

        <p className="max-w-2xl text-xl text-[#c5c8e8] sm:text-2xl">
          Get absolutely <span className="font-bold text-[#ff3ca6]">roasted</span> by your own music taste <span className="align-middle">🔥</span>
        </p>

        <div className="flex items-center justify-center gap-5 text-3xl sm:text-4xl">
          <span className='animate-float'   aria-hidden="true">🎵</span>
          <span className='animate-float'  aria-hidden="true">🔥</span>
          <span className='animate-float'  aria-hidden="true">😈</span>
          <span className='animate-float'  aria-hidden="true">💀</span>
          <span  className='animate-float' aria-hidden="true">🎧</span>
        </div>

        <button
          onClick={handleLogin}
          className="group inline-flex items-center gap-3 rounded-full bg-[#1db954] px-8 py-4 text-lg font-semibold text-[#0c0f12] shadow-[0_20px_40px_rgba(29,185,84,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_60px_rgba(29,185,84,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9bf6c6]"
          type="button"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-black/10" aria-hidden="true">
            <svg className="h-[20px] w-[20px] fill-current" viewBox="0 0 24 24" role="presentation">
              <path d="M12 1.04C5.95 1.04 1.04 5.95 1.04 12S5.95 22.96 12 22.96 22.96 18.05 22.96 12 18.05 1.04 12 1.04Zm4.4 15.9c-.2.3-.56.4-.86.2-2.35-1.43-5.3-1.75-8.8-.95-.35.08-.7-.14-.78-.5-.08-.35.14-.7.5-.78 3.8-.85 7.05-.48 9.7 1.08.3.18.4.56.2.86Zm1.1-2.73c-.25.35-.73.45-1.08.22-2.69-1.65-6.8-2.13-9.98-1.18-.4.12-.82-.1-.94-.5-.12-.4.1-.82.5-.94 3.6-1.06 8.1-.54 11.2 1.35.36.22.47.69.22 1.05Zm.1-2.8c-.3.4-.85.52-1.26.26-3-1.8-7.6-1.96-10.3-1.1-.45.14-.92-.12-1.06-.58-.14-.45.12-.92.58-1.06 3.1-.95 8.2-.76 11.7 1.2.4.24.54.78.3 1.17Z" />
            </svg>
          </span>
          Login with Spotify
        </button>

        <p className="text-sm text-[#a4a7c7]">I'll analyze your taste. You might cry. 😈</p>
      </div>

      <footer className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-sm text-[#a4a7c7]">created by <a href="https://twitter.com/vaibha_v7" target="_blank" rel="noopener noreferrer" className="text-[#ff8c32] hover:underline">@vaibha_v7</a></p>
      </footer>
    </div>
  )
}

export default Main