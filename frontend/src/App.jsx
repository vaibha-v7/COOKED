import { HashRouter, Routes, Route } from 'react-router-dom'
import Main from './components/Main'
import Profile from './components/Profile'
import Roast from './components/Roast'
import TopTracks from './components/TopTracks'
import TopGenres from './components/TopGenres'
import Personality from './components/Personality'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/roast" element={<Roast />} />
        <Route path="/top-tracks" element={<TopTracks />} />
        <Route path="/top-genres" element={<TopGenres />} />
        <Route path="/personality" element={<Personality />} />
      </Routes>
    </HashRouter>
  )
}

export default App
