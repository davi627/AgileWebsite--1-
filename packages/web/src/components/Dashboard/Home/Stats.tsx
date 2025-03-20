import React from 'react'

const Stats: React.FC = () => {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-lg font-semibold">Statistics</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="stat rounded bg-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-600">Users</h3>
          <p className="text-2xl font-bold">1,234</p>
        </div>
        <div className="stat rounded bg-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-600">Posts</h3>
          <p className="text-2xl font-bold">567</p>
        </div>
        <div className="stat rounded bg-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-600">Comments</h3>
          <p className="text-2xl font-bold">2,345</p>
        </div>
      </div>
    </div>
  )
}

export default Stats
