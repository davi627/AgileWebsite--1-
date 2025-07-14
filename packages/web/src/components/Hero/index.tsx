import { useEffect, useState, useRef } from 'react';
import SidePadding from 'components/Shared/SidePadding.Component';
import RequestDemoBtn from 'components/Shared/RequestDemoBtn.Component';
import HeroBg from '../../assets/Image 1.png';
import Microsoft from '../../assets/Image 2.png';
import Server from '../../assets/Server3.png';
import axios from 'axios';

// Define Logo interface for TypeScript
interface Logo {
  _id: string;
  name: string;
  bwLogoUrl: string;
  colorLogoUrl: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://webtest-api.agilebiz.co.ke:5000';

function Partners() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollSpeed = 0.5;

  // Fetch logos from API
  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/log/logo`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (Array.isArray(response.data)) {
          setLogos(response.data);
        } else {
          throw new Error('Invalid data format: Expected an array of logos');
        }
      } catch (error) {
        console.error('Failed to fetch logos:', error);
        setError('Unable to load partner logos. Please try again later.');
      }
    };

    fetchLogos();
  }, []);

  // Handle scrolling animation
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || logos.length === 0) return;

    const containerWidth = scrollContainer.scrollWidth / 2;
    let animationFrameId: number;
    let scrollPosition = 0;

    const animateScroll = () => {
      scrollPosition += scrollSpeed;
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
    <div className="bg-[#F3F8FA] py-12 overflow-hidden">
      <h2 className="text-center text-lg font-medium tracking-wide text-[#1E1E1E] md:tracking-wider font-Poppins">
        We have Partnered with the best
      </h2>
      <div className="relative mt-10 flex items-center justify-center">
        <div
          ref={scrollRef}
          className="mx-4 flex gap-10 md:gap-16 overflow-x-hidden whitespace-nowrap"
          style={{ maxWidth: '80rem' }}
        >
          {error ? (
            <p className="text-red-500 text-center w-full">{error}</p>
          ) : logos.length === 0 ? (
            <p className="text-gray-500 text-center w-full">Loading logos...</p>
          ) : (
            [...logos, ...logos].map((logo, index) => (
              <div
                key={`${logo._id}-${index}`}
                className="group relative flex items-center justify-center h-20 w-32 shrink-0 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <img
                  data-logo
                  src={logo.bwLogoUrl}
                  alt={`${logo.name} (Black and White)`}
                  className="absolute max-w-24 max-h-16 object-contain transition-opacity duration-300 group-hover:opacity-0"
                  onError={(e) => console.error(`Image load error for ${logo.name} (BW):`, e)}
                />
                <img
                  src={logo.colorLogoUrl}
                  alt={`${logo.name} (Color)`}
                  className="absolute max-w-24 max-h-16 object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  onError={(e) => console.error(`Image load error for ${logo.name} (Color):`, e)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const phrases = [
    'Management<br />Information Systems',
    'Microsoft<br />Solutions',
    'Data Storage<br />and Security',
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Handle phrase rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        setIsFading(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative w-full bg-white overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent z-10" />

      {/* Main content */}
      <SidePadding>
        <div className="relative z-20 md:flex md:flex-row md:items-center md:justify-between pt-16 md:pt-24 lg:pt-20 pb-8 font-Poppins">
          {/* Text content */}
          <div className="relative text-primary w-full md:w-7/12 lg:w-2/3 md:-mt-24 flex flex-col gap-4">
            <div className="text-[24px] md:text-[28px] lg:text-[36px] font-bold leading-tight font-Poppins">
              <p>One-stop shop for all your</p>
              <div className="flex items-center justify-start h-[6rem] sm:h-[7rem] md:h-[8rem] lg:h-[7rem] overflow-hidden w-full">
                <span
                  className={`text-alternate transition-opacity duration-500 w-full block text-left ${
                    isFading ? 'opacity-0' : 'opacity-100'
                  }`}
                  dangerouslySetInnerHTML={{ __html: phrases[currentPhraseIndex] }}
                />
              </div>
            </div>

            {/* Mobile image container */}
            <div className="md:hidden relative w-full h-[150px] sm:h-[200px] mt-2 mb-4 z-20">
              <div className="relative w-full h-full">
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    currentPhraseIndex === 0 ? 'opacity-100' : 'opacity-0'
                  } z-10`}
                >
                  <img
                    src={HeroBg}
                    alt="Software interface"
                    className="absolute right-0 top-0 w-full h-full object-contain object-right-top"
                  />
                </div>
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    currentPhraseIndex === 1 ? 'opacity-100' : 'opacity-0'
                  } z-10`}
                >
                  <img
                    src={Microsoft}
                    alt="Microsoft solutions"
                    className="absolute right-0 top-0 w-full h-full object-contain object-right-top"
                  />
                </div>
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    currentPhraseIndex === 2 ? 'opacity-100' : 'opacity-0'
                  } z-10`}
                >
                  <img
                    src={Server}
                    alt="Server solutions"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-[120%] h-auto object-contain object-right"
                  />
                </div>
              </div>
            </div>

            <p className="mb-6 text-[16px] text-primary font-normal font-Poppins max-w-lg">
              Streamline your workflow with our innovative Technologies.
            </p>

            <div className="mt-4">
              <RequestDemoBtn />
            </div>
          </div>

          {/* Desktop image container */}
          <div className="hidden md:block relative z-20 md:w-[600px] lg:w-[800px] md:h-[400px] lg:h-[500px]">
            <div className="relative w-full h-full md:scale-90 lg:scale-100">
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  currentPhraseIndex === 0 ? 'opacity-100' : 'opacity-0'
                } z-10`}
              >
                <img
                  src={HeroBg}
                  alt="Software interface"
                  className="absolute object-contain"
                  style={{ height: '600px', width: '500px', right: '-60px', top: '-20px' }}
                />
              </div>
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  currentPhraseIndex === 1 ? 'opacity-100' : 'opacity-0'
                } z-10`}
              >
                <img
                  src={Microsoft}
                  alt="Microsoft solutions"
                  className="absolute object-contain"
                  style={{ height: '450px', width: '500px', right: '-60px', top: '-30px' }}
                />
              </div>
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  currentPhraseIndex === 2 ? 'opacity-100' : 'opacity-0'
                } z-10`}
              >
                <img
                  src={Server}
                  alt="Server solutions"
                  className="absolute object-contain"
                  style={{ height: '350px', width: '800px', right: '-60px', top: '60px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </SidePadding>

    </main>
  );
}
