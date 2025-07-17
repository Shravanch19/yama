"use client"
import { useState, useEffect } from 'react';

const useDashboardData = () => {
  const [data, setData] = useState({
    projects: [],
    learnings: [],
    tasks: {
      procrastinating: [],
      nonNegotiable: [],
      deadline: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const completeTask = async (type, taskId) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, taskId, status: 'completed' })
      });

      if (!res.ok) throw new Error('Failed to complete task');

      setData(prev => ({
        ...prev,
        tasks: {
          ...prev.tasks,
          [type]: prev.tasks[type].filter(task => task._id !== taskId)
        }
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) throw new Error('Failed to fetch dashboard');
        const json = await res.json();

        setData({
          projects: json.projects.map(p => ({ name: p.title, progress: p.progress || 0 })),
          learnings: json.learnings.map(l => ({
            title: l.title,
            level: `w-[${l.progress}%]`
          })),
          tasks: {
            procrastinating: json.procrastinating,
            nonNegotiable: json.nonNegotiable,
            deadline: json.deadline
          }
        });
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { data, loading, error, completeTask };
};

export default useDashboardData;
