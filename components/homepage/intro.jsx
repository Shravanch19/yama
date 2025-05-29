import React from 'react'

const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 5) return "Midnight Grind"
    if (hour < 12) return "Morning Hustle"
    if (hour < 17) return "Afternoon Flow"
    if (hour < 21) return "Evening Sprint"
    return "Late Night Warzone"
}

const quotes = [
    "Discipline is choosing between what you want now and what you want most.",
    "Don't watch the clock; do what it does — keep going.",
    "Small steps every day lead to massive results.",
    "Push harder than yesterday if you want a different tomorrow.",
    "Comfort is a slow death. Fight every day.",
    "Success doesn’t come from motivation, it comes from consistency.",
]

const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)]

const Intro = () => {
    const greeting = getGreeting()
    const quote = getRandomQuote()
    return (
        <div className="container mx-auto px-6 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] w-[90vw] max-w-5xl mb-10 flex flex-col md:flex-row items-center gap-12 border border-gray-700 transition-all duration-300 text-white">

            {/* Avatar Section */}
            <div className="relative group">
                <img
                    src="https://img.freepik.com/premium-vector/boy-with-blue-hoodie-blue-hoodie-with-hoodie-it_1230457-42660.jpg?semt=ais_hybrid&w=740"
                    alt="User Avatar"
                    className="w-40 h-40 rounded-full border-4 border-cyan-400 shadow-lg object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full shadow-md animate-pulse">
                    Ready!
                </span>
            </div>

            {/* Text Content */}
            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8 md:gap-6">
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight ">
                        {greeting}
                    </h1>
                    <p className="text-lg font-medium text-gray-300 mb-2">
                        Bhai! Aur Nahi — Ab Phodna Hai 💥
                    </p>
                    <p className="text-sm italic text-gray-400 mt-1 max-w-xl">
                        "{quote}"
                    </p>
                </div>

                {/* Date Section */}
                <div className="flex flex-col items-center md:items-end">
                    <span className="text-2xl font-semibold text-cyan-300 bg-gray-800 px-5 py-2 rounded-xl shadow-md">
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-sm text-gray-400 mt-1">Mission Day</span>
                </div>
            </div>
        </div>
    )
}

export default Intro
