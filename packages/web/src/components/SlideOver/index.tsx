import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface SlideOverProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedSolution: {
    title?: string
    description?: string
    component?: React.ComponentType<any>
  } | null
}

const SlideOver: React.FC<SlideOverProps> = ({
  open,
  setOpen,
  selectedSolution
}) => {
  const Component = selectedSolution?.component

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md md:max-w-3xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="bg-primary px-4 py-6 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-white">
                          {selectedSolution?.title}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="bg-primary relative rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="size-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-indigo-300">
                          {selectedSolution?.description}
                        </p>
                      </div>
                    </div>
                    <div className="relative flex-1 px-4 py-6 sm:px-6">
                      {Component ? (
                        <Component />
                      ) : (
                        <p>No additional component provided.</p>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default SlideOver
