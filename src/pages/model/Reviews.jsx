import { useLocation } from 'react-router-dom'

export default function Reviews() {
  const location = useLocation()
  const apiUrl = location.state?.apiUrl

  console.log(apiUrl)

  return <h1>Reviews</h1>
}
