import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export default function Reviews() {
  const location = useLocation()
  const stateApiUrl = location.state?.apiUrl

  if (!stateApiUrl) {
    return <Navigate to="/" replace />
  }

  useEffect(() => {
    console.log(stateApiUrl)
  }, [stateApiUrl])

  return <h1>Reviews</h1>
}
