import React from 'react'

interface ChildSolution {
  name: string
  icon: string
  slug: string
}

interface ChildSolutionsBlockProps {
  childrenSolutions: ChildSolution[]
}

const ChildSolutionsBlock: React.FC<ChildSolutionsBlockProps> = ({
  childrenSolutions
}) => {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
          Trusted by the world’s most innovative teams
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {childrenSolutions.map((solution, index) => (
            <a
              key={index}
              href={`/${solution.slug}`}
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt={solution.name}
                src={solution.icon}
                width={158}
                height={48}
                className="max-h-12 w-full object-contain transition-transform hover:scale-105"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChildSolutionsBlock
