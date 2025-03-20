import React from 'react'

const stats = [
  { label: 'Happy Clients', value: '1000+' },
  { label: 'Complete Projects', value: '1200+' },
  { label: 'New users annually', value: '46,000' }
]

const ContentSection: React.FC = () => {
  return (
    <div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <h2 className="text-primary text-3xl font-bold tracking-tight sm:text-4xl">
          We are Agile
        </h2>
        <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
          <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
            <p className="text-xl leading-8 text-gray-600">
              We specialize in software development, customization, IT
              consultancy services, and training. We have been accredited as
              Microsoft Gold Partner, Oracle Partner, and ICTA. Since its
              inception, Agile has worked tirelessly to build systems that
              tailor-fit to the size, budget, and needs of our customers. Our
              customers are empowered by technical expertise executing projects
              allocated to Agile and we ensure we deliver the customized
              solutions on time.{' '}
            </p>
            <p className="mt-4 text-xl leading-8 text-gray-600">
              At Agile, we know this success is the direct result of continued
              investment in our framework technology and a sustained commitment
              to the core values and best practices. As we continue to grow,
              scope, and influence, our purpose remains the same: to deliver
              dynamic IT solutions to our esteemed customers, to work with you
              in understanding your unique vision, implementation and to drive
              that vision into action through customer experience.
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
