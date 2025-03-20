import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from 'services/AuthService';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [statistics, setStatistics] = useState({
    successfulProjects: 0,
    happyCustomers: 0,
    customerSatisfaction: '0%',
    experience: '0 Years',
  });
  const [newSolution, setNewSolution] = useState({
    title: '',
    soln: '',
    img: '',
    route: '',
    faqs: [{ q: '', a: '' }],
  });
  const [newPartner, setNewPartner] = useState({
    name: '',
    bwLogo: null as File | null,
    colorLogo: null as File | null,
  });
    // State for the new blog
const [newBlog, setNewBlog] = useState({
  title: '',
  description: '',
  imageUrl: '',
  href: '#',
  author: {
    name: '',
  },
});

  // Check authentication and role on component mount
  useEffect(() => {
    const checkAuthAndRole = async () => {
      if (!isAuthenticated()) {
        navigate('/login', { replace: true });
        return;
      }

      const userRole = getUserRole();
      if (userRole !== 'Admin' && userRole !== 'User') {
        navigate('/access-denied', { replace: true });
        return;
      }
    };

    checkAuthAndRole();
  }, [navigate]);

  // Handle input change for the statistics form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStatistics({
      ...statistics,
      [name]: value,
    });
  };

  // Handle form submission for statistics (POST/UPDATE)
  const handleSubmitStatistics = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/stats/statistics`, statistics);
      alert('Statistics updated successfully!');
    } catch (error) {
      console.error('Failed to update statistics:', error);
      alert('Failed to update statistics. Please try again.');
    }
  };


// Handle input change for the new blog form
const handleBlogInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  if (name === 'authorName') {
    setNewBlog({
      ...newBlog,
      author: {
        name: value,
      },
    });
  } else {
    setNewBlog({
      ...newBlog,
      [name]: value,
    });
  }
};

// Handle form submission for adding a new blog
const handleSubmitBlog = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await axios.post(`${API_BASE_URL}/blog/blogs`, newBlog);
    if (response.status === 201) {
      alert('Blog created successfully!');
      setNewBlog({
        title: '',
        description: '',
        imageUrl: '',
        href: '#',
        author: {
          name: '',
        },
      });
    }
  } catch (error) {
    console.error('Failed to create blog:', error);
    alert('Failed to create blog. Please try again.');
  }
};

  // Handle input change for the new solution form
  const handleSolutionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSolution({
      ...newSolution,
      [name]: value,
    });
  };

  // Handle FAQ input change for the new solution form
  const handleFaqChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedFaqs = [...newSolution.faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [name]: value };
    setNewSolution({
      ...newSolution,
      faqs: updatedFaqs,
    });
  };

  // Add a new FAQ field to the form
  const addFaq = () => {
    setNewSolution({
      ...newSolution,
      faqs: [...newSolution.faqs, { q: '', a: '' }],
    });
  };

  // Handle form submission for adding a new solution
  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/solns/solution`, newSolution);
      if (response.status === 201) {
        alert('Solution added successfully!');
        setNewSolution({
          title: '',
          soln: '',
          img: '',
          route: '',
          faqs: [{ q: '', a: '' }],
        });
      }
    } catch (error) {
      console.error('Failed to add solution:', error);
      alert('Failed to add solution. Please try again.');
    }
  };

  // Handle input change for the new partner form
  const handlePartnerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setNewPartner({
        ...newPartner,
        [name]: files[0],
      });
    } else {
      setNewPartner({
        ...newPartner,
        [name]: value,
      });
    }
  };

  // Handle form submission for adding a new partner
  const handleSubmitPartner = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newPartner.name);
    if (newPartner.bwLogo) formData.append('bwLogo', newPartner.bwLogo);
    if (newPartner.colorLogo) formData.append('colorLogo', newPartner.colorLogo);

    try {
      const response = await axios.post(`${API_BASE_URL}/log/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        alert('Partner logo uploaded successfully!');
        setNewPartner({
          name: '',
          bwLogo: null,
          colorLogo: null,
        });
      }
    } catch (error) {
      console.error('Failed to upload partner logo:', error);
      alert('Failed to upload partner logo. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 text-xl font-bold">Admin Panel</div>

        {/* Sidebar Menu */}
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveSection('overview')}
                className={`block w-full text-left p-4 hover:bg-indigo-500 transition duration-200 ${
                  activeSection === 'overview' ? 'bg-indigo-500' : ''
                }`}
              >
                Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('blogs')}
                className={`block w-full text-left p-4 hover:bg-indigo-500 transition duration-200 ${
                  activeSection === 'blogs' ? 'bg-indigo-500' : ''
                }`}
              >
                Blogs
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('statistics')}
                className={`block w-full text-left p-4 hover:bg-indigo-500 transition duration-200 ${
                  activeSection === 'statistics' ? 'bg-indigo-500' : ''
                }`}
              >
                Statistics
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('add-partners')}
                className={`block w-full text-left p-4 hover:bg-indigo-500 transition duration-200 ${
                  activeSection === 'add-partners' ? 'bg-indigo-500' : ''
                }`}
              >
                Add Partners
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('add-solutions')}
                className={`block w-full text-left p-4 hover:bg-indigo-500 transition duration-200 ${
                  activeSection === 'add-solutions' ? 'bg-indigo-500' : ''
                }`}
              >
                Add Solutions
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('view-testimonials')}
                className={`block w-full text-left p-4 hover:bg-indigo-500 transition duration-200 ${
                  activeSection === 'view-testimonials' ? 'bg-indigo-500' : ''
                }`}
              >
                View Testimonials
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('create-blogs')}
                className={`block w-full text-left p-4 hover:bg-indigo-500 transition duration-200 ${
                  activeSection === 'create-blogs' ? 'bg-indigo-500' : ''
                }`}
              >
                Create Blogs
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-primary text-white p-4 shadow-md">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span>Welcome, {getUserRole()}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('userRole');
                  navigate('/login');
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <>
              <h2 className="text-2xl font-bold mb-6">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Statistics Cards */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold">Total Blogs</h3>
                  <p className="text-2xl font-bold">45</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold">Total Partners</h3>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold">Total Solutions</h3>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </>
          )}

          {/* Blogs Section */}
          {activeSection === 'blogs' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Blogs</h2>
              <p>This is the Blogs section. Add your blog content here.</p>
            </div>
          )}

          {/* Statistics Section */}
          {activeSection === 'statistics' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Statistics</h2>
              <form onSubmit={handleSubmitStatistics} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Successful Projects
                  </label>
                  <input
                    type="text"
                    name="successfulProjects"
                    value={statistics.successfulProjects}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Happy Customers
                  </label>
                  <input
                    type="text"
                    name="happyCustomers"
                    value={statistics.happyCustomers}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Customer Satisfaction
                  </label>
                  <input
                    type="text"
                    name="customerSatisfaction"
                    value={statistics.customerSatisfaction}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={statistics.experience}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
                >
                  Update Statistics
                </button>
              </form>
            </div>
          )}

          {/* Add Partners Section */}
          {activeSection === 'add-partners' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Add Partners</h2>
              <form onSubmit={handleSubmitPartner} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Partner Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newPartner.name}
                    onChange={handlePartnerInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Black & White Logo</label>
                  <input
                    type="file"
                    name="bwLogo"
                    onChange={handlePartnerInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Colored Logo</label>
                  <input
                    type="file"
                    name="colorLogo"
                    onChange={handlePartnerInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
                >
                  Upload Partner Logo
                </button>
              </form>
            </div>
          )}

          {/* Add Solutions Section */}
          {activeSection === 'add-solutions' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Add Solutions</h2>
              <form onSubmit={handleSubmitSolution} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newSolution.title}
                    onChange={handleSolutionInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Solution Key</label>
                  <input
                    type="text"
                    name="soln"
                    value={newSolution.soln}
                    onChange={handleSolutionInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="text"
                    name="img"
                    value={newSolution.img}
                    onChange={handleSolutionInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Route</label>
                  <input
                    type="text"
                    name="route"
                    value={newSolution.route}
                    onChange={handleSolutionInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">FAQs</label>
                  {newSolution.faqs.map((faq, index) => (
                    <div key={index} className="space-y-2">
                      <input
                        type="text"
                        name="q"
                        value={faq.q}
                        onChange={(e) => handleFaqChange(index, e)}
                        placeholder="Question"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
                      />
                      <textarea
                        name="a"
                        value={faq.a}
                        onChange={(e) => handleFaqChange(index, e)}
                        placeholder="Answer"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFaq}
                    className="mt-2 bg-primary text-white px-4 py-2 rounded-md"
                  >
                    Add FAQ
                  </button>
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
                >
                  Add Solution
                </button>
              </form>
            </div>
          )}

          {/* View Testimonials Section */}
          {activeSection === 'view-testimonials' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">View Testimonials</h2>
              <p>This is the View Testimonials section. Display testimonials here.</p>
            </div>
          )}

          {/* Create Blogs Section */}
          {activeSection === 'create-blogs' && (
  <div>
    <h2 className="text-2xl font-bold mb-6">Create Blogs</h2>
    <form onSubmit={handleSubmitBlog} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={newBlog.title}
          onChange={handleBlogInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={newBlog.description}
          onChange={handleBlogInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="text"
          name="imageUrl"
          value={newBlog.imageUrl}
          onChange={handleBlogInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Href</label>
        <input
          type="text"
          name="href"
          value={newBlog.href}
          onChange={handleBlogInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Author Name</label>
        <input
          type="text"
          name="authorName"
          value={newBlog.author.name}
          onChange={handleBlogInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
      >
        Create Blog
      </button>
    </form>
  </div>
)}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;