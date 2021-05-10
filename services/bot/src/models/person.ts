/**
 * @file The mongoose model file for handling Qutex People.
 * @author Ava Thorn
 */

import mongoose from 'mongoose';

/**
 * This is the mongo document for people.
 *
 * @augments mongoose.Model<PersonDocument>
 * @see PersonDocument
 * @see mongoose.Model
 */
interface PersonModelInterface extends mongoose.Model<PersonDocument> {
    build: (attr: IPerson) => PersonDocument;
}

/**
 * This is the mongo document for person.
 *
 * @see PersonDocument
 * @see mongoose.Document
 */
export interface PersonDocument extends mongoose.Document {
    id: Uuid;
    displayName: string;
    atHeadSeconds: number;
    atHeadCount: number;
    inQueueSeconds: number;
    inQueueCount: number;
}

export const SCHEMA = new mongoose.Schema({
    id: { type: String, required: true },
    displayName: { type: String, required: true },
    atHeadSeconds: { type: Number, required: true },
    atHeadCount: { type: Number, required: true },
    inQueueSeconds: { type: Number, required: true },
    inQueueCount: { type: Number, required: true }
});

/**
 * This build function creates a mongo document for a target person.
 *
 * @param attr - The person to store in mongo.
 * @returns The created person document.
 * @see PersonDocument
 */
SCHEMA.statics.build = (attr: IPerson): PersonDocument => {
    return new PERSON_MODEL(attr); //eslint-disable-line @typescript-eslint/no-use-before-define
};
export const PERSON_MODEL = mongoose.model<PersonDocument, PersonModelInterface>('Person', SCHEMA);
