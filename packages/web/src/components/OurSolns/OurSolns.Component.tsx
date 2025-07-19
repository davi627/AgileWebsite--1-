// OurSolns.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import SidePadding from 'components/Shared/SidePadding.Component';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BsArrowRight } from 'react-icons/bs';
import './faq.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_BASE_URL}/${imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl}`;
};

interface ISolutionCategory {
  _id: string;
  title: string;
  imageUrl: string;
  description: string;
  solutions: { id: number; name: string; shortDesc: string; fullDesc: string; features: { text: string }[]; implementation: string }[];
}

function OurSolns() {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState<ISolutionCategory[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
  };

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

  useEffect(() => {
    if (location.state?.scrollToCategory && scrollContainerRef.current) {
      const categoryElement = document.getElementById(`category-${location.state.scrollToCategory}`);
      if (categoryElement) {
        categoryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [location.state, categories]);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/solutions/${categoryId}`);
  };

  const handleImageError = (categoryId: string) => {
    setImageErrors((prev) => new Set(prev).add(categoryId));
  };

  if (!categories.length) {
    return (
      <SidePadding>
        <div className="py-14 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading solutions...</span>
        </div>
      </SidePadding>
    );
  }

  return (
    <SidePadding>
      <div id="erp-solutions" className="py-14 font-Poppins">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">Solutions</h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive range of technology solutions designed to transform your business and drive sustainable growth.
          </p>
        </div>

        <div className="relative">
          <div className="flex-1 overflow-y-auto sm:overflow-x-auto">
            <div
              ref={scrollContainerRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              style={{ maxHeight: '900px' }}
            >
              <AnimatePresence mode="wait">
                {categories.map((category) => (
                  <motion.div
                    key={category._id}
                    id={`category-${category._id}`}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-200 min-h-[250px] sm:min-h-[280px]"
                    onClick={() => handleCategoryClick(category._id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="p-4 sm:p-6 h-full flex flex-col">
                      <div className="mb-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                          {category.imageUrl && !imageErrors.has(category._id) ? (
                            <img
                              src={getImageUrl(category.imageUrl)}
                              alt={`${category.title} icon`}
                              className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                              onError={() => handleImageError(category._id)}
                            />
                          ) : (
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded flex items-center justify-center">
                              <span className="text-gray-500 text-xs sm:text-sm font-bold">
                                {category.title.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 className="text-sm sm:text-base font-semibold text-black mb-3 sm:mb-4 group-hover:text-gray-700 transition-colors">
                        {category.title}
                      </h3>

                      <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 flex-grow">
                        {category.description ||
                          'Comprehensive business consulting and strategic solutions to drive growth and efficiency across your organization.'}
                      </p>

                      <div className="mt-auto">
                        <button
                          onClick={() => handleCategoryClick(category._id)}
                          className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium border border-gray-300 flex items-center justify-between text-sm sm:text-base"
                        >
                          <span>Learn More</span>
                          <BsArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </SidePadding>
  );
}

export default OurSolns;
