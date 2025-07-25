import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from 'components/Navbar';
import SidePadding from 'components/Shared/SidePadding.Component';
import { FaArrowLeft } from 'react-icons/fa';
import { BsArrowRight } from 'react-icons/bs';
import HeroImage from '../assets/Hero.png';
import SectionImage from '../assets/section2.png';
import Footer from 'components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface ISolution {
  id: number;
  name: string;
  shortDesc: string;
  fullDesc: string;
  features: { text: string }[];
  implementation: string;
  imageUrl?: string;
}

interface ISolutionCategory {
  _id: string;
  title: string;
  imageUrl: string;
  description: string;
  solutions: ISolution[];
}

interface ISolutionFAQ {
  q: string;
  a: string;
  solutionId: number;
  imageUrl?: string;
}

const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('data:')) return imageUrl;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_BASE_URL}/${imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl}`;
};

const FAQComponent: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<ISolutionCategory | null>(null);
  const [theFAQs, setTheFAQs] = useState<ISolutionFAQ[]>([]);
  const [randomCategories, setRandomCategories] = useState<ISolutionCategory[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) {
        setError('Invalid category ID');
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/api/solution-categories/${categoryId}`);
        console.log('Category data:', response.data);
        setCategory(response.data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch category:', error);
        setError('Failed to load category data');
      }
    };
    fetchCategory();
  }, [categoryId]);

  useEffect(() => {
    const fetchRandomCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/solution-categories`);
        const allCategories = response.data;
        const filteredCategories = allCategories.filter((cat: ISolutionCategory) => cat._id !== categoryId);
        const shuffled = filteredCategories.sort(() => 0.5 - Math.random());
        setRandomCategories(shuffled.slice(0, 2));
      } catch (error) {
        console.error('Failed to fetch random categories:', error);
      }
    };
    fetchRandomCategories();
  }, [categoryId]);

  useEffect(() => {
    if (category && category.solutions) {
      setTheFAQs(
        category.solutions.map((solution: ISolution) => ({
          q: solution.name,
          a: solution.fullDesc,
          solutionId: solution.id,
          imageUrl: solution.imageUrl ? getImageUrl(solution.imageUrl) : 'https://via.placeholder.com/500',
        }))
      );
    }
  }, [category]);

  const handleBackToCategories = () => {
    navigate('/solutions');
  };

  const handleReadMore = (solutionId: number) => {
    if (categoryId) {
      navigate(`/solns/${categoryId}/${solutionId}`, {
        state: {
          fromCategory: categoryId,
          shouldScrollToQAndA: true,
        },
      });
    } else {
      navigate('/solutions');
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/solutions/${categoryId}`);
  };

  const handleImageError = (categoryId: string) => {
    setImageErrors((prev) => new Set(prev).add(categoryId));
  };

  if (error || !category) {
    return (
      <>
        <Navbar />
        <SidePadding>
          <div className="py-14 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#167AA1]"></div>
            <span className="ml-3 text-gray-600">{error || 'Loading...'}</span>
          </div>
        </SidePadding>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-[#FAFAFA] min-h-screen">
        {/* Hero Section */}
        <div
          className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[538px] flex-shrink-0"
          style={{
            background: `linear-gradient(90deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.60) 100%), url(${HeroImage}) lightgray 50% / cover no-repeat`,
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          <SidePadding>
            <div className="relative z-10 h-full flex items-center md:items-end pb-6 sm:pb-8 md:pb-8 text-left">
              <div className="max-w-4xl w-full mx-auto mt-28 sm:mt-24 md:mt-32 lg:mt-40 xl:mt-48">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-tight text-white capitalize"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  {category.title.endsWith(':') ? category.title : `${category.title}:`}
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-tight text-white capitalize mb-2 sm:mb-3 md:mb-4"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  Powering Your Tech Company's Growth
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xs sm:text-sm md:text-base font-normal leading-relaxed text-white max-w-xl"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                  }}
                >
                  {category.description || 'Comprehensive solutions designed to accelerate your business growth and digital transformation'}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  onClick={handleBackToCategories}
                  className="mt-3 sm:mt-4 flex items-center justify-center p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 group border border-white/30"
                >
                  <FaArrowLeft size={14} className="text-white group-hover:text-white transition-colors" />
                </motion.button>
              </div>
            </div>
          </SidePadding>
        </div>

        {/* Main Content */}
        <SidePadding>
          <div className="py-8 sm:py-10 md:py-12 lg:py-16">
            {/* Solutions List */}
            <div className="space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16 xl:space-y-20 max-w-4xl w-full mx-auto">
              <AnimatePresence>
                {theFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.solutionId}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12`}
                  >
                    {/* Image Section - Responsive sizing */}
                    <div className="w-2/5 sm:w-2/5 md:w-2/5 lg:w-1/2 flex justify-center flex-shrink-0">
                      <div className="relative group w-full max-w-[120px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-xs xl:max-w-sm">
                        <div className="aspect-square w-full overflow-hidden rounded-[12px] sm:rounded-[16px] md:rounded-[20px] shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <img
                            src={faq.imageUrl}
                            alt={faq.q}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/500')}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section - Takes remaining space */}
                    <div className="w-3/5 sm:w-3/5 md:w-3/5 lg:w-1/2 flex flex-col justify-center items-start gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                      <div>
                        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-[#167AA1] mb-2 sm:mb-3 leading-tight">{faq.q}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-3 sm:line-clamp-4 md:line-clamp-none">{faq.a.replace(/<[^>]*>/g, '')}</p>
                      </div>
                      <span
                        onClick={() => handleReadMore(faq.solutionId)}
                        className="inline-flex items-center gap-1 sm:gap-2 text-[#167AA1] cursor-pointer hover:underline font-medium text-xs sm:text-sm md:text-base group mt-1 sm:mt-2"
                      >
                        <span>Learn More</span>
                        <BsArrowRight size={12} className="sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {theFAQs.length === 0 && (
              <div className="text-center py-16 sm:py-20 max-w-4xl w-full mx-auto">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <span className="text-2xl sm:text-3xl text-gray-400">📋</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Solutions Available</h3>
                  <p className="text-sm sm:text-base text-gray-600">No solutions are currently available for this category.</p>
                </div>
              </div>
            )}
          </div>
        </SidePadding>

        {/* Straight Section */}
        <div className="relative w-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px] bg-[#167AA1] overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${SectionImage})`,
            }}
          ></div>

          {/* Content Overlay */}
          <div className="relative z-10 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px] flex items-center">
            <SidePadding>
              <div className="max-w-4xl w-full mx-auto">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold leading-tight text-white capitalize"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    marginLeft: '20px',
                  }}
                >
                  {category.title.endsWith(':') ? category.title : `${category.title}:`}
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold leading-tight text-white capitalize mb-3 sm:mb-4 md:mb-6"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    marginLeft: '20px',
                  }}
                >
                  Powering Your Tech Company's Growth
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xs sm:text-sm md:text-base font-normal leading-relaxed text-white max-w-2xl"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    marginLeft: '20px',
                  }}
                >
                  {category.description || 'Comprehensive solutions designed to accelerate your business growth and digital transformation'}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  onClick={() => navigate('/solutions')}
                  className="mt-4 sm:mt-6 flex h-10 sm:h-12 px-4 sm:px-6 justify-center items-center gap-2 sm:gap-3 rounded-full bg-[#FCB040] hover:bg-[#E0A738] text-white font-medium text-xs sm:text-sm md:text-base transition-all duration-300 group shadow-lg hover:shadow-xl"
                  style={{
                    marginLeft: '20px',
                  }}
                >
                  <span>Contact Sales</span>
                  <BsArrowRight size={16} className="sm:w-[18px] sm:h-[18px] group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </SidePadding>
          </div>
        </div>

        <SidePadding>
          <div className="py-8 sm:py-10 md:py-12 font-Poppins bg-[FFFFFF]">
            <div className="text-left mb-6 sm:mb-8 max-w-4xl w-full mx-auto">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary mb-2">Do More With Agile</h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">Learn More About Our Other Solutions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-8 md:gap-x-12 gap-y-4 sm:gap-y-6 max-w-4xl w-full mx-auto">
              <AnimatePresence>
                {randomCategories.map((category) => (
                  <motion.div
                    key={category._id}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden flex flex-col"
                    onClick={() => handleCategoryClick(category._id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ y: -4 }}
                  >
                    {/* Image container with responsive height */}
                    <div className="w-full h-24 sm:h-32 md:h-36 lg:h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {category.imageUrl && !imageErrors.has(category._id) ? (
                        <img
                          src={getImageUrl(category.imageUrl)}
                          alt={`${category.title} illustration`}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          onError={() => handleImageError(category._id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                            <span className="text-blue-600 text-sm sm:text-lg md:text-xl font-bold">{category.title.charAt(0).toUpperCase()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1">
                      <h3 className="text-sm sm:text-base font-semibold text-primary mb-2 sm:mb-3 group-hover:text-primary transition-colors">{category.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 flex-1 line-clamp-2 sm:line-clamp-3">
                        {category.description || 'Comprehensive business consulting and strategic solutions to drive growth and efficiency across your organization.'}
                      </p>
                      <div className="mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryClick(category._id);
                          }}
                          className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-alternate text-alternate font-medium text-xs sm:text-sm rounded-md sm:rounded-lg hover:bg-alternate hover:text-white transition-colors group/button"
                        >
                          <span>Learn More</span>
                          <BsArrowRight size={12} className="sm:w-[14px] sm:h-[14px] ml-1 sm:ml-2 group-hover/button:translate-x-1 transition-transform duration-200" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {randomCategories.length === 0 && (
              <div className="text-center py-8 sm:py-10 max-w-4xl w-full mx-auto">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <span className="text-2xl sm:text-3xl text-gray-400">📋</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Other Solutions Available</h3>
                  <p className="text-sm sm:text-base text-gray-600">No additional solutions are currently available.</p>
                </div>
              </div>
            )}
          </div>
        </SidePadding>
      </div>
      <Footer />
    </>
  );
};

export default FAQComponent;
