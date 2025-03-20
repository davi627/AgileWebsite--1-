import React from 'react'

const QuickActions: React.FC = () => {
  return (
    <div className="mt-6 rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
      <div className="flex space-x-4">
        <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Create New Post
        </button>
        <button className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
          Manage Users
        </button>
        <button className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
          View Reports
        </button>
      </div>
    </div>
  )
}

export default QuickActions
