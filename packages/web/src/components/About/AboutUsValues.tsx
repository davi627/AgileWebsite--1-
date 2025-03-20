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
      'Collaborating with trust, respect, and shared purpose to achieve common goals. Together, we create greater success than any one individual could alone.'
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

const ValuesSection: React.FC = () => {
  return (
    <div className="mx-auto mb-14 mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
      <div className="mx-auto max-w-2xl lg:mx-0">
        <h2 className="text-primary text-3xl font-bold tracking-tight sm:text-4xl">
          Our values
        </h2>
        {/* <p className="mt-6 text-lg leading-8 text-gray-600">
          Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam
          voluptatum cupiditate veritatis in accusamus quisquam.
        </p> */}
      </div>
      <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {values.map((value) => (
          <div key={value.name}>
            <dt className="text-primary font-semibold">{value.name}</dt>
            <dd className="mt-1 text-gray-600">{value.description}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default ValuesSection
