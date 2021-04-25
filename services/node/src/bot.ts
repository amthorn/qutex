import Webex from 'webex';

export class Bot {
    public static bot = new Webex({ credentials: process.env.WEBEX_ACCESS_TOKEN });
}