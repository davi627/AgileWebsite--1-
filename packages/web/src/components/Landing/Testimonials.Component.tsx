import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SidePadding from 'components/Shared/SidePadding.Component';
import { useNavigate } from 'react-router-dom';

interface Comment {
  _id: string;
  logo: string;
  description: string;
  author: string;
  products: string[];
  status: 'pending' | 'approved' | 'rejected';
  image: string; // Add image to the Comment interface
}

function Testimonials() {
  const [comments, setComments] = useState<Comment[]>([]);

  // Fetch approved comments from the backend
  const fetchApprovedComments = async () => {
    try {
      const response = await fetch('http://localhost:5000/comments/comments');
      const data = await response.json();
      const approvedComments = data.filter((comment: Comment) => comment.status === 'approved');
      setComments(approvedComments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  // Fetch comments on component mount
  useEffect(() => {
    fetchApprovedComments();
  }, []);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-0 w-full">
        <ul className="m-0 flex justify-center p-0">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="h-2 w-2 rounded-full bg-gray-400 transition-all duration-300 hover:bg-gray-600" />
    ),
  };

  return (
    <SidePadding>
      <div className="py-20">
        <p className="text-3xl font-medium leading-9 md:text-4xl">
          See how organizations grow with <br />
          Our Microsoft solutions
        </p>

        {comments.length > 0 ? (
          <div className="relative mt-14">
            <Slider {...sliderSettings}>
              {comments.map((comment) => (
                <div key={comment._id} className="shadow-top-bottom rounded-xl p-6 md:p-10">
                  <div className="flex flex-col gap-5 md:flex-row">
                    <div className="flex w-full flex-col items-start justify-evenly gap-6 md:w-1/2">
                      <img
                        src={`http://localhost:5000${comment.logo}`}
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
                            <div key={index} className="flex items-center gap-2">
                              <p>{product}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Display the testimonial image */}
                    <div className="hidden h-[28rem] w-1/2 rounded-xl md:block">
                      <img
                        src={`http://localhost:5000${comment.image}`}
                        alt="testimonial"
                        className="h-full w-full rounded-xl object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <p className="mt-14 text-center text-gray-600">No approved testimonials found.</p>
        )}
      </div>
    </SidePadding>
  );
}

export default Testimonials;