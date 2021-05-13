/**
 * @file The mongoose model file for queues. Queues are not their own document stored in mongo, they're stored in
 * the Qutex Projects.
 * @author Ava Thorn
 */
import mongoose from 'mongoose';

const QUEUE_HISTORY = {
    name: { type: String, required: true },
    members: {
        type: [{
            person: { id: String, displayName: String },
            enqueuedAt: { type: Date },
            atHeadTime: { type: Date, required: false }
        }],
        required: true
    },
    time: Date
};

export const SCHEMA = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    members: {
        type: [{
            person: { id: String, displayName: String },
            enqueuedAt: { type: Date },
            atHeadTime: { type: Date, required: false }
        }],
        required: true
    },
    history: { type: [QUEUE_HISTORY] }
});