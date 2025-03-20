import {
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/20/solid'
import { useRef, useState } from 'react'
import HeroMap from '../../assets/map_bg.svg'
import AgileArrow from 'components/Common/agileArrow'

const testimonials = [
  {
    body: 'Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.',
    rating: 5,
    author: {
      name: 'Leslie Alexander',
      handle: 'lesliealexander'
    }
  },
  {
    body: 'Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.',
    rating: 4,
    author: {
      name: 'Leslie Alexander',
      handle: 'lesliealexander'
    }
  },
  {
    body: 'Laborum quis quam. Dolorum et ut quod quia.',
    rating: 3,
    author: {
      name: 'Leslie Alexander',
      handle: 'lesliealexander'
    }
  },
  {
    body: 'Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.',
    rating: 2,
    author: {
      name: 'Leslie Alexander',
      handle: 'lesliealexander'
    }
  },
  {
    body: 'Dolorum et ut quod quia. Voluptas numquam delectus nihil.',
    rating: 1,
    author: {
      name: 'Leslie Alexander',
      handle: 'lesliealexander'
    }
  }
]

export default function Testimonials() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const backgroundStyle: React.CSSProperties = {
    backgroundImage: `url(${HeroMap})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 1,
    zIndex: -1
  }

  const testimonialsRef = useRef<HTMLDivElement>(null)

  const handleScroll = (direction: 'left' | 'right') => {
    const { current } = testimonialsRef
    if (!current) return

    const { scrollLeft, clientWidth } = current
    const newScrollPosition =
      direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth

    current.scrollTo({ left: newScrollPosition, behavior: 'smooth' })
  }

  return (
    <div className="bg-white py-24 sm:py-32" style={backgroundStyle}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <span className="size-8">
          <AgileArrow className="h-32 w-auto opacity-30" />
        </span>
        <div className="mx-auto max-w-xl text-center">
          <p className="text-primary mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            What Our Clients Say About Us
          </p>
          <h2 className="text-primary text-lg font-semibold leading-8 tracking-tight">
            Team work always gets things done.
          </h2>
        </div>
        <div className="relative mx-auto mt-16">
          <div
            ref={testimonialsRef}
            className="flex snap-x snap-mandatory justify-center overflow-x-auto scroll-smooth"
            style={{
              maskImage:
                'linear-gradient(to left, transparent, black 20%, black 80%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to left, transparent, black 20%, black 80%, transparent)'
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.author.handle}
                className="w-96 shrink-0 snap-start p-4"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <figure
                  className={`rounded-md p-8 text-sm leading-6 transition-colors ${
                    hoveredIndex === index
                      ? 'bg-primary text-white'
                      : 'bg-transparent text-gray-700'
                  }`}
                >
                  <div className="my-4 flex items-center justify-center">
                    {[...Array(testimonial.rating)].map((_, idx) => (
                      <StarIcon
                        key={idx}
                        className={`mr-1 size-5 ${
                          hoveredIndex === index
                            ? 'text-alternate'
                            : 'text-gray-500'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <blockquote className="text-center">
                    <p>{`“${testimonial.body}”`}</p>
                  </blockquote>
                  <figcaption className="mt-6 text-center">
                    <div className="font-semibold">
                      {testimonial.author.name}
                    </div>
                    <div className="text-gray-500">{`@${testimonial.author.handle}`}</div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            <div className="flex space-x-4">
              <button
                className="rounded-full bg-white p-2 text-gray-400 shadow-md hover:text-gray-600"
                style={{ backdropFilter: 'blur(5px)' }}
                onClick={() => handleScroll('left')}
              >
                <ChevronLeftIcon className="size-6" />
              </button>
              <button
                className="rounded-full bg-white p-2 text-gray-400 shadow-md hover:text-gray-600"
                style={{ backdropFilter: 'blur(5px)' }}
                onClick={() => handleScroll('right')}
              >
                <ChevronRightIcon className="size-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
