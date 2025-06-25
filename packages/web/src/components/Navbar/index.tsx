import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

import SidePadding from 'components/Shared/SidePadding.Component'

import Logo from 'assets/Agile Logo.png'
import fBIcon from 'assets/socials/fb.png'
import instaIcon from 'assets/insta logo.png'
import liIcon from 'assets/socials/linkedin.png'
import twitterIcon from 'assets/socials/twitter.png'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Solutions', href: '#erp-solutions' },
  { name: 'About Us', href: '/about-us' },
  { name: 'Contact Us', href: '/contact-us' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'Careers', href: 'https://careers.agilebiz.co.ke', external: true }
]

export default function Navbar() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavigation = (href: string) => {
    if (href === '/careers') {
      // Navigate to external careers site
      window.location.href = 'https://careers.agilebiz.co.ke'
      return
    }

    const [path, hash] = href.split('#')

    if (path) {
      navigate(path, { replace: false })
    }

    if (hash) {
      navigate('/', { replace: false })

      const intervalId = setInterval(() => {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
          clearInterval(intervalId)
        }
      }, 200)
    }
  }

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-white font-Poppins">
      <SidePadding>
        <nav
          className="flex items-center justify-between py-8"
          aria-label="Global"
        >
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Agile Business Solutions</span>
            <img className="h-9 w-auto" src={Logo} alt="agilebiz logo" />
          </a>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="size-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12 font-medium">
            {navigation.map((item) =>
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary leading-6"
                >
                  {item.name}
                </a>
              ) : (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="hover:text-primary leading-6"
                >
                  {item.name}
                </button>
              )
            )}
          </div>
          {/* HAS A USEFUL GET QUOTE MODAL */}
          {/* <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary-dark focus-visible:outline-primary rounded-md px-6 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Request Quote <span aria-hidden="true">&rarr;</span>
          </button>
          <GetQuoteModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            enquiryType="General Enquiry"
          />
        </div> */}
        </nav>
      </SidePadding>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-8 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Agile Business Solutions</span>
              <img className="h-9 w-auto" src={Logo} alt="" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="size-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  // <a
                  //   key={item.name}
                  //   href={item.href}
                  //   className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  // >
                  //   {item.name}
                  // </a>
                  <button
                    key={item.name}
                    onClick={() => {
                      handleNavigation(item.href)
                      setMobileMenuOpen(false)
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="py-6">
                <button className="bg-primary hover:bg-primary-dark focus-visible:outline-primary w-full rounded-md px-6 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                  Request Quote <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
