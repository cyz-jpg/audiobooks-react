import ModelPage from './ModelPage.jsx'

export default function Users({ apiUrl }) {
  return (
    <ModelPage
      apiUrl={apiUrl}
      createButtonLabel="New User"
      listButtonLabel="User List"
      listField="name"
      successMessage="Successfully added user."
      errorEntityLabel="user"
      emptyLabel="No users found."
      loadingLabel="Loading user..."
      errorLabel="Error loading user"
      fallbackLabel="Unnamed user"
      itemsKey="users"
    />
  )
}
