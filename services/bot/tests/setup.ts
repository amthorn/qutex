/**
 * @file The setup file for the jest tests. This handles global setup and teardown.
 * @author Ava Thorn
 */
import mongoose from 'mongoose';
import { GET } from '../src/secrets';
import { SUPER_ADMIN, STRICT_DATE } from './util';
import MockDate from 'mockdate';

// Mock ENV vars
process.env.VERSION = '99.99.99';
process.env.RELEASE_DATE = 'Today';
process.env.AUTHOR_NAME = 'My Author Name';
process.env.AUTHOR_EMAIL = 'email@email.email';
process.env.SUPER_ADMINS = `["${SUPER_ADMIN.id}"]`;
process.env.DEBUG_EMAIL = `debugemailfoo@debug.email`;

beforeAll(async () => {

    /*
      If the mongoose connection is closed, 
      start it up using the test url and database name
      provided by the node runtime ENV
    */

    await mongoose.connect(`mongodb://root:${GET('mongoPassword')}@localhost:27017/qutex?authSource=admin`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});
beforeEach(() => {
    MockDate.set(STRICT_DATE);
});
afterEach((done) => {
    /*
      Define clearDB function that will loop through all 
      the collections in our mongoose connection and drop them.
    */
    for (const i in mongoose.connection.collections) {
        mongoose.connection.collections[i].deleteMany(() => {
            done();
        }); // eslint-disable-line
    }
    MockDate.reset();
});

afterAll(done => {
    for (const i in mongoose.connection.collections) {
        mongoose.connection.collections[i].drop(() => { }); //eslint-disable-line
    }

    mongoose.disconnect();
    return done();
});