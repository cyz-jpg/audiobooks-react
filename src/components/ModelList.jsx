import { useEffect, useMemo, useState } from 'react'
import '../css/ModelList.css'

const PAGE_SIZE = 10

async function defaultResolveItem(userUrl, displayField, fallbackLabel, errorLabel) {
  try {
    const response = await fetch(userUrl)

    if (!response.ok) {
      return errorLabel
    }

    const json = await response.json()
    return json[displayField] ?? fallbackLabel
  } catch {
    return errorLabel
  }
}

export default function ModelList({
  users = [],
  displayField = 'name',
  loadingLabel = 'Loading item...',
  errorLabel = 'Error loading item',
  fallbackLabel = 'Unnamed item',
  emptyLabel = 'No items found.',
  resolveItem,
}) {
  const [page, setPage] = useState(1)
  const [loadedUsers, setLoadedUsers] = useState({})

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE))

  const visibleUsers = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE
    return users.slice(startIndex, startIndex + PAGE_SIZE)
  }, [page, users])

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages))
  }, [totalPages])

  useEffect(() => {
    let isCancelled = false

    const missingUsers = visibleUsers.filter((userUrl) => !loadedUsers[userUrl])

    if (missingUsers.length === 0) {
      return undefined
    }

    setLoadedUsers((currentUsers) => ({
      ...currentUsers,
      ...Object.fromEntries(
        missingUsers.map((userUrl) => [userUrl, 'loading']),
      ),
    }))

    Promise.all(
      missingUsers.map(async (userUrl) => {
        const resolvedLabel = resolveItem
          ? await resolveItem(userUrl)
          : await defaultResolveItem(userUrl, displayField, fallbackLabel, errorLabel)

        return [userUrl, resolvedLabel]
      }),
    ).then((results) => {
      if (isCancelled) {
        return
      }

      setLoadedUsers((currentUsers) => ({
        ...currentUsers,
        ...Object.fromEntries(results),
      }))
    })

    return () => {
      isCancelled = true
    }
  }, [displayField, errorLabel, fallbackLabel, resolveItem, visibleUsers])

  const goToPreviousPage = () => {
    setPage((currentPage) => Math.max(1, currentPage - 1))
  }

  const goToNextPage = () => {
    setPage((currentPage) => Math.min(totalPages, currentPage + 1))
  }

  if (users.length === 0) {
    return <p className="model-list-empty">{emptyLabel}</p>
  }

  return (
    <section className="model-list">
      <ul className="model-list-items">
        {visibleUsers.map((userUrl) => (
          <li
            key={userUrl}
            className={`model-list-item ${
              loadedUsers[userUrl] === 'loading' ? 'is-loading' : ''
            }`}
          >
            {loadedUsers[userUrl] === 'loading'
              ? loadingLabel
              : (loadedUsers[userUrl] ?? loadingLabel)}
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
