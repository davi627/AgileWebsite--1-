import React, { useEffect, useState, useRef } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import SidePadding from 'components/Shared/SidePadding.Component'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://webtest-api.agilebiz.co.ke:5000'

interface Comment {
  _id: string
  logo: string
  description: string
  author: string
  products: string[]
  status: 'pending' | 'approved' | 'rejected'
  image: string
}

function Testimonials() {
  const [comments, setComments] = useState<Comment[]>([])
  const sliderRef = useRef<Slider>(null)

  const fetchApprovedComments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/comments`)
      const data = await response.json()
      const approvedComments = data.filter(
        (comment: Comment) => comment.status === 'approved'
      )
      setComments(approvedComments)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
  }

  useEffect(() => {
    fetchApprovedComments()
  }, [])

  // Custom arrow components
  const NextArrow = (props: any) => {
    const { onClick } = props
    return (
      <button
        onClick={onClick}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    )
  }

  const PrevArrow = (props: any) => {
    const { onClick } = props
    return (
      <button
        onClick={onClick}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    )
  }

  // Conditional slider settings based on number of comments
  const sliderSettings = {
    dots: comments.length > 1,
    infinite: comments.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: comments.length > 1,
    arrows: comments.length > 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-0 w-full">
        <ul className="m-0 flex justify-center p-0">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="h-2 w-2 rounded-full bg-gray-400 transition-all duration-300 hover:bg-gray-600" />
    )
  }

 return (
    <SidePadding>
      <div className="py-20 font-Poppins ">
        <p className="text-3xl font-medium leading-9 md:text-4xl">
          See how organizations grow with <br />
          Our solutions
        </p>

        {comments.length > 0 ? (
          <div className="relative mt-14">
            {comments.length === 1 ? (
              // Render single testimonial without slider
              <div className="shadow-top-bottom rounded-xl p-6 md:p-10">
                <div className="flex flex-col gap-5 md:flex-row">
                  <div className="flex w-full flex-col items-start justify-evenly gap-6 md:w-1/2">
                    <img
                      src={`${API_BASE_URL}${comments[0].logo}`}
                      alt="logo"
                      className="h-10 w-auto"
                    />
                    <div>
                      <p>{comments[0].description}</p>
                      <p className="mt-4 text-sm italic text-gray-600">
                        - {comments[0].author}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">Products</p>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm font-light">
                        {comments[0].products.map((product, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2"
                          >
                            <p>{product}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex md:w-1/2 md:items-center md:justify-center">
                    <div className="h-80 w-80 rounded-lg border-4 border-primary bg-white p-2 shadow-md">
                      <img
                        src={`${API_BASE_URL}${comments[0].image}`}
                        alt="testimonial"
                        className="h-full w-full object-fill"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Render multiple testimonials with slider
              <Slider ref={sliderRef} {...sliderSettings}>
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="shadow-top-bottom rounded-xl p-6 md:p-10"
                  >
                    <div className="flex flex-col gap-5 md:flex-row">
                      <div className="flex w-full flex-col items-start justify-evenly gap-6 md:w-1/2">
                        <img
                          src={`${API_BASE_URL}${comment.logo}`}
                          alt="logo"
                          className="h-10 w-auto"
                        />
                        <div>
                          <p>{comment.description}</p>
                          <p className="mt-4 text-sm italic text-gray-600">
                            - {comment.author}
                          </p>
                        </div>

                        <div>
                          <p className="font-medium">Products</p>
                          <div className="mt-2 flex flex-wrap gap-4 text-sm font-light">
                            {comment.products.map((product, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <p>{product}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="hidden md:flex md:w-1/2 md:items-center md:justify-center">
                        <div className="h-80 w-80 rounded-lg border-4 border-primary bg-white p-2 shadow-md">
                          <img
                            src={`${API_BASE_URL}${comment.image}`}
                            alt="testimonial"
                            className="h-full w-full rounded-md object-contain object-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        ) : (
          <p className="mt-14 text-center text-gray-600">
            No testimonials found.
          </p>
        )}
      </div>
    </SidePadding>
  )
}

export default Testimonials
