"use client";

import { useState, useEffect, useMemo } from "react";
import Add_Learning from "./learningModal";
import LearningDetailModal from "./learningDetailModal";

const LearningUI = () => {
    const [learningData, setLearningData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLearning, setSelectedLearning] = useState(null);

    const fetchLearnings = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/learnings");
            if (res.status === 404) {
                setLearningData([]);
                return;
            }
            if (!res.ok) throw new Error("Failed to fetch learnings");
            const data = await res.json();
            setLearningData(data);
        } catch (error) {
            console.error("Error fetching learning data:", error.message);
            setError("Failed to load learnings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLearnings();
    }, []);

    const learningList = useMemo(() => (
        learningData.map((learning) => {
            const completedChapters = learning.completedChapters || 0;
            const progress = Math.round((completedChapters / learning.NoOfChapters) * 100) || 0;

            return {
                ...learning,
                completedChapters,
                progressPercent: progress,
                stage: learning.status || (progress === 100 ? "Completed" : progress > 0 ? "In Progress" : "Not Started"),
                id: learning._id,
            };
        })
    ), [learningData]);

    const handleUpdateProgress = async (learning) => {
        try {
            const response = await fetch(`/api/learnings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ learningId: learning._id, task: 'updateProgress' }),
            });

            if (!response.ok) throw new Error('Failed to update progress');
            await fetchLearnings();
        } catch (error) {
            console.error('Error updating progress:', error);
            setError('Failed to update progress. Please try again.');
        }
    };

    return (
        <section className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-blue-600">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-blue-300">Learnings</h2>
                    {!loading && !error && (
                        <p className="text-blue-400 text-sm mt-1">
                            {learningList.length} {learningList.length === 1 ? 'course' : 'courses'} in progress
                        </p>
                    )}
                </div>
                <Add_Learning onLearningAdded={fetchLearnings} />
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200">
                    {error}
                    <button
                        onClick={fetchLearnings}
                        className="mt-2 text-sm underline hover:text-red-300"
                    >
                        Try again
                    </button>
                </div>
            ) : learningList.length === 0 ? (
                <div className="text-center py-10 bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600">
                    <h3 className="text-xl font-medium text-gray-400 mb-2">No learning courses yet</h3>
                    <p className="text-gray-500 mb-4">Start by adding your first learning course!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {learningList.map((learning) => (
                        <div
                            key={learning._id}
                            className="bg-gray-700 p-5 rounded-xl border border-gray-600 hover:border-blue-500 transition-all duration-200"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-semibold text-white line-clamp-2 break-words">
                                    {learning.title}
                                </h3>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${learning.stage === 'Completed' ? 'bg-green-900/50 text-green-300' :
                                    learning.stage === 'In Progress' ? 'bg-blue-900/50 text-blue-300' :
                                        'bg-gray-900/50 text-gray-300'
                                    }`}>
                                    {learning.stage}
                                </span>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between text-sm text-blue-300 mb-1">
                                    <span>Progress</span>
                                    <span>{Math.round(learning.progressPercent)}%</span>
                                </div>
                                <div className="w-full bg-gray-600 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${learning.progressPercent}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <p className="text-sm text-gray-300">
                                    {learning.completedChapters} of {learning.NoOfChapters} chapters completed
                                </p>
                                {learning.notes && (
                                    <p className="text-sm text-gray-400 italic line-clamp-3">
                                        "{learning.notes}"
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleUpdateProgress(learning)}
                                    disabled={learning.stage === 'Completed'}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                                             disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg 
                                             text-sm font-medium transition-colors duration-200"
                                >
                                    {learning.stage === 'Completed' ? 'Completed!' : 'Mark Next Chapter'}
                                </button>
                                <button
                                    onClick={() => setSelectedLearning(learning)}
                                    className="px-3 py-2 rounded-lg border border-blue-400 
                                             hover:bg-blue-500/10 text-sm font-medium transition-colors duration-200"
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selectedLearning && (
                <LearningDetailModal
                    learning={selectedLearning}
                    onClose={() => setSelectedLearning(null)}
                    onUpdate={(updatedLearning) => {
                        if (updatedLearning === null) {
                            setLearningData(prev =>
                                prev.filter(l => l._id !== selectedLearning._id)
                            );
                        } else {
                            setLearningData(prev =>
                                prev.map(l => l._id === updatedLearning._id ? updatedLearning : l)
                            );
                        }
                    }}
                />
            )}
        </section>
    );
};

export default LearningUI;