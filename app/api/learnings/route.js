import { NextResponse } from 'next/server';
import { Learning } from '@/models/data';
import connectDB from "@/config/db";

export async function GET(request) {
    try {
        await connectDB();
        
        // Get the URL instance from the request
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            // If ID is provided, fetch specific learning
            const learning = await Learning.findById(id);
            
            if (!learning) {
                return NextResponse.json(
                    { message: 'Learning not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json(learning);
        }

        // If no ID, fetch all learnings with sorting
        const learnings = await Learning
            .find({})
            .sort({ createdAt: -1 });

        if (!learnings || learnings.length === 0) {
            return NextResponse.json([], { status: 200 }); // Return empty array instead of 404
        }

        return NextResponse.json(learnings);
    } catch (error) {
        console.error('Error fetching learnings:', error);
        return NextResponse.json(
            { message: 'Error fetching learnings', error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();
        const { title, NoOfChapters, ChaptersName, status, notes } = data;
        
        if (!title || !NoOfChapters || !ChaptersName) {
            console.error('Invalid input data:', data);
            return NextResponse.json({ 
                error: 'Required fields missing: title, NoOfChapters, or ChaptersName' 
            }, { status: 400 });
        }

        const newLearning = new Learning({
            title,
            NoOfChapters,
            ChaptersName,
            progress: 0,
            status: status || 'Not Started',
            notes: notes || '',
        });
        await newLearning.save();
        console.log('New learning created:', newLearning);
        return NextResponse.json(newLearning, { status: 201 });
    } catch (error) {
        console.error('Error creating learning:', error);
        return NextResponse.json({ error: 'Failed to create learning' }, { status: 500 });
    }
}
