import React from 'react'
import CircularProgress from "@/components/ui/CircularProgress"
import DeadlineTaskCard from '../ui/DeadlineTaskCard'

const Core = () => {

    const tasks_with_deadlines = [
        { title: 'Submit Report', deadline: '2025-05-30T10:00:00Z' },
        { title: 'Design Review', deadline: '2025-05-29T15:00:00Z' },
    ];

    const Rules_of_War = [
        "Finish side project MVP",
        "Write 1 blog post",
        "Read 3 chapters"
    ];

    const News = [
        "🚀 New AI Tool Launch",
        "📅 Tech Conference 2023",
        "🔐 New Privacy Policy",
        "📈 Productivity Trends 2025"
    ];

    const Learnings = [
        { title: "Next.js Deep Dive", level: "w-1/2" },
        { title: "Flutter Basics", level: "w-3/4" },
        { title: "Design Systems", level: "w-1/3" }
    ];

    const MyProjects = [
        { name: "Side Project", progress: 75 },]

    const Non_Negotiables = ["Meditation", "Gym Workout", "Code 2 hrs"];

    const Procrastinating_Tasks = ["Complete Side Project", "Finish Reading Book", "Organize Workspace"];

    return (
        <main className="flex flex-col items-center justify-center">
            {/* MAIN DASHBOARD */}
            <div className="container mx-auto px-6 py-12 rounded-3xl shadow-inner flex flex-col gap-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 my-10">

                {/* RULES & MOTIVATION FIRST */}
                <div className="flex flex-col md:flex-row gap-8">

                    {/* RULES OF WAR */}
                    
                    {/* <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 shadow-lg border border-blue-700 w-full md:max-w-[30vw]">
                        <h2 className="text-2xl font-bold text-cyan-400 mb-4">🎯 Rules Of War</h2>
                        <ul className="space-y-3">
                            {Rules_of_War.map((goal, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-blue-100">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span className="font-medium">{goal}</span>
                                </li>
                            ))}
                        </ul>
                    </div> */}

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
                            {MyProjects.map(({ name, progress }) => (
                                <CircularProgress key={name} name={name} progress={progress} />
                            ))}
                        </div>

                        {/* Learning */}
                        <h2 className="text-2xl font-semibold text-blue-300 mb-4">📚 New Learning</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {Learnings.map((item, idx) => (
                                <div key={idx} className="bg-gray-700 p-4 rounded-lg shadow-inner">
                                    <p className="text-cyan-200 font-semibold">{item.title}</p>
                                    <div className="h-2 bg-gray-600 rounded mt-2">
                                        <div className={`h-2 bg-cyan-400 rounded ${item.level}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Calendar */}
                        <h2 className="text-2xl font-semibold text-blue-300 mb-2">📆 Habits Calendar</h2>
                        <div className="bg-gray-700 p-4 rounded-lg shadow-inner mb-8">
                            <div className='flex items-center justify-evenly gap-6'>
                                {[...Array(4)].map((_, i) => (
                                    <img
                                        key={i}
                                        src="https://static.vecteezy.com/system/resources/previews/060/515/955/non_2x/calendar-work-planner-free-png.png"
                                        alt="Calendar"
                                        className="w-20 h-20 grayscale contrast-125 opacity-90"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Deadlines */}
                        <h2 className="text-2xl font-semibold text-pink-300 mb-2">🛑 Deadline Tasks</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tasks_with_deadlines.map((task, index) => (
                                <DeadlineTaskCard key={index} task={task} />
                            ))}
                        </div>
                    </section>

                    {/* SIDE PANEL */}
                    <aside className="flex flex-col gap-6">
                        <div className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-600">
                            <h2 className="text-xl font-bold text-red-400 mb-3">🕒 Procrastinating Tasks</h2>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                {Procrastinating_Tasks.map((task, idx) => (
                                    <li key={idx}>{task}</li>
                                ))}

                            </ul>
                        </div>

                        <div className="bg-gray-800 rounded-xl shadow-md p-6 border border-green-600">
                            <h2 className="text-xl font-bold text-green-400 mb-3">🚫 Non Negotiable</h2>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                {Non_Negotiables.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>

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
                                {["Wake Up Time", "Meditation Duration", "Time Wasted Randomly"].map((label, idx) => (
                                    <div key={idx} className="flex flex-col">
                                        <label htmlFor={`input-${idx}`} className="text-sm font-medium text-blue-100 mb-1">
                                            {label}
                                        </label>
                                        <input
                                            type="text"
                                            id={`input-${idx}`} placeholder={label}
                                            className="px-4 py-2 bg-gray-900 border border-blue-500 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}

export default Core
