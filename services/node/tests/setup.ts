import mongoose from 'mongoose';

beforeAll(() => {

    /*
      If the mongoose connection is closed, 
      start it up using the test url and database name
      provided by the node runtime ENV
    */
    mongoose.connect('mongodb://root:example@localhost:27017/qutex?authSource=admin', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterEach(() => {
    /*
      Define clearDB function that will loop through all 
      the collections in our mongoose connection and drop them.
    */
    for (const i in mongoose.connection.collections) {
        mongoose.connection.collections[i].deleteMany(() => { }); // eslint-disable-line
    }
});

afterAll(done => {
    for (const i in mongoose.connection.collections) {
        mongoose.connection.collections[i].drop(() => { }); //eslint-disable-line
    }

    mongoose.disconnect();
    return done();
});