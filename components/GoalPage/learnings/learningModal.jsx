"use client";
import React, { useState } from "react";

const Add_Learning = () => {
    const [showForm, setShowForm] = useState(false); const [form, setForm] = useState({
        title: "",
        NoOfChapters: 1,
        ChaptersName: [],
        status: "Not Started",
        progress: 0,
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "NoOfChapters" ? parseInt(value) : value,
        }));
    }; const handleExit = () => {
        setShowForm(false);
        setForm({
            title: "",
            NoOfChapters: 1,
            ChaptersName: [],
            status: "Not Started",
            progress: 0,
            notes: "",
        });
        setError("");
    }; const validateForm = () => {
        if (form.NoOfChapters !== form.ChaptersName.length) {
            setError("Number of chapters must match the number of chapter names provided");
            return false;
        }
        if (form.NoOfChapters < 1) {
            setError("Number of chapters must be at least 1");
            return false;
        }
        if (form.ChaptersName.some(name => !name.trim())) {
            setError("All chapter names must be non-empty");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/learnings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to add learning");
            }
            alert("Learning added successfully!");

            handleExit();
        } catch (error) {
            console.error("Error adding learning:", error);
            setError(error.message || "Failed to add learning. Please try again.");
        } finally {
            setLoading(false);
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
                        </div>                        <div className="mb-4">
                            <label className="block text-blue-200 mb-2" htmlFor="NoOfChapters">
                                Number of Chapters
                            </label>
                            <input
                                type="number"
                                name="NoOfChapters"
                                value={form.NoOfChapters}
                                onChange={handleChange}
                                min="1"
                                className="w-full p-2 rounded bg-gray-700 text-blue-100"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-blue-200 mb-2" htmlFor="ChaptersName">
                                Chapters Name (comma separated)
                            </label>
                            <textarea
                                name="ChaptersName"
                                placeholder="e.g., Introduction to Topic, Basic Concepts, Advanced Applications..."
                                value={form.ChaptersNameText}
                                onChange={(e) => {
                                    const text = e.target.value;
                                    const chapters = text
                                        .split(/[\n,]/)
                                        .map(item => item.trim())
                                        .filter(item => item.length > 0);
                                    setForm(prev => ({
                                        ...prev,
                                        ChaptersNameText: text,
                                        ChaptersName: chapters,
                                        NoOfChapters: chapters.length || 1
                                    }));
                                }}
                                className="w-full p-2 rounded bg-gray-700 text-blue-100 min-h-[100px]"
                                required
                            />                           <p className="text-sm text-blue-300 mt-1">
                                {form.ChaptersName.length} {form.ChaptersName.length === 1 ? 'chapter' : 'chapters'} added
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Enter each chapter on a new line or separate with commas
                            </p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-blue-200 mb-2" htmlFor="status">
                                Status
                            </label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-gray-700 text-blue-100"
                                required
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-blue-200 mb-2" htmlFor="notes">
                                Notes (optional)
                            </label>
                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                placeholder="Any additional notes about your learning goals..."
                                className="w-full p-2 rounded bg-gray-700 text-blue-100 min-h-[80px]"
                            />
                        </div>
                        {error && (
                            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200">
                                {error}
                            </div>
                        )}                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding...
                                </>
                            ) : (
                                'Add Learning'
                            )}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Add_Learning;