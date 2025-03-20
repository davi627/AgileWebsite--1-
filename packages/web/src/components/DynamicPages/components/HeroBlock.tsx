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
  ctaButtons?: CTAButton[] // Make optional
}

export default function HeroBlock({
  title,
  subtitle = '',
  description,
  backgroundImageUrl,
  ctaButtons = [] // Default to an empty array if undefined
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
            {/* <div className="mt-10 flex items-center justify-center gap-x-6">
              {ctaButtons.map((button, index) => (
                <a
                  key={index}
                  href={button.url}
                  className={`rounded-md px-3.5 py-2.5 text-sm font-semibold ${
                    button.primary
                      ? 'bg-primary text-white hover:opacity-90'
                      : 'text-gray-900'
                  }`}
                >
                  {button.label}
                </a>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
