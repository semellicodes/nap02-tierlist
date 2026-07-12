const API_URL = import.meta.env.VITE_API_URL

export async function searchMedia(query, type) {
  const params = new URLSearchParams({ query, type })
  const res = await fetch(`${API_URL}/media-search?${params.toString()}`)
  if (!res.ok) throw new Error('Não foi possível buscar')
  return res.json()
}

export async function fetchMovieDirector(movieId) {
  const res = await fetch(`${API_URL}/media-search/movie-director/${movieId}`)
  if (!res.ok) return null
  const data = await res.json()
  return data.director
}
