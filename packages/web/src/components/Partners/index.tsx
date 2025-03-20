
import { useEffect, useState } from 'react';

interface Logo {
  _id: string;
  name: string;
  bwLogoUrl: string;
  colorLogoUrl: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Partners() {
  const [logos, setLogos] = useState<Logo[]>([]);

  // Fetch logos from the backend
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

  return (
    <div className="bg-[#F3F8FA] py-[4.5rem]">
      <h2 className="text-center text-lg font-medium tracking-wide text-[#1E1E1E] md:tracking-wider">
        We have Partnered with the best
      </h2>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-10 md:gap-16">
        {logos.map((logo) => (
          <div key={logo._id} className="group relative h-12 w-24">
            {/* Black-and-White Logo (Default) */}
            <img
              src={`${API_BASE_URL}${logo.bwLogoUrl}`}
              alt={`${logo.name} (BW)`}
              className="size-full object-contain transition-opacity duration-300 group-hover:opacity-0"
            />
            {/* Colored Logo (On Hover) */}
            <img
              src={`${API_BASE_URL}${logo.colorLogoUrl}`}
              alt={`${logo.name} (Color)`}
              className="absolute inset-0 size-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}