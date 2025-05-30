import React from 'react'

const HealthUI = () => {

    const health = [
        { title: 'Weight (kg)', value: 70 },
        { title: 'Age', value: 25 },
        { title: 'Height (cm)', value: 175 },
    ]

    const Health_Inputs = ['Running', 'Pushups', 'Pullups', 'Squats', 'Plank']
    
    return (
        <section className="bg-gray-800 border border-green-500 rounded-2xl p-6 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-green-300">Health Overview</h2>
            <div className="flex flex-col">
                <div className="flex items-center justify-evenly mb-4">
                    {health.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center bg-gray-800 rounded-full border border-green-600 shadow-inner"
                            style={{ width: 200, height: 200 }}
                        >
                            <h3 className="text-lg font-semibold text-green-200">{item.title}</h3>
                            <p className="text-2xl font-bold text-gray-100">{item.value}</p>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {Health_Inputs.map((input, index) => (
                        <div key={index} className="flex flex-col gap-1">
                            <label htmlFor={input} className="text-sm text-green-100">{input}</label>
                            <input
                                id={input}
                                type="text"
                                placeholder={`Enter ${input}`}
                                className="bg-gray-700 text-white px-3 py-2 rounded border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HealthUI