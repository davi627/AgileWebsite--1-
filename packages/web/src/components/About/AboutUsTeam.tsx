import React from 'react'

import Nathan from '../../assets/leadership/nathan.jpg'
import Komen from '../../assets/leadership/anthony.jpg'

const people = [
  {
    name: 'Anthony Komen',
    role: 'Chief Executive Officer',
    imageUrl: Komen,
    bio: 'Possessing deep expertise in Finance, IT and Leadership, Anthony boasts a comprehensive grasp of the financial sector. Throughout his career, he has been an integral member of teams dedicated and responsible for crafting innovative and dynamic solutions for the financial industry.'
  },
  {
    name: 'Nathan Kimutai',
    role: 'Executive Director',
    imageUrl: Nathan,
    bio: 'Nathan Kimutai combines a wealth of expertise in IT, finance, and leadership to drive innovative solutions across diverse industries. His proficiency in systems analysis and design, systems development, user training, and solution architecture has been honed through years of dedicated practice.'
  }
]

const TeamSection: React.FC = () => {
  return (
    <div className="mb-4 bg-white py-24 md:py-32 lg:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-primary text-3xl font-bold tracking-tight sm:text-4xl">
            Our Leadership
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We’re a dynamic group of individuals who are passionate about what
            we do and dedicated to delivering the best results for our clients.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-20 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-8 xl:col-span-2"
        >
          {people.map((person) => (
            <li key={person.name}>
              <img
                alt=""
                src={person.imageUrl}
                className="aspect-[3/2] w-full rounded-2xl object-cover"
              />
              <h3 className="text-primary mt-6 text-lg font-semibold leading-8">
                {person.name}
              </h3>
              <p className="text-base leading-7 text-gray-600">{person.role}</p>
              <p className="mt-4 text-base leading-7 text-gray-600">
                {person.bio}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TeamSection
