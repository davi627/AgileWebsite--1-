import React from 'react'

interface Service {
  title: string
  description: string
  image: string
  url: string
  rank: number
}

interface ServicesBlockProps {
  services: Service[]
}

const ServicesBlock: React.FC<ServicesBlockProps> = ({ services }) => {
  const sortedServices = [...services].sort((a, b) => a.rank - b.rank)

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedServices.map((service, index) => (
            <a
              key={index}
              href={service.url}
              className="flex h-60 flex-col items-center rounded-lg border bg-white p-6 transition-shadow duration-300 hover:shadow-md"
            >
              <img
                src={service.image}
                alt={service.title}
                className="mb-4 size-16 object-contain"
              />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {service.title}
              </h3>
              <p className="line-clamp-6 text-center text-sm text-gray-600">
                {service.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ServicesBlock
