// --- Imports ---
import { NextResponse } from 'next/server';
import { Learning } from '@/models/data';
import connectDB from '@/config/db';
import { errorResponse, successResponse } from '../utils';

// --- Utility Functions ---
const getLearningById = async (id) => {
    if (!id) throw new Error('Learning ID is required');
    const learning = await Learning.findById(id);
    if (!learning) throw new Error('Learning not found');
    return learning;
};

const validateFields = (fields, data) => {
    for (const field of fields) {
        if (data[field] === undefined || data[field] === null) {
            throw new Error(`${field} is required`);
        }
    }
};

// --- Handlers ---
const taskHandlers = {
    // Add a new learning
    async addLearning(data) {
        validateFields(['title', 'NoOfChapters', 'ChaptersName'], data);
        const { title, NoOfChapters, ChaptersName, status, notes } = data;
        const progress = Array(NoOfChapters).fill(0);
        const newLearning = new Learning({
            title,
            NoOfChapters,
            ChaptersName,
            progress,
            status: status || 'Not Started',
            notes: notes || '',
        });
        await newLearning.save();
        return NextResponse.json(successResponse(newLearning, 201).json, { status: 201 });
    },

    // Update an existing learning
    async updateLearning(data) {
        const { learningId, ...updateFields } = data;
        if (!learningId) {
            return NextResponse.json(errorResponse('Learning ID is required', 400).json, { status: 400 });
        }
        const updated = await Learning.findByIdAndUpdate(
            learningId,
            { ...updateFields, updatedAt: new Date() },
            { new: true }
        );
        if (!updated) return NextResponse.json(errorResponse('Not found', 404).json, { status: 404 });
        return NextResponse.json(successResponse(updated).json);
    },

    // Delete a learning
    async deleteLearning(data) {
        const { learningId } = data;
        if (!learningId) return NextResponse.json(errorResponse('ID required', 400).json, { status: 400 });
        const deleted = await Learning.findByIdAndDelete(learningId);
        if (!deleted) return NextResponse.json(errorResponse('Not found', 404).json, { status: 404 });
        return NextResponse.json(successResponse({ message: 'Deleted successfully' }).json);
    },

    // Mark current chapter as completed and update progress
    async updateProgress(data) {
        const { learningId } = data;
        try {
            const learning = await getLearningById(learningId);
            if (learning.progress[learning.currentChapterIndex] !== 1) {
                learning.progress[learning.currentChapterIndex] = 1;
                learning.completedChapters += 1;
            }
            if (learning.completedChapters >= learning.NoOfChapters) {
                learning.status = 'Completed';
                learning.currentChapterIndex = learning.NoOfChapters;
            } else {
                if (learning.status === 'Not Started') {
                    learning.status = 'In Progress';
                }
                learning.currentChapterIndex = learning.progress.findIndex((val) => val === 0);
            }
            learning.status =
                learning.completedChapters === learning.NoOfChapters
                    ? 'Completed'
                    : 'In Progress';
            await learning.save();
            // Update performance after learning progress update
            try {
                const { updatePerformance } = await import("@/config/updatePerformance");
                await updatePerformance('learning', 'chapterCompleted', { learningId });
            } catch (perfErr) {
                console.error('Failed to update performance:', perfErr);
            }
            return NextResponse.json(successResponse(learning).json);
        } catch (err) {
            return NextResponse.json(errorResponse(err.message, 400).json, { status: 400 });
        }
    },

    // Mark a chapter as not completed
    async uncompleteProgress(data) {
        const { learningId, chapterIndex } = data;
        try {
            const learning = await getLearningById(learningId);
            if (learning.progress[chapterIndex] === 1) {
                learning.progress[chapterIndex] = 0;
                learning.completedChapters -= 1;
            }
            learning.currentChapterIndex = learning.progress.findIndex(ch => ch === 0);
            learning.status = learning.completedChapters === 0 ? 'Not Started' : 'In Progress';
            await learning.save();
            return NextResponse.json(successResponse(learning).json);
        } catch (err) {
            return NextResponse.json(errorResponse(err.message, 400).json, { status: 400 });
        }
    },

    // Set a specific chapter as completed
    async setLearningProgress(data) {
        const { learningId, chapterIndex } = data;
        try {
            const learning = await getLearningById(learningId);
            if (learning.progress[chapterIndex] === 0) learning.completedChapters += 1;
            learning.progress[chapterIndex] = 1;
            if (!(learning.completedChapters >= learning.NoOfChapters)) {
                learning.currentChapterIndex = learning.progress.findIndex(ch => ch === 0);
            }
            learning.status =
                learning.completedChapters === learning.NoOfChapters
                    ? 'Completed'
                    : 'In Progress';
            await learning.save();
            // Update performance after learning progress update
            try {
                const { updatePerformance } = await import("@/config/updatePerformance");
                await updatePerformance('learning', 'chapterCompleted', { learningId });
            } catch (perfErr) {
                console.error('Failed to update performance:', perfErr);
            }
            return NextResponse.json(successResponse(learning).json);
        } catch (err) {
            return NextResponse.json(errorResponse(err.message, 400).json, { status: 400 });
        }
    },
};

// --- API Route Handlers ---

// GET: Fetch all learnings or a specific learning by ID
export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (id) {
            const learning = await Learning.findById(id).lean();
            if (!learning) return NextResponse.json(errorResponse('Not found', 404).json, { status: 404 });
            // Add derived fields for single learning
            const completedChapters = learning.completedChapters || 0;
            const progressPercent = Math.round((completedChapters / learning.NoOfChapters) * 100) || 0;
            const stage = learning.status || (progressPercent === 100 ? 'Completed' : progressPercent > 0 ? 'In Progress' : 'Not Started');
            return NextResponse.json(successResponse({
                ...learning,
                completedChapters,
                progressPercent,
                stage,
                id: learning._id,
            }).json);
        }
        const learnings = await Learning.find({}).sort({ createdAt: -1 }).lean();
        // Add derived fields for each learning
        const processed = learnings.map(learning => {
            const completedChapters = learning.completedChapters || 0;
            const progressPercent = Math.round((completedChapters / learning.NoOfChapters) * 100) || 0;
            const stage = learning.status || (progressPercent === 100 ? 'Completed' : progressPercent > 0 ? 'In Progress' : 'Not Started');
            return {
                ...learning,
                completedChapters,
                progressPercent,
                stage,
                id: learning._id,
            };
        });
        return NextResponse.json(successResponse(processed).json);
    } catch (error) {
        return NextResponse.json(errorResponse(error.message, 500).json, { status: 500 });
    }
}

// POST: Handle various learning-related tasks
export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();
        const { task } = data;
        if (!taskHandlers[task]) {
            return NextResponse.json(errorResponse('Unknown task', 400).json, { status: 400 });
        }
        return await taskHandlers[task](data);
    } catch (error) {
        console.error('Error in learning route:', error);
        return NextResponse.json(errorResponse(error.message, 500).json, { status: 500 });
    }
}
