import { useCallback } from 'react'
import ModelPage from './ModelPage.jsx'

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

export default function Reviews({ apiUrl }) {
  const reviewText = useCallback(async (url) => {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        return 'Error loading review'
      }

      const data = await response.json()
      const [name, audiobook] = await Promise.all([
        fetchField(data.user, 'name', 'Unknown user'),
        fetchField(data.audiobook, 'name', 'Unknown audiobook'),
      ])

      return `${name} - ${audiobook} - score ${data.score}`
    } catch {
      return 'Error loading review'
    }
  }, [])

  return (
    <ModelPage
      apiUrl={apiUrl}
      createLabel="New Review"
      listLabel="Review List"
      successText="Successfully added review."
      itemName="review"
      emptyText="No reviews found."
      loadingText="Loading review..."
      errorText="Error loading review"
      fallbackText="Unnamed review"
      itemsKey="reviews"
      resolveListText={reviewText}
    />
  )
}
