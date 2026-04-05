import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Error from '../Error'
import ModelForm from '../../components/ModelForm.jsx'
import ModelList from '../../components/ModelList.jsx'

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

  const loadModel = async () => {
    setErrorCode(null)

    return fetch(apiUrl)
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
  }

  useEffect(() => {
    loadModel()
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
    <div className="model-page">
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <div className="model-view-switch" aria-label="Model page sections">
        <button
          type="button"
          className={activeView === 'new-item' ? 'model-view-switch-button is-active' : 'model-view-switch-button'}
          onClick={() => setActiveView('new-item')}
        >
          {createButtonLabel}
        </button>
        <button
          type="button"
          className={activeView === 'item-list' ? 'model-view-switch-button is-active' : 'model-view-switch-button'}
          onClick={() => setActiveView('item-list')}
        >
          {listButtonLabel}
        </button>
      </div>
      {activeView === 'new-item' ? (
        <ModelForm
          requiredFields={data.requiredFields}
          optionalFields={data.optionalFields}
          submitUrl={apiUrl}
          mediaType={mediaType}
          successMessage={successMessage}
          errorEntityLabel={errorEntityLabel}
          onSuccess={async () => {
            await loadModel()
          }}
        />
      ) : (
        <ModelList
          users={data[itemsKey] ?? []}
          routeSegment={itemsKey}
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
