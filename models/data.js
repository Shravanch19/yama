import mongoose from 'mongoose';
const { Schema, models, model } = mongoose;

// Project Schema
const projectSchema = new Schema({

    // title
    // description
    // startDate
    // deadline
    // status
    // progress
    // modules [{name, status, progress, startDate, endDate, tasks [{title, description, status, priority, dueDate}]}]
    // notes
    // createdAt
    // updatedAt


    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Planning', 'In Progress', 'On Hold', 'Completed'],
        default: 'Planning'
    },
    progress: {
        type: [Number],
        default: [0],
    },
    modules: [{
        name: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Not Started', 'In Progress', 'Completed'],
            default: 'Not Started'
        },
        progress: {
            type: [Number],
            default: [0],
        },
        startDate: Date,
        endDate: Date,
        tasks: [{
            title: {
                type: String,
                required: true
            },
            description: String,
            status: {
                type: String,
                enum: ['Pending', 'In Progress', 'Completed'],
                default: 'Pending'
            },
            priority: {
                type: String,
                enum: ['Low', 'Medium', 'High'],
                default: 'Medium'
            },
            dueDate: Date
        }]
    }],
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // This will automatically handle createdAt and updatedAt
});

const learningSchema = new Schema({
    title: { type: String, required: true },
    NoOfChapters: { type: Number, required: true, min: 1 },
    ChaptersName: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v.length === this.NoOfChapters;
            },
            message: 'ChaptersName length must match NoOfChapters',
        },
    },
    progress: {
        type: [Number],
        required: true,
        validate: {
            validator: function (v) {
                return v.length === this.NoOfChapters && v.every(num => num >= 0);
            },
            message: 'Progress must be a non-negative array matching NoOfChapters length',
        },
        default: [],
    },
    currentChapterIndex: { type: Number, default: 0, min: 0 },
    completedChapters: { type: Number, default: 0, min: 0 },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started',
    },
    notes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

learningSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Project = models.Project || model('Project', projectSchema);
const Learning = models.Learning || model('Learning', learningSchema);

export { Project, Learning };
