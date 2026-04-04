import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export default function Genres() {
  const location = useLocation()
  const stateApiUrl = location.state?.apiUrl

  if (!stateApiUrl) {
    return <Navigate to="/" replace />
  }

  useEffect(() => {
    console.log(stateApiUrl)
  }, [stateApiUrl])

  return <h1>Genres</h1>
}
