import React from 'react'
import AfricaMap from '../../assets/af_map.svg'

const HeroSection: React.FC = () => {
  return (
    <div className="relative isolate -z-10">
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
            width={200}
            height={200}
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
          fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
          width="100%"
          height="100%"
          strokeWidth={0}
        />
      </svg>
      <div
        aria-hidden="true"
        className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
      >
        {/* <div
          style={{
            clipPath:
              'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)'
          }}
          className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#F0AE1C] to-[#167aa0] opacity-30"
        /> */}
      </div>
      <div className="overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
              <h1 className="text-primary text-4xl font-bold tracking-tight sm:text-6xl">
                Driving Vision Into Action For Our Clients.
              </h1>
              <p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                With deep roots in our industry, Agile was established to
                provide adequate and efficient superior IT solutions through
                customization and that is exactly what we have been doing.
              </p>
            </div>
            <div className="relative flex justify-center lg:w-1/2 lg:justify-end xl:w-1/3">
              <img
                src={AfricaMap}
                alt="Africa Map"
                className="h-auto w-full max-w-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
