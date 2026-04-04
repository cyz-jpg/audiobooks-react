import { Link, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Error from '../Error'

export default function Users() {
  const location = useLocation()
  const stateApiUrl = location.state?.apiUrl
  const [data, setData] = useState(null)
  const [errorCode, setErrorCode] = useState(null)

  if (!stateApiUrl) {
    return <Navigate to="/" replace />
  }

  useEffect(() => {
    fetch(stateApiUrl)
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
  }, [stateApiUrl])

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
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </div>
  )
}
