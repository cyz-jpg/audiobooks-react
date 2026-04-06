import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ModelList from '../../components/ModelList.jsx'
import Update from '../../components/Update.jsx'
import Delete from '../../components/Delete.jsx'
import Error from '../Error'
import { decodeEncodedUrl, fetchFieldValue, getServerError } from '../../utils/utils.jsx'

export default function User({ modelApiUrl }) {
  const { encodedUrl } = useParams()
  const [user, setUser] = useState(null)
  const [errCode, setErrCode] = useState(null)
  const [errMsg, setErrMsg] = useState('')
  const [tab, setTab] = useState('reviews')
  const [popUp, setPopUp] = useState('')
  const [etag, setEtag] = useState('')

  const apiUrl = decodeEncodedUrl(encodedUrl)

  const reviewLabel = useCallback(async (url) => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        return await getServerError(response, 'Error loading review')
      }

      const review = await response.json()
      const [name, audiobook] = await Promise.all([
        fetchFieldValue(review.user, 'name', 'Unknown user'),
        fetchFieldValue(review.audiobook, 'name', 'Unknown audiobook'),
      ])

      return `${name} - book: ${audiobook} - score ${review.score}`
    } catch {
      return 'Error loading review'
    }
  }, [])

  const positionLabel = useCallback(async (url) => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        return await getServerError(response, 'Error loading position')
      }

      const position = await response.json()
      const [name, audiobook] = await Promise.all([
        fetchFieldValue(position.user, 'name', 'Unknown user'),
        fetchFieldValue(position.audiobook, 'name', 'Unknown audiobook'),
      ])

      return `${name} - book: ${audiobook} - position: ${position.position}`
    } catch {
      return 'Error loading position'
    }
  }, [])

  const loadUser = useCallback(async () => {
    setErrCode(null)
    setErrMsg('')

    try {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        setErrCode(response.status)
        setErrMsg(await getServerError(response, 'Error loading user'))
        return
      }

      setEtag(response.headers.get('etag') || '')
      const json = await response.json()
      setUser(json)
    } catch {
      setErrCode('fetch failed')
      setErrMsg('Error loading user, please retry.')
    }
  }, [apiUrl])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUser()
  }, [loadUser])

  if (!apiUrl) {
    return <Error errorCode={400} />
  }

  if (errCode) {
    return <Error errorCode={errCode} message={errMsg} />
  }

  if (!user) {
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

      <section className="item-head">
        <p className="eyebrow">User Detail</p>
        <h1>{user.name}</h1>
        <p className="subtitle">{user.email}</p>
        <div className="actions">
          <Update
            onClick={() => setPopUp('update')}
            active={popUp === 'update'}
            etag={etag}
            modelApi={modelApiUrl}
            itemApi={apiUrl}
            name="user"
            arrays={[]}
            onDone={loadUser}
          />
          <Delete
            onClick={() => setPopUp('delete')}
            active={popUp === 'delete'}
            etag={etag}
            itemApi={apiUrl}
            goTo="/users"
            name="user"
            onDone={loadUser}
          />
        </div>
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

      {popUp && (
        <div className="popup-backdrop" role="dialog" aria-modal="true" onClick={() => setPopUp('')}>
          <div className="popup-card" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="popup-close"
              onClick={() => setPopUp('')}
              aria-label="Close popup"
            >
              x
            </button>
            {popUp === 'update' ? (
              <Update
                type="content"
                etag={etag}
                modelApi={modelApiUrl}
                itemApi={apiUrl}
                name="user"
                arrays={[]}
                onDone={loadUser}
              />
            ) : (
              <Delete
                type="content"
                etag={etag}
                itemApi={apiUrl}
                goTo="/users"
                name="user"
                onDone={loadUser}
              />
            )}
          </div>
        </div>
      )}

      {tab === 'reviews' ? (
        <ModelList
          items={user.reviews}
          routePart="reviews"
          emptyText="No reviews found."
          loadingText="Loading review..."
          errorText="Error loading review"
          fallbackText="Unnamed review"
          resolveText={reviewLabel}
        />
      ) : (
        <ModelList
          items={user.positions}
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

