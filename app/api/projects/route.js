import { NextResponse } from 'next/server';
import { Project } from '@/models/data';
import connectDB from "@/config/db";

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        const newProject = new Project({
            title: body.title,
            description: body.description,
            startDate: body.startDate,
            deadline: body.deadline,
            status: body.status || 'Planning',
            progress: 0,
            modules: body.moduleKey.map(module => ({
                name: module,
                status: 'Not Started',
                progress: 0,
                tasks: [{
                    title: `${module} Task`,
                    description: `${module} phase of the project`,
                    status: 'Pending',
                    priority: 'Medium'
                }]
            })),
            team: body.team || [],
            tags: body.tags || []
        });

        await newProject.save();
        
        return NextResponse.json(
            { message: 'Project created successfully', project: newProject },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Error creating project', error: error.message },
            { status: 500 }
        );
    }
}


export async function GET(request) {
    try {
        await connectDB();
        // Get the URL instance from the request
        // const { searchParams } = new URL(request.url);
        // const id = searchParams.get('id');

        // if (id) {
        //     // If ID is provided, fetch specific project
        //     const project = await Project.Project.findById(id);
            
        //     if (!project) {
        //         return NextResponse.json(
        //             { message: 'Project not found' },
        //             { status: 404 }
        //         );
        //     }

        //     return NextResponse.json(project);
        // }

        // If no ID, fetch all projects with sorting by createdAt in descending order
        const projects = await Project.find({}).sort({ createdAt: -1 });
        // Ensure we have an array of projects
        if (!projects || projects.length === 0) {
            return NextResponse.json([], { status: 404 });
        }

        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json(
            { message: 'Error fetching projects', error: error.message },
            { status: 500 }
        );
    }
}


