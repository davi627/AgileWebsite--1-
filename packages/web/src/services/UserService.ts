import axios from 'axios'
import { User } from '../types/User'

// Define the base URL for the API
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Define a type for user roles
type Role = 'Admin' | 'User'

// Centralized error handling function
const handleApiError = (error: unknown): { message: string } => {
  if (axios.isAxiosError(error)) {
    console.error('API error:', error.response?.data?.message)
    return { message: error.response?.data?.message || 'An error occurred' }
  } else {
    console.error('Unexpected error:', error)
    return { message: 'An unexpected error occurred' }
  }
}

// Check if the token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch (error) {
    console.error('Failed to parse token:', error)
    return true
  }
}

// Refresh the token if it's expired
const refreshToken = async (): Promise<string> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken: localStorage.getItem('refreshToken')
    })
    localStorage.setItem('token', response.data.token)
    return response.data.token
  } catch (error) {
    handleApiError(error)
    throw new Error('Failed to refresh token')
  }
}

// Get the token, refreshing it if necessary
const getToken = async (): Promise<string> => {
  let token = localStorage.getItem('token')
  if (token && isTokenExpired(token)) {
    token = await refreshToken()
  }
  if (!token) {
    throw new Error('No token available')
  }
  return token
}

// Reusable function to get authorization headers
const getAuthHeaders = async (): Promise<{ headers: { Authorization: string } }> => {
  const token = await getToken()
  return {
    headers: { Authorization: `Bearer ${token}` }
  }
}

// Create a new user
export const createUser = async (user: User): Promise<User> => {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.post<User>(`${API_BASE_URL}/users`, user, headers)
    return response.data
  } catch (error) {
    const { message } = handleApiError(error)
    throw new Error(message)
  }
}

// Update an existing user
export const updateUser = async (id: string, user: User): Promise<User> => {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.put<User>(`${API_BASE_URL}/users/${id}`, user, headers)
    return response.data
  } catch (error) {
    const { message } = handleApiError(error)
    throw new Error(message)
  }
}

// Fetch the current user's profile
export const fetchUserProfile = async (): Promise<User> => {
  try {
    const response = await axios.get<User>(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch user profile')
  }
}

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.get<User[]>(`${API_BASE_URL}/users`, headers)
    return response.data
  } catch (error) {
    const { message } = handleApiError(error)
    throw new Error(message)
  }
}

// Fetch a user by ID
export const fetchUserById = async (id: string): Promise<User> => {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.get<User>(`${API_BASE_URL}/users/${id}`, headers)
    return response.data
  } catch (error) {
    const { message } = handleApiError(error)
    throw new Error(message)
  }
}

// Fetch a user by email
export const fetchUserByEmail = async (email: string): Promise<User> => {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.get<User>(
      `${API_BASE_URL}/users/email/${email}`,
      headers
    )
    return response.data
  } catch (error) {
    const { message } = handleApiError(error)
    throw new Error(message)
  }
}

// Fetch a user's role by ID
export const fetchUserRole = async (id: string): Promise<Role> => {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.get<Role>(
      `${API_BASE_URL}/users/${id}/role`,
      headers
    )
    return response.data
  } catch (error) {
    const { message } = handleApiError(error)
    throw new Error(message)
  }
}

// Delete a user by ID
export const deleteUser = async (id: string): Promise<void> => {
  try {
    const headers = await getAuthHeaders()
    await axios.delete(`${API_BASE_URL}/users/${id}`, headers)
  } catch (error) {
    const { message } = handleApiError(error)
    throw new Error(message)
  }
}