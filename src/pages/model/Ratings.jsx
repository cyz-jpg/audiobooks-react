import { useLocation } from 'react-router-dom'

export default function Ratings() {
  const location = useLocation()
  const apiUrl = location.state?.apiUrl

  console.log(apiUrl)

  return <h1>Ratings</h1>
}
