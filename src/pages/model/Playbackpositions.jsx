import { useLocation } from 'react-router-dom'

export default function Playbackpositions() {
  const location = useLocation()
  const apiUrl = location.state?.apiUrl

  console.log(apiUrl)

  return <h1>Playbackpositions</h1>
}
