import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

interface FlyoutMenuProps {
  name: string
  children: React.ReactNode
}

const FlyoutMenu: React.FC<FlyoutMenuProps> = ({ name, children }) => {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`inline-flex items-center text-sm font-semibold leading-6 text-primary ${
              open ? 'text-opacity-90' : ''
            }`}
          >
            {name}
            <ChevronDownIcon
              className={`ml-2 size-5 text-primary transition-transform${
                open ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </Popover.Button>

          <Transition
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 mt-3 w-screen max-w-md -translate-x-1/2 px-2 sm:px-0">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                  {children}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

export default FlyoutMenu
