import React, { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Career } from '../../../types/Career'
import { createCareer, updateCareer } from '../../../services/CareerService'

interface FormData {
  title: string
  slug: string
  description: string
  salary: number
  published: boolean
  department: string
  dueDate: string 
}

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  careerToEdit?: Career | null
  onSave?: (career: Career) => void
}

const CreateCareer: React.FC<Props> = ({ isOpen, setIsOpen, careerToEdit }) => {
  const [formData, setFormData] = useState<FormData>({
    title: careerToEdit?.title || '',
    slug: careerToEdit?.slug || '',
    description: careerToEdit?.description || '',
    salary: careerToEdit?.salary || 0,
    published: careerToEdit?.published || false,
    department: careerToEdit?.department || '',
    dueDate: careerToEdit?.dueDate
      ? careerToEdit.dueDate.toISOString().split('T')[0]
      : ''
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    const newValue = type === 'checkbox' ? checked : value

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setErrors({})

    try {
      if (!formData.title) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          title: 'Title is required'
        }))
        return
      }

      const careerData: Career = {
        id: careerToEdit?.id || '', // Ensure id is always defined
        ...formData,
        postedAt: careerToEdit?.postedAt || new Date(), // Ensure postedAt is always defined
        dueDate: new Date(formData.dueDate) // Convert dueDate from string to Date
      }

      if (careerToEdit) {
        await updateCareer(careerToEdit.id, careerData)
      } else {
        await createCareer(careerData)
      }

      setFormData({
        title: '',
        slug: '',
        description: '',
        salary: 0,
        published: false,
        department: '',
        dueDate: ''
      })

      setIsOpen(false)
    } catch (error) {
      console.error('Failed to create or update career:', error)
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
                          <div>
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

                          {/* Other input fields for slug, description, salary, published, department, dueDate */}
                          <div>
                            <label
                              htmlFor="slug"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Slug
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="slug"
                                id="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.slug && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.slug}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="description"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Description
                            </label>
                            <div className="mt-1">
                              <textarea
                                name="description"
                                id="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.description && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="salary"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Salary
                            </label>
                            <div className="mt-1">
                              <input
                                type="number"
                                name="salary"
                                id="salary"
                                value={formData.salary}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.salary && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.salary}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="published"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Published
                            </label>
                            <div className="mt-1">
                              <input
                                type="checkbox"
                                name="published"
                                id="published"
                                checked={formData.published}
                                onChange={handleInputChange}
                                className="size-4 rounded border-gray-300 text-primary focus:ring-indigo-500"
                              />
                              {errors.published && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.published}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="department"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Department
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="department"
                                id="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.department && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.department}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="dueDate"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Due Date
                            </label>
                            <div className="mt-1">
                              <input
                                type="date"
                                name="dueDate"
                                id="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.dueDate && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.dueDate}
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
                      {careerToEdit ? 'Update' : 'Create'}
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

export default CreateCareer
