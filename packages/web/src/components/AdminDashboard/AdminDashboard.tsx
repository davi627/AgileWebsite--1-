import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, getUserRole } from 'services/AuthService'
import axios from 'axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import SecurityKeyModal from 'components/SercurityKeyModal/SercurityKeyModal'
import ViewBlogs from 'components/ViewBlogs/ViewBlogs'
import ViewSolutions from 'components/ViewSolutions/ViewSolutions'
import UpdateSecurityKey from 'components/UpdateSercurityKey/UpdateSercurityKey'
import SolutionCategoryForm from 'components/SolutionCategoryForm/SolutionCategoryForm'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://webtest-api.agilebiz.co.ke:5000'

interface BlogContent {
  type: 'text' | 'image'
  data: string
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<string>('statistics')
  const [comments, setComments] = useState<Comment[]>([])
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<BlogContent[]>([])
  const [author, setAuthor] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [pendingComments, setPendingComments] = useState<Comment[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [currentAction, setCurrentAction] = useState<() => void>(() => {})
  const [selectedComments, setSelectedComments] = useState<string[]>([])
  const [approvedComments, setApprovedComments] = useState<Comment[]>([])
  const [viewApproved, setViewApproved] = useState(false)
  const [newTestimonial, setNewTestimonial] = useState({
    logo: null as File | null,
    description: '',
    author: '',
    products: '',
    image: null as File | null
  })

  const [statistics, setStatistics] = useState({
    successfulProjects: 0,
    happyCustomers: 0,
    customerSatisfaction: 0,
    experience: '0 Years'
  })
  const [newSolution, setNewSolution] = useState({
    title: '',
    soln: '',
    img: '',
    route: '',
    faqs: [{ q: '', a: '' }]
  })
  const [newPartner, setNewPartner] = useState({
    name: '',
    bwLogo: null as File | null,
    colorLogo: null as File | null
  })
  interface Comment {
    _id: string
    text: string
    author: string
    blogId: {
      _id: string
      title: string
    }
    status: 'pending' | 'approved' | 'rejected'
    date: string
    formattedDate?: string
  }

  //Function for batch delete
  const toggleSelectComment = (commentId: string) => {
    setSelectedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    )
  }

  const handleBatchApprove = async () => {
    if (selectedComments.length === 0) return

    handleWithConfirmation(async () => {
      try {
        await axios.post(`${API_BASE_URL}/blog/comments/batch-approve`, {
          ids: selectedComments
        })
        fetchPendingComments()
        fetchApprovedComments()
        setSelectedComments([])
        alert(`${selectedComments.length} comments approved successfully!`)
      } catch (error) {
        console.error('Failed to approve comments:', error)
        alert('Failed to approve comments. Please try again.')
      }
    }, `Are you sure you want to approve ${selectedComments.length} comments?`)
  }

  const handleBatchReject = async () => {
    if (selectedComments.length === 0) return

    handleWithConfirmation(async () => {
      try {
        await axios.post(`${API_BASE_URL}/blog/comments/batch-reject`, {
          ids: selectedComments
        })
        fetchPendingComments()
        setSelectedComments([])
        alert(`${selectedComments.length} comments rejected successfully!`)
      } catch (error) {
        console.error('Failed to reject comments:', error)
        alert('Failed to reject comments. Please try again.')
      }
    }, `Are you sure you want to reject ${selectedComments.length} comments?`)
  }

  const handleBatchDelete = async () => {
    if (selectedComments.length === 0) return

    handleWithConfirmation(async () => {
      try {
        await axios.post(`${API_BASE_URL}/blog/comments/batch-delete`, {
          ids: selectedComments
        })
        if (viewApproved) {
          fetchApprovedComments()
        } else {
          fetchPendingComments()
        }
        setSelectedComments([])
        alert(`${selectedComments.length} comments deleted successfully!`)
      } catch (error) {
        console.error('Failed to delete comments:', error)
        alert('Failed to delete comments. Please try again.')
      }
    }, `Are you sure you want to permanently delete ${selectedComments.length} comments? This action cannot be undone.`)
  }

  const fetchApprovedComments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blog/comments/approved`)
      setApprovedComments(response.data)
    } catch (error) {
      console.error('Failed to fetch approved comments:', error)
    }
  }

  // Handle form submission with confirmation
  const handleWithConfirmation = (action: () => void, message?: string) => {
    setCurrentAction(() => action)
    setShowConfirmation(true)
  }

  const executeAction = () => {
    setShowConfirmation(false)
    currentAction()
  }

  const cancelAction = () => {
    setShowConfirmation(false)
  }

  interface Comment {
    _id: string
    logo: string
    description: string
    author: string
    products: string[]
    status: 'pending' | 'approved' | 'rejected'
  }

  // Check authentication and role on component mount
  useEffect(() => {
    const checkAuthAndRole = async () => {
      if (!isAuthenticated()) {
        navigate('/login', { replace: true })
        return
      }

      const userRole = getUserRole()
      if (userRole !== 'Admin' && userRole !== 'User') {
        navigate('/access-denied', { replace: true })
        return
      }
    }

    checkAuthAndRole()
  }, [navigate])

  // Handle input change for the statistics form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setStatistics({
      ...statistics,
      [name]: value
    })
  }

  // Handle form submission for statistics
  const handleSubmitStatistics = async (e: React.FormEvent) => {
    e.preventDefault()
    handleWithConfirmation(async () => {
      try {
        await axios.post(`${API_BASE_URL}/stats/statistics`, statistics)
        alert('Statistics updated successfully!')
      } catch (error) {
        console.error('Failed to update statistics:', error)
        alert('Failed to update statistics. Please try again.')
      }
    }, 'Are you sure you want to update statistics?')
  }
  //fetch the existing Statistics from the backend
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/stats/statistics`)
        if (response.data) {
          setStatistics({
            successfulProjects: response.data.successfulProjects || 0,
            happyCustomers: response.data.happyCustomers || 0,
            customerSatisfaction: response.data.customerSatisfaction || '0%',
            experience: response.data.experience || '0 Years'
          })
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error)
      }
    }

    if (activeSection === 'statistics') {
      fetchStatistics()
    }
  }, [activeSection])

  // Fetch comments from the backend
  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/comments/comments`)

      setComments(response.data)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
  }

  const handleTestimonialInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLInputElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement
    if (files) {
      setNewTestimonial({
        ...newTestimonial,
        [name]: files[0]
      })
    } else {
      setNewTestimonial({
        ...newTestimonial,
        [name]: value
      })
    }
  }

  // Handle testimonial submission
  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault()
    handleWithConfirmation(async () => {
      const formData = new FormData()
      formData.append('description', newTestimonial.description)
      formData.append('author', newTestimonial.author)
      formData.append('products', newTestimonial.products)
      if (newTestimonial.logo) formData.append('logo', newTestimonial.logo)
      if (newTestimonial.image) formData.append('image', newTestimonial.image)

      try {
        const response = await axios.post(
          `${API_BASE_URL}/comments/comments`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        if (response.status === 201) {
          alert('Testimonial created successfully!')
          setNewTestimonial({
            logo: null,
            description: '',
            author: '',
            products: '',
            image: null
          })
          setActiveSection('view-testimonials')
          fetchComments()
        }
      } catch (error) {
        console.error('Failed to create testimonial:', error)
        alert('Failed to create testimonial. Please try again.')
      }
    }, 'Are you sure you want to create this testimonial?')
  }
  // Fetch comments on component mount
  useEffect(() => {
    fetchComments()
  }, [])

  // Handle view action
  const handleView = (comment: Comment) => {
    setSelectedComment(comment)
    setIsPopupOpen(true)
  }

  // Handle approve action
  const handleApprove = async (commentId: string) => {
    handleWithConfirmation(async () => {
      try {
        await axios.put(
          `${API_BASE_URL}/comments/comments/${commentId}/approve`
        )
        fetchComments()
        alert('Testimonial approved successfully!')
      } catch (error) {
        console.error('Failed to approve comment:', error)
        alert('Failed to approve comment. Please try again.')
      }
    }, 'Are you sure you want to approve this comment?')
  }

  // Handle delete action
  const handleDelete = async (commentId: string) => {
    handleWithConfirmation(async () => {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/comments/comments/${commentId}`
        )
        if (response.status === 200) {
          alert('Testimonial deleted successfully!')
          fetchComments()
        }
      } catch (error) {
        console.error('Failed to delete comment:', error)
        alert('Failed to delete comment. Please try again.')
      }
    }, 'Are you sure you want to delete this comment?')
  }

  // Handle reject action
  const handleReject = async (commentId: string) => {
    handleWithConfirmation(async () => {
      try {
        await axios.put(`${API_BASE_URL}/comments/comments/${commentId}/reject`)
        fetchComments()
        alert('Testimonial rejected successfully!')
      } catch (error) {
        console.error('Failed to reject comment:', error)
        alert('Failed to reject comment. Please try again.')
      }
    }, 'Are you sure you want to reject this comment?')
  }

  const addText = (text: string) => {
    if (text.trim()) {
      setContent((prevContent) => [
        ...prevContent,
        { type: 'text', data: text }
      ])
    }
  }

  // Handle form submission for adding a new blog
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    handleWithConfirmation(async () => {
      setLoading(true)
      try {
        const response = await axios.post(`${API_BASE_URL}/blog/blogs`, {
          title,
          content,
          author: { name: author },
          imageUrl
        })

        if (response.status === 201) {
          alert('Blog created successfully!')
          setTitle('')
          setContent([])
          setAuthor('')
          setImageUrl('')
        }
      } catch (error) {
        console.error('Failed to create blog:', error)
        alert('Failed to create blog. Please try again.')
      } finally {
        setLoading(false)
      }
    }, 'Are you sure you want to create this blog post?')
  }

  const [isEditorReady, setIsEditorReady] = useState(false)
  useEffect(() => {
    setIsEditorReady(true)
  }, [])

  // Handle input change for the new solution form
  const handleSolutionInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setNewSolution({
      ...newSolution,
      [name]: value
    })
  }

  // Handle FAQ input change for the new solution form
  const handleFaqChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    const updatedFaqs = [...newSolution.faqs]
    updatedFaqs[index] = { ...updatedFaqs[index], [name]: value }
    setNewSolution({
      ...newSolution,
      faqs: updatedFaqs
    })
  }

  // Add a new FAQ field to the form
  const addFaq = () => {
    setNewSolution({
      ...newSolution,
      faqs: [...newSolution.faqs, { q: '', a: '' }]
    })
  }

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault()

    handleWithConfirmation(async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/solns/solution`,
          newSolution
        )
        if (response.status === 201) {
          alert('Solution added successfully!')
          setNewSolution({
            title: '',
            soln: '',
            img: '',
            route: '',
            faqs: [{ q: '', a: '' }]
          })
        }
      } catch (error) {
        console.error('Failed to add solution:', error)
        alert('Failed to add solution. Please try again.')
      }
    }, 'Are you sure you want to add this solution?')
  }

  // Handle input change for the new partner form
  const handlePartnerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (files) {
      setNewPartner({
        ...newPartner,
        [name]: files[0]
      })
    } else {
      setNewPartner({
        ...newPartner,
        [name]: value
      })
    }
  }

  const handleSubmitPartner = async (e: React.FormEvent) => {
    e.preventDefault()

    handleWithConfirmation(async () => {
      const formData = new FormData()
      formData.append('name', newPartner.name)
      if (newPartner.bwLogo) formData.append('bwLogo', newPartner.bwLogo)
      if (newPartner.colorLogo)
        formData.append('colorLogo', newPartner.colorLogo)

      try {
        const response = await axios.post(
          `${API_BASE_URL}/log/logo`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        if (response.status === 201) {
          alert('Partner logo uploaded successfully!')
          setNewPartner({
            name: '',
            bwLogo: null,
            colorLogo: null
          })
        }
      } catch (error) {
        console.error('Failed to upload partner logo:', error)
        alert('Failed to upload partner logo. Please try again.')
      }
    }, 'Are you sure you want to upload this partner logo?')
  }

  // Close the popup
  const closePopup = () => {
    setIsPopupOpen(false)
    setSelectedComment(null)
  }
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleMenuItemClick = (section: string) => {
    setActiveSection(section)
    setIsSidebarOpen(false)
  }
  const fetchPendingComments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blog/comments/pending`)
      setPendingComments(response.data)
    } catch (error) {
      console.error('Failed to fetch pending comments:', error)
    }
  }

  const handleApproveComment = async (commentId: string) => {
    handleWithConfirmation(async () => {
      try {
        await axios.patch(`${API_BASE_URL}/blog/comments/${commentId}/approve`)
        fetchPendingComments()
        alert('Comment approved successfully!')
      } catch (error) {
        console.error('Failed to approve comment:', error)
        alert('Failed to approve comment. Please try again.')
      }
    }, 'Are you sure you want to approve this comment?')
  }

  const handleRejectComment = async (commentId: string) => {
    handleWithConfirmation(async () => {
      try {
        await axios.patch(`${API_BASE_URL}/blog/comments/${commentId}/reject`)
        fetchPendingComments()
        alert('Comment rejected successfully!')
      } catch (error) {
        console.error('Failed to reject comment:', error)
        alert('Failed to reject comment. Please try again.')
      }
    }, 'Are you sure you want to reject this comment?')
  }

  const handleDeleteComment = async (commentId: string) => {
    handleWithConfirmation(async () => {
      try {
        await axios.delete(`${API_BASE_URL}/blog/comments/${commentId}`)
        fetchPendingComments()
        alert('Comment deleted successfully!')
      } catch (error) {
        console.error('Failed to delete comment:', error)
        alert('Failed to delete comment. Please try again.')
      }
    }, 'Are you sure you want to permanently delete this comment? This action cannot be undone.')
  }

  // Call fetchPendingComments in useEffect
  useEffect(() => {
    if (activeSection === 'moderate-comments') {
      if (viewApproved) {
        fetchApprovedComments()
      } else {
        fetchPendingComments()
      }
    }
  }, [activeSection, viewApproved])

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
                onClick={() => handleMenuItemClick('view-testimonials')}
                className={`block w-full text-left p-4 hover:bg-indigo-500 transition duration-200 ${
                  activeSection === 'view-testimonials' ? 'bg-indigo-500' : ''
                }`}
              >
                View Testimonials
              </button>
            </li>
            <li>
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
                      activeSection === 'moderate-comments'
                        ? 'bg-indigo-500'
                        : ''
                    }`}
                  >
                    Moderate Comments
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleMenuItemClick('manage-solutions')}
                    className={`block w-full text-left p-4 hover:bg-indigo-700 transition duration-200 ${
                      activeSection === 'manage-solutions'
                        ? 'bg-indigo-700'
                        : ''
                    }`}
                  >
                    Manage Solutions
                  </button>
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
                  localStorage.removeItem('token')
                  localStorage.removeItem('userRole')
                  navigate('/login')
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
          {showConfirmation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium mb-4">Confirm Action</h3>
                <p className="mb-6">
                  Are you sure you want to perform this action?
                </p>
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
                    type="number"
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
                    type="number"
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

          {activeSection === 'view-testimonials' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">View Testimonials</h2>
                <button
                  onClick={() => setActiveSection('create-testimonials')}
                  className="bg-primary hover:bg-primary  text-white px-4 py-2 rounded-md transition duration-200"
                >
                  Create
                </button>
              </div>

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
                        <td
                          colSpan={4}
                          className="py-2 px-4 border-b text-center"
                        >
                          No testimonials found.
                        </td>
                      </tr>
                    ) : (
                      comments.map((comment) => (
                        <tr key={comment._id}>
                          <td className="py-2 px-4 border-b">
                            {comment.author}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {comment.products.join(', ')}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {comment.status}
                          </td>
                          <td className="py-2 px-4 border-b flex flex-wrap gap-2">
                            <button
                              onClick={() => handleView(comment)}
                              className="bg-primary text-white px-2 py-1 rounded-md hover:bg-primary transition duration-200"
                            >
                              View
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
              <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-xl font-semibold">Testimonial Details</h2>
                  <button
                    onClick={closePopup}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    &times;
                  </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900">Author:</h3>
                    <p className="text-gray-700">{selectedComment.author}</p>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900">Description:</h3>
                    <p className="text-gray-700 whitespace-pre-line max-h-[200px] overflow-y-auto">
                      {selectedComment.description}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900">Products:</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedComment.products.map((product, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      closePopup()
                      handleApprove(selectedComment._id)
                    }}
                    className={`px-4 py-2 rounded-md transition duration-200 ${
                      selectedComment.status === 'approved' ||
                      selectedComment.status === 'rejected'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                    disabled={
                      selectedComment.status === 'approved' ||
                      selectedComment.status === 'rejected'
                    }
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      closePopup()
                      handleReject(selectedComment._id)
                    }}
                    className={`px-4 py-2 rounded-md transition duration-200 ${
                      selectedComment.status === 'approved' ||
                      selectedComment.status === 'rejected'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                    disabled={
                      selectedComment.status === 'approved' ||
                      selectedComment.status === 'rejected'
                    }
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      closePopup()
                      handleDelete(selectedComment._id)
                    }}
                    className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'create-testimonials' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create Testimonials </h2>
                <button
                  onClick={() => setActiveSection('view-testimonials')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back
                </button>
              </div>

              <form
                onSubmit={handleSubmitTestimonial}
                className="space-y-4"
                encType="multipart/form-data"
              >
                {/* Logo Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Logo
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700">
                    Products
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700">
                    Image
                  </label>
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
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">
                  {viewApproved ? 'Approved Comments' : 'Pending Comments'}
                </h2>
                <button
                  onClick={() => setViewApproved(!viewApproved)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md transition duration-200 text-sm md:text-base"
                >
                  {viewApproved ? 'View Pending' : 'View Approved'}
                </button>
              </div>

              {selectedComments.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg flex flex-col sm:flex-row flex-wrap gap-2">
                  <span className="font-medium text-sm md:text-base self-center">
                    {selectedComments.length} selected
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {!viewApproved && (
                      <>
                        <button
                          onClick={handleBatchApprove}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs md:text-sm"
                        >
                          Approve Selected
                        </button>
                        <button
                          onClick={handleBatchReject}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs md:text-sm"
                        >
                          Reject Selected
                        </button>
                      </>
                    )}
                    <button
                      onClick={handleBatchDelete}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs md:text-sm"
                    >
                      Delete Selected
                    </button>
                    <button
                      onClick={() => setSelectedComments([])}
                      className="text-gray-500 hover:text-gray-700 text-xs md:text-sm"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {viewApproved ? (
                approvedComments.length === 0 ? (
                  <p className="text-gray-500">No approved comments found.</p>
                ) : (
                  <div className="space-y-3">
                    {approvedComments.map((comment) => (
                      <div
                        key={comment._id}
                        className="border p-3 md:p-4 rounded-lg"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <input
                            type="checkbox"
                            checked={selectedComments.includes(comment._id)}
                            onChange={() => toggleSelectComment(comment._id)}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm md:text-base truncate">
                              Blog: {comment.blogId?.title || 'Unknown Blog'}
                            </p>
                            <p className="text-gray-700 mt-1 text-sm md:text-base break-words">
                              {comment.text}
                            </p>
                            <div className="flex flex-col md:flex-row md:justify-between mt-2">
                              <p className="text-xs md:text-sm text-gray-500">
                                By: {comment.author}
                              </p>
                              <p className="text-xs md:text-sm text-gray-500">
                                {comment.formattedDate ||
                                  new Date(comment.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : pendingComments.length === 0 ? (
                <p className="text-gray-500">No pending comments to review.</p>
              ) : (
                <div className="space-y-3">
                  {pendingComments.map((comment) => (
                    <div
                      key={comment._id}
                      className="border p-3 md:p-4 rounded-lg"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <input
                          type="checkbox"
                          checked={selectedComments.includes(comment._id)}
                          onChange={() => toggleSelectComment(comment._id)}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm md:text-base truncate">
                            Blog: {comment.blogId?.title || 'Unknown Blog'}
                          </p>
                          <p className="text-gray-700 mt-1 text-sm md:text-base break-words">
                            {comment.text}
                          </p>
                          <div className="flex flex-col md:flex-row md:justify-between mt-2">
                            <p className="text-xs md:text-sm text-gray-500">
                              By: {comment.author}
                            </p>
                            <p className="text-xs md:text-sm text-gray-500">
                              {comment.formattedDate ||
                                new Date(comment.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      {!viewApproved && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          <button
                            onClick={() => handleApproveComment(comment._id)}
                            className="flex-1 md:flex-none bg-primary hover:bg-primary text-white px-2 py-1 md:px-3 md:py-1.5 rounded text-xs md:text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectComment(comment._id)}
                            className="flex-1 md:flex-none bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 md:px-3 md:py-1.5 rounded text-xs md:text-sm"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white px-2 py-1 md:px-3 md:py-1.5 rounded text-xs md:text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeSection === 'view-solutions' && <ViewSolutions />}
          {activeSection === 'update-security-key' && <UpdateSecurityKey />}
          {activeSection === 'manage-solutions' && <SolutionCategoryForm />}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
