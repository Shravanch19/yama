import { updatePerformance } from "@/config/updatePerformance";
export async function POST(request) {
    try {
        await connectDB();
        const datas = await request.json();
        const { type, action, data } = req.body;

        if (!type || !action) {
            return NextResponse.json({ error: 'Missing type or action' }, { status: 400 });
        }

        const result = await updatePerformance(type, action, data);

        return NextResponse.json({
            message: `Performance updated for ${type}:${action}`,
            result
        }, { status: 201 });
    } catch (err) {
        console.error("Error updating performance:", err);
        return NextResponse.json(
            { error: 'Failed to save basic inputs' },
            { status: 500 }
        );
    }
}