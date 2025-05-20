import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import SidePadding from 'components/Shared/SidePadding.Component';
import Pill from './Pill.Component';

import feature1 from '../../assets/feature1.png';
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
  const [visibleColumns, setVisibleColumns] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: 'easeIn' },
    },
  };

  const faqItem = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 },
    },
  };

  const chunkFAQs = (faqs: { q: string; a: string; solutionId: number }[], chunkSize: number) => {
    const chunks: any[] = [];
    for (let i = 0; i < faqs.length; i += chunkSize) {
      chunks.push(faqs.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const displayedFAQs = chunkFAQs(theFAQs, 5);
  const hasMoreColumns = displayedFAQs.length > visibleColumns;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/solution-categories`);
        setCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch solution categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setTheFAQs(
        selectedCategory.solutions.map((solution: ISolution) => ({
          q: solution.name,
          a: solution.fullDesc,
          solutionId: solution.id,
        }))
      );

      setSelectedSolution(0);
      setSelected(null);

      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedCategory]);

  const toggle = (i: number | null) => {
    setSelected(selected === i ? null : i);
  };

  const handleReadMore = (solutionId: number) => {
    if (selectedCategory) {
      navigate(`/solns/${selectedCategory._id}/${solutionId}`);
    }
  };

  const toggleShowMoreColumns = () => {
    setVisibleColumns((prev) => (prev < displayedFAQs.length ? prev + 1 : 2));
  };

  if (!selectedCategory || selectedCategory.solutions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <SidePadding>
      <div id="erp-solutions" className="py-14 font-century relative" ref={containerRef}>
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedCategory._id}
            src={selectedCategory.imageUrl}
            alt="Logo"
            className="h-24"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
          />
        </AnimatePresence>

        <div className="mt-10 flex flex-wrap gap-4 relative z-10">
          {categories.map((category) => (
            <Pill
              key={category._id}
              title={category.title}
              onPress={() => setSelectedCategory(category)}
              selected={category._id === selectedCategory._id}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={`title-${selectedCategory._id}`}
            className="mt-6 text-xl font-medium leading-tight md:text-[2rem] relative z-10"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Transform your Business with <br /> {selectedCategory.title} solutions
          </motion.p>
        </AnimatePresence>

        <div className="mt-12 w-full relative z-10">
          <div className="overflow-x-auto">
            <div className="grid gap-6 grid-flow-col auto-cols-[minmax(300px,_1fr)]">
              {displayedFAQs.slice(0, visibleColumns).map((column, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-6 w-80">
                  {column.map((qn: { q: string; a: string; solutionId: number }, i: number) => (
                    <div key={i} className="mb-4">
                      <button
                        type="button"
                        className="mb-2 flex w-full items-center justify-between gap-4 text-left font-medium"
                        onClick={() => toggle(i)}
                      >
                        <p className="text-base md:text-lg">{qn.q}</p>
                        <motion.img
                          src={chevDown}
                          alt="v"
                          className="size-5"
                          animate={{ rotate: selected === i ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </button>

                      <AnimatePresence>
                        {selected === i && (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={faqItem}
                            className="overflow-hidden"
                          >
                            <p className="text-gray-700 text-sm md:text-base">
                              {qn.a}
                              <button
                                onClick={() => handleReadMore(qn.solutionId)}
                                className="ml-2 text-blue-600 hover:underline"
                              >
                                Read more
                              </button>
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <hr className="mt-4" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {hasMoreColumns && (
            <div className="mt-6">
              <button
                onClick={toggleShowMoreColumns}
                className="text-blue-600 font-medium hover:text-blue-800 hover:underline flex items-center"
              >
                {visibleColumns < displayedFAQs.length ? 'Show More Columns' : 'Show Less Columns'}
                <motion.svg
                  className="ml-1 h-4 w-4"
                  animate={{ rotate: visibleColumns < displayedFAQs.length ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </SidePadding>
  );
}

export default OurSolns;
