import { useSearchParams } from 'react-router-dom'

export default function Reviews() {
  const [searchParams] = useSearchParams()
  const apiUrl = searchParams.get('src')

  console.log(apiUrl)

  return <h1>Reviews</h1>
}
