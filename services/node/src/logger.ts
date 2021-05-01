import { createLogger, format, transports } from 'winston';
export const LOGGER = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : (process.argv.indexOf('--silent') >= 0 ? 'silent' : 'debug'),
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