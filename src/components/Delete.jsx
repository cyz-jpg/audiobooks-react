import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getServerError } from '../utils/utils.jsx'

const token = import.meta.env.VITE_API_TOKEN

export default function Delete({
  onClick,
  active,
  type = 'button',
  etag = '',
  itemApi = '',
  goTo = '/',
  name = 'item',
  onDone,
}) {
  const label = name.charAt(0).toUpperCase() + name.slice(1)
  const navigate = useNavigate()
  const [err, setErr] = useState('')
  const [ok, setOk] = useState(false)

  const removeItem = async () => {
    setErr('')
    setOk(false)

    if (!itemApi) {
      setErr(`Error deleting ${name}: missing URL.`)
      return
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
    }

    if (etag) {
      headers['If-Match'] = etag
    }

    try {
      const response = await fetch(itemApi, {
        method: 'DELETE',
        headers,
      })

      if (!response.ok) {
        setErr(await getServerError(response, `Error deleting ${name}`))
        return
      }

      setOk(true)
      navigate(goTo)
      onDone?.()
    } catch {
      setErr(`Error deleting ${name}, please retry.`)
    }
  }

  if (type === 'content') {
    return (
      <div className="popup-panel danger-panel">
        <h2>Delete {name}</h2>
        <button type="button" className="form-btn" onClick={removeItem}>
          Confirm
        </button>
        {err && <p className="form-err">{err}</p>}
        {ok && <p className="form-ok">Successfully deleted {name}.</p>}
      </div>
    )
  }

  return (
    <button
      type="button"
      className={`action-btn danger ${active ? 'is-active' : ''}`}
      onClick={onClick}
    >
      Delete {label}
    </button>
  )
}
