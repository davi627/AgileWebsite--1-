import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

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

// Helper function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return tempDiv.textContent || tempDiv.innerText || ''
}

export default function TopBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopBlogs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/blog/blogs/top`)
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const data = await response.json()
        if (Array.isArray(data)) {
          const sortedBlogs = data.sort((a: BlogPost, b: BlogPost) => b.views - a.views).slice(0, 6)
          setBlogs(sortedBlogs)
        } else {
          throw new Error('Invalid data format: Expected an array of blogs')
        }
      } catch (error) {
        console.error('Error fetching top blogs:', error)
        setError('Top Blogs Not Available. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchTopBlogs()
  }, [])

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

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <div className="mt-10 bg-gray-100 py-10 Poppins 4xl:ml-[40px] lg:ml-24">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-[#167AA1]">
          Top Most Viewed Blogs
        </h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="flex flex-col"
            >
              <div className="h-32 sm:h-40 md:h-48 w-full overflow-hidden rounded-lg bg-gray-200 border border-gray-300">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => console.error(`Image load error for ${blog.title}:`, e)}
                />
              </div>
              <div className="p-4 sm:p-4">
                <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {getContentPreview(blog.content)}
                </p>
                <Link
                  to={`/blog/${blog._id}`}
                  className="text-[#167AA1] text-sm font-medium hover:text-blue-800"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
