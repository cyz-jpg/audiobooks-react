import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import Error from '../Error'
import ModelForm from '../../components/ModelForm.jsx'
import ModelList from '../../components/ModelList.jsx'
import { getServerError } from '../../utils/utils.jsx'

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
  arrayFields = [],
}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState('')
  const [mediaType, setMediaType] = useState('application/json')
  const [tab, setTab] = useState('new-item')

  const load = useCallback(async () => {
    setError(null)
    setMessage('')

    try {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        setError(response.status)
        setMessage(await getServerError(response, `Error loading ${itemName}`))
        return
      }

      const nextMediaType = response.headers
        .get('Content-Type')
        ?.split(';')[0]
        ?.trim()

      if (nextMediaType) {
        setMediaType(nextMediaType)
      }

      const json = await response.json()
      setData(json)
    } catch {
      setError('fetch failed')
      setMessage(`Error loading ${itemName}, please retry.`)
    }
  }, [apiUrl, itemName])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  if (error) {
    return <Error errorCode={error} message={message} />
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
          arrayFields={arrayFields}
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
