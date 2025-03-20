import React from 'react'

interface GlassCardProps {
  icon?: string
  title: string
  description: string
  children?: React.ReactNode
}

const GlassCard: React.FC<GlassCardProps> = ({
  icon,
  title,
  description,
  children
}) => {
  return (
    <div className="hover:shadow-neon flex flex-col rounded-lg border border-opacity-40 bg-opacity-30 bg-gradient-to-r from-blue-900 to-purple-900 p-6 shadow-lg backdrop-blur-lg transition duration-500 hover:scale-105">
      <div className="mb-4 flex items-center">
        {icon && (
          <img
            src={icon}
            alt={title}
            className="size-12 rounded-full shadow-md"
          />
        )}
        <div className="ml-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-sm text-gray-300">{description}</p>
        </div>
      </div>
      <div className="mb-4 text-white">{children}</div>
    </div>
  )
}

export default GlassCard
