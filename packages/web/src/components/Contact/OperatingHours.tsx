import React from 'react'

const operatingHours = [
  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
  { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
  { day: 'Sunday', hours: 'Closed' }
]

const OperatingHours: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Operating Hours
        </h2>
      </div>
      <div className="lg:col-span-2">
        <div className="rounded-2xl bg-gray-50 p-10">
          <dl className="space-y-4 text-sm text-gray-600">
            {operatingHours.map((item, index) => (
              <div key={index} className="flex justify-between">
                <dt>{item.day}:</dt>
                <dd>{item.hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

export default OperatingHours
