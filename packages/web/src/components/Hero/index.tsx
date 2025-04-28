import SidePadding from 'components/Shared/SidePadding.Component'
import RequestDemoBtn from 'components/Shared/RequestDemoBtn.Component'
import HeroBg from '../../assets/agile.webp'
import SmileIcon from '../../assets/smile.svg'

export default function Hero() {
  return (
    <main
      className="relative w-full min-h-screen bg-cover bg-no-repeat transition-all duration-500 
                 bg-left sm:bg-center md:bg-right lg:bg-center"
      style={{ backgroundImage: `url(${HeroBg})` }}
    >
      <div className="text-primary relative isolate pb-16 lg:pb-28">
        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent z-[-1]"></div>

        <div className="ml-6 flex flex-col pt-28 sm:pt-40 text-xl font-semibold leading-[1.15] sm:text-2xl md:text-3xl lg:ml-28 lg:pt-48 font-century">

          <p>One-stop shop <br /> for all your <br /></p>
          <div className="flex gap-1 md:gap-4">
            {/* Smile Icon inside "software" with margin-top */}
            <div className="flex items-center gap-2">
              <span>Management Information System</span>
              <img
                src={SmileIcon}
                alt="smile icon"
                className="h-5 md:h-8 mt-4 md:mt-6"
              />
            </div>
            <p>needs</p>
          </div>
        </div>

        <SidePadding>
          <div className="mt-8 sm:mt-12">
            <p className="mb-10 text-base font-light tracking-wide sm:text-lg md:text-2xl">
             Innovative Management Information Systems
            </p>
            <RequestDemoBtn />
          </div>
        </SidePadding>
      </div>
    </main>
  )
}
