import React from 'react';

const TaskModal = ({ isOpen, onClose, onSubmit, type }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const task = {
      title: formData.get('title'),
      deadline: formData.get('deadline') || null
    };
    onSubmit(task);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-semibold ${
            type === 'deadline' ? 'text-pink-300' :
            type === 'nonNegotiable' ? 'text-cyan-300' :
            'text-red-300'
          }`}>
            Add {type === 'deadline' ? 'Deadline' :
                 type === 'nonNegotiable' ? 'Non-Negotiable' :
                 'Procrastinating'} Task
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter task title..."
            />
          </div>

          {type === 'deadline' && (
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-300 mb-1">
                Deadline
              </label>
              <input
                type="datetime-local"
                id="deadline"
                name="deadline"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
                type === 'deadline' ? 'bg-pink-600 hover:bg-pink-700' :
                type === 'nonNegotiable' ? 'bg-cyan-600 hover:bg-cyan-700' :
                'bg-red-600 hover:bg-red-700'
              }`}
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
