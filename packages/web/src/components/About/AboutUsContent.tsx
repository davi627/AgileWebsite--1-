import React from 'react'

const stats = [
  { label: 'Happy Clients', value: '100+' },
  { label: 'Complete Projects', value: '100+' },
  { label: 'Networth', value: ' $ 100B' },
  { label: 'Qualified Staff', value: ' 100+' }
]

const ContentSection: React.FC = () => {
  return (
    <div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8 font-Poppins text-primary">
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
          We are Agile
        </h2>
        <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
          <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
            <p className="text-xl leading-8 text-gray-600">
              Agile Business Solutions is proudly a Kenyan technology powerhouse
              at the forefront of Africa’s digital revolution. As a leading
              technology hub , we are passionate about designing and delivering
              cutting edge technology solutions that respond to the unique
              challenges and opportunities of businesses.{' '}
            </p>
            <p className="mt-4 text-xl leading-8 text-gray-600">
              Rooted in Kenya and reaching across the globe, we are committed to
              excellence, innovation, and customer satisfaction. We specialize
              in crafting high-performance, scalable enterprise management
              information systems that drives digital transformation,
              operational efficiency, and business growth. Our solutions are
              tailored to meet diverse industry needs, blending global best
              practices with deep insight. At Agile, we don’t just build
              technology we build the future of enterprises.
            </p>
          </div>
          <div className="lg:flex lg:flex-auto lg:justify-center">
            <dl className="w-64 space-y-8 xl:w-80">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse gap-y-4">
                  <dt className="text-base leading-7 text-gray-600">
                    {stat.label}
                  </dt>
                  <dd className="text-primary text-5xl font-semibold tracking-tight">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentSection
