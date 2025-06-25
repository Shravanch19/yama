// scoreConfig.js
export const scoreConfig = {
    task: {
        completed: 10,
        procrastinated: -5
    },
    project: {
        moduleCompleted: 20,
        taskCompleted: 8,
        highPriorityTaskCompleted: 12,
        delayedTask: -6
    },
    learning: {
        chapterCompleted: 5,
        sessionSkipped: -4
    },
    dailyInput: {
        wokeUpEarly: 5,
        meditated: 3,
        wastedTime: (minutes) => -Math.floor(minutes / 10)
    }
};