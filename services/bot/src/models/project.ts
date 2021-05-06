import mongoose from 'mongoose';
import { SCHEMA as QUEUE_SCHEMA } from './queue';

interface ProjectModelInterface extends mongoose.Model<ProjectDocument> {
    build: (attr: IProject) => ProjectDocument;
}

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
SCHEMA.statics.build = (attr: IProject): ProjectDocument => {
    return new PROJECT_MODEL(attr); // eslint-disable-line @typescript-eslint/no-use-before-define
};
export const PROJECT_MODEL = mongoose.model<ProjectDocument, ProjectModelInterface>('Project', SCHEMA);
