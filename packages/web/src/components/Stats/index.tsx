import React, { useEffect, useState, useRef } from 'react'
import SidePadding from 'components/Shared/SidePadding.Component'
import FaintLogo from '../../assets/faint-agile-logo.svg'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/stats'

interface Stat {
  id: number
  name: string
  value: string | number
  displayValue?: string | number
}

export default function Stats() {
  const [displayStats, setDisplayStats] = useState<Stat[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  // Fetch statistics from the backend
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/statistics`)
      const stats = response.data

      // Map the fetched data to the `displayStats` format
      const formattedStats = [
        { id: 1, name: 'Successful Projects', value: stats.successfulProjects },
        { id: 2, name: 'Happy Customers', value: stats.happyCustomers },
        { id: 3, name: 'Customer Satisfaction', value: stats.customerSatisfaction },
        { id: 4, name: 'Experience', value: stats.experience }
      ]

      // Initialize `displayValue` for animation
      setDisplayStats(
        formattedStats.map((stat) => ({
          ...stat,
          displayValue: typeof stat.value === 'number' ? 0 : stat.value
        }))
      )
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
    }
  }

  // Fetch statistics on component mount
  useEffect(() => {
    fetchStatistics()
  }, [])

  // Intersection Observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.5
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  // Animate statistics when in view
  useEffect(() => {
    if (isInView) {
      const intervals = displayStats.map((stat, index) => {
        if (typeof stat.value === 'number') {
          const interval = setInterval(() => {
            setDisplayStats((prevStats) => {
              const newStats = [...prevStats]
              const currentValue = newStats[index].displayValue

              if (
                typeof currentValue === 'number' &&
                typeof stat.value === 'number' &&
                currentValue < stat.value
              ) {
                const increment = Math.ceil(stat.value / 50)
                const newValue =
                  currentValue + increment > stat.value
                    ? stat.value
                    : currentValue + increment
                newStats[index].displayValue = newValue
              } else {
                clearInterval(interval)
              }
              return newStats
            })
          }, 150) // Adjust speed as needed
          return interval
        }
        return null
      })

      return () => {
        intervals.forEach((interval) => interval && clearInterval(interval))
      }
    }
  }, [isInView, displayStats])

  return (
    <div
      ref={sectionRef}
      className="bg-auto bg-center bg-no-repeat py-20 sm:py-32 font-century"
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
          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {displayStats.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col gap-y-3 border-l border-white/10"
              >
                <dt className="text-sm leading-6">{stat.name}</dt>
                <dd className="text-primary order-first text-4xl font-medium tracking-tight md:text-5xl">
                  {typeof stat.displayValue === 'number'
                    ? `${stat.displayValue}+`
                    : stat.displayValue}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </SidePadding>
    </div>
  )
}