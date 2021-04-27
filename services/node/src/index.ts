/// <reference path="../types/index.d.ts" />

import express from 'express';
import { Handler } from './handler';
import mongoose from 'mongoose';

mongoose.connect('mongodb://root:example@mongo:27017/qutex?authSource=admin', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    console.log(err ? err : 'Connected to database successfully.');
});

const APP = express();
APP.use(express.json());

const HOST = '0.0.0.0';
const PORT = 3000;
const HANDLER = new Handler();

APP.post('/', (request: express.Request, response: express.Response) => {
    HANDLER.handle(request);
    response.send('OK');
});

APP.listen(PORT, HOST, () => {
    if (process.env.NODE_ENV === 'production') {
        console.log('#########################################');
        console.log('# Server is running in PRODUCTION mode. #');
        console.log('#########################################');
    } else {
        console.log('Server is running in DEVELOPMENT mode.');
    }
    console.log(`server is listening on http://${HOST}:${PORT}`);
});