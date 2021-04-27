import mongoose from 'mongoose';

interface ProjectModelInterface extends mongoose.Model<ProjectDocument> {
    build: (attr: Project) => ProjectDocument;
}

export interface ProjectDocument extends mongoose.Document {
    name: string;
}

const SCHEMA = new mongoose.Schema({
    name: { type: String, required: true }
});
SCHEMA.statics.build = (attr: Project): ProjectDocument => {
    return new PROJECT_MODEL(attr);
};
export const PROJECT_MODEL = mongoose.model<ProjectDocument, ProjectModelInterface>('Project', SCHEMA);
