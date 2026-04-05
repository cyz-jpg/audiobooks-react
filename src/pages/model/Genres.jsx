import ModelPage from './ModelPage.jsx'

export default function Genres({ apiUrl }) {
  return (
    <ModelPage
      apiUrl={apiUrl}
      createButtonLabel="New Genre"
      listButtonLabel="Genre List"
      listField="name"
      successMessage="Successfully added genre."
      errorEntityLabel="genre"
      emptyLabel="No genres found."
      loadingLabel="Loading genre..."
      errorLabel="Error loading genre"
      fallbackLabel="Unnamed genre"
      itemsKey="genres"
    />
  )
}
