import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidePadding from 'components/Shared/SidePadding.Component';

type Solution = {
  line1: string;
  line2: string;
  line3: string;
  subtext1: string;
  subtext2: string;
  buttonText: string;
};

const ProductsSection = () => {
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const staticContent = [
      {
        line1: 'Experience The Convenience Of',
        line2: 'Our Management Information Systems',
        line3: 'Solutions Clients.',
        subtext1: 'Connect finance, sales, service, and operations with a solution',
        subtext2: 'trusted by over 500 small, midsize and large businesses.',
        buttonText: 'Get in Touch'
      }
    ];
    setSolutions(staticContent);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <SidePadding>
      <div className="py-20 bg-[#e6f0fa] text-center border border-[#167AA1] rounded-xl">
        {solutions.map((solution, index) => (
          <div key={index} className="font-poppins">
            <div className="text-[#167AA1] text-4xl md:text-5xl font-semibold leading-tight capitalize">
              {solution.line1}<br />
              {solution.line2}<br />
              {solution.line3}
            </div>
            <p className="text-black text-lg md:text-xl font-normal leading-6 mt-4">
              {solution.subtext1}<br />
              {solution.subtext2}
            </p>
            <button
              onClick={() => navigate('/contact-us', { replace: false })}
              className="mt-6 bg-[#e6f0fa] text-[#167AA1] border border-[#167AA1] px-6 py-2 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {solution.buttonText} <span className="ml-2">→</span>
            </button>
          </div>
        ))}
      </div>
    </SidePadding>
  );
};

export default ProductsSection;
