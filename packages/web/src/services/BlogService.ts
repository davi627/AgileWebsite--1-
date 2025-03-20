import axios from 'axios'
import { IBlog } from '../types/Blog'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    console.error('API error:', error.response?.data?.message)
    throw new Error(error.response?.data?.message || 'An error occurred')
  } else {
    console.error('Unexpected error:', error)
    throw new Error('An unexpected error occurred')
  }
}

export const createBlog = async (blog: IBlog): Promise<IBlog> => {
  try {
    const response = await axios.post<IBlog>(`${API_BASE_URL}/blogs`, blog, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
  return Promise.reject(new Error('An unexpected error occurred'))
}

export const updateBlog = async (id: string, blog: IBlog): Promise<IBlog> => {
  try {
    const response = await axios.put<IBlog>(
      `${API_BASE_URL}/blogs/${id}`,
      blog,
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

export const fetchBlogs = async (): Promise<IBlog[]> => {
  try {
    const response = await axios.get<IBlog[]>(`${API_BASE_URL}/blogs`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
  return Promise.reject(new Error('An unexpected error occurred'))
}

export const fetchBlogById = async (id: string): Promise<IBlog> => {
  try {
    const response = await axios.get<IBlog>(`${API_BASE_URL}/blogs/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
  return Promise.reject(new Error('An unexpected error occurred'))
}

export const deleteBlog = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/blogs/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  } catch (error) {
    handleApiError(error)
  }
}
