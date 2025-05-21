import { useEffect, useState } from 'react'
import SidePadding from 'components/Shared/SidePadding.Component'
import RequestDemoBtn from 'components/Shared/RequestDemoBtn.Component'
import HeroBg from '../../assets/iMac 2.png'
import Phone from '../../assets/phone.png'
import Investment from '../../assets/Investment.png'
import Microsoft from '../../assets/Microsoft Image.png'
import Server from '../../assets/Data-Image.png'

export default function Hero() {
  const phrases = [
    "Management<br />Information Systems",
    "Microsoft<br />Solutions",
    "Data Storage<br />and Security"
  ]
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true)
      setTimeout(() => {
        setCurrentPhraseIndex(prev => (prev + 1) % phrases.length)
        setIsFading(false)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent z-10"></div>

      {/* Main content */}
      <SidePadding>
        <div className="relative z-40 md:flex md:flex-row md:items-center md:justify-between pt-32 md:pt-48 lg:pt-32 pb-16 font-Poppins">
          
          {/* Text content */}
          <div className="relative text-primary w-full md:w-5/12 lg:w-[40%]">
            <div className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight ">
              <p>One-stop shop for all your</p>
               <div className="flex items-start h-[14.5rem] sm:h-[10rem] md:h-[12rem] lg:h-[9rem] overflow-hidden">
                <span
                  className={`text-alternate transition-opacity duration-500 ${
                    isFading ? 'opacity-0' : 'opacity-100'
                  }`}
                  dangerouslySetInnerHTML={{ __html: phrases[currentPhraseIndex] }}
                />
              </div>
            </div>

            <p className="my-8 text-base md:text-lg text-gray-700 font-light max-w-md">
              Streamline your workflow with our innovative Technolgies.
            </p>

            <RequestDemoBtn />
          </div>

          {/* Desktop image container */}
          <div className="hidden md:block relative z-20 md:w-6/12 lg:w-1/2 md:h-[400px] lg:h-[450px] md:max-w-xl">
            <div className="relative w-full h-full md:scale-90 lg:scale-100 transform-gpu">

              {/* FIRST IMAGE GROUP */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${currentPhraseIndex === 0 ? 'opacity-100' : 'opacity-0'} z-10`}>
                <img 
                  src={HeroBg} 
                  alt="Software interface" 
                  className="object-contain w-full h-full"
                  
                />
                <img 
                  src={Phone} 
                  alt="Mobile interface" 
                  className="absolute h-56 object-contain"
                  style={{
                    bottom: '44px',
                    right: '60%',
                    height:'200px',
                    zIndex: 5
                  }}
                />
                <img 
                  src={Investment} 
                  alt="Investment interface" 
                  className="absolute object-contain"
                  style={{
                    bottom: '225px',
                    right: '55%',
                    zIndex: 5,
                    height: '40px'
                  }}
                />
              </div>

              {/* SECOND IMAGE GROUP - Microsoft */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${currentPhraseIndex === 1 ? 'opacity-100' : 'opacity-0'} z-10`}>
                <img 
                  src={Microsoft} 
                  alt="Microsoft solutions" 
                  className="absolute object-contain"
                  style={{
                    top: '-100px',
                    right: '0px',
                    height: '602px',
                    width:'1070px',
                    zIndex: 5
                  }}
                />
                
              </div>

              {/* THIRD IMAGE GROUP - Server */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${currentPhraseIndex === 2 ? 'opacity-100' : 'opacity-0'} z-10`}>
                <img 
                  src={Server} 
                  alt="Server and security" 
                  className="absolute object-contain"
                  style={{
                    top: '40px',
                    right: '10px',
                    height: '400px',
                    width:'2000px',
                    zIndex: 5
                  }}
                />
              </div>
            </div>
          </div>

          {/* Mobile version image container */}
          <div className="md:hidden absolute bottom-36 right-0 -left-20 mx-auto w-full max-w-md h-64 z-0">
            <div className="relative w-full h-full scale-75 sm:scale-85 transform-gpu">
              {/* FIRST IMAGE GROUP */}
              {currentPhraseIndex === 0 && (
                <>
                  <img 
                    src={HeroBg} 
                    alt="Software interface" 
                    className="object-contain w-full h-full"
                  />
                  <img 
                    src={Phone} 
                    alt="Mobile interface" 
                    className="absolute h-48 object-contain"
                    style={{
                      bottom: '24px',
                      right: '60%',
                      zIndex: 5
                    }}
                  />
                  <img 
                    src={Investment} 
                    alt="Investment interface" 
                    className="absolute object-contain"
                    style={{
                      bottom: '180px',
                      right: '55%',
                      zIndex: 3,
                      height: '40px'
                    }}
                  />
                </>
              )}

              {/* SECOND IMAGE GROUP */}
              {currentPhraseIndex === 1 && (
                <img 
                  src={Microsoft} 
                  alt="Microsoft solutions" 
                  className="absolute object-contain"
                  style={{
                    top: '-40px',
                    right: '10px',
                    height: '250px',
                    zIndex: 5
                  }}
                />
              )}

              {/* THIRD IMAGE GROUP */}
              {currentPhraseIndex === 2 && (
                <img 
                  src={Server} 
                  alt="Server solutions" 
                  className="absolute object-contain"
                  style={{
                    top: '1px',
                    right: '20px',
                    width: '800px',
                    zIndex: 5
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </SidePadding>

      {/* Bottom accent line */}
      <div className="w-full h-2 bg-blue-500 absolute bottom-0 z-40"></div>
    </main>
  )
}