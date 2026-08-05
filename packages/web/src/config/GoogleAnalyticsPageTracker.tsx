import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from './analytics'

const GoogleAnalyticsPageTracker = () => {
  const location = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    const pagePath = `${location.pathname}${location.search}${location.hash}`

    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    trackPageView(pagePath)
  }, [location])

  return null
}

export default GoogleAnalyticsPageTracker
