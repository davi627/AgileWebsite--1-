import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:5000'

interface BlogPost {
  _id: string
  title: string
  content: { type: string; data: string }[]
  imageUrl: string
  formattedDate: string
  author: { name: string }
  views: number
}

// Helper function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return tempDiv.textContent || tempDiv.innerText || ''
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

  const getContentPreview = (content: { type: string; data: string }[]): string => {
    const textContent = content
      .filter(item => item.type === 'text')
      .map(item => stripHtmlTags(item.data)) // Strip HTML tags here
      .join(' ')

    const sentences = textContent.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0)
    if (sentences.length >= 3) {
      return sentences.slice(0, 3).join('. ').trim() + '.'
    } else if (sentences.length > 0) {
      return sentences.join('. ').trim() + '.'
    } else {
      return textContent.length > 120
        ? textContent.substring(0, 120).trim() + '...'
        : textContent
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="flex flex-col"
              >
                <div className="h-48 w-full overflow-hidden rounded-lg bg-gray-200 border border-gray-300">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => console.error(`Image load error for ${blog.title}:`, e)}
                  />
                </div>
                <div className="p-4 pt-0 pl-0">
                  <h3 className="text-md font-semibold text-gray-900 mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {getContentPreview(blog.content)}
                  </p>
                  <div className="mt-auto pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-600 mb-2">
                      {blog.formattedDate} • {blog.views} views
                    </p>
                    <Link
                      to={`/blog/${blog._id}`}
                      className="text-[#167AA1] text-sm font-medium hover:text-blue-800"
                      onClick={() => handleViewBlog(blog._id)}
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
