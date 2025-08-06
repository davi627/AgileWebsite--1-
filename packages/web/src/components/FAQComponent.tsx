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

const decodeHtmlEntities = (text: string): string => {
  if (!text) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

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
  if (!imageUrl) {
    console.warn('Empty imageUrl provided');
    return '/images/placeholder.png';
  }
  if (imageUrl.startsWith('data:') || imageUrl.startsWith('http')) {
    return imageUrl;
  }
  const normalizedPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
  const fullUrl = `${API_BASE_URL}/Uploads/${normalizedPath}`;
  console.log('Constructed image URL:', fullUrl);
  return fullUrl;
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
        const decodedCategory = {
          ...response.data,
          title: decodeHtmlEntities(response.data.title),
          description: decodeHtmlEntities(response.data.description),
          solutions: response.data.solutions?.map((solution: ISolution) => ({
            ...solution,
            name: decodeHtmlEntities(solution.name),
            shortDesc: decodeHtmlEntities(solution.shortDesc),
            fullDesc: decodeHtmlEntities(solution.fullDesc),
            implementation: decodeHtmlEntities(solution.implementation),
            features: solution.features?.map(feature => ({
              ...feature,
              text: decodeHtmlEntities(feature.text)
            }))
          }))
        };
        setCategory(decodedCategory);
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
        const decodedRandomCategories = shuffled.slice(0, 2).map((category: ISolutionCategory) => ({
          ...category,
          title: decodeHtmlEntities(category.title),
          description: decodeHtmlEntities(category.description),
          solutions: category.solutions?.map(solution => ({
            ...solution,
            name: decodeHtmlEntities(solution.name),
            shortDesc: decodeHtmlEntities(solution.shortDesc),
            fullDesc: decodeHtmlEntities(solution.fullDesc),
            implementation: decodeHtmlEntities(solution.implementation),
            features: solution.features?.map(feature => ({
              ...feature,
              text: decodeHtmlEntities(feature.text)
            }))
          }))
        }));
        setRandomCategories(decodedRandomCategories);
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
          imageUrl: solution.imageUrl ? getImageUrl(solution.imageUrl) : '/images/placeholder.png',
        }))
      );
    }
  }, [category]);

  const handleBackToCategories = () => {
    navigate('/', {
      state: { scrollToSection: 'erp-solutions' },
    });
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
      <div className="bg-[#F0F0F0] min-h-screen">
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
              <div className="max-w-4xl w-full mx-auto mt-28 sm:mt-24 md:mt-32 lg:mt-40 xl:mt-48 4xl:ml-[24px] lg:mr-[120px]">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl 4xl:text-4xl font-semibold leading-tight text-white capitalize"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  }}
                >
                  {category.title.endsWith(':') ? category.title : `${category.title}:`}
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl 4xl:text-4xl font-semibold leading-tight text-white capitalize mb-2 sm:mb-3 md:mb-4"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  }}
                >
                  Powering Your Tech Company's Growth
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xs sm:text-sm md:text-base lg:text-base 4xl:text-lg font-normal leading-relaxed text-white max-w-xl 4xl:max-w-2xl"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
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
        <div className="py-8 sm:py-10 md:py-12 lg:py-16 4xl:py-20 max-w-5xl w-full mx-auto">
          {/* Solutions List */}
          <div className="space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16 xl:space-y-20 4xl:space-y-24 max-w-5xl w-full mx-auto">
            <AnimatePresence>
              {theFAQs.map((faq, index) => (
                <motion.div
                  key={faq.solutionId}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex ${index % 2 === 0 ? 'flex-row lg:gap-36' : 'flex-row-reverse lg:gap-36'} items-center gap-3 sm:gap-4 md:gap-6 xl:gap-12 4xl:gap-16`}
                >
                  {/* Image Section */}
                  <div className="w-[45%] sm:w-[42%] md:w-[40%] lg:w-[42%] 4xl:w-[38%] flex justify-center flex-shrink-0 self-center">
                    <div className="relative group w-full h-[120px] sm:h-[150px] md:h-[200px] lg:h-[250px] xl:h-[300px] 4xl:h-[380px]">
                      <div className="w-full h-full overflow-hidden rounded-[12px] sm:rounded-[16px] md:rounded-[20px] shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        {faq.imageUrl ? (
                          <img
                            src={faq.imageUrl}
                            alt={faq.q}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              console.error('Failed to load FAQ image:', faq.imageUrl);
                              e.currentTarget.src = '/images/placeholder.png';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400 text-sm sm:text-lg">No Image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="w-[51%] sm:w-[54%] md:w-[56%] lg:w-[58%] 4xl:w-[58%] flex flex-col justify-center items-start gap-2 sm:gap-3 md:gap-4 lg:gap-6 4xl:gap-8 self-center">
                    <div>
                      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 4xl:text-3xl font-bold text-[#167AA1] mb-2 sm:mb-3 4xl:mb-4 leading-tight">{faq.q}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-base xl:text-base 4xl:text-lg leading-relaxed line-clamp-6 sm:line-clamp-6 md:line-clamp-none">{faq.a.replace(/<[^>]*>/g, '')}</p>
                    </div>
                    <span
                      onClick={() => handleReadMore(faq.solutionId)}
                      className="inline-flex items-center gap-1 sm:gap-2 text-[#167AA1] cursor-pointer hover:underline font-medium text-xs sm:text-sm md:text-base lg:text-base 4xl:text-lg group mt-1 sm:mt-2 4xl:mt-4"
                    >
                      <span>Learn More</span>
                      <BsArrowRight size={12} className="sm:w-4 sm:h-4 4xl:w-6 4xl:h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {theFAQs.length === 0 && (
            <div className="text-center py-16 sm:py-20 max-w-7xl w-full mx-auto">
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

        {/* Straight Section */}
        <div className="relative w-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px] 4xl:min-h-[600px] bg-[#167AA1] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${SectionImage})`,
            }}
          ></div>
          <div className="relative z-10 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px] 4xl:min-h-[600px] flex items-center lg:mr-[140px]">
            <SidePadding>
              <div className="max-w-4xl w-full mx-auto 4xl:max-w-[1800px]">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 4xl:text-5xl font-semibold leading-tight text-white capitalize"
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
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 4xl:text-5xl font-semibold leading-tight text-white capitalize mb-3 sm:mb-4 md:mb-6 4xl:mb-8"
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
                  className="text-xs sm:text-sm md:text-base lg:text-base 4xl:text-lg font-normal leading-relaxed text-white max-w-2xl 4xl:max-w-3xl"
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
                  onClick={() => navigate('/contact-us')}
                  className="mt-4 sm:mt-6 4xl:mt-8 flex h-10 sm:h-12 4xl:h-14 px-4 sm:px-6 4xl:px-8 justify-center items-center gap-2 sm:gap-3 4xl:gap-4 rounded-full bg-[#FCB040] hover:bg-[#E0A738] text-white font-medium text-xs sm:text-sm md:text-base lg:text-base 4xl:text-lg transition-all duration-300 group shadow-lg hover:shadow-xl"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    marginLeft: '20px',
                  }}
                >
                  <span>Contact Sales</span>
                  <BsArrowRight size={16} className="sm:w-[18px] sm:h-[18px] 4xl:w-6 4xl:h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </SidePadding>
          </div>
        </div>

       {/* Do More With Agile Section */}
        <SidePadding>
          <div className="py-8 sm:py-10 md:py-12 lg:py-16 4xl:py-20 font-Poppins">
            <div className="text-left mb-6 sm:mb-8 4xl:mb-12 max-w-4xl lg:max-w-[1280px] w-full mx-auto 4xl:max-w-[1800px]">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl 4xl:text-3xl font-semibold text-primary mb-2 4xl:mb-4">Do More With Agile</h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-base 4xl:text-lg leading-relaxed">Learn More About Our Other Solutions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 sm:gap-x-12 md:gap-x-16 4xl:gap-x-24 gap-y-4 sm:gap-y-6 4xl:gap-y-8 max-w-4xl lg:max-w-[1280px] w-full mx-auto 4xl:max-w-[1800px]">
              <AnimatePresence>
                {randomCategories.map((category) => (
                  <motion.div
                    key={category._id}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden flex flex-col h-full"
                    onClick={() => handleCategoryClick(category._id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="w-full h-24 sm:h-32 md:h-36 lg:h-48 4xl:h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0">
                      {category.imageUrl && !imageErrors.has(category._id) ? (
                        <img
                          src={getImageUrl(category.imageUrl)}
                          alt={`${category.title} illustration`}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          onError={() => handleImageError(category._id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 4xl:w-20 4xl:h-20 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                            <span className="text-blue-600 text-sm sm:text-lg md:text-xl lg:text-xl 4xl:text-2xl font-bold">{category.title.charAt(0).toUpperCase()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4 md:p-5 4xl:p-6 flex flex-col flex-1">
                      <h3 className="text-sm sm:text-base md:text-lg lg:text-lg 4xl:text-xl font-semibold text-primary mb-2 sm:mb-3 4xl:mb-4 group-hover:text-primary transition-colors">{category.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-base 4xl:text-lg leading-relaxed mb-3 sm:mb-4 4xl:mb-6 flex-1 line-clamp-2 sm:line-clamp-3">
                        {category.description || 'Comprehensive business consulting and strategic solutions to drive growth and efficiency across your organization.'}
                      </p>
                      <div className="mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryClick(category._id);
                          }}
                          className="inline-flex items-center justify-center px-3 sm:px-4 4xl:px-6 py-1.5 sm:py-2 4xl:py-3 bg-white border border-alternate text-alternate font-medium text-xs sm:text-sm md:text-base lg:text-base 4xl:text-lg rounded-md sm:rounded-lg hover:bg-alternate hover:text-white transition-colors group/button"
                        >
                          <span>Learn More</span>
                          <BsArrowRight size={12} className="sm:w-[14px] sm:h-[14px] 4xl:w-6 4xl:h-6 ml-1 sm:ml-2 4xl:ml-3 group-hover/button:translate-x-1 transition-transform duration-200" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {randomCategories.length === 0 && (
              <div className="text-center py-8 sm:py-10 4xl:py-16 max-w-4xl lg:max-w-[1280px] w-full mx-auto 4xl:max-w-[1800px]">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 4xl:w-24 4xl:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 4xl:mb-8">
                    <span className="text-2xl sm:text-3xl 4xl:text-4xl text-gray-400">📋</span>
                  </div>
                  <h3 className="text-lg sm:text-xl 4xl:text-2xl font-semibold text-gray-900 mb-2 4xl:mb-4">No Other Solutions Available</h3>
                  <p className="text-sm sm:text-base lg:text-base 4xl:text-lg text-gray-600">No additional solutions are currently available.</p>
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
