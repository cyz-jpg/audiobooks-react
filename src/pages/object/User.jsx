import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ModelList from '../../components/ModelList.jsx'
import Error from '../Error'

async function fetchField(url, field, fallback) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      return fallback
    }

    const data = await response.json()
    return data[field] || fallback
  } catch {
    return fallback
  }
}

export default function User() {
  const { encodedUrl } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('reviews')

  let apiUrl = null

  try {
    apiUrl = decodeURIComponent(encodedUrl)
  } catch {
    apiUrl = null
  }

  if (!apiUrl) {
    return <Error errorCode={400} />
  }

  const reviewLabel = useCallback(async (url) => {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        return 'Error loading review'
      }

      const review = await response.json()
      const [name, audiobook] = await Promise.all([
        fetchField(review.user, 'name', 'Unknown user'),
        fetchField(review.audiobook, 'name', 'Unknown audiobook'),
      ])

      return `${name} - ${audiobook} - score ${review.score}`
    } catch {
      return 'Error loading review'
    }
  }, [])

  const positionLabel = useCallback(async (url) => {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        return 'Error loading position'
      }

      const position = await response.json()
      const [name, audiobook] = await Promise.all([
        fetchField(position.user, 'name', 'Unknown user'),
        fetchField(position.audiobook, 'name', 'Unknown audiobook'),
      ])

      return `${name} - ${audiobook} - ${position.position}`
    } catch {
      return 'Error loading position'
    }
  }, [])

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          setError(response.status)
          return null
        }

        return response.json()
      })
      .then((result) => {
        if (result) {
          setData(result)
        }
      })
      .catch(() => {
        setError('fetch failed')
      })
  }, [apiUrl])

  if (error) {
    return <Error errorCode={error} />
  }

  if (!data) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="model-page">
      <nav>
        <Link to="/">Home</Link>
        <a href={apiUrl} target="_blank" rel="noreferrer">
          View JSON
        </a>
      </nav>

      <section className="object-header">
        <p className="eyebrow">User Detail</p>
        <h1>{data.name}</h1>
        <p className="object-subtitle">{data.email}</p>
      </section>

      <div className="model-view-switch" aria-label="User sections">
        <button
          type="button"
          className={tab === 'reviews' ? 'model-view-switch-button is-active' : 'model-view-switch-button'}
          onClick={() => setTab('reviews')}
        >
          Reviews
        </button>
        <button
          type="button"
          className={tab === 'positions' ? 'model-view-switch-button is-active' : 'model-view-switch-button'}
          onClick={() => setTab('positions')}
        >
          Positions
        </button>
      </div>

      {tab === 'reviews' ? (
        <ModelList
          items={data.reviews}
          routePart="reviews"
          emptyText="No reviews found."
          loadingText="Loading review..."
          errorText="Error loading review"
          fallbackText="Unnamed review"
          resolveText={reviewLabel}
        />
      ) : (
        <ModelList
          items={data.positions}
          routePart="positions"
          emptyText="No positions found."
          loadingText="Loading position..."
          errorText="Error loading position"
          fallbackText="Unnamed position"
          resolveText={positionLabel}
        />
      )}
    </div>
  )
}
