import { NextResponse } from 'next/server';
import { Project, Learning, Task } from '@/models/data';
import connectDB from '@/config/db';
import { errorResponse, successResponse } from '../utils';

export async function GET() {
    try {
        await connectDB();

        const [learnings, projects, procrastinating, deadline, nonNegotiable] = await Promise.all([
            Learning.find({}).sort({ createdAt: -1 }).lean(),
            Project.find({}).sort({ createdAt: -1 }).lean(),
            Task.find({ type: "procrastinating", status: { $ne: "completed" } }).sort({ createdAt: -1 }).lean(),
            Task.find({ type: "deadline", status: { $ne: "completed" } }).sort({ createdAt: -1 }).lean(),
            Task.find({ type: "nonNegotiable", status: { $ne: "completed" } }).sort({ createdAt: -1 }).lean()
        ]);

        return NextResponse.json(successResponse({ learnings, projects, procrastinating, deadline, nonNegotiable }).json);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(errorResponse(error.message, 500).json, { status: 500 });
    }
}
