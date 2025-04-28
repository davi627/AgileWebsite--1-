import { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Logo {
  _id: string;
  name: string;
  bwLogoUrl: string;
  colorLogoUrl: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Partners() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#F3F8FA] py-[4.5rem]">
      <h2 className="text-center text-lg font-medium tracking-wide text-[#1E1E1E] md:tracking-wider">
        We have Partnered with the best
      </h2>

      <div className="relative mt-10 flex items-center justify-center">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="z-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
        >
          <FaChevronLeft />
        </button>

        {/* Scrollable logos container (only 5 logos visible) */}
        <div
  ref={scrollRef}
  className="mx-4 flex gap-10 md:gap-16 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide"
  style={{ maxWidth: '80rem' }} // Updated for 8 big logos
>
  {logos.map((logo) => (
    <div key={logo._id} className="group relative h-24 w-40 shrink-0">
      <img
        src={`${API_BASE_URL}${logo.bwLogoUrl}`}
        alt={`${logo.name} (BW)`}
        className="size-full object-contain transition-opacity duration-300 group-hover:opacity-0"
      />
      <img
        src={`${API_BASE_URL}${logo.colorLogoUrl}`}
        alt={`${logo.name} (Color)`}
        className="absolute inset-0 size-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </div>
  ))}
</div>



        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="z-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
