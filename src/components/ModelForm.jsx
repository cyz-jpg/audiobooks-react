
import { useState } from 'react'
import '../css/ModelForm.css'
import { formDataToBody, getServerError } from '../utils/utils.jsx'

const token = import.meta.env.VITE_API_TOKEN

export default function ModelForm({
  required = [],
  optional = [],
  arrayFields = [],
  submitUrl,
  mediaType = 'application/json',
  successText = 'Successfully added item.',
  itemName = 'item',
  onSuccess,
}) {
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const renderField = (field, isRequired = false) => (
    <div key={field} className="field">
      <label htmlFor={field}>
        {field}
        {!isRequired && <span className="tag">optional</span>}
      </label>
      <input
        id={field}
        name={field}
        type="text"
        required={isRequired}
        placeholder={arrayFields.includes(field) ? 'comma-separated values' : ''}
      />
    </div>
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    setError('')
    setSaved(false)

    const formData = new FormData(form)
    const body = formDataToBody(formData, arrayFields)

    try {
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': mediaType,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        setError(await getServerError(response, `Error adding ${itemName}`))
        return
      }

      form.reset()
      setSaved(true)
      await onSuccess?.()
    } catch {
      setError(`Error adding ${itemName}, please retry.`)
    }
  }

  return (
    <form className="form-box" onSubmit={handleSubmit}>
      {required.map((field) => renderField(field, true))}
      {optional.map((field) => renderField(field, false))}
      {error && (
        <p className="form-err">{error}</p>
      )}
      {saved && (
        <p className="form-ok">{successText}</p>
      )}
      <button type="submit" className="form-btn">
        Submit
      </button>
    </form>
  )
}
