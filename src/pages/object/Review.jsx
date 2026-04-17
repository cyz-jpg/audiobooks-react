import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Update from '../../components/Update.jsx'
import Delete from '../../components/Delete.jsx'
import Error from '../Error'
import {
  decodeEncodedUrl,
  fetchFieldValue,
  getServerError,
} from '../../utils/utils.jsx'
import useDetail from '../../hooks/useDetail.jsx'

export default function Review({ modelApiUrl }) {
  const { encodedUrl } = useParams()
  const apiUrl = decodeEncodedUrl(encodedUrl)

  const {
    data,
    setData,
    error,
    setError,
    message,
    setMessage,
    popup,
    setPopup,
    etag,
    setEtag,
    closePopupIfBackdrop,
  } = useDetail()

  // derived state (Angular signals equivalent)
  const [userName, setUserName] = useState('Loading...')
  const [audiobookTitle, setAudiobookTitle] = useState('Loading...')
  const [userLink, setUserLink] = useState('')
  const [audiobookLink, setAudiobookLink] = useState('')

  const loadReview = useCallback(async () => {
    try {
      const response = await fetch(apiUrl)

      if (!response.ok) {
        setError(response.status)
        setMessage(await getServerError(response, 'Error loading review'))
        return
      }

      setError('')
      setMessage('')
      const json = await response.json()
      setData(json)
      setEtag(response.headers.get('etag') || '')

      // resolve related data (same as Angular)
      const [resolvedUserName, resolvedTitle] = await Promise.all([
        fetchFieldValue(json.user, 'name', 'Unknown user'),
        fetchFieldValue(json.audiobook, 'name', 'Unknown audiobook'),
      ])

      setUserName(resolvedUserName)
      setUserLink(`/users/${encodeURIComponent(json.user)}`)

      setAudiobookTitle(resolvedTitle)
      setAudiobookLink(
        `/audiobooks/${encodeURIComponent(json.audiobook)}`
      )
    } catch {
      setError('fetch failed')
      setMessage('Error loading review, please retry.')
    }
  }, [apiUrl, setData, setError, setMessage, setEtag])

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadReview()
    }, 0)

    return () => {
      clearTimeout(timer)
    }
  }, [loadReview])

  if (!apiUrl) {
    return <Error errorCode={400} />
  }

  if (error) {
    return <Error errorCode={error} message={message} />
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

      <section className="item-head">
        <p className="eyebrow">Review Detail</p>

        <h1>
          <Link to={audiobookLink}>{audiobookTitle}</Link>
        </h1>

        <p className="subtitle">
          User: <Link to={userLink}>{userName}</Link>
        </p>

        <p className="subtitle">
          Score: {data.score}
        </p>

        {data.description && (
          <p className="subtitle">{data.description}</p>
        )}

        <div className="actions">
          <Update
            onClick={() => setPopup('update')}
            active={popup === 'update'}
            etag={etag}
            modelApi={modelApiUrl}
            itemApi={apiUrl}
            name="review"
            onDone={loadReview}
          />

          <Delete
            onClick={() => setPopup('delete')}
            active={popup === 'delete'}
            etag={etag}
            itemApi={apiUrl}
            goTo="/reviews"
            name="review"
            onDone={loadReview}
          />
        </div>
      </section>

      {popup && (
        <div
          className="popup-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={closePopupIfBackdrop}
        >
          <div className="popup-card">
            <button
              type="button"
              className="popup-close"
              onClick={() => setPopup('')}
              aria-label="Close popup"
            >
              x
            </button>

            {popup === 'update' ? (
              <Update
                type="content"
                etag={etag}
                modelApi={modelApiUrl}
                itemApi={apiUrl}
                name="review"
                onDone={loadReview}
              />
            ) : (
              <Delete
                type="content"
                etag={etag}
                itemApi={apiUrl}
                goTo="/reviews"
                name="review"
                onDone={loadReview}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
