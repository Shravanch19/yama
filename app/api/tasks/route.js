import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { Task } from '@/models/data';
import { errorResponse, successResponse } from '../utils';
import { formatDistanceToNow, isBefore } from 'date-fns';

// --- Utility Functions ---
function normalizeToMidnight(date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function logError(context, error) {
    console.error(`[Task API] ${context}:`, error);
}

async function ensureDB() {
    try {
        await connectDB();
    } catch (err) {
        throw new Error('Database connection failed');
    }
}

// Reset daily tracking for non-negotiable tasks if needed
async function resetNonNegotiableTasksIfNeeded() {
    const today = normalizeToMidnight();
    const tasksToReset = await Task.find({
        type: 'nonNegotiable',
        lastResetDate: { $lt: today }
    });
    for (const task of tasksToReset) {
        task.dailyTracking.push({ date: today, completed: false });
        task.lastResetDate = today;
        await task.save();
    }
}

// --- GET: Fetch Tasks ---
export async function GET(request) {
    try {
        await ensureDB();
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        let query = {};
        if (type) query.type = type;

        if (type === 'nonNegotiable') {
            await resetNonNegotiableTasksIfNeeded();
        } else {
            // Only fetch non-completed tasks by default
            query.status = { $ne: 'completed' };
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 }).lean();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const processed = tasks.map(task => {
            // isCompletedForToday
            let isCompletedForToday = false;
            if (task.dailyTracking && Array.isArray(task.dailyTracking)) {
                isCompletedForToday = task.dailyTracking.some(d => {
                    const dDate = new Date(d.date);
                    dDate.setHours(0, 0, 0, 0);
                    return dDate.getTime() === today.getTime() && d.completed;
                });
            }
            // daysCompleted (for nonNegotiable)
            let daysCompleted = 0;
            if (task.type === 'nonNegotiable' && task.dailyTracking && Array.isArray(task.dailyTracking)) {
                daysCompleted = task.dailyTracking.filter(d => d.completed).length;
            }
            // Deadline task fields
            let isOverdue = false;
            let timeRemaining = null;
            let urgencyColor = null;
            if (task.type === 'deadline' && task.deadline) {
                const deadlineDate = new Date(task.deadline);
                isOverdue = isBefore(deadlineDate, new Date());
                timeRemaining = formatDistanceToNow(deadlineDate, { addSuffix: true });
                urgencyColor = isOverdue
                    ? 'bg-red-800 text-red-100'
                    : deadlineDate.getTime() - Date.now() < 1000 * 60 * 60 * 24
                    ? 'bg-yellow-600 text-yellow-100'
                    : 'bg-green-700 text-green-100';
            }
            return {
                ...task,
                isCompletedForToday,
                daysCompleted,
                isOverdue,
                timeRemaining,
                urgencyColor,
            };
        });
        return NextResponse.json(successResponse(processed).json);
    } catch (error) {
        logError('GET', error);
        return NextResponse.json(errorResponse('Failed to fetch tasks', 500).json, { status: 500 });
    }
}

// --- POST: Create New Task ---
export async function POST(request) {
    try {
        await ensureDB();
        const { type, task } = await request.json();
        const today = normalizeToMidnight();
        const newTask = new Task({
            title: task.title,
            type,
            deadline: task.deadline || null,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            ...(type === 'nonNegotiable' && {
                lastResetDate: today,
                dailyTracking: [{ date: today, completed: false }]
            })
        });
        await newTask.save();
        return NextResponse.json(successResponse(newTask).json);
    } catch (error) {
        logError('POST', error);
        return NextResponse.json(errorResponse('Failed to create task', 500).json, { status: 500 });
    }
}

// --- PUT: Update Task ---
export async function PUT(request) {
    try {
        await ensureDB();
        const { type, taskId, status } = await request.json();
        if (!taskId) {
            return NextResponse.json(errorResponse('Task ID is required', 400).json, { status: 400 });
        }

        if (type === 'nonNegotiable') {
            const today = normalizeToMidnight();
            const task = await Task.findById(taskId);
            if (!task) {
                return NextResponse.json(errorResponse('Task not found', 404).json, { status: 404 });
            }
            // Find today's tracking entry
            const todayTracking = task.dailyTracking?.find(
                track => normalizeToMidnight(track.date).getTime() === today.getTime()
            );
            let updateOperation;
            if (!todayTracking) {
                // Add new entry for today
                updateOperation = {
                    $push: { dailyTracking: { date: today, completed: true } },
                    $set: { lastResetDate: today, updatedAt: new Date() }
                };
            } else {
                // Update today's entry
                updateOperation = {
                    $set: { 'dailyTracking.$[elem].completed': true, updatedAt: new Date() }
                };
            }
            const updatedTask = await Task.findByIdAndUpdate(
                taskId,
                updateOperation,
                {
                    arrayFilters: todayTracking ? [{ 'elem.date': today }] : undefined,
                    new: true
                }
            );
            return NextResponse.json(successResponse(updatedTask).json);
        }

        // Regular task update
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { status, updatedAt: new Date() },
            { new: true }
        );
        if (!updatedTask) {
            return NextResponse.json(errorResponse('Task not found', 404).json, { status: 404 });
        }
        // Update performance after task update
        try {
            const { updatePerformance } = await import('@/config/updatePerformance');
            await updatePerformance('task', status, { taskId });
        } catch (perfErr) {
            logError('PUT (updatePerformance)', perfErr);
        }
        return NextResponse.json(successResponse(updatedTask).json);
    } catch (error) {
        logError('PUT', error);
        return NextResponse.json(errorResponse('Failed to update task', 500).json, { status: 500 });
    }
}

// --- DELETE: Remove Task ---
export async function DELETE(request) {
    try {
        await ensureDB();
        const { searchParams } = new URL(request.url);
        const taskId = searchParams.get('id');
        if (!taskId) {
            return NextResponse.json(errorResponse('Task ID is required', 400).json, { status: 400 });
        }
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return NextResponse.json(errorResponse('Task not found', 404).json, { status: 404 });
        }
        return NextResponse.json(successResponse({ message: 'Task deleted successfully' }).json);
    } catch (error) {
        logError('DELETE', error);
        return NextResponse.json(errorResponse('Failed to delete task', 500).json, { status: 500 });
    }
}
