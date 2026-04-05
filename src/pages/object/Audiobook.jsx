import { useParams } from 'react-router-dom'
import Error from '../Error'

export default function Audiobook() {
  const { encodedUrl } = useParams()

  let apiUrl = null

  try {
    apiUrl = decodeURIComponent(encodedUrl)
  } catch {
    apiUrl = null
  }

  if (!apiUrl) {
    return <Error errorCode={400} />
  }

  return (
    <div className="model-page">
      <div className="status-message">
        <div>
          <h1>Audiobook</h1>
          <p>{apiUrl}</p>
        </div>
      </div>
    </div>
  )
}
