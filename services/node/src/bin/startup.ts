/// <reference path="../../types/index.d.ts" />

import axios, { AxiosResponse } from 'axios';
import Webex from 'webex';

const WEBEX = new Webex({
    credentials: process.env.WEBEX_ACCESS_TOKEN
});

const RETRY_COUNT = 5;
const SUCCESS_CODE = 200;
declare enum Protocols {
    HTTP = 'http',
    HTTPS = 'https'
}

declare interface Tunnel {
    /* URL to the started tunnel */
    proto: Protocols;
}

async function getUrl (retries: number): Promise<string> {
    return axios.get('http://127.0.0.1:4040/api/tunnels').then((response: AxiosResponse) => {
        if (response.status !== SUCCESS_CODE) {
            console.error(response.statusText);
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
    console.log(`Creating webhook on: ${url}`);
    WEBEX.webhooks.list({ max: 10 }).then((hooks: Webhook[]): void => {
        const promises = [];
        for (const hook of hooks) {
            promises.push(WEBEX.webhooks.remove({ id: hook.id }));
        }

        Promise.all(promises).then(() => {
            WEBEX.webhooks.create({ targetUrl: url, name: url, resource: 'messages', event: 'created' }).then(() => {
                WEBEX.webhooks.create({ targetUrl: url, name: url, resource: 'attachmentActions', event: 'created' }).then(() => {
                    console.log('Success');
                });
            });
        });
    });

});
