import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Error from '../Error'
import NewUser from '../../components/NewUser.jsx'
import UserList from '../../components/UserList.jsx'

export default function ModelPage({
  apiUrl,
  createButtonLabel = 'New Item',
  listButtonLabel = 'Item List',
  listField = 'name',
  successMessage = 'Successfully added item.',
  errorEntityLabel = 'item',
  emptyLabel = 'No items found.',
  loadingLabel = 'Loading item...',
  errorLabel = 'Error loading item',
  fallbackLabel = 'Unnamed item',
  itemsKey = 'items',
  resolveListItem,
}) {
  const [data, setData] = useState(null)
  const [errorCode, setErrorCode] = useState(null)
  const [mediaType, setMediaType] = useState('application/json')
  const [activeView, setActiveView] = useState('new-item')

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          setErrorCode(response.status)
          return null
        }

        const nextMediaType = response.headers
          .get('Content-Type')
          ?.split(';')[0]
          ?.trim()

        if (nextMediaType) {
          setMediaType(nextMediaType)
        }

        return response.json()
      })
      .then((json) => {
        if (json) {
          setData(json)
        }
      })
      .catch(() => {
        setErrorCode('fetch failed')
      })
  }, [apiUrl])

  if (errorCode) {
    return <Error errorCode={errorCode} />
  }

  if (!data) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="users-page">
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <div className="view-switch" aria-label="Model page sections">
        <button
          type="button"
          className={activeView === 'new-item' ? 'view-switch-button is-active' : 'view-switch-button'}
          onClick={() => setActiveView('new-item')}
        >
          {createButtonLabel}
        </button>
        <button
          type="button"
          className={activeView === 'item-list' ? 'view-switch-button is-active' : 'view-switch-button'}
          onClick={() => setActiveView('item-list')}
        >
          {listButtonLabel}
        </button>
      </div>
      {activeView === 'new-item' ? (
        <NewUser
          requiredFields={data.requiredFields}
          optionalFields={data.optionalFields}
          submitUrl={apiUrl}
          mediaType={mediaType}
          successMessage={successMessage}
          errorEntityLabel={errorEntityLabel}
        />
      ) : (
        <UserList
          users={data[itemsKey] ?? []}
          displayField={listField}
          emptyLabel={emptyLabel}
          loadingLabel={loadingLabel}
          errorLabel={errorLabel}
          fallbackLabel={fallbackLabel}
          resolveItem={resolveListItem}
        />
      )}
    </div>
  )
}
