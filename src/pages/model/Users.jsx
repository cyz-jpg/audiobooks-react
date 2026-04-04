import { useLocation } from 'react-router-dom'

export default function Users() {
  const location = useLocation()
  const apiUrl = location.state?.apiUrl

  console.log(apiUrl)

  return <h1>Users</h1>
}
