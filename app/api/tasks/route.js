import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { Task } from '@/models/data';

// GET route to fetch tasks
export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        let query = {};
        if (type) {
            query.type = type;
        }

        // For non-negotiable tasks, we need to check and reset daily status
        if (type === 'nonNegotiable') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Find tasks that need to be reset (haven't been reset today)
            const tasksToReset = await Task.find({
                type: 'nonNegotiable',
                lastResetDate: { $lt: today }
            });

            // Reset daily tracking for these tasks
            for (const task of tasksToReset) {
                task.dailyTracking.push({
                    date: today,
                    completed: false
                });
                task.lastResetDate = today;
                await task.save();
            }
        }

        // Only fetch non-completed tasks by default
        if (type !== 'nonNegotiable') {
            query.status = { $ne: 'completed' };
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 });
        return NextResponse.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}

// POST route to create new task
export async function POST(request) {
    try {
        await connectDB();
        const { type, task } = await request.json();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const newTask = new Task({
            title: task.title,
            type,
            deadline: task.deadline || null,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            // Initialize non-negotiable task fields if applicable
            ...(type === 'nonNegotiable' && {
                lastResetDate: today,
                dailyTracking: [{
                    date: today,
                    completed: false
                }]
            })
        });

        await newTask.save();
        return NextResponse.json(newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json(
            { error: 'Failed to create task' },
            { status: 500 }
        );
    }
}

// PUT route to update task
export async function PUT(request) {
    try {
        await connectDB();
        const { type, taskId, status } = await request.json();

        if (type === 'nonNegotiable') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // First check if the task exists and get its current state
            const task = await Task.findById(taskId);
            if (!task) {
                return NextResponse.json(
                    { error: 'Task not found' },
                    { status: 404 }
                );
            }

            // Check if we need to initialize or update today's tracking
            const todayTracking = task.dailyTracking?.find(
                track => new Date(track.date).getTime() === today.getTime()
            );

            let updateOperation;
            if (!todayTracking) {
                // If no tracking exists for today, add a new entry
                updateOperation = {
                    $push: {
                        dailyTracking: {
                            date: today,
                            completed: true
                        }
                    },
                    $set: {
                        lastResetDate: today,
                        updatedAt: new Date()
                    }
                };
            } else {
                // Update existing tracking for today
                updateOperation = {
                    $set: {
                        'dailyTracking.$[elem].completed': true,
                        updatedAt: new Date()
                    }
                };
            }

            const updatedTask = await Task.findByIdAndUpdate(
                taskId,
                updateOperation,
                {
                    arrayFilters: todayTracking ? [{ 
                        'elem.date': today 
                    }] : undefined,
                    new: true
                }
            );
            
            return NextResponse.json(updatedTask);
        }

        // Handle regular task updates
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            {
                status,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedTask) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json(
            { error: 'Failed to update task' },
            { status: 500 }
        );
    }
}

// DELETE route to remove task
export async function DELETE(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        console.log(searchParams);
        const taskId = searchParams.get('id');
        console.log(taskId);
        

        if (!taskId) {
            return NextResponse.json(
                { error: 'Task ID is required' },
                { status: 400 }
            );
        }

        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json(
            { error: 'Failed to delete task' },
            { status: 500 }
        );
    }
}
