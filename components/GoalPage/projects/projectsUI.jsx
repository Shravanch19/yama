"use client";
import React, { useState, useEffect } from 'react'
import Add_Project from './projectsModal';

const ProjectsUI = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        const data = await response.json();
        
        // Ensure we have an array of projects
        setProjects(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-600">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-purple-300">Projects</h2>
        <Add_Project />
      </div>      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-8">
            <div className="animate-pulse text-purple-300">Loading projects...</div>
          </div>
        ) : error ? (
          <div className="col-span-3 text-center py-8">
            <div className="text-red-400">{error}</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-3 text-center py-8">
            <div className="text-purple-300">No projects found. Create your first project!</div>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="bg-gray-700 p-5 rounded-xl border border-gray-600 hover:border-purple-500 transition-colors">
              <h3 className="text-xl font-semibold mb-2 text-purple-200">{project.title}</h3>
              <p className="text-sm text-gray-300 mb-3 line-clamp-2">{project.description}</p>
              
              <div className="relative pt-1 mb-4">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-200 bg-purple-900">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-purple-200">
                      {project.progress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-900">
                  <div
                    style={{ width: `${project.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-purple-300">Status: {project.status}</p>
                <p className="text-sm text-purple-300">
                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                </p>
              </div>

              {project.modules && project.modules.length > 0 && (
                <div className="text-purple-100 mb-4 bg-gray-800 p-3 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Current Module:</h4>
                  <p className="text-xs">{project.modules[0].name}</p>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <button className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm transition-colors">
                  Update Progress
                </button>
                <button className="border border-purple-500 hover:bg-purple-500/10 px-3 py-1 rounded text-sm transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default ProjectsUI