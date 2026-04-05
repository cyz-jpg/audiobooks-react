
import { useState } from 'react'
import '../css/ModelForm.css'

const token = import.meta.env.VITE_API_TOKEN

export default function ModelForm({
  requiredFields = [],
  optionalFields = [],
  submitUrl,
  mediaType = 'application/json',
  successMessage = 'Successfully added item.',
  errorEntityLabel = 'item',
}) {
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const renderField = (field, required = false) => (
    <div key={field} className="field">
      <label htmlFor={field}>
        {field}
        {!required && <span className="field-optional">optional</span>}
      </label>
      <input id={field} name={field} type="text" required={required} />
    </div>
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    setErrorMessage('')
    setIsSubmitted(false)

    if (!token) {
      setErrorMessage('Missing API token.')
      return
    }

    const formData = new FormData(form)
    const body = Object.fromEntries(formData.entries())

      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': mediaType,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const responseText = await response.text()
        setErrorMessage(
          responseText ||
            `Error adding ${errorEntityLabel} (${response.status}), please retry.`,
        )
        return
      }

      form.reset()
      setIsSubmitted(true)
  }

  return (
    <form className="model-form" onSubmit={handleSubmit}>
      {requiredFields.map((field) => renderField(field, true))}
      {optionalFields.map((field) => renderField(field, false))}
      {errorMessage && (
        <p className="model-form-error">{errorMessage}</p>
      )}
      {isSubmitted && (
        <p className="model-form-success">{successMessage}</p>
      )}
      <button type="submit" className="model-form-submit">
        Submit
      </button>
    </form>
  )
}
