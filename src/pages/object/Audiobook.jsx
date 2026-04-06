import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ModelList from '../../components/ModelList.jsx'
import Update from '../../components/Update.jsx'
import Delete from '../../components/Delete.jsx'
import Error from '../Error'
import { decodeEncodedUrl, fetchFieldValue, getServerError } from '../../utils/utils.jsx'

export default function Audiobook({ modelApiUrl }) {
  const { encodedUrl } = useParams()
  const [book, setBook] = useState(null)
  const [errCode, setErrCode] = useState(null)
  const [errMsg, setErrMsg] = useState('')
  const [tab, setTab] = useState('reviews')
  const [popUp, setPopUp] = useState('')
  const [etag, setEtag] = useState('')

  const apiUrl = decodeEncodedUrl(encodedUrl)

  if (!apiUrl) {
    return <Error errorCode={400} />
  }

  const reviewLabel = useCallback(async (url) => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        return await getServerError(response, 'Error loading review')
      }

      const review = await response.json()
      const name = await fetchFieldValue(review.user, 'name', 'Unknown user')
      return `${name} - score ${review.score}`
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
      const name = await fetchFieldValue(position.user, 'name', 'Unknown user')
      return `${name} - position: ${position.position}`
    } catch {
      return 'Error loading position'
    }
  }, [])

  const loadAudiobook = useCallback(async () => {
    setErrCode(null)
    setErrMsg('')

    try {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        setErrCode(response.status)
        setErrMsg(await getServerError(response, 'Error loading audiobook'))
        return
      }

      setEtag(response.headers.get('etag') || '')
      const json = await response.json()
      setBook(json)
    } catch {
      setErrCode('fetch failed')
      setErrMsg('Error loading audiobook, please retry.')
    }
  }, [apiUrl])

  useEffect(() => {
    loadAudiobook()
  }, [loadAudiobook])

  if (errCode) {
    return <Error errorCode={errCode} message={errMsg} />
  }

  if (!book) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  const authors = Array.isArray(book.authors) ? book.authors.join(', ') : ''
  const publicationDate = book.publicationDate
    ? new Date(book.publicationDate).toLocaleDateString()
    : ''

  return (
    <div className="model-page">
      <nav>
        <Link to="/">Home</Link>
        <a href={apiUrl} target="_blank" rel="noreferrer">
          View JSON
        </a>
      </nav>

      <section className="item-head">
        <p className="eyebrow">Audiobook Detail</p>
        <h1>{book.name}</h1>
        <p className="subtitle">{authors}</p>
        {book.description && <p className="subtitle">{book.description}</p>}
        {publicationDate && <p className="subtitle">Published: {publicationDate}</p>}
        {book.link && (
          <p className="subtitle">
            Link:{' '}
            <a href={book.link} target="_blank" rel="noreferrer">
              {book.link}
            </a>
          </p>
        )}
        <div className="actions">
          <Update
            onClick={() => setPopUp('update')}
            active={popUp === 'update'}
            etag={etag}
            modelApi={modelApiUrl}
            itemApi={apiUrl}
            name="audiobook"
            arrays={['authors', 'genres']}
            onDone={loadAudiobook}
          />
          <Delete
            onClick={() => setPopUp('delete')}
            active={popUp === 'delete'}
            etag={etag}
            itemApi={apiUrl}
            goTo="/audiobooks"
            name="audiobook"
            onDone={loadAudiobook}
          />
        </div>
      </section>

      <div className="model-view-switch" aria-label="Audiobook sections">
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
                name="audiobook"
                arrays={['authors', 'genres']}
                onDone={loadAudiobook}
              />
            ) : (
              <Delete
                type="content"
                etag={etag}
                itemApi={apiUrl}
                goTo="/audiobooks"
                name="audiobook"
                onDone={loadAudiobook}
              />
            )}
          </div>
        </div>
      )}

      {tab === 'reviews' ? (
        <ModelList
          items={book.reviews}
          routePart="reviews"
          emptyText="No reviews found."
          loadingText="Loading review..."
          errorText="Error loading review"
          fallbackText="Unnamed review"
          resolveText={reviewLabel}
        />
      ) : (
        <ModelList
          items={book.positions}
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
