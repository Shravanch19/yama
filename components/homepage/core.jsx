"use client"
import React, { useState, useEffect } from 'react'
import CircularProgress from "@/components/ui/CircularProgress"
import DeadlineTaskCard from '../ui/DeadlineTaskCard'

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
    });    const [error, setError] = useState({
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
    };    const handleBasicInputChange = (field, value) => {
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
        const fetchProjects = async () => {
            try {
                setIsLoading(prev => ({ ...prev, projects: true }));
                const response = await fetch('/api/projects');

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data = await response.json();
                const transformedProjects = data.map(project => ({
                    name: project.title,
                    progress: project.progress || 0
                }));

                setMyProjects(transformedProjects);
                setError(prev => ({ ...prev, projects: null }));
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError(prev => ({ ...prev, projects: err.message }));
            } finally {
                setIsLoading(prev => ({ ...prev, projects: false }));
            }
        };

        const fetchLearnings = async () => {
            try {
                setIsLoading(prev => ({ ...prev, learnings: true }));
                const response = await fetch('/api/learnings');

                if (!response.ok) {
                    throw new Error('Failed to fetch learnings');
                }

                const data = await response.json();
                const transformedLearnings = data.map(learning => ({
                    title: learning.title,
                    level: `w-[${learning.progress}%]`
                }));

                setLearnings(transformedLearnings);
                setError(prev => ({ ...prev, learnings: null }));
            } catch (err) {
                console.error('Error fetching learnings:', err);
                setError(prev => ({ ...prev, learnings: err.message }));
            } finally {
                setIsLoading(prev => ({ ...prev, learnings: false }));
            }
        };

        const fetchTasks = async () => {
            try {
                setIsLoading(prev => ({ ...prev, tasks: true }));

                // Fetch all types of tasks in parallel
                const [deadlineRes, nonNegotiableRes, procrastinatingRes] = await Promise.all([
                    fetch('/api/tasks?type=deadline'),
                    fetch('/api/tasks?type=nonNegotiable'),
                    fetch('/api/tasks?type=procrastinating')
                ]);

                if (!deadlineRes.ok || !nonNegotiableRes.ok || !procrastinatingRes.ok) {
                    throw new Error('Failed to fetch tasks');
                }

                const [deadline, nonNegotiable, procrastinating] = await Promise.all([
                    deadlineRes.json(),
                    nonNegotiableRes.json(),
                    procrastinatingRes.json()
                ]);

                setTasks({
                    deadline,
                    nonNegotiable,
                    procrastinating
                });
                setError(prev => ({ ...prev, tasks: null }));
            } catch (err) {
                console.error('Error fetching tasks:', err);
                setError(prev => ({ ...prev, tasks: err.message }));
            } finally {
                setIsLoading(prev => ({ ...prev, tasks: false }));
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

        fetchProjects();
        fetchLearnings();
        fetchTasks();
        fetchBasicInputs();
    }, []);

    const News = [
        "🚀 New AI Tool Launch",
        "📅 Tech Conference 2023",
        "🔐 New Privacy Policy",
        "📈 Productivity Trends 2025"
    ];

    const Non_Negotiables = ["Meditation", "Gym Workout", "Code 2 hrs"];

    return (
        <main className="flex flex-col items-center justify-center">
            {/* MAIN DASHBOARD */}
            <div className="container mx-auto px-6 py-12 rounded-3xl shadow-inner flex flex-col gap-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 my-10">

                {/* RULES & MOTIVATION FIRST */}
                <div className="flex flex-col md:flex-row gap-8">

                    {/* IMPORTANT NEWS */}
                    <div className="bg-gradient-to-br from-purple-800/30 to-purple-900/40 rounded-2xl p-6 shadow-lg border border-purple-600 w-full">
                        <h2 className="text-2xl font-bold text-purple-300 mb-4">💭 Important News</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {News.map((title, idx) => (
                                <div key={idx} className="bg-purple-900/60 p-5 rounded-xl border border-purple-700 text-purple-100">
                                    <p className="font-semibold mb-1">{title}</p>
                                    <p className="text-sm text-purple-300">Description for {title}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* CORE PANEL */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <section className="col-span-2 bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700">
                        <h1 className="text-3xl font-bold text-cyan-400 mb-6">⚙️ Core Projects & Plans</h1>

                        {/* Progress */}
                        <div className="flex flex-wrap justify-center gap-6 mb-10">
                            {isLoading.projects ? (
                                <div className="text-gray-400</svg>">Loading projects...</div>
                            ) : error.projects ? (
                                <div className="text-red-400">{error.projects}</div>
                            ) : myProjects.length === 0 ? (
                                <div className="text-gray-400">No projects found</div>
                            ) : (
                                myProjects.map(({ name, progress }) => (
                                    <CircularProgress key={name} name={name} progress={progress} />
                                ))
                            )}
                        </div>

                        {/* Learning */}
                        <h2 className="text-2xl font-semibold text-blue-300 mb-4">📚 New Learning</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {isLoading.learnings ? (
                                <div className="text-gray-400">Loading learnings...</div>
                            ) : error.learnings ? (
                                <div className="text-red-400">{error.learnings}</div>
                            ) : learnings.length === 0 ? (
                                <div className="text-gray-400">No learnings found</div>
                            ) : (
                                learnings.map((item, idx) => (
                                    <div key={idx} className="bg-gray-700 p-4 rounded-lg shadow-inner transform transition-all duration-300 hover:scale-105">
                                        <p className="text-cyan-200 font-semibold">{item.title}</p>
                                        <div className="h-2 bg-gray-600 rounded mt-2 overflow-hidden">
                                            <div
                                                className="h-2 bg-cyan-400 rounded transition-all duration-700 ease-out"
                                                style={{ width: `${parseInt(item.level.match(/\d+/)[0], 10)}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-cyan-300 mt-1 text-right">
                                            {parseInt(item.level.match(/\d+/)[0], 10)}%
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Deadline Tasks */}
                        <h2 className="text-2xl font-semibold text-pink-300 mb-2">🛑 Deadline Tasks</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {isLoading.tasks ? (
                                <div className="text-gray-400">Loading deadline tasks...</div>
                            ) : error.tasks ? (
                                <div className="text-red-400">{error.tasks}</div>
                            ) : tasks.deadline.length === 0 ? (
                                <div className="text-gray-400">No deadline tasks</div>
                            ) : (
                                tasks.deadline.slice(0, 4).map((task, index) => (
                                    <DeadlineTaskCard key={task._id || index} task={task} onComplete={completeTask} loading={loadingTaskId === task._id} />
                                ))
                            )}
                        </div>
                    </section>

                    {/* SIDE PANEL */}
                    <aside className="flex flex-col gap-6">
                        {/* Procrastinating Tasks */}
                        <div className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-600">
                            <h2 className="text-xl font-bold text-red-400 mb-3">🕒 Procrastinating Tasks</h2>
                            {isLoading.tasks ? (
                                <p className="text-gray-400">Loading procrastinating tasks...</p>
                            ) : error.tasks ? (
                                <p className="text-red-400">{error.tasks}</p>) : tasks.procrastinating.length === 0 ? (
                                    <p className="text-gray-400">No procrastinating tasks</p>
                                ) : (
                                <ul className="list-disc list-inside text-gray-300 space-y-2">
                                    {tasks.procrastinating.slice(0, 5).map((task) => (
                                        <li key={task._id} className="group flex items-center justify-between">
                                            <span>{task.title}</span>
                                            <button
                                                onClick={() => completeTask('procrastinating', task._id)}
                                                disabled={loadingTaskId === task._id}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 flex items-center gap-1 text-sm"
                                            >
                                                {loadingTaskId === task._id ? (
                                                    <span className="inline-block animate-spin">↻</span>
                                                ) : (
                                                    <>✓ Done</>
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Non-Negotiable Tasks */}
                        <div className="bg-gray-800 rounded-xl shadow-md p-6 border border-green-600">
                            <h2 className="text-xl font-bold text-green-400 mb-3">💪 Non-Negotiable Tasks</h2>
                            {isLoading.tasks ? (
                                <p className="text-gray-400">Loading non-negotiable tasks...</p>
                            ) : error.tasks ? (
                                <p className="text-red-400">{error.tasks}</p>) : tasks.nonNegotiable.length === 0 ? (
                                    <p className="text-gray-400">No non-negotiable tasks</p>
                                ) : (
                                <ul className="list-disc list-inside text-gray-300 space-y-2">
                                    {tasks.nonNegotiable.slice(0, 5).map((task) => (
                                        <li key={task._id} className="group flex items-center justify-between">
                                            <span>{task.title}</span>
                                            <button
                                                onClick={() => completeTask('nonNegotiable', task._id)}
                                                disabled={loadingTaskId === task._id}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 flex items-center gap-1 text-sm"
                                            >
                                                {loadingTaskId === task._id ? (
                                                    <span className="inline-block animate-spin">↻</span>
                                                ) : (
                                                    <>✓ Done</>
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {/* 
                        <div className="bg-gray-800 rounded-xl shadow-md p-6 border border-green-600">
                            <h2 className="text-xl font-bold text-green-400 mb-3">🚫 Non Negotiable</h2>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                {Non_Negotiables.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div> */}

                        <div className="bg-gray-800 rounded-xl shadow-md p-6 border border-yellow-600">
                            <h2 className="text-xl font-bold text-yellow-400 mb-3">🧠 Idea Capture</h2>
                            <textarea
                                className="w-full p-2 bg-gray-900 border border-yellow-500 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Write down your ideas..."
                                rows={4}
                            ></textarea>
                        </div>

                        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-blue-600">
                            <h2 className="text-2xl font-bold text-blue-300 mb-4">🧘 Basic Inputs</h2>
                            <div className="space-y-4">
                                { [
                                    { label: "Wake Up Time", key: "wakeUpTime", placeholder: "HH:MM" },
                                    { label: "Meditation Duration", key: "meditationDuration", placeholder: "HH:MM" },
                                    { label: "Time Wasted Randomly", key: "timeWastedRandomly", placeholder: "HH:MM" }
                                ].map(({ label, key, placeholder }) => (
                                    <div key={key} className="flex flex-col">
                                        <label htmlFor={key} className="text-sm font-medium text-blue-100 mb-1">
                                            {label}
                                        </label>                        <input
                                            type="text"
                                            id={key}
                                            value={basicInputs[key]}
                                            onChange={(e) => handleBasicInputChange(key, e.target.value)}
                                            placeholder={placeholder}
                                            maxLength={5}
                                            pattern="[0-9:]*"
                                            className={`px-4 py-2 bg-gray-900 border ${
                                                basicInputs[key] && !validateTimeFormat(basicInputs[key])
                                                    ? 'border-red-500'
                                                    : 'border-blue-500'
                                            } text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
                                        />
                                        <span className="text-xs text-blue-300 mt-1">Format: HH:MM (e.g., 09:30)</span>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={handleBasicInputSubmit}
                                disabled={isLoading.basicInputs}
                                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading.basicInputs ? 'Saving...' : 'Update'}
                            </button>
                            {error.basicInputs && (
                                <p className="mt-2 text-red-400 text-sm">{error.basicInputs}</p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default Core;
