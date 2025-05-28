"use client";
import React, { useState } from 'react';
import { formatDistanceToNow, isBefore } from 'date-fns';

const DeadlineTaskCard = ({ task }) => {
  const [completed, setCompleted] = useState(false);

  const deadlineDate = new Date(task.deadline);
  const isOverdue = isBefore(deadlineDate, new Date());
  const timeRemaining = formatDistanceToNow(deadlineDate, { addSuffix: true });

  const urgencyColor = isOverdue
    ? 'bg-red-200 text-red-800'
    : deadlineDate.getTime() - Date.now() < 1000 * 60 * 60 * 24
    ? 'bg-orange-200 text-orange-800'
    : 'bg-green-200 text-green-800';

  const toggleComplete = () => setCompleted(!completed);

  return (
    <div className="bg-white rounded-xl shadow-md border p-4 flex flex-col gap-3 hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <h3 className={`text-lg font-semibold ${completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {task.title}
        </h3>
        <button
          onClick={toggleComplete}
          className={`w-5 h-5 border-2 rounded-full transition ${
            completed ? 'bg-green-500 border-green-500' : 'border-gray-400'
          }`}
        >
          {completed && <span className="block w-full h-full bg-green-500 rounded-full" />}
        </button>
      </div>
      <div className={`inline-block text-sm px-3 py-1 rounded-full font-medium ${urgencyColor}`}>
        {isOverdue ? 'Overdue' : `Due ${timeRemaining}`}
      </div>
    </div>
  );
};

export default DeadlineTaskCard;