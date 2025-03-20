import React, { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../services/AuthService'
import { fetchUserProfile } from '../services/UserService'
import { User } from '../types/User'
import Loader from '../components/Loader'

interface PrivateRouteProps {
  children: ReactNode
  requiredRoles?: string[]
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredRoles
}) => {
  const location = useLocation()
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await fetchUserProfile()
        setUser(profile)
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        // Fallback to localStorage role if fetch fails
        const userRole = localStorage.getItem('userRole')
        if (userRole) {
          setUser({ role: userRole } as User)
        }
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated()) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRoles && !requiredRoles.includes(user?.role || '')) {
    console.error('Access denied for role:', user?.role)
    return <Navigate to="/access-denied" replace />
  }

  return <>{children}</>
}

export default PrivateRoute