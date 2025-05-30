"use client";
import React from 'react'
import Add_Project from './projectsModal';

const ProjectsUI = () => {

  const projects = []

  return (
    <section className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-600">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-purple-300">Projects</h2>
        <Add_Project />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="bg-gray-700 p-5 rounded-xl border border-gray-600">
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <progress value={project.progress} max="100" className="w-full h-2 mb-2" />
            <div className="mb-2">
              <p className="text-sm text-purple-300">Stage: {project.stage}</p>
            </div>
            <div className="text-purple-100 mb-2 container mx-auto bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-medium">{Object.keys(project.modules)[0]}</h4>
              {Object.values(project.modules)[0]}
            </div>
            <div className="flex gap-2 mt-2">
              <button className="bg-purple-700 hover:bg-purple-800 px-3 py-1 rounded">Next</button>
              <button className="border border-purple-500 px-3 py-1 rounded">Details</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProjectsUI