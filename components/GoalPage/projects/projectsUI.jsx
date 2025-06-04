"use client";
import React, { useState, useEffect } from 'react';
import Add_Project from './projectsModal';
import { format } from 'date-fns';
import CircularProgress from '@/components/ui/CircularProgress';

const statusColors = {
  'Planning': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'On Hold': 'bg-gray-100 text-gray-800',
  'Completed': 'bg-green-100 text-green-800'
};

const priorityColors = {
  'Low': 'bg-blue-100 text-blue-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'High': 'bg-red-100 text-red-800'
};

const ProjectCard = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentModule = project.modules?.find(m => m.status === 'In Progress') || project.modules?.[0];
  
  const calculateDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-purple-200">{project.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{project.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="w-20 h-20">
            <CircularProgress
              name={project.title}
              progress={project.progress || 0}
              sz={80}
            />
          </div>
          <div className="flex-1 ml-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-300">Started:</span>
              <span className="text-gray-900 dark:text-gray-100">{format(new Date(project.startDate), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Deadline:</span>
              <span className={`${calculateDaysRemaining(project.deadline) < 7 ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'}`}>
                {format(new Date(project.deadline), 'MMM dd, yyyy')}
                <span className="ml-2 text-xs">
                  ({calculateDaysRemaining(project.deadline)} days left)
                </span>
              </span>
            </div>
          </div>
        </div>

        {currentModule && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-purple-200">Current Module: {currentModule.name}</h4>
              <span className="text-sm text-gray-600 dark:text-gray-300">{currentModule.progress}% Complete</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${currentModule.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
          <button
            className="flex-1 border border-purple-500 text-purple-500 hover:bg-purple-500/10 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Edit Project
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div className="border-t dark:border-gray-700 pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-purple-200 mb-2">All Modules</h4>
              <div className="space-y-3">
                {project.modules?.map((module, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 dark:text-purple-200">{module.name}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                        {module.status}
                      </span>
                    </div>
                    {module.tasks?.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {module.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="flex items-center justify-between text-sm bg-white dark:bg-gray-800 p-2 rounded">
                            <span className="text-gray-900 dark:text-gray-100">{task.title}</span>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}>
                                {task.priority}
                              </span>
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {task.dueDate ? format(new Date(task.dueDate), 'MMM dd') : 'No due date'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {project.notes && (
              <div className="border-t dark:border-gray-700 pt-4">
                <h4 className="font-semibold text-gray-900 dark:text-purple-200 mb-2">Notes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{project.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

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
    <section className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-purple-300">Projects</h2>
        <Add_Project />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-8">
            <div className="animate-pulse text-gray-600 dark:text-purple-300">Loading projects...</div>
          </div>
        ) : error ? (
          <div className="col-span-2 text-center py-8">
            <div className="text-red-500">{error}</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            <div className="text-gray-600 dark:text-purple-300">No projects found. Create your first project!</div>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        )}
      </div>
    </section>
  );
};

export default ProjectsUI;