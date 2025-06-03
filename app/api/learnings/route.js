import { NextResponse } from 'next/server';
import { Learning } from '@/models/data';
import connectDB from '@/config/db';

const getLearningById = async (id) => {
    const learning = await Learning.findById(id);
    if (!learning) throw new Error('Learning not found');
    return learning;
};

const taskHandlers = {
    async addLearning(data) {
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
        return NextResponse.json(newLearning, { status: 201 });
    },

    async updateLearning(data) {
        const { learningId, ...updateFields } = data;
        if (!learningId) {
            return NextResponse.json({ error: 'Learning ID is required' }, { status: 400 });
        }
        const updated = await Learning.findByIdAndUpdate(
            learningId,
            { ...updateFields, updatedAt: new Date() },
            { new: true }
        );
        if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(updated);
    },

    async deleteLearning(data) {
        const { learningId } = data;
        if (!learningId) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        const deleted = await Learning.findByIdAndDelete(learningId);
        if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ message: 'Deleted successfully' });
    },

    async updateProgress(data) {
        const { learningId } = data;
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
        return NextResponse.json(learning);
    },

    async uncompleteProgress(data) {
        const { learningId, chapterIndex } = data;
        const learning = await getLearningById(learningId);
        learning.progress[chapterIndex] = 0;
        learning.completedChapters -= 1;
        learning.currentChapterIndex = learning.progress.findIndex(ch => ch === 0);
        learning.status = learning.completedChapters === 0 ? 'Not Started' : 'In Progress';
        await learning.save();
        return NextResponse.json(learning);
    },

    async setLearningProgress(data) {
        const { learningId, chapterIndex } = data;
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
        return NextResponse.json(learning);
    },
};

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (id) {
            const learning = await Learning.findById(id);
            if (!learning) return NextResponse.json({ message: 'Not found' }, { status: 404 });
            return NextResponse.json(learning);
        }
        const learnings = await Learning.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(learnings);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();
        const { task } = data;
        if (!taskHandlers[task]) {
            return NextResponse.json({ error: 'Unknown task' }, { status: 400 });
        }
        return await taskHandlers[task](data);
    } catch (error) {
        console.error('Error in learning route:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
