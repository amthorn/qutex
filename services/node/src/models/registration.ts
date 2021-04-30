import mongoose from 'mongoose';

interface RegistrationModelInterface extends mongoose.Model<RegistrationDocument> {
    build: (attr: IRegistration) => RegistrationDocument;
}

export interface RegistrationDocument extends mongoose.Document {
    destination: Destination;
    projectName: string;
}

const SCHEMA = new mongoose.Schema({
    destination: { type: Object, required: true },
    projectName: { type: String, required: true }
});
SCHEMA.statics.build = (attr: IRegistration): RegistrationDocument => {
    return new REGISTRATION_MODEL(attr); //eslint-disable-line @typescript-eslint/no-use-before-define
};
export const REGISTRATION_MODEL = mongoose.model<RegistrationDocument, RegistrationModelInterface>('Registration', SCHEMA);
