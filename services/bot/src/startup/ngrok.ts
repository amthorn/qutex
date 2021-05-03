import ngrok from 'ngrok';
import { LOGGER } from '../logger';
ngrok.connect({ addr: 3000 }).then(function (url: string): void {
    LOGGER.info(`URL is: ${url}`);
});