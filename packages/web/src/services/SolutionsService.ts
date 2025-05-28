import axios from 'axios'
import { Solution } from '../types/Solutions'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://webtest-api.agilebiz.co.ke:5000'

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

const handleApiError = (error: unknown): void => {
  if (axios.isAxiosError(error)) {
    console.error('API error:', error.response?.data?.message)
  } else {
    console.error('Unexpected error:', error)
  }
}

export const fetchSolutions = async (
  isPrimary?: boolean
): Promise<Solution[]> => {
  try {
    const response = await axios.get<Solution[]>(`${API_BASE_URL}/solutions`, {
      params: { isPrimary },
      headers: getAuthHeaders()
    })
    return response.data
  } catch (error) {
    handleApiError(error)
    return []
  }
}

export const fetchSolutionById = async (ids: string[]): Promise<Solution[]> => {
  try {
    const response = await axios.get<Solution[]>(`${API_BASE_URL}/solutions`, {
      params: { ids },
      headers: getAuthHeaders()
    })
    return response.data
  } catch (error) {
    handleApiError(error)
    return []
  }
}

export const fetchSolutionBySlug = async (
  slug: string
): Promise<Solution | null> => {
  try {
    const response = await axios.get<Solution>(
      `${API_BASE_URL}/solutions/slug/${slug}`,
      {
        headers: getAuthHeaders()
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error)
    return null
  }
}

export const createSolution = async (
  solution: Solution
): Promise<Solution | null> => {
  try {
    const response = await axios.post<Solution>(
      `${API_BASE_URL}/solutions`,
      solution,
      {
        headers: getAuthHeaders()
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error)
    return null
  }
}

export const updateSolution = async (
  slug: string,
  solution: Solution
): Promise<Solution | null> => {
  try {
    const response = await axios.put<Solution>(
      `${API_BASE_URL}/solutions/${slug}`,
      solution,
      {
        headers: getAuthHeaders()
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error)
    return null
  }
}

export const deleteSolution = async (slug: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/solutions/${slug}`, {
      headers: getAuthHeaders()
    })
    return true
  } catch (error) {
    handleApiError(error)
    return false
  }
}
