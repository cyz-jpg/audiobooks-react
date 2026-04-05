import ModelPage from './ModelPage.jsx'

export default function Users({ apiUrl }) {
  return (
    <ModelPage
      apiUrl={apiUrl}
      createLabel="New User"
      listLabel="User List"
      listField="name"
      successText="Successfully added user."
      itemName="user"
      emptyText="No users found."
      loadingText="Loading user..."
      errorText="Error loading user"
      fallbackText="Unnamed user"
      itemsKey="users"
    />
  )
}
