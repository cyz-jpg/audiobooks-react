import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Error from './Error'
import '../css/Home.css'

const apiUrl = import.meta.env.VITE_API_URL

export default function Home() {
  const [data, setData] = useState(null)
  const [errorCode, setErrorCode] = useState(null)

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          setErrorCode(response.status)
          return null
        }
        return response.json()
      })
      .then((json) => {
        if (json) {
          setData(json)
        }
      })
      .catch(() => {
        setErrorCode('fetch failed')
      })
  }, [])

  if (errorCode) {
    return <Error errorCode={errorCode} />
  }

  if (!data) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <h1>Beschikbare collecties</h1>
      <div className="home-links">
        <Link to="/users" state={{ apiUrl: data.users }} className="home-box">
          users
        </Link>

        <Link to="/genres" state={{ apiUrl: data.genres }} className="home-box">
          genres
        </Link>

        <Link
          to="/audiobooks"
          state={{ apiUrl: data.audiobooks }}
          className="home-box"
        >
          audiobooks
        </Link>

        <Link to="/reviews" state={{ apiUrl: data.reviews }} className="home-box">
          reviews
        </Link>

        <Link to="/positions" state={{ apiUrl: data.positions }} className="home-box">
          positions
        </Link>
      </div>
    </div>
  )
}
