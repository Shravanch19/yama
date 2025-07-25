"use client";
import React, { useState, useCallback } from "react";

const LearningDetailModal = ({ learning, onClose, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        title: learning.title,
        NoOfChapters: learning.NoOfChapters,
        ChaptersName: learning.ChaptersName,
        status: learning.status,
        progress: learning.progress,
        currentChapterIndex: learning.currentChapterIndex,
        completedChapters: learning.completedChapters,
        notes: learning.notes || "",
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "NoOfChapters" ? parseInt(value) || 0 : value,
        }));
    }, []);

    const handleChapterChange = useCallback((index, newValue) => {
        setForm((prev) => {
            const updatedChapters = [...prev.ChaptersName];
            updatedChapters[index] = newValue;
            return {
                ...prev,
                ChaptersName: updatedChapters,
            };
        });
    }, []);

    const handleAddChapter = () => {
        setForm((prev) => ({
            ...prev,
            NoOfChapters: prev.NoOfChapters + 1,
            ChaptersName: [...prev.ChaptersName, `Chapter ${prev.NoOfChapters + 1}`],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const updatedForm = { ...form };

            if (form.status === "Completed") {
                updatedForm.completedChapters = form.NoOfChapters;
                updatedForm.progress = Array(form.NoOfChapters).fill(1);
                updatedForm.currentChapterIndex = form.NoOfChapters - 1;
            } else {
                updatedForm.completedChapters = 0;
                updatedForm.progress = Array(form.NoOfChapters).fill(0);
                updatedForm.currentChapterIndex = 0;
            }

            const response = await fetch("/api/learnings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...updatedForm, task: "updateLearning", learningId: learning._id }),
            });

            if (!response.ok) throw new Error("Failed to update learning");

            const updatedLearning = await response.json();
            onUpdate(updatedLearning);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    const handleChapterProgress = async (chapterIndex, isComplete = false) => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch("/api/learnings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    learningId: learning._id,
                    chapterIndex,
                    task: !isComplete ? "setLearningProgress" : "uncompleteProgress",
                }),
            });

            if (!response.ok) throw new Error("Failed to update progress");

            const updatedLearning = await response.json();
            onUpdate(updatedLearning);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this learning?")) return;
        setLoading(true);
        try {
            const response = await fetch("/api/learnings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ learningId: learning._id, task: "deleteLearning" }),
            });

            if (!response.ok) throw new Error("Failed to delete learning");

            onUpdate(null);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-blue-600 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-blue-300">
                        {isEditing ? "Edit Learning" : "Learning Details"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-blue-200 hover:text-blue-400 transition"
                        aria-label="Close"
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

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-blue-200 mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-gray-700 text-blue-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-blue-200 mb-2">Chapters</label>
                            {form.ChaptersName.map((chapter, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={chapter}
                                        onChange={(e) => handleChapterChange(index, e.target.value)}
                                        className="flex-1 p-2 rounded bg-gray-700 text-blue-100"
                                        required
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddChapter}
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Add Chapter
                            </button>
                        </div>

                        <div>
                            <label className="block text-blue-200 mb-2">Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-gray-700 text-blue-100"
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-blue-200 mb-2">Notes</label>
                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-gray-700 text-blue-100 min-h-[100px]"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 rounded border border-blue-500 text-blue-400 hover:bg-blue-500/10"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-800"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">{learning.title}</h3>
                            <div>
                                <span
                                    className={`px-2 py-1 rounded text-sm ${
                                        learning.status === "Completed"
                                            ? "bg-green-900/50 text-green-300"
                                            : learning.status === "In Progress"
                                            ? "bg-blue-900/50 text-blue-300"
                                            : "bg-gray-900/50 text-gray-300"
                                    }`}
                                >
                                    {learning.status}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-blue-200 font-medium mb-2">Progress</h4>
                            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                                <div
                                    className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${(learning.completedChapters / learning.NoOfChapters) * 100}%`,
                                    }}
                                />
                            </div>
                            <p className="text-sm text-gray-400">
                                {learning.completedChapters} of {learning.NoOfChapters} chapters completed
                            </p>
                        </div>

                        <div>
                            <h4 className="text-blue-200 font-medium mb-2">Chapters</h4>
                            <div className="space-y-2">
                                {learning.ChaptersName.map((chapter, index) => {
                                    const isCompleted = learning.completedChapters >= index + 1;
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                                        >
                                            <span className="text-white">{chapter}</span>
                                            <div className="flex gap-2">
                                                {isCompleted ? (
                                                    <button
                                                        onClick={() => handleChapterProgress(index, true)}
                                                        disabled={loading}
                                                        className="px-3 py-1 rounded text-sm bg-green-600/50 text-green-200 hover:bg-green-700/50 transition"
                                                    >
                                                        ✓ Mark Uncomplete
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleChapterProgress(index)}
                                                        disabled={loading}
                                                        className="px-3 py-1 rounded text-sm bg-blue-600 hover:bg-blue-700 text-white transition"
                                                    >
                                                        Mark Complete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {learning.notes && (
                            <div>
                                <h4 className="text-blue-200 font-medium mb-2">Notes</h4>
                                <p className="text-gray-300 bg-gray-700/50 p-3 rounded">{learning.notes}</p>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded bg-red-600/50 text-red-200 hover:bg-red-600/70 disabled:opacity-50 transition"
                                disabled={loading}
                            >
                                {loading ? "Deleting..." : "Delete Learning"}
                            </button>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                disabled={loading}
                            >
                                Edit Learning
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningDetailModal;
