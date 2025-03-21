import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Login, Register } from '../components/Authentication'
import Landing from '../components/Landing'
import Careers from '../components/Careers'
import NotFound from '../components/NotFound'
import AccessDenied from '../components/AccessDenied'
import DynamicPage from '../components/DynamicPages'
import Solutions from 'components/Dashboard/Solutions'
import AboutUsPage from 'components/About'
import ContactUsPage from 'components/Contact'
import Loader from 'components/Loader'
import Dashboard from '../components/Dashboard'
import AdminDashboard from 'components/AdminDashboard/AdminDashboard'
import Blogs from 'components/Blogs/Blogs'
import UserDashboard from 'components/UserDashboard/UserDashboard'
import { isAuthenticated, getUserRole } from 'services/AuthService'
import AllCommentsPage from 'components/AllComments/AllComments'

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Loader />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path='/dashboard' element={<AdminDashboard/>}/>
          <Route path='/all-comments' element={<AllCommentsPage />} />

          {/* Protected Routes */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default AppRouter