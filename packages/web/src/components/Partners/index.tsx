import { useEffect, useRef, useState } from 'react';

interface Logo {
  _id: string;
  name: string;
  bwLogoUrl: string;
  colorLogoUrl: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://webtest-api.agilebiz.co.ke:5000';

export default function Partners() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollSpeed = 0.5; 

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/log/logo`);
        const data = await response.json();
        setLogos(data);
      } catch (error) {
        console.error('Failed to fetch logos:', error);
      }
    };

    fetchLogos();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || logos.length === 0) return;

    // Double the logos for seamless looping
    const logoElements = scrollContainer.querySelectorAll('img[data-logo]');
    const containerWidth = scrollContainer.scrollWidth / 2;
    
    let animationFrameId: number;
    let scrollPosition = 0;

    const animateScroll = () => {
      scrollPosition += scrollSpeed;
      
      // Reset scroll position when we've scrolled through one set of logos
      if (scrollPosition >= containerWidth) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [logos]);

  return (
    <div className="bg-[#F3F8FA] py-[4.5rem] overflow-hidden">
      <h2 className="text-center text-lg font-medium tracking-wide text-[#1E1E1E] md:tracking-wider font-Poppins">
        We have Partnered with the best
      </h2>

      <div className="relative mt-10 flex items-center justify-center">
        <div
          ref={scrollRef}
          className="mx-4 flex gap-10 md:gap-16 overflow-x-hidden whitespace-nowrap"
          style={{ maxWidth: '80rem' }}
        >
          {/* Render two sets of logos for seamless looping */}
          {[...logos, ...logos].map((logo, index) => (
            <div 
              key={`${logo._id}-${index}`}
              className="group relative flex items-center justify-center h-20 w-32 shrink-0 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <img
                data-logo
                src={`${API_BASE_URL}${logo.bwLogoUrl}`}
                alt={`${logo.name} (BW)`}
                className="absolute max-w-24 max-h-16 object-contain transition-opacity duration-300 group-hover:opacity-0"
              />
              <img
                src={`${API_BASE_URL}${logo.colorLogoUrl}`}
                alt={`${logo.name} (Color)`}
                className="absolute max-w-24 max-h-16 object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}