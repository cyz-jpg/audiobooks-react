import ModelPage from './ModelPage.jsx'

export default function Audiobooks({ apiUrl }) {
  return (
    <ModelPage
      apiUrl={apiUrl}
      createLabel="New Audiobook"
      listLabel="Audiobook List"
      listField="name"
      successText="Successfully added audiobook."
      itemName="audiobook"
      emptyText="No audiobooks found."
      loadingText="Loading audiobook..."
      errorText="Error loading audiobook"
      fallbackText="Untitled audiobook"
      itemsKey="audiobooks"
      arrayFields={['authors', 'genres']}
    />
  )
}
