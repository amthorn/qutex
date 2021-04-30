/// <reference path="../types/index.d.ts" />

import express from 'express';
import { Handler } from './handler';
import mongoose from 'mongoose';
import { createLogger, format, transports } from 'winston';
export const LOGGER = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: format.combine(
        format.colorize({ all: true }),
        format.timestamp(),
        format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
    ),
    defaultMeta: { service: 'bot-service' },
    transports: [
        /**
         *  - Write all logs with level `error` and below to `error.log`
         *  - Write all logs with level `info` and below to `combined.log`
         */
        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
    ]
});

mongoose.connect('mongodb://root:example@mongo:27017/qutex?authSource=admin', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
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