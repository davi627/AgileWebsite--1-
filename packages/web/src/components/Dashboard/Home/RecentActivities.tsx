import React from 'react'

const RecentActivities: React.FC = () => {
  const activities = [
    'User John Doe logged in',
    'New post created by Jane Smith',
    'Comment added by Mike Johnson',
    'User Sarah Connor updated profile'
  ]

  return (
    <div className="mt-6 rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-lg font-semibold">Recent Activities</h2>
      <ul className="list-inside list-disc">
        {activities.map((activity, index) => (
          <li key={index} className="text-gray-700">
            {activity}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentActivities
