import React from 'react'
import image001 from '../../../assets/solutions/kindpng_4299320.png'

interface ContentBlockProps {
  heading: string
  content: string
}

const ContentBlock: React.FC<ContentBlockProps> = ({ heading, content }) => {
  return (
    <div className="content-block mx-auto my-8 max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="lg:col-span-1">
          <h2 className="text-primary mb-6 text-2xl font-bold sm:text-3xl">
            {heading}
          </h2>
          <div
            className="prose prose-lg text-gray-600"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        <div className="lg:col-span-1">
          <img src={image001} alt="Placeholder" className="" />
        </div>
      </div>
    </div>
  )
}

export default ContentBlock
