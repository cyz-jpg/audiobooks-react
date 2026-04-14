import { useCallback, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ModelList from '../../components/ModelList.jsx'
import Update from '../../components/Update.jsx'
import Delete from '../../components/Delete.jsx'
import Error from '../Error'
import {
  decodeEncodedUrl,
  fetchFieldValue,
  getServerError,
} from '../../utils/utils.jsx'
import useDetail from '../../hooks/useDetail.jsx'

export default function Genre({ modelApiUrl }) {
  const { encodedUrl } = useParams()
  const apiUrl = decodeEncodedUrl(encodedUrl)

  const {
    data: genre,
    setData: setGenre,
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

  const audiobookText = useCallback(async (url) => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        return await getServerError(response, 'Error loading audiobook')
      }

      const book = await response.json()
      const authors = Array.isArray(book.authors) ? book.authors.join(', ') : ''
      const bookGenres = Array.isArray(book.genres) ? book.genres : []

      const genreNames = await Promise.all(
        bookGenres.map((genreUrl) =>
          fetchFieldValue(genreUrl, 'name', 'Unknown genre')
        ),
      )

      return `${book.name} - authors: ${authors} - genres: ${genreNames.join(', ')}`
    } catch {
      return 'Error loading audiobook'
    }
  }, [])

  const loadGenre = useCallback(async () => {
    setError('')
    setMessage('')

    try {
      const response = await fetch(apiUrl)

      if (!response.ok) {
        setError(response.status)
        setMessage(await getServerError(response, 'Error loading genre'))
        return
      }

      setEtag(response.headers.get('etag') || '')
      const json = await response.json()
      setGenre(json)
    } catch {
      setError('fetch failed')
      setMessage('Error loading genre, please retry.')
    }
  }, [apiUrl, setGenre, setError, setMessage, setEtag])

  useEffect(() => {
    loadGenre()
  }, [loadGenre])

  if (!apiUrl) {
    return <Error errorCode={400} />
  }

  if (error) {
    return <Error errorCode={error} message={message} />
  }

  if (!genre) {
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
        <p className="eyebrow">Genre Detail</p>
        <h1>{genre.name}</h1>
        <p className="subtitle">{genre.description}</p>

        <div className="actions">
          <Update
            onClick={() => setPopup('update')}
            active={popup === 'update'}
            etag={etag}
            modelApi={modelApiUrl}
            itemApi={apiUrl}
            name="genre"
            arrays={[]}
            onDone={loadGenre}
          />
          <Delete
            onClick={() => setPopup('delete')}
            active={popup === 'delete'}
            etag={etag}
            itemApi={apiUrl}
            goTo="/genres"
            name="genre"
            onDone={loadGenre}
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
                name="genre"
                arrays={[]}
                onDone={loadGenre}
              />
            ) : (
              <Delete
                type="content"
                etag={etag}
                itemApi={apiUrl}
                goTo="/genres"
                name="genre"
                onDone={loadGenre}
              />
            )}
          </div>
        </div>
      )}

      <ModelList
        items={genre.audiobooks}
        routePart="audiobooks"
        emptyText="No audiobooks found."
        loadingText="Loading audiobook..."
        errorText="Error loading audiobook"
        fallbackText="Unnamed audiobook"
        resolveText={audiobookText}
      />
    </div>
  )
}