/**
 * @file The mongoose model file for handling initiatives.
 * @author Ava Thorn
 */
import mongoose from 'mongoose';

/**
 * This interface is used to type-enforce the input to the mongo models for initiatives.
 *
 * @augments mongoose.Model<InitiativeDocument>
 * @see InitiativeDocument
 * @see mongoose.Model
 */
interface InitiativeModelInterface extends mongoose.Model<InitiativeDocument> {
    build: (attr: IInitiative) => InitiativeDocument;
}

/**
 * This is the mongo document for initiatives.
 *
 * @see IInitiative
 * @see mognoose.Document
 */
export interface InitiativeDocument extends mongoose.Document {
    destination: Destination;
    projectName: string;
}

const SCHEMA = new mongoose.Schema({
    rawCommand: { type: String, required: true },
    destination: {
        type: {
            roomId: String,
            toPersonId: String,
            toPersonEmail: String
        }, required: true
    },
    user: { type: { id: String, displayName: String }, required: true },
    action: { type: Object },
    data: { type: Object, required: true },
    debug: { type: Boolean, required: true },
    mentions: { type: [String], required: true },
    time: { type: Date, required: true }
});

/**
 * This build function creates a mongo document for a target initiative.
 *
 * @param attr - The initiative to store in mongo.
 * @returns The created initiative document.
 * @see InitiativeDocument
 */
SCHEMA.statics.build = (attr: IInitiative): InitiativeDocument => {
    return new INITIATIVE_MODEL(attr); //eslint-disable-line @typescript-eslint/no-use-before-define
};
export const INITIATIVE_MODEL = mongoose.model<InitiativeDocument, InitiativeModelInterface>('Initiative', SCHEMA);
