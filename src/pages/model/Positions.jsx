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

export default function Positions({ apiUrl }) {
  const positionText = useCallback(async (url) => {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        return 'Error loading position'
      }

      const data = await response.json()
      const [name, audiobook] = await Promise.all([
        fetchField(data.user, 'name', 'Unknown user'),
        fetchField(data.audiobook, 'name', 'Unknown audiobook'),
      ])

      return `${name} - ${audiobook} - ${data.position}`
    } catch {
      return 'Error loading position'
    }
  }, [])

  return (
    <ModelPage
      apiUrl={apiUrl}
      createLabel="New Position"
      listLabel="Position List"
      successText="Successfully added position."
      itemName="position"
      emptyText="No positions found."
      loadingText="Loading position..."
      errorText="Error loading position"
      fallbackText="Unnamed position"
      itemsKey="positions"
      resolveListText={positionText}
    />
  )
}
