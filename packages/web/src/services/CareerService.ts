import axios from 'axios'
import { Career } from '../types/Career'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://webtest-api.agilebiz.co.ke:5000/api'

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    console.error('API error:', error.response?.data?.message)
    throw new Error(error.response?.data?.message || 'An error occurred')
  } else {
    console.error('Unexpected error:', error)
    throw new Error('An unexpected error occurred')
  }
}

export const fetchCareers = async (): Promise<Career[]> => {
  try {
    const response = await axios.get<Career[]>(`${API_BASE_URL}/careers`)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
  return Promise.reject(new Error('An unexpected error occurred'))
}

export const fetchPublishedCareers = async (): Promise<Career[]> => {
  try {
    const response = await axios.get<Career[]>(`${API_BASE_URL}/careers`)

    const publishedCareers = response.data.filter((career) => career.published)

    return publishedCareers
  } catch (error) {
    handleApiError(error)
  }
  return Promise.reject(new Error('An unexpected error occurred'))
}

export const fetchCareerById = async (id: string): Promise<Career> => {
  try {
    const response = await axios.get<Career>(`${API_BASE_URL}/careers/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
  return Promise.reject(new Error('An unexpected error occurred'))
}

export const createCareer = async (career: Career): Promise<Career> => {
  try {
    const response = await axios.post<Career>(
      `${API_BASE_URL}/careers`,
      career,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
  return Promise.reject(new Error('An unexpected error occurred'))
}

export const updateCareer = async (
  id: string,
  career: Career
): Promise<Career> => {
  try {
    const response = await axios.put<Career>(
      `${API_BASE_URL}/careers/${id}`,
      career,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
  return Promise.reject(new Error('An unexpected error occurred'))
}

export const deleteCareer = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/careers/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  } catch (error) {
    handleApiError(error)
  }
}

export const toggleCareerPublish = async (id: string): Promise<Career> => {
  try {
    const response = await axios.post<Career>(
      `${API_BASE_URL}/careers/${id}/publish`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
  return Promise.reject(new Error('An unexpected error occurred'))
}
