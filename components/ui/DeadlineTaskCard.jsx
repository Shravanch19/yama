"use client";
import React, { useState } from 'react';
import { formatDistanceToNow, isBefore } from 'date-fns';

const DeadlineTaskCard = ({ task }) => {
  const [completed, setCompleted] = useState(false);

  const deadlineDate = new Date(task.deadline);
  const isOverdue = isBefore(deadlineDate, new Date());
  const timeRemaining = formatDistanceToNow(deadlineDate, { addSuffix: true });

  const urgencyColor = isOverdue
    ? 'bg-red-800 text-red-100'
    : deadlineDate.getTime() - Date.now() < 1000 * 60 * 60 * 24
    ? 'bg-yellow-600 text-yellow-100'
    : 'bg-green-700 text-green-100';

  const toggleComplete = () => setCompleted(!completed);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-4 flex flex-col gap-3 shadow-lg hover:shadow-xl transition">
      {/* Title + Toggle */}
      <div className="flex items-start justify-between">
        <h3 className={`text-lg font-semibold tracking-wide ${completed ? 'line-through text-gray-500' : 'text-white'}`}>
          {task.title}
        </h3>
        <button
          onClick={toggleComplete}
          className={`w-5 h-5 mt-1 border-2 rounded-full transition ${
            completed ? 'bg-green-500 border-green-500' : 'border-gray-500'
          }`}
        >
          {completed && <span className="block w-full h-full bg-green-500 rounded-full" />}
        </button>
      </div>

      {/* Time Status */}
      <div className={`text-xs px-3 py-1 rounded-full font-medium self-start ${urgencyColor}`}>
        {isOverdue ? '⚠️ Overdue' : `⏳ Due ${timeRemaining}`}
      </div>
    </div>
  );
};

export default DeadlineTaskCard;
