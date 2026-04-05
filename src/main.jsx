import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './css/index.css'
import Error from './pages/Error'
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

const apiUrl = import.meta.env.VITE_API_URL
const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <div className="loading-container">
      <div className="spinner"></div>
    </div>
  </StrictMode>,
)

const response = await fetch(apiUrl)

if (!response.ok) {
  root.render(
    <StrictMode>
      <Error errorCode={response.status} />
    </StrictMode>,
  )
} else {

  const data = await response.json()

  root.render(
    <StrictMode>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home apiRes={data} />} />
          <Route path="/users" element={<Users apiUrl={data.users} />} />
          <Route path="/audiobooks" element={<Audiobooks apiUrl={data.audiobooks} />} />
          <Route path="/genres" element={<Genres apiUrl={data.genres} />} />
          <Route path="/positions" element={<Positions apiUrl={data.positions} />} />
          <Route path="/reviews" element={<Reviews apiUrl={data.reviews} />} />
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
}
