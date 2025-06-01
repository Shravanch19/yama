import mongoose from 'mongoose';

// Learning Schema
const learningSchema = new mongoose.Schema({
    title: { type: String, required: true },
    NoOfChapters: { type: Number, required: true, min: 1 },
    ChaptersName: {
        type: [String],
        required: true,
        validate: {
            validator: v => v.length > 0,
            message: 'ChaptersName cannot be empty',
        },
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started',
    },
    notes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Learning || mongoose.model('Learning', learningSchema);
