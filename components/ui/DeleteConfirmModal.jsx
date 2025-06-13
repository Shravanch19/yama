import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, taskType }) => {
  if (!isOpen) return null;

  const getColor = (type) => {
    switch (type) {
      case 'deadline':
        return 'pink';
      case 'nonNegotiable':
        return 'cyan';
      case 'procrastinating':
        return 'red';
      default:
        return 'gray';
    }
  };

  const color = getColor(taskType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-xl">
        <h3 className={`text-xl font-semibold text-${color}-300 mb-4`}>
          Delete Task
        </h3>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete this task? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors bg-${color}-600 hover:bg-${color}-700`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
