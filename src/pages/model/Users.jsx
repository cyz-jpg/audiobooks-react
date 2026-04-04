import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Error from '../Error'

export default function Users() {
  const [searchParams] = useSearchParams()
  const apiUrl = searchParams.get('src')
  const [data, setData] = useState(null)
  const [errorCode, setErrorCode] = useState(null)

  useEffect(() => {
    if (!apiUrl) {
      setErrorCode('API URL not provided')
      return
    }

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          setErrorCode(response.status)
          return null
        }
        return response.json()
      })
      .then((json) => {
        setData(json)
      })
      .catch(() => {
        setErrorCode('fetch failed')
      })
  }, [apiUrl])

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

  return <div>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </div>
}
