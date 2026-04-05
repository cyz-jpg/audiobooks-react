import ModelPage from './ModelPage.jsx'

export default function Audiobooks({ apiUrl }) {
  return (
    <ModelPage
      apiUrl={apiUrl}
      createButtonLabel="New Audiobook"
      listButtonLabel="Audiobook List"
      listField="name"
      successMessage="Successfully added audiobook."
      errorEntityLabel="audiobook"
      emptyLabel="No audiobooks found."
      loadingLabel="Loading audiobook..."
      errorLabel="Error loading audiobook"
      fallbackLabel="Untitled audiobook"
      itemsKey="audiobooks"
    />
  )
}
