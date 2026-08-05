import { useContext } from 'react'
import { AnalyticsContext } from './googleAnalytics'

export function useAnalytics() {
  return useContext(AnalyticsContext)
}
