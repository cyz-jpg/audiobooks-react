// useDetailPage.js
import { useState, useCallback } from 'react'

export default function useDetail() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [popup, setPopup] = useState('')
  const [etag, setEtag] = useState('')

  const closePopupIfBackdrop = useCallback((event) => {
    if (event.target === event.currentTarget) {
      setPopup('')
    }
  }, [])

  return {
    data,
    setData,
    error,
    setError,
    message,
    setMessage,
    popup,
    setPopup,
    etag,
    setEtag,
    closePopupIfBackdrop,
  }
}