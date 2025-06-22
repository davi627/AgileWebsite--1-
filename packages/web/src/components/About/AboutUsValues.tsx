import React from 'react'

const values = [
  {
    name: 'Stewardship',
    description:
      'The commitment to responsibly manage resources, relationships, and opportunities with care and sustainability. It ensures ethical leadership and a lasting positive impact for future generations.'
  },
  {
    name: 'Empowerment',
    description:
      'Enabling individuals to take ownership, grow their potential, and make meaningful contributions. It fosters confidence, innovation, and a culture of accountability.'
  },
  {
    name: 'Awesomeness',
    description:
      'Striving for excellence and embracing creativity to deliver outstanding results. It’s about making a positive impact and exceeding expectations.'
  },
  {
    name: 'Teamwork',
    description:
      'Collaborating with trust, respect, and shared purpose to achieve common goals, we unlock success beyond individual limits.'
  },
  {
    name: 'Integrity',
    description:
      'Upholding honesty, transparency, and ethical practices in all that we do. It builds trust and strengthens relationships with all stakeholders.'
  },
  {
    name: 'Agility',
    description:
      "Embracing change with flexibility, speed, and innovation to stay ahead. It's about adapting to challenges and seizing opportunities effectively."
  }
]

const colorClasses = [
  'bg-[#167AA0] text-white',
  'bg-[#145A78] text-white',
  'bg-[#F15834] text-white',
  'bg-[#A73623] text-white',
  'bg-[#F0AD1E] text-white',
  'bg-[#34C4EC] text-white'
]

const ValuesSection: React.FC = () => {
  return (
    <div className="mx-auto mb-14 mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8 font-Poppins">
      <div className="mx-auto max-w-2xl lg:mx-0">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-primary">
          Our Values
        </h2>
      </div>
      <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {values.map((value, index) => (
          <div
            key={value.name}
            className={`p-6 rounded-lg shadow-lg ${
              colorClasses[index % colorClasses.length]
            }`}
          >
            <dt className="text-lg font-semibold">{value.name}</dt>
            <dd className="mt-1">{value.description}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default ValuesSection
