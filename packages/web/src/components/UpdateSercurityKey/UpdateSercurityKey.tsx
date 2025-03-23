import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const UpdateSecurityKey: React.FC = () => {
  const [newKey, setNewKey] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newKey || newKey.length !== 4) {
      setMessage('Security key must be 4 digits.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/update-security-key`, { newKey });
      if (response.data.success) {
        setMessage('Security key updated successfully!');
        setNewKey('');
      } else {
        setMessage('Failed to update security key. Please try again.');
      }
    } catch (error) {
      console.error('Error updating security key:', error);
      setMessage('Failed to update security key. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto"> {/* Added max-w-md and mx-auto */}
      <h2 className="text-2xl font-bold mb-6">Update Security Key</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">New Security Key</label>
          <input
            type="password"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter new 4-digit security key"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-200 w-full sm:w-auto"
        >
          Update Security Key
        </button>
        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
};

export default UpdateSecurityKey;