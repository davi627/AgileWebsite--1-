import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../services/AuthService'
import agile from '../../assets/agilebiz_logo.png'
const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('stephen.okwemba@agilebiz.co.ke')
  const [password, setPassword] = useState<string>('@Stephen2024!')
  const [role, setRole] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [step, setStep] = useState<'role' | 'credentials'>('role')
  const navigate = useNavigate()

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole)
    setStep('credentials')
  }

  const handleBackToRoleSelection = () => {
    setStep('role')
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!role) {
        setError('Please select a role first')
        return
      }

      try {
        const { token, userRole } = await login(email, password, role)
        localStorage.setItem('token', token)
        localStorage.setItem('userRole', userRole)

        // Navigate to the dashboard
        navigate('/dashboard')
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('An unexpected error occurred')
        }
      }
    },
    [email, password, role, navigate]
  )

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-10 w-auto"
          src={agile}
          alt="AgileBiz Logo"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {step === 'role' ? 'Select your role' : 'Sign in to your account'}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {step === 'role' ? (
            // Role selection screen
            <div className="space-y-6">
              <p className="text-center text-sm text-gray-600">
                Please select your role to continue
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelect('User')}
                  className="bg-primary flex justify-center rounded-md px-3 py-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  User
                </button>
                <button
                  onClick={() => handleRoleSelect('Admin')}
                  className="bg-primary flex justify-center rounded-md px-3 py-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Administrator
                </button>
              </div>
            </div>
          ) : (
            // Login form
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="mb-4 flex items-center">
                <button
                  type="button"
                  onClick={handleBackToRoleSelection}
                  className="text-sm text-gray-500 hover:text-indigo-500"
                >
                  ← Back to role selection
                </button>
                <div className="ml-auto px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  Role: {role === 'Admin' ? 'Administrator' : 'User'}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:ring-primary block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-primary block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="text-primary focus:ring-primary size-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <a
                    href="#"
                    className="text-primary font-semibold hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="text-sm leading-6">
                  <a
                    href="/register"
                    className="text-primary font-semibold hover:text-indigo-500"
                  >
                    Register
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="bg-primary focus-visible:outline-primary flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login