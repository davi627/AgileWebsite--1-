import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import agile from '../../assets/agilebiz_logo.png'
import axios from 'axios'


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://webtest-api.agilebiz.co.ke:5000';

const Reset: React.FC = () => {
  const [email, setEmail] = useState<string>('stephen.okwemba@agilebiz.co.ke')
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/forgot-password`, {
        email,
      });
  
      if (response.data.success) {
        navigate('/login');
        alert('Reset password link sent to your email.');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('An error occurred while sending reset password link.');
      console.error(error);
    }
  };
  

 

  

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-10 w-auto"
          src={agile}
          alt="AgileBiz Logo"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Input Email
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit} >
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
            <div className="flex items-center justify-between">
              

              <div className="text-sm leading-6">
                <a
                  href="/login"
                  className="text-primary font-semibold hover:text-indigo-500"
                >
                  Submit
                </a>
              </div>
             
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Reset