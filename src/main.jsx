import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './css/index.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Audiobooks from './pages/model/Audiobooks'
import Genres from './pages/model/Genres'
import Positions from './pages/model/Positions'
import Reviews from './pages/model/Reviews'
import Users from './pages/model/Users'
import Audiobook from './pages/object/Audiobook'
import Genre from './pages/object/Genre'
import Position from './pages/object/Position'
import Review from './pages/object/Review'
import User from './pages/object/User'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/audiobooks" element={<Audiobooks />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/users/:encodedUrl" element={<User />} />
        <Route path="/audiobooks/:encodedUrl" element={<Audiobook />} />
        <Route path="/genres/:encodedUrl" element={<Genre />} />
        <Route path="/positions/:encodedUrl" element={<Position />} />
        <Route path="/reviews/:encodedUrl" element={<Review />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
