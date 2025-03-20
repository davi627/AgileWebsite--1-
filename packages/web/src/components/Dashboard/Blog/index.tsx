import React, { useEffect, useState } from 'react'
import { fetchBlogs, deleteBlog } from '../../../services/BlogService'
import { IBlog } from '../../../types/Blog'
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid'
import BlogSlideOver from './CreateBlogs'

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([])
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<IBlog | null>(null)

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const blogsData = await fetchBlogs()
        setBlogs(blogsData)
      } catch (error) {
        console.error('Failed to fetch blogs:', error)
      }
    }

    getBlogs()
  }, [])

  const handleDelete = async (blogId: string) => {
    try {
      await deleteBlog(blogId)
      setBlogs(blogs.filter((blog) => blog._id !== blogId))
    } catch (error) {
      console.error('Failed to delete blog:', error)
    }
  }

  const handleEdit = (blog: IBlog) => {
    setEditingBlog(blog)
    setIsSlideOverOpen(true)
  }

  const handleSave = (updatedBlog: IBlog) => {
    if (editingBlog) {
      setBlogs(
        blogs.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog))
      )
    } else {
      setBlogs([...blogs, updatedBlog])
    }
    setIsSlideOverOpen(false)
    setEditingBlog(null)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Blogs
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            List of all the blogs. You can add, edit, or delete blogs.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="bg-primary block rounded px-8 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => setIsSlideOverOpen(true)}
          >
            Add Blog
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur sm:pl-6 lg:pl-8"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur sm:table-cell"
                  >
                    Author
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur lg:table-cell"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog, blogIdx) => (
                  <tr key={blog._id}>
                    <td
                      className={classNames(
                        blogIdx !== blogs.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                      )}
                    >
                      {blog.title}
                    </td>
                    <td
                      className={classNames(
                        blogIdx !== blogs.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'
                      )}
                    >
                      {blog.author}
                    </td>
                    <td
                      className={classNames(
                        blogIdx !== blogs.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                      )}
                    >
                      {blog.date}
                    </td>
                    <td
                      className={classNames(
                        blogIdx !== blogs.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                      )}
                    >
                      <button
                        type="button"
                        className="text-primary hover:text-indigo-900"
                        onClick={() => handleEdit(blog)}
                      >
                        <PencilIcon className="size-4" aria-hidden="true" />
                        <span className="sr-only">Edit, {blog.title}</span>
                      </button>
                      <button
                        type="button"
                        className="text-primary ml-4 hover:text-indigo-900"
                        onClick={() => handleDelete(blog._id ?? '')}
                      >
                        <TrashIcon className="size-4" aria-hidden="true" />
                        <span className="sr-only">Delete, {blog.title}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <BlogSlideOver
        isOpen={isSlideOverOpen}
        setIsOpen={setIsSlideOverOpen}
        blogData={editingBlog}
        onSave={handleSave}
      />
    </div>
  )
}

export default Blogs
