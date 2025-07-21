import { useEffect, useState } from 'react';
import SidePadding from 'components/Shared/SidePadding.Component';
import RequestDemoBtn from 'components/Shared/RequestDemoBtn.Component';
import HeroBg from '../../assets/Hero Image 2.png';
import Microsoft from '../../assets/Image2.png';
import Server from '../../assets/image3.png';

export default function Hero() {
  const phrases = [
    ['Management', 'Information Systems'], // Two lines: "Management" and "Information Systems"
    ['Microsoft Solutions'], // Render naturally
    ['Data Storage and Security'], // Render naturally
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
        <div className="relative z-30 flex flex-col lg:flex-row lg:items-center lg:justify-between py-16 lg:py-24 xl:py-24 font-Poppins gap-8 lg:gap-16">
          {/* Left Content Section */}
          <div className="flex flex-col justify-center lg:w-1/2 xl:w-2/5">
            {/* Main Heading */}
            <div className="font-Poppins mb-6">
              <h1 className="text-black font-normal text-2xl md:text-3xl lg:text-4xl leading-relaxed whitespace-nowrap">
                One-stop shop for all your
              </h1>

              {/* Rotating Bold Text */}
              <div
                className="flex flex-col justify-start"
                style={{
                  color: '#4D4D4D',
                  fontFamily: 'Poppins',
                  fontSize: '40px',
                  fontWeight: '700',
                  lineHeight: '64px',
                  letterSpacing: '2.88px',
                }}
              >
                {/* Hidden Reference Div for Dynamic Height */}
                <div
                  className="absolute invisible"
                  style={{
                    fontFamily: 'Poppins',
                    fontSize: '40px',
                    fontWeight: '700',
                    lineHeight: '64px',
                    letterSpacing: '2.88px',
                  }}
                >
                  <div>Management</div>
                  <div>Information Systems</div>
                </div>

                {/* Displayed Text */}
                <div
                  className={`transition-opacity duration-500 ${
                    isFading ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  {phrases[currentPhraseIndex].map((line, index) => (
                    <div
                      key={index}
                      style={{
                        display: currentPhraseIndex === 0 ? 'block' : 'block', // Ensure block for all, but especially for index 0
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-black font-normal text-lg md:text-xl lg:text-xl mb-8 max-w-lg leading-relaxed">
              Streamline your workflow with our innovative technologies.
            </p>

            {/* CTA Button */}
            <div className="flex">
              <RequestDemoBtn />
            </div>
          </div>

          {/* Right Image Section - Moved Further Right */}
          <div className="flex justify-end lg:w-1/2 xl:w-3/5" style={{ paddingLeft: '80px' }}>
            <div className="relative" style={{ width: '360px', height: '200px', marginLeft: '60px' }}>
              {/* Management Information Systems Image */}
              <div
                className={`absolute transition-opacity duration-500 ${
                  currentPhraseIndex === 0 ? 'opacity-100' : 'opacity-0'
                } z-10`}
                style={{ right: '-30px', top: '-100px' }}
              >
                <img
                  src={HeroBg}
                  alt="Management Information Systems"
                  className="object-contain drop-shadow-lg"
                  style={{ width: '400px', height: '360px' }}
                />
              </div>

              {/* Microsoft Solutions Image */}
              <div
                className={`absolute transition-opacity duration-500 ${
                  currentPhraseIndex === 1 ? 'opacity-100' : 'opacity-0'
                } z-10`}
                style={{ right: '-30px', top: '-100px' }}
              >
                <img
                  src={Microsoft}
                  alt="Microsoft Solutions"
                  className="object-contain drop-shadow-lg"
                  style={{ width: '400px', height: '360px' }}
                />
              </div>

              {/* Data Storage & Security Image */}
              <div
                className={`absolute transition-opacity duration-500 ${
                  currentPhraseIndex === 2 ? 'opacity-100' : 'opacity-0'
                } z-10`}
                style={{ right: '-30px', top: '-80px' }}
              >
                <img
                  src={Server}
                  alt="Data Storage and Security"
                  className="object-contain drop-shadow-lg"
                  style={{ width: '400px', height: '360px' }}
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
