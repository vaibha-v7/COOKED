import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const TopGenres = () => {
  const [genres, setGenres] = useState(null)
  const [roast, setRoast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const token = localStorage.getItem('spotify_token')
        if (!token) throw new Error('No token found. Please log in again.')

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/top-genres`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!response.ok) throw new Error('Failed to fetch top genres')

        const data = await response.json()
        setGenres(data.genres)
        setRoast(data.roast)
      } catch (err) {
        setError(err.message)
        console.error('TopGenres error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGenres()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0324] text-[#e7e9ff]">
        <div className="text-center">
          <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-[#ff8c32] border-t-transparent"></div>
          <p className="text-xl">Loading your genres...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0324] text-[#e7e9ff]">
        <div className="text-center">
          <p className="mb-4 text-2xl text-red-400">Error: {error}</p>
          <a href="/#/" className="inline-block rounded-full bg-[#1db954] px-6 py-3 font-semibold text-[#0c0f12] transition hover:-translate-y-0.5">
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0324] [background:radial-gradient(circle_at_20%_20%,rgba(111,66,193,0.28),transparent_32%),_radial-gradient(circle_at_80%_10%,rgba(18,144,255,0.22),transparent_32%),_radial-gradient(circle_at_50%_90%,rgba(255,124,0,0.18),transparent_38%),_linear-gradient(160deg,#0b0324_0%,#0c0a1a_55%,#0c0a1a_100%)] px-4 py-8 font-['Space_Grotesk']">
      <div className="w-full max-w-3xl">
        <h1 className="mb-8 text-center text-4xl font-black uppercase tracking-[0.02em] text-[#ff8c32] [text-shadow:2px_2px_0_#0d0d0d,3px_3px_0_#000000] font-['Press_Start_2P'] sm:text-5xl">
          YOUR ROAST
        </h1>

        {roast && (
          <p className="mb-6 text-center text-base font-['Press_Start_2P'] text-[#ff8c32] leading-relaxed [text-shadow:3px_3px_0_rgba(0,0,0,0.6),0_0_25px_rgba(255,140,50,0.4)] uppercase tracking-widest px-2">
            {roast}
          </p>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
          <h2 className="mb-6 text-2xl font-bold text-[#e7e9ff]">Your all time top genres 🤢</h2>
          <div className="mb-8 space-y-4">
            {genres?.map((genre, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#ff8c32]/20 text-2xl font-black text-[#ff8c32]">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#e7e9ff] truncate">{typeof genre === 'string' ? genre : genre?.name}</h3>
                </div>
              </div>
            ))}
          </div>

        </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-[#e7e9ff] transition hover:bg-white/15">
              Back to Home
            </button>
            <button onClick={() => navigate('/personality')} className="inline-flex items-center gap-2 rounded-full bg-[#1db954] px-6 py-3 text-sm font-semibold text-[#0c0f12] shadow-[0_10px_30px_rgba(29,185,84,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(29,185,84,0.4)]">
              Next
            </button>
          </div>
      </div>
    </div>
  )
}

export default TopGenres