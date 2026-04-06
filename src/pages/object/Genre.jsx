import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ModelList from '../../components/ModelList.jsx'
import Update from '../../components/Update.jsx'
import Delete from '../../components/Delete.jsx'
import Error from '../Error'
import { decodeEncodedUrl, fetchFieldValue, getServerError } from '../../utils/utils.jsx'

export default function Genre({ modelApiUrl }) {
  const { encodedUrl } = useParams()
  const [genre, setGenre] = useState(null)
  const [errCode, setErrCode] = useState(null)
  const [errMsg, setErrMsg] = useState('')
  const [popUp, setPopUp] = useState('')
  const [etag, setEtag] = useState('')

  const apiUrl = decodeEncodedUrl(encodedUrl)

  if (!apiUrl) {
    return <Error errorCode={400} />
  }

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
        bookGenres.map((genreUrl) => fetchFieldValue(genreUrl, 'name', 'Unknown genre')),
      )

      return `${book.name} - authors: ${authors} - genres: ${genreNames.join(', ')}`
    } catch {
      return 'Error loading audiobook'
    }
  }, [])

  const loadGenre = useCallback(async () => {
    setErrCode(null)
    setErrMsg('')

    try {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        setErrCode(response.status)
        setErrMsg(await getServerError(response, 'Error loading genre'))
        return
      }

      setEtag(response.headers.get('etag') || '')
      const json = await response.json()
      setGenre(json)
    } catch {
      setErrCode('fetch failed')
      setErrMsg('Error loading genre, please retry.')
    }
  }, [apiUrl])

  useEffect(() => {
    loadGenre()
  }, [loadGenre])

  if (errCode) {
    return <Error errorCode={errCode} message={errMsg} />
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
            onClick={() => setPopUp('update')}
            active={popUp === 'update'}
            etag={etag}
            modelApi={modelApiUrl}
            itemApi={apiUrl}
            name="genre"
            arrays={[]}
            onDone={loadGenre}
          />
          <Delete
            onClick={() => setPopUp('delete')}
            active={popUp === 'delete'}
            etag={etag}
            itemApi={apiUrl}
            goTo="/genres"
            name="genre"
            onDone={loadGenre}
          />
        </div>
      </section>

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
