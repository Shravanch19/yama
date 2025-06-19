import mongoose from 'mongoose';

const basicInputSchema = new mongoose.Schema({
    wakeUpTime: {
        type: String,
        default: null
    },
    meditationDuration: {
        type: Number, // in minutes
        default: null
    },
    timeWastedRandomly: {
        type: Number, // in minutes
        default: null
    },
    date: {
        type: Date,
        required: true,
        unique: true, // Ensures only one entry per day
        index: true
    }
});

const BasicInput = mongoose.models.BasicInput || mongoose.model('BasicInput', basicInputSchema);

export default BasicInput;
