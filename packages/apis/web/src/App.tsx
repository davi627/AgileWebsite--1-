import React from 'react'
import AppRouter from './routes/router'
import useHotjar from './hooks/useHotjar'

export default function App() {
  const HOTJAR_ID = 5013655
  const HOTJAR_VERSION = 6

  useHotjar(HOTJAR_ID, HOTJAR_VERSION)

  return (
    <div className="">
      <AppRouter />
    </div>
  )
}
