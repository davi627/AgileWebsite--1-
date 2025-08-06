
import { useEffect, useState } from 'react';
import SidePadding from 'components/Shared/SidePadding.Component';
import RequestDemoBtn from 'components/Shared/RequestDemoBtn.Component';
import HeroBg from '../../assets/Hero Image 2.png';
import Microsoft from '../../assets/Image2.png';
import Server from '../../assets/image3.png';
import Mesh from '../../assets/Mesh Background.png';

export default function Hero() {
  const basePhrases = [
    ['Management', 'Information Systems'],
    ['Microsoft Solutions'],
    ['Data Storage and Security'],
  ];

  const largeScreenPhrases = [
    ['Management', 'Information Systems'],
    ['Microsoft', 'Solutions'],
    ['Data Storage and Security'],
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [phrases, setPhrases] = useState(basePhrases);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1920px)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPhrases(e.matches ? largeScreenPhrases : basePhrases);
    };

    handleMediaChange(mediaQuery as any);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        setIsFading(false);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, [phrases]);

  return (
    <main
      className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${Mesh})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-[1400px] 3xl:max-w-[1600px] 4xl:max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 4xl:ml-[100px] lg:ml-24">
        <div className="relative z-30 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 3xl:gap-10 4xl:gap-6 py-12 lg:py-16 3xl:py-18 font-Poppins">
          {/* Left Content Section */}
          <div className="flex flex-col justify-center w-full lg:w-1/2 max-w-[550px] 3xl:max-w-[650px] 4xl:max-w-[750px] mx-auto lg:mx-0">
            {/* Main Heading */}
            <div className="mt-12 lg:mb-8  3xl:mb-10 4xl:mb-12">
              <h1 className="text-black font-normal text-2xl sm:text-3xl md:text-4xl lg:text-4xl 3xl:text-[2.75rem] 4xl:text-[3.25rem] leading-relaxed sm:whitespace-nowrap">
                One-stop shop for all your
              </h1>
              {/* Rotating Bold Text */}
              <div
                className="flex flex-col justify-start mt-3 3xl:mt-4 4xl:mt-5"
                style={{
                  color: '#167AA1',
                  fontFamily: 'Poppins',
                  fontSize: 'clamp(28px, 4vw, 50px)',
                  fontWeight: '700',
                  lineHeight: '1.3',
                  letterSpacing: '0.05em',
                  minHeight: 'clamp(100px, 10vw, 120px)',
                }}
              >
                <div
                  className={`transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}
                >
                  {phrases[currentPhraseIndex].map((line, index) => (
                    <div key={index} className="4xl:text-[3.5rem]">{line}</div>
                  ))}
                </div>
              </div>
            </div>
            {/* Description */}
            <p className="text-black font-normal text-base sm:text-lg md:text-xl lg:text-xl 3xl:text-[1.375rem] 4xl:text-[1.75rem] mb-6 3xl:mb-8 4xl:mb-10 leading-relaxed">
              Streamline your workflow with our innovative technologies.
            </p>
            {/* CTA Button */}
            <div className="mt-3 3xl:mt-4 4xl:mt-5">
              <RequestDemoBtn />
            </div>
          </div>

          {/* Right Image Section */}
          <div className="flex justify-center w-full lg:w-1/2 max-w-[550px] 3xl:max-w-[650px] 4xl:max-w-[850px]">
            <div className="relative w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[380px] 3xl:h-[420px] 4xl:h-[520px]">
              {/* Management Information Systems Image */}
              <div
                className={`absolute transition-opacity duration-500 ${
                  currentPhraseIndex === 0 ? 'opacity-100' : 'opacity-0'
                } z-10 4xl:left-48 4xl:top-0 4xl:w-full 4xl:h-full 4xl:mx-auto`}
                style={{
                  right: '0',
                  top: '0',
                  width: '100%',
                  height: '100%',
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
                } z-10 4xl:left-48 4xl:top-0 4xl:w-full 4xl:h-full 4xl:mx-auto`}
                style={{
                  right: '0',
                  top: '0',
                  width: '100%',
                  height: '100%',
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
                } z-10 4xl:left-36 4xl:top-0 4xl:w-full 4xl:h-full 4xl:mx-auto`}
                style={{
                  right: '0',
                  top: '0',
                  width: '100%',
                  height: '100%',
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
      </div>
    </main>
  );
}
