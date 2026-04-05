import ModelPage from './ModelPage.jsx'

export default function Genres({ apiUrl }) {
  return (
    <ModelPage
      apiUrl={apiUrl}
      createLabel="New Genre"
      listLabel="Genre List"
      listField="name"
      successText="Successfully added genre."
      itemName="genre"
      emptyText="No genres found."
      loadingText="Loading genre..."
      errorText="Error loading genre"
      fallbackText="Unnamed genre"
      itemsKey="genres"
    />
  )
}
