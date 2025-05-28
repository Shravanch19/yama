import React from 'react'
import { FaCheckCircle, FaTasks, FaRegCalendarAlt, FaStickyNote, FaBullseye, FaBook } from 'react-icons/fa'

const features = [
    { icon: <FaTasks className="text-blue-500 text-xl" />, label: 'Todo' },
    { icon: <FaCheckCircle className="text-green-500 text-xl" />, label: 'Habits' },
    { icon: <FaBook className="text-purple-500 text-xl" />, label: 'Docs' },
    { icon: <FaStickyNote className="text-yellow-500 text-xl" />, label: 'Notes' },
    { icon: <FaBullseye className="text-pink-500 text-xl" />, label: 'Goals' },
    { icon: <FaRegCalendarAlt className="text-indigo-500 text-xl" />, label: 'Calendar' },
]

const Features = () => {
    return (
        <div className="container mx-auto px-6 py-5 bg-white rounded-xl shadow-lg w-[85vw] mb-10">
            <ul className="flex flex-wrap items-center justify-evenly gap-8">
                {features.map((feature, idx) => (
                    <li key={feature.label} className="flex flex-col items-center space-y-2">
                        {feature.icon}
                        <span className="text-base font-small text-gray-700">{feature.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Features