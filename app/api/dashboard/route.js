import { NextResponse } from 'next/server';
import { Project, Learning, Task } from '@/models/data';
import connectDB from '@/config/db';

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

        return NextResponse.json({ learnings, projects, procrastinating, deadline, nonNegotiable });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
