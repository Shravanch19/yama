import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import BasicInput from '@/models/basicInput';

function startOfDay(date) {
    return new Date(date.setHours(0, 0, 0, 0));
}

function endOfDay(date) {
    return new Date(date.setHours(23, 59, 59, 999));
}

export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();
        
        // Convert time strings to minutes
        const convertTimeToMinutes = (timeStr) => {
            if (!timeStr) return null;
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + (minutes || 0);
        };

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
            return NextResponse.json(
                { error: 'You have already submitted inputs for today' },
                { status: 400 }
            );
        }

        const basicInput = await BasicInput.create(formattedData);
        return NextResponse.json(basicInput, { status: 201 });
    } catch (error) {
        console.error('Error in basic-inputs POST:', error);
        return NextResponse.json(
            { error: 'Failed to save basic inputs' },
            { status: 500 }
        );
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

        // Convert minutes back to time format for the frontend
        const formatMinutesToTime = (minutes) => {
            if (minutes === null) return '';
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        };

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

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in basic-inputs GET:', error);
        return NextResponse.json(
            { error: 'Failed to fetch basic inputs' },
            { status: 500 }
        );
    }
}
