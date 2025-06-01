"use client";
import React, { useState } from "react";
// import database from "@/models/data"



const Add_Learning = () => {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: "",
        NoOfChapters: 0,
        ChaptersName: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "NoOfChapters" ? parseInt(value) : value,
        }));
    };

    const handleExit = () => {
        setShowForm(false);
        setForm({
            title: "",
            NoOfChapters: 0,
            ChaptersName: [],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleExit();
        console.log("Learning Added:", form);
        alert("Learning Added Successfully!");
        try {
            await fetch("/api/learnings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            
        } catch (error) {
            console.error("Error adding learning:", error);
            alert("Failed to add learning. Please try again.");
            
        }
    };

    return (
        <>
            <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                onClick={() => setShowForm(true)}
            >
                Add Learning
            </button>
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-gray-800 p-6 rounded-lg shadow-lg border border-blue-600 w-full max-w-md"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-blue-300 mb-4">Add Learning</h2>
                            <button
                                type="button"
                                className=" text-blue-200 hover:text-blue-400"
                                onClick={() => handleExit()}
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
                            <label className="block text-blue-200 mb-2" htmlFor="title">
                                Learning Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-gray-700 text-blue-100"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-blue-200 mb-2" htmlFor="NoOFmodules">
                                Number of Chapters
                            </label>
                            <input
                                type="number"
                                name="NoOfChapters"
                                value={form.NoOfChapters}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-gray-700 text-blue-100"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-blue-200 mb-2" htmlFor="ChaptersName">
                                Chapters Name (comma separated)
                            </label>
                            <input
                                type="text"
                                name="ChaptersName"
                                placeholder="e.g., chapter1, chapter2, chapter3..."
                                value={form.ChaptersName.join(", ")}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        ChaptersName: e.target.value.split(",").map((item) => item.trim()),
                                    }))
                                }
                                className="w-full p-2 rounded bg-gray-700 text-blue-100"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow w-full"
                        >
                            Add Learning
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Add_Learning;