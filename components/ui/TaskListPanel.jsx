const TaskListPanel = ({
    title,
    tasks,
    loading,
    error,
    type,
    color,
    completeTask,
    loadingTaskId
}) => {
    const borderColor = {
        red: "border-red-600",
        green: "border-green-600",
        yellow: "border-yellow-600",
        blue: "border-blue-600",
        pink: "border-pink-600"
    }[color] || "border-gray-600";

    const textColor = {
        red: "text-red-400",
        green: "text-green-400",
        yellow: "text-yellow-400",
        blue: "text-blue-300",
        pink: "text-pink-400"
    }[color] || "text-gray-300";

    return (
        <div className={`bg-gray-800 p-6 rounded-xl shadow-md border ${borderColor}`}>
            <h2 className={`text-xl font-bold ${textColor} mb-3`}>{title}</h2>
            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : error ? (
                <p className="text-red-400">{error}</p>
            ) : tasks.length === 0 ? (
                <p className="text-gray-400">No tasks found</p>
            ) : (
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                    {tasks.slice(0, 5).map((task) => (
                        <li key={task._id} className="group flex items-center justify-between">
                            <span>{task.title}</span>
                            <button
                                onClick={() => completeTask(type, task._id)}
                                disabled={loadingTaskId === task._id}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 flex items-center gap-1 text-sm"
                            >
                                {loadingTaskId === task._id ? (
                                    <span className="inline-block animate-spin">↻</span>
                                ) : (
                                    <>✓ Done</>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TaskListPanel;