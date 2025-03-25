import React, { useEffect, useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from 'services/AuthService';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SecurityKeyModal from 'components/SercurityKeyModal/SercurityKeyModal';
import ViewBlogs from 'components/ViewBlogs/ViewBlogs';
import ViewSolutions from 'components/ViewSolutions/ViewSolutions';
import UpdateSecurityKey from 'components/UpdateSercurityKey/UpdateSercurityKey';




const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface BlogContent {
  type: "text" | "image";
  data: string; 
}



const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('statistics');
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null); 
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [title, setTitle] = useState(""); 
  const [content, setContent] = useState<BlogContent[]>([]); 
  const [author, setAuthor] = useState(""); // 
  const [loading, setLoading] = useState(false); 
  const [imageUrl, setImageUrl] = useState("");
  const [isSecurityKeyModalOpen, setIsSecurityKeyModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);

  const [newTestimonial, setNewTestimonial] = useState({
    logo: null as File | null,
    description: '',
    author: '',
    products: '',
    image: null as File | null,
  });

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
  interface Comment {
    _id: string;
    text: string;
    author: string;
    blogId: {
      _id: string;
      title: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    date: string;
    formattedDate?: string;
  }
  

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

const quillRef = useRef<ReactQuill>(null);
interface Comment {
  _id: string;
  logo: string;
  description: string;
  author: string;
  products: string[];
  status: 'pending' | 'approved' | 'rejected'; 
  
}

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
  
    const action = async () => {
      try {
        await axios.post(`${API_BASE_URL}/stats/statistics`, statistics);
        alert('Statistics updated successfully!');
      } catch (error) {
        console.error('Failed to update statistics:', error);
        alert('Failed to update statistics. Please try again.');
      }
    };
  
    handleActionWithSecurityKey(action);
  };

    // Fetch comments from the backend
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/comments/comments`);
       
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    const handleTestimonialInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLInputElement>
) => {
  const { name, value, files } = e.target as HTMLInputElement;
  if (files) {
    setNewTestimonial({
      ...newTestimonial,
      [name]: files[0],
    });
  } else {
    setNewTestimonial({
      ...newTestimonial,
      [name]: value,
    });
  }
};
    //Handling Testimonials Submition

    const handleSubmitTestimonial = async (e: React.FormEvent) => {
      e.preventDefault();
    
      const action = async () => {
        const formData = new FormData();
        formData.append('description', newTestimonial.description);
        formData.append('author', newTestimonial.author);
        formData.append('products', newTestimonial.products);
        if (newTestimonial.logo) formData.append('logo', newTestimonial.logo);
        if (newTestimonial.image) formData.append('image', newTestimonial.image);
    
        try {
          const response = await axios.post(`${API_BASE_URL}/comments/comments`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          if (response.status === 201) {
            alert('Testimonial created successfully!');
            setNewTestimonial({
              logo: null,
              description: '',
              author: '',
              products: '',
              image: null,
            });
          }
        } catch (error) {
          console.error('Failed to create testimonial:', error);
          alert('Failed to create testimonial. Please try again.');
        }
      };
    
      handleActionWithSecurityKey(action);


    };
    // Fetch comments on component mount
    useEffect(() => {
      fetchComments();
    }, []);
  
    // Handle view action
    const handleView = (comment: Comment) => {
     
      setSelectedComment(comment);
      setIsPopupOpen(true); 
    };
  
    // Handle approve action
    const handleApprove = async (commentId: string) => {
      const action = async () => {
        try {
          await axios.put(`${API_BASE_URL}/comments/comments/${commentId}/approve`);
          fetchComments();
          alert('Comment approved successfully!');
        } catch (error) {
          console.error('Failed to approve comment:', error);
          alert('Failed to approve comment. Please try again.');
        }
      };
      handleActionWithSecurityKey(action);
    };

    

    const handleDelete = async (commentId: string) => {
      const action = async () => {
        try {
          const response = await axios.delete(`${API_BASE_URL}/comments/comments/${commentId}`);
          if (response.status === 200) {
            alert('Comment deleted successfully!');
            fetchComments();
          }
        } catch (error) {
          console.error('Failed to delete comment:', error);
          alert('Failed to delete comment. Please try again.');
        }
      };
      handleActionWithSecurityKey(action);
    };

      // Handle reject action
      const handleReject = async (commentId: string) => {
        const action = async () => {
          try {
            await axios.put(`${API_BASE_URL}/comments/comments/${commentId}/reject`);
            fetchComments();
            alert('Comment rejected successfully!');
          } catch (error) {
            console.error('Failed to reject comment:', error);
            alert('Failed to reject comment. Please try again.');
          }
        };
        handleActionWithSecurityKey(action);
      };
  


  const addText = (text: string) => {
    if (text.trim()) {
      setContent((prevContent) => [
        ...prevContent,
        { type: "text", data: text },
      ]);
    }
  };

  // Add image to the content
  const addImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(`${API_BASE_URL}/blog/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.imageUrl) {
        setContent((prevContent) => [
          ...prevContent,
          { type: "image", data: response.data.imageUrl },
        ]);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

// Handle form submission for adding a new blog
const handleBlogSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const action = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/blog/blogs`, {
        title,
        content,
        author: { name: author },
        imageUrl,
      });

      if (response.status === 201) {
        alert('Blog created successfully!');
        setTitle('');
        setContent([]);
        setAuthor('');
        setImageUrl('');
      }
    } catch (error) {
      console.error('Failed to create blog:', error);
      alert('Failed to create blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  handleActionWithSecurityKey(action);
};

const [isEditorReady, setIsEditorReady] = useState(false);
useEffect(() => {
  setIsEditorReady(true);
}, []);

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
  
    
    const action = async () => {
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
  
    
    handleActionWithSecurityKey(action);
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
  
    const action = async () => {
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
  
    handleActionWithSecurityKey(action);
  };

   // Close the popup
   const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedComment(null);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuItemClick = (section: string) => {
    setActiveSection(section);
    setIsSidebarOpen(false); 
  };
  const fetchPendingComments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blog/comments/pending`);
      setPendingComments(response.data);
    } catch (error) {
      console.error('Failed to fetch pending comments:', error);
    }
  };
  
  const handleApproveComment = async (commentId: string) => {
    try {
      await axios.patch(`${API_BASE_URL}/blog/comments/${commentId}/approve`);
      fetchPendingComments();
      alert('Comment approved successfully!');
    } catch (error) {
      console.error('Failed to approve comment:', error);
      alert('Failed to approve comment. Please try again.');
    }
  };
  
  const handleRejectComment = async (commentId: string) => {
    try {
      await axios.patch(`${API_BASE_URL}/blog/comments/${commentId}/reject`);
      fetchPendingComments();
      alert('Comment rejected successfully!');
    } catch (error) {
      console.error('Failed to reject comment:', error);
      alert('Failed to reject comment. Please try again.');
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/blog/comments/${commentId}`);
      fetchPendingComments();
      alert('Comment deleted successfully!');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };
  
  // Call fetchPendingComments in useEffect
  useEffect(() => {
    if (activeSection === 'moderate-comments') {
      fetchPendingComments();
    }
  }, [activeSection]);
  



  return (
    <div className="flex h-screen bg-gray-100">
    {/* Sidebar */}
    <div
      className={`fixed lg:relative lg:translate-x-0 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64 bg-primary text-white flex flex-col transition-transform duration-200 ease-in-out z-30`}
    >
      {/* Sidebar Header */}
      <div className="p-6 text-xl font-bold">Admin Panel</div>

      {/* Sidebar Menu */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleMenuItemClick('statistics')}
              className={`block w-full text-left p-4 hover:bg-indigo-500 transition duration-200 ${
                activeSection === 'statistics' ? 'bg-indigo-500' : ''
              }`}
            >
              Statistics
            </button>
          </li>
          <li>
            <button
              onClick={() => handleMenuItemClick('add-partners')}
              className={`block w-full text-left p-4 hover:bg-indigo-500 transition duration-200 ${
                activeSection === 'add-partners' ? 'bg-indigo-500' : ''
              }`}
            >
              Add Partners
            </button>
          </li>
          <li>
            <button
              onClick={() => handleMenuItemClick('add-solutions')}
              className={`block w-full text-left p-4 hover:bg-indigo-500 transition duration-200 ${
                activeSection === 'add-solutions' ? 'bg-indigo-500' : ''
              }`}
            >
              Add Solutions
            </button>
          </li>
          <li>
            <button
              onClick={() => handleMenuItemClick('view-testimonials')}
              className={`block w-full text-left p-4 hover:bg-indigo-500 transition duration-200 ${
                activeSection === 'view-testimonials' ? 'bg-indigo-500' : ''
              }`}
            >
              View Testimonials
            </button>
          </li>
          <li>
            <button
              onClick={() => handleMenuItemClick('create-blogs')}
              className={`block w-full text-left p-4 hover:bg-indigo-500 transition duration-200 ${
                activeSection === 'create-blogs' ? 'bg-indigo-500' : ''
              }`}
            >
              Create Blogs
            </button>
          </li>
          <li>
            <button
              onClick={() => handleMenuItemClick('create-testimonials')}
              className={`block w-full text-left p-4 hover:bg-indigo-500 transition duration-200 ${
                activeSection === 'create-testimonials' ? 'bg-indigo-500' : ''
              }`}
            >
              Create Testimonials
            </button>

            <li>
        <button
        onClick={() => handleMenuItemClick('view-blogs')}
        className={`block w-full text-left p-4 hover:bg-indigo-700 transition duration-200 ${
         activeSection === 'view-blogs' ? 'bg-indigo-700' : ''
       }`}
       >
    View Blogs
  </button>

  <li>
  <button
    onClick={() => handleMenuItemClick('moderate-comments')}
    className={`block w-full text-left p-4 hover:bg-indigo-500 transition duration-200 ${
      activeSection === 'moderate-comments' ? 'bg-indigo-500' : ''
    }`}
  >
    Moderate Comments
  </button>
</li>


  <li>
  <button
    onClick={() => handleMenuItemClick('view-solutions')}
    className={`block w-full text-left p-4 hover:bg-indigo-700 transition duration-200 ${
      activeSection === 'view-solutions' ? 'bg-indigo-700' : ''
    }`}
  >
    View Solutions
  </button>

  <li>
  <button
    onClick={() => handleMenuItemClick('update-security-key')}
    className={`block w-full text-left p-4 hover:bg-indigo-700 transition duration-200 ${
      activeSection === 'update-security-key' ? 'bg-indigo-700' : ''
    }`}
  >
    Update Security Key
  </button>
</li>
</li>
</li>
          </li>
        </ul>
      </nav>
    </div>

    {/* Main Content */}
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Navbar */}
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <span> {getUserRole()}</span>
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



        {activeSection === 'statistics' && (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-6">Statistics</h2>
    <form onSubmit={handleSubmitStatistics} className="space-y-4">
      {/* Successful Projects */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Successful Projects
        </label>
        <input
          type="text"
          name="successfulProjects"
          value={statistics.successfulProjects}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Happy Customers */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Happy Customers
        </label>
        <input
          type="text"
          name="happyCustomers"
          value={statistics.happyCustomers}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Customer Satisfaction */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Customer Satisfaction
        </label>
        <input
          type="text"
          name="customerSatisfaction"
          value={statistics.customerSatisfaction}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Experience */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Experience
        </label>
        <input
          type="text"
          name="experience"
          value={statistics.experience}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition duration-200 w-full sm:w-auto"
      >
        Update Statistics
      </button>
    </form>
  </div>
)}
          {activeSection === 'add-partners' && (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-6">Add Partners</h2>
    <form onSubmit={handleSubmitPartner} className="space-y-4">
      {/* Partner Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Partner Name
        </label>
        <input
          type="text"
          name="name"
          value={newPartner.name}
          onChange={handlePartnerInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Black & White Logo */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Black & White Logo
        </label>
        <input
          type="file"
          name="bwLogo"
          onChange={handlePartnerInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Colored Logo */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Colored Logo
        </label>
        <input
          type="file"
          name="colorLogo"
          onChange={handlePartnerInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition duration-200 w-full sm:w-auto"
      >
        Upload Partner Logo
      </button>
    </form>
  </div>
)}
{activeSection === 'add-solutions' && (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-6">Add Solutions</h2>
    <form onSubmit={handleSubmitSolution} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={newSolution.title}
          onChange={handleSolutionInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Solution Key */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Solution Key
        </label>
        <input
          type="text"
          name="soln"
          value={newSolution.soln}
          onChange={handleSolutionInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="text"
          name="img"
          value={newSolution.img}
          onChange={handleSolutionInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Route */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Route
        </label>
        <input
          type="text"
          name="route"
          value={newSolution.route}
          onChange={handleSolutionInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* FAQs */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          FAQs
        </label>
        {newSolution.faqs.map((faq, index) => (
          <div key={index} className="space-y-2">
            {/* Question */}
            <input
              type="text"
              name="q"
              value={faq.q}
              onChange={(e) => handleFaqChange(index, e)}
              placeholder="Question"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            {/* Answer */}
            <textarea
              name="a"
              value={faq.a}
              onChange={(e) => handleFaqChange(index, e)}
              placeholder="Answer"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        ))}
        {/* Add FAQ Button */}
        <button
          type="button"
          onClick={addFaq}
          className="mt-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-200"
        >
          Add FAQ
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition duration-200 w-full sm:w-auto"
      >
        Add Solution
      </button>
    </form>
  </div>
)}
{activeSection === 'view-testimonials' && (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-6">View Testimonials</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Author</th>
            <th className="py-2 px-4 border-b text-left">Products</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-2 px-4 border-b text-center">
                No comments found.
              </td>
            </tr>
          ) : (
            comments.map((comment) => (
              <tr key={comment._id}>
                <td className="py-2 px-4 border-b">{comment.author}</td>
                <td className="py-2 px-4 border-b">{comment.products.join(', ')}</td>
                <td className="py-2 px-4 border-b">{comment.status}</td>
                <td className="py-2 px-4 border-b flex flex-wrap gap-2">
  <button
    onClick={() => handleView(comment)}
    className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition duration-200"
  >
    View
  </button>
  <button
    onClick={() => handleApprove(comment._id)}
    className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition duration-200"
    disabled={comment.status === 'approved' || comment.status === 'rejected'}
  >
    Approve
  </button>
  <button
    onClick={() => handleReject(comment._id)}
    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition duration-200"
    disabled={comment.status === 'approved' || comment.status === 'rejected'}
  >
    Reject
  </button>
  <button
    onClick={() => handleDelete(comment._id)}
    className="bg-red-800 text-white px-2 py-1 rounded-md hover:bg-red-900 transition duration-200"
  >
    Delete
  </button>
</td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

{/* Popup for Viewing Description */}
{isPopupOpen && selectedComment && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Comment Details</h2>
        <button
          onClick={closePopup}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div>
        <p className="text-gray-700">{selectedComment.description}</p>
      </div>
    </div>
  </div>
)}
    



    {activeSection === 'create-blogs' && (
    <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-6">Create Blog</h2>
    <form onSubmit={handleBlogSubmit} className="space-y-4">

    <div>
  <label className="block text-sm font-medium text-gray-700">Image URL</label>
  <input
    type="text"
    value={imageUrl}
    onChange={(e) => setImageUrl(e.target.value)}
    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    required
  />
</div>
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Add Text
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
          placeholder="Write your text here..."
          onBlur={(e) => addText(e.target.value)} 
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Add Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              addImage(e.target.files[0]);
            }
          }}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Preview Content */}
      <div className="mt-6 space-y-4">
        {content.map((item, index) => (
          <div key={index} className="border p-4 rounded-md">
            {item.type === "text" ? (
              <p>{item.data}</p>
            ) : (
              <img
                src={item.data}
                alt={`Uploaded ${index}`}
                className="w-full h-32 object-cover rounded-md"
              />
            )}
          </div>
        ))}
      </div>

      {/* Author Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Author Name
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition duration-200 w-full sm:w-auto"
      >
        {loading ? "Creating..." : "Create Blog"}
      </button>
    </form>
  </div>
          )}
{activeSection === 'create-testimonials' && (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-6">Create Testimonials</h2>
    <form onSubmit={handleSubmitTestimonial} className="space-y-4" encType="multipart/form-data">
      {/* Logo Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Logo</label>
        <input
          type="file"
          name="logo"
          onChange={handleTestimonialInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={newTestimonial.description}
          onChange={handleTestimonialInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={4}
          required
        />
      </div>

      {/* Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="author"
          value={newTestimonial.author}
          onChange={handleTestimonialInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Products Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Products</label>
        <input
          type="text"
          name="products"
          value={newTestimonial.products}
          onChange={handleTestimonialInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
         
        />
      </div>

      {/* Image Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <input
          type="file"
          name="image"
          onChange={handleTestimonialInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition duration-200 w-full sm:w-auto"
      >
        Create Testimonial
      </button>
    </form>
  </div>
)}

{activeSection === 'view-blogs' && <ViewBlogs />}
{activeSection === 'moderate-comments' && (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-6">Pending Comments</h2>
    {pendingComments.length === 0 ? (
      <p className="text-gray-500">No pending comments to review.</p>
    ) : (
      <div className="space-y-4">
        {pendingComments.map((comment) => (
          <div key={comment._id} className="border p-4 rounded-lg">
            <p className="font-semibold">Blog: {comment.blogId?.title || 'Unknown Blog'}</p>
            <p className="text-gray-700 mt-2">{comment.text}</p>
            <p className="text-sm text-gray-500 mt-1">By: {comment.author}</p>
            <p className="text-sm text-gray-500">{comment.formattedDate || new Date(comment.date).toLocaleDateString()}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleApproveComment(comment._id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleRejectComment(comment._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Reject
              </button>
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
{activeSection === 'view-solutions' && <ViewSolutions />}
{activeSection === 'update-security-key' && <UpdateSecurityKey />}
        </main>
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

export default AdminDashboard;