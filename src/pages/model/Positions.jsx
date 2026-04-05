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

export default function Positions({ apiUrl }) {
  const resolvePositionItem = useCallback(async (positionUrl) => {
    try {
      const response = await fetch(positionUrl)

      if (!response.ok) {
        return 'Error loading position'
      }

      const position = await response.json()
      const [userName, audiobookTitle] = await Promise.all([
        fetchLinkedLabel(position.user, 'name', 'Unknown user'),
        fetchLinkedLabel(position.audiobook, 'title', 'Unknown audiobook'),
      ])

      return `${userName} · ${audiobookTitle} · ${position.position}`
    } catch {
      return 'Error loading position'
    }
  }, [])

  return (
    <ModelPage
      apiUrl={apiUrl}
      createButtonLabel="New Position"
      listButtonLabel="Position List"
      successMessage="Successfully added position."
      errorEntityLabel="position"
      emptyLabel="No positions found."
      loadingLabel="Loading position..."
      errorLabel="Error loading position"
      fallbackLabel="Unnamed position"
      itemsKey="positions"
      resolveListItem={resolvePositionItem}
    />
  )
}
