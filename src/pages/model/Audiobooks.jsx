import { useLocation } from 'react-router-dom'

export default function Audiobooks() {
  const location = useLocation()
  const apiUrl = location.state?.apiUrl

  console.log(apiUrl)

  return <h1>Audiobooks</h1>
}
