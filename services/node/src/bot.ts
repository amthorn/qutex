import Webex from 'webex';
export const BOT = new Webex({
    credentials: process.env.WEBEX_ACCESS_TOKEN,
    logger: {
        level: 'debug'
    }
});