import React, { useState, useCallback } from 'react';
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

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // Use derived fields from backend
  const currentModule = project.currentModule;
  // Remove calculateDaysRemaining and use project.daysRemaining
  
  const updateProgress = useCallback(async (projectId, moduleIndex, taskIndex, isChecked) => {
    try {
      setIsLoading(true);
      const updatedProject = { ...project };
      const module = updatedProject.modules[moduleIndex];
      const task = module.tasks[taskIndex];

      // Update task status
      task.status = isChecked ? 'Done' : 'Pending';

      // Update module progress and status
      const completedTasks = module.tasks.filter(t => t.status === 'Done');
      module.progress = Math.round((completedTasks.length / module.tasks.length) * 100);
      
      // Update module status
      if (module.progress === 100) {
        module.status = 'Completed';
      } else if (module.progress === 0) {
        module.status = 'Planning';
      } else {
        module.status = 'In Progress';
      }

      // Update overall project progress
      updatedProject.progress = Math.round(
        updatedProject.modules.reduce((acc, mod) => acc + mod.progress, 0) / updatedProject.modules.length
      );

      // Update project status based on modules
      const allModules = updatedProject.modules;
      if (allModules.every(mod => mod.status === 'Completed')) {
        updatedProject.status = 'Completed';
      } else if (allModules.some(mod => mod.status === 'In Progress')) {
        updatedProject.status = 'In Progress';
      } else if (allModules.every(mod => mod.status === 'Planning')) {
        updatedProject.status = 'Planning';
      } else {
        updatedProject.status = 'In Progress';
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({updatedProject, task: 'updateProgress'}),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      // Update the currentModule reference
      project.modules = updatedProject.modules;
      project.status = updatedProject.status;
      project.progress = updatedProject.progress;
      
    } catch (error) {
      console.error('Error updating progress:', error);
      // Revert the checkbox state
      const checkbox = document.querySelector(`#task-${projectId}-${moduleIndex}-${taskIndex}`);
      if (checkbox) checkbox.checked = !isChecked;
    } finally {
      setIsLoading(false);
    }
  }, [project]);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/projects', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId: project._id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      onDelete();
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
         role="article"
         aria-label={`Project: ${project.title}`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-purple-200 group-hover:text-purple-600 transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 group-hover:line-clamp-none transition-all">
              {project.description}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[project.status]} transition-colors`}>
            {project.status}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="w-20 h-20 transition-transform hover:scale-105">
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
              <span className={`${project.daysRemaining < 7 ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'} transition-colors`}>
                {format(new Date(project.deadline), 'MMM dd, yyyy')}
                <span className="ml-2 text-xs">
                  ({project.daysRemaining} days left)
                </span>
              </span>
            </div>
          </div>
        </div>

        {currentModule && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 transform transition-all duration-300 hover:scale-[1.02]">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-purple-200">Current Module: {currentModule.name}</h4>
              <span className="text-sm text-gray-600 dark:text-gray-300">{currentModule.progress}% Complete</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-700 ease-in-out"
                style={{ width: `${currentModule.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50"
            disabled={isLoading}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
          <button
            onClick={() => onEdit(project)}
            className="flex-1 border border-purple-500 text-purple-500 hover:bg-purple-500/10 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50"
            disabled={isLoading}
          >
            Edit Project
          </button>
          {showDeleteConfirm ? (
            <>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
                disabled={isLoading}
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 disabled:opacity-50"
                disabled={isLoading}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 border border-red-500 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
              disabled={isLoading}
            >
              Delete Project
            </button>
          )}
        </div>

        <div className={`mt-4 space-y-4 transition-all duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          <div className="border-t dark:border-gray-700 pt-4">
            <h4 className="font-semibold text-gray-900 dark:text-purple-200 mb-2">All Modules</h4>
            <div className="space-y-3">
              {project.modules?.map((module, moduleIndex) => (
                <div 
                  key={moduleIndex} 
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 transform transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 dark:text-purple-200">{module.name}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                      {module.status}
                    </span>
                  </div>
                  {module.tasks?.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {module.tasks.map((task, taskIndex) => (
                        <div 
                          key={taskIndex} 
                          className="flex items-center justify-between text-sm bg-white dark:bg-gray-800 p-2 rounded transform transition-all duration-300 hover:scale-[1.01]"
                        >
                          <div className="flex items-center flex-1">
                            <input
                              id={`task-${project._id}-${moduleIndex}-${taskIndex}`}
                              type="checkbox"
                              checked={task.status === 'Done'}
                              onChange={(e) => {
                                updateProgress(project._id, moduleIndex, taskIndex, e.target.checked);
                              }}
                              disabled={isLoading}
                              className="mr-2 accent-purple-600 w-4 h-4 rounded cursor-pointer focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                            />
                            <label 
                              htmlFor={`task-${project._id}-${moduleIndex}-${taskIndex}`}
                              className={`cursor-pointer select-none ${task.status === 'Done' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}
                            >
                              {task.title}
                            </label>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]} transition-colors`}>
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
      </div>
    </div>
  );
};

export default ProjectCard;