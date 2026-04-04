import { useSearchParams } from 'react-router-dom'

export default function Audiobooks() {
  const [searchParams] = useSearchParams()
  const apiUrl = searchParams.get('src')

  console.log(apiUrl)

  return <h1>Audiobooks</h1>
}
