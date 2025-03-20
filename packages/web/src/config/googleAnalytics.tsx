import React, { createContext, useEffect, useState, ReactNode } from 'react'
import ReactGA from 'react-ga4'

const GA_TRACKING_ID = process.env.VITE_GA_TRACKING_ID as string

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
  const [initialized, setInitialized] = useState(false)

  const sendEvent = (eventName: string, params?: Record<string, unknown>) => {
    if (ReactGA && initialized) {
      ReactGA.event(eventName, params)
    } else {
      console.error('Google Analytics is not initialized or not available.')
    }
  }

  useEffect(() => {
    if (!initialized && GA_TRACKING_ID) {
      ReactGA.initialize(GA_TRACKING_ID)
      setInitialized(true)
    }
  }, [])

  return (
    <AnalyticsContext.Provider value={{ sendEvent }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export default GoogleAnalyticsProvider
