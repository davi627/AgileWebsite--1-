// @ts-nocheck
import React, { useEffect, useState } from 'react'
import {
  fetchSolutions,
  deleteSolution,
  createSolution,
  updateSolution
} from '../../../services/SolutionsService'
import { Solution } from '../../../types/Solutions'
import {
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/20/solid'
import SolutionForm from './SolutionsForm'
import ImageUploader from '../../../components/ImageUploader'
import Loader from '../../../components/Loader'

const Solutions: React.FC = () => {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [expandedSolution, setExpandedSolution] = useState<string | null>(null)
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)

  useEffect(() => {
    const getSolutions = async () => {
      setLoading(true)
      try {
        const solutionsData = await fetchSolutions()
        setSolutions(solutionsData)
      } catch (error) {
        console.error('Failed to fetch solutions:', error)
      } finally {
        setLoading(false)
      }
    }

    getSolutions()
  }, [])

  const handleDelete = async () => {
    if (!confirmDelete) return

    try {
      await deleteSolution(confirmDelete)
      setSolutions(
        solutions.filter((solution) => solution._id !== confirmDelete)
      )
      setConfirmDelete(null)
    } catch (error) {
      console.error('Failed to delete solution:', error)
    }
  }

  const toggleExpand = (solutionId: string = '') => {
    setExpandedSolution(expandedSolution === solutionId ? null : solutionId)
  }

  const handleEdit = (solution: Solution) => {
    setEditingSolution(solution)
    setImageUrl(solution.icon || '')
    setIsFormOpen(true) // Set isFormOpen to true
  }

  const handleAdd = () => {
    setEditingSolution(null)
    setImageUrl('')
    setIsFormOpen(true) // Set isFormOpen to true
  }

  const handleSave = async (solution: Solution) => {
    try {
      if (editingSolution) {
        // Update an existing solution
        await updateSolution(solution._id ?? '', {
          ...solution,
          icon: imageUrl
        })
      } else {
        // Exclude _id for creation
        const { _id, ...solutionData } = solution
        await createSolution({ ...solutionData, icon: imageUrl })
      }
      const solutionsData = await fetchSolutions()
      setSolutions(solutionsData)
      setEditingSolution(null)
      setIsFormOpen(false) // Set isFormOpen to false
    } catch (error) {
      console.error('Failed to save solution:', error)
    }
  }

  const handleImageUploadSuccess = (url: string) => {
    setImageUrl(url)
  }

  const handleCancel = () => {
    setEditingSolution(null)
    setIsFormOpen(false) // Set isFormOpen to false
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Solutions
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your solutions. You can add, edit, or delete them.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="bg-primary focus-visible:outline-primary block rounded px-8 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={handleAdd}
          >
            Add Solution
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 flex items-center justify-center">
          <Loader /> {/* Use the loader component */}
        </div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full table-auto overflow-hidden rounded-lg bg-white shadow-lg">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="border-b py-4 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="hidden border-b px-3 py-4 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                      Description
                    </th>
                    <th className="hidden border-b px-3 py-4 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {solutions.map((solution) => (
                    <React.Fragment key={solution._id}>
                      <tr className="transition-colors duration-200 ease-in-out hover:bg-gray-50">
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          <button
                            type="button"
                            onClick={() => toggleExpand(solution._id ?? '')}
                            className="flex items-center"
                          >
                            {solution.name}
                            {expandedSolution === solution._id ? (
                              <ChevronUpIcon
                                className="ml-2 size-5 text-gray-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <ChevronDownIcon
                                className="ml-2 size-5 text-gray-500"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        </td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                          {solution.description}
                        </td>
                        <td className="py-4 pr-4 text-right">
                          <button
                            type="button"
                            className="text-primary hover:text-indigo-900"
                            onClick={() => handleEdit(solution)}
                          >
                            <PencilIcon className="size-5" aria-hidden="true" />
                            <span className="sr-only">
                              Edit, {solution.name}
                            </span>
                          </button>
                          <button
                            type="button"
                            className="ml-4 text-red-600 hover:text-red-900"
                            onClick={() => setConfirmDelete(solution._id ?? '')}
                          >
                            <TrashIcon className="size-5" aria-hidden="true" />
                            <span className="sr-only">
                              Delete, {solution.name}
                            </span>
                          </button>
                        </td>
                      </tr>
                      {expandedSolution === solution._id &&
                        solution.children?.map((child) => (
                          <tr key={child} className="bg-gray-50">
                            <td className="whitespace-nowrap py-4 pl-12 pr-3 text-sm font-medium text-gray-900">
                              {child}
                            </td>
                            <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                              {child}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right">
                              <button
                                type="button"
                                className="text-primary hover:text-indigo-900"
                                onClick={() => handleEdit(child as Solution)}
                              >
                                <PencilIcon
                                  className="size-5"
                                  aria-hidden="true"
                                />
                                <span className="sr-only">Edit, {child}</span>
                              </button>
                              <button
                                type="button"
                                className="ml-4 text-red-600 hover:text-red-900"
                                onClick={() =>
                                  setConfirmDelete(child as unknown as string)
                                }
                              >
                                <TrashIcon
                                  className="size-5"
                                  aria-hidden="true"
                                />
                                <span className="sr-only">Delete, {child}</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="flex min-h-screen items-center justify-center px-4 text-center sm:block sm:p-0">
            <div className="inline-block overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <SolutionForm
                solution={editingSolution}
                onSave={handleSave}
                onCancel={handleCancel}
              />
              <div className="mt-4">
                <label className="mb-1 block text-sm font-semibold">Icon</label>
                <ImageUploader
                  onUploadSuccess={handleImageUploadSuccess}
                  folder="solution-icons"
                  maxFileSizeMB={10}
                  uploadPreset="your-upload-preset"
                  cloudName="your-cloud-name"
                />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Solution Icon Preview"
                    className="mt-2 max-h-40 w-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="rounded-md bg-white p-6 text-center shadow-md">
            <h2 className="mb-4 text-lg font-bold">Confirm Deletion</h2>
            <p>Are you sure you want to delete this solution?</p>
            <div className="mt-4 space-x-4">
              <button
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Solutions
