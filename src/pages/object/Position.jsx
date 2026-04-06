import { useParams } from 'react-router-dom'
import Error from '../Error'
import { decodeEncodedUrl } from '../../utils/utils.jsx'

export default function Position({ modelApiUrl }) {
  const { encodedUrl } = useParams()
  const apiUrl = decodeEncodedUrl(encodedUrl)

  if (!apiUrl) {
    return <Error errorCode={400} />
  }

  return (
    <div className="model-page">
      <div className="status-message">
        <div>
          <h1>Position</h1>
          <p>{apiUrl}</p>
        </div>
      </div>
    </div>
  )
}
