import React from 'react'

const TasksOverview: React.FC = () => {
  const tasks = [
    { title: 'Review new user registrations', status: 'Pending' },
    { title: 'Update privacy policy', status: 'In Progress' },
    { title: 'Backup database', status: 'Completed' }
  ]

  return (
    <div className="mt-6 rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-lg font-semibold">Tasks Overview</h2>
      <ul className="list-inside list-disc">
        {tasks.map((task, index) => (
          <li key={index} className="text-gray-700">
            {task.title} -{' '}
            <span
              className={`font-bold ${
                task.status === 'Pending'
                  ? 'text-red-600'
                  : task.status === 'In Progress'
                    ? 'text-yellow-600'
                    : 'text-green-600'
              }`}
            >
              {task.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TasksOverview
