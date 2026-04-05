
import { useState } from 'react'
import '../css/ModelForm.css'

const token = import.meta.env.VITE_API_TOKEN

export default function ModelForm({
  required = [],
  optional = [],
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
        {!isRequired && <span className="field-optional">optional</span>}
      </label>
      <input id={field} name={field} type="text" required={isRequired} />
    </div>
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    setError('')
    setSaved(false)

    if (!token) {
      setError('Missing API token.')
      return
    }

    const formData = new FormData(form)
    const body = Object.fromEntries(formData.entries())

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
        const text = await response.text()
        setError(
          text || `Error adding ${itemName} (${response.status}), please retry.`,
        )
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
    <form className="model-form" onSubmit={handleSubmit}>
      {required.map((field) => renderField(field, true))}
      {optional.map((field) => renderField(field, false))}
      {error && (
        <p className="model-form-error">{error}</p>
      )}
      {saved && (
        <p className="model-form-success">{successText}</p>
      )}
      <button type="submit" className="model-form-submit">
        Submit
      </button>
    </form>
  )
}
