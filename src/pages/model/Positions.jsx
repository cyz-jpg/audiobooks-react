import { useSearchParams } from 'react-router-dom'

export default function Positions() {
  const [searchParams] = useSearchParams()
  const apiUrl = searchParams.get('src')

  console.log(apiUrl)

  return <h1>Positions</h1>
}
