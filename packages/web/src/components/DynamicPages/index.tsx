import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchSolutionBySlug } from '../../services/SolutionsService'
import { Solution } from '../../types/Solutions'
import PageTemplate from './components/PageTemplate'
import Loader from '../Loader'

const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [solution, setSolution] = useState<Solution | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSolution = async () => {
      try {
        if (slug) {
          const fetchedSolution = await fetchSolutionBySlug(slug)
          setSolution(fetchedSolution)
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    loadSolution()
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!solution) {
    return <div>Page not found</div>
  }

  // Update the block rendering to include child solutions
  const updatedBlocks = solution.blocks.map((block) => {
    if (block.type === 'ServicesBlock' && solution.children) {
      return {
        ...block,
        props: {
          services: solution.children.map((child) => ({
            title: child.name,
            description: child.description,
            image: child.icon,
            url: `/${child.slug}`
          }))
        }
      }
    }
    return block
  })

  return (
    <div className="relative">
      <div className="absolute -right-96 -top-[120] h-full opacity-10">
        {/* <AgileIcon className="size-full object-cover" /> */}
      </div>
      <div className="relative z-10">
        <PageTemplate blocks={updatedBlocks} />
      </div>
    </div>
  )
}

export default DynamicPage
