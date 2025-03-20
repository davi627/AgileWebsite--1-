import React from 'react'
import { Disclosure } from '@headlessui/react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface ProductItemProps {
  item: {
    name: string
    image: string
    description: string
  }
  index: number
  openDisclosure: number | null
  onDisclosureToggle: (index: number) => void
}

const ProductItem: React.FC<ProductItemProps> = ({
  item,
  index,
  openDisclosure,
  onDisclosureToggle
}) => {
  return (
    <>
      <Disclosure.Button
        className="flex w-full justify-between rounded bg-gray-200 px-4 py-6 text-left font-semibold hover:opacity-80 focus:outline-none focus-visible:ring"
        onClick={() => onDisclosureToggle(index)}
      >
        <span>{item.name}</span>
        <svg
          className={`${openDisclosure === index ? 'rotate-180' : ''} size-5`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Disclosure.Button>
      <Disclosure.Panel
        className={classNames(
          'px-4 pt-4 pb-2 text-sm text-gray-500',
          openDisclosure !== index ? 'hidden' : ''
        )}
      >
        <img
          src={item.image}
          alt={item.name}
          className="mt-4 h-64 w-full rounded object-cover"
        />
        <p className="mt-4">{item.description}</p>
      </Disclosure.Panel>
    </>
  )
}

export default ProductItem
