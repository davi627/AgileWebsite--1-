const DEV_API_URL = 'http://localhost:5000'
const PROD_API_URL = 'https://webtest-api.agilebiz.co.ke'

export const API_BASE_URL: string = import.meta.env.DEV
  ? DEV_API_URL
  : (import.meta.env.VITE_API_BASE_URL || PROD_API_URL)

export const API_URL: string = `${API_BASE_URL}/api`

function rewriteProductionImageUrl(url: string): string {
  return url
    .replace(/^https?:\/\/localhost(:\d+)?/i, API_BASE_URL)
    .replace(/^https?:\/\/127\.0\.0\.1(:\d+)?/i, API_BASE_URL)
    .replace(/^(https?:\/\/[^/:]+):5000(\/|$)/i, '$1$2')
}

export function getImageUrl(imageUrl: string): string {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('data:')) return imageUrl

  if (imageUrl.startsWith('http')) {
    if (import.meta.env.DEV) return imageUrl
    return rewriteProductionImageUrl(imageUrl)
  }

  const path = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl
  return `${API_BASE_URL}/${path}`
}
