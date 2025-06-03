import { NextResponse } from 'next/server';
import { Project } from '@/models/data';
import connectDB from "@/config/db";

export async function GET(request) {
    try {
        await connectDB();

        // Get the URL instance from the request
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            // If ID is provided, fetch specific project
            const project = await Project.findById(id);

            if (!project) {
                return NextResponse.json(
                    { message: 'Project not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json(project);
        }

        // If no ID, fetch all projects with sorting
        const projects = await Project
            .find({})
            .sort({ createdAt: -1 });

        if (!projects || projects.length === 0) {
            return NextResponse.json([], { status: 200 }); // Return empty array instead of 404
        }

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { message: 'Error fetching projects', error: error.message },
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

        if (task === 'addProject') {
            console.log('Task is addProject, proceeding with creation');

            const { title, description, startDate, deadline, status, modules, notes } = data;

            const newProject = new Project({
                title,
                description,
                startDate,
                deadline,
                status: status || 'Planning',
                modules: modules || [],
                progress: [0], // Initial progress
                notes: notes || '',
            });
            await newProject.save();
            console.log('New project created');
            return NextResponse.json(newProject, { status: 201 });
        }

        if (task === 'updateProject') {
            console.log('Task is updateProject, proceeding with update');
            const { projectId, title, description, startDate, deadline, status, modules, progress, notes } = data;

            if (!projectId) {
                return NextResponse.json({ error: 'Project ID is required for update' }, { status: 400 });
            }

            const updatedProject = await Project.findByIdAndUpdate(
                projectId,
                {
                    title,
                    description,
                    startDate,
                    deadline,
                    status,
                    modules,
                    progress,
                    notes,
                },
                { new: true }
            );

            if (!updatedProject) {
                return NextResponse.json(
                    { message: 'Project not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json(updatedProject);
        }

        if (task === 'deleteProject') {
            console.log('Task is deleteProject, proceeding with deletion');
            const { projectId } = data;

            if (!projectId) {
                return NextResponse.json({ error: 'Project ID is required for deletion' }, { status: 400 });
            }

            const deletedProject = await Project.findByIdAndDelete(projectId);

            if (!deletedProject) {
                return NextResponse.json(
                    { message: 'Project not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({ message: 'Project deleted successfully' });
        }

        return NextResponse.json({ error: 'Invalid task' }, { status: 400 });
    } catch (error) {
        console.error('Error processing project operation:', error);
        return NextResponse.json(
            { message: 'Error processing project operation', error: error.message },
            { status: 500 }
        );
    }
}
