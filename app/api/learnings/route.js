import { NextResponse } from 'next/server';
import { Learning } from '@/models/data';
import connectDB from "@/config/db";

export async function GET() {
    try {
        await connectDB();
        const learnings = await Learning.find({});
        if (!learnings || learnings.length === 0) {
            return NextResponse.json({ message: 'No learnings found' }, { status: 404 });
        }
        return NextResponse.json(learnings);
    } catch (error) {
        console.error('Error fetching learnings:', error);
        return NextResponse.json({ error: 'Failed to fetch learnings' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();
        const { title, NoOfChapters, ChaptersName } = data;
        if (!title || !NoOfChapters || !ChaptersName) {
            console.error('Invalid input data:', data);
            return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
        }
        const newLearning = new Learning({
            title,
            NoOfChapters,
            ChaptersName,
            progress: 0,
            status: 'Not Started',
            notes: '',
        });
        await newLearning.save();
        console.log('New learning created:', newLearning);
        return NextResponse.json(newLearning, { status: 201 });
    } catch (error) {
        console.error('Error creating learning:', error);
        return NextResponse.json({ error: 'Failed to create learning' }, { status: 500 });
    }
}
