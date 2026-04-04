import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

const apiUrl = import.meta.env.VITE_API_URL

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </BrowserRouter>
  </StrictMode>,
)
