import React from 'react'
import {
  UserGroupIcon,
  ChartBarIcon,
  CloudIcon,
  ServerIcon
} from '@heroicons/react/24/outline' 

const solutions = [
  {
    name: 'Customer Relationship Management',
    description:
      'Manage customer interactions and data with Microsoft Dynamics 365 CRM solutions.',
    icon: UserGroupIcon,
    bgColor: 'bg-white'
  },
  {
    name: 'Analytics, ML and AI',
    description: 'Gain insights and drive decisions with Microsoft Power BI.',
    icon: ChartBarIcon,
    bgColor: 'bg-white'
  },
  {
    name: 'Cloud Solutions',
    description:
      'Leverage cloud computing with Microsoft Azure and Microsoft 365.',
    icon: CloudIcon,
    bgColor: 'bg-white'
  },
  {
    name: 'ICT Infrastructure',
    description:
      'Robust infrastructure solutions for backup, virtualization, and security.',
    icon: ServerIcon,
    bgColor: 'bg-white'
  },
  {
    name: 'Mobile Applications and Web Portals',
    description: 'Develop custom mobile apps for Android and iOS.',
    icon: CloudIcon, 
    bgColor: 'bg-white'
  },
  {
    name: 'Bulk SMS and USSD Query Services',
    description: 'Efficiently manage bulk SMS services and USSD queries.',
    icon: ServerIcon, 
    bgColor: 'bg-white'
  }
]

const Solutions: React.FC = () => {
  return (
    <div className="mx-auto mt-20 max-w-4xl px-4 py-8">
      <h2 className="text-primary mb-8 text-center text-3xl font-bold">
        What we Offer?
      </h2>
      <p className="text-primary mb-12 text-center">
        In virtual space through communication platforms. Durable relations that
        extend beyond immediate genealogical ties.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {solutions.map((solution, index) => (
          <div
            key={index}
            className={`relative flex h-64 w-full flex-col items-start justify-between rounded-lg p-6 shadow-md ${solution.bgColor} cursor-pointer transition-colors hover:bg-gray-200`}
          >
            <div className="absolute left-0 top-0 m-2">
              <solution.icon className="text-primary m-4 size-12" />
            </div>
            <div className="mt-20">
              {' '}
              {/* Adjusted the margin-top to give space for the icon */}
              <h3 className="text-primary mb-4 text-lg font-semibold">
                {solution.name}
              </h3>
              <p className="text-primary whitespace-pre-line text-sm">
                {solution.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Solutions
