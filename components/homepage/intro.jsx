import React from 'react'

const Intro = () => {
    return (
        <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-lg w-[85vw] my-2 flex flex-col md:flex-row items-center gap-8">
            <img
                src="https://img.freepik.com/premium-vector/boy-with-blue-hoodie-blue-hoodie-with-hoodie-it_1230457-42660.jpg?semt=ais_hybrid&w=740"
                alt="User Avatar"
                className="w-32 h-32 rounded-full border-4 border-blue-200 shadow-md"
            />
            <div className="flex items-center justify-between w-full">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Welcome to <span className="text-blue-600">Yama</span></h2>
                    <p className="text-lg text-gray-600 mt-2 max-w-md">
                        Start your journey with a beautiful, customizable homepage. Explore, learn, and grow with modern tools and a friendly UI.
                    </p>
                </div>
                <div className="ml-8 flex flex-col items-center">
                    <span className="text-sm text-gray-500 mb-2">Screen Time</span>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="absolute top-0 left-0" width="80" height="80">
                            <circle
                                cx="40"
                                cy="40"
                                r="34"
                                stroke="#bfdbfe"
                                strokeWidth="8"
                                fill="none"
                            />
                            <circle
                                cx="40"
                                cy="40"
                                r="34"
                                stroke="#3b82f6"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={2 * Math.PI * 34}
                                strokeDashoffset={2 * Math.PI * 34 * (1 - 0.6)}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 0.5s' }}
                            />
                        </svg>
                        <span className="text-md font-semibold text-blue-600">3h 45m</span>
                    </div>
                    <span className="text-xs text-gray-600 mt-1">today</span>
                </div>
            </div>
        </div>
    )
}

export default Intro