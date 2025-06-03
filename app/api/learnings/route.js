import { NextResponse } from 'next/server';
import { Learning } from '@/models/data';
import connectDB from "@/config/db";
import next from 'next';

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
        const { task } = data;

        if (!task) {
            console.error('Task is required but not provided:', data);
            return NextResponse.json({
                error: 'Task is required'
            }, { status: 400 });
        }
        else if (task == 'addLearning') {
            console.log('Task is addLearning, proceeding with creation');

            const { title, NoOfChapters, ChaptersName, status, notes } = data;

            // create a array named progress of length NoOfChapters with all values as 0
            const progress = Array(NoOfChapters).fill(0);

            const newLearning = new Learning({
                title,
                NoOfChapters,
                ChaptersName,
                progress: progress,
                currentChapterIndex: 0,
                completedChapters: 0,
                status: status || 'Not Started',
                notes: notes || '',
            });
            await newLearning.save();
            console.log('New learning created:');
            return NextResponse.json(newLearning, { status: 201 });
        }
        else if(task == 'updateLearning') {
            console.log('Task is updateLearning, proceeding with update');
            const { learningId, title, NoOfChapters, ChaptersName, progress, currentChapterIndex, completedChapters, status, notes } = data;

            if (!learningId) {
                return NextResponse.json({ error: 'Learning ID is required for update' }, { status: 400 });
            }

            const updatedLearning = await Learning.findByIdAndUpdate(
                learningId,
                {
                    title,
                    NoOfChapters,
                    ChaptersName,
                    progress,
                    currentChapterIndex,
                    completedChapters,
                    status: status || 'Not Started',
                    notes: notes || '',
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (!updatedLearning) {
                return NextResponse.json({ error: 'Learning not found' }, { status: 404 });
            }

            console.log('Learning updated:', updatedLearning);
            return NextResponse.json(updatedLearning, { status: 200 });
        }
        else if(task == 'deleteLearning') {
            console.log('Task is deleteLearning, proceeding with deletion');
            const { learningId } = data;

            if (!learningId) {
                return NextResponse.json({ error: 'Learning ID is required for deletion' }, { status: 400 });
            }

            const deletedLearning = await Learning.findByIdAndDelete(learningId);

            if (!deletedLearning) {
                return NextResponse.json({ error: 'Learning not found' }, { status: 404 });
            }

            console.log('Learning deleted:', deletedLearning);
            return NextResponse.json({ message: 'Learning deleted successfully' }, { status: 200 });
        }
        else if (task == 'updateProgress') {
            console.log('Task is updateProgress, proceeding with progress update');
            const { learningId } = data;

            if (!learningId) {
                return NextResponse.json({ error: 'Learning ID is required for progress update' }, { status: 400 });
            }

            const learning = await Learning.findById(learningId);
            if (!learning) {
                return NextResponse.json({ error: 'Learning not found' }, { status: 404 });
            }

            let progress = learning.progress;
            let chaptersLength = learning.NoOfChapters;
            let currentChapterIndex = learning.currentChapterIndex;
            let completedChapters = learning.completedChapters;

            progress[currentChapterIndex] = 1;
            currentChapterIndex += 1;
            completedChapters += 1;

            if(learning.status === 'Not Started') {
                learning.status = 'In Progress';
            }

            if(completedChapters === chaptersLength) {
                learning.status = 'Completed';
            }

            learning.progress = progress;
            learning.currentChapterIndex = currentChapterIndex;
            learning.completedChapters = completedChapters;
            learning.updatedAt = new Date();

            await learning.save();

            console.log('Learning progress updated:', learning);
            return NextResponse.json(learning, { status: 200 });
        } 
        else if (task == 'uncompleteProgress') {
            console.log('Task is uncompleteProgress, proceeding with uncomplete');
            const { learningId, chapterIndex } = data;

            if (!learningId) {
                return NextResponse.json({ error: 'Learning ID is required for uncomplete' }, { status: 400 });
            }

            const learning = await Learning.findById(learningId);
            if (!learning) {
                return NextResponse.json({ error: 'Learning not found' }, { status: 404 });
            }

            let progress = learning.progress;
            let currentChapterIndex = learning.currentChapterIndex;
            let completedChapters = learning.completedChapters;

            progress[chapterIndex] = 0;
            completedChapters -= 1;
            currentChapterIndex = progress.findIndex((chapter) => chapter === 0);

            if(completedChapters === 0) {
                learning.status = 'Not Started';
            } else {
                learning.status = 'In Progress';
            }

            learning.progress = progress;
            learning.currentChapterIndex = currentChapterIndex;
            learning.completedChapters = completedChapters;

            await learning.save();

            console.log('Learning progress uncompleted:', learning);
            return NextResponse.json(learning, { status: 200 });
        }
        else if (task == 'setLearningProgress') {
            console.log('Task is setLearningProgress, proceeding with setting progress');
            const { learningId, chapterIndex } = data;

            if (!learningId) {
                return NextResponse.json({ error: 'Learning ID is required for setting progress' }, { status: 400 });
            }

            const learning = await Learning.findById(learningId);
            if (!learning) {
                return NextResponse.json({ error: 'Learning not found' }, { status: 404 });
            }

            learning.progress[chapterIndex] = 1; // Set the specified chapter as completed
            learning.completedChapters += 1; // Increment completed chapters count
            if (learning.status === 'Not Started') {
                learning.status = 'In Progress'; // Change status if it was not started
            } else if (learning.completedChapters === learning.NoOfChapters) {
                learning.status = 'Completed'; // Change status to completed if all chapters are done
            }
            learning.currentChapterIndex = learning.progress.findIndex((chapter) => chapter === 0);
            learning.updatedAt = new Date(); // Update the timestamp

            await learning.save();

            console.log('Learning progress set:', learning);
            return NextResponse.json(learning, { status: 200 });

        } else {
            console.error('Unknown task:', task);
            return NextResponse.json({ error: 'Unknown task' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error creating learning:', error);
        return NextResponse.json({ error: 'Failed to create learning' }, { status: 500 });
    }
}
