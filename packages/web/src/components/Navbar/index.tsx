
import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidePadding from 'components/Shared/SidePadding.Component';
import Logo from 'assets/Agile Logo.png';
import call from '../../assets/call.png'

import { API_BASE_URL } from 'config/api';

interface ISolutionCategory {
  _id: string;
  title: string;
  imageUrl: string;
  description: string;
  solutions: { id: number; name: string; shortDesc: string; fullDesc: string; features: { text: string }[]; implementation: string }[];
}

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<ISolutionCategory[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/solution-categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch solution categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleNavigation = (item: { href: string; external?: boolean; categoryId?: string }) => {
    if (item.external) {
      window.location.href = item.href;
      return;
    }
    const [path, hash] = item.href.split('#');
    if (item.categoryId) {
      navigate(`/solutions/${item.categoryId}`);
    } else if (path) {
      navigate(path, { replace: false });
    }
    if (hash) {
      navigate('/', { replace: false });
      const intervalId = setInterval(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          clearInterval(intervalId);
        }
      }, 200);
    }
    setIsDropdownOpen(false);
  };

  return (
    <header
      className="absolute inset-x-0 top-0 z-50 bg-white font-Poppins"
      style={{
        transform: 'scale(1)', // Prevents zoom layout issues
        transformOrigin: 'top left',
      }}
    >
      <SidePadding>
        <nav className="flex items-center  justify-between py-8 max-w-[1400px] 3xl:max-w-[1600px] 4xl:max-w-[1700px] mx-auto 4xl:ml-[24px]" aria-label="Global">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Agile Business Solutions</span>
            <img className="h-9 w-auto" src={Logo} alt="Agile Business Solutions logo" />
          </a>
          <div className="flex xl:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="size-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden xl:flex xl:items-center xl:gap-x-8 font-regular ">
            <button
              onClick={() => handleNavigation({ href: '/' })}
              className="hover:text-primary leading-6 px-3 py-2"
            >
              Home
            </button>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="hover:text-primary leading-6 flex items-center px-3 py-2"
              >
                Solutions
                {isDropdownOpen ? (
                  <ChevronUpIcon className="ml-1 h-5 w-5 transition-transform duration-200" />
                ) : (
                  <ChevronDownIcon className="ml-1 h-5 w-5 transition-transform duration-200" />
                )}
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleNavigation({ href: `/solutions/${category._id}`, categoryId: category._id })}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {category.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => handleNavigation({ href: '/about-us' })}
              className="hover:text-primary leading-6 px-3 py-2"
            >
              About Us
            </button>
            <button
              onClick={() => handleNavigation({ href: '/blogs' })}
              className="hover:text-primary leading-6 px-3 py-2"
            >
              Blogs
            </button>
            <a
              href="https://careers.agilebiz.co.ke"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary leading-6 px-3 py-2"
            >
              Careers
            </a>
            <button
              onClick={() => handleNavigation({ href: '/contact' })}
              className="bg-primary hover:bg-primary/90 focus-visible:outline-primary rounded-3xl px-6 py-2.5 text-sm font-regular text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 flex items-center"
            >
              <span>Contact Us</span>
              <img src={call} alt="Call icon" className="ml-2 h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </SidePadding>
      <Dialog
        as="div"
        className="xl:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-8 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Agile Business Solutions</span>
              <img className="h-9 w-auto" src={Logo} alt="Agile Business Solutions logo" />
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
                <button
                  onClick={() => {
                    handleNavigation({ href: '/' });
                    setMobileMenuOpen(false);
                  }}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Home
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 flex items-center"
                  >
                    Solutions
                    {isDropdownOpen ? (
                      <ChevronUpIcon className="ml-1 h-5 w-5 transition-transform duration-200" />
                    ) : (
                      <ChevronDownIcon className="ml-1 h-5 w-5 transition-transform duration-200" />
                    )}
                  </button>
                  {isDropdownOpen && (
                    <div className="mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                      {categories.map((category) => (
                        <button
                          key={category._id}
                          onClick={() => {
                            handleNavigation({ href: `/solutions/${category._id}`, categoryId: category._id });
                            setMobileMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {category.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    handleNavigation({ href: '/about-us' });
                    setMobileMenuOpen(false);
                  }}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  About Us
                </button>
                <button
                  onClick={() => {
                    handleNavigation({ href: '/blogs' });
                    setMobileMenuOpen(false);
                  }}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Blogs
                </button>
                <a
                  href="https://careers.agilebiz.co.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Careers
                </a>
                <button
                  onClick={() => {
                    handleNavigation({ href: '/contact' });
                    setMobileMenuOpen(false);
                  }}
                  className="bg-primary hover:bg-primary-dark focus-visible:outline-primary w-auto mx-auto rounded-3xl px-6 py-2.5 text-sm font-regular text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 flex items-center"
                >
                  <span>Contact Us</span>
                  <img src={call} alt="Call icon" className="ml-2 h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
