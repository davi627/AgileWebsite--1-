import { useEffect, useState } from 'react'
import SidePadding from 'components/Shared/SidePadding.Component'
import RequestDemoBtn from 'components/Shared/RequestDemoBtn.Component'
import HeroBg from '../../assets/Image 1.png'
import Phone from '../../assets/phone.png'
import Investment from '../../assets/Investment.png'
import Microsoft from '../../assets/Image 2.png'
import Server from '../../assets/Image 3.png'

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
  <main className="relative w-full h-auto bg-white overflow-hidden">

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent z-10"></div>

      {/* Main content */}
      <SidePadding>
        <div className="relative z-40 md:flex md:flex-row md:items-center md:justify-between pt-32 md:pt-48 lg:pt-32 pb-16 font-Poppins">
          
{/* Text content */}
<div className="relative text-primary w-full md:w-6/12 lg:w-[55%]  md:-mt-48">

  <div className="text-[28px] md:text-[32px] lg:text-[45px] font-bold leading-tight font-poppins">
    <p className='gap-8'>One-stop shop for all your</p>
    <div className="flex items-center justify-start h-[14.5rem] sm:h-[16rem] md:h-[12rem] lg:h-[10rem] overflow-hidden w-full">
  <span
    className={`text-alternate transition-opacity duration-500 w-full block text-left ${
      isFading ? 'opacity-0' : 'opacity-100'
    }`}
    dangerouslySetInnerHTML={{ __html: phrases[currentPhraseIndex] }}
  />
</div>

  </div>



  <p className="my-8 text-[16px] text-primary font-normal font-poppins max-w-lg">
    Streamline your workflow with our innovative Technologies.
  </p>

  <RequestDemoBtn />
</div>



          {/* Desktop image container */}
          <div className="hidden md:block relative z-20 md:w-[800px] lg:w-[1000px] md:h-[600px] lg:h-[700px] md:max-w-none">
            <div className="relative w-full h-full md:scale-90 lg:scale-100 transform-gpu">

              {/* FIRST IMAGE GROUP */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${currentPhraseIndex === 0 ? 'opacity-100' : 'opacity-0'} z-10`}>
                <img 
                  src={HeroBg} 
                  alt="Software interface" 
                  className="absolute object-contain"
                  style={{
                    height:'600px',
                    width:'700px',
                    right:'-80px',
                    top:'-30px'
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
                    height:'600px',
                    width:'700px',
                    right:'-80px',
                    top:'-40px'
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
                    height:'450px',
                    width:'1070px',
                    right:'-80px',
                    top:'80px'
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
                    className="absolute object-contain"
                     style={{
                    top: '-60px',
                    right: '10px',
                    height: '270px',
                    zIndex: 5
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
                    top: '-60px',
                    right: '10px',
                    height: '300px',
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
                    top: '-60px',
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