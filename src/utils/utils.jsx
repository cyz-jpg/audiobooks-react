export function formDataToBody(formData, arrayFields = [], options = {}) {
  const {
    trimValues = true,
    dropEmpty = false,
  } = options

  const body = Object.fromEntries(formData.entries())

  arrayFields.forEach((field) => {
    const rawValue = body[field]

    if (typeof rawValue !== 'string') {
      return
    }

    const values = rawValue
      .split(',')
      .map((value) => (trimValues ? value.trim() : value))
      .filter(Boolean)

    body[field] = values
  })

  if (!dropEmpty) {
    return body
  }

  const nextBody = {}

  Object.entries(body).forEach(([field, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        nextBody[field] = value
      }
      return
    }

    if (typeof value === 'string') {
      const nextValue = trimValues ? value.trim() : value
      if (nextValue !== '') {
        nextBody[field] = nextValue
      }
      return
    }

    if (value !== undefined && value !== null) {
      nextBody[field] = value
    }
  })

  return nextBody
}

export function decodeEncodedUrl(encodedUrl) {
  try {
    return decodeURIComponent(encodedUrl)
  } catch {
    return null
  }
}

export async function getServerError(response, fallback = 'Request failed.') {
  try {
    const text = await response.text()
    return text || `${fallback} (${response.status})`
  } catch {
    return `${fallback} (${response.status})`
  }
}

export async function fetchFieldValue(url, field, fallback) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return fallback
    }

    const data = await response.json()
    return data[field] || fallback
  } catch {
    return fallback
  }
}
