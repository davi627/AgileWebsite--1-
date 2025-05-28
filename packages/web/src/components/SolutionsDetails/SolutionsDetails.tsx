import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import SidePadding from 'components/Shared/SidePadding.Component'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://webtest-api.agilebiz.co.ke:5000'

interface ISolution {
  id: number
  name: string
  shortDesc: string
  fullDesc: string
  features: { text: string }[]
  implementation: string
}

interface ISolutionCategory {
  _id: string
  title: string
  imageUrl: string
  solutions: ISolution[]
}

function SolutionsDetails() {
  const { categoryId, solutionId } = useParams<{
    categoryId: string
    solutionId: string
  }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(true)
  const [category, setCategory] = useState<ISolutionCategory | null>(null)
  const [solution, setSolution] = useState<ISolution | null>(null)

  useEffect(() => {
    const fetchSolutionDetails = async () => {
      if (!categoryId || !solutionId) {
        navigate('/solns')
        return
      }

      try {
        setLoading(true)
        const response = await axios.get(
          `${API_BASE_URL}/api/solution-categories`
        )
        const categories = response.data
        const foundCategory = categories.find(
          (cat: ISolutionCategory) => cat._id === categoryId
        )

        if (!foundCategory) {
          navigate('/solns')
          return
        }

        setCategory(foundCategory)

        const foundSolution = foundCategory.solutions.find(
          (sol: ISolution) => sol.id === parseInt(solutionId)
        )

        if (!foundSolution) {
          navigate('/solns')
          return
        }

        setSolution(foundSolution)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch solution details:', error)
        navigate('/solns')
      }
    }

    fetchSolutionDetails()
  }, [categoryId, solutionId, navigate])

  const handleGoBack = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <SidePadding>
            <div className="flex justify-center items-center h-full">
              <p className="text-xl">Loading...</p>
            </div>
          </SidePadding>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <SidePadding>
          <div className="py-14">
            <button
              onClick={handleGoBack}
              className="mb-6 flex items-center text-[#34C4EC] hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Solutions
            </button>

            {solution && category && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="bg-[#34C4EC] text-white p-6">
                  <h1 className="text-2xl font-bold">{solution.name}</h1>
                  <p className="mt-2">{category.title}</p>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Overview</h2>
                    {/* Display plain text with proper line breaks */}
                    <div className="text-gray-700 whitespace-pre-line">
                      {solution.fullDesc}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Key Features</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      {solution.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-gray-700 whitespace-pre-line"
                        >
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {solution.implementation && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        Implementation
                      </h2>
                      {/* Display plain text with proper line breaks */}
                      <div className="text-gray-700 whitespace-pre-line">
                        {solution.implementation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </SidePadding>
      </main>
      <Footer />
    </div>
  )
}

export default SolutionsDetails
