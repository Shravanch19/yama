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
            return NextResponse.json({
                error: 'Task type is required'
            }, { status: 400 });
        }

        if (task === 'addProject') {
            const { 
                title, 
                description, 
                startDate, 
                deadline, 
                status, 
                modules, 
                notes, 
                priority 
            } = data;

            // Validate required fields
            if (!title || !startDate || !deadline) {
                return NextResponse.json({
                    error: 'Title, start date, and deadline are required'
                }, { status: 400 });
            }

            // Validate and process modules if provided
            const processedModules = modules?.map(module => ({
                name: module.name,
                startDate: module.startDate,
                endDate: module.endDate,
                status: module.status || 'Not Started',
                progress: module.progress || 0,
                tasks: module.tasks?.map(task => ({
                    title: task.title,
                    description: task.description || '',
                    status: task.status || 'Pending',
                    priority: task.priority || 'Medium',
                    dueDate: task.dueDate
                })) || []
            })) || [];            // Calculate initial progress based on module progress
            const initialProgress = processedModules.length > 0
                ? processedModules.reduce((acc, module) => acc + (module.progress || 0), 0) / processedModules.length
                : 0;

            console.log('type of initialProgress:', typeof initialProgress);
            console.log('type of processedModules.progress:', typeof processedModules[0]?.progress);            const newProject = new Project({
                title,
                description: description || '',
                startDate,
                deadline,
                status: status || 'Planning',
                priority: priority || 'Medium',
                modules: processedModules,
                progress: initialProgress,
                notes: notes || '',
            });

            await newProject.save();
            return NextResponse.json(newProject, { status: 201 });
        }

        if (task === 'updateProject') {
            const { 
                projectId, 
                title, 
                description, 
                startDate, 
                deadline, 
                status, 
                modules, 
                progress, 
                notes,
                priority 
            } = data;

            if (!projectId) {
                return NextResponse.json({ 
                    error: 'Project ID is required for update' 
                }, { status: 400 });
            }

            // Process and validate modules
            const processedModules = modules?.map(module => ({
                name: module.name,
                startDate: module.startDate,
                endDate: module.endDate,
                status: module.status || 'Not Started',
                progress: module.progress || 0,
                tasks: module.tasks?.map(task => ({
                    title: task.title,
                    description: task.description || '',
                    status: task.status || 'Pending',
                    priority: task.priority || 'Medium',
                    dueDate: task.dueDate
                })) || []
            }));

            // Calculate overall project progress based on module progress
            const calculatedProgress = modules?.length 
                ? modules.reduce((acc, module) => acc + (module.progress || 0), 0) / modules.length
                : progress || 0;

            const updatedProject = await Project.findByIdAndUpdate(
                projectId,
                {
                    title,
                    description,
                    startDate,
                    deadline,
                    status,
                    priority,
                    modules: processedModules,
                    progress: calculatedProgress,
                    notes,
                },
                { new: true }
            );

            if (!updatedProject) {
                return NextResponse.json({ 
                    error: 'Project not found' 
                }, { status: 404 });
            }

            // Update performance after project update
            try {
                const { updatePerformance } = await import("@/config/updatePerformance");
                await updatePerformance('project', 'taskCompleted', { projectId });
            } catch (perfErr) {
                console.error('Failed to update performance:', perfErr);
            }

            return NextResponse.json(updatedProject);
        }
        if(task === 'updateProgress') {
            
            const project = data.updatedProject;
            const updatedProject = await Project.findByIdAndUpdate(
                project._id,
                {
                    progress: project.progress,
                    modules: project.modules
                },
                { new: true }
            );

            // Update performance after project progress update
            try {
                const { updatePerformance } = await import("@/config/updatePerformance");
                await updatePerformance('project', 'moduleCompleted', { projectId: project._id });
            } catch (perfErr) {
                console.error('Failed to update performance:', perfErr);
            }

            return NextResponse.json(updatedProject);
        }

        return NextResponse.json({ 
            error: 'Invalid task type' 
        }, { status: 400 });

    } catch (error) {
        console.error('Error processing project:', error);
        return NextResponse.json(
            { message: 'Error processing project', error: error.message },
            { status: 500 }
        );
    }
}
export async function DELETE(request) {
    try {
        await connectDB();
        const { projectId } = await request.json();

        if (!projectId) {
            return NextResponse.json({ 
                error: 'Project ID is required' 
            }, { status: 400 });
        }

        const deletedProject = await Project.findByIdAndDelete(projectId);

        if (!deletedProject) {
            return NextResponse.json({ 
                error: 'Project not found' 
            }, { status: 404 });
        }

        return NextResponse.json({ 
            message: 'Project deleted successfully' 
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { message: 'Error deleting project', error: error.message },
            { status: 500 }
        );
    }
}
