import React from 'react'

interface CallToActionBlockProps {
  message: string
  description: string
  buttonLabel: string
  buttonUrl: string
  learnMoreText?: string
  learnMoreUrl?: string
}

const CallToActionBlock: React.FC<CallToActionBlockProps> = ({
  message,
  description,
  buttonLabel,
  buttonUrl,
  learnMoreText = 'Learn more',
  learnMoreUrl = '#'
}) => (
  <div className="bg-primary rounded-2xl">
    <div className="px-6 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
          {message}
        </h2>
        <p className="text-md mx-auto mt-6 max-w-xl font-semibold text-white">
          {description}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {!!buttonUrl && (
            <a
              href={buttonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {buttonLabel}
            </a>
          )}
          {!!learnMoreUrl && (
            <a
              href={learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold leading-6 text-white"
            >
              {learnMoreText} <span aria-hidden="true">→</span>
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
)

export default CallToActionBlock
