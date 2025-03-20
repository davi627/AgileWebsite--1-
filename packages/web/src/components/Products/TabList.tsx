import React from 'react'
import { Tab } from '@headlessui/react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface Category {
  category: string
  items: { name: string; image: string; description: string }[]
}

interface ProductTabListProps {
  categories: Category[]
  onCategoryChange: (index: number) => void
}

const ProductTabList: React.FC<ProductTabListProps> = ({
  categories,
  onCategoryChange
}) => {
  return (
    <Tab.List className="flex shrink-0 space-x-0 overflow-x-auto rounded-md p-1 py-6 font-semibold lg:w-1/3 lg:flex-col lg:space-x-0 lg:space-y-2 lg:p-2">
      {categories.map((category, index) => (
        <Tab
          key={category.category}
          className={({ selected }) =>
            classNames(
              'py-6 px-6 text-sm font-semibold leading-5 rounded bg-gray-200',
              selected
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100 hover:opacity-80 focus:outline-none focus-visible:ring'
            )
          }
          onClick={() => onCategoryChange(index)}
        >
          {category.category}
        </Tab>
      ))}
    </Tab.List>
  )
}

export default ProductTabList
