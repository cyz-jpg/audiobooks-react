import { useSearchParams } from 'react-router-dom'

export default function Genres() {
  const [searchParams] = useSearchParams()
  const apiUrl = searchParams.get('src')

  console.log(apiUrl)

  return <h1>Genres</h1>
}
