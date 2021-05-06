import ngrok from 'ngrok';
import { LOGGER } from '../logger';

// Make sure to set the region per this webex issue:
// https://developer.webex.com/blog/webhook-delivery-issues-with-ngrok
ngrok.connect({ addr: 3000, region: 'eu' }).then(function (url: string): void {
    LOGGER.info(`URL is: ${url}`);
});