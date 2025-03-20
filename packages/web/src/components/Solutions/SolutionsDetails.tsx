import React from 'react'

interface SolutionDetailProps {
  name: string
  description: string
  image: string
  icon: string
}

const SolutionDetail: React.FC<SolutionDetailProps> = ({
  name,
  description,
  image,
  icon
}) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-white shadow-md">
      <div className="absolute left-0 top-0 m-2">
        <img src={icon} alt={`${name} icon`} className="size-8" />
      </div>
      <img src={image} alt={name} className="h-48 w-full object-cover" />
      <div className="p-4">
        <h2 className="mb-2 text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}

export default SolutionDetail
