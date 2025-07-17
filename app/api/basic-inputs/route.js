import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import BasicInput from '@/models/basicInput';
import { startOfDay, endOfDay, convertTimeToMinutes, formatMinutesToTime, errorResponse, successResponse } from '../utils';

export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();

        // Format the data
        const today = new Date();
        const formattedData = {
            date: startOfDay(today),
            wakeUpTime: data.wakeUpTime || null,
            meditationDuration: convertTimeToMinutes(data.meditationDuration),
            timeWastedRandomly: convertTimeToMinutes(data.timeWastedRandomly)
        };

        // Check if an entry already exists for today
        const existingEntry = await BasicInput.findOne({
            date: {
                $gte: startOfDay(today),
                $lte: endOfDay(today)
            }
        });

        if (existingEntry) {
            return NextResponse.json(errorResponse('You have already submitted inputs for today', 400).json, { status: 400 });
        }

        const basicInput = await BasicInput.create(formattedData);

        // Update performance after daily input submission
        try {
            const { updatePerformance } = await import("@/config/updatePerformance");
            if (data.wakeUpTime) await updatePerformance('dailyInput', 'wokeUpEarly');
            if (data.meditationDuration) await updatePerformance('dailyInput', 'meditated');
            if (data.timeWastedRandomly) await updatePerformance('dailyInput', 'wastedTime', { minutes: data.timeWastedRandomly });
        } catch (perfErr) {
            console.error('Failed to update performance:', perfErr);
        }

        return NextResponse.json(successResponse(basicInput, 201).json, { status: 201 });
    } catch (error) {
        console.error('Error in basic-inputs POST:', error);
        return NextResponse.json(errorResponse('Failed to save basic inputs', 500).json, { status: 500 });
    }
}

export async function GET(request) {
    try {
        await connectDB();
        // Get the date from query params or use today
        const searchParams = new URL(request.url).searchParams;
        const dateParam = searchParams.get('date');
        const queryDate = dateParam ? new Date(dateParam) : new Date();

        const entry = await BasicInput.findOne({
            date: {
                $gte: startOfDay(queryDate),
                $lte: endOfDay(queryDate)
            }
        });

        const response = entry ? {
            ...entry.toObject(),
            meditationDuration: formatMinutesToTime(entry.meditationDuration),
            timeWastedRandomly: formatMinutesToTime(entry.timeWastedRandomly)
        } : {
            wakeUpTime: '',
            meditationDuration: '',
            timeWastedRandomly: '',
            date: startOfDay(queryDate)
        };

        return NextResponse.json(successResponse(response).json);
    } catch (error) {
        console.error('Error in basic-inputs GET:', error);
        return NextResponse.json(errorResponse('Failed to fetch basic inputs', 500).json, { status: 500 });
    }
}
