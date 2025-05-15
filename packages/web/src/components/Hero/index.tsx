import { useEffect, useState } from 'react'
import SidePadding from 'components/Shared/SidePadding.Component'
import RequestDemoBtn from 'components/Shared/RequestDemoBtn.Component'
import HeroBg from '../../assets/Rectangle 44.png'
import SmileIcon from '../../assets/smile.svg'
import Main from '../../assets/Main.png'
import Investment from '../../assets/Investment.png'

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
      {/* Background image */}
      <div
  className="absolute hidden sm:block z-0"
  style={{
    top: '130px',           
    left: '31%',            
    width: '1200px',         
    height: '450px'        
  }}
>
  <img 
    src={HeroBg} 
    alt="Software interface" 
    className="object-contain w-full h-full"
  />
</div>


      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent z-10"></div>

      {/* Main image */}
      <div className="absolute top-24 right-0 z-20 mt-0 w-1/2 lg:w-1/2 sm:w-2/3 w-11/12">
        <img 
          src={Main} 
          alt="Main product" 
          className="object-contain w-full h-auto"
        />
      </div>

      {/* Investment image */}
    
<div
  className="absolute hidden sm:block z-30"
  style={{
    top: '240px',      
    right: '130px',     
    width: '500px',    
    height: '400px'   
  }}
>
  <img 
    src={Investment} 
    alt="Investment" 
    className="object-contain w-full h-full"
  />
</div>


      {/* Main content */}
      <SidePadding>
        <div className="relative z-40 flex flex-col pt-32 md:pt-48 lg:pt-56 pb-16">
          <div className="text-primary w-full md:w-1/2 lg:w-[44%]">
            <div className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight font-century">
              <p>One-stop shop</p>
              <p>for all your</p>
              <div className="flex items-start gap-4 h-[12.5rem] overflow-hidden">

                <span
                  className={`text-alternate transition-opacity duration-500 ${
                    isFading ? 'opacity-0' : 'opacity-100'
                  }`}
                  dangerouslySetInnerHTML={{ __html: phrases[currentPhraseIndex] }}
                />
                <span>needs</span>
              </div>
              <div className="-mt-6">
                <img 
                  src={SmileIcon} 
                  alt="smile icon" 
                  className="h-6 md:h-8" 
                />
              </div>
            </div>

            <p className="my-8 text-base md:text-lg text-gray-700 font-light max-w-md">
              Streamline your workflow with our innovative software.
            </p>

            <RequestDemoBtn />
          </div>
        </div>
      </SidePadding>

      {/* Bottom accent line */}
      <div className="w-full h-2 bg-blue-500 absolute bottom-0 z-40"></div>
    </main>
  )
}
