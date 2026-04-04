import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Audiobooks from './pages/model/Audiobooks'
import Genres from './pages/model/Genres'
import Playbackpositions from './pages/model/Playbackpositions'
import Ratings from './pages/model/Ratings'
import Users from './pages/model/Users'
import Audiobook from './pages/object/Audiobook'
import Genre from './pages/object/Genre'
import Playbackposition from './pages/object/Playbackposition'
import Rating from './pages/object/Rating'
import User from './pages/object/User'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/audiobooks" element={<Audiobooks />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/playbackpositions" element={<Playbackpositions />} />
        <Route path="/ratings" element={<Ratings />} />
        <Route path="/users/:encodedUrl" element={<User />} />
        <Route path="/audiobooks/:encodedUrl" element={<Audiobook />} />
        <Route path="/genres/:encodedUrl" element={<Genre />} />
        <Route path="/playbackpositions/:encodedUrl" element={<Playbackposition />} />
        <Route path="/ratings/:encodedUrl" element={<Rating />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
