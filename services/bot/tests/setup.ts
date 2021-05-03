import mongoose from 'mongoose';
import { GET } from '../src/secrets';

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
});

afterAll(done => {
    for (const i in mongoose.connection.collections) {
        mongoose.connection.collections[i].drop(() => { }); //eslint-disable-line
    }

    mongoose.disconnect();
    return done();
});