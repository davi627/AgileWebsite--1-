import React from 'react'

interface CtaButtonBlockProps {
  message: string
  buttonLabel: string
  buttonUrl: string
}

const CtaButtonBlock: React.FC<CtaButtonBlockProps> = ({
  message,
  buttonLabel,
  buttonUrl
}) => (
  <div className="bg-primary rounded-md">
    <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {message}
        </h2>
        <a
          href={buttonUrl}
          className="text-primary rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {buttonLabel}
        </a>
      </div>
    </div>
  </div>
)

export default CtaButtonBlock
