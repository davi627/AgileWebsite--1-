import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../../services/AuthService'
import agile from '../../assets/agilebiz_logo.png'

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<string>('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!role) {
        setError('Please select a role')
        return
      }

      try {
        await register(firstName, lastName, email, password, role)
        navigate('/login')
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('An unexpected error occurred')
        }
      }
    },
    [firstName, lastName, email, password, role, navigate]
  )

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-10 w-auto"
          src={agile}
          alt="agileAgileBiz Logo"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-red-500">{error}</p>}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Select Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-primary focus:border-primary sm:text-sm"
                required
              >
                <option value="">-- Select a Role --</option>
                <option value="Admin">Administrator</option>
                <option value="User">User</option>
              </select>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="bg-primary w-full rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-alternate"
              >
                Register
              </button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-primary font-semibold hover:text-alternate"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  )
}

export default Register
