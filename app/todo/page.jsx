"use client";
import React, { useState, useEffect } from 'react';
// import DeadlineTaskCard from '@/components/ui/DeadlineTaskCard';
import TaskModal from '@/components/ui/TaskModal';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';
import { formatDistanceToNow, isBefore } from 'date-fns';


const TASK_TYPES = ['deadline', 'nonNegotiable', 'procrastinating'];

const TodoPage = () => {
  const [tasks, setTasks] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [error, setError] = useState({});
  const [modalOpen, setModalOpen] = useState({});
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, taskId: null, taskType: null });

  useEffect(() => {
    TASK_TYPES.forEach(type => fetchTasks(type));
  }, []);

  const fetchTasks = async (type) => {
    setIsLoading(prev => ({ ...prev, [type]: true }));
    try {
      const res = await fetch(`/api/tasks?type=${type}`);
      if (!res.ok) throw new Error(`Failed to fetch ${type} tasks`);
      const data = await res.json();
      setTasks(prev => ({ ...prev, [type]: data }));
      setError(prev => ({ ...prev, [type]: null }));
    } catch (err) {
      setError(prev => ({ ...prev, [type]: err.message }));
    } finally {
      setIsLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleTaskChange = async (type, method, body, callback) => {
    try {
      setLoadingTaskId(body.taskId || null);
      const res = await fetch('/api/tasks' + (method === 'DELETE' ? `?id=${body.taskId}` : ''), {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'DELETE' ? JSON.stringify({ type, ...body }) : undefined,
      });
      if (!res.ok) throw new Error(`${method} task failed`);
      fetchTasks(type);
      if (callback) callback();
    } catch (err) {
      setError(prev => ({ ...prev, [type]: err.message }));
    } finally {
      setLoadingTaskId(null);
    }
  };

  const renderTaskCard = (type, task, index) => {
    const completedToday = task.isCompletedForToday;

    if (type === 'deadline') {
      return (
        <DeadlineTaskCard
          key={task._id || index}
          task={task}
          type={type}
          isCompletedForToday={completedToday}
          onComplete={() => handleTaskChange(type, 'PUT', { taskId: task._id, status: 'completed' })}
          onDelete={() => setDeleteConfirm({ show: true, taskId: task._id, taskType: type })}
          loadingTaskId={loadingTaskId}
        />
      );
    }

    return (
      <div
        key={task._id || index}
        className="bg-gray-700/50 rounded-lg p-4 flex items-center justify-between gap-4 group hover:bg-gray-700 transition-colors relative"
      >
        <div className="flex items-center gap-3 flex-1">
          <span className={`text-${type === 'nonNegotiable' ? 'cyan' : 'red'}-100 ${completedToday ? 'line-through text-opacity-50' : ''}`}>{task.title}</span>
          {completedToday && <span className="text-xs text-green-400 px-2 py-1 bg-green-400/10 rounded">✓ Done today</span>}
          {type === 'nonNegotiable' && <span className="text-xs text-gray-500">{task.daysCompleted || 0} days completed</span>}
        </div>
        <div className="flex items-center gap-2">
          {!completedToday && (
            <button
              onClick={() => handleTaskChange(type, 'PUT', { taskId: task._id, status: 'completed', ...(type === 'nonNegotiable' && { dailyComplete: true }) })}
              disabled={loadingTaskId === task._id}
              className="px-3 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
            >
              {loadingTaskId === task._id ? <span className="inline-block animate-spin">↻</span> : <>✓ Complete</>}
            </button>
          )}
          <button
            onClick={() => setDeleteConfirm({ show: true, taskId: task._id, taskType: type })}
            className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors opacity-0 group-hover:opacity-100"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  const Section = ({ type, title, color }) => (
    <section className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-semibold text-${color}-300`}>{title}</h2>
        <button
          onClick={() => setModalOpen(prev => ({ ...prev, [type]: true }))}
          className={`px-4 py-2 bg-${color}-500/20 text-${color}-300 rounded-lg hover:bg-${color}-500/30 flex items-center gap-2 group`}
        >
          <span>Add Task</span><span className="group-hover:rotate-90 transition-transform">+</span>
        </button>
      </div>
      <div className="space-y-4">
        {isLoading[type] ? (
          <p className="text-gray-400">Loading...</p>
        ) : error[type] ? (
          <p className="text-red-400">{error[type]}</p>
        ) : !tasks[type]?.length ? (
          <p className="text-gray-400">No tasks</p>
        ) : (
          tasks[type].map((task, index) => renderTaskCard(type, task, index))
        )}
      </div>
    </section>
  );

  return (
    <main className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-purple-300 mb-8">📋 Task Management</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Section type="deadline" title="🛑 Deadline Tasks" color="pink" />
          <Section type="nonNegotiable" title="💪 Non-Negotiable" color="cyan" />
          <Section type="procrastinating" title="🕒 Procrastinating" color="red" />
        </div>

        {TASK_TYPES.map(type => (
          <TaskModal
            key={type}
            isOpen={modalOpen[type]}
            onClose={() => setModalOpen(prev => ({ ...prev, [type]: false }))}
            onSubmit={task => handleTaskChange(type, 'POST', { task })}
            type={type}
          />
        ))}

        <DeleteConfirmModal
          isOpen={deleteConfirm.show}
          onClose={() => setDeleteConfirm({ show: false, taskId: null, taskType: null })}
          onConfirm={() => handleTaskChange(deleteConfirm.taskType, 'DELETE', { taskId: deleteConfirm.taskId }, () => setDeleteConfirm({ show: false, taskId: null, taskType: null }))}
          taskType={deleteConfirm.taskType}
        />
      </div>
    </main>
  );
};

export default TodoPage;

const DeadlineTaskCard = ({ task, onComplete, onDelete, loadingTaskId }) => {
  const [completed, setCompleted] = useState(false);

  // Use derived fields from backend
  const isOverdue = task.isOverdue;
  const timeRemaining = task.timeRemaining;
  const urgencyColor = task.urgencyColor;

  const toggleLocalComplete = () => setCompleted(!completed);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-4 shadow-lg hover:shadow-xl transition group relative">
      <div className="flex items-start justify-between">
        <h3 className={`text-lg font-semibold tracking-wide ${completed ? 'line-through text-gray-500' : 'text-white'}`}>
          {task.title}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onComplete}
            disabled={loadingTaskId === task._id}
            className="p-1 text-green-300 rounded hover:bg-green-500/20 transition-opacity opacity-0 group-hover:opacity-100"
          >
            {loadingTaskId === task._id ? <span className="inline-block animate-spin">↻</span> : '✓'}
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-300 rounded hover:bg-red-500/20 transition-opacity opacity-0 group-hover:opacity-100"
          >
            ×
          </button>
        </div>
      </div>

      <div className={`text-xs px-3 py-1 rounded-full font-medium self-start mt-2 w-fit ${urgencyColor}`}>
        {isOverdue ? '⚠️ Overdue' : `⏳ Due ${timeRemaining}`}
      </div>
    </div>
  );
};
