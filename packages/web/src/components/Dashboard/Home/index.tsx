// src/components/Dashboard/Home.tsx

import React from 'react'
import Stats from './Stats'
import RecentActivities from './RecentActivities'
import Notifications from './Notifications'
import QuickActions from './QuickActions'
import TasksOverview from './TasksOverview'

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="mb-6 text-3xl font-bold">Welcome to the Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Stats />
      </div>
      <RecentActivities />
      <Notifications />
      <QuickActions />
      <TasksOverview />
    </div>
  )
}

export default DashboardHome
