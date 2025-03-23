import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SecurityKeyModal from 'components/SercurityKeyModal/SercurityKeyModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ViewBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<{ _id: string; title: string; author: { name: string } }[]>([]);
  const [isSecurityKeyModalOpen, setIsSecurityKeyModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});


  const validateSecurityKey = async (key: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/validate-security-key`, { key });
      return response.data.isValid;
    } catch (error) {
      console.error('Failed to validate security key:', error);
      return false;
    }
  };


  const handleActionWithSecurityKey = (action: () => void) => {
    setPendingAction(() => action);
    setIsSecurityKeyModalOpen(true);
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

  // Handle delete action with security key
  const handleDelete = async (blogId: string) => {
    const action = async () => {
      try {
        const response = await axios.delete(`${API_BASE_URL}/blog/blogs/${blogId}`);
        if (response.status === 200) {
          alert('Blog deleted successfully!');
          fetchBlogs(); // Refresh the list after deletion
        }
      } catch (error) {
        console.error('Failed to delete blog:', error);
        alert('Failed to delete blog. Please try again.');
      }
    };

    handleActionWithSecurityKey(action);
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

      <SecurityKeyModal
        isOpen={isSecurityKeyModalOpen}
        onClose={() => setIsSecurityKeyModalOpen(false)}
        onValidate={async (key) => {
          const isValid = await validateSecurityKey(key);
          if (isValid) {
            pendingAction();
          }
          return isValid;
        }}
      />
    </div>
  );
};

export default ViewBlogs;