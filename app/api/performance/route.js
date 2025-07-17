import { updatePerformance } from "@/config/updatePerformance";
import { errorResponse, successResponse } from '../utils';
import connectDB from '@/config/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        await connectDB();
        const datas = await request.json();
        const { type, action, data } = datas;

        if (!type || !action) {
            return NextResponse.json(errorResponse('Missing type or action', 400).json, { status: 400 });
        }

        const result = await updatePerformance(type, action, data);

        return NextResponse.json(successResponse({
            message: `Performance updated for ${type}:${action}`,
            result
        }, 201).json, { status: 201 });
    } catch (err) {
        console.error("Error updating performance:", err);
        return NextResponse.json(errorResponse('Failed to save basic inputs', 500).json, { status: 500 });
    }
}