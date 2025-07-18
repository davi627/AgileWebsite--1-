import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://webtest-api.agilebiz.co.ke:5000'

interface BlogPost {
  _id: string
  title: string
  content: { type: string; data: string }[]
  imageUrl: string
  formattedDate: string
  author: { name: string }
  views: number
}

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/blog/blogs`)
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const data = await response.json()
        console.log('API Response Data:', data)
        if (Array.isArray(data)) {
          setBlogs(data)
        } else {
          throw new Error('Invalid data format: Expected an array of blogs')
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
        setError('Failed to fetch blog posts. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const handleViewBlog = async (blogId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/blogs/${blogId}/view`, {
        method: 'PATCH',
      })
      if (!response.ok) throw new Error('Failed to update views')
      const updatedBlog = await response.json()
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId ? { ...blog, views: updatedBlog.views } : blog
        )
      )
    } catch (error) {
      console.error('Error updating views:', error)
    }
  }

  if (loading)
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow text-center py-10">Loading...</div>
        <Footer />
      </div>
    )

  if (error)
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow text-center py-10 text-red-500">{error}</div>
        <Footer />
      </div>
    )

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              to="/"
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
            >
              Home
            </Link>
          </div>

          <h2 className="mt-[40px] text-2xl font-bold text-center text-gray-800">
            Latest Blog Articles
          </h2>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-105 transition-transform border"
              >
                <div className="h-24">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-md font-semibold text-gray-900 line-clamp-1">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {blog.formattedDate}
                  </p>
                  <Link
                    to={`/blog/${blog._id}`}
                    className="text-primary text-xs font-medium mt-2 inline-block"
                    onClick={() => handleViewBlog(blog._id)}
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
