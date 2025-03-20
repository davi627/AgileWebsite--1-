import React from 'react'

interface ImageBlockProps {
  title: string
  subtitle: string
  description: string
  imageUrl: string
  imagePosition: 'left' | 'right'
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  imagePosition
}) => {
  return (
    <div className="flex flex-col items-center justify-between px-6 py-16 lg:flex-row lg:items-center">
      {imagePosition === 'left' && (
        <div className="mb-8 lg:mb-0 lg:w-1/2 lg:pr-8">
          <img
            src={imageUrl}
            alt="Display"
            className="h-auto max-h-96 w-full max-w-lg object-contain"
          />
        </div>
      )}
      <div className="lg:w-1/2">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500">{subtitle}</h2>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
        <p className="mb-6 text-lg text-gray-700">{description}</p>
      </div>
      {imagePosition === 'right' && (
        <div className="mt-8 lg:mt-0 lg:w-1/2 lg:pl-8">
          <img
            src={imageUrl}
            alt="Display"
            className="h-auto max-h-96 w-full max-w-lg object-contain"
          />
        </div>
      )}
    </div>
  )
}

export default ImageBlock
