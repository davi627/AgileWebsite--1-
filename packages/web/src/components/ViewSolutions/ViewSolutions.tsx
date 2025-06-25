import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SecurityKeyModal from 'components/SercurityKeyModal/SercurityKeyModal'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://webtest-api.agilebiz.co.ke:5000'
const ViewSolutions: React.FC = () => {
  const [solutions, setSolutions] = useState<{ _id: string; title: string }[]>(
    []
  )
  const [isSecurityKeyModalOpen, setIsSecurityKeyModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<() => void>(() => {})

  const validateSecurityKey = async (key: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/validate-security-key`,
        { key }
      )
      return response.data.isValid
    } catch (error) {
      console.error('Failed to validate security key:', error)
      return false
    }
  }

  const handleActionWithSecurityKey = (action: () => void) => {
    setPendingAction(() => action)
    setIsSecurityKeyModalOpen(true)
  }

  // Fetch solutions from the backend
  const fetchSolutions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/solns/solution`)
      setSolutions(response.data)
    } catch (error) {
      console.error('Failed to fetch solutions:', error)
      alert('Failed to fetch solutions. Please try again.')
    }
  }

  // Handle delete action with security key
  const handleDelete = async (solutionId: string) => {
    const action = async () => {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/solns/solution/${solutionId}`
        )
        if (response.status === 200) {
          alert('Solution deleted successfully!')
          fetchSolutions()
        }
      } catch (error) {
        console.error('Failed to delete solution:', error)
        alert('Failed to delete solution. Please try again.')
      }
    }

    handleActionWithSecurityKey(action)
  }

  // Fetch solutions on component mount
  useEffect(() => {
    fetchSolutions()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">View Solutions</h2>
      <div className="space-y-4">
        {solutions.length === 0 ? (
          <p className="text-gray-700">No solutions found.</p>
        ) : (
          solutions.map((solution) => (
            <div
              key={solution._id}
              className="flex justify-between items-center p-4 border border-gray-300 rounded-md"
            >
              <h3 className="text-lg font-semibold">{solution.title}</h3>
              <button
                onClick={() => handleDelete(solution._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <SecurityKeyModal
        isOpen={isSecurityKeyModalOpen}
        onClose={() => setIsSecurityKeyModalOpen(false)}
        onValidate={async (key) => {
          const isValid = await validateSecurityKey(key)
          if (isValid) {
            pendingAction()
          }
          return isValid
        }}
      />
    </div>
  )
}

export default ViewSolutions
