import { useCallback } from 'react'
import ModelPage from './ModelPage.jsx'
import { fetchFieldValue, getServerError } from '../../utils/utils.jsx'

export default function Positions({ apiUrl }) {
  const positionText = useCallback(async (url) => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        return await getServerError(response, 'Error loading position')
      }

      const data = await response.json()
      const [name, audiobook] = await Promise.all([
        fetchFieldValue(data.user, 'name', 'Unknown user'),
        fetchFieldValue(data.audiobook, 'name', 'Unknown audiobook'),
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
