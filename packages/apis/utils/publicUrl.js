import { getConfig } from '../configManager.js'

function stripInternalPort(host = '') {
  return host.replace(/:5000$/, '')
}

export function getPublicBaseUrl(req) {
  const configured = getConfig('API_PUBLIC_URL')
  if (configured) {
    return stripInternalPort(configured.replace(/\/$/, ''))
  }

  const forwardedProto = req.get('x-forwarded-proto')
  const forwardedHost = req.get('x-forwarded-host')
  if (forwardedProto && forwardedHost) {
    const host = stripInternalPort(forwardedHost)
    return `${forwardedProto}://${host}`.replace(/\/$/, '')
  }

  const host = stripInternalPort(req.get('host') || '')
  return `${req.protocol}://${host}`.replace(/\/$/, '')
}

function rewriteAbsoluteUrl(url, publicBase) {
  return url
    .replace(/^https?:\/\/localhost(:\d+)?/i, publicBase)
    .replace(/^https?:\/\/127\.0\.0\.1(:\d+)?/i, publicBase)
    .replace(/^(https?:\/\/[^/:]+):5000(\/|$)/i, '$1$2')
}

export function constructPublicUrl(req, imagePath) {
  if (!imagePath) return ''
  if (imagePath.startsWith('data:')) return imagePath

  const publicBase = getPublicBaseUrl(req)

  if (imagePath.startsWith('http')) {
    return rewriteAbsoluteUrl(imagePath, publicBase)
  }

  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  return `${publicBase}/${cleanPath}`
}
