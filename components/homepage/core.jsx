"use client"
import React, { useState, useEffect } from 'react'
import CircularProgress from "@/components/ui/CircularProgress"
import DeadlineTaskCard from '../ui/DeadlineTaskCard'
import TaskListPanel from '../ui/TaskListPanel'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Core = () => {
    const [isLoading, setIsLoading] = useState({
        projects: true,
        learnings: true,
        tasks: true,
        basicInputs: true
    });

    const [loadingTaskId, setLoadingTaskId] = useState(null);
    const [myProjects, setMyProjects] = useState([]);
    const [learnings, setLearnings] = useState([]);
    const [tasks, setTasks] = useState({
        deadline: [],
        nonNegotiable: [],
        procrastinating: []
    });
    const [error, setError] = useState({
        projects: null,
        learnings: null,
        tasks: null,
        basicInputs: null
    });
    const [basicInputs, setBasicInputs] = useState({
        wakeUpTime: '',
        meditationDuration: '',
        timeWastedRandomly: ''
    });

    const completeTask = async (type, taskId) => {
        try {
            setLoadingTaskId(taskId);
            const response = await fetch('/api/tasks', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type, taskId, status: 'completed' }),
            });

            if (!response.ok) throw new Error('Failed to update task');

            // Update local state to remove the completed task
            setTasks(prev => ({
                ...prev,
                [type]: prev[type].filter(task => task._id !== taskId)
            }));
        } catch (err) {
            console.error('Error completing task:', err);
            setError(prev => ({ ...prev, tasks: err.message }));
        } finally {
            setLoadingTaskId(null);
        }
    };

    const validateTimeFormat = (timeStr) => {
        if (!timeStr) return true; // Allow empty values
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(timeStr);
    };
    const handleBasicInputChange = (field, value) => {
        // Allow any input, but restrict to 5 characters (HH:MM format)
        if (value.length <= 5) {
            // If the input length is 2 and no colon yet, add it automatically
            if (value.length === 2 && !value.includes(':')) {
                value = value + ':';
            }
            setBasicInputs(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleBasicInputSubmit = async () => {
        try {
            // Validate all time inputs
            const invalidInputs = Object.entries(basicInputs).filter(
                ([key, value]) => value && !validateTimeFormat(value)
            );

            if (invalidInputs.length > 0) {
                throw new Error('Please enter time in HH:MM format');
            }

            setIsLoading(prev => ({ ...prev, basicInputs: true }));
            const response = await fetch('/api/basic-inputs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(basicInputs),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save basic inputs');
            }

            // Clear the inputs after successful submission
            setBasicInputs({
                wakeUpTime: '',
                meditationDuration: '',
                timeWastedRandomly: ''
            });

            setError(prev => ({ ...prev, basicInputs: null }));
        } catch (err) {
            console.error('Error saving basic inputs:', err);
            setError(prev => ({ ...prev, basicInputs: err.message }));
        } finally {
            setIsLoading(prev => ({ ...prev, basicInputs: false }));
        }
    };

    useEffect(() => {

        const fetchAllData = async () => {
            try {
                setIsLoading({ projects: true, learnings: true, tasks: true });

                const response = await fetch('/api/dashboard');

                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }

                const { projects, learnings, procrastinating, nonNegotiable, deadline } = await response.json();

                const transformedProjects = projects.map(project => ({
                    name: project.title,
                    progress: project.progress || 0
                }));
                setMyProjects(transformedProjects);

                const transformedLearnings = learnings.map(learning => ({
                    title: learning.title,
                    level: `w-[${learning.progress}%]`
                }));
                setLearnings(transformedLearnings);

                setTasks({
                    procrastinating,
                    nonNegotiable,
                    deadline
                });

                setError({ projects: null, learnings: null, tasks: null });
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError({
                    projects: err.message,
                    learnings: err.message,
                    tasks: err.message
                });
            } finally {
                setIsLoading({ projects: false, learnings: false, tasks: false });
            }
        };

        const fetchBasicInputs = async () => {
            try {
                setIsLoading(prev => ({ ...prev, basicInputs: true }));
                const response = await fetch('/api/basic-inputs');

                if (!response.ok) {
                    throw new Error('Failed to fetch basic inputs');
                }

                const data = await response.json();
                if (data) {
                    setBasicInputs({
                        wakeUpTime: data.wakeUpTime || '',
                        meditationDuration: data.meditationDuration || '',
                        timeWastedRandomly: data.timeWastedRandomly || ''
                    });
                }
                setError(prev => ({ ...prev, basicInputs: null }));
            } catch (err) {
                console.error('Error fetching basic inputs:', err);
                setError(prev => ({ ...prev, basicInputs: err.message }));
            } finally {
                setIsLoading(prev => ({ ...prev, basicInputs: false }));
            }
        };

        fetchAllData();
        fetchBasicInputs();
    }, []);


    return (
        <main className="flex flex-col items-center justify-center">
            <div className="container mx-auto px-6 py-12 my-10 rounded-3xl shadow-inner bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700">

                {/* Stock Market-like Performance Chart */}
                <div className="mb-12 bg-gray-800 rounded-xl shadow-lg p-6 border border-green-600">
                    {/* Dummy performance history for stock-like chart */}
                    {/* This can be replaced with real data later */}
                    {(() => {
                        const performanceHistory = [
                            { date: '2025-06-10', value: 10 },
                            { date: '2025-06-11', value: 15 },
                            { date: '2025-06-12', value: 12 },
                            { date: '2025-06-13', value: 12 },
                            { date: '2025-06-14', value: 11 },
                            { date: '2025-06-15', value: 13 },
                            { date: '2025-06-16', value: 12 },
                            { date: '2025-06-17', value: 17 },
                            { date: '2025-06-18', value: 21 },
                            { date: '2025-06-19', value: 19 },
                        ];
                        const perfHistoryLabels = performanceHistory.map(entry =>
                            new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        );
                        const perfHistoryValues = performanceHistory.map(entry => entry.value);
                        const perfHistoryChart = {
                            labels: perfHistoryLabels,
                            datasets: [
                                {
                                    label: 'Performance (Stock Style)',
                                    data: perfHistoryValues,
                                    borderColor: perfHistoryValues[perfHistoryValues.length - 1] >= perfHistoryValues[0] ? 'rgb(34,197,94)' : 'rgb(239,68,68)',
                                    backgroundColor: perfHistoryValues[perfHistoryValues.length - 1] >= perfHistoryValues[0] ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                    fill: true,
                                    tension: 0.2,
                                    pointRadius: 0,
                                    borderWidth: 3,
                                },
                            ],
                        };
                        const perfHistoryOptions = {
                            responsive: true,
                            plugins: {
                                legend: { display: false },
                                title: {
                                    display: true,
                                    text: '📈 Performance Over Time (Stock Chart)',
                                    color: '#E5E7EB',
                                    font: { family: "'Inter', sans-serif", size: 18, weight: 'bold' },
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => `Score: ${context.parsed.y}`,
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    grid: { color: '#374151' },
                                    ticks: { color: '#E5E7EB' },
                                },
                                y: {
                                    grid: { color: '#374151' },
                                    ticks: { color: '#E5E7EB' },
                                    beginAtZero: false,
                                },
                            },
                            elements: {
                                line: { borderJoinStyle: 'round' },
                            },
                        };
                        return <Line data={perfHistoryChart} options={perfHistoryOptions} height={80} />;
                    })()}
                </div>

                {/* Dashboard Top Section */}
                <section className="flex flex-col md:flex-row gap-8">
                    {/* Placeholder for To-Do List or Additional Panels */}
                </section>

                {/* Core Content Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">

                    {/* Main Panel */}
                    <section className="col-span-2 bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700">
                        <h1 className="text-3xl font-bold text-cyan-400 mb-8">⚙️ Core Projects & Plans</h1>

                        {/* Project Progress */}
                        <div className="mb-12 p-6 shadow-xl border rounded-xl border-blue-600 ">
                            <h2 className="text-2xl font-semibold text-cyan-300 mb-4">🚀 Project Progress</h2>
                            <div className="flex flex-wrap justify-center gap-6">
                                {isLoading.projects ? (
                                    <p className="text-gray-400">Loading projects...</p>
                                ) : error.projects ? (
                                    <p className="text-red-400">{error.projects}</p>
                                ) : myProjects.length === 0 ? (
                                    <p className="text-gray-400">No projects found</p>
                                ) : (
                                    myProjects.map(({ name, progress }) => (
                                        <CircularProgress key={name} name={name} progress={progress} />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Learning Panel */}
                        <div className="mb-12 p-6 shadow-xl border rounded-xl border-green-600">
                            <h2 className="text-2xl font-semibold text-blue-300 mb-4">📚 New Learnings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {isLoading.learnings ? (
                                    <p className="text-gray-400">Loading learnings...</p>
                                ) : error.learnings ? (
                                    <p className="text-red-400">{error.learnings}</p>
                                ) : learnings.length === 0 ? (
                                    <p className="text-gray-400">No learnings found</p>
                                ) : (
                                    learnings.map((item, idx) => (
                                        <div key={idx} className="bg-gray-700 p-4 rounded-lg hover:scale-105 transition-transform">
                                            <p className="text-cyan-200 font-semibold">{item.title}</p>
                                            <div className="mt-2 bg-gray-600 h-2 rounded overflow-hidden">
                                                <div
                                                    className="h-full bg-cyan-400 transition-all"
                                                    style={{ width: `${parseInt(item.level.match(/\d+/)[0], 10)}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-cyan-300 text-right mt-1">
                                                {parseInt(item.level.match(/\d+/)[0], 10)}%
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Deadline Tasks */}
                        <div>
                            <h2 className="text-2xl font-semibold text-pink-300 mb-4">🛑 Deadline Tasks</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {isLoading.tasks ? (
                                    <p className="text-gray-400">Loading deadline tasks...</p>
                                ) : error.tasks ? (
                                    <p className="text-red-400">{error.tasks}</p>
                                ) : tasks.deadline.length === 0 ? (
                                    <p className="text-gray-400">No deadline tasks</p>
                                ) : (
                                    tasks.deadline.slice(0, 4).map((task, index) => (
                                        <DeadlineTaskCard key={task._id || index} task={task} onComplete={completeTask} loading={loadingTaskId === task._id} />
                                    ))
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Sidebar Panel */}
                    <aside className="flex flex-col gap-8">

                        {/* Procrastinating Tasks */}
                        <TaskListPanel
                            title="🕒 Procrastinating Tasks"
                            tasks={tasks.procrastinating}
                            loading={isLoading.tasks}
                            error={error.tasks}
                            type="procrastinating"
                            color="red"
                            completeTask={completeTask}
                            loadingTaskId={loadingTaskId}
                        />

                        {/* Non-Negotiable Tasks */}
                        <TaskListPanel
                            title="💪 Non-Negotiable Tasks"
                            tasks={tasks.nonNegotiable}
                            loading={isLoading.tasks}
                            error={error.tasks}
                            type="nonNegotiable"
                            color="green"
                            completeTask={completeTask}
                            loadingTaskId={loadingTaskId}
                        />

                        {/* Basic Inputs */}
                        <div className="bg-gray-800 p-6 rounded-2xl border border-blue-600 shadow-xl">
                            <h2 className="text-2xl font-bold text-blue-300 mb-4">🧘 Basic Inputs</h2>
                            <div className="space-y-4">
                                {[
                                    { label: "Wake Up Time", key: "wakeUpTime", placeholder: "HH:MM" },
                                    { label: "Meditation Duration", key: "meditationDuration", placeholder: "HH:MM" },
                                    { label: "Time Wasted Randomly", key: "timeWastedRandomly", placeholder: "HH:MM" }
                                ].map(({ label, key, placeholder }) => (
                                    <div key={key} className="flex flex-col">
                                        <label htmlFor={key} className="text-sm font-medium text-blue-100 mb-1">{label}</label>
                                        <input
                                            type="text"
                                            id={key}
                                            value={basicInputs[key]}
                                            onChange={(e) => handleBasicInputChange(key, e.target.value)}
                                            placeholder={placeholder}
                                            maxLength={5}
                                            pattern="[0-9:]*"
                                            className={`px-4 py-2 bg-gray-900 border ${basicInputs[key] && !validateTimeFormat(basicInputs[key]) ? 'border-red-500' : 'border-blue-500'} text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400`}
                                        />
                                        <span className="text-xs text-blue-300 mt-1">Format: HH:MM (e.g., 09:30)</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleBasicInputSubmit}
                                disabled={isLoading.basicInputs}
                                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading.basicInputs ? 'Saving...' : 'Update'}
                            </button>
                            {error.basicInputs && (
                                <p className="mt-2 text-red-400 text-sm">{error.basicInputs}</p>
                            )}
                        </div>
                    </aside>
                </section>
            </div>
        </main>

    );
};

export default Core;