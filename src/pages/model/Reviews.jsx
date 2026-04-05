import { useCallback } from 'react'
import ModelPage from './ModelPage.jsx'

async function fetchLinkedLabel(url, field, fallbackLabel) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      return fallbackLabel
    }

    const json = await response.json()
    return json[field] ?? fallbackLabel
  } catch {
    return fallbackLabel
  }
}

export default function Reviews({ apiUrl }) {
  const resolveReviewItem = useCallback(async (reviewUrl) => {
    try {
      const response = await fetch(reviewUrl)

      if (!response.ok) {
        return 'Error loading review'
      }

      const review = await response.json()
      const [userName, audiobookTitle] = await Promise.all([
        fetchLinkedLabel(review.user, 'name', 'Unknown user'),
        fetchLinkedLabel(review.audiobook, 'title', 'Unknown audiobook'),
      ])

      return `${userName} · ${audiobookTitle} · score ${review.score}`
    } catch {
      return 'Error loading review'
    }
  }, [])

  return (
    <ModelPage
      apiUrl={apiUrl}
      createButtonLabel="New Review"
      listButtonLabel="Review List"
      successMessage="Successfully added review."
      errorEntityLabel="review"
      emptyLabel="No reviews found."
      loadingLabel="Loading review..."
      errorLabel="Error loading review"
      fallbackLabel="Unnamed review"
      itemsKey="reviews"
      resolveListItem={resolveReviewItem}
    />
  )
}
