import { NextResponse } from 'next/server';
import { Learning } from '@/models/data';
import connectDB from "@/config/db";

export async function PUT(request, { params }) {
    try {
        await connectDB();
          const learningId = await params.learningId;
        const { chapterIndex, uncomplete } = await request.json();

        const learning = await Learning.findById(learningId);
        if (!learning) {
            return NextResponse.json(
                { message: 'Learning not found' },
                { status: 404 }
            );
        }

        let progress = learning.progress;
        let chaptersLength = learning.NoOfChapters;

        if (uncomplete) {
            // When uncompleting a chapter, reduce progress if it's greater than the chapter being uncompleted
            if (progress > chapterIndex + 1) {
                progress = chapterIndex + 1;
            }
        } else {
            // When completing a chapter, increase progress if it's at or below the chapter being completed
            if (progress <= chapterIndex + 1) {
                progress = chapterIndex + 2; // Add 1 to chapterIndex (0-based) and 1 more for the new completion
            }
        }

        // Ensure progress stays within bounds
        if (progress < 0) progress = 0;
        if (progress > chaptersLength) progress = chaptersLength;

        learning.progress = progress;

        // Update status based on progress
        if (progress === 0) {
            learning.status = 'Not Started';
        } else if (progress === chaptersLength) {
            learning.status = 'Completed';
        } else {
            learning.status = 'In Progress';
        }
        await learning.save();

        return NextResponse.json(learning);
    } catch (error) {
        console.error('Error updating learning progress:', error);
        return NextResponse.json(
            { message: 'Error updating learning progress', error: error.message },
            { status: 500 }
        );
    }
}
