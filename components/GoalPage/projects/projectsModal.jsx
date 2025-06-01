"use client";
import React, { useState } from "react";

const Add_Project = () => {
    const [showForm, setShowForm] = useState(false);    const [form, setForm] = useState({
        title: "",
        description: "",
        startDate: new Date().toISOString().split('T')[0],
        deadline: "",
        status: "Planning",
        moduleKey: [],
        team: [],
        tags: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "NoOFmodules" ? parseInt(value) : value,
        }));
    };    const handleExit = () => {
        // Reset form fields when exiting
        setForm({
            title: "",
            description: "",
            startDate: new Date().toISOString().split('T')[0],
            deadline: "",
            status: "Planning",
            moduleKey: [],
            team: [],
            tags: []
        });
    };    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            
            if (response.ok) {
                alert("Project Added Successfully!");
                handleExit();
                setShowForm(false);
            } else {
                throw new Error(data.message || 'Error creating project');
            }
        } catch (error) {
            alert('Failed to add project: ' + error.message);
        }
    };

    return (
        <>
            <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
                onClick={() => setShowForm(true)}
            >
                Add Project
            </button>
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-gray-800 p-6 rounded-lg shadow-lg border border-purple-600 w-full max-w-md"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-purple-300 mb-4">Add Project</h2>
                            <button
                                type="button"
                                className=" text-purple-200 hover:text-purple-400"
                                onClick={() => {handleExit(); setShowForm(false)}}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-purple-200 mb-2" htmlFor="title">
                                Project Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-gray-700 text-purple-100"
                                required
                            />
                        </div>                        <div className="mb-4">
                            <label className="block text-purple-200 mb-2" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-gray-700 text-purple-100"
                                rows="3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-purple-200 mb-2" htmlFor="startDate">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={form.startDate}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded bg-gray-700 text-purple-100"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-purple-200 mb-2" htmlFor="deadline">
                                    Deadline
                                </label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={form.deadline}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded bg-gray-700 text-purple-100"
                                    required
                                />
                            </div>
                        </div>                        <div className="mb-4">
                            <label className="block text-purple-200 mb-2" htmlFor="status">
                                Status
                            </label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-gray-700 text-purple-100"
                                required
                            >
                                <option value="Planning">Planning</option>
                                <option value="In Progress">In Progress</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-purple-200 mb-2" htmlFor="moduleKey">
                                Project Modules (comma separated)
                            </label>
                            <input
                                type="text"
                                name="moduleKey"
                                placeholder="e.g., planning, design, development,..."
                                value={form.moduleKey.join(", ")}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        moduleKey: e.target.value.split(",").map((item) => item.trim()),
                                    }))
                                }
                                className="w-full p-2 rounded bg-gray-700 text-purple-100"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow w-full"
                        >
                            Add Project
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Add_Project;