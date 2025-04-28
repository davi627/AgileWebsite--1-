import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import SidePadding from 'components/Shared/SidePadding.Component';
import Pill from './Pill.Component';

import feature1 from '../../assets/feature1.png';
import feature2 from '../../assets/feature2.jpg';
import feature3 from '../../assets/feature3.jpg';
import chevDown from '../../assets/chevron-down.svg';

import './faq.css';

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
  solutions: ISolution[];
}

function OurSolns() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ISolutionCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ISolutionCategory | null>(null);
  const [selectedSolution, setSelectedSolution] = useState<number>(0);
  const [featureImg, setFeatureImg] = useState(feature1);
  const [theFAQs, setTheFAQs] = useState<{ q: string; a: string; solutionId: number }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [fade, setFade] = useState(true);
  // Add state to control showing all FAQs
  const [showAllFAQs, setShowAllFAQs] = useState(false);

  // Display only 5 FAQs by default
  const displayedFAQs = showAllFAQs ? theFAQs : theFAQs.slice(0, 5);
  // Check if we have more than 5 FAQs
  const hasMoreFAQs = theFAQs.length > 5;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/solution-categories`);
        console.log('Fetched categories:', response.data);
        setCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0]);
          if (response.data[0].solutions.length > 0) {
            setTheFAQs(response.data[0].solutions.map((solution: ISolution) => ({
              q: solution.name,
              a: solution.fullDesc,
              solutionId: solution.id
            })));
          }
        }
      } catch (error) {
        console.error('Failed to fetch solution categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFade(false);
      setTimeout(() => setFade(true), 100);
      // Reset show all FAQs when changing category
      setShowAllFAQs(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory && selectedCategory.solutions.length > 0) {
      setTheFAQs(selectedCategory.solutions.map((solution: ISolution) => ({
        q: solution.name,
        a: solution.fullDesc,
        solutionId: solution.id
      })));

      switch (selectedSolution) {
        case 0:
          setFeatureImg(feature1);
          break;
        case 1:
          setFeatureImg(feature2);
          break;
        case 2:
          setFeatureImg(feature3);
          break;
        default:
          setFeatureImg(feature1);
      }
    }
  }, [selectedCategory, selectedSolution]);

  const toggle = (i: number | null) => {
    setSelected(selected === i ? null : i);
  };

  const handleReadMore = (solutionId: number) => {
    if (selectedCategory) {
      navigate(`/solns/${selectedCategory._id}/${solutionId}`);
    }
  };

  // Handler for toggling show all/less FAQs
  const toggleShowAllFAQs = () => {
    setShowAllFAQs(prev => !prev);
  };

  if (!selectedCategory || selectedCategory.solutions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <SidePadding>
    <div id="erp-solutions" className="py-14 font-century relative">
      <img src={selectedCategory.imageUrl} alt="Logo" className="h-24" />
  
      <div className="mt-10 flex flex-wrap gap-4 relative z-10">
        {categories.map((category) => (
          <Pill
            key={category._id}
            title={category.title}
            onPress={() => {
              setSelectedCategory(category);
              setSelectedSolution(0);
            }}
            selected={category._id === selectedCategory._id}
          />
        ))}
      </div>
  
      {/* Properly centered watermark image with position absolute */}
      <div className="relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 mt-80 flex justify-center items-center pointer-events-none">
          <img
            src={selectedCategory.imageUrl}
            alt="Watermark"
            className="w-2/5 max-h-96 object-contain opacity-25"
          />
        </div>
      </div>
  
      <p className="mt-6 text-xl font-medium leading-tight md:text-[2rem] relative z-10">
        Transform your Business with <br /> {selectedCategory.title} solutions
      </p>
  
      <div className="mt-12 flex w-full gap-10 relative z-10">
        <div className="w-full">
          {/* FAQs as before */}
          {displayedFAQs.map((qn, i) => (
            <div key={i} className="mb-8">
              <button
                type="button"
                className="mb-1 flex w-full items-center justify-between gap-6 text-left md:font-medium"
                onClick={() => toggle(i)}
              >
                <p className="text-base md:text-lg">{qn.q}</p>
                <img
                  src={chevDown}
                  alt="v"
                  className={clsx([
                    'size-5 duration-700 ease-out',
                    selected === i ? 'rotate-180' : 'rotate-0',
                  ])}
                />
              </button>
              <div className={selected === i ? 'content show' : 'content'}>
                <p className="text-gray-700">
                  {qn.a}
                  <button 
                    onClick={() => handleReadMore(qn.solutionId)}
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    Read more
                  </button>
                </p>
              </div>
              <hr className="mt-4" />
            </div>
          ))}
  
          {hasMoreFAQs && (
            <div className="mt-4 mb-8">
              <button
                onClick={toggleShowAllFAQs}
                className="text-blue-600 font-medium hover:text-blue-800 hover:underline flex items-center"
              >
                {showAllFAQs ? 'Show Less' : 'Show More Solutions'}
                <svg 
                  className={`ml-1 h-4 w-4 transition-transform ${showAllFAQs ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </SidePadding>
  );
}

export default OurSolns;