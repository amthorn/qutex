import mongoose from 'mongoose';

interface PersonModelInterface extends mongoose.Model<PersonDocument> {
    build: (attr: IPerson) => PersonDocument;
}

export interface PersonDocument extends mongoose.Document {
    id: Uuid;
    displayName: string;
    atHeadTime: number;
}

export const SCHEMA = new mongoose.Schema({
    id: { type: String, required: true },
    displayName: { type: String, required: true },
    atHeadSeconds: { type: Number, required: true, default: 0 }
});
SCHEMA.statics.build = (attr: IPerson): PersonDocument => {
    return new PERSON_MODEL(attr); //eslint-disable-line @typescript-eslint/no-use-before-define
};
export const PERSON_MODEL = mongoose.model<PersonDocument, PersonModelInterface>('Person', SCHEMA);
