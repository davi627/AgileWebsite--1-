import { useEffect, useState } from 'react';
import SidePadding from 'components/Shared/SidePadding.Component';
import RequestDemoBtn from 'components/Shared/RequestDemoBtn.Component';
import HeroBg from '../../assets/Image 1.png';
import Microsoft from '../../assets/Image 2.png';
import Server from '../../assets/Server3.png';

export default function Hero() {
  const phrases = [
    ['Management', 'Information Systems'],
    ['Microsoft', 'Solutions'],
    ['Data Storage', 'and Security'],
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
    <main className="relative w-full bg-white overflow-hidden">
      {/* Gradient overlay with lowered z-index */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent z-0" />

      <SidePadding>
        <div className="relative z-30 md:flex md:flex-row md:items-center md:justify-between pt-24 md:pt-36 lg:pt-40 pb-12 font-Poppins">

          {/* Text content */}
          <div className="relative text-primary w-full md:w-7/12 lg:w-2/3 md:-mt-24 flex flex-col gap-4">
            <div className="text-[24px] md:text-[28px] lg:text-[36px] font-bold leading-tight font-Poppins">
              {/* First line (now visible) */}
              <p className="z-30">One-stop shop for all your</p>

              {/* Rotating phrases */}
              <div className=" text-alternate flex flex-col justify-start h-[8rem] sm:h-[8.5rem] md:h-[9rem] lg:h-[8rem] overflow-hidden w-full">
                <div
                  className={`transition-opacity duration-500 ${
                    isFading ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <p>{phrases[currentPhraseIndex][0]}</p>
                  <p>{phrases[currentPhraseIndex][1]}</p>
                </div>
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
