import React from 'react'

const contactItems = [
  {
    title: 'Sales',
    email: 'sales@agilebiz.co.ke',
    phone: '+254 723929999'
  },
  {
    title: 'Careers',
    email: 'careers@agilebiz.co.ke',
    phone: '+254 723929999'
  },
  {
    title: 'Data Privacy Controller',
    email: 'privacy@agilebiz.co.ke',
    phone: '+254 33290655'
  },
  {
    title: 'Customer Service',
    email: 'support@agilebiz.co.ke',
    phone: '+254 33290655'
  }
]

const ContactDetails: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
      <div>
        <h2 className="text-primary text-3xl font-bold tracking-tight">
          Get in touch
        </h2>
        <p className="mt-4 leading-7 text-gray-600">
          
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
        {contactItems.map((item) => (
          <div key={item.title} className="rounded-2xl bg-gray-50 p-10">
            <h3 className="text-primary text-base font-semibold leading-7">
              {item.title}
            </h3>
            <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
              <div>
                <dt className="sr-only">Email</dt>
                <dd>
                  <a
                    href={`mailto:${item.email}`}
                    className="text-primary font-semibold"
                  >
                    {item.email}
                  </a>
                </dd>
              </div>
              <div className="mt-1">
                <dt className="sr-only">Phone number</dt>
                <dd>{item.phone}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContactDetails
