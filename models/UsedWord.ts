import mongoose, { Schema, model, models } from 'mongoose';

const UsedWordSchema = new Schema({
    citizen: {
        type: String,
        required: true,
    },
    undercover: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Prevent model recompilation error in development
const UsedWord = models.UsedWord || model('UsedWord', UsedWordSchema);

export default UsedWord;
