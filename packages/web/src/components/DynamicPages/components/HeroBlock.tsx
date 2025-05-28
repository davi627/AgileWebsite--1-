import React from 'react'

interface CTAButton {
  label: string
  url: string
  primary?: boolean
}

interface HeroBlockProps {
  title: string
  subtitle?: string
  description: string
  backgroundImageUrl: string
  ctaButtons?: CTAButton[]
}

export default function HeroBlock({
  title,
  subtitle = '',
  description,
  backgroundImageUrl,
  ctaButtons = []
}: HeroBlockProps) {
  return (
    <div className="relative">
      <div className="relative isolate px-4 pt-8 lg:px-4">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-full overflow-hidden"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="mx-auto max-w-2xl py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <h2 className="mt-4 text-lg font-semibold text-gray-600">
                {subtitle}
              </h2>
            )}
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {description}
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}
