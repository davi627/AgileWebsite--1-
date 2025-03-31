import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ViewBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<{ _id: string; title: string; author: { name: string } }[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentAction, setCurrentAction] = useState<() => void>(() => {});

  // Handle form submission with confirmation
  const handleWithConfirmation = (action: () => void, message?: string) => {
    setCurrentAction(() => action);
    setShowConfirmation(true);
  };

  const executeAction = () => {
    setShowConfirmation(false);
    currentAction();
  };

  const cancelAction = () => {
    setShowConfirmation(false);
  };

  // Fetch blogs from the backend
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blog/blogs`);
      setBlogs(response.data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      alert('Failed to fetch blogs. Please try again.');
    }
  };

  // Handle delete action with confirmation
  const handleDelete = async (blogId: string) => {
    handleWithConfirmation(async () => {
      try {
        const response = await axios.delete(`${API_BASE_URL}/blog/blogs/${blogId}`);
        if (response.status === 200) {
          alert('Blog deleted successfully!');
          fetchBlogs();
        }
      } catch (error) {
        console.error('Failed to delete blog:', error);
        alert('Failed to delete blog. Please try again.');
      }
    }, "Are you sure you want to permanently delete this blog post? This action cannot be undone.");
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">View Blogs</h2>
      <div className="space-y-4">
        {blogs.length === 0 ? (
          <p className="text-gray-700">No blogs found.</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="flex justify-between items-center p-4 border border-gray-300 rounded-md">
              <div>
                <h3 className="text-lg font-semibold">{blog.title}</h3>
                <p className="text-sm text-gray-600">By {blog.author.name}</p>
              </div>
              <button
                onClick={() => handleDelete(blog._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Confirm Action</h3>
            <p className="mb-6">Are you sure you want to perform this action?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelAction}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBlogs;