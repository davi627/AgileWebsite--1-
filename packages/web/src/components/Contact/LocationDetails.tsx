import React from 'react'

const location = {
  city: 'Nairobi, Kenya',
  address: ['1st  Floor, Jumuia Place II, Lenana Rd'],
  mapUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8088308802157!2d36.790557576282!3d-1.2889056356317206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11acc542f71b%3A0x98e5de5e962e32fb!2sJumuia%20Place!5e0!3m2!1sen!2ske!4v1721743761047!5m2!1sen!2ske'
}

const Locations: React.FC = () => {
  return (
    <div className="mb-4 grid grid-cols-1 gap-x-8 gap-y-10 pt-16 lg:grid-cols-3">
      <div>
        <h2 className="text-primary text-3xl font-bold tracking-tight">
          Location
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:col-span-2 lg:gap-8">
        <div className="rounded-2xl bg-gray-50 p-10">
          <h3 className="text-primary text-base font-semibold leading-7">
            {location.city}
          </h3>
          <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-gray-600">
            {location.address.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </address>
        </div>
        <div className="aspect-w-32 aspect-h-9">
          <iframe
            src={location.mapUrl}
            width="800"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={false}
            aria-hidden="false"
            tabIndex={0}
            className="rounded-2xl"
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default Locations
