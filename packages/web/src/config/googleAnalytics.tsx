import React, { createContext, ReactNode } from 'react'
import { trackEvent } from './analytics'

interface GoogleAnalyticsProviderProps {
  children: ReactNode
}

interface AnalyticsContextProps {
  sendEvent: (eventName: string, params?: Record<string, unknown>) => void
}

export const AnalyticsContext = createContext<AnalyticsContextProps>({
  sendEvent: () => {}
})

const GoogleAnalyticsProvider: React.FC<GoogleAnalyticsProviderProps> = ({
  children
}) => {
  const sendEvent = (eventName: string, params?: Record<string, unknown>) => {
    trackEvent(eventName, params)
  }

  return (
    <AnalyticsContext.Provider value={{ sendEvent }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export default GoogleAnalyticsProvider
