import React from 'react'

interface Testimonial {
  author: string
  content: string
}

interface TestimonialBlockProps {
  testimonials: Testimonial[]
}

const TestimonialBlock: React.FC<TestimonialBlockProps> = ({
  testimonials
}) => {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Testimonials</h2>
        <div className="mt-6 space-y-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="space-y-4">
              <p className="text-lg leading-6 text-gray-500">
                {testimonial.content}
              </p>
              <p className="text-base font-medium text-gray-900">
                {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestimonialBlock
