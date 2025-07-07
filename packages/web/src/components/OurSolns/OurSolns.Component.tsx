import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import SidePadding from 'components/Shared/SidePadding.Component'
import { FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa'
import { BsArrowRight } from 'react-icons/bs'

import './faq.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://webtest-api.agilebiz.co.ke:5000'

// Helper function to construct full image URL
const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http')) return imageUrl
  return `${API_BASE_URL}/${imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl}`
}

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
  description: string
  solutions: ISolution[]
}

interface ISolutionFAQ {
  q: string
  a: string
  solutionId: number
}

function OurSolns() {
  const navigate = useNavigate()
  const location = useLocation()
  const [categories, setCategories] = useState<ISolutionCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<ISolutionCategory | null>(null)
  const [theFAQs, setTheFAQs] = useState<ISolutionFAQ[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } }
  }

  const cardsPerPage = 6

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/solution-categories`)
        console.log('Fetched categories:', response.data)
        setCategories(response.data)
      } catch (error) {
        console.error('Failed to fetch solution categories:', error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      setTheFAQs(
        selectedCategory.solutions.map((solution: ISolution) => ({
          q: solution.name,
          a: solution.fullDesc,
          solutionId: solution.id
        }))
      )
      setCurrentPage(0)
    }
  }, [selectedCategory])

  useEffect(() => {
    if (location.state?.scrollToCategory) {
      const categoryToScroll = categories.find(c => c._id === location.state.scrollToCategory)
      if (categoryToScroll) {
        setSelectedCategory(categoryToScroll)
      }
    }
  }, [location.state, categories])

  const handleCategoryClick = (categoryId: string) => {
    const category = categories.find(c => c._id === categoryId)
    setSelectedCategory(category || null)
    setCurrentPage(0)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setCurrentPage(0)
  }

  const handleReadMore = (categoryId: string, solutionId: number) => {
    navigate(`/solns/${categoryId}/${solutionId}`, { state: { fromCategory: categoryId } })
  }

  const handleImageError = (categoryId: string) => {
    console.error(`Image failed to load for category ${categoryId}`)
    setImageErrors(prev => new Set(prev).add(categoryId))
  }

  const handleScroll = (direction: 'left' | 'right') => {
    const totalPages = Math.ceil(theFAQs.length / cardsPerPage)
    if (direction === 'left' && currentPage > 0) {
      setCurrentPage(currentPage - 1)
    } else if (direction === 'right' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
    if (scrollContainerRef.current && !selectedCategory) {
      const containerWidth = scrollContainerRef.current.clientWidth
      const scrollAmount = containerWidth
      const maxScroll = containerWidth * (totalPages - 1)
      const newScroll = currentPage * scrollAmount

      scrollContainerRef.current.scrollTo({ left: newScroll, behavior: 'smooth' })
    }
  }

  const canScrollLeft = currentPage > 0
  const canScrollRight = currentPage < Math.ceil(theFAQs.length / cardsPerPage) - 1

  const paginatedFAQs = theFAQs.slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage)

  if (!categories.length) {
    return (
      <SidePadding>
        <div className="py-14 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading solutions...</span>
        </div>
      </SidePadding>
    )
  }

  return (
    <SidePadding>
      <div id="erp-solutions" className="py-14 font-Poppins">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            {selectedCategory ? selectedCategory.title : 'Solutions'}
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            {selectedCategory
              ? selectedCategory.description || 'Explore our comprehensive solutions designed to meet your specific business needs.'
              : 'Discover our comprehensive range of technology solutions designed to transform your business and drive sustainable growth.'
            }
          </p>
        </div>

        {/* Navigation */}
        {selectedCategory && (
          <div className="mb-8">
            <button
              onClick={handleBackToCategories}
              className="flex items-center gap-2 text-black hover:text-gray-700 font-medium transition-colors"
            >
              <FaArrowLeft size={16} />
              Back to All Solutions
            </button>
          </div>
        )}

        {/* Cards Container */}
        <div className="relative">
          <div className="flex items-center gap-4 sm:gap-4">
            {/* Left Arrow - Hidden on small screens */}
            <button
              onClick={() => handleScroll('left')}
              className={`p-4 bg-white rounded-full shadow-lg transition-all hidden sm:block ${
                canScrollLeft
                  ? 'text-black hover:bg-gray-200'
                  : 'text-gray-400 cursor-not-allowed bg-gray-300'
              }`}
              disabled={!canScrollLeft}
            >
              <FaChevronLeft size={24} />
            </button>

            {/* Cards Grid */}
            <div className="flex-1 overflow-y-auto sm:overflow-x-auto">
              <div
                ref={scrollContainerRef}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                style={{
                  maxHeight: '900px',
                }}
              >
                <AnimatePresence mode="wait">
                  {!selectedCategory ? (
                    // Category Cards
                    categories.map((category) => (
                      <motion.div
                        key={category._id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-200 min-h-[250px] sm:min-h-[280px]"
                        onClick={() => handleCategoryClick(category._id)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ y: -2 }}
                      >
                        <div className="p-4 sm:p-6 h-full flex flex-col">
                          {/* Icon in square container */}
                          <div className="mb-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                              {category.imageUrl && !imageErrors.has(category._id) ? (
                                <img
                                  src={getImageUrl(category.imageUrl)}
                                  alt={`${category.title} icon`}
                                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                                  onError={() => handleImageError(category._id)}
                                  onLoad={() => console.log('Image loaded:', getImageUrl(category.imageUrl))}
                                />
                              ) : (
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded flex items-center justify-center">
                                  <span className="text-gray-500 text-xs sm:text-sm font-bold">
                                    {category.title.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-sm sm:text-base font-semibold text-black mb-3 sm:mb-4 group-hover:text-gray-700 transition-colors">
                            {category.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 flex-grow">
                            {category.description || 'Comprehensive business consulting and strategic solutions to drive growth and efficiency across your organization.'}
                          </p>

                          {/* Learn More Button with Arrowhead */}
                          <div className="mt-auto">
                            <button
                              onClick={() => handleCategoryClick(category._id)}
                              className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium border border-gray-300 flex items-center justify-between text-sm sm:text-base"
                            >
                              <span>Learn More</span>
                              <BsArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    // FAQ Cards
                    paginatedFAQs.map((faq) => (
                      <motion.div
                        key={faq.solutionId}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 min-h-[220px] sm:min-h-[250px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ y: -2 }}
                      >
                        <div className="p-4 sm:p-6 h-full flex flex-col">
                          {/* Question */}
                          <h3 className="text-lg sm:text-xl font-bold text-black mb-3">
                            {faq.q}
                          </h3>

                          {/* Answer */}
                          <p className="text-gray-600 text-sm sm:text-base mb-4 flex-grow" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}>
                            {faq.a.replace(/<[^>]*>/g, '')}
                          </p>

                          {/* Action Button with Arrowhead */}
                          <div className="mt-auto">
                            <button
                              onClick={() => handleReadMore(selectedCategory._id, faq.solutionId)}
                              className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium border border-gray-300 flex items-center justify-between text-sm sm:text-base"
                            >
                              <span>View Details</span>
                              <BsArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Arrow - Hidden on small screens */}
            <button
              onClick={() => handleScroll('right')}
              className={`p-4 bg-white rounded-full shadow-lg transition-all hidden sm:block ${
                canScrollRight
                  ? 'text-black hover:bg-gray-200'
                  : 'text-gray-400 cursor-not-allowed bg-gray-300'
              }`}
              disabled={!canScrollRight}
            >
              <FaChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {selectedCategory && theFAQs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No solutions available for this category.</p>
          </div>
        )}
      </div>
    </SidePadding>
  )
}

export default OurSolns
