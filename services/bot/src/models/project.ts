/**
 * @file The mongoose model file for handling Qutex Projects.
 * @author Ava Thorn
 */
import { Document } from './index';

/**
 * This is the mongo document for projects.
 *
 * @see IProject
 * @see Document
 */
export class ProjectDocument extends Document {
    private TABLE_NAME = 'qutex_staging_project';
    public async get (name: string): Promise<Object> {
        return Document.get(this.TABLE_NAME, { name: name });
    }
    public async scan (query: Object): Promise<Object> {
        return Document.scan(this.TABLE_NAME, query);
    }
}
