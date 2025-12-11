import React, { useState, useEffect } from 'react'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Log immediately when component mounts
  console.log('Profile component mounted')
  console.log('Current location href:', window.location.href)
  console.log('Hash:', window.location.hash)
  console.log('Search:', window.location.search)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get token from URL query params
        const urlParams = new URLSearchParams(window.location.search || window.location.hash.split('?')[1])
        const token = urlParams.get('token')

        console.log('URL:', window.location.href)
        console.log('Token:', token)

        if (!token) {
          throw new Error('No token found. Please log in again.')
        }

        // Store token in localStorage
        localStorage.setItem('spotify_token', token)

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }
        
        const data = await response.json()
        setUser(data)
      } catch (err) {
        setError(err.message)
        console.error('Profile error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0324] text-[#e7e9ff]">
        <div className="text-center">
          <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-[#ff8c32] border-t-transparent"></div>
          <p className="text-xl">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0324] text-[#e7e9ff]">
        <div className="text-center">
          <p className="mb-4 text-2xl text-red-400">Error: {error}</p>
          <a
            href="/"
            className="inline-block rounded-full bg-[#1db954] px-6 py-3 font-semibold text-[#0c0f12] transition hover:-translate-y-0.5"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0324] [background:radial-gradient(circle_at_20%_20%,rgba(111,66,193,0.28),transparent_32%),_radial-gradient(circle_at_80%_10%,rgba(18,144,255,0.22),transparent_32%),_radial-gradient(circle_at_50%_90%,rgba(255,124,0,0.18),transparent_38%),_linear-gradient(160deg,#0b0324_0%,#0c0a1a_55%,#0c0a1a_100%)] px-4 py-12 font-['Space_Grotesk']">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
          {user?.images?.[0]?.url && (
            <img
              src={user.images[0].url}
              alt={user.display_name}
              className="h-40 w-40 flex-shrink-0 rounded-full border-4 border-[#1db954] shadow-[0_0_30px_rgba(29,185,84,0.4)]"
            />
          )}
          <div className="flex flex-col items-center sm:items-start sm:text-left text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#e7e9ff]">Hey, {user?.display_name}! 👋</h2>
            <p className="mb-6 text-xl font-bold text-[#c5c8e8]">ARE YOU READY TO WATCH YOUR ALL TIME SPOTIFY ROAST? 😈</p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <span className="rounded-full bg-[#1db954]/20 px-3 py-1 text-sm font-semibold text-[#1db954]">
                {user?.product?.toUpperCase()}
              </span>
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm font-semibold text-purple-300">
                {user?.followers?.total} Followers
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/#/"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-8 py-4 font-semibold text-[#e7e9ff] transition hover:bg-white/15"
          >
            Back to Home
          </a>
          <button
            onClick={() => {
              const token = localStorage.getItem('spotify_token')
              if (token) {
                window.location.href = `/#/roast?token=${token}`
              }
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[#1db954] px-8 py-4 font-semibold text-[#0c0f12] shadow-[0_10px_30px_rgba(29,185,84,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(29,185,84,0.4)]"
          >
            <span>NEXT</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
