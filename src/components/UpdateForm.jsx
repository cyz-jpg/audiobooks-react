import { useEffect, useMemo, useState } from 'react'
import '../css/ModelForm.css'
import { formDataToBody, getServerError } from '../utils/utils.jsx'

const token = import.meta.env.VITE_API_TOKEN

export default function UpdateForm({
  modelApi = '',
  itemApi = '',
  etag = '',
  arrays = [],
  okText = 'Successfully updated item.',
  name = 'item',
  onDone,
}) {
  const [err, setErr] = useState('')
  const [ok, setOk] = useState(false)
  const [type, setType] = useState('application/json')
  const [fields, setFields] = useState([])
  const [metaArrays, setMetaArrays] = useState([])

  useEffect(() => {
    let cancelled = false

    if (!modelApi) {
      return undefined
    }

    setErr('')

    fetch(modelApi)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await getServerError(response, `Error loading ${name} fields`))
        }

        const nextType = response.headers
          .get('Content-Type')
          ?.split(';')[0]
          ?.trim()

        if (nextType) {
          setType(nextType)
        }

        return response.json()
      })
      .then((result) => {
        if (cancelled) {
          return
        }

        const requiredFields = Array.isArray(result.requiredFields) ? result.requiredFields : []
        const optionalFields = Array.isArray(result.optionalFields) ? result.optionalFields : []
        const combined = [...new Set([...requiredFields, ...optionalFields])]

        setFields(combined)
        setMetaArrays(Array.isArray(result.arrayFields) ? result.arrayFields : [])
      })
      .catch((error) => {
        if (cancelled) {
          return
        }

        setFields([])
        setMetaArrays([])
        setErr(error.message || `Error loading ${name} fields`)
      })

    return () => {
      cancelled = true
    }
  }, [modelApi, name])

  const showFields = useMemo(() => fields, [fields])
  const showArrays = useMemo(
    () => [...new Set([...(arrays || []), ...metaArrays])],
    [arrays, metaArrays],
  )

  const renderField = (field) => (
    <div key={field} className="field">
      <label htmlFor={field}>
        {field}
        {showArrays.includes(field) && <span className="tag">array</span>}
        <span className="tag">optional</span>
      </label>
      <input
        id={field}
        name={field}
        type="text"
        required={false}
        placeholder={showArrays.includes(field) ? 'comma-separated values' : ''}
      />
    </div>
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    setErr('')
    setOk(false)

    const formData = new FormData(form)
    const body = formDataToBody(formData, showArrays, { dropEmpty: true })

    if (Object.keys(body).length === 0) {
      setErr('Please fill in at least one field to update.')
      return
    }

    if (!itemApi) {
      setErr(`Error updating ${name}: missing URL.`)
      return
    }

    const headers = {
      'Content-Type': type || 'application/json',
      'Authorization': `Bearer ${token}`,
    }

    if (etag) {
      headers['If-Match'] = etag
    }

    try {
      const response = await fetch(itemApi, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        setErr(await getServerError(response, `Error updating ${name}`))
        return
      }

      form.reset()
      setOk(true)
      await onDone?.()
    } catch {
      setErr(`Error updating ${name}, please retry.`)
    }
  }

  return (
    <form className="form-box" onSubmit={handleSubmit}>
      {showFields.map((field) => renderField(field))}
      {err && (
        <p className="form-err">{err}</p>
      )}
      {ok && (
        <p className="form-ok">{okText}</p>
      )}
      <button type="submit" className="form-btn">
        Submit
      </button>
    </form>
  )
}
