/**
 * @file Responsible for the startup of the webex low-level API object.
 * @author Ava Thorn
 */
import Webex from 'webex';
import { GET } from './secrets';

export const BOT = new Webex({ credentials: GET('token') });