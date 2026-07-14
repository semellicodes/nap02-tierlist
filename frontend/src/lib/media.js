const API_URL = import.meta.env.VITE_API_URL

export function proxiedImageUrl(url) {
  if (!url) return null
  return `${API_URL}/image-proxy?url=${encodeURIComponent(url)}`
}
