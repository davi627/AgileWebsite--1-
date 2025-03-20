import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Navigation/Sidebar'
import TopBar from './Topbar'
import AccessDenied from '../AccessDenied'
import { User } from '../../types/User'
import { isAuthenticated } from '../../services/AuthService'
import { fetchUserProfile } from '../../services/UserService'
import Loader from '../Loader'

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await fetchUserProfile()
        setUser(profile)
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
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

  if (!user) {
    return <AccessDenied />
  }

  return (
    <div>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:pl-72">
        <TopBar setSidebarOpen={setSidebarOpen} />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
