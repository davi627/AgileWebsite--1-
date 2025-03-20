// src/hooks/usePageData.ts
import { useEffect, useState } from 'react'
import { PageTypes } from '../types'

export function usePageData(pageType: string, slug: string) {
  const [pageData, setPageData] = useState<PageTypes | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await import(`../data/${pageType}/${slug}.json`)
        setPageData({ ...data.default, type: pageType })
      } catch (error) {
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadData()
    }
  }, [pageType, slug])

  return { pageData, loading, error }
}
