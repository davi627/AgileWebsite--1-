/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from 'react'
import { Tab } from '@headlessui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { solutionsData } from './SolutionsData'
import SolutionCard from '../Cards/SolutionsCard'
import SlideOver from '../SlideOver'

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

const Solutions: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [selectedSolution, setSelectedSolution] = useState<any>(null)
  const tabListRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (tabListRef.current) {
      tabListRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (tabListRef.current) {
      tabListRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  const handleLearnMore = (solution: any) => {
    setSelectedSolution(solution)
    setOpen(true)
  }

  return (
    <div className="relative z-50 mx-auto my-32 w-full max-w-6xl px-4 sm:px-0">
      <Tab.Group>
        <div className="relative flex items-center">
          <button
            onClick={scrollLeft}
            className="bg-primary absolute left-0 z-10 flex size-12 items-center justify-center rounded-full p-2 text-white transition duration-300 hover:opacity-50 focus:outline-none"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="size-5" aria-hidden="true" />
          </button>
          <Tab.List
            ref={tabListRef}
            className="scrollbar-hide mx-16 flex space-x-2 overflow-x-auto rounded-md border-2 p-1"
          >
            {solutionsData.map((category) => (
              <Tab
                key={category.category}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-md py-2.5 px-4 text-sm font-medium leading-5 transition duration-300',
                    'focus:outline-none',
                    selected
                      ? 'bg-primary text-white'
                      : 'text-primary hover:bg-white/[0.15] hover:text-primary bg-white'
                  )
                }
              >
                {category.category}
              </Tab>
            ))}
          </Tab.List>
          <button
            onClick={scrollRight}
            className="bg-primary absolute right-0 z-10 flex size-12 items-center justify-center rounded-full p-2 text-white shadow-lg transition duration-300 hover:opacity-50 focus:outline-none"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="size-5" aria-hidden="true" />
          </button>
        </div>
        <Tab.Panels className="mt-4 w-full">
          {solutionsData.map((category) => (
            <Tab.Panel key={category.category} className="w-full">
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {category.items.map((item, index) => (
                  <SolutionCard
                    key={index}
                    name={item.name}
                    shortDescription={item.shortDescription}
                    image={item.image}
                    onLearnMore={() => handleLearnMore(item)}
                  />
                ))}
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
      <SlideOver
        open={open}
        setOpen={setOpen}
        selectedSolution={selectedSolution}
      />
    </div>
  )
}

export default Solutions
