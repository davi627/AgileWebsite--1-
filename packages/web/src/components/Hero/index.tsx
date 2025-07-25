import { useEffect, useState } from 'react';
import SidePadding from 'components/Shared/SidePadding.Component';
import RequestDemoBtn from 'components/Shared/RequestDemoBtn.Component';
import HeroBg from '../../assets/Hero Image 2.png';
import Microsoft from '../../assets/Image2.png';
import Server from '../../assets/image3.png';

export default function Hero() {
  const phrases = [
    ['Management', 'Information Systems'],
    ['Microsoft Solutions'],
    ['Data Storage and Security'],
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

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
    <main className="relative w-full bg-white min-h-screen overflow-hidden">
      <SidePadding>
        <div className="relative z-30 flex flex-col lg:flex-row lg:items-center lg:justify-between pt-24 lg:pt-32 xl:pt-40 pb-16 font-Poppins gap-8 lg:gap-12">
          {/* Left Content Section */}
          <div className="flex flex-col justify-center lg:w-1/2 xl:w-2/5">
            {/* Main Heading */}
            <div className="font-Poppins mb-8 lg:mb-10">
              <h1 className="text-black font-normal text-2xl md:text-3xl lg:text-4xl leading-relaxed whitespace-nowrap">
                One-stop shop for all your
              </h1>

              {/* Rotating Bold Text */}
              <div
                className="flex flex-col justify-start mt-4"
                style={{
                  color: '#167AA1',
                  fontFamily: 'Poppins',
                  fontSize: 'clamp(28px, 5vw, 48px)',
                  fontWeight: '700',
                  lineHeight: '1.3',
                  letterSpacing: '0.05em',
                  minHeight: '120px'
                }}
              >
                {/* Displayed Text */}
                <div
                  className={`transition-opacity duration-500 ${
                    isFading ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  {phrases[currentPhraseIndex].map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-black font-normal text-lg md:text-xl lg:text-xl mb-10 max-w-lg leading-relaxed">
              Streamline your workflow with our innovative technologies.
            </p>

            {/* CTA Button */}
            <div className="flex mt-4">
              <RequestDemoBtn />
            </div>
          </div>

          {/* Right Image Section - Optimized for better balance */}
          <div className="flex justify-center lg:justify-end lg:w-1/2 xl:w-3/5 lg:pl-10 xl:pl-20">
            <div className="relative w-full max-w-xl" style={{ height: '400px' }}>
              {/* Management Information Systems Image */}
              <div
                className={`absolute transition-opacity duration-500 ${
                  currentPhraseIndex === 0 ? 'opacity-100' : 'opacity-0'
                } z-10`}
                style={{
                  right: '15px',
                  top: '-40px',
                  width: '105%',
                  height: '105%',
                  transform: 'translateX(10%)'
                }}
              >
                <img
                  src={HeroBg}
                  alt="Management Information Systems"
                  className="object-contain w-full h-full drop-shadow-lg"
                />
              </div>

              {/* Microsoft Solutions Image */}
              <div
                className={`absolute transition-opacity duration-500 ${
                  currentPhraseIndex === 1 ? 'opacity-100' : 'opacity-0'
                } z-10`}
                style={{
                  right: '20px',
                  top: '-40px',
                  width: '105%',
                  height: '105%',
                  transform: 'translateX(15%)'
                }}
              >
                <img
                  src={Microsoft}
                  alt="Microsoft Solutions"
                  className="object-contain w-full h-full drop-shadow-lg"
                />
              </div>

              {/* Data Storage & Security Image */}
              <div
                className={`absolute transition-opacity duration-500 ${
                  currentPhraseIndex === 2 ? 'opacity-100' : 'opacity-0'
                } z-10`}
                style={{
                  right: '30px',
                  top: '-40px',
                  width: '105%',
                  height: '105%',
                  transform: 'translateX(12%)'
                }}
              >
                <img
                  src={Server}
                  alt="Data Storage and Security"
                  className="object-contain w-full h-full drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </SidePadding>

      {/* Optional: Subtle background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-white pointer-events-none" />
    </main>
  );
}
