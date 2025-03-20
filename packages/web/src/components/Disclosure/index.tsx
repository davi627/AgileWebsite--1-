import { Disclosure as HeadlessDisclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'

interface DisclosureProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

const Disclosure = ({ title, children, isOpen, onToggle }: DisclosureProps) => {
  return (
    <div className="w-full">
      <div className="mx-auto w-full rounded-2xl bg-white p-2">
        <HeadlessDisclosure as="div" className="">
          <HeadlessDisclosure.Button
            className="bg-alternate flex w-full justify-between rounded px-4 py-6 text-left text-sm font-semibold focus:outline-none focus-visible:ring focus-visible:ring-opacity-75"
            onClick={onToggle}
          >
            <span>{title}</span>
            <ChevronDownIcon
              className={`${isOpen ? 'rotate-180' : ''} text-primary size-5`}
            />
          </HeadlessDisclosure.Button>
          <HeadlessDisclosure.Panel
            static
            className={`px-4 pb-2 pt-4 text-sm text-gray-500 ${
              isOpen ? 'block' : 'hidden'
            }`}
          >
            {children}
          </HeadlessDisclosure.Panel>
        </HeadlessDisclosure>
      </div>
    </div>
  )
}

export default Disclosure
