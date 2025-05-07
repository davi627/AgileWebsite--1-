import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://webtest-api.agilebiz.co.ke:5000';

interface Comment {
  _id: string;
  logo: string;
  description: string;
  author: string;
  products: string[];
  status: 'pending' | 'approved' | 'rejected';
}

function AllCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const navigate = useNavigate();

  // Fetch approved comments from the backend
  const fetchApprovedComments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/comments`);
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

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="shadow-md rounded-lg p-4 flex flex-col justify-between h-64" 
          >
            <div>
            <img
            src={`${API_BASE_URL}${comment.logo}`} 
            alt="logo"
            className="h-10 w-auto mb-2"
/>
              <p className="text-sm line-clamp-3">{comment.description}</p> 
              <p className="mt-2 text-xs italic text-gray-600">
                - {comment.author}
              </p>
            </div>
            <div className="mt-2">
              <p className="font-medium text-sm">Products</p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs font-light">
                {comment.products.map((product, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <p>{product}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-primary text-white px-4 py-2 rounded-md"
      >
        Go Back
      </button>
    </div>
  );
}

export default AllCommentsPage;