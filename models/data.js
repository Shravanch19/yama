import mongoose from 'mongoose';
const { Schema, models, model } = mongoose;

// Project Schema
const projectSchema = new Schema({
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
        type: Number,
        default: 0,
        min: 0,
        max: 100
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
            type: Number,
            default: 0,
            min: 0,
            max: 100
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
    team: [{
        name: {
            type: String,
            required: true
        },
        role: String,
        email: String
    }],
    tags: [{
        type: String,
        trim: true
    }],
    notes: String,
    attachments: [{
        name: String,
        url: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }],
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

// Pre-save middleware to update progress based on modules
projectSchema.pre('save', function(next) {
    if (this.modules && this.modules.length > 0) {
        const totalModules = this.modules.length;
        const completedModules = this.modules.filter(m => m.status === 'Completed').length;
        const inProgressModules = this.modules.filter(m => m.status === 'In Progress').length;
        
        this.progress = Math.round((completedModules + (inProgressModules * 0.5)) / totalModules * 100);
    }
    next();
});

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



// Create models
const Project = models.Project || model('Project', projectSchema);
const Learning = models.Learning || model('Learning', learningSchema);

export { Project, Learning };
