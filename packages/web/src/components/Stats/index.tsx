import React, { useEffect, useState, useRef } from 'react'
import SidePadding from 'components/Shared/SidePadding.Component'
import FaintLogo from '../../assets/faint-agile-logo.svg'
import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://webtest-api.agilebiz.co.ke:5000/stats'

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

  // Fetching  statistics from the backend
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/statistics`)
      const stats = response.data

      const formattedStats: Stat[] = [
        {
          id: 1,
          name: 'Successful Projects',
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
          name: 'Happy Customers',
          value: stats.happyCustomers,
          isNumeric: !isNaN(Number(stats.happyCustomers.replace(/\D/g, ''))),
          displayValue: !isNaN(Number(stats.happyCustomers.replace(/\D/g, '')))
            ? 0
            : stats.happyCustomers
        },
        {
          id: 3,
          name: 'Customer Satisfaction',
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
          name: 'Years Of Experience',
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
          name: 'Successful Projects',
          value: '0',
          displayValue: 0,
          isNumeric: true
        },
        {
          id: 2,
          name: 'Happy Customers',
          value: '0',
          displayValue: 0,
          isNumeric: true
        },
        {
          id: 3,
          name: 'Customer Satisfaction',
          value: '0',
          displayValue: 0,
          isNumeric: true
        },
        {
          id: 4,
          name: 'Years Of Experience',
          value: '0 ',
          displayValue: '0 ',
          isNumeric: false
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

  // Formatting display value to include any non-numeric text (like "Years" in "10 Years")
  const formatDisplayValue = (stat: Stat) => {
    if (stat.isNumeric) {
      // Adding the "+" suffix to numeric values and keep any non-numeric suffix from original value
      const numericPart = stat.displayValue.toString()
      const originalSuffix = stat.value.replace(/\d+/g, '').trim()
      return `${numericPart}${originalSuffix ? ' ' + originalSuffix : '+'}`
    }
    return stat.displayValue
  }

  return (
    <div
      ref={sectionRef}
      className="bg-auto bg-center bg-no-repeat py-20 sm:py-32 font-Poppins"
      style={{ backgroundImage: `url(${FaintLogo})` }}
    >
      <SidePadding>
        <div>
          <div>
            <h2 className="text-3xl font-medium md:text-4xl">Our milestones</h2>
            <p className="mt-6 w-full font-light text-gray-700 md:w-3/4 lg:w-1/2">
              At Agile, we know this success is the direct result of continued
              investment in our framework technology and a sustained commitment
              to the core values and best practices. We are the best software
              and cloud solutions provider in Kenya, East and central Africa
            </p>
          </div>
          <dl className="mt-16 flex gap-x-24 overflow-x-auto">
            {displayStats.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col gap-y-3 border-l border-white/10"
              >
                <dt className="text-sm leading-6">{stat.name}</dt>
                <dd className="text-primary order-first text-4xl font-medium tracking-tight md:text-5xl">
                  {formatDisplayValue(stat)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </SidePadding>
    </div>
  )
}
