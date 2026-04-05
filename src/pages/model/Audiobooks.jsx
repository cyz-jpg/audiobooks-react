import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Audiobooks({ apiUrl }) {
  useEffect(() => {
    console.log(apiUrl)
  }, [apiUrl])

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <h1>Audiobooks</h1>
    </div>
  )
}
