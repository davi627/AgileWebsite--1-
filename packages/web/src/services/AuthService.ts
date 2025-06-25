import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://webtest-api.agilebiz.co.ke:5000/api'

// Define response and payload interfaces
export interface LoginResponse {
  token: string
  userRole: string
}

export interface RegisterResponse {
  message: string
}

interface LoginPayload {
  email: string
  password: string
  role: string
}

interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
}

interface DecodedToken {
  id: string
  role: string
  exp: number
}

interface AuthenticatedUser {
  id: string
  email: string
  password: string
  name: string
}

// Centralized error handling function
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    console.error('API error:', error.response?.data?.error || error.message)
    throw new Error(error.response?.data?.error || 'An error occurred')
  } else {
    console.error('Unexpected error:', error)
    throw new Error('An unexpected error occurred')
  }
}

// Login function
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const payload: LoginPayload = { email, password, role: 'Admin' }

  try {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/login`,
      payload,
      { withCredentials: true }
    )
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('userRole', response.data.userRole)
    return response.data
  } catch (error) {
    return handleApiError(error)
  }
}

// Register function
export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: string
): Promise<RegisterResponse> => {
  const payload: RegisterPayload = {
    firstName,
    lastName,
    email,
    password,
    role
  }

  try {
    const response = await axios.post<RegisterResponse>(
      `${API_BASE_URL}/register`,
      payload
    )
    return response.data
  } catch (error) {
    return handleApiError(error)
  }
}

// Get the authenticated user's role
export const getUserRole = (): string | null => {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const decoded = jwtDecode<DecodedToken>(token)
    return decoded.role
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

// Fetch the authenticated user's profile
export const getAuthenticatedUser = async (): Promise<AuthenticatedUser> => {
  try {
    const response = await axios.get<AuthenticatedUser>(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    return response.data
  } catch (error) {
    return handleApiError(error)
  }
}

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token')
  if (!token) return false

  try {
    const decoded = jwtDecode<DecodedToken>(token)
    return decoded.exp * 1000 > Date.now()
  } catch (error) {
    console.error('Failed to decode token:', error)
    return false
  }
}

// Sign out the user
export const signOut = (navigate: (path: string) => void): void => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  navigate('/')
}
