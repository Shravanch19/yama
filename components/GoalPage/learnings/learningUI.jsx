import React from 'react'
import Add_Learning from './learningModal'

const LearningUI = () => {

    const learnings = []

    return (
        <section className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-blue-600">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-blue-300 mb-6">Learnings</h2>
                <Add_Learning />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learnings.map((learning, index) => (
                    <div key={index} className="bg-gray-700 p-5 rounded-xl border border-gray-600">
                        <h3 className="text-xl font-semibold text-white mb-2">{learning.title}</h3>
                        <progress value={learning.progress} max="100" className="w-full h-2 mb-2" />
                        <p className="text-sm text-purple-400 mb-2">Stage: {learning.stage}</p>
                        <div className="flex gap-2">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Next</button>
                            <button className="border border-blue-400 px-3 py-1 rounded">Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default LearningUI