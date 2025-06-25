/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://webtest-api.agilebiz.co.ke:5000/api'

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    console.error('API error:', error.response?.data?.message)
    throw new Error(error.response?.data?.message || 'An error occurred')
  } else {
    console.error('Unexpected error:', error)
    throw new Error('An unexpected error occurred')
  }
}

/**
 * Function to upload a file to the backend for Cloudinary upload
 * @param file - The file to upload (from a file input or drag-and-drop)
 * @param folder - Optional: the folder in Cloudinary where the file will be stored
 * @returns The uploaded file URL
 */
export const uploadFile = async (
  file: File,
  folder?: string
): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    if (folder) formData.append('folder', folder)

    const response = await axios.post(
      `${API_BASE_URL}/files/upload`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    return response.data.url // Assuming the backend responds with the file URL
  } catch (error) {
    handleApiError(error)
  }

  return Promise.reject(
    new Error('An unexpected error occurred during file upload')
  )
}
