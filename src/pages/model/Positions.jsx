import { useLocation } from 'react-router-dom'

export default function Positions() {
  const location = useLocation()
  const apiUrl = location.state?.apiUrl

  console.log(apiUrl)

  return <h1>Positions</h1>
}
