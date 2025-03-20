import SidePadding from 'components/Shared/SidePadding.Component'
import RequestDemoBtn from 'components/Shared/RequestDemoBtn.Component'

// import CtaCard from './ctaCard'
import HeroBg from '../../assets/hero_bg.png'
// import HeroImage from '../../assets/hero_content@2x.png'
// import AgileArrow from 'components/Common/agileArrow'
import SmileIcon from '../../assets/smile.svg'

export default function Hero() {
  const backgroundStyle: React.CSSProperties = {
    backgroundImage: `url(${HeroBg})`,
    // backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    // backgroundSize: '50%',
    zIndex: -1 // Ensure background is behind other elements
  }

  return (
    <main style={backgroundStyle}>
      <div className="text-primary relative isolate pb-16 lg:pb-28">
        {/* BELOW IS AN INTERESTING PATTERN, COULD BE USEFUL */}
        {/* <svg
          className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
          />
        </svg> */}
        {/* <div className="overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
            <span className="size-8">
              <AgileArrow className="hidden h-32 w-auto md:inline-block" />
            </span>
            <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <CtaCard />
            <div className="hidden justify-end sm:justify-start sm:pl-20 md:inline-block lg:mt-0 lg:pl-0">
                <img src={HeroImage} alt="Hero Image" className="w-[100rem]" />
              </div>
            </div>
          </div>
        </div> */}
        <div className="ml-6 flex flex-col pt-36 text-3xl font-semibold leading-[1.15] sm:pt-60 md:text-[4rem] lg:ml-32 lg:pt-48">
          <p className="">
            One-stop shop <br /> for all your <br />
          </p>
          <div className="flex gap-1 md:gap-4">
            <div className="">
              software
              <img
                src={SmileIcon}
                alt="twitter"
                className="h-5 md:-mt-3 md:h-10 md:pl-6"
              />
            </div>
            <p>needs</p>
          </div>
        </div>

        <SidePadding>
          <div className="mt-12">
            <p className="mb-16 text-lg font-light tracking-wide md:text-2xl">
              Streamline your workflow with our <br /> innovative software.
            </p>

            <RequestDemoBtn />
          </div>
        </SidePadding>
      </div>
    </main>
  )
}
