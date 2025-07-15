// updatePerformance.js
import { Performance } from '@/models/data';
import { scoreConfig } from '@/models/scoreConfig';

export async function updatePerformance(type, action, data = {}) {
    const todayDate = new Date(new Date().toDateString());

    const performanceDoc = await Performance.findOneAndUpdate(
        {},
        {},
        { upsert: true, new: true }
    );

    
    let score = 0;
    let bad = null;

    switch (type) {
        case 'task':
            if (action === 'completed') score = scoreConfig.task.completed;
            if (action === 'procrastinated') {
                score = scoreConfig.task.procrastinated;
                bad = { name: 'Procrastinated Task', score };
            }
            break;
        case 'project':
            if (action === 'moduleCompleted') score = scoreConfig.project.moduleCompleted;
            if (action === 'taskCompleted') score = scoreConfig.project.taskCompleted;
            if (action === 'highPriorityTaskCompleted') score = scoreConfig.project.highPriorityTaskCompleted;
            if (action === 'delayedTask') {
                score = scoreConfig.project.delayedTask;
                bad = { name: 'Delayed Task', score };
            }
            break;
        case 'learning':
            if (action === 'chapterCompleted') score = scoreConfig.learning.chapterCompleted;
            if (action === 'sessionSkipped') {
                score = scoreConfig.learning.sessionSkipped;
                bad = { name: 'Skipped Learning', score };
            }
            break;
        case 'dailyInput':
            if (action === 'wokeUpEarly') score = scoreConfig.dailyInput.wokeUpEarly;
            if (action === 'meditated') score = scoreConfig.dailyInput.meditated;
            if (action === 'wastedTime') {
                score = scoreConfig.dailyInput.wastedTime(data.minutes);
                bad = { name: 'Wasted Time', score };
            }
            break;
    }

    performanceDoc.performance += score;

    let todayRecord = performanceDoc.record.find(r => new Date(r.date).toDateString() === todayDate.toDateString());

    if (!todayRecord) {
        todayRecord = { date: todayDate, tasks: [{ good: 0, bad: [] }] };
        performanceDoc.record.push(todayRecord);
    }

    const taskEntry = todayRecord.tasks[0];
    if (score > 0) {
        taskEntry.good += score;
    } else if (score < 0 && bad) {
        taskEntry.bad.push(bad);
    }

    await performanceDoc.save();
    return { score, performance: performanceDoc.performance };
}
