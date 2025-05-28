import React from 'react'
import Intro from "@/components/homepage/intro";
import Features from "@/components/homepage/features";
import CircularProgress from "@/components/ui/CircularProgress";
import DeadlineTaskCard from '../ui/DeadlineTaskCard';

const Core = () => {
    const tasks = [
        { title: 'Submit Report', deadline: '2025-05-30T10:00:00Z' },
        { title: 'Design Review', deadline: '2025-05-29T15:00:00Z' },
    ];

    return (
        <main className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-b from-gray-50 to-blue-100">
            <Intro />
            <Features />

            {/* Dashboard Layout */}
            <div className="container mx-auto px-6 py-10 rounded-2xl shadow-xl flex flex-col gap-10 bg-white/80 backdrop-blur-md mt-8">

                {/* CORE PANEL */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Projects & Learning */}
                    <section className="col-span-2 bg-white rounded-xl p-6 shadow-md border border-blue-100">
                        <h1 className="text-3xl font-bold text-blue-800 mb-4">Core Projects & Plans</h1>

                        <div className="flex flex-wrap justify-center gap-6 mb-6">
                            {[{ name: "Alpha", progress: 75 }, { name: "Beta", progress: 40 }, { name: "Gamma", progress: 90 }].map(({ name, progress }) => (
                                <CircularProgress key={name} name={name} progress={progress} />
                            ))}
                        </div>

                        <h2 className="text-2xl font-semibold text-blue-700 mb-2">New Learning</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {[
                                { title: "Flutter Basics", level: "w-3/4" },
                                { title: "Next.js Deep Dive", level: "w-1/2" },
                                { title: "Design Systems", level: "w-1/3" },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-blue-50 p-4 rounded-lg shadow">
                                    <p className="text-blue-800 font-semibold">{item.title}</p>
                                    <div className="h-2 bg-blue-200 rounded mt-2">
                                        <div className={`h-2 bg-blue-600 rounded ${item.level}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-2xl font-semibold text-blue-700 mb-2">Habits Record Calendar</h2>
                        <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg shadow mb-6">
                            <div className='flex items-center justify-evenly gap-6'>
                                <img src="https://static.vecteezy.com/system/resources/previews/060/515/955/non_2x/calendar-work-planner-free-png.png" alt="Calendar" className="w-24 h-24" />
                                <img src="https://static.vecteezy.com/system/resources/previews/060/515/955/non_2x/calendar-work-planner-free-png.png" alt="Calendar" className="w-24 h-24" />
                                <img src="https://static.vecteezy.com/system/resources/previews/060/515/955/non_2x/calendar-work-planner-free-png.png" alt="Calendar" className="w-24 h-24" />
                                <img src="https://static.vecteezy.com/system/resources/previews/060/515/955/non_2x/calendar-work-planner-free-png.png" alt="Calendar" className="w-24 h-24" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-semibold text-blue-700 mb-2">Deadline Tasks</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tasks.map((task, index) => (
                                <DeadlineTaskCard key={index} task={task} />
                            ))}
                        </div>

                    </section>

                    {/* Tasks Panel */}
                    <aside className="flex flex-col gap-6">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
                            <h2 className="text-xl font-bold text-blue-700 mb-3">🕒 Procrastinating Tasks</h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>Finish Portfolio</li>
                                <li>Read Book Chapter 5</li>
                                <li>Organize Drive</li>
                            </ul>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
                            <h2 className="text-xl font-bold text-green-700 mb-3">✅ Daily Tasks</h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>Meditation</li>
                                <li>Gym Workout</li>
                                <li>Code 2 hrs</li>
                            </ul>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 border border-yellow-100">
                            <h2 className="text-xl font-bold text-yellow-700 mb-3">🧠 Idea Capture</h2>
                            <textarea
                                className="w-full p-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Write down your ideas..."
                                rows={4}
                            ></textarea>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-xl border border-blue-200">
                            <h2 className="text-2xl font-bold text-blue-700 mb-4">🧘 Basic Inputs</h2>
                            <div className="space-y-4">
                                {["Wake Up Time", "Meditation Duration", "Time Wasted Randomly"].map((label, idx) => (
                                    <div key={idx} className="flex flex-col">
                                        <label htmlFor={`input-${idx}`} className="text-sm font-medium text-blue-900 mb-1">
                                            {label}
                                        </label>
                                        <input
                                            type="text"
                                            id={`input-${idx}`} placeholder={label}
                                            className="px-4 py-2 rounded-lg border border-blue-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* EXTRA PANELS */}
                <div className="flex flex-col md:flex-row flex-wrap items-start gap-8 w-full my-12 px-4 md:px-0">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-xl border border-blue-200 w-full md:max-w-[25vw]">
                        <h2 className="text-2xl font-bold text-blue-700 mb-4">🎯 Weekly Goals</h2>
                        <ul className="space-y-3">
                            {["Finish side project MVP", "Write 1 blog post", "Read 3 chapters"].map((goal, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-blue-800">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span className="font-medium">{goal}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 shadow-xl border border-pink-200 w-full md:max-w-[60vw]">
                        <h2 className="text-2xl font-bold text-pink-700 mb-4">💭 Important News</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {["🚀 New AI Tool Launch", "📅 Tech Conference 2023", "🔐 New Privacy Policy", "📈 Productivity Trends 2025"].map((title, idx) => (
                                <div key={idx} className="bg-white/70 backdrop-blur-lg p-5 rounded-xl border border-pink-100">
                                    <p className="text-pink-800 font-semibold mb-1">{title}</p>
                                    <p className="text-sm text-gray-700">Description for {title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Core;
