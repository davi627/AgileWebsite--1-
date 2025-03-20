import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link } from 'react-router-dom'
import {
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  ListBulletIcon,
  FolderIcon,
  DocumentDuplicateIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'
import NavigationList from './NavigationList'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Solutions', href: '/dashboard/solutions', icon: BeakerIcon },
  { name: 'Users', href: '/dashboard/users', icon: UsersIcon },
  { name: 'Blog', href: '/dashboard/blogs', icon: ListBulletIcon },
  { name: 'Careers', href: '/dashboard/careers', icon: FolderIcon },
  {
    name: 'Testimonials',
    href: '/dashboard/testimonials',
    icon: DocumentDuplicateIcon
  },
  { name: 'Reports', href: '/dashboard/reports', icon: ChartPieIcon }
]

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="size-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                      alt="Your Company"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <NavigationList items={navigation} />
                      </li>
                      <li className="mt-auto">
                        <Link
                          to="/dashboard/settings"
                          className="hover:text-primary group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50"
                        >
                          <Cog6ToothIcon
                            className="group-hover:text-primary size-6 shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          Settings
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <NavigationList items={navigation} />
              </li>
              <li className="mt-auto">
                <Link
                  to="/dashboard/settings"
                  className="hover:text-primary group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50"
                >
                  <Cog6ToothIcon
                    className="group-hover:text-primary size-6 shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar
