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
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              style={{ maxHeight: '900px' }}
            >
              <AnimatePresence mode="wait">
                {categories.map((category) => (
                  <motion.div
                    key={category._id}
                    id={`category-${category._id}`}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden flex flex-col"
                    onClick={() => handleCategoryClick(category._id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ y: -4 }}
                  >
                    {/* Image Section */}
                    <div className="h-32 sm:h-36 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                      {category.imageUrl && !imageErrors.has(category._id) ? (
                        <img
                          src={getImageUrl(category.imageUrl)}
                          alt={`${category.title} illustration`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={() => handleImageError(category._id)}
                        />
                      ) : (
                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                          <span className="text-blue-600 text-xl font-bold">
                            {category.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>

                      <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                        {category.description ||
                          'Comprehensive business consulting and strategic solutions to drive growth and efficiency across your organization.'}
                      </p>

                      {/* Learn More Button */}
                      <div className="mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryClick(category._id);
                          }}
                          className="inline-flex items-center justify-center px-4 py-2 bg-white border border-alternate text-alternate font-small text-sm rounded-lg  transition-colors group/button"
                        >
                          <span>Learn More</span>
                          <BsArrowRight
                            size={14}
                            className="ml-2 group-hover/button:translate-x-1 transition-transform duration-200"
                          />
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
