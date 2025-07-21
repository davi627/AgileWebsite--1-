import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    // Simulate static content instead of fetching
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
    <div style={{ backgroundColor: '#e6f0fa', padding: '20px', textAlign: 'center', border: '1px solid #167AA1' }}>
      {solutions.map((solution, index) => (
        <div key={index}>
          <div style={{ color: '#167AA1', textAlign: 'center', fontFamily: 'Poppins', fontSize: '48px', fontStyle: 'normal', fontWeight: 600, lineHeight: '58px', textTransform: 'capitalize' }}>
            {solution.line1}<br />
            {solution.line2}<br />
            {solution.line3}
          </div>
          <p style={{ color: '#000', textAlign: 'center', fontFamily: 'Poppins', fontSize: '20px', fontStyle: 'normal', fontWeight: 400, lineHeight: '24px' }}>
            {solution.subtext1}<br />
            {solution.subtext2}
          </p>
          <button
            onClick={() => navigate('/contact-us', { replace: false })}
            style={{ backgroundColor: '#e6f0fa', color: '#167AA1', border: '1px solid #167AA1', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' }}
          >
            {solution.buttonText} <span style={{ marginLeft: '5px' }}>→</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductsSection;
