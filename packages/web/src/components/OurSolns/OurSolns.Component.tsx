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

  // Fetch solution categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/solution-categories`);
        setCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0]);
          // Create FAQs using only solution name and fullDesc
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

  // Update FAQs and feature image when selected category or solution changes
  useEffect(() => {
    if (selectedCategory && selectedCategory.solutions.length > 0) {
      // Create FAQs using only solution name and fullDesc
      setTheFAQs(selectedCategory.solutions.map((solution: ISolution) => ({
        q: solution.name,
        a: solution.fullDesc,
        solutionId: solution.id
      })));
      
      // Set feature image based on solution index
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
    if (selected === i) {
      setSelected(null);
    } else {
      setSelected(i);
    }
  };

  // Navigation handler with solution ID and category ID
  const handleReadMore = (solutionId: number) => {
    if (selectedCategory) {
      navigate(`/solns/${selectedCategory._id}/${solutionId}`);
    }
  };

  if (!selectedCategory || selectedCategory.solutions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <SidePadding>
      <div id="erp-solutions" className="py-14" >
      <img src={selectedCategory.imageUrl} alt="Logo" className="h-24" />
        <div className="mt-10 flex gap-8 overflow-x-scroll">
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
        <p className="mt-6 text-xl font-medium leading-tight md:text-[2rem]">
          Transform your Business with <br /> {selectedCategory.title} solutions
        </p>

        <div className="mt-12 flex w-full gap-10">
          <div className="w-full md:w-2/5">
            {theFAQs.map((qn, i) => (
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
          </div>
          <div className="hidden w-3/5 md:block">
            <img
              src={featureImg}
              alt="feature img"
              className="h-96 w-full rounded-xl object-cover object-center"
            />
          </div>
        </div>


      </div>
    </SidePadding>
  );
}

export default OurSolns;