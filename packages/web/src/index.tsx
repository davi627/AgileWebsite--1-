import React from 'react'
import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import AppRouter from 'routes/router'
// import GoogleAnalyticsProvider from 'config/googleAnalytics'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  <React.StrictMode>
    {/* <GoogleAnalyticsProvider> */}
    <AppRouter />
    {/* </GoogleAnalyticsProvider> */}
  </React.StrictMode>
)
