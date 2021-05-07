import { createLogger, format, transports } from 'winston';

let level = 'verbose';

if (process.env.NODE_ENV === 'production') {
    level = 'info';
} else if (process.env.QUTEX_TESTING && process.argv.indexOf('--silent') <= 0) {
    level = 'warn';
}
export const LOGGER = createLogger({
    level: level,
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
LOGGER.info(`LOG LEVEL: ${level}`);