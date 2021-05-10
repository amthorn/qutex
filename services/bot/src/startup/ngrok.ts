/**
 * @file This file starts ngrok on port 3000. It is used mainly for development. You can run this
 * with yarn start:dev-bot or yarn start:ngrok.
 * @author Ava Thorn
 */
import ngrok from 'ngrok';
import { LOGGER } from '../logger';

// Make sure to set the region per this webex issue:
// https://developer.webex.com/blog/webhook-delivery-issues-with-ngrok
ngrok.connect({ addr: 3000, region: 'eu' }).then(function (url: string): void {
    LOGGER.info(`URL is: ${url}`);
});