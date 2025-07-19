import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from 'components/Navbar';
import SidePadding from 'components/Shared/SidePadding.Component';
import { FaArrowLeft } from 'react-icons/fa';
import { BsArrowRight } from 'react-icons/bs';
import HeroImage from '../assets/Hero.png';
import SectionImage from '../assets/section.png';
import Footer from 'components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface ISolution {
  id: number;
  name: string;
  shortDesc: string;
  fullDesc: string;
  features: { text: string }[];
  implementation: string;
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

// Dummy images for Q&A sections
const dummyImages = [
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&h=500&fit=crop'
];

const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
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
        // Select 2 random categories, excluding the current category
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
        category.solutions.map((solution: ISolution, index: number) => ({
          q: solution.name,
          a: solution.fullDesc,
          solutionId: solution.id,
          imageUrl: dummyImages[index % dummyImages.length],
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
      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <div
          className="relative w-[1440px] max-w-full h-[538px] flex-shrink-0 mx-auto"
          style={{
            background: `linear-gradient(90deg, rgba(0, 0, 0, 0.00) 40.23%, rgba(0, 0, 0, 0.70) 96.58%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), url(${HeroImage}) lightgray 50% / cover no-repeat`,
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          <SidePadding>
            <div className="relative z-10 h-[538px] flex items-center text-left">
              <div className="max-w-[798px] w-full">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-[48px] font-semibold leading-[58px] text-white capitalize drop-shadow-lg"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {category.title.endsWith(':') ? category.title : `${category.title}:`}
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-[48px] font-semibold leading-[58px] text-white capitalize whitespace-nowrap drop-shadow-lg mb-8"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Powering Your Tech Company's Growth
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-[14px] font-normal leading-[24px] text-white drop-shadow-md"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {category.description || 'Comprehensive solutions designed to accelerate your business growth and digital transformation'}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  onClick={handleBackToCategories}
                  className="mt-6 flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-[#167AA1]/10 transition-colors group"
                >
                  <FaArrowLeft size={16} className="text-gray-700 group-hover:text-[#167AA1] transition-colors" />
                </motion.button>
              </div>
            </div>
          </SidePadding>
        </div>

        {/* Main Content */}
        <SidePadding>
          <div className="py-16">
            {/* Solutions List */}
            <div className="space-y-[120px]">
              <AnimatePresence>
                {theFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.solutionId}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`flex flex-col ${
                      index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    } items-center gap-12 lg:gap-16`}
                  >
                    {/* Image Section */}
                    <div className="w-full lg:w-1/2 flex justify-center">
                      <div className="relative group aspect-square w-[508px]">
                        <img
                          src={faq.imageUrl}
                          alt={faq.q}
                          className="w-full h-full object-cover rounded-[20px] shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full lg:w-[508px] flex flex-col justify-center items-start gap-8">
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-[#167AA1] mb-4">
                          {faq.q}
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {faq.a.replace(/<[^>]*>/g, '')}
                        </p>
                      </div>

                      <span
                        onClick={() => handleReadMore(faq.solutionId)}
                        className="inline-flex items-center gap-3 text-[#167AA1] cursor-pointer hover:underline font-medium text-lg group"
                      >
                        <span>Learn More</span>
                        <BsArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {theFAQs.length === 0 && (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl text-gray-400">📋</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Solutions Available</h3>
                  <p className="text-gray-600">No solutions are currently available for this category.</p>
                </div>
              </div>
            )}
          </div>
        </SidePadding>

        {/* New Section with Curved PNG Image */}
<div className="relative w-full h-[504px] bg-[#167AA1] overflow-hidden">
  {/* White curved section with image */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-white"
    style={{
      backgroundImage: `url(${SectionImage})`,

    }}
  ></div>

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex items-center">
            <SidePadding>
              <div className="max-w-[798px] w-full">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-[48px] font-semibold leading-[58px] text-white capitalize drop-shadow-lg"
                >
                  {category.title.endsWith(':') ? category.title : `${category.title}:`}
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-[48px] font-semibold leading-[58px] text-white capitalize whitespace-nowrap drop-shadow-lg mb-8"
                >
                  Powering Your Tech Company's Growth
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-[14px] font-normal leading-[24px] text-white drop-shadow-md"
                >
                  {category.description || 'Comprehensive solutions designed to accelerate your business growth and digital transformation'}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  onClick={() => navigate('/solutions')}
                  className="mt-6 flex h-12 px-5 justify-center items-center gap-[18px] rounded-[100px] bg-[#FCB040] hover:bg-[#E0A738] text-white font-medium text-lg transition-colors group"
                >
                  <span>Contact Sales</span>
                  <BsArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </SidePadding>
          </div>
        </div>

        {/* Random Categories Section */}
        <SidePadding>
          <div className="py-10 font-Poppins">
            <div className="text-left mb-8 max-w-5xl mx-auto">
              <h2 className="text-3xl font-semibold text-primary mb-2 ">Do More With Agile</h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Learn More About Our Other Solutions
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-5xl mx-auto">
              <AnimatePresence>
                {randomCategories.map((category) => (
                  <motion.div
                    key={category._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-200 min-h-[280px]"
                    onClick={() => handleCategoryClick(category._id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="p-6 h-full flex flex-col">
                      <div className="mb-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                          {category.imageUrl && !imageErrors.has(category._id) ? (
                            <img
                              src={getImageUrl(category.imageUrl)}
                              alt={`${category.title} icon`}
                              className="w-8 h-8 object-contain"
                              onError={() => handleImageError(category._id)}
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
                              <span className="text-gray-500 text-sm font-bold">
                                {category.title.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 className="text-base font-semibold text-black mb-4 group-hover:text-gray-700 transition-colors">
                        {category.title}
                      </h3>

                      <p className="text-gray-600 text-base mb-6 flex-grow">
                        {category.description ||
                          'Comprehensive business consulting and strategic solutions to drive growth and efficiency across your organization.'}
                      </p>

                      <div className="mt-auto">
                        <button
                          onClick={() => handleCategoryClick(category._id)}
                          className="w-full px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium border border-gray-300 flex items-center justify-between text-base"
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
            {randomCategories.length === 0 && (
              <div className="text-center py-10">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl text-gray-400">📋</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Other Solutions Available</h3>
                  <p className="text-gray-600">No additional solutions are currently available.</p>
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
