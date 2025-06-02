import connectDB from "@/config/db";
import { ObjectId } from "mongodb";
import { Learning } from "@/models/data";

export async function PUT(request, { params }) {
    try {
        const { learningId } = params;
        console.log("Learning ID:", learningId);
        const updateData = await request.json();

        await connectDB();

        const cleanedData = {
            title: updateData.title,
            NoOfChapters: parseInt(updateData.NoOfChapters),
            ChaptersName: updateData.ChaptersName,
            status: updateData.status,
            progress: parseInt(updateData.progress),
            notes: updateData.notes || "",
            updatedAt: new Date()
        };

        const result = await Learning.updateOne(
            { _id: new ObjectId(learningId) },
            { $set: cleanedData }
        );

        console.log("Update result:", result);

        if (result.modifiedCount === 0) {
            return new Response(JSON.stringify({ error: "Learning not found or no changes made" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ message: "Learning updated successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error updating learning:", error);
        return new Response(JSON.stringify({ error: "Failed to update learning" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function GET(request, { params }) {
    try {
        const { learningId } = params;
        
        const db = await connectToDatabase();
        const collection = db.collection("learnings");

        if (!ObjectId.isValid(learningId)) {
            return new Response(JSON.stringify({ error: "Invalid learning ID" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const learning = await collection.findOne({ _id: new ObjectId(learningId) });

        if (!learning) {
            return new Response(JSON.stringify({ error: "Learning not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(learning), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error fetching learning:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch learning" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { learningId } = params;
        
        await connectDB();

        if (!ObjectId.isValid(learningId)) {
            return new Response(JSON.stringify({ error: "Invalid learning ID" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const result = await Learning.deleteOne({ _id: new ObjectId(learningId) });

        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ error: "Learning not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ message: "Learning deleted successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error deleting learning:", error);
        return new Response(JSON.stringify({ error: "Failed to delete learning" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
