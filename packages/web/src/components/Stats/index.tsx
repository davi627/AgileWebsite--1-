import React, { useEffect, useState, useRef } from 'react'
import SidePadding from 'components/Shared/SidePadding.Component'
import FaintLogo from '../../assets/faint-agile-logo.svg'
import axios from 'axios'
import pointer from '../../assets/pointer.png'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/stats'

interface Stat {
  id: number
  name: string
  value: string
  displayValue: number | string
  isNumeric: boolean
}

export default function Stats() {
  const [displayStats, setDisplayStats] = useState<Stat[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  // Fetching statistics from the backend
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/statistics`)
      const stats = response.data

      const formattedStats: Stat[] = [
        {
          id: 1,
          name: 'Happy Clients',
          value: stats.successfulProjects,
          isNumeric: !isNaN(
            Number(stats.successfulProjects.replace(/\D/g, ''))
          ),
          displayValue: !isNaN(
            Number(stats.successfulProjects.replace(/\D/g, ''))
          )
            ? 0
            : stats.successfulProjects
        },
        {
          id: 2,
          name: 'Complete Projects',
          value: stats.happyCustomers,
          isNumeric: !isNaN(Number(stats.happyCustomers.replace(/\D/g, ''))),
          displayValue: !isNaN(Number(stats.happyCustomers.replace(/\D/g, '')))
            ? 0
            : stats.happyCustomers
        },
        {
          id: 3,
          name: 'Networth',
          value: stats.customerSatisfaction,
          isNumeric: !isNaN(
            Number(stats.customerSatisfaction.replace(/\D/g, ''))
          ),
          displayValue: !isNaN(
            Number(stats.customerSatisfaction.replace(/\D/g, ''))
          )
            ? 0
            : stats.customerSatisfaction
        },
        {
          id: 4,
          name: 'Qualified Staff',
          value: stats.experience,
          isNumeric: !isNaN(Number(stats.experience.replace(/\D/g, ''))),
          displayValue: !isNaN(Number(stats.experience.replace(/\D/g, '')))
            ? 0
            : stats.experience
        }
      ]

      setDisplayStats(formattedStats)
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
      // Set default values in case of error
      setDisplayStats([
        {
          id: 1,
          name: 'Happy Clients',
          value: '150',
          displayValue: 0,
          isNumeric: true
        },
        {
          id: 2,
          name: 'Complete Projects',
          value: '150',
          displayValue: 0,
          isNumeric: true
        },
        {
          id: 3,
          name: 'Networth',
          value: '100B',
          displayValue: '$ 0',
          isNumeric: false
        },
        {
          id: 4,
          name: 'Qualified Staff',
          value: '150',
          displayValue: 0,
          isNumeric: true
        }
      ])
    }
  }

  useEffect(() => {
    fetchStatistics()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isInView) {
      const intervals = displayStats.map((stat, index) => {
        if (stat.isNumeric) {
          // Extract only numbers from the string for animation
          const numericValue = parseInt(stat.value.replace(/\D/g, ''), 10)

          if (!isNaN(numericValue)) {
            const interval = setInterval(() => {
              setDisplayStats((prevStats) => {
                const newStats = [...prevStats]
                const currentValue = Number(newStats[index].displayValue)

                if (currentValue < numericValue) {
                  const increment = Math.ceil(numericValue / 50)
                  const newValue =
                    currentValue + increment > numericValue
                      ? numericValue
                      : currentValue + increment
                  newStats[index].displayValue = newValue
                } else {
                  clearInterval(interval)
                }
                return newStats
              })
            }, 150)
            return interval
          }
        }
        return null
      })

      return () => {
        intervals.forEach((interval) => interval && clearInterval(interval))
      }
    }
  }, [isInView, displayStats])

  // Formatting display value to include any non-numeric text
  const formatDisplayValue = (stat: Stat) => {
    if (stat.isNumeric) {
      const numericPart = stat.displayValue.toString()
      const originalSuffix = stat.value.replace(/\d+/g, '').trim()

      // Special handling for networth to show dollar sign
      if (stat.name === 'Networth' && originalSuffix.includes('B')) {
        return `$ ${numericPart}B`
      }

      return `${numericPart}${originalSuffix ? ' ' + originalSuffix : '+'}`
    }
    return stat.displayValue
  }

  return (
    <div
      ref={sectionRef}
      className="bg-gray-50 py-20 sm:py-32 font-Poppins relative"
    >
      <SidePadding>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left side - Stats Card */}
          <div className="relative">
            {/* Decorative dashed lines */}
            <div className="absolute -top-8 -left-8 w-full h-full border-2 border-dashed border-orange-300 -z-10"></div>

            {/* Main Stats Card */}
            <div className="bg-[#167AA1] text-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Our Milestones</h2>
              <p className="text-sm leading-relaxed mb-8 opacity-90">
                At Agile, we know this success is the direct result of continued
                investment in our framework technology and a sustained commitment
                to the core values and best practices. We are the best software
                and cloud solutions provider in Kenya, East and central Africa.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="mt-8 grid grid-cols-2 gap-2">
              {displayStats.map((stat, index) => (
                <div
                  key={stat.id}
                  className={`p-3 rounded-lg shadow-md ${
                    index === 2 ? 'bg-[#167AA1] text-white' : 'bg-white'
                  }`}
                >
                  <div className={`text-2xl font-bold mb-2 ${
                    index === 2 ? 'text-white' : 'text-[#167AA1]'
                  }`}>
                    {formatDisplayValue(stat)}
                  </div>
                  <div className={`text-xs ${
                    index === 2 ? 'text-white opacity-90' : 'text-[#167AA1]'
                  }`}>
                    {stat.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - About Us */}
          <div className="pt-8 lg:pt-16">
            <div className="mb-4">
              <span className="text-sm text-gray-500 uppercase tracking-wider">About Us</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-[#167AA1] mb-6 leading-tight">
              Driving Vision Into <br />
              <span className="text-[#167AA1]">Action.</span>
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed">
              With deep roots in our industry, Agile was established to provide
              adequate and efficient IT solutions through customization and that is
              exactly what we have been doing.
            </p>

            <div className="flex items-start gap-4 mb-8">
              <div className="w-20 h-20 flex items-center justify-center flex-shrink-0 -ml-20 -mt-8">
                <img src={pointer} alt="Pointer icon" className="w-20 h-20" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#167AA1] mb-2">We Are Agile</h3>
                <p className="text-gray-600">
                  Agile Business Solutions is proudly a Kenyan technology powerhouse at
                  the forefront of Africa's digital revolution.
                </p>
              </div>
            </div>

            <button className="inline-flex items-center gap-2 text-[#167AA1] font-medium hover:text-teal-700 transition-colors">
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </SidePadding>
    </div>
  )
}
