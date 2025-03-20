import React from 'react'

interface QuoteBlockProps {
  quote: string
  author: string
}

const QuoteBlock: React.FC<QuoteBlockProps> = ({ quote, author }) => {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <blockquote className="text-center italic text-gray-700">
          {`"${quote}"`}
          <footer className="mt-4 text-base font-medium text-gray-900">
            - {author}
          </footer>
        </blockquote>
      </div>
    </div>
  )
}

export default QuoteBlock
