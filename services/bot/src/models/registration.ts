/**
 * @file The mongoose model file for handling registrations.
 * @author Ava Thorn
 */
import mongoose from 'mongoose';

/**
 * This interface is used to type-enforce the input to the mongo models for registrations.
 *
 * @augments mongoose.Model<RegistrationDocument>
 * @see RegistrationDocument
 * @see mongoose.Model
 */
interface RegistrationModelInterface extends mongoose.Model<RegistrationDocument> {
    build: (attr: IRegistration) => RegistrationDocument;
}

/**
 * This is the mongo document for registrations.
 *
 * @see IRegistration
 * @see mognoose.Document
 */
export interface RegistrationDocument extends mongoose.Document {
    destination: Destination;
    projectName: string;
}

const SCHEMA = new mongoose.Schema({
    destination: { type: Object, required: true },
    projectName: { type: String, required: true }
});

/**
 * This build function creates a mongo document for a target registration.
 *
 * @param attr - The registration to store in mongo.
 * @returns The created registration document.
 * @see RegistrationDocument
 */
SCHEMA.statics.build = (attr: IRegistration): RegistrationDocument => {
    return new REGISTRATION_MODEL(attr); //eslint-disable-line @typescript-eslint/no-use-before-define
};
export const REGISTRATION_MODEL = mongoose.model<RegistrationDocument, RegistrationModelInterface>('Registration', SCHEMA);
