import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/ModelList.css'

const PAGE_SIZE = 10

async function resolveDefault(url, field, fallback) {
  const response = await fetch(url)
  if (!response.ok) {
    return fallback
  }
  const data = await response.json()
  return data[field] || fallback
}

export default function ModelList({
  items = [],
  routePart = 'items',
  field = 'name',
  loadingText = 'Loading item...',
  errorText = 'Error loading item',
  fallbackText = 'Unnamed item',
  emptyText = 'No items found.',
  resolveText,
}) {
  const [page, setPage] = useState(1)
  const [loaded, setLoaded] = useState({})

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))

  const visible = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE
    return items.slice(startIndex, startIndex + PAGE_SIZE)
  }, [items, page])

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages))
  }, [totalPages])

  useEffect(() => {
    let isCancelled = false

    const missing = visible.filter((url) => !loaded[url])

    if (missing.length === 0) {
      return undefined
    }

    setLoaded((current) => ({
      ...current,
      ...Object.fromEntries(
        missing.map((url) => [url, 'loading']),
      ),
    }))

    Promise.all(
      missing.map(async (url) => {
        try {
          const text = resolveText
            ? await resolveText(url)
            : await resolveDefault(url, field, fallbackText)

          return [url, text]
        } catch {
          return [url, errorText]
        }

      }),
    ).then((results) => {
      if (isCancelled) {
        return
      }

      setLoaded((current) => ({
        ...current,
        ...Object.fromEntries(results),
      }))
    })

    return () => {
      isCancelled = true
    }
  }, [errorText, fallbackText, field, resolveText, visible])

  const goToPreviousPage = () => {
    setPage((currentPage) => Math.max(1, currentPage - 1))
  }

  const goToNextPage = () => {
    setPage((currentPage) => Math.min(totalPages, currentPage + 1))
  }

  if (items.length === 0) {
    return <p className="model-list-empty">{emptyText}</p>
  }

  return (
    <section className="model-list">
      <ul className="model-list-items">
        {visible.map((url) => (
          <li
            key={url}
            className={`model-list-item ${
              loaded[url] === 'loading' ? 'is-loading' : ''
            }`}
          >
            <Link
              className="model-list-link"
              to={`/${routePart}/${encodeURIComponent(url)}`}
            >
              {loaded[url] === 'loading' ? loadingText : loaded[url] || loadingText}
            </Link>
          </li>
        ))}
      </ul>

      <div className="model-list-pagination">
        <button
          type="button"
          className="model-list-button"
          onClick={goToPreviousPage}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="model-list-page-indicator">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className="model-list-button"
          onClick={goToNextPage}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  )
}
