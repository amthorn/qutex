import mongoose from 'mongoose';

export const SCHEMA = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    members: {
        type: [{
            person: {
                id: String,
                displayName: String
            },
            enqueuedAt: { type: Date },
            atHeadTime: { type: Date, required: false }
        }],
        required: true
    }
});