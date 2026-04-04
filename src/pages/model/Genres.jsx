import { useLocation } from 'react-router-dom'

export default function Genres() {
  const location = useLocation()
  const apiUrl = location.state?.apiUrl

  console.log(apiUrl)

  return <h1>Genres</h1>
}
