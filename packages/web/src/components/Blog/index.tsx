import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://webtest-api.agilebiz.co.ke:5000'

interface BlogPost {
  _id: string
  title: string
  content: { type: string; data: string }[]
  imageUrl: string
  formattedDate: string
  author: { name: string }
  views: number
}

// Utility function to strip HTML tags and get plain text
const stripHtml = (html: string) => {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

export default function TopBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopBlogs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/blog/blogs/top`)
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`)

        const data: BlogPost[] = await response.json()
        setBlogs(data)
      } catch (error) {
        console.error('Error fetching top blogs:', error)
        setError('Top Blogs Not Available. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchTopBlogs()
  }, [])

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <div className="mt-10 bg-gray-100 py-10 Poppins">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Top Most Viewed Blogs
        </h2>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {blogs.map((blog) => {
            // Find the first text content item
            const textContentItem = blog.content.find(item => item.type === 'text')
            const rawContent = textContentItem ? textContentItem.data : ''

            // Strip HTML tags and get plain text
            const plainText = stripHtml(rawContent)

            // Get the first paragraph or first 60 characters
            const firstParagraph = plainText.split('\n')[0]
            const previewText = firstParagraph.length > 60
              ? firstParagraph.substring(0, 60) + '...'
              : firstParagraph

            return (
              <article
                key={blog._id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-105 transition-transform"
              >
                <div className="h-32">
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
                    By: {blog.author.name} • {blog.views || 0} views
                  </p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2 whitespace-pre-line">
                    {previewText}
                  </p>
                  <Link
                    to={`/blog/${blog._id}`}
                    className="text-primary text-xs font-medium mt-2 inline-block"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
