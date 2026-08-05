export const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-51YEB8BF9E'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1'])

export function isAnalyticsEnabled(): boolean {
  return !LOCAL_HOSTS.has(window.location.hostname)
}

export function trackPageView(pagePath: string): void {
  if (!isAnalyticsEnabled() || typeof window.gtag !== 'function') {
    return
  }

  window.gtag('config', GA_MEASUREMENT_ID, { page_path: pagePath })
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (!isAnalyticsEnabled() || typeof window.gtag !== 'function') {
    return
  }

  window.gtag('event', eventName, params)
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}
