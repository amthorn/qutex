/**
 * @file The mongoose model file for handling Qutex Projects.
 * @author Ava Thorn
 */
import mongoose from 'mongoose';
import { SCHEMA as QUEUE_SCHEMA } from './queue';

/**
 * This interface is used to type-enforce the input to the mongo models for projects.
 *
 * @augments mongoose.Model<ProjectDocument>
 * @see ProjectDocument
 * @see mongoose.Model
 */
interface ProjectModelInterface extends mongoose.Model<ProjectDocument> {
    build: (attr: IProject) => ProjectDocument;
}

/**
 * This is the mongo document for projects.
 *
 * @see IProject
 * @see mongoose.Document
 */
export interface ProjectDocument extends mongoose.Document {
    name: string;
    currentQueue: string;
    admins: IProjectAdmin[];
    queues: IQueue[];
}

const SCHEMA = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    queues: [QUEUE_SCHEMA],
    admins: { type: [{ id: String, displayName: String }], required: true },
    currentQueue: { type: String }
});

/**
 * This build function creates a mongo document for a target project.
 *
 * @param attr - The project to store in mongo.
 * @returns The created project document.
 * @see ProjectDocument
 */
SCHEMA.statics.build = (attr: IProject): ProjectDocument => {
    return new PROJECT_MODEL(attr); // eslint-disable-line @typescript-eslint/no-use-before-define
};
export const PROJECT_MODEL = mongoose.model<ProjectDocument, ProjectModelInterface>('Project', SCHEMA);
