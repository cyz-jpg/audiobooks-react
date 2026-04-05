import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Error from '../Error'
import ModelForm from '../../components/ModelForm.jsx'
import ModelList from '../../components/ModelList.jsx'

export default function ModelPage({
  apiUrl,
  createLabel = 'New Item',
  listLabel = 'Item List',
  listField = 'name',
  successText = 'Successfully added item.',
  itemName = 'item',
  emptyText = 'No items found.',
  loadingText = 'Loading item...',
  errorText = 'Error loading item',
  fallbackText = 'Unnamed item',
  itemsKey = 'items',
  resolveListText,
}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [mediaType, setMediaType] = useState('application/json')
  const [tab, setTab] = useState('new-item')

  const load = async () => {
    setError(null)

    return fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          setError(response.status)
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
      .then((result) => {
        if (result) {
          setData(result)
        }
      })
      .catch(() => {
        setError('fetch failed')
      })
  }

  useEffect(() => {
    load()
  }, [apiUrl])

  if (error) {
    return <Error errorCode={error} />
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
          className={tab === 'new-item' ? 'model-view-switch-button is-active' : 'model-view-switch-button'}
          onClick={() => setTab('new-item')}
        >
          {createLabel}
        </button>
        <button
          type="button"
          className={tab === 'item-list' ? 'model-view-switch-button is-active' : 'model-view-switch-button'}
          onClick={() => setTab('item-list')}
        >
          {listLabel}
        </button>
      </div>
      {tab === 'new-item' ? (
        <ModelForm
          required={data.requiredFields}
          optional={data.optionalFields}
          submitUrl={apiUrl}
          mediaType={mediaType}
          successText={successText}
          itemName={itemName}
          onSuccess={async () => {
            await load()
          }}
        />
      ) : (
        <ModelList
          items={data[itemsKey]}
          routePart={itemsKey}
          field={listField}
          emptyText={emptyText}
          loadingText={loadingText}
          errorText={errorText}
          fallbackText={fallbackText}
          resolveText={resolveListText}
        />
      )}
    </div>
  )
}
