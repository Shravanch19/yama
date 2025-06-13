"use client"
import React, { useState, useEffect } from 'react'
import DeadlineTaskCard from '@/components/ui/DeadlineTaskCard'
import TaskModal from '@/components/ui/TaskModal'
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal'

const TodoPage = () => {
  const [isLoading, setIsLoading] = useState({
    deadline: true,
    nonNegotiable: true,
    procrastinating: true
  });
  
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  
  const [tasks, setTasks] = useState({
    deadline: [],
    nonNegotiable: [],
    procrastinating: []
  });
  
  const [error, setError] = useState({
    deadline: null,
    nonNegotiable: null,
    procrastinating: null
  });
  
  const [modalOpen, setModalOpen] = useState({
    deadline: false,
    nonNegotiable: false,
    procrastinating: false
  });
  
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    taskId: null,
    taskType: null
  });

  // Function to add new task
  const addTask = async (type, task) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, task }),
      });

      if (!response.ok) throw new Error('Failed to add task');

      // Refresh tasks after adding
      fetchTasks(type);
    } catch (err) {
      setError(prev => ({ ...prev, [type]: err.message }));
    }
  };
  // Function to mark task as complete
  const completeTask = async (type, taskId) => {
    try {
      setLoadingTaskId(taskId);
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type, 
          taskId, 
          status: 'completed',
          // Add dailyComplete flag for non-negotiable tasks
          ...(type === 'nonNegotiable' ? { dailyComplete: true } : {})
        }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      // Refresh tasks after updating
      fetchTasks(type);
    } catch (err) {
      setError(prev => ({ ...prev, [type]: err.message }));
    } finally {
      setLoadingTaskId(null);
    }
  };

  const deleteTask = async (type, taskId) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      // Refresh tasks after deleting
      fetchTasks(type);
      setDeleteConfirm({ show: false, taskId: null, type: null });
    } catch (err) {
      setError(prev => ({ ...prev, [type]: err.message }));
    }
  };

  // Function to fetch tasks
  const fetchTasks = async (type) => {
    try {
      setIsLoading(prev => ({ ...prev, [type]: true }));
      const response = await fetch(`/api/tasks?type=${type}`);
      
      if (!response.ok) throw new Error(`Failed to fetch ${type} tasks`);

      const data = await response.json();
      setTasks(prev => ({ ...prev, [type]: data }));
      setError(prev => ({ ...prev, [type]: null }));
    } catch (err) {
      setError(prev => ({ ...prev, [type]: err.message }));
    } finally {
      setIsLoading(prev => ({ ...prev, [type]: false }));
    }
  };
  // Function to check if a non-negotiable task is completed for today
  const isCompletedForToday = (task) => {
    if (!task.dailyTracking || task.dailyTracking.length === 0) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEntry = task.dailyTracking.find(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });

    return todayEntry?.completed || false;
  };

  // Fetch all tasks on component mount
  useEffect(() => {
    fetchTasks('deadline');
    fetchTasks('nonNegotiable');
    fetchTasks('procrastinating');
  }, []);

  return (
    <main className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-purple-300 mb-8">📋 Task Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Deadline Tasks Section */}
          <section className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-pink-300">🛑 Deadline Tasks</h2>
              <button
                onClick={() => setModalOpen(prev => ({ ...prev, deadline: true }))}
                className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-lg hover:bg-pink-500/30 transition-colors flex items-center gap-2 group"
              >
                <span>Add Task</span>
                <span className="group-hover:rotate-90 transition-transform duration-300">+</span>
              </button>
            </div>
            <div className="space-y-4">
              {isLoading.deadline ? (
                <p className="text-gray-400">Loading deadline tasks...</p>
              ) : error.deadline ? (
                <p className="text-red-400">{error.deadline}</p>
              ) : tasks.deadline.length === 0 ? (
                <p className="text-gray-400">No deadline tasks</p>
              ) : (
                tasks.deadline.map((task, index) => (
                  <div key={index} className="relative group">
                    <DeadlineTaskCard task={task} />
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">                      <button
                        onClick={() => completeTask('deadline', task._id)}
                        disabled={loadingTaskId === task._id}
                        className="p-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition-colors disabled:opacity-50"
                      >
                        {loadingTaskId === task._id ? (
                          <span className="inline-block animate-spin">↻</span>
                        ) : (
                          '✓'
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ show: true, taskId: task._id, taskType: 'deadline' })}
                        className="p-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Non-Negotiable Tasks Section */}
          <section className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-cyan-300">💪 Non-Negotiable</h2>
              <button
                onClick={() => setModalOpen(prev => ({ ...prev, nonNegotiable: true }))}
                className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center gap-2 group"
              >
                <span>Add Task</span>
                <span className="group-hover:rotate-90 transition-transform duration-300">+</span>
              </button>
            </div>
            <div className="space-y-4">
              {isLoading.nonNegotiable ? (
                <p className="text-gray-400">Loading non-negotiable tasks...</p>
              ) : error.nonNegotiable ? (
                <p className="text-red-400">{error.nonNegotiable}</p>              ) : tasks.nonNegotiable.length === 0 ? (
                <p className="text-gray-400">No non-negotiable tasks</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4 text-sm border-b border-gray-700 pb-3">
                    <span className="text-gray-400">Daily Progress</span>
                    <div className="flex gap-2 items-center">
                      <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-500"
                          style={{ 
                            width: `${(tasks.nonNegotiable.filter(t => isCompletedForToday(t)).length / tasks.nonNegotiable.length) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-green-400">{tasks.nonNegotiable.filter(t => isCompletedForToday(t)).length}</span>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-300">{tasks.nonNegotiable.length}</span>
                    </div>
                  </div>
                  {tasks.nonNegotiable.map((task, index) => {
                    const todayTracking = task.dailyTracking?.find(d => {
                        const trackDate = new Date(d.date);
                        const today = new Date();
                        return trackDate.toDateString() === today.toDateString();
                    });
                    
                    return (
                      <div
                        key={task._id || index}
                        className="bg-gray-700/50 rounded-lg p-4 flex items-center justify-between gap-4 group hover:bg-gray-700 transition-colors relative"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className={`text-cyan-100 ${todayTracking?.completed ? 'line-through text-cyan-300/50' : ''}`}>
                            {task.title}
                          </span>
                          {todayTracking?.completed && (
                            <span className="text-xs text-green-400 px-2 py-1 bg-green-400/10 rounded">✓ Done today</span>
                          )}
                          <span className="text-xs text-gray-500">
                            {task.dailyTracking?.filter(d => d.completed).length || 0} days completed
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {!todayTracking?.completed && (
                            <button
                              onClick={() => completeTask('nonNegotiable', task._id)}
                              disabled={loadingTaskId === task._id}
                              className="px-3 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
                            >
                              {loadingTaskId === task._id ? (
                                <span className="inline-block animate-spin">↻</span>
                              ) : (
                                <>✓ Mark Done</>
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirm({ show: true, taskId: task._id, taskType: 'nonNegotiable' })}
                            className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Procrastinating Tasks Section */}
          <section className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-red-300">🕒 Procrastinating</h2>
              <button
                onClick={() => setModalOpen(prev => ({ ...prev, procrastinating: true }))}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2 group"
              >
                <span>Add Task</span>
                <span className="group-hover:rotate-90 transition-transform duration-300">+</span>
              </button>
            </div>
            <div className="space-y-4">
              {isLoading.procrastinating ? (
                <p className="text-gray-400">Loading procrastinating tasks...</p>
              ) : error.procrastinating ? (
                <p className="text-red-400">{error.procrastinating}</p>
              ) : tasks.procrastinating.length === 0 ? (
                <p className="text-gray-400">No procrastinating tasks</p>
              ) : (
                tasks.procrastinating.map((task, index) => (
                  <div
                    key={index}
                    className="bg-gray-700/50 rounded-lg p-4 flex items-center justify-between gap-4 group hover:bg-gray-700 transition-colors relative"
                  >
                    <span className="text-red-100">{task.title}</span>
                    <div className="flex items-center gap-2">
                      <button                        onClick={() => completeTask('procrastinating', task._id)}
                        disabled={loadingTaskId === task._id}
                        className="px-3 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50 flex items-center gap-1"
                      >
                        {loadingTaskId === task._id ? (
                          <span className="inline-block animate-spin">↻</span>
                        ) : (
                          <>✓ Complete</>
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ show: true, taskId: task._id, taskType: 'procrastinating' })}
                        className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Task Modals */}
        <TaskModal
          isOpen={modalOpen.deadline}
          onClose={() => setModalOpen(prev => ({ ...prev, deadline: false }))}
          onSubmit={(task) => addTask('deadline', task)}
          type="deadline"
        />
        <TaskModal
          isOpen={modalOpen.nonNegotiable}
          onClose={() => setModalOpen(prev => ({ ...prev, nonNegotiable: false }))}
          onSubmit={(task) => addTask('nonNegotiable', task)}
          type="nonNegotiable"
        />
        <TaskModal
          isOpen={modalOpen.procrastinating}
          onClose={() => setModalOpen(prev => ({ ...prev, procrastinating: false }))}
          onSubmit={(task) => addTask('procrastinating', task)}
          type="procrastinating"
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteConfirm.show}
          onClose={() => setDeleteConfirm({ show: false, taskId: null, taskType: null })}
          onConfirm={deleteTask}
          taskType={deleteConfirm.taskType}
        />
      </div>
    </main>
  );
};

export default TodoPage;