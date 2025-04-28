import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// import {
//   UserGroupIcon,
//   ChartBarIcon,
//   CloudIcon,
//   ServerIcon,
//   DocumentTextIcon
// } from '@heroicons/react/24/outline'
import { fetchSolutions } from '../../services/SolutionsService'
import { Solution } from '../../types/Solutions'
import Loader from '../Loader'

import SidePadding from 'components/Shared/SidePadding.Component'
import ProductCard from './ProductCard.Component'
import ArrowRight from '../../assets/arrow-right.png'

// const iconMapping: { [key: string]: React.ElementType } = {
//   UserGroupIcon,
//   ChartBarIcon,
//   CloudIcon,
//   ServerIcon,
//   DocumentTextIcon
// }

const ProductsSection = () => {
  const navigate = useNavigate()
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSolutions = async () => {
      try {
        const fetchedSolutions = await fetchSolutions(true)
        const sortedSolutions = fetchedSolutions.sort((a, b) => a.rank - b.rank)
        setSolutions(sortedSolutions)
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

    loadSolutions()
  }, [])

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

  return (
    <section className="mt-8 bg-[#F3F8FA] py-20 font-century">
      <SidePadding>
        <h2 className="mb-6 text-center text-2xl font-semibold leading-tight tracking-wide md:text-[2.2rem]">
          Experience the convenience of <br />
          our Management Information Systems solutions
        </h2>
        <p className="text-center text-gray-700">
          Connect finance, sales, service, and operations with a solution
          trusted by over 500 small, midsize and large businesses.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {solutions.map((solution, index) => {
            // const Icon = iconMapping[solution.icon as keyof typeof iconMapping]
            return (
              <ProductCard
                key={index}
                name={solution.name}
                description={solution.description}
                // icon={Icon}
                slug={solution.slug}
              />
            )
          })}
        </div>
        <button
          className="bg-primary hover:bg-alternate group mx-auto mt-8 flex items-center rounded-2xl p-5 transition-colors duration-300"
          onClick={() => {
            navigate('/contact-us', { replace: false })
          }}
        >
          <span className="w-0 -translate-x-16 whitespace-nowrap text-2xl font-medium text-white opacity-0 transition-all duration-700 group-hover:w-48 group-hover:translate-x-0 group-hover:opacity-100">
            Get in touch
          </span>

          <img src={ArrowRight} alt="arrow-right" className="h-3" />
        </button>
      </SidePadding>
    </section>
  )
}

export default ProductsSection
