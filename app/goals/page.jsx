import React from 'react'
import ProjectsUI from '@/components/GoalPage/projects/projectsUI'
import HealthUI from '@/components/GoalPage/health/healthUI'
import LearningUI from '@/components/GoalPage/learnings/learningUI'

const GoalsPage = () => {

  return (
    <div className="container mx-auto px-6 py-12 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white my-10 shadow-2xl border border-gray-700 flex flex-col gap-12">
      {/* <HealthUI /> */}
      <ProjectsUI />
      <LearningUI />
    </div>
  )
}

export default GoalsPage
