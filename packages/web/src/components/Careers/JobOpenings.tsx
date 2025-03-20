import React, { useState, useEffect } from 'react'
import { fetchPublishedCareers } from '../../services/CareerService'
import { Career } from '../../types/Career'

export default function JobOpenings() {
  const [jobOpenings, setJobOpenings] = useState<Career[]>([])

  useEffect(() => {
    const fetchPublishedJobs = async () => {
      try {
        const jobs = await fetchPublishedCareers()
        setJobOpenings(jobs)
      } catch (error) {
        console.error('An error occurred while fetching job openings:', error)
      }
    }

    fetchPublishedJobs()
  }, [])

  return (
    <div className="container mx-auto px-4 py-16 md:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-3xl font-bold text-gray-800 md:text-4xl">
          Join Our Team
        </h2>
        <p className="mb-12 text-lg text-gray-600">
          We're always on the lookout for talented individuals to join our
          growing team. Explore our open positions below and take the next step
          in your career journey.
        </p>

        {jobOpenings.length > 0 ? (
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {jobOpenings.map((opening, index) => (
              <li
                key={index}
                className="overflow-hidden rounded-lg bg-white shadow-lg"
              >
                <a href={opening.slug} className="block">
                  <div className="px-6 py-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {opening.title}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {opening.description.substring(0, 100)}...
                    </p>
                  </div>
                  <div className="flex items-center justify-between bg-gray-100 px-6 py-3">
                    <span className="text-sm text-gray-600">
                      {opening.department}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      Learn More →
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-gray-600">
            No job openings found at this time.
          </p>
        )}
      </div>
    </div>
  )
}
