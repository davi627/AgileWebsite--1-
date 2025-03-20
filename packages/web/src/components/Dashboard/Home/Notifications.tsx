import React from 'react'

const Notifications: React.FC = () => {
  const notifications = [
    'Your password will expire in 5 days.',
    'New user registration pending approval.',
    'System maintenance scheduled for tomorrow.'
  ]

  return (
    <div className="mt-6 rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-lg font-semibold">Notifications</h2>
      <ul className="list-inside list-disc">
        {notifications.map((notification, index) => (
          <li key={index} className="text-gray-700">
            {notification}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Notifications
