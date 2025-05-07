import SidePadding from 'components/Shared/SidePadding.Component'
import RequestDemoBtn from 'components/Shared/RequestDemoBtn.Component'
import HeroBg from '../../assets/Home page (1).png'
import SmileIcon from '../../assets/smile.svg'
import HeroCard from './heroCard'

export default function Hero() {
  return (
    <main className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* Image as a positioned element rather than background */}
      <div className="absolute right-8 top-0 w-5/5 h-full z-0">
        <img 
          src={HeroBg} 
          alt="Software interface" 
          className="object-contain h-full w-full"
        />
      </div>
      
      {/* Gradient overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent z-10"></div>
      
      <SidePadding>
        <div className="relative z-20 flex flex-col pt-32 md:pt-48 lg:pt-56 pb-16">
          {/* Text content - Left side */}
          <div className="text-primary w-full md:w-1/2 lg:w-2/5">
            <div className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight font-century">
              <p>One-stop shop</p>
              <p>for all your</p>
              <div className="flex items-center gap-4">
                <span className="text-cyan-600">software</span>
                <span>needs</span>
              </div>
              <div className="mt-1">
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
      
      {/* Blue accent line at bottom */}
      <div className="w-full h-2 bg-blue-500 absolute bottom-0 z-30"></div>
    </main>
  )
}