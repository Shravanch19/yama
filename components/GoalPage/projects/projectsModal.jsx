"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const ModuleForm = ({ module, index, updateModule, removeModule }) => {
  const [showTasks, setShowTasks] = useState(false);

  const addTask = () => {
    const updatedTasks = [...module.tasks, {
      title: "",
      description: "",
      status: "Pending",
      priority: "Medium",
      dueDate: ""
    }];
    updateModule(index, { ...module, tasks: updatedTasks });
  };

  const updateTask = (taskIndex, field, value) => {
    const updatedTasks = module.tasks.map((task, i) => 
      i === taskIndex ? { ...task, [field]: value } : task
    );
    updateModule(index, { ...module, tasks: updatedTasks });
  };

  const removeTask = (taskIndex) => {
    const updatedTasks = module.tasks.filter((_, i) => i !== taskIndex);
    updateModule(index, { ...module, tasks: updatedTasks });
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-purple-200">Module {index + 1}</h3>
        <button
          type="button"
          onClick={() => removeModule(index)}
          className="text-red-400 hover:text-red-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-purple-200 text-sm mb-1">Module Name</label>
          <input
            type="text"
            value={module.name}
            onChange={(e) => updateModule(index, { ...module, name: e.target.value })}
            className="w-full p-2 rounded bg-gray-600 text-purple-100"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-purple-200 text-sm mb-1">Start Date</label>
            <input
              type="date"
              value={module.startDate || ""}
              onChange={(e) => updateModule(index, { ...module, startDate: e.target.value })}
              className="w-full p-2 rounded bg-gray-600 text-purple-100"
            />
          </div>
          <div>
            <label className="block text-purple-200 text-sm mb-1">End Date</label>
            <input
              type="date"
              value={module.endDate || ""}
              onChange={(e) => updateModule(index, { ...module, endDate: e.target.value })}
              className="w-full p-2 rounded bg-gray-600 text-purple-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-purple-200 text-sm mb-1">Status</label>
          <select
            value={module.status}
            onChange={(e) => updateModule(index, { ...module, status: e.target.value })}
            className="w-full p-2 rounded bg-gray-600 text-purple-100"
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowTasks(!showTasks)}
            className="text-purple-300 hover:text-purple-200 text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showTasks ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="ml-1">Tasks ({module.tasks.length})</span>
          </button>
        </div>

        {showTasks && (
          <div className="space-y-3 pt-2">
            {module.tasks.map((task, taskIndex) => (
              <div key={taskIndex} className="bg-gray-600 p-3 rounded">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-medium text-purple-200">Task {taskIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeTask(taskIndex)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => updateTask(taskIndex, "title", e.target.value)}
                    placeholder="Task title"
                    className="w-full p-2 rounded bg-gray-700 text-purple-100 text-sm"
                    required
                  />
                  <textarea
                    value={task.description}
                    onChange={(e) => updateTask(taskIndex, "description", e.target.value)}
                    placeholder="Task description"
                    className="w-full p-2 rounded bg-gray-700 text-purple-100 text-sm"
                    rows="2"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={task.priority}
                      onChange={(e) => updateTask(taskIndex, "priority", e.target.value)}
                      className="p-2 rounded bg-gray-700 text-purple-100 text-sm"
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                    </select>
                    <input
                      type="date"
                      value={task.dueDate}
                      onChange={(e) => updateTask(taskIndex, "dueDate", e.target.value)}
                      className="p-2 rounded bg-gray-700 text-purple-100 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addTask}
              className="text-sm text-purple-300 hover:text-purple-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Add_Project = ({ isOpen, setIsOpen, existingProject, onSave }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    
    const [form, setForm] = useState({
        title: "",
        description: "",
        startDate: format(new Date(), 'yyyy-MM-dd'),
        deadline: "",
        status: "Planning",
        progress: [0],
        modules: [],
        notes: ""
    });

    // Initialize form when editing an existing project
    useEffect(() => {
        if (existingProject) {
            setForm({
                title: existingProject.title,
                description: existingProject.description,
                startDate: format(new Date(existingProject.startDate), 'yyyy-MM-dd'),
                deadline: format(new Date(existingProject.deadline), 'yyyy-MM-dd'),
                status: existingProject.status,
                modules: existingProject.modules || [],
                progress: existingProject.progress,
                notes: existingProject.notes || ""
            });
        }
    }, [existingProject]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addModule = () => {
        setForm(prev => ({
            ...prev,
            modules: [...prev.modules, {
                name: "",
                status: "Not Started",
                progress: 0,
                startDate: "",
                endDate: "",
                tasks: []
            }]
        }));
    };

    const updateModule = (index, updatedModule) => {
        setForm(prev => ({
            ...prev,
            modules: prev.modules.map((module, i) => 
                i === index ? updatedModule : module
            )
        }));
    };

    const removeModule = (index) => {
        setForm(prev => ({
            ...prev,
            modules: prev.modules.filter((_, i) => i !== index)
        }));
    };

    const handleExit = () => {
        setForm({
            title: "",
            description: "",
            startDate: format(new Date(), 'yyyy-MM-dd'),
            deadline: "",
            status: "Planning",
            progress: [0],
            modules: [],
            notes: ""
        });
        setError(null);
        setIsOpen(false);
    };

    const validateForm = () => {
        if (!form.title.trim()) return "Project title is required";
        if (!form.description.trim()) return "Project description is required";
        if (!form.deadline) return "Project deadline is required";
        if (new Date(form.deadline) < new Date(form.startDate)) {
            return "Deadline cannot be earlier than start date";
        }
        if (form.modules.length === 0) return "At least one module is required";
        
        for (const module of form.modules) {
            if (!module.name.trim()) return "All modules must have a name";
            if (module.endDate && module.startDate && new Date(module.endDate) < new Date(module.startDate)) {
                return `Module "${module.name}" end date cannot be earlier than start date`;
            }
            for (const task of module.tasks) {
                if (!task.title.trim()) return "All tasks must have a title";
            }
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    ...form, 
                    task: existingProject ? 'updateProject' : 'addProject',
                    projectId: existingProject?._id 
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                handleExit();
                onSave?.(); // Call the onSave callback to refresh the projects list
            } else {
                throw new Error(data.message || `Error ${existingProject ? 'updating' : 'creating'} project`);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return (
        <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow transition-colors"
            onClick={() => setIsOpen(true)}
        >
            Add Project
        </button>
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-800 rounded-lg shadow-lg border border-purple-600 w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <form onSubmit={handleSubmit} className="h-full">
                    <div className="p-6 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-purple-300">
                                {existingProject ? 'Edit Project' : 'Add Project'}
                            </h2>
                            <button
                                type="button"
                                className="text-purple-200 hover:text-purple-400 transition-colors"
                                onClick={handleExit}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-500">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-purple-200 mb-2" htmlFor="title">
                                        Project Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full p-2 rounded bg-gray-700 text-purple-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-purple-200 mb-2" htmlFor="status">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="w-full p-2 rounded bg-gray-700 text-purple-100"
                                    >
                                        <option value="Planning">Planning</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-purple-200 mb-2" htmlFor="description">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded bg-gray-700 text-purple-100"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-purple-200 mb-2" htmlFor="startDate">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={form.startDate}
                                        onChange={handleChange}
                                        className="w-full p-2 rounded bg-gray-700 text-purple-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-purple-200 mb-2" htmlFor="deadline">
                                        Deadline *
                                    </label>
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={form.deadline}
                                        onChange={handleChange}
                                        className="w-full p-2 rounded bg-gray-700 text-purple-100"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-purple-200 mb-2" htmlFor="notes">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded bg-gray-700 text-purple-100"
                                    rows="3"
                                    placeholder="Add any additional notes about the project..."
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-purple-200">Project Modules *</label>
                                    <button
                                        type="button"
                                        onClick={addModule}
                                        className="text-sm text-purple-300 hover:text-purple-200 flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Add Module
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {form.modules.map((module, index) => (
                                        <ModuleForm
                                            key={index}
                                            module={module}
                                            index={index}
                                            updateModule={updateModule}
                                            removeModule={removeModule}
                                        />
                                    ))}
                                    {form.modules.length === 0 && (
                                        <p className="text-gray-500 text-sm">No modules added yet. Click "Add Module" to create one.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-700">
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleExit}
                                className="px-4 py-2 text-purple-300 hover:text-purple-200 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded shadow transition-colors disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {existingProject ? 'Updating Project...' : 'Creating Project...'}
                                    </span>
                                ) : (
                                    existingProject ? 'Update Project' : 'Create Project'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Add_Project;