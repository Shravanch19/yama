// --- Imports ---
import { NextResponse } from 'next/server';
import { Project } from '@/models/data';
import connectDB from '@/config/db';
import { errorResponse, successResponse } from '../utils';

// --- Utility Functions ---
const validateFields = (fields, data) => {
    for (const field of fields) {
        if (data[field] === undefined || data[field] === null) {
            throw new Error(`${field} is required`);
        }
    }
};

const processModules = (modules = []) =>
    modules.map(module => ({
        name: module.name,
        startDate: module.startDate,
        endDate: module.endDate,
        status: module.status || 'Not Started',
        progress: module.progress || 0,
        tasks: (module.tasks || []).map(task => ({
            title: task.title,
            description: task.description || '',
            status: task.status || 'Pending',
            priority: task.priority || 'Medium',
            dueDate: task.dueDate
        }))
    }));

const calculateProgress = (modules = [], fallback = 0) =>
    modules.length > 0
        ? modules.reduce((acc, module) => acc + (module.progress || 0), 0) / modules.length
        : fallback;

// --- Task Handlers ---
const taskHandlers = {
    async addProject(data) {
        validateFields(['title', 'startDate', 'deadline'], data);
        const { title, description, startDate, deadline, status, modules, notes, priority } = data;
        const processedModules = processModules(modules);
        const initialProgress = calculateProgress(processedModules);
        const newProject = new Project({
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
        return NextResponse.json(successResponse(newProject, 201).json, { status: 201 });
    },
    async updateProject(data) {
        validateFields(['projectId'], data);
        const { projectId, title, description, startDate, deadline, status, modules, progress, notes, priority } = data;
        const processedModules = processModules(modules);
        const calculatedProgress = calculateProgress(processedModules, progress || 0);
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
            return NextResponse.json(errorResponse('Project not found', 404).json, { status: 404 });
        }
        // Update performance after project update
        try {
            const { updatePerformance } = await import('@/config/updatePerformance');
            await updatePerformance('project', 'taskCompleted', { projectId });
        } catch (perfErr) {
            console.error('Failed to update performance:', perfErr);
        }
        return NextResponse.json(successResponse(updatedProject).json);
    },
    async updateProgress(data) {
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
            const { updatePerformance } = await import('@/config/updatePerformance');
            await updatePerformance('project', 'moduleCompleted', { projectId: project._id });
        } catch (perfErr) {
            console.error('Failed to update performance:', perfErr);
        }
        return NextResponse.json(successResponse(updatedProject).json);
    }
};

// --- API Route Handlers ---
export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (id) {
            const project = await Project.findById(id).lean();
            if (!project) {
                return NextResponse.json(errorResponse('Project not found', 404).json, { status: 404 });
            }
            // Add derived fields for single project
            const today = new Date();
            const deadlineDate = new Date(project.deadline);
            const daysRemaining = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
            const currentModule = (project.modules || []).find(m => m.status !== 'Completed') || (project.modules || [])[0];
            return NextResponse.json(successResponse({
                ...project,
                daysRemaining,
                currentModule,
            }).json);
        }
        const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
        // Add derived fields for each project
        const today = new Date();
        const processed = projects.map(project => {
            const deadlineDate = new Date(project.deadline);
            const daysRemaining = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
            const currentModule = (project.modules || []).find(m => m.status !== 'Completed') || (project.modules || [])[0];
            return {
                ...project,
                daysRemaining,
                currentModule,
            };
        });
        return NextResponse.json(successResponse(processed).json);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(errorResponse('Error fetching projects', 500).json, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();
        const { task } = data;
        if (!taskHandlers[task]) {
            return NextResponse.json(errorResponse('Invalid or missing task type', 400).json, { status: 400 });
        }
        return await taskHandlers[task](data);
    } catch (error) {
        console.error('Error processing project:', error);
        return NextResponse.json(errorResponse(error.message || 'Error processing project', 500).json, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await connectDB();
        const { projectId } = await request.json();
        if (!projectId) {
            return NextResponse.json(errorResponse('Project ID is required', 400).json, { status: 400 });
        }
        const deletedProject = await Project.findByIdAndDelete(projectId);
        if (!deletedProject) {
            return NextResponse.json(errorResponse('Project not found', 404).json, { status: 404 });
        }
        return NextResponse.json(successResponse({ message: 'Project deleted successfully' }).json, { status: 200 });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(errorResponse('Error deleting project', 500).json, { status: 500 });
    }
}
