// src/context/AuthContext.tsx

import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  isAuthenticated,
  signOut as logoutService,
  getAuthenticatedUser
} from '../services/AuthService'

interface AuthContextProps {
  isAuthenticated: boolean
  user: { id: string; name: string; email: string } | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {}
})

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated())
  const [user, setUser] = useState<{
    id: string
    name: string
    email: string
  } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      if (authenticated) {
        const user = await getAuthenticatedUser()
        setUser(user)
      } else {
        setUser(null)
      }
    }

    fetchUser()
  }, [authenticated])

  const login = (token: string) => {
    localStorage.setItem('token', token)
    setAuthenticated(true)
  }

  const logout = () => {
    logoutService(navigate)
    setAuthenticated(false)
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: authenticated, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }

export const useAuth = () => useContext(AuthContext)
