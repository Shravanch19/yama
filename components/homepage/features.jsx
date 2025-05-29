import React from 'react'
import {
  FaCheckCircle,
  FaTasks,
  FaRegCalendarAlt,
  FaStickyNote,
  FaBullseye,
  FaBook
} from 'react-icons/fa'

const features = [
  { icon: <FaCheckCircle className="text-green-600 text-xl" />, label: 'Habits' },
  { icon: <FaTasks className="text-blue-600 text-xl" />, label: 'Todo' },
  { icon: <FaBullseye className="text-pink-600 text-xl" />, label: 'Goals' },
  { icon: <FaRegCalendarAlt className="text-indigo-600 text-xl" />, label: 'Calendar' },
  { icon: <FaStickyNote className="text-yellow-500 text-xl" />, label: 'Notes' },
  { icon: <FaBook className="text-purple-600 text-xl" />, label: 'Docs' },
]

const Features = () => {
  return (
    <section className="w-[85vw] mx-auto my-10 px-6 py-5 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100">
      <ul className="flex flex-wrap items-center justify-evenly gap-8">
        {features.map((feature) => (
          <li key={feature.label} className="flex flex-col items-center space-y-2">
            {feature.icon}
            <span className="text-sm font-medium text-gray-800">{feature.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Features
