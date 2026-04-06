import { Link } from 'react-router-dom'
import '../css/Home.css'

export default function Home() {
  return (
    <div>
      <h1>Beschikbare collecties</h1>
      <div className="home-links">
        <Link to="/users" className="home-box">
          users
        </Link>

        <Link to="/genres" className="home-box">
          genres
        </Link>

        <Link to="/audiobooks" className="home-box">
          audiobooks
        </Link>

        <Link to="/reviews" className="home-box">
          reviews
        </Link>

        <Link to="/positions" className="home-box">
          positions
        </Link>
      </div>
    </div>
  )
}
