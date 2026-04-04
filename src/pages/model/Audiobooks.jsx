import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export default function Audiobooks() {
  const location = useLocation()
  const stateApiUrl = location.state?.apiUrl

  if (!stateApiUrl) {
    return <Navigate to="/" replace />
  }

  useEffect(() => {
    console.log(stateApiUrl)
  }, [stateApiUrl])

  return <h1>Audiobooks</h1>
}
