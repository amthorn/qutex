import Webex from 'webex';
import { GET } from './secrets';

export const BOT = new Webex({ credentials: GET('token') });