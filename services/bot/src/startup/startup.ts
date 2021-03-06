/**
 * @file Registers the webhooks for the bot with the ngrok process \
 * that is assumed to be running on the host machine.
 * @author Ava Thorn
 */
/// <reference path="../../types/index.d.ts" />

import axios, { AxiosResponse } from 'axios';
import Webex from 'webex';
import { LOGGER } from '../logger';

const WEBEX = new Webex({ credentials: process.env.WEBEX_ACCESS_TOKEN });

const RETRY_COUNT = 5;
const SUCCESS_CODE = 200;

/**
 * Enums for protocols.
 */
enum Protocols {
    HTTP = 'http',
    HTTPS = 'https'
}

/**
 * Interface for the ngrok tunnel.
 */
interface Tunnel {
    /* URL to the started tunnel */
    proto: Protocols;
}
/**
 * Gets the url from the ngrok process.
 *
 * @param retries - Number of times to retry to get the url. It can fail in
 * various situations such as for network issues or slowness within ngrok.
 * @returns URL that ngrok has exposed for the target port on the host.
 */
async function getUrl (retries: number): Promise<string> {
    return axios.get('http://127.0.0.1:4040/api/tunnels').then((response: AxiosResponse) => {
        if (response.status !== SUCCESS_CODE) {
            LOGGER.error(response.statusText);
            if (retries > 0) {
                return getUrl(retries - 1);
            } else {
                return null;
            }
        } else {
            return response.data.tunnels.filter((i: Tunnel) => i.proto === 'http')[0].public_url;
        }
    });
}

getUrl(RETRY_COUNT).then((url: string) => {
    LOGGER.info(`Creating webhook on: ${url}`);
    WEBEX.webhooks.list({ max: 10 }).then((hooks: IWebhook[]): void => {
        const promises = [];
        LOGGER.info('Deleting hooks...');
        for (const hook of hooks) {
            LOGGER.info(`Removing hook: ${hook.id}`);
            promises.push(WEBEX.webhooks.remove({ id: hook.id }));
        }
        LOGGER.info('Deleted hooks');
        WEBEX.people.get('me').then((data: IWebexPerson) => {
            LOGGER.info(`Me: ${JSON.stringify(data.emails, null, 2)}`);
        });
        
        Promise.all(promises).then(() => {
            LOGGER.info('Creating hooks...');
            WEBEX.webhooks.create({ targetUrl: url, name: url, resource: 'messages', event: 'created' }).then((data: IWebhook) => {
                LOGGER.info(`Created messages hook: ${JSON.stringify(data.targetUrl, null, 2)}`);
                WEBEX.webhooks.create({ targetUrl: url, name: url, resource: 'attachmentActions', event: 'created' }).then((_data: IWebhook) => {
                    LOGGER.info(`Created attachmentActions hook: ${JSON.stringify(_data.targetUrl, null, 2)}`);
                    LOGGER.info('Success');
                });
            });
        });
    });

});
