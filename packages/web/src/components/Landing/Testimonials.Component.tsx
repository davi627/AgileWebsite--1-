import React, { useEffect, useState } from 'react';
import SidePadding from 'components/Shared/SidePadding.Component';
import CommentModal from 'components/Modal/CommentModal';
import { useNavigate } from 'react-router-dom';
import ArrowRight from '../../assets/arrow-right.png';
import minet from '../../assets/logos/minet.png';
import testimonial1 from '../../assets/testimonial1.png';
interface Comment {
  _id: string;
  logo: string;
  description: string;
  author: string;
  products: string[];
  status: 'pending' | 'approved' | 'rejected';
}

function Testimonials() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const navigate = useNavigate();

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

  // Handle post comment
  const handlePostComment = async (data: {
    logo: File | null;
    description: string;
    author: string;
    products: string[];
  }) => {
    const formData = new FormData();
    if (data.logo) formData.append('logo', data.logo);
    formData.append('description', data.description);
    formData.append('author', data.author);
    formData.append('products', JSON.stringify(data.products));

    try {
      const response = await fetch('http://localhost:5000/comments/comments', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Comment posted successfully');
        fetchApprovedComments(); 
      } else {
        console.error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  // Navigate to the page showing all comments
  const handleReadMore = () => {
    navigate('/all-comments');
  };

  // Display the first approved comment
  const firstComment = comments[0];

  return (
    <SidePadding>
      <div className="py-20">
        <p className="text-3xl font-medium leading-9 md:text-4xl">
          See how organizations grow with <br />
          Our Microsoft solutions
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary flex items-center gap-4 rounded-md px-7 py-2 text-lg text-white mt-6"
        >
          Comment
        </button>
        {firstComment && (
          <div className="shadow-top-bottom mt-14 flex gap-5 rounded-xl p-6 md:p-10">
            <div className="flex w-full flex-col items-start justify-evenly gap-6 md:w-1/2">
            <img src={`http://localhost:5000${firstComment.logo}`} alt="logo" className="h-10 w-auto" />
              <div className="">
                <p>{firstComment.description}</p>
                <p className="mt-4 text-sm italic text-gray-600">
                  - {firstComment.author}
                </p>
              </div>

              <div>
                <p className="font-medium">Products</p>
                <div className="mt-2 flex flex-wrap gap-4 text-sm font-light">
                  {firstComment.products.map((product, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <p>{product}</p>
                    </div>
                  ))} 
                </div>
              </div>

              <button
                onClick={handleReadMore}
                className="bg-primary flex items-center gap-2 rounded-md px-7 py-3 text-lg text-white"
              >
                Read More
                <img src={ArrowRight} alt="arrow" className="h-2" />
              </button>
            </div>
            <img
              src={testimonial1} 
              className="hidden h-[28rem] w-1/2 rounded-xl object-cover object-center md:block"
            />
          </div>
        )}
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePostComment}
      />
    </SidePadding>
  );
}

export default Testimonials;