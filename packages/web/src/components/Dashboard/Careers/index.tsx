import React, { useEffect, useState } from 'react'
import {
  fetchPublishedCareers,
  createCareer,
  updateCareer,
  deleteCareer
} from '../../../services/CareerService'
import { Career } from '../../../types/Career'
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid'
import CareerSlideOver from './CreateCareer'

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

const CareersDashboard: React.FC = () => {
  const [careers, setCareers] = useState<Career[]>([])
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [editingCareer, setEditingCareer] = useState<Career | null>(null)

  useEffect(() => {
    const getCareers = async () => {
      try {
        const careersData = await fetchPublishedCareers()
        setCareers(careersData)
      } catch (error) {
        console.error('Failed to fetch careers:', error)
      }
    }

    getCareers()
  }, [])

  const handleDelete = async (careerId: string) => {
    try {
      await deleteCareer(careerId)
      setCareers(careers.filter((career) => career.id !== careerId))
    } catch (error) {
      console.error('Failed to delete career:', error)
    }
  }

  const handleEdit = (career: Career) => {
    setEditingCareer(career)
    setIsSlideOverOpen(true)
  }

  const handleSave = async (updatedCareer: Career) => {
    try {
      if (editingCareer) {
        const savedCareer = await updateCareer(updatedCareer.id, updatedCareer)
        setCareers(
          careers.map((c) => (c.id === savedCareer.id ? savedCareer : c))
        )
      } else {
        const createdCareer = await createCareer(updatedCareer)
        setCareers([...careers, createdCareer])
      }

      setIsSlideOverOpen(false)
      setEditingCareer(null)
    } catch (error) {
      console.error('Failed to save career:', error)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Careers
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage job openings. You can add, edit, or delete careers.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="bg-primary block rounded px-8 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => setIsSlideOverOpen(true)}
          >
            Add Career
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
                    Department
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
                {careers.map((career, careerIdx) => (
                  <tr key={career.id}>
                    <td
                      className={classNames(
                        careerIdx !== careers.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                      )}
                    >
                      {career.title}
                    </td>
                    <td
                      className={classNames(
                        careerIdx !== careers.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'
                      )}
                    >
                      {career.department}
                    </td>
                    <td
                      className={classNames(
                        careerIdx !== careers.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                      )}
                    >
                      <button
                        type="button"
                        className="text-primary hover:text-indigo-900"
                        onClick={() => handleEdit(career)}
                      >
                        <PencilIcon className="size-4" aria-hidden="true" />
                        <span className="sr-only">Edit {career.title}</span>
                      </button>
                      <button
                        type="button"
                        className="text-primary ml-4 hover:text-indigo-900"
                        onClick={() => handleDelete(career.id)}
                      >
                        <TrashIcon className="size-4" aria-hidden="true" />
                        <span className="sr-only">Delete {career.title}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CareerSlideOver
        isOpen={isSlideOverOpen}
        setIsOpen={setIsSlideOverOpen}
        careerToEdit={editingCareer}
        onSave={handleSave}
      />
    </div>
  )
}

export default CareersDashboard
