const API_URL = import.meta.env.VITE_API_URL

// As capas vêm do TMDb/iTunes, que não liberam CORS — passamos pelo nosso
// backend pra poder exportar a tier list como imagem (canvas exige CORS).
export function proxiedImageUrl(url) {
  if (!url) return null
  return `${API_URL}/image-proxy?url=${encodeURIComponent(url)}`
}
