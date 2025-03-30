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
  _id: string;
  title: string;
  soln: string;
  img: string;
  route: string;
  faqs: { q: string; a: string }[];
}

function OurSolns() {
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState<ISolution[]>([]);
  const [selectedSoln, setSelectedSoln] = useState<ISolution | null>(null);
  const [featureImg, setFeatureImg] = useState(feature1);
  const [theFAQs, setTheFAQs] = useState<{ q: string; a: string }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  // Fetch solutions from the backend
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/solns/solution`);
        setSolutions(response.data);
        if (response.data.length > 0) {
          setSelectedSoln(response.data[0]);
          setTheFAQs(response.data[0].faqs);
        }
      } catch (error) {
        console.error('Failed to fetch solutions:', error);
      }
    };

    fetchSolutions();
  }, []);

  // Update FAQs and feature image when selected solution changes
  useEffect(() => {
    if (selectedSoln) {
      setTheFAQs(selectedSoln.faqs);
      switch (selectedSoln.soln) {
        case 'microsoft':
          setFeatureImg(feature1);
          break;
        case 'sap':
          setFeatureImg(feature2);
          break;
        case 'oracle':
        case 'redstor':
          setFeatureImg(feature3);
          break;
        default:
          setFeatureImg(feature1);
      }
    }
  }, [selectedSoln]);

  const toggle = (i: number | null) => {
    if (selected === i) {
      setSelected(null);
    } else {
      setSelected(i);
    }
  };

  // Navigation handler
  const handleReadMore = () => {
    navigate('/solns'); 
  };

  if (!selectedSoln) {
    return <div>Loading...</div>;
  }

  return (
    <SidePadding>
      <div id="erp-solutions" className="py-14">
        <img src={selectedSoln.img} alt="Logo" className="h-6" />
        <div className="mt-10 flex gap-8 overflow-x-scroll">
          {solutions.map((soln) => (
            <Pill
              key={soln._id}
              title={soln.title}
              onPress={() => {
                setSelectedSoln(soln);
              }}
              selected={soln.soln === selectedSoln.soln}
            />
          ))}
        </div>
        <p className="mt-6 text-xl font-medium leading-tight md:text-[2rem]">
          Transform your Business with <br /> {selectedSoln.title} solutions
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
                      onClick={handleReadMore}
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