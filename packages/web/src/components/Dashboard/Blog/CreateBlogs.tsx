import React, { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { IBlog } from '../../../types/Blog'
import { createBlog, updateBlog } from '../../../services/BlogService'
import { useAuth } from '../../../context/AuthContext'

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  blogData?: IBlog | null
  onSave: (updatedBlog: IBlog) => void
}

const CreateBlogModal: React.FC<Props> = ({ isOpen, setIsOpen, blogData }) => {
  const { user } = useAuth()

  const [formData, setFormData] = useState<IBlog>({
    title: blogData?.title || '',
    author: blogData?.author || user?.name || '',
    content: blogData?.content || '',
    date: blogData?.date || '',
    tags: blogData?.tags || []
  })

  useEffect(() => {
    if (user && !blogData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        author: user.name
      }))
    }
  }, [user, blogData])

  const [errors, setErrors] = useState<Partial<IBlog>>({})

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value
    }))
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      tags: e.target.value.split(',').map((tag) => tag.trim())
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Reset errors
    setErrors({})

    // Log the form data for debugging
    console.log('Form Data:', formData)

    try {
      if (!formData.title) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          title: 'Title is required'
        }))
        return
      }

      if (!formData.author) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          author: 'Author is required'
        }))
        return
      }

      if (!formData.content) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          content: 'Content is required'
        }))
        return
      }

      if (!formData.date) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          date: 'Date is required'
        }))
        return
      }

      if (blogData && blogData._id) {
        console.log('Updating blog:', formData)
        await updateBlog(blogData._id, formData)
      } else {
        console.log('Creating blog:', formData)
        await createBlog(formData)
      }

      // Reset form data
      setFormData({
        title: '',
        author: user?.name || '',
        content: '',
        date: '',
        tags: []
      })

      // Close modal
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to create or update blog:', error)
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 sm:ml-4 sm:mt-0 sm:shrink-0 sm:grow">
                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Title
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="title"
                                id="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.title && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.title}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="content"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Content
                            </label>
                            <div className="mt-1">
                              <textarea
                                name="content"
                                id="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.content && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.content}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="date"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Date
                            </label>
                            <div className="mt-1">
                              <input
                                type="date"
                                name="date"
                                id="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.date && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.date}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="tags"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Tags (comma separated)
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="tags"
                                id="tags"
                                value={formData.tags?.join(', ') ?? ''}
                                onChange={handleTagsChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.tags && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.tags}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto"
                    >
                      {blogData ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default CreateBlogModal
